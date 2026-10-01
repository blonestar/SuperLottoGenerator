import { APP_VERSION } from "@/lib/version";
import { intlTag, t, type Dict, type Locale } from "@/i18n";

export function Footer({ dict, locale, latest }: { dict: Dict; locale: Locale; latest: string | null }) {
  const date = latest
    ? new Intl.DateTimeFormat(intlTag[locale], { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${latest}T00:00:00Z`))
    : "—";
  return (
    <footer className="mx-auto w-full max-w-4xl px-4 py-10 text-center text-sm text-muted grid gap-2">
      <p>{dict.footer.disclaimer}</p>
      <p>
        {dict.footer.source}{" "}
        <a className="underline font-semibold text-accent" href="https://www.lottery.net/california/superlotto-plus" target="_blank" rel="noopener noreferrer">
          lottery.net
        </a>
        {" · "}
        {t(dict.footer.latest, { date })}
      </p>
      <p className="text-xs opacity-70">{`v${APP_VERSION}`}</p>
    </footer>
  );
}
