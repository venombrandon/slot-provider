"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSlotFromArg = loadSlotFromArg;
const slots_1 = require("../slots");
function loadSlotFromArg() {
    const arg = (process.argv[2] ?? "slot001");
    const cfg = slots_1.slots[arg];
    if (!cfg) {
        const available = Object.keys(slots_1.slots).join(", ");
        throw new Error(`Unknown slot "${arg}". Available: ${available}`);
    }
    return cfg;
}
