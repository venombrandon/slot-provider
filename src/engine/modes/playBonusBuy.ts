import { RNG } from "../rng/rng";
import { SlotConfig } from "../types";
import { runBonus3 } from "../bonus/runBonus3";
import { runBonus4 } from "../bonus/runBonus4";

export type BonusBuyType = "bonus3" | "bonus4";

export interface BonusBuyResult {
  buyType: BonusBuyType;
  costX: number; // Buy cost in xBet (BaseBet-basiert)
  winX: number; // Bonus win in xBet (BaseBet-basiert)
  rtpPerCost: number; // winX / costX
}

export function playBonusBuy(
  config: SlotConfig,
  rng: RNG,
  buyType: BonusBuyType
): BonusBuyResult {
  const buyRules = config.rules.bonusBuy;
  if (!buyRules) {
    throw new Error(`Slot ${config.id} has no rules.bonusBuy configured.`);
  }

  let costX = 0;
  let winX = 0;

  if (buyType === "bonus3") {
    costX = buyRules.bonus3CostX;
    winX = runBonus3(config, rng, "buy").totalWinX; // ✅ buy
  } else {
    costX = buyRules.bonus4CostX;
    winX = runBonus4(config, rng, "buy").totalWinX; // ✅ buy
  }

  return {
    buyType,
    costX,
    winX,
    rtpPerCost: costX > 0 ? winX / costX : 0,
  };
}
