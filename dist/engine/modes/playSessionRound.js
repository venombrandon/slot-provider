"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playSessionRound = playSessionRound;
const playRound_1 = require("./playRound");
const seed_1 = require("../fair/seed");
function playSessionRound(config, session, mode) {
    const { rng } = (0, seed_1.rngForNextRound)(session, { context: `spin:${mode}` });
    return (0, playRound_1.playRoundBase)(config, rng, mode);
}
