"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBonus3 = runBonus3;
const spin_1 = require("../spin");
const evalLines_1 = require("../eval/evalLines");
const resolveSpinWin_1 = require("../eval/resolveSpinWin");
function runBonus3(config, rng, variant = "trigger") {
    const reels = variant === "buy"
        ? config.reelSets.bonus3Buy ?? config.reelSets.bonus3
        : config.reelSets.bonus3;
    const wildTable = variant === "buy"
        ? config.weights.wildMultiplier.bonus3Buy ??
            config.weights.wildMultiplier.bonus3
        : config.weights.wildMultiplier.bonus3;
    if (!wildTable || wildTable.length === 0) {
        throw new Error(`Missing wildTable for bonus3 ${variant} in ${config.id}`);
    }
    const maxWinX = config.rules.maxWinX;
    if (typeof maxWinX !== "number" || maxWinX <= 0) {
        throw new Error(`Invalid rules.maxWinX for ${config.id}`);
    }
    let spinsLeft = 10;
    let retriggerEvents = 0;
    let totalWinX = 0;
    let spinsPlayed = 0;
    const spinWins = [];
    while (spinsLeft > 0) {
        spinsLeft--;
        spinsPlayed++;
        const res = (0, spin_1.spinGridWithReels)(config, rng, reels);
        const wins = (0, evalLines_1.evalPaylines)(config, res.grid, config.paylines, rng, wildTable);
        const spinWin = (0, resolveSpinWin_1.resolveSpinWin)(config, wins);
        const remaining = maxWinX - totalWinX;
        if (remaining <= 0) {
            totalWinX = maxWinX;
            spinWins.push(0);
            break;
        }
        const add = Math.min(spinWin.totalWinX, remaining);
        totalWinX += add;
        spinWins.push(add);
        if (totalWinX >= maxWinX) {
            totalWinX = maxWinX;
            break;
        }
        if (retriggerEvents < 3) {
            if (res.scatterCount === 2) {
                spinsLeft += 2;
                retriggerEvents++;
            }
            else if (res.scatterCount >= 3) {
                spinsLeft += 4;
                retriggerEvents++;
            }
        }
    }
    return {
        bonusType: "bonus3",
        spinsPlayed,
        retriggerEvents,
        totalWinX,
        spinWins,
    };
}
