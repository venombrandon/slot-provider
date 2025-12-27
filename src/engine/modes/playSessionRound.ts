import { SlotConfig } from "../types";
import { playRoundBase } from "./playRound";
import { FairSession, rngForNextRound } from "../fair/seed";

export function playSessionRound(
  config: SlotConfig,
  session: FairSession,
  mode: "base" | "extraBet"
) {
  const { rng } = rngForNextRound(session, { context: `spin:${mode}` });
  return playRoundBase(config, rng, mode);
}
