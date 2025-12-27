"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalPaylines = evalPaylines;
const drawWeighted_1 = require("./drawWeighted");
function evalPaylines(config, grid, paylines, rng, wildTable, // ✅ statt weightKey
wildMultGrid) {
    const wins = [];
    for (const line of paylines) {
        const symbolsOnLine = line.positions.map(([reel, row]) => grid[reel][row]);
        const baseSymbol = symbolsOnLine.find((s) => s !== config.symbols.wild && s !== config.symbols.scatter);
        if (!baseSymbol)
            continue;
        if (!(baseSymbol in config.paytable))
            continue;
        let count = 0;
        for (const s of symbolsOnLine) {
            if (s === baseSymbol || s === config.symbols.wild)
                count++;
            else
                break;
        }
        if (count < 3)
            continue;
        const baseWinX = config.paytable[baseSymbol]?.[count] ?? 0;
        if (baseWinX <= 0)
            continue;
        const winningSlice = symbolsOnLine.slice(0, count);
        const wildPositions = line.positions.slice(0, count);
        const wildMultis = [];
        for (let i = 0; i < winningSlice.length; i++) {
            if (winningSlice[i] !== config.symbols.wild)
                continue;
            const [reel, row] = wildPositions[i];
            if (wildMultGrid) {
                const m = wildMultGrid[reel]?.[row];
                wildMultis.push(m ?? 1);
            }
            else {
                wildMultis.push((0, drawWeighted_1.drawWeighted)(rng, wildTable)); // ✅ direkt table
            }
        }
        const wildCount = wildMultis.length;
        const lineMulti = wildCount > 0 ? wildMultis.reduce((a, b) => a + b, 0) : 1;
        const winX = baseWinX * lineMulti;
        wins.push({
            lineId: line.id,
            symbol: baseSymbol,
            count,
            baseWinX,
            wildCount,
            wildMultis,
            lineMulti,
            winX,
        });
    }
    return wins;
}
