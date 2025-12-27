export interface Wallet {
  getBalance(playerId: string): Promise<number>;

  /**
   * Debitet amount (in smallest unit, z.B. cents).
   * ref muss unique sein (roundId), damit später idempotency möglich ist.
   */
  debit(playerId: string, amount: number, ref: string): Promise<void>;

  /**
   * Creditet amount (in smallest unit, z.B. cents).
   */
  credit(playerId: string, amount: number, ref: string): Promise<void>;
}
