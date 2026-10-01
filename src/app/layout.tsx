import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import { getPreferences } from "@/i18n/server";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Vercel injects VERCEL_PROJECT_PRODUCTION_URL (host only, no scheme) at build time; fall back to localhost for local runs.
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${process.env.PORT ?? 3000}`;

export async function generateMetadata(): Promise<Metadata> {
  const { dict, locale } = await getPreferences();
  const { title, description } = dict.meta;
  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    openGraph: {
      type: "website",
      siteName: "SuperLotto Plus Generator",
      title,
      description,
      locale: locale === "sr" ? "sr_RS" : "en_US",
    },
    twitter: { card: "summary_large_image", title, description },
  };
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
