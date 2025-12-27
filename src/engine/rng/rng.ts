export class RNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed >>> 0;
  }

  next(): number {
    // xorshift32
    let x = this.seed;
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    this.seed = x >>> 0;
    return this.seed / 0xffffffff;
  }

  int(max: number): number {
    return Math.floor(this.next() * max);
  }
}
