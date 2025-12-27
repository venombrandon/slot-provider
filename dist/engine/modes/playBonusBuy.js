"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playBonusBuy = playBonusBuy;
const runBonus3_1 = require("../bonus/runBonus3");
const runBonus4_1 = require("../bonus/runBonus4");
function playBonusBuy(config, rng, buyType) {
    const buyRules = config.rules.bonusBuy;
    if (!buyRules) {
        throw new Error(`Slot ${config.id} has no rules.bonusBuy configured.`);
    }
    let costX = 0;
    let winX = 0;
    if (buyType === "bonus3") {
        costX = buyRules.bonus3CostX;
        winX = (0, runBonus3_1.runBonus3)(config, rng, "buy").totalWinX; // ✅ buy
    }
    else {
        costX = buyRules.bonus4CostX;
        winX = (0, runBonus4_1.runBonus4)(config, rng, "buy").totalWinX; // ✅ buy
    }
    return {
        buyType,
        costX,
        winX,
        rtpPerCost: costX > 0 ? winX / costX : 0,
    };
}
