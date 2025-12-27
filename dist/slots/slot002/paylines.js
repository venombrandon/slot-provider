"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paylines = void 0;
// rows: 0..4 (0 = top, 4 = bottom)
// pattern = [rowOnReel0, rowOnReel1, rowOnReel2, rowOnReel3, rowOnReel4]
function makeLine(id, pattern) {
    return {
        id,
        positions: pattern.map((row, reel) => [reel, row]),
    };
}
exports.paylines = [
    makeLine(1, [0, 0, 0, 0, 0]),
    makeLine(2, [1, 1, 1, 1, 1]),
    makeLine(3, [2, 2, 2, 2, 2]),
    makeLine(4, [3, 3, 3, 3, 3]),
    makeLine(5, [4, 4, 4, 4, 4]),
    makeLine(6, [0, 1, 0, 1, 0]),
    makeLine(7, [1, 2, 1, 2, 1]),
    makeLine(8, [2, 3, 2, 3, 2]),
    makeLine(9, [3, 4, 3, 4, 3]),
    makeLine(10, [1, 0, 1, 0, 1]),
    makeLine(11, [2, 1, 2, 1, 2]),
    makeLine(12, [3, 2, 3, 2, 3]),
    makeLine(13, [4, 3, 4, 3, 4]),
    makeLine(14, [2, 1, 0, 1, 2]),
    makeLine(15, [3, 2, 1, 2, 3]),
    makeLine(16, [1, 2, 3, 2, 1]),
    makeLine(17, [2, 3, 4, 3, 2]),
    makeLine(18, [0, 1, 2, 3, 4]),
    makeLine(19, [4, 3, 2, 1, 0]),
];
