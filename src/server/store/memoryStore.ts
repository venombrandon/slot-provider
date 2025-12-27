import type { FairSession } from "../../engine/fair/seed";

export type RoundKind = "spin" | "buy";

export interface StoredRound {
  roundId: string;
  playerId: string;
  sessionId: string;
  slotId: string;

  kind: RoundKind;
  mode?: "base" | "extraBet";
  buyType?: "bonus3" | "bonus4";

  betCents: number;
  costCents: number;
  payoutCents: number;

  provablyFair: {
    serverSeedHash: string;
    clientSeed: string;
    nonceUsed: number;
    context: string;
    msg: string;
    seed32: number;
    // demo only:
    serverSeed?: string;
  };

  resultJson: any; // engine result
  responseJson: any; // full API response
  createdAt: number;
}

export class MemoryStore {
  sessions = new Map<string, FairSession>();
  rounds = new Map<string, StoredRound>(); // key = `${sessionId}:${roundId}`

  roundKey(sessionId: string, roundId: string) {
    return `${sessionId}:${roundId}`;
  }

  demoBalances = new Map<string, number>(); // sessionId -> cents

  getOrCreateDemoBalance(sessionId: string, startCents: number) {
    if (!this.demoBalances.has(sessionId))
      this.demoBalances.set(sessionId, startCents);
    return this.demoBalances.get(sessionId)!;
  }

  setDemoBalance(sessionId: string, cents: number) {
    this.demoBalances.set(sessionId, cents);
  }

  getDemoBalance(sessionId: string) {
    const v = this.demoBalances.get(sessionId);
    if (typeof v !== "number") throw new Error("DEMO_BALANCE_NOT_FOUND");
    return v;
  }

  getRound(sessionId: string, roundId: string) {
    return this.rounds.get(this.roundKey(sessionId, roundId));
  }

  setRound(round: StoredRound) {
    this.rounds.set(this.roundKey(round.sessionId, round.roundId), round);
  }
}

export const store = new MemoryStore();
