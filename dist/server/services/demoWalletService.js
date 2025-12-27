"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDemoWallet = ensureDemoWallet;
exports.getDemoBalance = getDemoBalance;
exports.debitDemo = debitDemo;
exports.creditDemo = creditDemo;
const memoryStore_1 = require("../store/memoryStore");
function ensureDemoWallet(sessionId, startCents = 100000) {
    memoryStore_1.store.getOrCreateDemoBalance(sessionId, startCents);
}
function getDemoBalance(sessionId) {
    return memoryStore_1.store.getOrCreateDemoBalance(sessionId, 100000);
}
function debitDemo(sessionId, amountCents) {
    const bal = getDemoBalance(sessionId);
    if (bal < amountCents)
        throw new Error("INSUFFICIENT_FUNDS");
    memoryStore_1.store.demoBalances.set(sessionId, bal - amountCents);
    return bal - amountCents;
}
function creditDemo(sessionId, amountCents) {
    const bal = getDemoBalance(sessionId);
    memoryStore_1.store.demoBalances.set(sessionId, bal + amountCents);
    return bal + amountCents;
}
