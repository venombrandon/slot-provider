import { RNG } from "./rng/rng";
import { SlotConfig, SymbolId, ReelSet } from "./types";
import { viewWindow } from "./reels/viewWindow";

export interface SpinResult {
  stops: number[];
  grid: SymbolId[][];
  scatterCount: number;
}

export function spinGrid(
  config: SlotConfig,
  rng: RNG,
  reelSetKey: keyof SlotConfig["reelSets"]
): SpinResult {
  const reelSet = config.reelSets[reelSetKey];
  if (!reelSet)
    throw new Error(`Missing reelSet "${String(reelSetKey)}" in ${config.id}`);
  return spinGridWithReels(config, rng, reelSet);
}

// ✅ NEU: direkte Reels
export function spinGridWithReels(
  config: SlotConfig,
  rng: RNG,
  reelSet: ReelSet
): SpinResult {
  const { reels, rows } = config.grid;

  const stops: number[] = [];
  const grid: SymbolId[][] = [];
  let scatterCount = 0;

  for (let i = 0; i < reels; i++) {
    const reel = reelSet.reels[i];
    const stop = rng.int(reel.length);
    stops.push(stop);

    const window = viewWindow(reel, stop, rows);
    grid.push(window);

    for (const sym of window) {
      if (sym === config.symbols.scatter) scatterCount++;
    }
  }

  return { stops, grid, scatterCount };
}
