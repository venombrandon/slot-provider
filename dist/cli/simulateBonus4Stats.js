"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const rng_1 = require("../engine/rng/rng");
const runBonus4_1 = require("../engine/bonus/runBonus4");
const _loadSlot_1 = require("./_loadSlot");
const RUNS = 10000;
const rng = new rng_1.RNG(4040);
const config = (0, _loadSlot_1.loadSlotFromArg)();
const wins = [];
let sum = 0;
let max = 0;
let spinsSum = 0;
const retriggers = [0, 0, 0, 0];
for (let i = 0; i < RUNS; i++) {
    const r = (0, runBonus4_1.runBonus4)(config, rng);
    wins.push(r.totalWinX);
    sum += r.totalWinX;
    if (r.totalWinX > max)
        max = r.totalWinX;
    spinsSum += r.spinsPlayed;
    retriggers[Math.min(r.retriggerEvents, 3)]++;
}
wins.sort((a, b) => a - b);
const pct = (p) => wins[Math.floor((p / 100) * (wins.length - 1))] ?? 0;
const report = `
=== BONUS4 STATS (${config.id.toUpperCase()}) ===
Runs: ${RUNS}

Average Bonus Win (xBet): ${(sum / RUNS).toFixed(4)}
Median (P50): ${pct(50).toFixed(4)}
P90: ${pct(90).toFixed(4)}
P95: ${pct(95).toFixed(4)}
P99: ${pct(99).toFixed(4)}
Max Observed Bonus Win (xBet): ${max.toFixed(4)}

Average Bonus Length (spins): ${(spinsSum / RUNS).toFixed(3)}

Retrigger Events Distribution:
  0: ${retriggers[0]} (${((retriggers[0] / RUNS) * 100).toFixed(2)}%)
  1: ${retriggers[1]} (${((retriggers[1] / RUNS) * 100).toFixed(2)}%)
  2: ${retriggers[2]} (${((retriggers[2] / RUNS) * 100).toFixed(2)}%)
  3: ${retriggers[3]} (${((retriggers[3] / RUNS) * 100).toFixed(2)}%)
`;
console.log(report);
fs_1.default.writeFileSync("bonus4_stats.txt", report);
