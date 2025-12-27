"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slot002 = void 0;
const reels_1 = require("./reels");
const paylines_1 = require("./paylines");
const paytable_1 = require("./paytable");
const weights_1 = require("./weights");
exports.slot002 = {
    id: "slot002",
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
    reelSets: {
        base: reels_1.baseReels,
        extraBet: reels_1.baseReels, // später eigenes ReelSet
        bonus3: reels_1.bonus3Reels, // später eigenes ReelSet
        bonus4: reels_1.bonus4Reels, // später eigenes ReelSet
    },
    weights: {
        wildMultiplier: {
            base: weights_1.wildMultBase,
            extraBet: weights_1.wildMultExtraBet,
            bonus3: weights_1.wildMultBonus3,
            bonus4: weights_1.wildMultBonus4,
        },
    },
    features: ["bonusTrigger"],
    rules: {
        maxWinX: 10000,
    },
};
