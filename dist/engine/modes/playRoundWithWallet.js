"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playRoundWithWallet = playRoundWithWallet;
const calcCost_1 = require("../bet/calcCost");
const playRound_1 = require("./playRound");
const validateBet_1 = require("../bet/validateBet");
async function playRoundWithWallet(config, rng, wallet, req) {
    (0, validateBet_1.validateBetSize)(req.baseBet);
    const cost = (0, calcCost_1.calcSpinCost)(config, req.baseBet, req.mode);
    const balanceBefore = await wallet.getBalance(req.playerId);
    if (balanceBefore < cost)
        throw new Error("INSUFFICIENT_BALANCE");
    await wallet.debit(req.playerId, cost, req.roundId);
    // Engine returns winX in "xBet" -> du musst hier sauber in payout umrechnen.
    // Wenn playRoundBase schon in xBet arbeitet, payout = winX * baseBet.
    const result = (0, playRound_1.playRoundBase)(config, rng, req.mode);
    const payout = Math.round(result.totalWinX * req.baseBet);
    if (payout > 0) {
        await wallet.credit(req.playerId, payout, req.roundId);
    }
    const balanceAfter = await wallet.getBalance(req.playerId);
    return { balanceBefore, balanceAfter, cost, result };
}
