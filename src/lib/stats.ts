import { MAIN_MAX, MEGA_MAX } from "./generator";
import type { Draw } from "./draws";

export interface Cell {
  n: number;
  count: number;
  /** Draws since last seen across the whole dataset (0 = in newest draw), null if never. */
  since: number | null;
}

export interface StatsWindow {
  draws: number;
  main: Cell[];
  mega: Cell[];
}

export interface StatsData {
  all: StatsWindow;
  last100: StatsWindow;
}

function build(all: Draw[], window: number): StatsWindow {
  const slice = all.slice(0, window);
  const main: Cell[] = Array.from({ length: MAIN_MAX }, (_, i) => ({ n: i + 1, count: 0, since: null }));
  const mega: Cell[] = Array.from({ length: MEGA_MAX }, (_, i) => ({ n: i + 1, count: 0, since: null }));
  slice.forEach((d) => {
    d.numbers.forEach((n) => main[n - 1].count++);
    mega[d.mega - 1].count++;
  });
  all.forEach((d, i) => {
    for (const n of d.numbers) if (main[n - 1].since === null) main[n - 1].since = i;
    if (mega[d.mega - 1].since === null) mega[d.mega - 1].since = i;
  });
  return { draws: slice.length, main, mega };
}

export function computeStats(draws: Draw[]): StatsData {
  return { all: build(draws, draws.length), last100: build(draws, 100) };
}
