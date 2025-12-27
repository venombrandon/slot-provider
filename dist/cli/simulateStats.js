"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const rng_1 = require("../engine/rng/rng");
const playRound_1 = require("../engine/modes/playRound");
const _loadSlot_1 = require("./_loadSlot");
const config = (0, _loadSlot_1.loadSlotFromArg)();
// usage:
// node dist/cli/simulateStats.js slot001 base 1000000 1337
// node dist/cli/simulateStats.js slot001 extraBet 2000000 1337
const mode = (process.argv[3] ?? "base");
const ROUNDS = Number(process.argv[4] ?? 1000000);
const SEED = Number(process.argv[5] ?? 1337);
const rng = new rng_1.RNG(SEED);
const costMult = mode === "extraBet" ? config.rules.extraBet?.costMultiplier ?? 3 : 1;
if (mode === "extraBet") {
    console.log("EXTRABET RULES:", config.rules.extraBet);
}
const maxWinXRule = config.rules.maxWinX ?? 10000;
// Stats
let totalWinX = 0;
let totalBaseWinX = 0;
let hitRounds = 0;
let maxWinX = 0;
let bonus3Triggers = 0;
let bonus4Triggers = 0;
let totalBonusWinX = 0;
let totalBonus3WinX = 0;
let totalBonus4WinX = 0;
let cappedRounds = 0; // ✅ Round hit maxWinX
let cappedBonus3 = 0; // ✅ Bonus3 hit maxWinX
let cappedBonus4 = 0; // ✅ Bonus4 hit maxWinX
const t0 = Date.now();
const PROGRESS_EVERY = 250000;
for (let i = 1; i <= ROUNDS; i++) {
    const rr = (0, playRound_1.playRoundBase)(config, rng, mode);
    totalBaseWinX += rr.baseWinX;
    totalWinX += rr.totalWinX;
    totalBonusWinX += rr.bonusWinX;
    if (rr.totalWinX > 0)
        hitRounds++;
    if (rr.totalWinX > maxWinX)
        maxWinX = rr.totalWinX;
    // ✅ cap tracking (round-level)
    if (rr.totalWinX >= maxWinXRule)
        cappedRounds++;
    if (rr.triggered === "bonus3") {
        bonus3Triggers++;
        totalBonus3WinX += rr.bonusWinX;
        if (rr.bonusWinX >= maxWinXRule)
            cappedBonus3++; // falls du Bonus3 so hart cappend machst
    }
    else if (rr.triggered === "bonus4") {
        bonus4Triggers++;
        totalBonus4WinX += rr.bonusWinX;
        if (rr.bonusWinX >= maxWinXRule)
            cappedBonus4++;
    }
    // ✅ progress
    if (i % PROGRESS_EVERY === 0) {
        const elapsed = (Date.now() - t0) / 1000;
        const rps = i / elapsed;
        const rtpNow = totalWinX / i;
        console.log(`[${i.toLocaleString()} / ${ROUNDS.toLocaleString()}] ` +
            `RTP ${(rtpNow * 100).toFixed(2)}% | ` +
            `RPS ${Math.round(rps).toLocaleString()}`);
    }
}
const elapsedSec = (Date.now() - t0) / 1000;
const rtp = totalWinX / ROUNDS;
const rtpPerCost = totalWinX / (ROUNDS * costMult);
const hitFreq = hitRounds / ROUNDS;
const bonus3Freq = bonus3Triggers / ROUNDS;
const bonus4Freq = bonus4Triggers / ROUNDS;
const anyBonusFreq = (bonus3Triggers + bonus4Triggers) / ROUNDS;
const bonusShare = totalWinX > 0 ? (totalBonusWinX / totalWinX) * 100 : 0;
const avgBonus3WinPerTrigger = bonus3Triggers > 0 ? totalBonus3WinX / bonus3Triggers : 0;
const avgBonus4WinPerTrigger = bonus4Triggers > 0 ? totalBonus4WinX / bonus4Triggers : 0;
const report = `
=== ${config.id.toUpperCase()} ROUND SIMULATION (Base + Bonus3 + Bonus4) ===
Seed: ${SEED}
Rounds: ${ROUNDS.toLocaleString()}

Elapsed: ${elapsedSec.toFixed(1)}s
Rounds/sec: ${(ROUNDS / elapsedSec).toFixed(0)}

Mode: ${mode}
Cost Multiplier: ${costMult}x
MaxWinX Rule: ${maxWinXRule}

RTP (per base bet): ${(rtp * 100).toFixed(4)} %
RTP (per cost): ${(rtpPerCost * 100).toFixed(4)} %

Hit Frequency: ${(hitFreq * 100).toFixed(4)} %

Any Bonus Trigger Frequency: ${(anyBonusFreq * 100).toFixed(4)} %
Bonus3 Trigger Frequency: ${(bonus3Freq * 100).toFixed(4)} %
Bonus4 Trigger Frequency: ${(bonus4Freq * 100).toFixed(4)} %

Total Win (xBet): ${totalWinX.toFixed(2)}
Average Win / Round: ${(totalWinX / ROUNDS).toFixed(6)}

Total Bonus Win (xBet): ${totalBonusWinX.toFixed(2)}
  Bonus3 Win (xBet): ${totalBonus3WinX.toFixed(2)}
  Bonus4 Win (xBet): ${totalBonus4WinX.toFixed(2)}
Bonus Share of RTP: ${bonusShare.toFixed(2)} %

RTP Breakdown (per base bet):
  Basegame RTP: ${((totalBaseWinX / ROUNDS) * 100).toFixed(4)} %
  Bonus3 RTP:   ${((totalBonus3WinX / ROUNDS) * 100).toFixed(4)} %
  Bonus4 RTP:   ${((totalBonus4WinX / ROUNDS) * 100).toFixed(4)} %

Avg Win per Trigger:
  Bonus3 avg: ${avgBonus3WinPerTrigger.toFixed(2)} xBet
  Bonus4 avg: ${avgBonus4WinPerTrigger.toFixed(2)} xBet

Cap Hits:
  Capped Rounds (>= ${maxWinXRule}): ${cappedRounds} (${((cappedRounds / ROUNDS) *
    100).toFixed(4)} %)
  Capped Bonus3 (bonusWinX >= ${maxWinXRule}): ${cappedBonus3}
  Capped Bonus4 (bonusWinX >= ${maxWinXRule}): ${cappedBonus4}

Max Observed Win (xBet): ${maxWinX.toFixed(2)}
`;
console.log(report);
fs_1.default.writeFileSync(`stats_round_${config.id}_${mode}_${ROUNDS}_${SEED}.txt`, report);
