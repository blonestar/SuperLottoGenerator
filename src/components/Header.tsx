"use client";

import { useSyncExternalStore, useTransition } from "react";
import { setLanguage, setTheme } from "@/app/actions";
import { intlTag, LOCALES, t, type Dict, type Locale } from "@/i18n";
import { nextDrawAt } from "@/lib/next-draw";

type Theme = "system" | "light" | "dark";

function subscribe(cb: () => void) {
  const id = setInterval(cb, 1000);
  return () => clearInterval(id);
}
const getSnapshot = () => Math.floor(Date.now() / 1000);
const getServerSnapshot = () => null;

function Countdown({ dict, locale }: { dict: Dict; locale: Locale }) {
  const nowSec = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const h = dict.header;
  let parts: [string, string][] = [
    ["-", h.days],
    ["--", h.hours],
    ["--", h.minutes],
    ["--", h.seconds],
  ];
  let sub = " ";
  if (nowSec !== null) {
    const target = nextDrawAt(nowSec * 1000);
    let left = Math.max(0, Math.floor(target / 1000) - nowSec);
    const d = Math.floor(left / 86400);
    left %= 86400;
    const hh = Math.floor(left / 3600);
    left %= 3600;
    const mm = Math.floor(left / 60);
    const ss = left % 60;
    const p = (n: number) => String(n).padStart(2, "0");
    parts = [
      [String(d), h.days],
      [p(hh), h.hours],
      [p(mm), h.minutes],
      [p(ss), h.seconds],
    ];
    const dateStr = new Intl.DateTimeFormat(intlTag[locale], {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "America/Los_Angeles",
    }).format(target);
    sub = t(h.nextDrawDate, { date: dateStr });
  }
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div className="flex flex-col leading-snug min-w-0">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-band-muted">{h.nextDraw}</span>
        <span className="text-sm text-band-fg first-letter:uppercase" suppressHydrationWarning>
          {sub}
        </span>
      </div>
      <span className="font-mono tabular-nums whitespace-nowrap flex items-baseline gap-3 sm:gap-4" suppressHydrationWarning>
        {parts.map(([v, u], i) => (
          <span key={i} className="flex items-baseline gap-0.5">
            <span className="text-3xl sm:text-4xl font-medium text-band-fg">{v}</span>
            <span className="text-sm text-band-muted">{u}</span>
          </span>
        ))}
      </span>
    </div>
  );
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string; content: React.ReactNode }[];
  onChange: (v: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex border border-band-line">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={o.label}
            title={o.label}
            onClick={() => onChange(o.value)}
            className={`h-8 min-w-8 px-2.5 text-xs font-semibold tracking-wide flex items-center justify-center transition-colors cursor-pointer ${
              active ? "bg-band-fg text-band" : "text-band-muted hover:text-band-fg"
            }`}
          >
            {o.content}
          </button>
        );
      })}
    </div>
  );
}

const icon = "size-4";
const SunIcon = (
  <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const MoonIcon = (
  <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
);
const SystemIcon = (
  <svg className={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </svg>
);

export function Header({ dict, locale, theme }: { dict: Dict; locale: Locale; theme: Theme }) {
  const [pending, startTransition] = useTransition();
  const h = dict.header;

  const changeTheme = (v: Theme) => {
    document.documentElement.dataset.theme = v; // instant; the cookie is persisted by the action
    startTransition(() => setTheme(v));
  };
  const changeLang = (v: Locale) => {
    startTransition(() => setLanguage(v));
  };

  return (
    <header className="bg-band text-band-fg" aria-busy={pending}>
      <div className="mx-auto w-full max-w-5xl px-4 pt-4 sm:pt-5 pb-7 sm:pb-9">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-7 w-10 shrink-0" aria-hidden>
              <span className="absolute left-0 top-0 size-7 rounded-full bg-red" />
              <span className="absolute right-0 top-0 size-7 rounded-full bg-gold ring-2 ring-band" />
            </span>
            <div className="leading-tight">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight">{h.appName}</h1>
              <p className="text-xs text-band-muted">{h.unofficial}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Segmented
              label={h.language}
              value={locale}
              onChange={changeLang}
              options={LOCALES.map((l) => ({ value: l, label: l === "en" ? "English" : "Srpski", content: l.toUpperCase() }))}
            />
            <Segmented<Theme>
              label={h.theme}
              value={theme}
              onChange={changeTheme}
              options={[
                { value: "system", label: h.themeSystem, content: SystemIcon },
                { value: "light", label: h.themeLight, content: SunIcon },
                { value: "dark", label: h.themeDark, content: MoonIcon },
              ]}
            />
          </div>
        </div>
        <div className="mt-8 sm:mt-10">
          <Countdown dict={dict} locale={locale} />
        </div>
      </div>
      <div className="stripe h-1" />
    </header>
  );
}
