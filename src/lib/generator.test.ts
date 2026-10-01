import { describe, expect, it } from "vitest";
import {
  computeWeights,
  generateTicket,
  generateTickets,
  isUnpopular,
  MODES,
  secureRandom,
  weightedSample,
  type PastDraw,
} from "./generator";

const history: PastDraw[] = Array.from({ length: 120 }, (_, i) => ({
  numbers: [1 + (i % 7), 10 + (i % 5), 20 + (i % 9), 33 + (i % 6), 41 + (i % 4)],
  mega: 1 + (i % 27),
}));

describe("generator invariants", () => {
  for (const mode of MODES) {
    it(`${mode}: 5 distinct sorted numbers in 1..47, mega in 1..27`, () => {
      for (let i = 0; i < 300; i++) {
        const t = generateTicket(mode, history, secureRandom);
        expect(t.numbers).toHaveLength(5);
        expect(new Set(t.numbers).size).toBe(5);
        expect([...t.numbers].sort((a, b) => a - b)).toEqual(t.numbers);
        expect(t.numbers.every((n) => n >= 1 && n <= 47)).toBe(true);
        expect(t.mega).toBeGreaterThanOrEqual(1);
        expect(t.mega).toBeLessThanOrEqual(27);
      }
    });
  }

  it("works with empty history", () => {
    for (const mode of MODES) expect(generateTicket(mode, [])).toBeTruthy();
  });

  it("generates distinct tickets in a batch", () => {
    const ts = generateTickets("random", 5, history);
    expect(new Set(ts.map((t) => t.numbers.join())).size).toBe(5);
  });

  it("weighted sampling favours heavy numbers and skips zero weights", () => {
    const w = new Array(47).fill(0);
    w[4] = 1;
    w[9] = 1;
    w[19] = 1;
    w[29] = 1;
    w[39] = 1;
    expect(weightedSample(w, 5, secureRandom)).toEqual([5, 10, 20, 30, 40]);
  });

  it("hot weights follow frequency, cold favours overdue numbers", () => {
    const hist: PastDraw[] = [
      { numbers: [1, 2, 3, 4, 5], mega: 1 },
      { numbers: [1, 2, 3, 4, 6], mega: 1 },
    ];
    const hot = computeWeights("hot", hist, "main");
    expect(hot[0]).toBeGreaterThan(hot[5]);
    expect(hot[5]).toBeGreaterThan(hot[46]);
    const cold = computeWeights("cold", hist, "main");
    expect(cold[46]).toBeGreaterThan(cold[0]);
  });
});

describe("isUnpopular", () => {
  it("accepts a good combination", () => {
    expect(isUnpopular([4, 17, 26, 35, 44])).toBe(true);
  });
  it("rejects birthday-heavy combos", () => {
    expect(isUnpopular([3, 9, 14, 22, 40])).toBe(false);
  });
  it("rejects 3+ consecutive", () => {
    expect(isUnpopular([4, 17, 35, 36, 37])).toBe(false);
  });
  it("rejects arithmetic sequences", () => {
    expect(isUnpopular([7, 15, 23, 31, 39])).toBe(false);
    expect(isUnpopular([13, 21, 29, 37, 45])).toBe(false);
  });
  it("rejects same-decade combos", () => {
    expect(isUnpopular([30, 31, 33, 35, 39])).toBe(false);
  });
  it("rejects all multiples of the same number", () => {
    expect(isUnpopular([5, 15, 35, 40, 45])).toBe(false);
  });
  it("rejects exact past draws", () => {
    const past = [{ numbers: [4, 17, 26, 35, 44], mega: 3 }];
    expect(isUnpopular([4, 17, 26, 35, 44], past)).toBe(false);
  });
  it("generated unpopular tickets satisfy every rule", () => {
    for (let i = 0; i < 300; i++) {
      expect(isUnpopular(generateTicket("unpopular", history).numbers, history)).toBe(true);
    }
  });
});
