"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256Hex = sha256Hex;
exports.hmacSha256Hex = hmacSha256Hex;
exports.createSession = createSession;
exports.rngForNextRound = rngForNextRound;
const crypto_1 = __importDefault(require("crypto"));
const rng_1 = require("../rng/rng");
function sha256Hex(input) {
    return crypto_1.default.createHash("sha256").update(input, "utf8").digest("hex");
}
function hmacSha256Hex(key, msg) {
    return crypto_1.default.createHmac("sha256", key).update(msg, "utf8").digest("hex");
}
function createSession(params) {
    const mode = params.mode;
    const serverSeed = params.serverSeed ??
        (mode === "demo"
            ? "DEMO_SERVER_SEED_v1"
            : crypto_1.default.randomBytes(32).toString("hex"));
    const clientSeed = params.clientSeed ?? "client_default";
    const serverSeedHash = sha256Hex(serverSeed);
    return {
        id: crypto_1.default.randomBytes(8).toString("hex"),
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
function rngForNextRound(session, opts) {
    const nonceUsed = session.nonce;
    const msg = `${session.clientSeed}:${nonceUsed}:${opts.context}`;
    const hex = hmacSha256Hex(session.serverSeed, msg);
    // Take first 8 hex chars => 32-bit unsigned seed
    const seed32 = parseInt(hex.slice(0, 8), 16) >>> 0;
    // increment nonce AFTER deriving
    session.nonce++;
    return { rng: new rng_1.RNG(seed32), nonceUsed, seed32, msg };
}
