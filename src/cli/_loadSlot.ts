import { slots, SlotId } from "../slots";
import { SlotConfig } from "../engine/types";

export function loadSlotFromArg(): SlotConfig {
  const arg = (process.argv[2] ?? "slot001") as SlotId;
  const cfg = slots[arg];

  if (!cfg) {
    const available = Object.keys(slots).join(", ");
    throw new Error(`Unknown slot "${arg}". Available: ${available}`);
  }

  return cfg;
}
