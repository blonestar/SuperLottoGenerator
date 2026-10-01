import { cookies } from "next/headers";
import { DEFAULT_LOCALE, dictionaries, isLocale, type Locale } from "./index";

export type Theme = "system" | "light" | "dark";
export const THEMES: Theme[] = ["system", "light", "dark"];

export async function getPreferences() {
  const store = await cookies();
  const l = store.get("lang")?.value;
  const th = store.get("theme")?.value;
  const locale: Locale = isLocale(l) ? l : DEFAULT_LOCALE;
  const theme: Theme = THEMES.includes(th as Theme) ? (th as Theme) : "system";
  return { locale, theme, dict: dictionaries[locale] };
}
