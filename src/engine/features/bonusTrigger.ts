import { Feature } from "./types";
import { runBonus3 } from "../bonus/runBonus3";
import { runBonus4 } from "../bonus/runBonus4";

export const bonusTriggerFeature: Feature = {
  id: "bonusTrigger",
  apply(ctx) {
    const scat = ctx.baseSpin.scatterCount;

    // 4 Scatter priorisiert
    if (scat >= 4) {
      if (ctx.mode === "extraBet") {
        const BONUS4_SHARE =
          ctx.config.rules.extraBet?.bonus4ShareOn4Scatters ?? 1;

        const roll = ctx.rng.next();

        if (roll >= BONUS4_SHARE) {
          const res3 = runBonus3(ctx.config, ctx.rng, "trigger");
          return { triggered: "bonus3", bonusWinX: res3.totalWinX };
        }
      }

      const res4 = runBonus4(ctx.config, ctx.rng);
      return { triggered: "bonus4", bonusWinX: res4.totalWinX };
    }

    if (scat >= 3) {
      const res = runBonus3(ctx.config, ctx.rng, "trigger");
      return { triggered: "bonus3", bonusWinX: res.totalWinX };
    }

    return null;
  },
};
