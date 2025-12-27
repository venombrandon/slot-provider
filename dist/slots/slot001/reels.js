"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bonus4BuyReels = exports.bonus3BuyReels = exports.bonus4Reels = exports.bonus3Reels = exports.extraBetReels = exports.baseReels = void 0;
const rng_1 = require("../../engine/rng/rng");
const buildReel_1 = require("../../engine/reels/buildReel");
const rng = new rng_1.RNG(1234);
exports.baseReels = {
    reels: [
        // Reel 1 – KEIN Scatter
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 36, high: 12, wild: 2, scatter: 0 }, rng),
        // Reel 2 – 2 Scatter
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 34, high: 12, wild: 2, scatter: 2 }, rng),
        // Reel 3 – 2 Scatter
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 34, high: 12, wild: 2, scatter: 2 }, rng),
        // Reel 4 – 1 Scatter
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 35, high: 12, wild: 2, scatter: 1 }, rng),
        // Reel 5 – 1 Scatter
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 35, high: 12, wild: 2, scatter: 1 }, rng),
    ],
};
exports.extraBetReels = {
    reels: [
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 36, high: 12, wild: 2, scatter: 0 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 33, high: 12, wild: 2, scatter: 3 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 33, high: 12, wild: 2, scatter: 3 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 34, high: 12, wild: 2, scatter: 2 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 35, high: 12, wild: 2, scatter: 1 }, rng),
    ],
};
exports.bonus3Reels = {
    reels: [
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 34, high: 12, wild: 4, scatter: 0 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 33, high: 12, wild: 4, scatter: 1 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 33, high: 12, wild: 4, scatter: 1 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 33, high: 12, wild: 4, scatter: 1 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 33, high: 12, wild: 4, scatter: 1 }, rng),
    ],
};
exports.bonus4Reels = {
    reels: [
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 33, high: 12, wild: 5, scatter: 0 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 32, high: 12, wild: 5, scatter: 1 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 32, high: 12, wild: 5, scatter: 1 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 32, high: 12, wild: 5, scatter: 1 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 33, high: 12, wild: 4, scatter: 1 }, rng),
    ],
};
exports.bonus3BuyReels = {
    reels: [
        // Reel 1: kein Scatter (lassen wir so)
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 32, high: 11, wild: 7, scatter: 0 }, rng),
        // Reel 2–5: Scatter 2 -> 1 (anti-farm), Wild bleibt hoch
        ...Array.from({ length: 4 }).map(() => (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 26, high: 15, wild: 8, scatter: 1 }, rng)),
    ],
};
exports.bonus4BuyReels = {
    reels: [
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 35, high: 12, wild: 3, scatter: 0 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 34, high: 12, wild: 3, scatter: 1 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 34, high: 12, wild: 3, scatter: 1 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 34, high: 12, wild: 3, scatter: 1 }, rng),
        (0, buildReel_1.buildReel)({
            low: ["10", "J", "Q", "K", "A"],
            high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
            wild: "WILD",
            scatter: "SCATTER",
        }, { low: 34, high: 12, wild: 3, scatter: 1 }, rng),
    ],
};
