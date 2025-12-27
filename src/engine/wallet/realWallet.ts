import { Wallet } from "./wallet";

export class RealWallet implements Wallet {
  private balances = new Map<string, number>();

  constructor(startBalanceCents = 0) {}

  async getBalance(playerId: string): Promise<number> {
    return this.balances.get(playerId) ?? 0;
  }

  async debit(
    playerId: string,
    amountCents: number,
    _roundId: string
  ): Promise<void> {
    const bal = await this.getBalance(playerId);
    if (bal < amountCents) throw new Error("INSUFFICIENT_FUNDS");
    this.balances.set(playerId, bal - amountCents);
  }

  async credit(
    playerId: string,
    amountCents: number,
    _roundId: string
  ): Promise<void> {
    const bal = await this.getBalance(playerId);
    this.balances.set(playerId, bal + amountCents);
  }

  // helper for local tests
  setBalance(playerId: string, cents: number) {
    this.balances.set(playerId, cents);
  }
}
