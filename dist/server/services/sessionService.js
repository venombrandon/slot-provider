"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startDemoSession = startDemoSession;
exports.getSession = getSession;
const seed_1 = require("../../engine/fair/seed");
const memoryStore_1 = require("../store/memoryStore");
function startDemoSession(params) {
    const session = (0, seed_1.createSession)({
        mode: "demo",
        clientSeed: params.clientSeed ?? `demo-client-${params.playerId}`,
        serverSeed: params.serverSeed, // if omitted: your createSession uses DEMO default
    });
    // make sure hash matches (defensive)
    session.serverSeedHash = (0, seed_1.sha256Hex)(session.serverSeed);
    memoryStore_1.store.sessions.set(session.id, session);
    // ✅ balance pro session initialisieren
    memoryStore_1.store.getOrCreateDemoBalance(session.id, params.startBalanceCents);
    return session;
}
function getSession(sessionId) {
    const s = memoryStore_1.store.sessions.get(sessionId);
    if (!s)
        throw new Error("SESSION_NOT_FOUND");
    return s;
}
