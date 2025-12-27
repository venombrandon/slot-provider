import { SlotConfig } from "../types";
import { LineWin } from "./evalLines";

export interface SpinWin {
  totalWinX: number; // Summe der Liniengewinne (in xBet)
  capped: boolean; // ob Cap gegriffen hat
  capAppliedX: number; // falls capped, auf welchen Wert begrenzt
}

export function resolveSpinWin(
  config: SlotConfig,
  lineWins: LineWin[]
): SpinWin {
  const raw = lineWins.reduce((sum, w) => sum + w.winX, 0);

  const cap = config.rules.maxWinX;
  if (raw > cap) {
    return { totalWinX: cap, capped: true, capAppliedX: cap };
  }
  return { totalWinX: raw, capped: false, capAppliedX: raw };
}
