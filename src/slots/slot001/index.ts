import { SlotConfig } from "../../engine/types";
import {
  baseReels,
  bonus3BuyReels,
  bonus3Reels,
  bonus4BuyReels,
  bonus4Reels,
  extraBetReels,
} from "./reels";
import { paylines } from "./paylines";
import { paytable } from "./paytable";
import {
  wildMultBase,
  wildMultExtraBet,
  wildMultBonus3,
  wildMultBonus4,
  wildMultBonus3Buy,
  wildMultBonus4Buy,
} from "./weights";

export const slot001: SlotConfig = {
  id: "slot001",
  grid: { reels: 5, rows: 5 },
  stopsPerReel: 50,

  paylines, // ✅ deine 19 Linien
  paytable,

  symbols: {
    low: ["10", "J", "Q", "K", "A"],
    high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
    wild: "WILD",
    scatter: "SCATTER",
  },

  // TARGET: Bonus4 Buy RTP per cost ≈ 95% @ costX=250 (seed 1337, 100k runs ~95.17%)
  reelSets: {
    base: baseReels,
    extraBet: extraBetReels, // später eigenes ReelSet
    bonus3: bonus3Reels, // später eigenes ReelSet
    bonus4: bonus4Reels, // später eigenes ReelSet
    bonus3Buy: bonus3BuyReels,
    bonus4Buy: bonus4BuyReels,
  },

  weights: {
    wildMultiplier: {
      base: wildMultBase,
      extraBet: wildMultExtraBet,
      bonus3: wildMultBonus3,
      bonus4: wildMultBonus4,
      bonus3Buy: wildMultBonus3Buy,
      bonus4Buy: wildMultBonus4Buy,
    },
  },

  features: ["bonusTrigger"],

  rules: {
    maxWinX: 10000,
    extraBet: {
      costMultiplier: 3,
      bonus4ShareOn4Scatters: 0.18,
    },
    bonusBuy: {
      bonus3CostX: 100,
      bonus4CostX: 250,
    },
  },
};
