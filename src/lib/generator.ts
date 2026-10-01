/**
 * Pure ticket generation logic for California SuperLotto Plus.
 * 5 numbers from 1..47 plus a Mega number from 1..27.
 */

export const MAIN_MAX = 47;
export const MEGA_MAX = 27;
export const MAIN_COUNT = 5;
export const HOT_WINDOW = 50;

export type Mode = "random" | "hot" | "cold" | "unpopular";
export const MODES: Mode[] = ["random", "hot", "cold", "unpopular"];

/** Returns a float in [0, 1). */
export type Rng = () => number;

export interface Ticket {
  numbers: number[]; // ascending
  mega: number;
}

/** Past draw: [n1..n5, mega]. History is newest first. */
export type PastDraw = { numbers: number[]; mega: number };

/** Cryptographically secure float in [0, 1) with 53 bits of randomness. */
export const secureRandom: Rng = () => {
  const buf = new Uint32Array(2);
  crypto.getRandomValues(buf);
  return (buf[0] * 2 ** 21 + (buf[1] >>> 11)) / 2 ** 53;
};

/** Weighted sample of `k` distinct values from 1..weights.length (weights[i] is for value i+1). */
export function weightedSample(weights: number[], k: number, rng: Rng): number[] {
  const w = weights.slice();
  const picked: number[] = [];
  for (let n = 0; n < k; n++) {
    let total = 0;
    for (const x of w) total += x;
    let r = rng() * total;
    let idx = -1;
    for (let i = 0; i < w.length; i++) {
      if (w[i] <= 0) continue;
      idx = i; // remember last positive in case of rounding drift
      r -= w[i];
      if (r < 0) break;
    }
    picked.push(idx + 1);
    w[idx] = 0;
  }
  return picked.sort((a, b) => a - b);
}

/** Frequency of each value in the first `window` draws (index 0 => value 1). */
function frequency(history: PastDraw[], window: number, max: number, mega: boolean): number[] {
  const counts = new Array<number>(max).fill(0);
  for (const d of history.slice(0, window)) {
    if (mega) counts[d.mega - 1]++;
    else for (const n of d.numbers) counts[n - 1]++;
  }
  return counts;
}

/** Draws since each value was last seen (0 = in newest draw). Never seen => history.length. */
function sinceLastSeen(history: PastDraw[], max: number, mega: boolean): number[] {
  const since = new Array<number>(max).fill(history.length);
  const seen = new Array<boolean>(max).fill(false);
  history.forEach((d, i) => {
    const vals = mega ? [d.mega] : d.numbers;
    for (const v of vals) {
      if (!seen[v - 1]) {
        seen[v - 1] = true;
        since[v - 1] = i;
      }
    }
  });
  return since;
}

/** Per-number sampling weights for the given mode. */
export function computeWeights(
  mode: Mode,
  history: PastDraw[],
  kind: "main" | "mega",
): number[] {
  const max = kind === "main" ? MAIN_MAX : MEGA_MAX;
  const mega = kind === "mega";
  if (mode === "random" || mode === "unpopular" || history.length === 0) {
    return new Array<number>(max).fill(1);
  }
  // The mega number is drawn once per draw, so it needs a longer window to be meaningful.
  const window = mega ? HOT_WINDOW * 2 : HOT_WINDOW;
  const counts = frequency(history, window, max, mega);
  if (mode === "hot") return counts.map((c) => 1 + c);
  // cold: long-overdue and infrequent numbers get more weight
  const since = sinceLastSeen(history, max, mega);
  return counts.map((c, i) => (1 + since[i]) / (1 + c));
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * True if a combination avoids patterns many players choose.
 * `numbers` must be sorted ascending.
 */
export function isUnpopular(numbers: number[], history: PastDraw[] = []): boolean {
  // at least 2 numbers above 31 (not all birthdays)
  if (numbers.filter((n) => n > 31).length < 2) return false;

  // no 3+ consecutive numbers
  let run = 1;
  for (let i = 1; i < numbers.length; i++) {
    run = numbers[i] === numbers[i - 1] + 1 ? run + 1 : 1;
    if (run >= 3) return false;
  }

  // not an arithmetic sequence
  const step = numbers[1] - numbers[0];
  if (numbers.every((n, i) => i === 0 || n - numbers[i - 1] === step)) return false;

  // not all in the same decade (1-9, 10-19, 20-29, ...)
  const decade = Math.floor(numbers[0] / 10);
  if (numbers.every((n) => Math.floor(n / 10) === decade)) return false;

  // not all multiples of the same number (>= 2)
  if (numbers.reduce(gcd, 0) >= 2) return false;

  // not an exact copy of a past draw
  const key = numbers.join("-");
  if (history.some((d) => d.numbers.join("-") === key)) return false;

  return true;
}

export function generateTicket(
  mode: Mode,
  history: PastDraw[] = [],
  rng: Rng = secureRandom,
): Ticket {
  const mainWeights = computeWeights(mode, history, "main");
  const megaWeights = computeWeights(mode, history, "mega");
  let numbers = weightedSample(mainWeights, MAIN_COUNT, rng);
  if (mode === "unpopular") {
    for (let tries = 0; tries < 10_000 && !isUnpopular(numbers, history); tries++) {
      numbers = weightedSample(mainWeights, MAIN_COUNT, rng);
    }
  }
  const mega = weightedSample(megaWeights, 1, rng)[0];
  return { numbers, mega };
}

/** Generate `count` tickets, avoiding duplicates within the batch. */
export function generateTickets(
  mode: Mode,
  count: number,
  history: PastDraw[] = [],
  rng: Rng = secureRandom,
): Ticket[] {
  const out: Ticket[] = [];
  const seen = new Set<string>();
  while (out.length < count) {
    const t = generateTicket(mode, history, rng);
    const key = `${t.numbers.join("-")}+${t.mega}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

export function formatTicket(t: Ticket, megaLabel = "Mega"): string {
  return `${t.numbers.map((n) => String(n).padStart(2, "0")).join(" ")} + ${megaLabel} ${String(t.mega).padStart(2, "0")}`;
}
