"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playRoundBase = playRoundBase;
const spin_1 = require("../spin");
const evalLines_1 = require("../eval/evalLines");
const resolveSpinWin_1 = require("../eval/resolveSpinWin");
const registry_1 = require("../features/registry");
function playRoundBase(config, rng, mode = "base") {
    // 1) Base spin
    const baseRes = (0, spin_1.spinGrid)(config, rng, mode);
    const wildTable = config.weights.wildMultiplier[mode];
    const baseLineWins = (0, evalLines_1.evalPaylines)(config, baseRes.grid, config.paylines, rng, wildTable);
    const baseWin = (0, resolveSpinWin_1.resolveSpinWin)(config, baseLineWins).totalWinX;
    // 2) Features anwenden
    let bonusWinX = 0;
    let triggered = null;
    const ctx = {
        config,
        rng,
        mode,
        baseSpin: baseRes,
        baseLineWins,
        baseWinX: baseWin,
    };
    for (const featureId of config.features ?? []) {
        const feature = registry_1.featureRegistry[featureId];
        if (!feature)
            continue;
        const out = feature.apply(ctx);
        if (!out)
            continue;
        if (typeof out.bonusWinX === "number")
            bonusWinX += out.bonusWinX;
        if (out.triggered)
            triggered = out.triggered;
    }
    // 3) Total
    const totalWinX = baseWin + bonusWinX;
    return {
        baseSpin: baseRes,
        baseLineWins: baseLineWins,
        baseWinX: baseWin,
        bonusWinX,
        totalWinX,
        triggered,
        scatterCountBase: baseRes.scatterCount,
    };
}
