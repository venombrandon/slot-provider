import crypto from "crypto";
import { RNG } from "../rng/rng";

export type GameMode = "demo" | "real";

export interface FairSession {
  id: string;
  mode: GameMode;

  // provably fair seeds
  serverSeed: string; // SECRET in real-mode
  serverSeedHash: string; // can be shown to user
  clientSeed: string; // can be user-controlled

  nonce: number; // increments each paid spin / buy
  createdAt: number;
}

export interface DeriveOptions {
  context: string; // e.g. "base", "extraBet", "buy:bonus3", "buy:bonus4"
}

export function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

export function hmacSha256Hex(key: string, msg: string): string {
  return crypto.createHmac("sha256", key).update(msg, "utf8").digest("hex");
}

export function createSession(params: {
  mode: GameMode;
  clientSeed?: string;
  // demo: allow fixed serverSeed for reproducibility
  serverSeed?: string;
}): FairSession {
  const mode = params.mode;
  const serverSeed =
    params.serverSeed ??
    (mode === "demo"
      ? "DEMO_SERVER_SEED_v1"
      : crypto.randomBytes(32).toString("hex"));

  const clientSeed = params.clientSeed ?? "client_default";
  const serverSeedHash = sha256Hex(serverSeed);

  return {
    id: crypto.randomBytes(8).toString("hex"),
    mode,
    serverSeed,
    serverSeedHash,
    clientSeed,
    nonce: 0,
    createdAt: Date.now(),
  };
}

/**
 * Derive a deterministic RNG from (serverSeed, clientSeed, nonce, context)
 * - In real mode: serverSeed is secret; user sees serverSeedHash first; reveal later if you want.
 * - In demo mode: fixed seeds => reproducible.
 */
export function rngForNextRound(
  session: FairSession,
  opts: DeriveOptions
): { rng: RNG; nonceUsed: number; seed32: number; msg: string } {
  const nonceUsed = session.nonce;

  const msg = `${session.clientSeed}:${nonceUsed}:${opts.context}`;
  const hex = hmacSha256Hex(session.serverSeed, msg);

  // Take first 8 hex chars => 32-bit unsigned seed
  const seed32 = parseInt(hex.slice(0, 8), 16) >>> 0;

  // increment nonce AFTER deriving
  session.nonce++;

  return { rng: new RNG(seed32), nonceUsed, seed32, msg };
}
