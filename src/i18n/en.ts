export const en = {
  meta: {
    title: "SuperLotto Plus Generator",
    description:
      "A small, experimental number generator for California SuperLotto Plus: random, hot, cold and less-shared picks. For fun only.",
  },
  header: {
    appName: "SuperLotto Plus Generator",
    nextDraw: "Next draw",
    nextDrawDate: "{date} · 7:57 pm PT",
    days: "d",
    hours: "h",
    minutes: "m",
    seconds: "s",
    language: "Language",
    theme: "Theme",
    themeSystem: "System",
    themeLight: "Light",
    themeDark: "Dark",
  },
  generator: {
    title: "Pick your numbers",
    subtitle: "5 numbers from 1–47 plus a Mega number from 1–27.",
    mode: "Mode",
    modes: {
      random: "Random",
      hot: "Hot",
      cold: "Cold",
      unpopular: "Less shared",
    },
    modeDesc: {
      random: "Every number is equally likely. Pure luck.",
      hot: "Numbers drawn more often in the last {n} draws are more likely to be picked.",
      cold: "Numbers that are rarely drawn or long overdue are more likely to be picked.",
      unpopular:
        "Random, but skips combinations many people play: mostly birthdays (1–31), runs of 3+ consecutive numbers, arithmetic sequences, a single decade, multiples of one number, and past winning draws.",
    },
    unpopularNote:
      "This does not raise your odds of winning. It only makes it less likely that you would have to share a jackpot.",
    tickets: "Tickets",
    generate: "Generate",
    generateAgain: "Generate again",
    copy: "Copy",
    copied: "Copied!",
    ticketN: "Ticket {n}",
    mega: "Mega",
    megaBall: "Mega number",
    empty: "Press Generate to get your numbers.",
    liveResult: "Generated {count} ticket(s).",
  },
  stats: {
    title: "Number frequency",
    subtitle: "How often each number has been drawn. Brighter means more often.",
    allTime: "All time",
    last100: "Last 100 draws",
    mainNumbers: "Numbers (1–47)",
    megaNumbers: "Mega (1–27)",
    basedOn: "Based on {n} draws.",
    pick: "Tap or hover a number to see details.",
    detail: "Number {n}: drawn {count} times",
    detailMega: "Mega {n}: drawn {count} times",
    since0: "in the latest draw",
    sinceN: "last seen {n} draws ago",
    neverSeen: "not seen yet",
    less: "Less",
    more: "More",
  },
  recent: {
    title: "Recent draws",
    jackpot: "Jackpot",
    megaBall: "Mega number",
    empty: "No draws available.",
  },
  footer: {
    disclaimer:
      "For fun only. Lottery draws are random; no method can predict results. Please play responsibly. Not affiliated with the California Lottery.",
    source: "Draw data from",
    latest: "Latest draw in data: {date}",
  },
};

type DeepString<T> = { [K in keyof T]: T[K] extends string ? string : DeepString<T[K]> };
export type Dict = DeepString<typeof en>;
