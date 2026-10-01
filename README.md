# SuperLotto Plus Generator

A small, fun number generator and stats page for **California SuperLotto Plus** (5 numbers from 1-47 plus a Mega number from 1-27). Built as an experiment, just for fun.

**Live:** https://superlotto-generator.vercel.app

> **Disclaimer:** Lottery draws are random. No method, statistic or "system" can improve your odds of winning. The "Less shared" mode only reduces the chance that you would have to split a jackpot with other players if you win. This project is not affiliated with, endorsed by, or connected to the California Lottery. Please play responsibly.

## Features

- **Ticket generator** with four modes, 1-5 tickets at a time:
  - **Random**: uniform picks using a cryptographically secure RNG.
  - **Hot**: favors numbers drawn most often in recent draws.
  - **Cold**: favors long-overdue and infrequent numbers.
  - **Less shared**: avoids patterns many people play (birthday-only numbers, runs, arithmetic sequences, past draws).
- **Frequency heat grid** for the main numbers and the Mega number
- **Recent draws** list
- **Next-draw countdown**
- **English and Serbian** interface
- **System / Light / Dark** theme, with language and theme remembered in cookies

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Vitest. Hosted on Vercel.

## Data

Draw history lives in [`data/draws.json`](data/draws.json), starting 2000-06-07 (the first SuperLotto Plus draw). It is scraped from [lottery.net](https://www.lottery.net/california/superlotto-plus/numbers) by [`scripts/fetch-draws.mjs`](scripts/fetch-draws.mjs):

```bash
pnpm fetch-draws          # incremental: current year (plus previous year in January)
pnpm fetch-draws --full   # full rebuild from 2000 onward
```

A GitHub Action ([`update-draws.yml`](.github/workflows/update-draws.yml)) runs on Thursday and Sunday at 10:00 and 18:00 UTC. If there are new draws it commits them, and Vercel redeploys automatically.

## Getting started

Requires Node.js and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev      # start the dev server at http://localhost:3000
pnpm test     # run unit tests
pnpm lint     # lint
pnpm build    # production build
```

The app version (shown in the footer) is the `version` field in `package.json`.

## Project structure

```
src/
  app/          # Next.js app router: page, layout, server actions (lang/theme cookies)
  components/   # Generator, Stats, RecentDraws, Header, Footer, Ball
  i18n/         # English and Serbian translations
  lib/          # generator.ts (modes), stats.ts (frequencies), draws.ts, next-draw.ts
data/draws.json          # draw history
scripts/fetch-draws.mjs  # draw scraper
.github/workflows/       # scheduled data update
```

## License

No license specified.
