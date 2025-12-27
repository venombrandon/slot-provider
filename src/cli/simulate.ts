import { RNG } from "../engine/rng/rng";
import { spinGrid } from "../engine/spin";
import { evalPaylines } from "../engine/eval/evalLines";
import { resolveSpinWin } from "../engine/eval/resolveSpinWin";
import { loadSlotFromArg } from "./_loadSlot";

const rng = new RNG(12345);
const config = loadSlotFromArg();

for (let i = 0; i < 5000; i++) {
  const res = spinGrid(config, rng, "base");
  const wildTable = config.weights.wildMultiplier.base;
  const wins = evalPaylines(config, res.grid, config.paylines, rng, wildTable);

  const hasWildMulti = wins.some((w) => w.wildCount > 0 && w.lineMulti > 1);

  if (hasWildMulti) {
    console.log(
      "\n=== Found wild win on spin",
      i,
      "Stops:",
      res.stops,
      "Scatter:",
      res.scatterCount,
      "===\n"
    );

    for (let row = 0; row < config.grid.rows; row++) {
      const line: string[] = [];
      for (let reel = 0; reel < config.grid.reels; reel++) {
        line.push(res.grid[reel][row].padEnd(7));
      }
      console.log(line.join(" "));
    }

    console.log("\nLine wins:");
    for (const w of wins) {
      console.log(
        `Line ${w.lineId}: ${w.symbol} x${w.count} base=${w.baseWinX} wilds=${
          w.wildCount
        } [${w.wildMultis.join("+") || "-"}] => multi=${w.lineMulti} winX=${
          w.winX
        }`
      );
    }

    const spinWin = resolveSpinWin(config, wins);
    console.log(
      `Total spin winX: ${spinWin.totalWinX} (capped=${spinWin.capped})`
    );

    break;
  }
}

console.log("\nDone.");
