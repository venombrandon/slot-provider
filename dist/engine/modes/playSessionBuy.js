"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playSessionBuy = playSessionBuy;
const playBonusBuy_1 = require("./playBonusBuy");
const seed_1 = require("../fair/seed");
function playSessionBuy(config, session, buyType) {
    const { rng } = (0, seed_1.rngForNextRound)(session, { context: `buy:${buyType}` });
    return (0, playBonusBuy_1.playBonusBuy)(config, rng, buyType);
}
