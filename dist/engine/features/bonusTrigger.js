"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bonusTriggerFeature = void 0;
const runBonus3_1 = require("../bonus/runBonus3");
const runBonus4_1 = require("../bonus/runBonus4");
exports.bonusTriggerFeature = {
    id: "bonusTrigger",
    apply(ctx) {
        const scat = ctx.baseSpin.scatterCount;
        // 4 Scatter priorisiert
        if (scat >= 4) {
            if (ctx.mode === "extraBet") {
                const BONUS4_SHARE = ctx.config.rules.extraBet?.bonus4ShareOn4Scatters ?? 1;
                const roll = ctx.rng.next();
                if (roll >= BONUS4_SHARE) {
                    const res3 = (0, runBonus3_1.runBonus3)(ctx.config, ctx.rng, "trigger");
                    return { triggered: "bonus3", bonusWinX: res3.totalWinX };
                }
            }
            const res4 = (0, runBonus4_1.runBonus4)(ctx.config, ctx.rng);
            return { triggered: "bonus4", bonusWinX: res4.totalWinX };
        }
        if (scat >= 3) {
            const res = (0, runBonus3_1.runBonus3)(ctx.config, ctx.rng, "trigger");
            return { triggered: "bonus3", bonusWinX: res.totalWinX };
        }
        return null;
    },
};
