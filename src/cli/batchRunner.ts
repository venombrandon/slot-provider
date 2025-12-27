// src/cli/batchRunner.ts
//
// Usage examples:
//   # 20 seeds, 1,000,000 rounds each (base)
//   node dist/cli/batchRunner.js slot001 base 1000000 20 1337
//
//   # 30 seeds, 2,000,000 rounds each (extraBet)
//   node dist/cli/batchRunner.js slot001 extraBet 2000000 30 1000
//
// Output files:
//   - stats_batch_<slot>_<mode>_<rounds>_seeds<k>_from<seed0>.csv
//   - stats_batch_<slot>_<mode>_<rounds>_seeds<k>_from<seed0>.txt
//   - stats_batch_<slot>_<mode>_<rounds>_seeds<k>_from<seed0>.json

import fs from "fs";
import { RNG } from "../engine/rng/rng";
import { loadSlotFromArg } from "./_loadSlot";
import { playRoundBase } from "../engine/modes/playRound";

type Mode = "base" | "extraBet";

type SeedRun = {
  seed: number;
  rounds: number;
  mode: Mode;
  costMult: number;

  elapsedMs: number;
  rps: number;

  rtpPerBase: number; // 0..1
  rtpPerCost: number; // 0..1

  hitFreq: number; // 0..1

  anyBonusFreq: number; // 0..1
  bonus3Freq: number; // 0..1
  bonus4Freq: number; // 0..1

  basegameRtpPerBase: number; // 0..1
  bonus3RtpPerBase: number; // 0..1
  bonus4RtpPerBase: number; // 0..1

  avgBonus3WinPerTrigger: number; // xBet
  avgBonus4WinPerTrigger: number; // xBet

  maxObservedWinX: number;

  cappedRounds: number;
  cappedBonus3: number;
  cappedBonus4: number;
};

function pct(x: number, digits = 4) {
  return (x * 100).toFixed(digits);
}

function mean(xs: number[]) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}

function stdev(xs: number[]) {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  const v = xs.reduce((acc, x) => acc + (x - m) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(v);
}

function quantile(sorted: number[], q: number) {
  if (!sorted.length) return 0;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo];
  const w = pos - lo;
  return sorted[lo] * (1 - w) + sorted[hi] * w;
}

function simulateOneSeed(
  config: any,
  mode: Mode,
  rounds: number,
  seed: number
): SeedRun {
  const rng = new RNG(seed);

  const costMult =
    mode === "extraBet" ? config.rules?.extraBet?.costMultiplier ?? 3 : 1;

  let totalWinX = 0;
  let totalBaseWinX = 0;

  let totalBonusWinX = 0;
  let totalBonus3WinX = 0;
  let totalBonus4WinX = 0;

  let hitRounds = 0;
  let maxWinX = 0;

  let bonus3Triggers = 0;
  let bonus4Triggers = 0;

  let cappedRounds = 0;
  let cappedBonus3 = 0;
  let cappedBonus4 = 0;

  const maxWinXRule: number = config.rules?.maxWinX ?? 10_000;

  const t0 = Date.now();

  for (let i = 0; i < rounds; i++) {
    const rr = playRoundBase(config, rng, mode);

    totalBaseWinX += rr.baseWinX;
    totalWinX += rr.totalWinX;
    totalBonusWinX += rr.bonusWinX;

    if (rr.totalWinX > 0) hitRounds++;
    if (rr.totalWinX > maxWinX) maxWinX = rr.totalWinX;

    // Cap stats
    if (rr.totalWinX >= maxWinXRule) cappedRounds++;
    if (rr.triggered === "bonus3") {
      bonus3Triggers++;
      totalBonus3WinX += rr.bonusWinX;
      if (rr.bonusWinX >= maxWinXRule) cappedBonus3++;
    } else if (rr.triggered === "bonus4") {
      bonus4Triggers++;
      totalBonus4WinX += rr.bonusWinX;
      if (rr.bonusWinX >= maxWinXRule) cappedBonus4++;
    }
  }

  const elapsedMs = Date.now() - t0;
  const rps = elapsedMs > 0 ? rounds / (elapsedMs / 1000) : rounds;

  const rtpPerBase = totalWinX / rounds; // xBet per round, per base bet
  const rtpPerCost = totalWinX / (rounds * costMult);

  const hitFreq = hitRounds / rounds;

  const bonus3Freq = bonus3Triggers / rounds;
  const bonus4Freq = bonus4Triggers / rounds;
  const anyBonusFreq = (bonus3Triggers + bonus4Triggers) / rounds;

  const basegameRtpPerBase = totalBaseWinX / rounds;
  const bonus3RtpPerBase = totalBonus3WinX / rounds;
  const bonus4RtpPerBase = totalBonus4WinX / rounds;

  const avgBonus3WinPerTrigger =
    bonus3Triggers > 0 ? totalBonus3WinX / bonus3Triggers : 0;
  const avgBonus4WinPerTrigger =
    bonus4Triggers > 0 ? totalBonus4WinX / bonus4Triggers : 0;

  return {
    seed,
    rounds,
    mode,
    costMult,

    elapsedMs,
    rps,

    rtpPerBase,
    rtpPerCost,

    hitFreq,

    anyBonusFreq,
    bonus3Freq,
    bonus4Freq,

    basegameRtpPerBase,
    bonus3RtpPerBase,
    bonus4RtpPerBase,

    avgBonus3WinPerTrigger,
    avgBonus4WinPerTrigger,

    maxObservedWinX: maxWinX,

    cappedRounds,
    cappedBonus3,
    cappedBonus4,
  };
}

