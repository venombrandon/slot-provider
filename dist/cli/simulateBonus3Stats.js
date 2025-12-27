"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const rng_1 = require("../engine/rng/rng");
const runBonus3_1 = require("../engine/bonus/runBonus3");
const _loadSlot_1 = require("./_loadSlot");
const RUNS = 10000;
const rng = new rng_1.RNG(2025);
const config = (0, _loadSlot_1.loadSlotFromArg)();
const totalWins = [];
let totalWinSum = 0;
let maxWin = 0;
let totalSpinsPlayed = 0;
const retriggerCounts = [0, 0, 0, 0]; // index = retriggerEvents (0..3)
for (let i = 0; i < RUNS; i++) {
    const res = (0, runBonus3_1.runBonus3)(config, rng);
    totalWins.push(res.totalWinX);
    totalWinSum += res.totalWinX;
    if (res.totalWinX > maxWin)
        maxWin = res.totalWinX;
    totalSpinsPlayed += res.spinsPlayed;
    const rt = Math.min(res.retriggerEvents, 3);
    retriggerCounts[rt]++;
}
totalWins.sort((a, b) => a - b);
function pct(p) {
    const idx = Math.floor((p / 100) * (totalWins.length - 1));
    return totalWins[idx] ?? 0;
}
const avg = totalWinSum / RUNS;
const avgSpins = totalSpinsPlayed / RUNS;
const report = `
=== BONUS3 STATS (${config.id.toUpperCase()}) ===
Runs: ${RUNS}

Average Bonus Win (xBet): ${avg.toFixed(4)}
Median (P50): ${pct(50).toFixed(4)}
P90: ${pct(90).toFixed(4)}
P95: ${pct(95).toFixed(4)}
P99: ${pct(99).toFixed(4)}
Max Observed Bonus Win (xBet): ${maxWin.toFixed(4)}

Average Bonus Length (spins): ${avgSpins.toFixed(3)}

Retrigger Events Distribution:
  0 retriggers: ${retriggerCounts[0]} (${((retriggerCounts[0] / RUNS) *
    100).toFixed(2)}%)
  1 retrigger : ${retriggerCounts[1]} (${((retriggerCounts[1] / RUNS) *
    100).toFixed(2)}%)
  2 retrigger : ${retriggerCounts[2]} (${((retriggerCounts[2] / RUNS) *
    100).toFixed(2)}%)
  3 retrigger : ${retriggerCounts[3]} (${((retriggerCounts[3] / RUNS) *
    100).toFixed(2)}%)
`;
console.log(report);
fs_1.default.writeFileSync("bonus3_stats.txt", report);
