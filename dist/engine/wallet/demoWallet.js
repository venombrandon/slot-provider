"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoWallet = void 0;
class DemoWallet {
    constructor(defaultBalance = 100000) {
        this.defaultBalance = defaultBalance;
        this.balances = new Map();
    } // z.B. 1000.00€
    async getBalance(playerId) {
        return this.balances.get(playerId) ?? this.defaultBalance;
    }
    async debit(playerId, amount, _ref) {
        const b = await this.getBalance(playerId);
        if (b < amount)
            throw new Error("INSUFFICIENT_BALANCE");
        this.balances.set(playerId, b - amount);
    }
    async credit(playerId, amount, _ref) {
        const b = await this.getBalance(playerId);
        this.balances.set(playerId, b + amount);
    }
}
exports.DemoWallet = DemoWallet;
