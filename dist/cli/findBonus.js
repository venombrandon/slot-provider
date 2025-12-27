"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rng_1 = require("../engine/rng/rng");
const spin_1 = require("../engine/spin");
const runBonus3Debug_1 = require("../engine/bonus/runBonus3Debug");
const _loadSlot_1 = require("./_loadSlot");
const rng = new rng_1.RNG(66626882321); // ändere Seed wenn du willst
const config = (0, _loadSlot_1.loadSlotFromArg)();
let spins = 0;
while (true) {
    spins++;
    const res = (0, spin_1.spinGrid)(config, rng, "base");
    if (res.scatterCount >= 3) {
        console.log(`\n=== BONUS TRIGGERED after ${spins} base spins ===`);
        console.log(`ScatterCount: ${res.scatterCount}`);
        console.log(`Stops: ${res.stops}\n`);
        // Bonus jetzt spin für spin ausgeben
        (0, runBonus3Debug_1.runBonus3Debug)(config, rng);
        break;
    }
    // optional: alle 1000 spins status
    if (spins % 1000 === 0) {
        console.log(`...still searching, base spins=${spins}`);
    }
}
