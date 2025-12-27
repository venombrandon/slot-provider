"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const rng_1 = require("../engine/rng/rng");
const _loadSlot_1 = require("./_loadSlot");
const playBonusBuy_1 = require("../engine/modes/playBonusBuy");
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
function mean(xs) {
    if (xs.length === 0)
        return 0;
    let s = 0;
    for (const x of xs)
        s += x;
    return s / xs.length;
}
function stddev(xs) {
    if (xs.length < 2)
        return 0;
    const m = mean(xs);
    let v = 0;
    for (const x of xs) {
        const d = x - m;
        v += d * d;
    }
    v /= xs.length - 1;
    return Math.sqrt(v);
}
function fmtPct(x) {
    return `${x.toFixed(4)} %`;
}
const config = (0, _loadSlot_1.loadSlotFromArg)();
// usage:
// node dist/cli/batchBuyRunner.js slot001 bonus3 200000 20 1337
const buyType = (process.argv[3] ?? "bonus3");
const RUNS_PER_SEED = Number(process.argv[4] ?? 200000);
const SEEDS = Number(process.argv[5] ?? 20);
const SEED0 = Number(process.argv[6] ?? 1337);
const maxWinXRule = config.rules?.maxWinX ?? 10000;
console.log(`\n=== ${config.id.toUpperCase()} BUY BATCH RUNNER ===`);
console.log(`Buy: ${buyType}`);
console.log(`Runs/seed: ${RUNS_PER_SEED.toLocaleString()}`);
console.log(`Seeds: ${SEEDS.toLocaleString()} (from ${SEED0})`);
console.log(`MaxWinX Rule: ${maxWinXRule}`);
console.log("");
const rows = [];
const tAll0 = Date.now();
for (let sidx = 0; sidx < SEEDS; sidx++) {
    const seed = SEED0 + sidx;
    const rng = new rng_1.RNG(seed);
    let totalWinX = 0;
    let maxWinX = 0;
    let hit = 0;
    let breakEven = 0;
    let profit2x = 0;
    let capped = 0;
    let costX = 0;
    const t0 = Date.now();
    for (let i = 0; i < RUNS_PER_SEED; i++) {
        const r = (0, playBonusBuy_1.playBonusBuy)(config, rng, buyType);
        costX = r.costX; // constant per buyType
        const winX = r.winX;
        totalWinX += winX;
        if (winX > 0)
            hit++;
        if (winX >= costX)
            breakEven++;
        if (winX >= 2 * costX)
            profit2x++;
        if (winX > maxWinX)
            maxWinX = winX;
        // cap detect (if you clamp exactly to maxWinXRule this catches it)
        if (winX >= maxWinXRule)
            capped++;
    }
    const elapsedMs = Date.now() - t0;
    const rps = elapsedMs > 0 ? (RUNS_PER_SEED / elapsedMs) * 1000 : 0;
    const avgWinX = totalWinX / RUNS_PER_SEED;
    const rtpPerCostPct = costX > 0 ? (avgWinX / costX) * 100 : 0;
    const hitRatePct = (hit / RUNS_PER_SEED) * 100;
    const breakEvenRatePct = (breakEven / RUNS_PER_SEED) * 100;
    const profit2xRatePct = (profit2x / RUNS_PER_SEED) * 100;
    const cappedRatePct = (capped / RUNS_PER_SEED) * 100;
    rows.push({
        seed,
        runs: RUNS_PER_SEED,
        costX,
        avgWinX,
        rtpPerCostPct,
        hitRatePct,
        breakEvenRatePct,
        profit2xRatePct,
        maxWinX,
        cappedCount: capped,
        cappedRatePct,
        elapsedMs,
        rps,
    });
    console.log(`[${(sidx + 1)
        .toString()
        .padStart(2, "0")}/${SEEDS}] seed=${seed} | RTP(cost)=${rtpPerCostPct.toFixed(3)}% | BE=${breakEvenRatePct.toFixed(2)}% | 2x+=${profit2xRatePct.toFixed(2)}% | cap=${capped} | RPS=${Math.round(rps)}`);
}
const elapsedAllMs = Date.now() - tAll0;
// Summary stats over seeds
const rtps = rows.map((r) => r.rtpPerCostPct).sort((a, b) => a - b);
const beRates = rows.map((r) => r.breakEvenRatePct).sort((a, b) => a - b);
const p2Rates = rows.map((r) => r.profit2xRatePct).sort((a, b) => a - b);
const maxWins = rows.map((r) => r.maxWinX).sort((a, b) => a - b);
const totalCapped = rows.reduce((a, r) => a + r.cappedCount, 0);
const totalRunsAll = RUNS_PER_SEED * SEEDS;
const summary = {
    slot: config.id,
    buyType,
    runsPerSeed: RUNS_PER_SEED,
    seeds: SEEDS,
    seedFrom: SEED0,
    maxWinXRule,
    elapsedMs: elapsedAllMs,
    runsTotal: totalRunsAll,
    rtpPerCostPct: {
        mean: mean(rtps),
        std: stddev(rtps),
        min: rtps[0] ?? 0,
        p50: percentile(rtps, 0.5),
        p90: percentile(rtps, 0.9),
        max: rtps[rtps.length - 1] ?? 0,
    },
    breakEvenRatePct: {
        mean: mean(beRates),
        std: stddev(beRates),
        min: beRates[0] ?? 0,
        p50: percentile(beRates, 0.5),
        p90: percentile(beRates, 0.9),
        max: beRates[beRates.length - 1] ?? 0,
    },
    profit2xRatePct: {
        mean: mean(p2Rates),
        std: stddev(p2Rates),
        min: p2Rates[0] ?? 0,
        p50: percentile(p2Rates, 0.5),
        p90: percentile(p2Rates, 0.9),
        max: p2Rates[p2Rates.length - 1] ?? 0,
    },
    maxObservedWinX: {
        p50: percentile(maxWins, 0.5),
        p90: percentile(maxWins, 0.9),
        max: maxWins[maxWins.length - 1] ?? 0,
    },
    capHits: {
        total: totalCapped,
        ratePct: totalRunsAll > 0 ? (totalCapped / totalRunsAll) * 100 : 0,
    },
};
const outBase = `stats_batch_buy_${config.id}_${buyType}_${RUNS_PER_SEED}_seeds${SEEDS}_from${SEED0}`;
const outCsv = `${outBase}.csv`;
const outTxt = `${outBase}.txt`;
const outJson = `${outBase}.json`;
// CSV
const csvHeader = [
    "seed",
    "runs",
    "costX",
    "avgWinX",
    "rtpPerCostPct",
    "hitRatePct",
    "breakEvenRatePct",
    "profit2xRatePct",
    "maxWinX",
    "cappedCount",
    "cappedRatePct",
    "elapsedMs",
    "rps",
].join(",");
const csvLines = rows.map((r) => [
    r.seed,
    r.runs,
    r.costX.toFixed(0),
    r.avgWinX.toFixed(6),
    r.rtpPerCostPct.toFixed(6),
    r.hitRatePct.toFixed(6),
    r.breakEvenRatePct.toFixed(6),
    r.profit2xRatePct.toFixed(6),
    r.maxWinX.toFixed(2),
    r.cappedCount,
    r.cappedRatePct.toFixed(6),
    r.elapsedMs,
    r.rps.toFixed(2),
].join(","));
fs_1.default.writeFileSync(outCsv, [csvHeader, ...csvLines].join("\n"), "utf8");
// TXT summary
const report = `
=== ${config.id.toUpperCase()} BUY BATCH SUMMARY ===
Buy: ${buyType}
Runs/seed: ${RUNS_PER_SEED.toLocaleString()}
Seeds: ${SEEDS.toLocaleString()} (from ${SEED0})
MaxWinX Rule: ${maxWinXRule}

Elapsed: ${(elapsedAllMs / 1000).toFixed(2)}s
Total Runs: ${totalRunsAll.toLocaleString()}

RTP (per cost):
  Mean: ${fmtPct(summary.rtpPerCostPct.mean)}
  Std:  ${fmtPct(summary.rtpPerCostPct.std)}
  Min:  ${fmtPct(summary.rtpPerCostPct.min)}
  P50:  ${fmtPct(summary.rtpPerCostPct.p50)}
  P90:  ${fmtPct(summary.rtpPerCostPct.p90)}
  Max:  ${fmtPct(summary.rtpPerCostPct.max)}

Break-even Rate (>= cost):
  Mean: ${fmtPct(summary.breakEvenRatePct.mean)}
  Std:  ${fmtPct(summary.breakEvenRatePct.std)}
  Min:  ${fmtPct(summary.breakEvenRatePct.min)}
  P50:  ${fmtPct(summary.breakEvenRatePct.p50)}
  P90:  ${fmtPct(summary.breakEvenRatePct.p90)}
  Max:  ${fmtPct(summary.breakEvenRatePct.max)}

Profit Rate (>= 2x cost):
  Mean: ${fmtPct(summary.profit2xRatePct.mean)}
  Std:  ${fmtPct(summary.profit2xRatePct.std)}
  Min:  ${fmtPct(summary.profit2xRatePct.min)}
  P50:  ${fmtPct(summary.profit2xRatePct.p50)}
  P90:  ${fmtPct(summary.profit2xRatePct.p90)}
  Max:  ${fmtPct(summary.profit2xRatePct.max)}

Max Observed WinX:
  P50: ${summary.maxObservedWinX.p50.toFixed(2)}
  P90: ${summary.maxObservedWinX.p90.toFixed(2)}
  Max: ${summary.maxObservedWinX.max.toFixed(2)}

Cap Hits (sum over all seeds):
  Total: ${summary.capHits.total}
  Rate:  ${summary.capHits.ratePct.toFixed(6)} %

Wrote:
- ${path_1.default.resolve(outCsv)}
- ${path_1.default.resolve(outTxt)}
- ${path_1.default.resolve(outJson)}
`;
console.log(report);
fs_1.default.writeFileSync(outTxt, report, "utf8");
fs_1.default.writeFileSync(outJson, JSON.stringify({ rows, summary }, null, 2), "utf8");
