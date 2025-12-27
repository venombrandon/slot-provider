"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewWindow = viewWindow;
function viewWindow(reel, stopIndex, rows) {
    // stopIndex ist die "Mitte" des Fensters
    const n = reel.length;
    const half = Math.floor(rows / 2);
    const window = [];
    for (let r = -half; r <= half; r++) {
        const idx = (stopIndex + r + n) % n;
        window.push(reel[idx]);
    }
    return window;
}
