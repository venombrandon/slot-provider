"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spinGrid = spinGrid;
exports.spinGridWithReels = spinGridWithReels;
const viewWindow_1 = require("./reels/viewWindow");
function spinGrid(config, rng, reelSetKey) {
    const reelSet = config.reelSets[reelSetKey];
    if (!reelSet)
        throw new Error(`Missing reelSet "${String(reelSetKey)}" in ${config.id}`);
    return spinGridWithReels(config, rng, reelSet);
}
// ✅ NEU: direkte Reels
function spinGridWithReels(config, rng, reelSet) {
    const { reels, rows } = config.grid;
    const stops = [];
    const grid = [];
    let scatterCount = 0;
    for (let i = 0; i < reels; i++) {
        const reel = reelSet.reels[i];
        const stop = rng.int(reel.length);
        stops.push(stop);
        const window = (0, viewWindow_1.viewWindow)(reel, stop, rows);
        grid.push(window);
        for (const sym of window) {
            if (sym === config.symbols.scatter)
                scatterCount++;
        }
    }
    return { stops, grid, scatterCount };
}
