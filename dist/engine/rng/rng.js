"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RNG = void 0;
class RNG {
    constructor(seed) {
        this.seed = seed >>> 0;
    }
    next() {
        // xorshift32
        let x = this.seed;
        x ^= x << 13;
        x ^= x >>> 17;
        x ^= x << 5;
        this.seed = x >>> 0;
        return this.seed / 0xffffffff;
    }
    int(max) {
        return Math.floor(this.next() * max);
    }
}
exports.RNG = RNG;
