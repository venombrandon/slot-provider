"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealWallet = void 0;
class RealWallet {
    constructor(startBalanceCents = 0) {
        this.balances = new Map();
    }
    async getBalance(playerId) {
        return this.balances.get(playerId) ?? 0;
    }
    async debit(playerId, amountCents, _roundId) {
        const bal = await this.getBalance(playerId);
        if (bal < amountCents)
            throw new Error("INSUFFICIENT_FUNDS");
        this.balances.set(playerId, bal - amountCents);
    }
    async credit(playerId, amountCents, _roundId) {
        const bal = await this.getBalance(playerId);
        this.balances.set(playerId, bal + amountCents);
    }
    // helper for local tests
    setBalance(playerId, cents) {
        this.balances.set(playerId, cents);
    }
}
exports.RealWallet = RealWallet;
