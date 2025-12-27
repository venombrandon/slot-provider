import { BET_LADDER_CENTS } from "./betLadder";
import { isValidBetSize } from "./betLadder";

export function validateBetSize(baseBet: number): void {
  if (!isValidBetSize(baseBet)) {
    throw new Error(`INVALID_BET_SIZE: ${baseBet}`);
  }
}