function toCsv(rows: SeedRun[]) {
  const header = [
    "seed",
    "rounds",
    "mode",
    "costMult",
    "elapsedMs",
    "rps",
    "rtpPerBase_pct",
    "rtpPerCost_pct",
    "hitFreq_pct",
    "anyBonusFreq_pct",
    "bonus3Freq_pct",
    "bonus4Freq_pct",
    "basegameRtp_pct",
    "bonus3Rtp_pct",
    "bonus4Rtp_pct",
    "avgBonus3WinPerTrigger_xBet",
    "avgBonus4WinPerTrigger_xBet",
    "maxObservedWinX",
    "cappedRounds",
    "cappedBonus3",
    "cappedBonus4",
  ].join(",");

  const lines = rows.map((r) =>
    [
      r.seed,
      r.rounds,
      r.mode,
      r.costMult,
      r.elapsedMs,
      r.rps.toFixed(3),
      pct(r.rtpPerBase, 4),
      pct(r.rtpPerCost, 4),
      pct(r.hitFreq, 4),
      pct(r.anyBonusFreq, 4),
      pct(r.bonus3Freq, 4),
      pct(r.bonus4Freq, 4),
      pct(r.basegameRtpPerBase, 4),
      pct(r.bonus3RtpPerBase, 4),
      pct(r.bonus4RtpPerBase, 4),
      r.avgBonus3WinPerTrigger.toFixed(4),
      r.avgBonus4WinPerTrigger.toFixed(4),
      r.maxObservedWinX.toFixed(2),
      r.cappedRounds,
      r.cappedBonus3,
      r.cappedBonus4,
    ].join(",")
  );

  return [header, ...lines].join("\n");
}

