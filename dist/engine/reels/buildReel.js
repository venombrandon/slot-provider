"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildReel = buildReel;
function buildReel(symbols, counts, rng) {
    const reel = [];
    for (let i = 0; i < counts.low; i++) {
        reel.push(symbols.low[rng.int(symbols.low.length)]);
    }
    for (let i = 0; i < counts.high; i++) {
        reel.push(symbols.high[rng.int(symbols.high.length)]);
    }
    for (let i = 0; i < counts.wild; i++) {
        reel.push(symbols.wild);
    }
    for (let i = 0; i < counts.scatter; i++) {
        reel.push(symbols.scatter);
    }
    // Shuffle (Fisher-Yates)
    for (let i = reel.length - 1; i > 0; i--) {
        const j = rng.int(i + 1);
        [reel[i], reel[j]] = [reel[j], reel[i]];
    }
    return reel;
}
