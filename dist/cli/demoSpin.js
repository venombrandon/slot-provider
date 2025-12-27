"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    // node dist/cli/demoSpin.js slot001 base 100
    const v = Number(argv[4] ?? 100);
    if (!Number.isFinite(v) || v <= 0)
        throw new Error(`Invalid betCents: ${argv[4]}`);
    return Math.floor(v);
}
(async () => {
    const config = (0, _loadSlot_1.loadSlotFromArg)();
    const mode = parseMode(process.argv);
    const baseBet = parseBetCents(process.argv);
    const wallet = new demoWallet_1.DemoWallet(100000);
    // Demo provably fair session (reproducible)
    const session = (0, seed_1.createSession)({
        mode: "demo",
        clientSeed: "demo-client",
        serverSeed: "DEMO_SERVER_SEED_v1",
    });
    const context = `spin:${mode}`;
    const { rng, nonceUsed, seed32, msg } = (0, seed_1.rngForNextRound)(session, { context });
    const balanceBefore = await wallet.getBalance(PLAYER_ID);
    const result = await (0, playRoundWithWallet_1.playRoundWithWallet)(config, rng, wallet, {
        playerId: PLAYER_ID,
        roundId: `round-${Date.now()}`,
        baseBet,
        mode,
    });
    const balanceAfter = await wallet.getBalance(PLAYER_ID);
    // Receipt: wir ziehen serverSeedHash/clientSeed DIREKT aus session (weil rngForNextRound es nicht zurückgibt)
    const out = {
        slotId: config.id,
        mode,
        betCents: baseBet,
        balanceBefore,
        balanceAfter,
        provablyFair: {
            serverSeedHash: session.serverSeedHash,
            clientSeed: session.clientSeed,
            nonceUsed,
            context,
            msg,
            seed32,
            // demo: ok zu zeigen; real: NICHT zeigen
            serverSeed: session.serverSeed,
        },
        result,
    };
    console.log(JSON.stringify(out, null, 2));
})();
