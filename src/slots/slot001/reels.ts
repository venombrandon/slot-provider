import { ReelSet } from "../../engine/types";
import { RNG } from "../../engine/rng/rng";
import { buildReel } from "../../engine/reels/buildReel";

const rng = new RNG(1234);

export const baseReels: ReelSet = {
  reels: [
    // Reel 1 – KEIN Scatter
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 36, high: 12, wild: 2, scatter: 0 },
      rng
    ),

    // Reel 2 – 2 Scatter
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 34, high: 12, wild: 2, scatter: 2 },
      rng
    ),

    // Reel 3 – 2 Scatter
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 34, high: 12, wild: 2, scatter: 2 },
      rng
    ),

    // Reel 4 – 1 Scatter
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 35, high: 12, wild: 2, scatter: 1 },
      rng
    ),

    // Reel 5 – 1 Scatter
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 35, high: 12, wild: 2, scatter: 1 },
      rng
    ),
  ],
};

export const extraBetReels: ReelSet = {
  reels: [
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 36, high: 12, wild: 2, scatter: 0 },
      rng
    ),

    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 33, high: 12, wild: 2, scatter: 3 },
      rng
    ),

    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 33, high: 12, wild: 2, scatter: 3 },
      rng
    ),

    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 34, high: 12, wild: 2, scatter: 2 },
      rng
    ),

    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 35, high: 12, wild: 2, scatter: 1 },
      rng
    ),
  ],
};

export const bonus3Reels: ReelSet = {
  reels: [
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 34, high: 12, wild: 4, scatter: 0 },
      rng
    ),
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 33, high: 12, wild: 4, scatter: 1 },
      rng
    ),
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 33, high: 12, wild: 4, scatter: 1 },
      rng
    ),
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 33, high: 12, wild: 4, scatter: 1 },
      rng
    ),
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 33, high: 12, wild: 4, scatter: 1 },
      rng
    ),
  ],
};

export const bonus4Reels: ReelSet = {
  reels: [
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 33, high: 12, wild: 5, scatter: 0 },
      rng
    ),
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 32, high: 12, wild: 5, scatter: 1 },
      rng
    ),
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 32, high: 12, wild: 5, scatter: 1 },
      rng
    ),
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 32, high: 12, wild: 5, scatter: 1 },
      rng
    ),
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 33, high: 12, wild: 4, scatter: 1 },
      rng
    ),
  ],
};

export const bonus3BuyReels: ReelSet = {
  reels: [
    // Reel 1: kein Scatter (lassen wir so)
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 32, high: 11, wild: 7, scatter: 0 },
      rng
    ),

    // Reel 2–5: Scatter 2 -> 1 (anti-farm), Wild bleibt hoch
    ...Array.from({ length: 4 }).map(() =>
      buildReel(
        {
          low: ["10", "J", "Q", "K", "A"],
          high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
          wild: "WILD",
          scatter: "SCATTER",
        },
        { low: 26, high: 15, wild: 8, scatter: 1 },
        rng
      )
    ),
  ],
};

export const bonus4BuyReels: ReelSet = {
  reels: [
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 35, high: 12, wild: 3, scatter: 0 },
      rng
    ),
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 34, high: 12, wild: 3, scatter: 1 },
      rng
    ),
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 34, high: 12, wild: 3, scatter: 1 },
      rng
    ),
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 34, high: 12, wild: 3, scatter: 1 },
      rng
    ),
    buildReel(
      {
        low: ["10", "J", "Q", "K", "A"],
        high: ["Top5", "Top4", "Top3", "Top2", "Top1"],
        wild: "WILD",
        scatter: "SCATTER",
      },
      { low: 34, high: 12, wild: 3, scatter: 1 },
      rng
    ),
  ],
};