function main() {
  const config = loadSlotFromArg();

  const mode = (process.argv[3] ?? "base") as Mode;
  const rounds = Number(process.argv[4] ?? 1_000_000);
  const seedsCount = Number(process.argv[5] ?? 20);
  const seedStart = Number(process.argv[6] ?? 1337);

  if (mode !== "base" && mode !== "extraBet") {
    throw new Error(`mode must be "base" or "extraBet", got: ${mode}`);
  }
  if (!Number.isFinite(rounds) || rounds <= 0) {
    throw new Error(`rounds must be > 0, got: ${rounds}`);
  }
  if (!Number.isFinite(seedsCount) || seedsCount <= 0) {
    throw new Error(`seedsCount must be > 0, got: ${seedsCount}`);
  }
  if (!Number.isFinite(seedStart)) {
    throw new Error(`seedStart must be a number, got: ${seedStart}`);
  }

  const maxWinXRule: number = config.rules?.maxWinX ?? 10_000;
  const costMult =
    mode === "extraBet" ? config.rules?.extraBet?.costMultiplier ?? 3 : 1;

  console.log(
    `\n=== ${String(config.id).toUpperCase()} BATCH RUNNER ===\n` +
      `Mode: ${mode}\n` +
      `Rounds/seed: ${rounds.toLocaleString()}\n` +
      `Seeds: ${seedsCount} (from ${seedStart})\n` +
      `Cost Mult: ${costMult}x\n` +
      `MaxWinX Rule: ${maxWinXRule}\n`
  );

  const all: SeedRun[] = [];

  const globalT0 = Date.now();

  for (let i = 0; i < seedsCount; i++) {
    const seed = seedStart + i;
    const r = simulateOneSeed(config, mode, rounds, seed);
    all.push(r);

    console.log(
      `[${i + 1}/${seedsCount}] seed=${seed} | RTP(base)=${pct(
        r.rtpPerBase,
        3
      )}% | RTP(cost)=${pct(r.rtpPerCost, 3)}% | RPS=${r.rps.toFixed(0)}`
    );
  }

  const globalElapsedMs = Date.now() - globalT0;

  // Summary stats
  const rtpsBase = all.map((x) => x.rtpPerBase);
  const rtpsCost = all.map((x) => x.rtpPerCost);
  const hitFreqs = all.map((x) => x.hitFreq);

  rtpsBase.sort((a, b) => a - b);
  rtpsCost.sort((a, b) => a - b);

  const meanBase = mean(rtpsBase);
  const meanCost = mean(rtpsCost);
  const sdBase = stdev(rtpsBase);
  const sdCost = stdev(rtpsCost);

  const report = `
=== ${String(config.id).toUpperCase()} BATCH SUMMARY ===
Mode: ${mode}
Rounds/seed: ${rounds.toLocaleString()}
Seeds: ${seedsCount} (from ${seedStart})
Cost Multiplier: ${costMult}x
MaxWinX Rule: ${maxWinXRule}

Elapsed: ${(globalElapsedMs / 1000).toFixed(2)}s

RTP (per base bet):
  Mean: ${pct(meanBase, 4)} %
  Std:  ${pct(sdBase, 4)} %
  Min:  ${pct(rtpsBase[0], 4)} %
  P50:  ${pct(quantile(rtpsBase, 0.5), 4)} %
  P90:  ${pct(quantile(rtpsBase, 0.9), 4)} %
  Max:  ${pct(rtpsBase[rtpsBase.length - 1], 4)} %

RTP (per cost):
  Mean: ${pct(meanCost, 4)} %
  Std:  ${pct(sdCost, 4)} %
  Min:  ${pct(rtpsCost[0], 4)} %
  P50:  ${pct(quantile(rtpsCost, 0.5), 4)} %
  P90:  ${pct(quantile(rtpsCost, 0.9), 4)} %
  Max:  ${pct(rtpsCost[rtpsCost.length - 1], 4)} %

Hit Frequency:
  Mean: ${pct(mean(hitFreqs), 4)} %

Cap Hits (sum over all seeds):
  Capped Rounds (>= ${maxWinXRule}): ${all.reduce(
    (a, r) => a + r.cappedRounds,
    0
  )}
  Capped Bonus3:                  ${all.reduce((a, r) => a + r.cappedBonus3, 0)}
  Capped Bonus4:                  ${all.reduce((a, r) => a + r.cappedBonus4, 0)}
`.trim();

  console.log("\n" + report + "\n");

  const baseName = `stats_batch_${config.id}_${mode}_${rounds}_seeds${seedsCount}_from${seedStart}`;
  const csvPath = `${baseName}.csv`;
  const txtPath = `${baseName}.txt`;
  const jsonPath = `${baseName}.json`;

  fs.writeFileSync(csvPath, toCsv(all), "utf8");
  fs.writeFileSync(txtPath, report + "\n", "utf8");
  fs.writeFileSync(
    jsonPath,
    JSON.stringify(
      {
        slotId: config.id,
        mode,
        roundsPerSeed: rounds,
        seedsCount,
        seedStart,
        costMult,
        maxWinXRule,
        summary: {
          rtpPerBase: {
            mean: meanBase,
            std: sdBase,
            min: rtpsBase[0],
            p50: quantile(rtpsBase, 0.5),
            p90: quantile(rtpsBase, 0.9),
            max: rtpsBase[rtpsBase.length - 1],
          },
          rtpPerCost: {
            mean: meanCost,
            std: sdCost,
            min: rtpsCost[0],
            p50: quantile(rtpsCost, 0.5),
            p90: quantile(rtpsCost, 0.9),
            max: rtpsCost[rtpsCost.length - 1],
          },
          hitFreqMean: mean(hitFreqs),
          capHits: {
            cappedRounds: all.reduce((a, r) => a + r.cappedRounds, 0),
            cappedBonus3: all.reduce((a, r) => a + r.cappedBonus3, 0),
            cappedBonus4: all.reduce((a, r) => a + r.cappedBonus4, 0),
          },
        },
        runs: all,
      },
      null,
      2
    ),
    "utf8"
  );

  console.log(`Wrote:\n- ${csvPath}\n- ${txtPath}\n- ${jsonPath}\n`);
}

main();
