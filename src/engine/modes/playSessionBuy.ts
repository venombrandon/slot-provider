import { SlotConfig } from "../types";
import { playBonusBuy, BonusBuyType } from "./playBonusBuy";
import { FairSession, rngForNextRound } from "../fair/seed";

export function playSessionBuy(
  config: SlotConfig,
  session: FairSession,
  buyType: BonusBuyType
) {
  const { rng } = rngForNextRound(session, { context: `buy:${buyType}` });
  return playBonusBuy(config, rng, buyType);
}
