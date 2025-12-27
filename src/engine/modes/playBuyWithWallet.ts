import { RNG } from "../rng/rng";
import { SlotConfig } from "../types";
import { Wallet } from "../wallet/wallet";
import { BuyType, calcBuyCost } from "../bet/calcCost";
import { playBonusBuy } from "./playBonusBuy";
import { validateBetSize } from "../bet/validateBet";

export interface PlayBuyRequest {
  playerId: string;
  roundId: string;
  baseBet: number;
  buyType: BuyType;
}

export async function playBuyWithWallet(
  config: SlotConfig,
  rng: RNG,
  wallet: Wallet,
  req: PlayBuyRequest
) {
  validateBetSize(req.baseBet);

  const cost = calcBuyCost(config, req.baseBet, req.buyType);

  const balanceBefore = await wallet.getBalance(req.playerId);
  if (balanceBefore < cost) throw new Error("INSUFFICIENT_BALANCE");

  await wallet.debit(req.playerId, cost, req.roundId);

  const r = playBonusBuy(config, rng, req.buyType);
  const payout = Math.round(r.winX * req.baseBet);

  if (payout > 0) await wallet.credit(req.playerId, payout, req.roundId);

  const balanceAfter = await wallet.getBalance(req.playerId);

  return {
    balanceBefore,
    balanceAfter,
    cost,
    buy: r,
    payout,
  };
}
