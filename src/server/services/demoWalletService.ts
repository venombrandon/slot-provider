import { store } from "../store/memoryStore";

export function ensureDemoWallet(sessionId: string, startCents = 100_000) {
  store.getOrCreateDemoBalance(sessionId, startCents);
}

export function getDemoBalance(sessionId: string): number {
  return store.getOrCreateDemoBalance(sessionId, 100_000);
}

export function debitDemo(sessionId: string, amountCents: number) {
  const bal = getDemoBalance(sessionId);
  if (bal < amountCents) throw new Error("INSUFFICIENT_FUNDS");
  store.demoBalances.set(sessionId, bal - amountCents);
  return bal - amountCents;
}

export function creditDemo(sessionId: string, amountCents: number) {
  const bal = getDemoBalance(sessionId);
  store.demoBalances.set(sessionId, bal + amountCents);
  return bal + amountCents;
}
