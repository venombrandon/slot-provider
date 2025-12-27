"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.demoSpin = demoSpin;
exports.demoBuy = demoBuy;
const _loadSlot_1 = require("../../cli/_loadSlot"); // nutzt dein bestehendes loader pattern
const seed_1 = require("../../engine/fair/seed");
const playRound_1 = require("../../engine/modes/playRound");
const playBonusBuy_1 = require("../../engine/modes/playBonusBuy");
const memoryStore_1 = require("../store/memoryStore");
const sessionService_1 = require("./sessionService");
const demoWalletService_1 = require("./demoWalletService");
const validateBet_1 = require("../../engine/bet/validateBet");
function loadSlotById(slotId) {
    // Du hast schon loadSlotFromArg(), fürs API ist besser ein eigener Loader:
    // Quick hack für lokal: wir faken argv.
    const prev = process.argv.slice();
    try {
        process.argv[2] = slotId;
        return (0, _loadSlot_1.loadSlotFromArg)();
    }
    finally {
        process.argv = prev;
    }
}
function demoSpin(params) {
    // 1) idempotency
    const roundKey = `${params.sessionId}:${params.roundId}`;
    const existing = memoryStore_1.store.rounds.get(roundKey);
    if (existing)
        return existing.responseJson;
    (0, validateBet_1.validateBetSize)(params.betCents);
    const config = loadSlotById(params.slotId);
    const costMult = params.mode === "extraBet" ? config.rules.extraBet?.costMultiplier ?? 3 : 1;
    const costCents = params.betCents * costMult;
    const session = (0, sessionService_1.getSession)(params.sessionId);
    if (session.mode !== "demo")
        throw new Error("INVALID_SESSION_MODE");
    const balanceBefore = (0, demoWalletService_1.getDemoBalance)(params.playerId);
    (0, demoWalletService_1.debitDemo)(params.playerId, costCents);
    const context = `spin:${params.mode}`;
    const nonceUsed = session.nonce; // before increment happens inside rngForNextRound
    const derived = (0, seed_1.rngForNextRound)(session, { context }); // increments session.nonce internally
    const rr = (0, playRound_1.playRoundBase)(config, derived.rng, params.mode);
    const payoutCents = Math.round(rr.totalWinX * params.betCents);
    if (payoutCents > 0)
        (0, demoWalletService_1.creditDemo)(params.playerId, payoutCents);
    const balanceAfter = (0, demoWalletService_1.getDemoBalance)(params.playerId);
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
    const stored = {
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
    memoryStore_1.store.rounds.set(roundKey, stored);
    return responseJson;
}
function demoBuy(params) {
    const roundKey = `${params.sessionId}:${params.roundId}`;
    const existing = memoryStore_1.store.rounds.get(roundKey);
    if (existing)
        return existing.responseJson;
    (0, validateBet_1.validateBetSize)(params.betCents);
    const config = loadSlotById(params.slotId);
    const session = (0, sessionService_1.getSession)(params.sessionId);
    if (session.mode !== "demo")
        throw new Error("INVALID_SESSION_MODE");
    const costX = params.buyType === "bonus3"
        ? config.rules.bonusBuy?.bonus3CostX ?? 100
        : config.rules.bonusBuy?.bonus4CostX ?? 250;
    const costCents = params.betCents * costX;
    const balanceBefore = (0, demoWalletService_1.getDemoBalance)(params.playerId);
    (0, demoWalletService_1.debitDemo)(params.playerId, costCents);
    const context = `buy:${params.buyType}`;
    const nonceUsed = session.nonce;
    const derived = (0, seed_1.rngForNextRound)(session, { context });
    const br = (0, playBonusBuy_1.playBonusBuy)(config, derived.rng, params.buyType);
    // br.winX ist xBet
    const payoutCents = Math.round(br.winX * params.betCents);
    if (payoutCents > 0)
        (0, demoWalletService_1.creditDemo)(params.playerId, payoutCents);
    const balanceAfter = (0, demoWalletService_1.getDemoBalance)(params.playerId);
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
    const stored = {
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
    memoryStore_1.store.rounds.set(roundKey, stored);
    return responseJson;
}
