import { loadSlotFromArg } from "./_loadSlot";
import { DemoWallet } from "../engine/wallet/demoWallet";
import { playRoundWithWallet } from "../engine/modes/playRoundWithWallet";
import { createSession, rngForNextRound } from "../engine/fair/seed";

type SpinMode = "base" | "extraBet";
const PLAYER_ID = "demo-user";

function parseMode(argv: string[]): SpinMode {
  const m = (argv[3] ?? "base") as SpinMode;
  if (m !== "base" && m !== "extraBet") throw new Error(`Invalid mode: ${m}`);
  return m;
}

function parseBetCents(argv: string[]): number {
  // node dist/cli/demoSpin.js slot001 base 100
  const v = Number(argv[4] ?? 100);
  if (!Number.isFinite(v) || v <= 0)
    throw new Error(`Invalid betCents: ${argv[4]}`);
  return Math.floor(v);
}

(async () => {
  const config = loadSlotFromArg();

  const mode = parseMode(process.argv);
  const baseBet = parseBetCents(process.argv);

  const wallet = new DemoWallet(100_000);

  // Demo provably fair session (reproducible)
  const session = createSession({
    mode: "demo",
    clientSeed: "demo-client",
    serverSeed: "DEMO_SERVER_SEED_v1",
  });

  const context = `spin:${mode}`;

  const { rng, nonceUsed, seed32, msg } = rngForNextRound(session, { context });

  const balanceBefore = await wallet.getBalance(PLAYER_ID);

  const result = await playRoundWithWallet(config, rng, wallet, {
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
