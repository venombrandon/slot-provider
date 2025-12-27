"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slot001 = void 0;
const reels_1 = require("./reels");
const paylines_1 = require("./paylines");
const paytable_1 = require("./paytable");
const weights_1 = require("./weights");
exports.slot001 = {
    id: "slot001",
    grid: { reels: 5, rows: 5 },
    stopsPerReel: 50,
    paylines: paylines_1.paylines, // ✅ deine 19 Linien
    paytable: // ✅ deine 19 Linien
    paytable_1.paytable,
    symbols: {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
    },
    // TARGET: Bonus4 Buy RTP per cost ≈ 95% @ costX=250 (seed 1337, 100k runs ~95.17%)
    reelSets: {
        base: reels_1.baseReels,
        extraBet: reels_1.extraBetReels, // später eigenes ReelSet
        bonus3: reels_1.bonus3Reels, // später eigenes ReelSet
        bonus4: reels_1.bonus4Reels, // später eigenes ReelSet
        bonus3Buy: reels_1.bonus3BuyReels,
        bonus4Buy: reels_1.bonus4BuyReels,
    },
    weights: {
        wildMultiplier: {
            base: weights_1.wildMultBase,
            extraBet: weights_1.wildMultExtraBet,
            bonus3: weights_1.wildMultBonus3,
            bonus4: weights_1.wildMultBonus4,
            bonus3Buy: weights_1.wildMultBonus3Buy,
            bonus4Buy: weights_1.wildMultBonus4Buy,
        },
    },
    features: ["bonusTrigger"],
    rules: {
        maxWinX: 10000,
        extraBet: {
            costMultiplier: 3,
            bonus4ShareOn4Scatters: 0.18,
        },
        bonusBuy: {
            bonus3CostX: 100,
            bonus4CostX: 250,
        },
    },
};
