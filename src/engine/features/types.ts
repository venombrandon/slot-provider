import { RNG } from "../rng/rng";
import { SlotConfig, SymbolId } from "../types";
import { LineWin } from "../eval/evalLines";

export type Mode = "base" | "extraBet" | "bonus3" | "bonus4";

export interface SpinResult {
  grid: SymbolId[][];
  stops: number[];
  scatterCount: number;
}

export interface FeatureContext {
  config: SlotConfig;
  rng: RNG;
  mode: "base" | "extraBet";

  // Ergebnisse vom Base Spin
  baseSpin: SpinResult;
  baseLineWins: LineWin[];
  baseWinX: number;
}

export interface FeatureOutcome {
  // z.B. Bonus Win, Gamble Win, etc.
  bonusWinX?: number;
  triggered?: null | "bonus3" | "bonus4";
}

export interface Feature {
  id: string;
  apply(ctx: FeatureContext): FeatureOutcome | null;
}
