/**
 * Alle erlaubten Bets in CENTS
 * UI darf NUR diese Werte verwenden
 */
export const BET_LADDER_CENTS = [
  10, // 0.10
  20, // 0.20
  40, // 0.40
  60, // 0.60
  80, // 0.80
  100, // 1.00
  120, // 1.20
  140, // 1.40
  160, // 1.60
  180, // 1.80
  200, // 2.00
  300, // 3.00
  400, // 4.00
  500, // 5.00
  1000, // 10.00
  1200, // 12.00
  1500, // 15.00
  2000, // 20.00
  2500, // 25.00
  5000, // 50.00
  10000, // 100.00
  12000, // 120.00
  20000, // 200.00
] as const;

export function isValidBetSize(
  value: number
): value is (typeof BET_LADDER_CENTS)[number] {
  return BET_LADDER_CENTS.includes(value as any);
}

export type BetSizeCents = (typeof BET_LADDER_CENTS)[number];

// export function getNextBet(
//   current: number,
//   direction: "up" | "down"
// ): number {
//   const idx = BET_LADDER_CENTS.indexOf(current);
//   if (idx === -1) return BET_LADDER_CENTS[0];

//   if (direction === "up") {
//     return BET_LADDER_CENTS[Math.min(idx + 1, BET_LADDER_CENTS.length - 1)];
//   }
//   return BET_LADDER_CENTS[Math.max(idx - 1, 0)];
// }
