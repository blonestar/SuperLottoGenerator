#!/usr/bin/env node
// Fetches California SuperLotto Plus draw history from lottery.net into data/draws.json.
//   node scripts/fetch-draws.mjs --full   fetch every year from 2000 to the current year
//   node scripts/fetch-draws.mjs          incremental: current year (+ previous year in January)
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const START_YEAR = 2000;
const START_DATE = "2000-06-07"; // first SuperLotto Plus (5/47 + Mega 1-27) draw
const BASE_URL = "https://www.lottery.net/california/superlotto-plus/numbers";
const USER_AGENT =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";
const DELAY_MS = 1000;
const RETRIES = 3;
const OUT_FILE = resolve(dirname(fileURLToPath(import.meta.url)), "../data/draws.json");

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchPage(year) {
  const url = `${BASE_URL}/${year}`;
  let lastErr;
  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, Accept: "text/html" } });
      if (res.status === 200) return await res.text();
      lastErr = new Error(`HTTP ${res.status} for ${url}`);
      if (res.status >= 400 && res.status < 500 && res.status !== 429) break; // not retryable
    } catch (e) {
      lastErr = e;
    }
    if (attempt < RETRIES) await sleep(DELAY_MS * 2 * attempt);
  }
  throw lastErr;
}

function parseDate(text) {
  const m = /^([A-Za-z]+)\s+(\d{1,2}),\s*(\d{4})$/.exec(text.trim());
  if (!m) throw new Error(`Unparseable date: "${text}"`);
  const month = MONTHS.indexOf(m[1].toLowerCase()) + 1;
  if (!month) throw new Error(`Unknown month in date: "${text}"`);
  const iso = `${m[3]}-${String(month).padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== iso) throw new Error(`Invalid date: "${text}"`);
  return iso;
}

function parseMoneyOrCount(text) {
  if (!text) return null;
  const t = text.replace(/&nbsp;/g, " ").replace(/<[^>]*>/g, "").trim();
  const m = /^\$?\s*([\d,]+(?:\.\d+)?)\s*(million|billion)?$/i.exec(t);
  if (!m) return null;
  let n = Number(m[1].replace(/,/g, ""));
  if (m[2]) n *= m[2].toLowerCase() === "million" ? 1e6 : 1e9;
  return Number.isFinite(n) ? n : null;
}

function cell(row, title) {
  const m = new RegExp(`<td[^>]*data-title="${title}"[^>]*>([\\s\\S]*?)</td>`, "i").exec(row);
  return m ? m[1] : null;
}

export function validate(d) {
  const ok =
    d &&
    /^\d{4}-\d{2}-\d{2}$/.test(d.date) &&
    Array.isArray(d.numbers) &&
    d.numbers.length === 5 &&
    d.numbers.every((n, i) => Number.isInteger(n) && n >= 1 && n <= 47 && (i === 0 || n > d.numbers[i - 1])) &&
    Number.isInteger(d.mega) && d.mega >= 1 && d.mega <= 27 &&
    (d.jackpot === null || (typeof d.jackpot === "number" && d.jackpot >= 0)) &&
    (d.winners === null || (Number.isInteger(d.winners) && d.winners >= 0)) &&
    d.date >= START_DATE;
  if (!ok) throw new Error(`Invalid draw record: ${JSON.stringify(d)}`);
  return d;
}

/** Parse one year page. Returns { draws, skipped } where skipped = pre-SuperLotto-Plus rows. */
function parseYear(html, year) {
  const draws = new Map();
  let skipped = 0;
  const rows = html.split(/<tr[\s>]/i).slice(1);
  for (const row of rows) {
    const dm = /<td class="colour noBefore">([^<]*)<\/td>/.exec(row);
    if (!dm) continue; // header or non-draw row
    const date = parseDate(dm[1]);
    if (!date.startsWith(`${year}-`)) throw new Error(`Row date ${date} found on ${year} page`);
    if (date < START_DATE) { skipped++; continue; }
    const balls = [...row.matchAll(/<li class="ball ca-superlotto-plus (ball|mega-ball)">\s*(\d+)\s*<\/li>/g)];
    const main = balls.filter((b) => b[1] === "ball").map((b) => Number(b[2]));
    const mega = balls.filter((b) => b[1] === "mega-ball").map((b) => Number(b[2]));
    if (main.length !== 5 || mega.length !== 1) throw new Error(`Malformed balls for ${date}: ${main.length} main, ${mega.length} mega`);
    const rec = validate({
      date,
      numbers: [...main].sort((a, b) => a - b),
      mega: mega[0],
      jackpot: parseMoneyOrCount(cell(row, "Jackpot")),
      winners: parseMoneyOrCount(cell(row, "Winners")),
    });
    const prev = draws.get(date);
    if (prev && JSON.stringify(prev) !== JSON.stringify(rec)) throw new Error(`Conflicting duplicate rows for ${date}`);
    draws.set(date, rec);
  }
  return { draws: [...draws.values()], skipped };
}

function serialize(draws) {
  const f = (d) => JSON.stringify({ date: d.date, numbers: d.numbers, mega: d.mega, jackpot: d.jackpot, winners: d.winners });
  return "[\n" + draws.map((d) => "  " + f(d)).join(",\n") + "\n]\n";
}

async function main() {
  const full = process.argv.includes("--full");
  const now = new Date();
  const thisYear = now.getUTCFullYear();
  const years = [];
  if (full) for (let y = START_YEAR; y <= thisYear; y++) years.push(y);
  else {
    if (now.getUTCMonth() === 0) years.push(thisYear - 1);
    years.push(thisYear);
  }

  let existingText = "";
  const merged = new Map();
  try {
    existingText = await readFile(OUT_FILE, "utf8");
    if (!full) for (const d of JSON.parse(existingText)) merged.set(d.date, validate(d));
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  const before = new Set(merged.keys());
  const oldDates = existingText ? new Set(JSON.parse(existingText).map((d) => d.date)) : before;

  let skipped = 0;
  for (let i = 0; i < years.length; i++) {
    if (i > 0) await sleep(DELAY_MS);
    const html = await fetchPage(years[i]);
    const { draws, skipped: s } = parseYear(html, years[i]);
    if (draws.length === 0 && s === 0) throw new Error(`No draw rows parsed for ${years[i]}`);
    skipped += s;
    for (const d of draws) merged.set(d.date, d);
    console.log(`${years[i]}: ${draws.length} draws${s ? ` (${s} pre-SuperLotto-Plus rows skipped)` : ""}`);
  }

  const all = [...merged.values()].sort((a, b) => (a.date < b.date ? 1 : -1));
  if (all.length === 0) throw new Error("No draws collected");
  const out = serialize(all);
  const added = all.filter((d) => !oldDates.has(d.date)).length;
  let changed = out !== existingText;
  if (changed) {
    await mkdir(dirname(OUT_FILE), { recursive: true });
    await writeFile(OUT_FILE, out);
  }
  console.log(`${changed ? "Wrote" : "No changes to"} ${OUT_FILE}`);
  console.log(`Total draws: ${all.length}, newest: ${all[0].date}, oldest: ${all.at(-1).date}, added: ${added}${skipped ? `, skipped: ${skipped}` : ""}`);
}

main().catch((e) => {
  console.error("fetch-draws failed:", e.message);
  process.exit(1);
});
