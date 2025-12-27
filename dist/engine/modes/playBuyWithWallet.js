"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playBuyWithWallet = playBuyWithWallet;
const calcCost_1 = require("../bet/calcCost");
const playBonusBuy_1 = require("./playBonusBuy");
const validateBet_1 = require("../bet/validateBet");
async function playBuyWithWallet(config, rng, wallet, req) {
    (0, validateBet_1.validateBetSize)(req.baseBet);
    const cost = (0, calcCost_1.calcBuyCost)(config, req.baseBet, req.buyType);
    const balanceBefore = await wallet.getBalance(req.playerId);
    if (balanceBefore < cost)
        throw new Error("INSUFFICIENT_BALANCE");
    await wallet.debit(req.playerId, cost, req.roundId);
    const r = (0, playBonusBuy_1.playBonusBuy)(config, rng, req.buyType);
    const payout = Math.round(r.winX * req.baseBet);
    if (payout > 0)
        await wallet.credit(req.playerId, payout, req.roundId);
    const balanceAfter = await wallet.getBalance(req.playerId);
    return {
        balanceBefore,
        balanceAfter,
        cost,
        buy: r,
        payout,
    };
}
