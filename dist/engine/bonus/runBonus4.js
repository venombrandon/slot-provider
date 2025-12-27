"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBonus4 = runBonus4;
const spin_1 = require("../spin");
const evalLines_1 = require("../eval/evalLines");
const resolveSpinWin_1 = require("../eval/resolveSpinWin");
const drawWeighted_1 = require("../eval/drawWeighted");
function runBonus4(config, rng, variant = "trigger") {
    let spinsLeft = 10;
    let retriggerEvents = 0;
    let totalWinX = 0;
    let spinsPlayed = 0;
    // ✅ Reels auswählen (trigger vs buy)
    const reels = variant === "buy"
        ? config.reelSets.bonus4Buy ?? config.reelSets.bonus4
        : config.reelSets.bonus4;
    // ✅ Multi-Weights auswählen (trigger vs buy)
    const multiTable = variant === "buy"
        ? config.weights.wildMultiplier.bonus4Buy ??
            config.weights.wildMultiplier.bonus4
        : config.weights.wildMultiplier.bonus4;
    if (!reels)
        throw new Error(`Missing bonus4 reels for variant=${variant} in ${config.id}`);
    if (!multiTable || multiTable.length === 0) {
        throw new Error(`Missing bonus4 multiTable for variant=${variant} in ${config.id}`);
    }
    const maxWinX = config.rules.maxWinX;
    if (typeof maxWinX !== "number" || maxWinX <= 0) {
        throw new Error(`Invalid rules.maxWinX for ${config.id}`);
    }
    // Sticky Wild Multis: null = kein sticky wild, number = locked multi
    const wildMultGrid = Array.from({ length: config.grid.reels }, () => Array.from({ length: config.grid.rows }, () => null));
    while (spinsLeft > 0) {
        spinsLeft--;
        spinsPlayed++;
        // 1) Spin drehen (direkt mit ReelSet)
        const res = (0, spin_1.spinGridWithReels)(config, rng, reels);
        // 2) Sticky Wilds auf Grid kleben (locked positions überschreiben)
        for (let r = 0; r < config.grid.reels; r++) {
            for (let row = 0; row < config.grid.rows; row++) {
                if (wildMultGrid[r][row] != null) {
                    res.grid[r][row] = config.symbols.wild;
                }
            }
        }
        // 3) Neue Wilds locken (nur wenn Feld vorher nicht locked war)
        for (let r = 0; r < config.grid.reels; r++) {
            for (let row = 0; row < config.grid.rows; row++) {
                const sym = res.grid[r][row];
                if (sym === config.symbols.wild && wildMultGrid[r][row] == null) {
                    const m = (0, drawWeighted_1.drawWeighted)(rng, multiTable);
                    wildMultGrid[r][row] = m; // locked multi
                }
            }
        }
        // 4) Lines evaluieren
        // IMPORTANT:
        // - wildTable ist trotzdem nötig, falls in irgendeinem Modus "nicht-locked" wild multis gebraucht werden.
        // - In Bonus4 greifen wir aber bei wildMultGrid die locked multis.
        const wins = (0, evalLines_1.evalPaylines)(config, res.grid, config.paylines, rng, multiTable, // ✅ wird bei wildMultGrid nicht gezogen, aber Typ passt sauber
        wildMultGrid);
        const spinWin = (0, resolveSpinWin_1.resolveSpinWin)(config, wins);
        // ✅ GLOBAL BONUS CAP (maxWinX pro Feature/Bonus)
        const remaining = maxWinX - totalWinX;
        if (remaining <= 0) {
            totalWinX = maxWinX;
            break; // Bonus sofort beenden
        }
        const add = Math.min(spinWin.totalWinX, remaining);
        totalWinX += add;
        if (totalWinX >= maxWinX) {
            totalWinX = maxWinX;
            break; // Bonus sofort beenden
        }
        // 5) Retrigger (max 3 Events)
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
        bonusType: "bonus4",
        spinsPlayed,
        retriggerEvents,
        totalWinX,
    };
}
