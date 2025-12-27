"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApi = buildApi;
const express_1 = __importDefault(require("express"));
const sessionService_1 = require("./services/sessionService");
const gameService_1 = require("./services/gameService");
function buildApi() {
    const app = (0, express_1.default)();
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
    return app;
}
