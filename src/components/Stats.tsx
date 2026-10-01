"use client";

import { useState } from "react";
import { t, type Dict } from "@/i18n";
import type { Cell, StatsData } from "@/lib/stats";

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
  const rgb = mega ? "247,148,29" : "0,174,239";
  return (
    <div className="grid grid-cols-7 sm:grid-cols-10 gap-1.5">
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
            className={`aspect-square rounded-lg text-sm font-bold tabular-nums cursor-pointer transition-transform hover:scale-110 border ${
              isSel ? "border-fg" : "border-transparent"
            }`}
            style={{
              backgroundColor: `rgba(${rgb},${(0.16 + x * 0.8).toFixed(3)})`,
              color: x > 0.55 ? (mega ? "#3d1d00" : "#fff") : "var(--fg)",
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
    `rounded-full px-4 h-9 text-sm font-bold border transition-colors cursor-pointer ${
      active ? "bg-sky text-[#00263d] border-transparent" : "bg-chip text-fg border-line hover:border-sky"
    }`;

  return (
    <section aria-labelledby="stats-title" className="card p-5 sm:p-8" onMouseLeave={() => setSel(null)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="stats-title" className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {s.title}
          </h2>
          <p className="mt-1 text-sm text-muted">{s.subtitle}</p>
        </div>
        <div role="radiogroup" aria-label={s.title} className="flex gap-2">
          {(["all", "last100"] as const).map((r) => (
            <button key={r} type="button" role="radio" aria-checked={range === r} onClick={() => setRange(r)} className={tab(range === r)}>
              {r === "all" ? s.allTime : s.last100}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 min-h-12 rounded-xl bg-chip border border-line px-4 py-2.5 text-sm font-semibold flex items-center" aria-live="polite">
        {detail}
      </div>

      <div className="mt-5 grid gap-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">{s.mainNumbers}</h3>
          <Grid cells={w.main} mega={false} selected={sel} onSelect={setSel} />
        </div>
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2">{s.megaNumbers}</h3>
          <Grid cells={w.mega} mega selected={sel} onSelect={setSel} />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
        <span>{t(s.basedOn, { n: w.draws })}</span>
        <span className="flex items-center gap-2" aria-hidden>
          {s.less}
          <span className="h-2 w-24 rounded-full" style={{ background: "linear-gradient(90deg, rgba(0,174,239,.1), rgba(0,174,239,.95))" }} />
          {s.more}
        </span>
      </div>
    </section>
  );
}
