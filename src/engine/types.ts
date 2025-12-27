export type ReelSetKey =
  | "base"
  | "extraBet"
  | "bonus3"
  | "bonus4"
  | "bonus3Buy"
  | "bonus4Buy";

export type Mode = "base" | "extraBet" | "bonus3" | "bonus4";

export type SymbolId = string;

export type PayKey = string;

export interface ReelSet {
  reels: SymbolId[][];
}

export interface Payline {
  id: number;
  positions: [number, number][]; // [reelIndex, rowIndex]
}

export interface WeightTable<T> {
  value: T;
  weight: number;
}

export interface SlotConfig {
  id: string;
  grid: { reels: number; rows: number };
  stopsPerReel: number;
  paylines: Payline[];
  features?: string[];

  symbols: {
    low: SymbolId[];
    high: SymbolId[];
    wild: SymbolId;
    scatter: SymbolId;
  };

  paytable: Record<PayKey, { 3: number; 4: number; 5: number }>;

  reelSets: Record<ReelSetKey, ReelSet>;

  weights: {
    wildMultiplier: {
      base: WeightTable<number>[];
      extraBet: WeightTable<number>[];
      bonus3: WeightTable<number>[];
      bonus4: WeightTable<number>[];

      bonus3Buy: WeightTable<number>[];
      bonus4Buy: WeightTable<number>[];
    };
  };

  rules: {
    maxWinX: number;
    extraBet?: {
      costMultiplier: number;
      bonus4ShareOn4Scatters: number;
    };
    bonusBuy?: {
      bonus3CostX: number;
      bonus4CostX: number;
    };
  };
}
