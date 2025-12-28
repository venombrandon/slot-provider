import express from "express";
import cors from "cors";
import { startDemoSession, getSession } from "./services/sessionService";
import { demoSpin, demoBuy } from "./services/gameService";
import { getDemoBalance } from "./services/demoWalletService";
import { BET_LADDER_CENTS } from "../engine/bet/betLadder";
import { store } from "./store/memoryStore";

export function buildApi() {
  const app = express();

  // ✅ CORS zuerst
  app.use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Idempotency-Key"],
    })
  );

  // ✅ JSON parser MUSS vor den POST routes
  app.use(express.json());

  app.post("/api/demo/session/start", (req, res) => {
    const { playerId, clientSeed, serverSeed, startBalanceCents } =
      req.body as {
        playerId: string;
        clientSeed?: string;
        serverSeed?: string;
        startBalanceCents?: number;
      };

    const session = startDemoSession({
      playerId,
      clientSeed,
      serverSeed,
      startBalanceCents: startBalanceCents ?? 100_000,
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
      const out = demoSpin(req.body);
      res.json(out);
    } catch (e: any) {
      res.status(400).json({ error: e?.message ?? "UNKNOWN_ERROR" });
    }
  });

  app.post("/api/demo/buy", (req, res) => {
    try {
      const out = demoBuy(req.body);
      res.json(out);
    } catch (e: any) {
      res.status(400).json({ error: e?.message ?? "UNKNOWN_ERROR" });
    }
  });

  app.post("/api/demo/session/reveal", (req, res) => {
    try {
      const { sessionId } = req.body as { sessionId: string };
      const session = getSession(sessionId);
      res.json({
        sessionId: session.id,
        serverSeed: session.serverSeed,
        serverSeedHash: session.serverSeedHash,
        clientSeed: session.clientSeed,
        finalNonce: session.nonce,
      });
    } catch (e: any) {
      res.status(400).json({ error: e?.message ?? "UNKNOWN_ERROR" });
    }
  });

  app.get("/api/demo/balance", (req, res) => {
    try {
      const playerId = String(req.query.playerId ?? "");
      if (!playerId) throw new Error("MISSING_PLAYER_ID");
      res.json({ playerId, balanceCents: getDemoBalance(playerId) });
    } catch (e: any) {
      res.status(400).json({ error: e?.message ?? "UNKNOWN_ERROR" });
    }
  });

  app.get("/api/meta/bets", (_req, res) => {
    res.json({ betCents: BET_LADDER_CENTS });
  });

  app.get("/api/demo/rounds", (req, res) => {
    try {
      const sessionId = String(req.query.sessionId ?? "");
      if (!sessionId) throw new Error("MISSING_SESSION_ID");

      const rounds = [...store.rounds.values()]
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
    } catch (e: any) {
      res.status(400).json({ error: e?.message ?? "UNKNOWN_ERROR" });
    }
  });

  return app;
}
