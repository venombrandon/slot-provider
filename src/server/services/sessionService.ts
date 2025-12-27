import {
  createSession,
  sha256Hex,
  type FairSession,
} from "../../engine/fair/seed";
import { store } from "../store/memoryStore";

export function startDemoSession(params: {
  playerId: string;
  clientSeed?: string;
  serverSeed?: string;
  startBalanceCents: number;
}): FairSession {
  const session = createSession({
    mode: "demo",
    clientSeed: params.clientSeed ?? `demo-client-${params.playerId}`,
    serverSeed: params.serverSeed, // if omitted: your createSession uses DEMO default
  });

  // make sure hash matches (defensive)
  session.serverSeedHash = sha256Hex(session.serverSeed);

  store.sessions.set(session.id, session);

  // ✅ balance pro session initialisieren
  store.getOrCreateDemoBalance(session.id, params.startBalanceCents);

  return session;
}

export function getSession(sessionId: string): FairSession {
  const s = store.sessions.get(sessionId);
  if (!s) throw new Error("SESSION_NOT_FOUND");
  return s;
}
