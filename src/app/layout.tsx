import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { getPreferences } from "@/i18n/server";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const { dict } = await getPreferences();
  return { title: dict.meta.title, description: dict.meta.description };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d6f0ff" },
    { media: "(prefers-color-scheme: dark)", color: "#060b1f" },
  ],
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const { locale, theme } = await getPreferences();
  return (
    <html lang={locale === "sr" ? "sr-Latn" : "en"} data-theme={theme} className={`${nunito.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
