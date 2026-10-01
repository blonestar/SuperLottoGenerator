"use client";

import { useRef, useState } from "react";
import { Ball } from "./Ball";
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

  const pill = (active: boolean) =>
    `rounded-full px-4 h-10 text-sm font-bold border transition-colors cursor-pointer ${
      active ? "bg-sky text-[#00263d] border-transparent shadow-sm" : "bg-chip text-fg border-line hover:border-sky"
    }`;

  const shown: (Ticket | null)[] = tickets.length ? tickets : [null];

  return (
    <section aria-labelledby="gen-title" className="card p-5 sm:p-8">
      <h2 id="gen-title" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
        {g.title}
      </h2>
      <p className="mt-1 text-muted">{g.subtitle}</p>

      <div className="mt-6 grid gap-5">
        <div>
          <div id="mode-label" className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
            {g.mode}
          </div>
          <div role="radiogroup" aria-labelledby="mode-label" className="flex flex-wrap gap-2">
            {MODES.map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={mode === m}
                onClick={() => setMode(m)}
                className={pill(mode === m)}
              >
                {g.modes[m]}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-muted min-h-10">{t(g.modeDesc[mode], { n: HOT_WINDOW })}</p>
          {mode === "unpopular" && (
            <p className="mt-2 text-sm rounded-xl bg-chip border border-line px-3 py-2 text-fg">{g.unpopularNote}</p>
          )}
        </div>

        <div>
          <div id="count-label" className="text-xs font-bold uppercase tracking-wider text-muted mb-2">
            {g.tickets}
          </div>
          <div role="radiogroup" aria-labelledby="count-label" className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                role="radio"
                aria-checked={count === n}
                onClick={() => setCount(n)}
                className={`${pill(count === n)} w-10 !px-0`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={generate}
          className="h-12 px-8 rounded-full font-extrabold text-lg text-[#3d1d00] bg-gradient-to-b from-[#ffe45c] to-[#ffb020] shadow-[0_6px_18px_-4px_rgba(247,148,29,0.7)] dark:shadow-[0_6px_26px_-2px_rgba(247,148,29,0.55)] hover:brightness-105 active:translate-y-px transition cursor-pointer"
        >
          {tickets.length ? g.generateAgain : g.generate}
        </button>
        {tickets.length > 0 && (
          <button
            type="button"
            onClick={copy}
            className="h-12 px-5 rounded-full font-bold border border-line bg-chip hover:border-sky transition-colors cursor-pointer"
          >
            {copied ? g.copied : g.copy}
          </button>
        )}
      </div>

      <ol className="mt-7 grid gap-4" aria-label={g.tickets}>
        {shown.map((tk, ti) => (
          <li
            key={`${run}-${ti}`}
            className="rounded-2xl bg-chip/60 border border-line px-3 py-4 sm:px-5 flex items-center gap-3 sm:gap-4"
          >
            {tickets.length > 1 && (
              <span className="hidden sm:block w-16 text-xs font-bold uppercase tracking-wider text-muted">
                {t(g.ticketN, { n: ti + 1 })}
              </span>
            )}
            <div className="flex flex-1 items-center justify-center sm:justify-start gap-1.5 sm:gap-3">
              {tk
                ? [...tk.numbers, tk.mega].map((n, i) => (
                    <Ball
                      key={i}
                      n={n}
                      mega={i === 5}
                      size="lg"
                      drop
                      delay={ti * 420 + i * 130 + (i === 5 ? 120 : 0)}
                    />
                  ))
                : [0, 1, 2, 3, 4, 5].map((i) => <Ball key={i} mega={i === 5} size="lg" />)}
            </div>
          </li>
        ))}
      </ol>
      {tickets.length === 0 && <p className="mt-3 text-sm text-muted">{g.empty}</p>}

      <p className="sr-only" aria-live="polite" role="status">
        {tickets.length > 0 &&
          `${t(g.liveResult, { count: tickets.length })} ${tickets.map((tk) => formatTicket(tk, g.mega)).join(". ")}`}
      </p>
    </section>
  );
}
