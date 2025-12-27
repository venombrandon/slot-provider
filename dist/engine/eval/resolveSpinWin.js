"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSpinWin = resolveSpinWin;
function resolveSpinWin(config, lineWins) {
    const raw = lineWins.reduce((sum, w) => sum + w.winX, 0);
    const cap = config.rules.maxWinX;
    if (raw > cap) {
        return { totalWinX: cap, capped: true, capAppliedX: cap };
    }
    return { totalWinX: raw, capped: false, capAppliedX: raw };
}
