"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const _loadSlot_1 = require("./_loadSlot");
const demoWallet_1 = require("../engine/wallet/demoWallet");
const playRoundWithWallet_1 = require("../engine/modes/playRoundWithWallet");
const seed_1 = require("../engine/fair/seed");
const PLAYER_ID = "demo-user";
function parseMode(argv) {
    const m = (argv[3] ?? "base");
    if (m !== "base" && m !== "extraBet")
        throw new Error(`Invalid mode: ${m}`);
    return m;
}
function parseBetCents(argv) {
    const v = Number(argv[4] ?? 100);
    if (!Number.isFinite(v) || v <= 0)
        throw new Error(`Invalid betCents: ${argv[4]}`);
    return Math.floor(v);
}
function parseSpins(argv) {
    const n = Number(argv[5] ?? 100);
    if (!Number.isFinite(n) || n <= 0)
        throw new Error(`Invalid spins: ${argv[5]}`);
    return Math.floor(n);
}
function parseSeed(argv) {
    const s = Number(argv[6] ?? 1337);
    if (!Number.isFinite(s))
        throw new Error(`Invalid seed: ${argv[6]}`);
    return Math.floor(s);
}
(async () => {
    const config = (0, _loadSlot_1.loadSlotFromArg)();
    // usage:
    // node dist/cli/demoSessionSpins.js slot001 base 100 200 1337
    const mode = parseMode(process.argv);
    const betCents = parseBetCents(process.argv);
    const spins = parseSpins(process.argv);
    const seed = parseSeed(process.argv);
    // Wallet / Session
    const wallet = new demoWallet_1.DemoWallet(100000);
    // Make demo session reproducible per SEED (optional but nice):
    // We derive seeds from seed number to keep stable sessions across runs.
    const session = (0, seed_1.createSession)({
        mode: "demo",
        clientSeed: `demo-client-${seed}`,
        serverSeed: `DEMO_SERVER_SEED_v1_${seed}`,
    });
    const balanceStart = await wallet.getBalance(PLAYER_ID);
    let totalCost = 0;
    let totalWinX = 0;
    let bonus3 = 0;
    let bonus4 = 0;
    const rows = [];
    const t0 = Date.now();
    for (let i = 0; i < spins; i++) {
        const context = `spin:${mode}`;
        const { rng, nonceUsed, seed32, msg } = (0, seed_1.rngForNextRound)(session, {
            context,
        });
        const before = await wallet.getBalance(PLAYER_ID);
        const r = await (0, playRoundWithWallet_1.playRoundWithWallet)(config, rng, wallet, {
            playerId: PLAYER_ID,
            roundId: `round-${Date.now()}-${i}`,
            baseBet: betCents,
            mode,
        });
        const after = await wallet.getBalance(PLAYER_ID);
        totalCost += r.cost;
        totalWinX += r.result.totalWinX;
        if (r.result.triggered === "bonus3")
            bonus3++;
        if (r.result.triggered === "bonus4")
            bonus4++;
        rows.push({
            i,
            nonceUsed,
            seed32,
            msg,
            betCents,
            costCents: r.cost,
            winX: r.result.totalWinX,
            triggered: r.result.triggered,
            balanceBefore: before,
            balanceAfter: after,
        });
        // optional progress
        if ((i + 1) % Math.max(1, Math.floor(spins / 10)) === 0) {
            const done = i + 1;
            const avgWin = totalWinX / done;
            const rtpCost = totalCost > 0 ? (avgWin * betCents) / totalCost : 0; // careful: avgWin is xBet, cost is cents
            // This is just a rough progress, final calc below is correct.
            console.log(`[${done}/${spins}] nonce=${session.nonce - 1} totalWinX=${totalWinX.toFixed(2)}`);
        }
    }
    const balanceEnd = await wallet.getBalance(PLAYER_ID);
    const elapsedMs = Date.now() - t0;
    // correct RTP per cost:
    // winX is in xBet (x base bet). Convert to cents: winCents = winX * betCents
    const totalWinCents = totalWinX * betCents;
    const rtpPerCost = totalCost > 0 ? totalWinCents / totalCost : 0;
    const summary = {
        slotId: config.id,
        mode,
        betCents,
        spins,
        seed,
        elapsedMs,
        provablyFair: {
            serverSeedHash: session.serverSeedHash,
            clientSeed: session.clientSeed,
            // demo only
            serverSeed: session.serverSeed,
            finalNonce: session.nonce,
        },
        balanceStart,
        balanceEnd,
        totals: {
            totalCostCents: totalCost,
            totalWinX,
            totalWinCents,
            rtpPerCost,
            bonus3Triggers: bonus3,
            bonus4Triggers: bonus4,
        },
    };
    const outJson = {
        summary,
        rows,
    };
    const outPath = `demo_session_${config.id}_${mode}_bet${betCents}_spins${spins}_seed${seed}.json`;
    fs_1.default.writeFileSync(outPath, JSON.stringify(outJson, null, 2));
    console.log("\n=== DEMO SESSION SUMMARY ===");
    console.log(JSON.stringify(summary, null, 2));
    console.log("\nWrote:", outPath);
})();
