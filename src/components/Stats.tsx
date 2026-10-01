"use client";

import { useState } from "react";
import { t, type Dict } from "@/i18n";
import type { Cell, StatsData } from "@/lib/stats";
import { SectionHead } from "./SectionHead";

type Sel = { cell: Cell; mega: boolean } | null;

function Grid({
  cells,
  mega,
  selected,
  onSelect,
}: {
  cells: Cell[];
  mega: boolean;
  selected: Sel;
  onSelect: (s: Sel) => void;
}) {
  const max = Math.max(1, ...cells.map((c) => c.count));
  const min = Math.min(...cells.map((c) => c.count));
  const rgb = mega ? "var(--gold-rgb)" : "var(--red-rgb)";
  return (
    <div className="grid grid-cols-8 sm:grid-cols-12 lg:grid-cols-16 gap-0.5">
      {cells.map((c) => {
        // normalise within [min, max] so differences are visible
        const x = max === min ? 0.5 : (c.count - min) / (max - min);
        const isSel = selected?.mega === mega && selected.cell.n === c.n;
        return (
          <button
            key={c.n}
            type="button"
            aria-pressed={isSel}
            aria-label={`${c.n}: ${c.count}`}
            onClick={() => onSelect(isSel ? null : { cell: c, mega })}
            onMouseEnter={() => onSelect({ cell: c, mega })}
            className={`aspect-square font-mono text-sm tabular-nums cursor-pointer outline-offset-0 ${
              isSel ? "outline-2 outline-fg relative z-10" : "hover:outline-2 hover:outline-fg/40"
            }`}
            style={{
              backgroundColor: `rgba(${rgb},${(0.08 + x * 0.92).toFixed(3)})`,
              color: x > 0.55 ? (mega ? "#1b1530" : "#fff") : "var(--fg)",
            }}
          >
            {c.n}
          </button>
        );
      })}
    </div>
  );
}

export function Stats({ dict, stats }: { dict: Dict; stats: StatsData }) {
  const s = dict.stats;
  const [range, setRange] = useState<"all" | "last100">("all");
  const [sel, setSel] = useState<Sel>(null);
  const w = stats[range];

  // keep the selected cell's count in sync with the chosen range
  const live = sel ? (sel.mega ? w.mega : w.main)[sel.cell.n - 1] : null;
  let detail = s.pick;
  if (live && sel) {
    const since = live.since === null ? s.neverSeen : live.since === 0 ? s.since0 : t(s.sinceN, { n: live.since });
    detail = `${t(sel.mega ? s.detailMega : s.detail, { n: live.n, count: live.count })}, ${since}`;
  }

  const tab = (active: boolean) =>
    `h-9 px-1 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
      active ? "border-red text-fg" : "border-transparent text-muted hover:text-fg"
    }`;
  const label = "text-xs font-medium uppercase tracking-[0.14em] text-muted mb-2";

  return (
    <section aria-labelledby="stats-title" className="py-10 sm:py-14 border-t border-line" onMouseLeave={() => setSel(null)}>
      <SectionHead
        id="stats-title"
        index="02"
        title={s.title}
        subtitle={s.subtitle}
        aside={
          <div role="radiogroup" aria-label={s.title} className="flex gap-5">
            {(["all", "last100"] as const).map((r) => (
              <button key={r} type="button" role="radio" aria-checked={range === r} onClick={() => setRange(r)} className={tab(range === r)}>
                {r === "all" ? s.allTime : s.last100}
              </button>
            ))}
          </div>
        }
      />

      <div className="mt-6 min-h-6 border-l-2 border-red pl-3 text-sm font-medium flex items-center" aria-live="polite">
        {detail}
      </div>

      <div className="mt-6 grid gap-8">
        <div>
          <h3 className={label}>{s.mainNumbers}</h3>
          <Grid cells={w.main} mega={false} selected={sel} onSelect={setSel} />
        </div>
        <div>
          <h3 className={label}>{s.megaNumbers}</h3>
          <Grid cells={w.mega} mega selected={sel} onSelect={setSel} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>{t(s.basedOn, { n: w.draws })}</span>
        <span className="flex items-center gap-2" aria-hidden>
          {s.less}
          <span className="h-2 w-24" style={{ background: "linear-gradient(90deg, rgba(var(--red-rgb),.08), rgb(var(--red-rgb)))" }} />
          {s.more}
        </span>
      </div>
    </section>
  );
}
