import { SlotConfig } from "../types";

export type RoundMode = "base" | "extraBet";
export type BuyType = "bonus3" | "bonus4";

export function calcSpinCost(
  config: SlotConfig,
  baseBet: number,
  mode: RoundMode
): number {
  const mult =
    mode === "extraBet" ? config.rules.extraBet?.costMultiplier ?? 3 : 1;
  return baseBet * mult;
}

export function calcBuyCost(
  config: SlotConfig,
  baseBet: number,
  buyType: BuyType
): number {
  const rules = config.rules.bonusBuy;
  if (!rules) throw new Error("BONUS_BUY_DISABLED");
  const costX = buyType === "bonus3" ? rules.bonus3CostX : rules.bonus4CostX;
  return baseBet * costX;
}
