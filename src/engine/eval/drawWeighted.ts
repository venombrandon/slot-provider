import { WeightTable } from "../types";
import { RNG } from "../rng/rng";

export function drawWeighted<T>(rng: RNG, table: WeightTable<T>[]): T {
  const total = table.reduce((sum, e) => sum + e.weight, 0);
  const r = rng.next() * total;

  let acc = 0;
  for (const e of table) {
    acc += e.weight;
    if (r <= acc) return e.value;
  }

  // Fallback (sollte nie passieren)
  return table[table.length - 1].value;
}
