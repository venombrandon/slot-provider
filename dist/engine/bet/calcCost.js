"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcSpinCost = calcSpinCost;
exports.calcBuyCost = calcBuyCost;
function calcSpinCost(config, baseBet, mode) {
    const mult = mode === "extraBet" ? config.rules.extraBet?.costMultiplier ?? 3 : 1;
    return baseBet * mult;
}
function calcBuyCost(config, baseBet, buyType) {
    const rules = config.rules.bonusBuy;
    if (!rules)
        throw new Error("BONUS_BUY_DISABLED");
    const costX = buyType === "bonus3" ? rules.bonus3CostX : rules.bonus4CostX;
    return baseBet * costX;
}
