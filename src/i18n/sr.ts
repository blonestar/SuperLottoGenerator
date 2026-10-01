import type { Dict } from "./en";

export const sr: Dict = {
  meta: {
    title: "SuperLotto Plus generator",
    description:
      "Mali, eksperimentalni generator brojeva za kalifornijski SuperLotto Plus: nasumični, vrući, hladni i manje deljeni brojevi. Samo za zabavu.",
  },
  header: {
    appName: "SuperLotto Plus generator",
    nextDraw: "Sledeće izvlačenje",
    nextDrawDate: "{date} · 19:57 PT",
    days: "d",
    hours: "č",
    minutes: "m",
    seconds: "s",
    language: "Jezik",
    theme: "Tema",
    themeSystem: "Sistemska",
    themeLight: "Svetla",
    themeDark: "Tamna",
  },
  generator: {
    title: "Izaberi brojeve",
    subtitle: "5 brojeva od 1 do 47 i Mega broj od 1 do 27.",
    mode: "Režim",
    modes: {
      random: "Nasumično",
      hot: "Vrući",
      cold: "Hladni",
      unpopular: "Manje deljeni",
    },
    modeDesc: {
      random: "Svaki broj ima istu šansu. Čista sreća.",
      hot: "Brojevi koji su češće izvučeni u poslednjih {n} izvlačenja imaju veću šansu da budu izabrani.",
      cold: "Brojevi koji se retko izvlače ili dugo nisu izvučeni imaju veću šansu da budu izabrani.",
      unpopular:
        "Nasumično, ali preskače kombinacije koje mnogi igraju: uglavnom datume rođenja (1–31), 3 ili više uzastopnih brojeva, aritmetičke nizove, jednu deceniju, umnoške istog broja i već izvučene kombinacije.",
    },
    unpopularNote:
      "Ovo ne povećava šansu za dobitak. Samo smanjuje verovatnoću da morate da delite glavnu nagradu.",
    tickets: "Tiketi",
    generate: "Generiši",
    generateAgain: "Generiši ponovo",
    copy: "Kopiraj",
    copied: "Kopirano!",
    ticketN: "Tiket {n}",
    mega: "Mega",
    megaBall: "Mega broj",
    empty: "Pritisni Generiši da dobiješ brojeve.",
    liveResult: "Generisano tiketa: {count}.",
  },
  stats: {
    title: "Učestalost brojeva",
    subtitle: "Koliko je puta svaki broj izvučen. Svetlije znači češće.",
    allTime: "Sva izvlačenja",
    last100: "Poslednjih 100",
    mainNumbers: "Brojevi (1–47)",
    megaNumbers: "Mega (1–27)",
    basedOn: "Na osnovu {n} izvlačenja.",
    pick: "Dodirni broj ili pređi mišem preko njega za detalje.",
    detail: "Broj {n}: izvučen {count} puta",
    detailMega: "Mega {n}: izvučen {count} puta",
    since0: "u poslednjem izvlačenju",
    sinceN: "poslednji put pre {n} izvlačenja",
    neverSeen: "još nije izvučen",
    less: "Manje",
    more: "Više",
  },
  recent: {
    title: "Poslednja izvlačenja",
    jackpot: "Glavna nagrada",
    megaBall: "Mega broj",
    empty: "Nema dostupnih izvlačenja.",
  },
  footer: {
    disclaimer:
      "Samo za zabavu. Izvlačenja su nasumična; nijedan metod ne može da predvidi rezultat. Igrajte odgovorno. Nije povezano sa California Lottery.",
    source: "Podaci o izvlačenjima:",
    latest: "Poslednje izvlačenje u podacima: {date}",
  },
};
