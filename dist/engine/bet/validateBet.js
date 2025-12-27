"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBetSize = validateBetSize;
const betLadder_1 = require("./betLadder");
function validateBetSize(baseBet) {
    if (!(0, betLadder_1.isValidBetSize)(baseBet)) {
        throw new Error(`INVALID_BET_SIZE: ${baseBet}`);
    }
}
