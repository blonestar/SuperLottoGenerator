"use server";

import { cookies } from "next/headers";
import { isLocale } from "@/i18n";

const YEAR = 60 * 60 * 24 * 365;

export async function setLanguage(lang: string) {
  if (!isLocale(lang)) return;
  (await cookies()).set("lang", lang, { maxAge: YEAR, path: "/", sameSite: "lax" });
}

export async function setTheme(theme: string) {
  if (theme !== "system" && theme !== "light" && theme !== "dark") return;
  (await cookies()).set("theme", theme, { maxAge: YEAR, path: "/", sameSite: "lax" });
}
