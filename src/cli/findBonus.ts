import { RNG } from "../engine/rng/rng";
import { spinGrid } from "../engine/spin";
import { runBonus3Debug } from "../engine/bonus/runBonus3Debug";
import { loadSlotFromArg } from "./_loadSlot";

const rng = new RNG(66626882321); // ändere Seed wenn du willst
const config = loadSlotFromArg();

let spins = 0;

while (true) {
  spins++;
  const res = spinGrid(config, rng, "base");

  if (res.scatterCount >= 3) {
    console.log(`\n=== BONUS TRIGGERED after ${spins} base spins ===`);
    console.log(`ScatterCount: ${res.scatterCount}`);
    console.log(`Stops: ${res.stops}\n`);

    // Bonus jetzt spin für spin ausgeben
    runBonus3Debug(config, rng);
    break;
  }

  // optional: alle 1000 spins status
  if (spins % 1000 === 0) {
    console.log(`...still searching, base spins=${spins}`);
  }
}
