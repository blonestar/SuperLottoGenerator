import { Header } from "@/components/Header";
import { Generator } from "@/components/Generator";
import { Stats } from "@/components/Stats";
import { RecentDraws } from "@/components/RecentDraws";
import { Footer } from "@/components/Footer";
import { getPreferences } from "@/i18n/server";
import { draws, latestDrawDate, recentDraws } from "@/lib/draws";
import { computeStats } from "@/lib/stats";

const history = draws.map((d) => [...d.numbers, d.mega]);
const stats = computeStats(draws);

export default async function Home() {
  const { locale, theme, dict } = await getPreferences();
  return (
    <>
      <Header dict={dict} locale={locale} theme={theme} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-4">
        <Generator dict={dict} history={history} />
        <Stats dict={dict} stats={stats} />
        <RecentDraws dict={dict} locale={locale} draws={recentDraws()} />
      </main>
      <Footer dict={dict} locale={locale} latest={latestDrawDate} />
    </>
  );
}
