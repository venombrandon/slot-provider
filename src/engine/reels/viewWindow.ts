import { SymbolId } from "../types";

export function viewWindow(
  reel: SymbolId[],
  stopIndex: number,
  rows: number
): SymbolId[] {
  // stopIndex ist die "Mitte" des Fensters
  const n = reel.length;
  const half = Math.floor(rows / 2);

  const window: SymbolId[] = [];
  for (let r = -half; r <= half; r++) {
    const idx = (stopIndex + r + n) % n;
    window.push(reel[idx]);
  }
  return window;
}
