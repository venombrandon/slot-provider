"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rng_1 = require("../engine/rng/rng");
const spin_1 = require("../engine/spin");
const evalLines_1 = require("../engine/eval/evalLines");
const resolveSpinWin_1 = require("../engine/eval/resolveSpinWin");
const _loadSlot_1 = require("./_loadSlot");
const rng = new rng_1.RNG(12345);
const config = (0, _loadSlot_1.loadSlotFromArg)();
for (let i = 0; i < 5000; i++) {
    const res = (0, spin_1.spinGrid)(config, rng, "base");
    const wildTable = config.weights.wildMultiplier.base;
    const wins = (0, evalLines_1.evalPaylines)(config, res.grid, config.paylines, rng, wildTable);
    const hasWildMulti = wins.some((w) => w.wildCount > 0 && w.lineMulti > 1);
    if (hasWildMulti) {
        console.log("\n=== Found wild win on spin", i, "Stops:", res.stops, "Scatter:", res.scatterCount, "===\n");
        for (let row = 0; row < config.grid.rows; row++) {
            const line = [];
            for (let reel = 0; reel < config.grid.reels; reel++) {
                line.push(res.grid[reel][row].padEnd(7));
            }
            console.log(line.join(" "));
        }
        console.log("\nLine wins:");
        for (const w of wins) {
            console.log(`Line ${w.lineId}: ${w.symbol} x${w.count} base=${w.baseWinX} wilds=${w.wildCount} [${w.wildMultis.join("+") || "-"}] => multi=${w.lineMulti} winX=${w.winX}`);
        }
        const spinWin = (0, resolveSpinWin_1.resolveSpinWin)(config, wins);
        console.log(`Total spin winX: ${spinWin.totalWinX} (capped=${spinWin.capped})`);
        break;
    }
}
console.log("\nDone.");
