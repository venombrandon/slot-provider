import fs from "fs";
import { RNG } from "../engine/rng/rng";
import { loadSlotFromArg } from "./_loadSlot";
import { playRoundBase } from "../engine/modes/playRound";

const ROUNDS = 5_000_000;
const rng = new RNG(1337);
const config = loadSlotFromArg();

// Stats
let totalWinX = 0;
let hitRounds = 0;
let maxWinX = 0;

let bonus3Triggers = 0;
let bonus4Triggers = 0;

let totalBonusWinX = 0;
let totalBonus3WinX = 0;
let totalBonus4WinX = 0;

const t0 = Date.now();

for (let i = 1; i <= ROUNDS; i++) {
  const rr = playRoundBase(config, rng);

  totalWinX += rr.totalWinX;
  totalBonusWinX += rr.bonusWinX;

  if (rr.totalWinX > 0) hitRounds++;
  if (rr.totalWinX > maxWinX) maxWinX = rr.totalWinX;

  if (rr.triggered === "bonus3") {
    bonus3Triggers++;
    totalBonus3WinX += rr.bonusWinX;
  } else if (rr.triggered === "bonus4") {
    bonus4Triggers++;
    totalBonus4WinX += rr.bonusWinX;
  }

  // OPTIONAL: nur alle 2 Mio ein Ping (kostet wenig, hilft beim Gefühl)
  // Wenn du maximal schnell willst: diesen Block komplett auskommentieren.
  if (i % 2_000_000 === 0) {
    const elapsed = (Date.now() - t0) / 1000;
    const rps = i / elapsed;
    const rtpNow = totalWinX / i;
    console.log(
      `[${i}/${ROUNDS}] RTP ${(rtpNow * 100).toFixed(2)}% | RPS ${Math.round(
        rps
      )}`
    );
  }
}

const elapsedSec = (Date.now() - t0) / 1000;

const rtp = totalWinX / ROUNDS;
const hitFreq = hitRounds / ROUNDS;

const bonus3Freq = bonus3Triggers / ROUNDS;
const bonus4Freq = bonus4Triggers / ROUNDS;
const anyBonusFreq = (bonus3Triggers + bonus4Triggers) / ROUNDS;

const bonusShare = totalWinX > 0 ? (totalBonusWinX / totalWinX) * 100 : 0;

const report = `
=== ${config.id.toUpperCase()} ROUND SIMULATION (5,000,000) ===
Seed: 1337
Rounds: ${ROUNDS.toLocaleString()}

Elapsed: ${elapsedSec.toFixed(1)}s
Rounds/sec: ${(ROUNDS / elapsedSec).toFixed(0)}

RTP: ${(rtp * 100).toFixed(4)} %
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

Max Observed Win (xBet): ${maxWinX.toFixed(2)}
`;

console.log(report);
fs.writeFileSync("stats_5m.txt", report);
