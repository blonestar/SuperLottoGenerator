/** Draws: Wednesday & Saturday 19:57 America/Los_Angeles. */
const TZ = "America/Los_Angeles";
const DRAW_DAYS = [3, 6]; // Wed, Sat (0 = Sunday)
const DRAW_H = 19;
const DRAW_M = 57;

const fmt = new Intl.DateTimeFormat("en-US", {
  timeZone: TZ,
  hourCycle: "h23",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

function wallClock(ts: number) {
  const p: Record<string, number> = {};
  for (const part of fmt.formatToParts(ts)) {
    if (part.type !== "literal") p[part.type] = Number(part.value);
  }
  return p;
}

/** Offset (ms) of LA wall-clock time relative to UTC at instant `ts`. */
function offsetAt(ts: number): number {
  const p = wallClock(ts);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return asUtc - Math.floor(ts / 1000) * 1000;
}

/** Convert an LA wall-clock time to a UTC instant (DST safe). */
function laToUtc(y: number, m: number, d: number, h: number, mi: number): number {
  const guess = Date.UTC(y, m - 1, d, h, mi);
  let ts = guess - offsetAt(guess);
  ts = guess - offsetAt(ts);
  return ts;
}

/** The next draw instant strictly after `now` (ms since epoch). */
export function nextDrawAt(now: number): number {
  const p = wallClock(now);
  for (let add = 0; add < 8; add++) {
    const day = new Date(Date.UTC(p.year, p.month - 1, p.day + add));
    if (!DRAW_DAYS.includes(day.getUTCDay())) continue;
    const t = laToUtc(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate(), DRAW_H, DRAW_M);
    if (t > now) return t;
  }
  throw new Error("unreachable");
}
