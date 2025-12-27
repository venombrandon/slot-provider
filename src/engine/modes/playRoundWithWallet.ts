import { RNG } from "../rng/rng";
import { SlotConfig } from "../types";
import { Wallet } from "../wallet/wallet";
import { calcSpinCost, RoundMode } from "../bet/calcCost";
import { playRoundBase } from "./playRound";
import { validateBetSize } from "../bet/validateBet";

export interface PlayRoundRequest {
  playerId: string;
  roundId: string; // unique!
  baseBet: number; // smallest unit
  mode: RoundMode; // "base" | "extraBet"
}

export interface PlayRoundResponse {
  balanceBefore: number;
  balanceAfter: number;
  cost: number;
  result: ReturnType<typeof playRoundBase>;
}

export async function playRoundWithWallet(
  config: SlotConfig,
  rng: RNG,
  wallet: Wallet,
  req: PlayRoundRequest
): Promise<PlayRoundResponse> {
  validateBetSize(req.baseBet);
  const cost = calcSpinCost(config, req.baseBet, req.mode);

  const balanceBefore = await wallet.getBalance(req.playerId);
  if (balanceBefore < cost) throw new Error("INSUFFICIENT_BALANCE");

  await wallet.debit(req.playerId, cost, req.roundId);

  // Engine returns winX in "xBet" -> du musst hier sauber in payout umrechnen.
  // Wenn playRoundBase schon in xBet arbeitet, payout = winX * baseBet.
  const result = playRoundBase(config, rng, req.mode);

  const payout = Math.round(result.totalWinX * req.baseBet);

  if (payout > 0) {
    await wallet.credit(req.playerId, payout, req.roundId);
  }

  const balanceAfter = await wallet.getBalance(req.playerId);

  return { balanceBefore, balanceAfter, cost, result };
}
