"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.store = exports.MemoryStore = void 0;
class MemoryStore {
    constructor() {
        this.sessions = new Map();
        this.rounds = new Map(); // key = `${sessionId}:${roundId}`
        this.demoBalances = new Map(); // sessionId -> cents
    }
    roundKey(sessionId, roundId) {
        return `${sessionId}:${roundId}`;
    }
    getOrCreateDemoBalance(sessionId, startCents) {
        if (!this.demoBalances.has(sessionId))
            this.demoBalances.set(sessionId, startCents);
        return this.demoBalances.get(sessionId);
    }
    setDemoBalance(sessionId, cents) {
        this.demoBalances.set(sessionId, cents);
    }
    getDemoBalance(sessionId) {
        const v = this.demoBalances.get(sessionId);
        if (typeof v !== "number")
            throw new Error("DEMO_BALANCE_NOT_FOUND");
        return v;
    }
    getRound(sessionId, roundId) {
        return this.rounds.get(this.roundKey(sessionId, roundId));
    }
    setRound(round) {
        this.rounds.set(this.roundKey(round.sessionId, round.roundId), round);
    }
}
exports.MemoryStore = MemoryStore;
exports.store = new MemoryStore();
