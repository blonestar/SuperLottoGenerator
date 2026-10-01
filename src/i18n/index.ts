import { en, type Dict } from "./en";
import { sr } from "./sr";

export type Locale = "en" | "sr";
export const LOCALES: Locale[] = ["en", "sr"];
export const DEFAULT_LOCALE: Locale = "en";

export const dictionaries: Record<Locale, Dict> = { en, sr };

/** BCP-47 tag used for Intl formatting. */
export const intlTag: Record<Locale, string> = { en: "en-US", sr: "sr-Latn-RS" };

export function isLocale(v: unknown): v is Locale {
  return v === "en" || v === "sr";
}

/** Replace {placeholders} in a template string. */
export function t(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? ""));
}

export type { Dict };
