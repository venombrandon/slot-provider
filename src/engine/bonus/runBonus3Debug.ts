import { RNG } from "../rng/rng";
import { SlotConfig } from "../types";
import { spinGrid } from "../spin";
import { evalPaylines } from "../eval/evalLines";
import { resolveSpinWin } from "../eval/resolveSpinWin";

function printGrid(config: SlotConfig, grid: string[][]) {
  for (let row = 0; row < config.grid.rows; row++) {
    const line: string[] = [];
    for (let reel = 0; reel < config.grid.reels; reel++) {
      line.push(grid[reel][row].padEnd(7));
    }
    console.log(line.join(" "));
  }
}

export function runBonus3Debug(config: SlotConfig, rng: RNG) {
  let spinsLeft = 10;
  let retriggerEvents = 0;

  let totalWinX = 0;
  let spinIndex = 0;

  console.log("\n=== BONUS3 START (10 FS) ===\n");

  while (spinsLeft > 0) {
    spinsLeft--;
    spinIndex++;

    const res = spinGrid(config, rng, "bonus3");
    const wildTable = config.weights.wildMultiplier.bonus3;
    const wins = evalPaylines(
      config,
      res.grid,
      config.paylines,
      rng,
      wildTable
    );

    const spinWin = resolveSpinWin(config, wins);

    totalWinX += spinWin.totalWinX;

    console.log(
      `--- FS ${spinIndex} | winX=${spinWin.totalWinX.toFixed(2)} | scatters=${
        res.scatterCount
      } | left(after)=${spinsLeft} ---`
    );
    printGrid(config, res.grid);

    if (wins.length > 0) {
      console.log("Line wins:");
      for (const w of wins) {
        console.log(
          `  Line ${w.lineId}: ${w.symbol} x${w.count} base=${
            w.baseWinX
          } wilds=${w.wildCount} [${w.wildMultis.join("+") || "-"}] => multi=${
            w.lineMulti
          } winX=${w.winX}`
        );
      }
    }

    // Retrigger Logik
    if (retriggerEvents < 3) {
      if (res.scatterCount === 2) {
        spinsLeft += 2;
        retriggerEvents++;
        console.log(`>>> RETRIGGER: +2 FS (events ${retriggerEvents}/3)`);
      } else if (res.scatterCount >= 3) {
        spinsLeft += 4;
        retriggerEvents++;
        console.log(`>>> RETRIGGER: +4 FS (events ${retriggerEvents}/3)`);
      }
    }

    console.log(`Running total bonus winX: ${totalWinX.toFixed(2)}\n`);
  }

  console.log(
    `=== BONUS3 END | spins=${spinIndex} | retriggers=${retriggerEvents} | totalWinX=${totalWinX.toFixed(
      2
    )} ===\n`
  );

  return { spins: spinIndex, retriggers: retriggerEvents, totalWinX };
}
