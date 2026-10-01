import raw from "../../data/draws.json";
// To use sample data instead, import from "./sample-draws.json".

export interface Draw {
  date: string; // YYYY-MM-DD
  numbers: number[]; // ascending
  mega: number;
  jackpot: number | null;
  winners: number | null;
}

/** All draws, newest first. */
export const draws: Draw[] = raw as Draw[];

export const latestDrawDate: string | null = draws[0]?.date ?? null;

const DAY = 86_400_000;

/** Draws from the last `days` days relative to the newest draw; falls back to `fallback` draws. */
export function recentDraws(days = 30, fallback = 8): Draw[] {
  if (draws.length === 0) return [];
  const newest = Date.parse(draws[0].date);
  const within = draws.filter((d) => newest - Date.parse(d.date) <= days * DAY);
  return within.length >= fallback ? within : draws.slice(0, fallback);
}
