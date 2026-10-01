"use client";

import { useRef, useState } from "react";
import { Ball } from "./Ball";
import { SectionHead } from "./SectionHead";
import { HOT_WINDOW, MODES, formatTicket, generateTickets, type Mode, type PastDraw, type Ticket } from "@/lib/generator";
import { t, type Dict } from "@/i18n";

/** history rows are [n1..n5, mega], newest first */
export function Generator({ dict, history }: { dict: Dict; history: number[][] }) {
  const g = dict.generator;
  const [mode, setMode] = useState<Mode>("random");
  const [count, setCount] = useState(3);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [run, setRun] = useState(0);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const generate = () => {
    const past: PastDraw[] = history.map((r) => ({ numbers: r.slice(0, 5), mega: r[5] }));
    setTickets(generateTickets(mode, count, past));
    setRun((r) => r + 1);
    setCopied(false);
  };

  const copy = async () => {
    const text = tickets.map((tk) => formatTicket(tk, g.mega)).join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const cell = (active: boolean) =>
    `h-10 text-sm font-medium transition-colors cursor-pointer ${
      active ? "bg-fg text-bg" : "bg-bg text-fg hover:bg-surface"
    }`;
  const label = "text-xs font-medium uppercase tracking-[0.14em] text-muted mb-2";

  const shown: (Ticket | null)[] = tickets.length ? tickets : Array.from({ length: count }, () => null);

  return (
    <section aria-labelledby="gen-title" className="py-10 sm:py-14">
      <SectionHead id="gen-title" index="01" title={g.title} subtitle={g.subtitle} />

      <div className="mt-8 grid gap-8 md:grid-cols-[18rem_1fr] md:gap-10">
        <div className="grid content-start gap-6">
          <div>
            <div id="mode-label" className={label}>
              {g.mode}
            </div>
            <div role="radiogroup" aria-labelledby="mode-label" className="grid grid-cols-2 gap-px bg-line border border-line">
              {MODES.map((m) => (
                <button key={m} type="button" role="radio" aria-checked={mode === m} onClick={() => setMode(m)} className={cell(mode === m)}>
                  {g.modes[m]}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-muted min-h-10">{t(g.modeDesc[mode], { n: HOT_WINDOW })}</p>
            {mode === "unpopular" && <p className="mt-2 text-sm border-l-2 border-gold pl-3 text-fg">{g.unpopularNote}</p>}
          </div>

          <div>
            <div id="count-label" className={label}>
              {g.tickets}
            </div>
            <div role="radiogroup" aria-labelledby="count-label" className="grid grid-cols-5 gap-px bg-line border border-line">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" role="radio" aria-checked={count === n} onClick={() => setCount(n)} className={`${cell(count === n)} font-mono`}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={generate}
              className="h-12 flex-1 px-6 font-semibold text-white bg-red hover:bg-red-hover active:translate-y-px transition cursor-pointer"
            >
              {tickets.length ? g.generateAgain : g.generate}
            </button>
            {tickets.length > 0 && (
              <button
                type="button"
                onClick={copy}
                className="h-12 px-5 font-medium border border-fg/25 hover:border-fg transition-colors cursor-pointer"
              >
                {copied ? g.copied : g.copy}
              </button>
            )}
          </div>
        </div>

        <div>
          <ol className="bg-surface border border-line divide-y divide-dashed divide-line" aria-label={g.tickets}>
            {shown.map((tk, ti) => (
              <li key={`${run}-${ti}`} className="px-3 py-4 sm:px-6 sm:py-5 flex items-center gap-4">
                <span className="hidden sm:block w-6 font-mono text-sm text-muted" aria-hidden>
                  {String.fromCharCode(65 + ti)}
                </span>
                <span className="sr-only">{t(g.ticketN, { n: ti + 1 })}</span>
                <div className="flex flex-1 items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5">
                  {tk
                    ? [...tk.numbers, tk.mega].map((n, i) => (
                        <Ball
                          key={i}
                          n={n}
                          mega={i === 5}
                          size="lg"
                          drop
                          delay={ti * 380 + i * 110 + (i === 5 ? 120 : 0)}
                        />
                      ))
                    : [0, 1, 2, 3, 4, 5].map((i) => <Ball key={i} mega={i === 5} size="lg" />)}
                </div>
              </li>
            ))}
          </ol>
          {tickets.length === 0 && <p className="mt-3 text-sm text-muted">{g.empty}</p>}
        </div>
      </div>

      <p className="sr-only" aria-live="polite" role="status">
        {tickets.length > 0 &&
          `${t(g.liveResult, { count: tickets.length })} ${tickets.map((tk) => formatTicket(tk, g.mega)).join(". ")}`}
      </p>
    </section>
  );
}
