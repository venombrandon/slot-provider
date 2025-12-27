import { RNG } from "../rng/rng";
import { SlotConfig, Mode } from "../types";
import { spinGrid } from "../spin";
import { evalPaylines } from "../eval/evalLines";
import { resolveSpinWin } from "../eval/resolveSpinWin";
import { featureRegistry } from "../features/registry";
import { FeatureContext } from "../features/types";

export interface RoundResult {
  baseWinX: number;
  bonusWinX: number;
  totalWinX: number;
  triggered: null | "bonus3" | "bonus4";
  scatterCountBase: number;
}

export function playRoundBase(
  config: SlotConfig,
  rng: RNG,
  mode: "base" | "extraBet" = "base"
): RoundResult {
  // 1) Base spin
  const baseRes = spinGrid(config, rng, mode);
  const wildTable = config.weights.wildMultiplier[mode];
  const baseLineWins = evalPaylines(
    config,
    baseRes.grid,
    config.paylines,
    rng,
    wildTable
  );
  const baseWin = resolveSpinWin(config, baseLineWins).totalWinX;

  // 2) Features anwenden
  let bonusWinX = 0;
  let triggered: RoundResult["triggered"] = null;

  const ctx: FeatureContext = {
    config,
    rng,
    mode,
    baseSpin: baseRes,
    baseLineWins,
    baseWinX: baseWin,
  };

  for (const featureId of config.features ?? []) {
    const feature = featureRegistry[featureId];
    if (!feature) continue;

    const out = feature.apply(ctx);
    if (!out) continue;

    if (typeof out.bonusWinX === "number") bonusWinX += out.bonusWinX;
    if (out.triggered) triggered = out.triggered;
  }

  // 3) Total
  const totalWinX = baseWin + bonusWinX;

  return {
    baseWinX: baseWin,
    bonusWinX,
    totalWinX,
    triggered,
    scatterCountBase: baseRes.scatterCount,
  };
}
