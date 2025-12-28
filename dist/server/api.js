"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApi = buildApi;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sessionService_1 = require("./services/sessionService");
const gameService_1 = require("./services/gameService");
const demoWalletService_1 = require("./services/demoWalletService");
const betLadder_1 = require("../engine/bet/betLadder");
const memoryStore_1 = require("./store/memoryStore");
function buildApi() {
    const app = (0, express_1.default)();
    // ✅ CORS zuerst
    app.use((0, cors_1.default)({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key"],
    }));
    // ✅ JSON parser MUSS vor den POST routes
    app.use(express_1.default.json());
    app.post("/api/demo/session/start", (req, res) => {
        const { playerId, clientSeed, serverSeed, startBalanceCents } = req.body;
        const session = (0, sessionService_1.startDemoSession)({
            playerId,
            clientSeed,
            serverSeed,
            startBalanceCents: startBalanceCents ?? 100000,
        });
        res.json({
            sessionId: session.id,
            mode: session.mode,
            serverSeedHash: session.serverSeedHash,
            clientSeed: session.clientSeed,
            nonce: session.nonce,
        });
    });
    app.post("/api/demo/spin", (req, res) => {
        try {
            const out = (0, gameService_1.demoSpin)(req.body);
            res.json(out);
        }
        catch (e) {
            res.status(400).json({ error: e?.message ?? "UNKNOWN_ERROR" });
        }
    });
    app.post("/api/demo/buy", (req, res) => {
        try {
            const out = (0, gameService_1.demoBuy)(req.body);
            res.json(out);
        }
        catch (e) {
            res.status(400).json({ error: e?.message ?? "UNKNOWN_ERROR" });
        }
    });
    app.post("/api/demo/session/reveal", (req, res) => {
        try {
            const { sessionId } = req.body;
            const session = (0, sessionService_1.getSession)(sessionId);
            res.json({
                sessionId: session.id,
                serverSeed: session.serverSeed,
                serverSeedHash: session.serverSeedHash,
                clientSeed: session.clientSeed,
                finalNonce: session.nonce,
            });
        }
        catch (e) {
            res.status(400).json({ error: e?.message ?? "UNKNOWN_ERROR" });
        }
    });
    app.get("/api/demo/balance", (req, res) => {
        try {
            const playerId = String(req.query.playerId ?? "");
            if (!playerId)
                throw new Error("MISSING_PLAYER_ID");
            res.json({ playerId, balanceCents: (0, demoWalletService_1.getDemoBalance)(playerId) });
        }
        catch (e) {
            res.status(400).json({ error: e?.message ?? "UNKNOWN_ERROR" });
        }
    });
    app.get("/api/meta/bets", (_req, res) => {
        res.json({ betCents: betLadder_1.BET_LADDER_CENTS });
    });
    app.get("/api/demo/rounds", (req, res) => {
        try {
            const sessionId = String(req.query.sessionId ?? "");
            if (!sessionId)
                throw new Error("MISSING_SESSION_ID");
            const rounds = [...memoryStore_1.store.rounds.values()]
                .filter((r) => r.sessionId === sessionId)
                .sort((a, b) => a.createdAt - b.createdAt)
                .map((r) => ({
                roundId: r.roundId,
                kind: r.kind,
                mode: r.mode,
                buyType: r.buyType,
                betCents: r.betCents,
                costCents: r.costCents,
                payoutCents: r.payoutCents,
                provablyFair: r.provablyFair,
                createdAt: r.createdAt,
            }));
            res.json({ sessionId, rounds });
        }
        catch (e) {
            res.status(400).json({ error: e?.message ?? "UNKNOWN_ERROR" });
        }
    });
    return app;
}
