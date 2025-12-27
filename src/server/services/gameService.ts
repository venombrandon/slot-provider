import { loadSlotFromArg } from "../../cli/_loadSlot"; // nutzt dein bestehendes loader pattern
import { rngForNextRound } from "../../engine/fair/seed";
import { playRoundBase } from "../../engine/modes/playRound";
import {
  playBonusBuy,
  type BonusBuyType,
} from "../../engine/modes/playBonusBuy";
import { store, type StoredRound } from "../store/memoryStore";
import { getSession } from "./sessionService";
import { getDemoBalance, debitDemo, creditDemo } from "./demoWalletService";
import { validateBetSize } from "../../engine/bet/validateBet";

function loadSlotById(slotId: string) {
  // Du hast schon loadSlotFromArg(), fürs API ist besser ein eigener Loader:
  // Quick hack für lokal: wir faken argv.
  const prev = process.argv.slice();
  try {
    process.argv[2] = slotId;
    return loadSlotFromArg();
  } finally {
    process.argv = prev;
  }
}

export function demoSpin(params: {
  playerId: string;
  sessionId: string;
  roundId: string;
  slotId: string;
  mode: "base" | "extraBet";
  betCents: number;
}) {
  // 1) idempotency
  const roundKey = `${params.sessionId}:${params.roundId}`;
  const existing = store.rounds.get(roundKey);
  if (existing) return existing.responseJson;

  validateBetSize(params.betCents);

  const config = loadSlotById(params.slotId);
  const costMult =
    params.mode === "extraBet" ? config.rules.extraBet?.costMultiplier ?? 3 : 1;

  const costCents = params.betCents * costMult;

  const session = getSession(params.sessionId);
  if (session.mode !== "demo") throw new Error("INVALID_SESSION_MODE");

  const balanceBefore = getDemoBalance(params.playerId);
  debitDemo(params.playerId, costCents);

  const context = `spin:${params.mode}`;
  const nonceUsed = session.nonce; // before increment happens inside rngForNextRound
  const derived = rngForNextRound(session, { context }); // increments session.nonce internally

  const rr = playRoundBase(config, derived.rng, params.mode);

  const payoutCents = Math.round(rr.totalWinX * params.betCents);
  if (payoutCents > 0) creditDemo(params.playerId, payoutCents);

  const balanceAfter = getDemoBalance(params.playerId);

  const responseJson = {
    slotId: params.slotId,
    mode: params.mode,
    betCents: params.betCents,
    balanceBefore,
    balanceAfter,
    costCents,
    payoutCents,
    result: rr,
    provablyFair: {
      serverSeedHash: session.serverSeedHash,
      clientSeed: session.clientSeed,
      nonceUsed,
      context,
      msg: `${session.clientSeed}:${nonceUsed}:${context}`,
      seed32: derived.seed32,
      // demo only:
      serverSeed: session.serverSeed,
    },
  };

  const stored: StoredRound = {
    roundId: params.roundId,
    playerId: params.playerId,
    sessionId: params.sessionId,
    slotId: params.slotId,
    kind: "spin",
    mode: params.mode,
    betCents: params.betCents,
    costCents,
    payoutCents,
    provablyFair: responseJson.provablyFair,
    resultJson: rr,
    responseJson,
    createdAt: Date.now(),
  };

  store.rounds.set(roundKey, stored);

  return responseJson;
}

export function demoBuy(params: {
  playerId: string;
  sessionId: string;
  roundId: string;
  slotId: string;
  buyType: BonusBuyType;
  betCents: number;
}) {
  const roundKey = `${params.sessionId}:${params.roundId}`;
  const existing = store.rounds.get(roundKey);
  if (existing) return existing.responseJson;

  validateBetSize(params.betCents);

  const config = loadSlotById(params.slotId);
  const session = getSession(params.sessionId);
  if (session.mode !== "demo") throw new Error("INVALID_SESSION_MODE");

  const costX =
    params.buyType === "bonus3"
      ? config.rules.bonusBuy?.bonus3CostX ?? 100
      : config.rules.bonusBuy?.bonus4CostX ?? 250;

  const costCents = params.betCents * costX;

  const balanceBefore = getDemoBalance(params.playerId);
  debitDemo(params.playerId, costCents);

  const context = `buy:${params.buyType}`;
  const nonceUsed = session.nonce;
  const derived = rngForNextRound(session, { context });

  const br = playBonusBuy(config, derived.rng, params.buyType);
  // br.winX ist xBet
  const payoutCents = Math.round(br.winX * params.betCents);
  if (payoutCents > 0) creditDemo(params.playerId, payoutCents);

  const balanceAfter = getDemoBalance(params.playerId);

  const responseJson = {
    slotId: params.slotId,
    buyType: params.buyType,
    betCents: params.betCents,
    balanceBefore,
    balanceAfter,
    costCents,
    payoutCents,
    result: br,
    provablyFair: {
      serverSeedHash: session.serverSeedHash,
      clientSeed: session.clientSeed,
      nonceUsed,
      context,
      msg: `${session.clientSeed}:${nonceUsed}:${context}`,
      seed32: derived.seed32,
      serverSeed: session.serverSeed,
    },
  };

  const stored: StoredRound = {
    roundId: params.roundId,
    playerId: params.playerId,
    sessionId: params.sessionId,
    slotId: params.slotId,
    kind: "buy",
    buyType: params.buyType,
    betCents: params.betCents,
    costCents,
    payoutCents,
    provablyFair: responseJson.provablyFair,
    resultJson: br,
    responseJson,
    createdAt: Date.now(),
  };

  store.rounds.set(roundKey, stored);

  return responseJson;
}
