"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wildMultBonus4Buy = exports.wildMultBonus3Buy = exports.wildMultBonus4 = exports.wildMultBonus3 = exports.wildMultExtraBet = exports.wildMultBase = void 0;
// Wichtig: weights als "Zahlen", nicht Prozent. 70 statt 70%
exports.wildMultBase = [
    { value: 1, weight: 70.3 },
    { value: 2, weight: 12.0 },
    { value: 3, weight: 7.0 },
    { value: 5, weight: 5.1 },
    { value: 10, weight: 2.8 },
    { value: 20, weight: 1.3 },
    { value: 30, weight: 0.8 },
    { value: 50, weight: 0.5 },
    { value: 100, weight: 0.18 },
    { value: 200, weight: 0.02 },
];
exports.wildMultExtraBet = [
    { value: 1, weight: 60.0 },
    { value: 2, weight: 17.0 },
    { value: 3, weight: 9.0 },
    { value: 5, weight: 6.0 },
    { value: 10, weight: 4.0 },
    { value: 20, weight: 2.5 },
    { value: 30, weight: 1.0 },
    { value: 50, weight: 0.3 },
    { value: 100, weight: 0.15 },
    { value: 200, weight: 0.05 },
];
exports.wildMultBonus3 = [
    { value: 1, weight: 62.5 },
    { value: 2, weight: 14.0 },
    { value: 3, weight: 8.0 },
    { value: 5, weight: 6.0 },
    { value: 10, weight: 4.0 },
    { value: 20, weight: 2.5 },
    { value: 30, weight: 1.5 },
    { value: 50, weight: 1.0 },
    { value: 100, weight: 0.45 },
    { value: 200, weight: 0.05 },
];
exports.wildMultBonus4 = [
    { value: 1, weight: 77.99 },
    { value: 2, weight: 11.0 },
    { value: 3, weight: 6.0 },
    { value: 5, weight: 3.0 },
    { value: 10, weight: 1.5 },
    { value: 20, weight: 0.4 },
    { value: 30, weight: 0.08 },
    { value: 50, weight: 0.02 },
    { value: 100, weight: 0.008 },
    { value: 200, weight: 0.002 },
];
// FINAL – bonus3 BUY
// Target RTP: 96.30%
// Do not touch unless core mechanics change
exports.wildMultBonus3Buy = [
    { value: 1, weight: 58.24 },
    { value: 2, weight: 18.0 },
    { value: 3, weight: 10.0 },
    { value: 5, weight: 6.0 },
    { value: 10, weight: 3.5 },
    { value: 20, weight: 2.0 },
    { value: 30, weight: 1.0 },
    { value: 50, weight: 0.79 },
    { value: 100, weight: 0.53 },
    { value: 200, weight: 0.13 },
];
exports.wildMultBonus4Buy = [
    { value: 1, weight: 73.65 }, // +0.06
    { value: 2, weight: 13.26 }, // -0.04
    { value: 3, weight: 7.28 }, // -0.02
    { value: 5, weight: 3.8 },
    { value: 10, weight: 1.5 },
    { value: 20, weight: 0.4 },
    { value: 30, weight: 0.08 },
    { value: 50, weight: 0.02 },
    { value: 100, weight: 0.008 },
    { value: 200, weight: 0.002 },
];
