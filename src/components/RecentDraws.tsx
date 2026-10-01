import { Ball } from "./Ball";
import { SectionHead } from "./SectionHead";
import { intlTag, type Dict, type Locale } from "@/i18n";
import type { Draw } from "@/lib/draws";

export function RecentDraws({ dict, locale, draws }: { dict: Dict; locale: Locale; draws: Draw[] }) {
  const tag = intlTag[locale];
  const dateFmt = new Intl.DateTimeFormat(tag, { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  const money = (v: number | null) =>
    v === null
      ? "—"
      : new Intl.NumberFormat(tag, {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
          notation: v >= 1_000_000 ? "compact" : "standard",
        }).format(v);

  return (
    <section aria-labelledby="recent-title" className="py-10 sm:py-14 border-t border-line">
      <SectionHead id="recent-title" index="03" title={dict.recent.title} />
      {draws.length === 0 ? (
        <p className="mt-3 text-muted">{dict.recent.empty}</p>
      ) : (
        <ul className="mt-6 border-y border-line divide-y divide-line">
          {draws.map((d) => (
            <li key={d.date} className="py-3.5 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
              <time dateTime={d.date} className="sm:w-48 font-mono text-sm text-muted">
                {dateFmt.format(new Date(`${d.date}T00:00:00Z`))}
              </time>
              <div className="flex items-center gap-1.5 sm:gap-2 flex-1">
                {d.numbers.map((n) => (
                  <Ball key={n} n={n} size="sm" />
                ))}
                <span className="mx-1" aria-hidden />
                <Ball n={d.mega} mega size="sm" label={`${dict.recent.megaBall} ${d.mega}`} />
              </div>
              <div className="sm:text-right text-sm">
                <span className="text-muted">{dict.recent.jackpot}: </span>
                <span className="font-mono font-medium">{money(d.jackpot)}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
