import { Wallet } from "./wallet";

export class DemoWallet implements Wallet {
  private balances = new Map<string, number>();

  constructor(private defaultBalance: number = 100_000) {} // z.B. 1000.00€

  async getBalance(playerId: string): Promise<number> {
    return this.balances.get(playerId) ?? this.defaultBalance;
  }

  async debit(playerId: string, amount: number, _ref: string): Promise<void> {
    const b = await this.getBalance(playerId);
    if (b < amount) throw new Error("INSUFFICIENT_BALANCE");
    this.balances.set(playerId, b - amount);
  }

  async credit(playerId: string, amount: number, _ref: string): Promise<void> {
    const b = await this.getBalance(playerId);
    this.balances.set(playerId, b + amount);
  }
}
