import fs from "fs";
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
  const v = Number(argv[4] ?? 100);
  if (!Number.isFinite(v) || v <= 0)
    throw new Error(`Invalid betCents: ${argv[4]}`);
  return Math.floor(v);
}

function parseSpins(argv: string[]): number {
  const n = Number(argv[5] ?? 100);
  if (!Number.isFinite(n) || n <= 0)
    throw new Error(`Invalid spins: ${argv[5]}`);
  return Math.floor(n);
}

function parseSeed(argv: string[]): number {
  const s = Number(argv[6] ?? 1337);
  if (!Number.isFinite(s)) throw new Error(`Invalid seed: ${argv[6]}`);
  return Math.floor(s);
}

(async () => {
  const config = loadSlotFromArg();

  // usage:
  // node dist/cli/demoSessionSpins.js slot001 base 100 200 1337
  const mode = parseMode(process.argv);
  const betCents = parseBetCents(process.argv);
  const spins = parseSpins(process.argv);
  const seed = parseSeed(process.argv);

  // Wallet / Session
  const wallet = new DemoWallet(100_000);

  // Make demo session reproducible per SEED (optional but nice):
  // We derive seeds from seed number to keep stable sessions across runs.
  const session = createSession({
    mode: "demo",
    clientSeed: `demo-client-${seed}`,
    serverSeed: `DEMO_SERVER_SEED_v1_${seed}`,
  });

  const balanceStart = await wallet.getBalance(PLAYER_ID);

  let totalCost = 0;
  let totalWinX = 0;
  let bonus3 = 0;
  let bonus4 = 0;

  const rows: any[] = [];

  const t0 = Date.now();

  for (let i = 0; i < spins; i++) {
    const context = `spin:${mode}`;

    const { rng, nonceUsed, seed32, msg } = rngForNextRound(session, {
      context,
    });

    const before = await wallet.getBalance(PLAYER_ID);

    const r = await playRoundWithWallet(config, rng, wallet, {
      playerId: PLAYER_ID,
      roundId: `round-${Date.now()}-${i}`,
      baseBet: betCents,
      mode,
    });

    const after = await wallet.getBalance(PLAYER_ID);

    totalCost += r.cost;
    totalWinX += r.result.totalWinX;
    if (r.result.triggered === "bonus3") bonus3++;
    if (r.result.triggered === "bonus4") bonus4++;

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
      console.log(
        `[${done}/${spins}] nonce=${
          session.nonce - 1
        } totalWinX=${totalWinX.toFixed(2)}`
      );
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
  fs.writeFileSync(outPath, JSON.stringify(outJson, null, 2));

  console.log("\n=== DEMO SESSION SUMMARY ===");
  console.log(JSON.stringify(summary, null, 2));
  console.log("\nWrote:", outPath);
})();
