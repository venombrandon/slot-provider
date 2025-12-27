"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const rng_1 = require("../engine/rng/rng");
const _loadSlot_1 = require("./_loadSlot");
const runBonus3_1 = require("../engine/bonus/runBonus3");
const runBonus4_1 = require("../engine/bonus/runBonus4");
function percentile(sorted, p) {
    if (sorted.length === 0)
        return 0;
    const idx = (sorted.length - 1) * p;
    const lo = Math.floor(idx);
    const hi = Math.ceil(idx);
    if (lo === hi)
        return sorted[lo];
    const w = idx - lo;
    return sorted[lo] * (1 - w) + sorted[hi] * w;
}
const config = (0, _loadSlot_1.loadSlotFromArg)();
if (!config.rules.bonusBuy) {
    throw new Error(`Slot ${config.id} has no rules.bonusBuy configured`);
}
const buyRules = config.rules.bonusBuy;
// usage:
// node dist/cli/simulateBuyStats.js slot001 bonus3 100000 1337
const buyType = (process.argv[3] ?? "bonus3");
const RUNS = Number(process.argv[4] ?? 100000);
const SEED = Number(process.argv[5] ?? 1337);
const rng = new rng_1.RNG(SEED);
let totalWinX = 0;
let maxWinX = 0;
let hit = 0;
let beatCost = 0;
let profit2x = 0; // win >= 2 * cost
let totalSpins = 0;
let totalRetriggers = 0;
const wins = [];
let costX = 0;
for (let i = 0; i < RUNS; i++) {
    let winX = 0;
    let spinsPlayed = 0;
    let retriggerEvents = 0;
    if (buyType === "bonus3") {
        costX = config.rules.bonusBuy.bonus3CostX;
        const br = (0, runBonus3_1.runBonus3)(config, rng, "buy");
        winX = br.totalWinX;
        spinsPlayed = br.spinsPlayed;
        retriggerEvents = br.retriggerEvents;
        if (winX >= 2 * costX)
            profit2x++;
    }
    else {
        costX = config.rules.bonusBuy.bonus4CostX;
        const br = (0, runBonus4_1.runBonus4)(config, rng, "buy");
        winX = br.totalWinX;
        spinsPlayed = br.spinsPlayed;
        retriggerEvents = br.retriggerEvents;
        if (winX >= 2 * costX)
            profit2x++;
    }
    totalWinX += winX;
    wins.push(winX);
    totalSpins += spinsPlayed;
    totalRetriggers += retriggerEvents;
    if (winX > 0)
        hit++;
    if (winX > maxWinX)
        maxWinX = winX;
    if (winX >= costX)
        beatCost++;
}
wins.sort((a, b) => a - b);
const avgWin = totalWinX / RUNS;
const rtpPerCost = costX > 0 ? avgWin / costX : 0;
const p50 = percentile(wins, 0.5);
const p90 = percentile(wins, 0.9);
const p95 = percentile(wins, 0.95);
const p99 = percentile(wins, 0.99);
const p999 = percentile(wins, 0.999);
const report = `
=== ${config.id.toUpperCase()} BONUS BUY SIMULATION ===
Buy: ${buyType}
Runs: ${RUNS.toLocaleString()}
Seed: ${SEED}

Cost (xBet): ${costX}

Avg Bonus Win (xBet): ${avgWin.toFixed(4)}
RTP (per cost): ${(rtpPerCost * 100).toFixed(2)} %

Hit Rate (>0): ${((hit / RUNS) * 100).toFixed(2)} %
Break-even Rate (>= cost): ${((beatCost / RUNS) * 100).toFixed(2)} %

Avg Bonus Length (spins): ${(totalSpins / RUNS).toFixed(3)}
Avg Retriggers: ${(totalRetriggers / RUNS).toFixed(3)}

Profit Rate (>= 2x cost): ${((profit2x / RUNS) * 100).toFixed(2)} %

P99.9: ${p999.toFixed(2)}

P50: ${p50.toFixed(2)}
P90: ${p90.toFixed(2)}
P95: ${p95.toFixed(2)}
P99: ${p99.toFixed(2)}
Max Observed (xBet): ${maxWinX.toFixed(2)}
`;
console.log(report);
fs_1.default.writeFileSync(`stats_buy_${config.id}_${buyType}.txt`, report);
