import fs from "fs";
import { RNG } from "../engine/rng/rng";
import { runBonus4 } from "../engine/bonus/runBonus4";
import { loadSlotFromArg } from "./_loadSlot";

const RUNS = 10_000;
const rng = new RNG(4040);
const config = loadSlotFromArg();

const wins: number[] = [];
let sum = 0;
let max = 0;
let spinsSum = 0;
const retriggers = [0, 0, 0, 0];

for (let i = 0; i < RUNS; i++) {
  const r = runBonus4(config, rng);
  wins.push(r.totalWinX);
  sum += r.totalWinX;
  if (r.totalWinX > max) max = r.totalWinX;

  spinsSum += r.spinsPlayed;
  retriggers[Math.min(r.retriggerEvents, 3)]++;
}

wins.sort((a, b) => a - b);
const pct = (p: number) => wins[Math.floor((p / 100) * (wins.length - 1))] ?? 0;

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
fs.writeFileSync("bonus4_stats.txt", report);
