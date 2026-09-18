// Fetches underlying equity candles via Yahoo Finance + xStock prices via Jupiter,
// writes public/data/quotes.json (and docs/data/quotes.json for the live site).
// Run: node scripts/fetch-data.mjs [--out dir]
import { writeFileSync, mkdirSync } from "fs";

const UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36";
const OUTS = process.argv.includes("--out") ? [process.argv[process.argv.indexOf("--out") + 1]] : ["public/data", "docs/data"];

const ASSETS = [
  ["AAPL", "AAPL", "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp"],
  ["TSLA", "TSLA", "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB"],
  ["NVDA", "NVDA", "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh"],
  ["MSFT", "MSFT", "XspzcW1PRtgf6Wj92HCiZdjzKCyFekVD8P5Ueh3dRMX"],
  ["AMZN", "AMZN", "Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg"],
  ["META", "META", "Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu"],
  ["GOOGL", "GOOGL", "XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN"],
  ["SPY", "SPY", "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W"],
];

async function jget(url) {
  const r = await fetch(url, { headers: { "User-Agent": UA } });
  if (!r.ok) throw new Error(`${url} -> ${r.status}`);
  return r.json();
}

async function yahoo(sym) {
  const d = await jget(`https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=5m&range=5d`);
  const res = d.chart.result[0];
  const q = res.indicators.quote[0];
  const candles = [];
  res.timestamp.forEach((t, i) => {
    if (q.close[i] == null) return;
    candles.push({ time: t, open: +q.open[i].toFixed(4), high: +q.high[i].toFixed(4), low: +q.low[i].toFixed(4), close: +q.close[i].toFixed(4), volume: q.volume[i] || 0 });
  });
  const m = res.meta;
  const price = m.regularMarketPrice;
  const prev = m.chartPreviousClose ?? m.previousClose;
  return {
    price, prevClose: prev,
    changePct: prev ? ((price - prev) / prev) * 100 : null,
    candles: candles.slice(-400),
    source: "yahoo",
  };
}

async function jupiter(mints) {
  const d = await jget(`https://lite-api.jup.ag/price/v3?ids=${mints.join(",")}`);
  return d;
}

const out = { _updated: Math.floor(Date.now() / 1000), _note: "STOCKNINE oracle mirror: yahoo 5m candles + jupiter on-chain xStock prices" };
const mints = ASSETS.map((a) => a[2]);
let jpx = {};
try { jpx = await jupiter(mints); } catch (e) { console.error("jupiter failed:", e.message); }

for (const [sym, ysym, mint] of ASSETS) {
  const entry = {};
  try {
    entry.underlying = await yahoo(ysym);
    console.log(sym, "yahoo ok:", entry.underlying.price, `(${entry.underlying.candles.length} candles)`);
  } catch (e) { console.error(sym, "yahoo failed:", e.message); entry.underlying = null; }
  const p = jpx[mint]?.usdPrice;
  entry.xstock = p ? { price: p, source: "jupiter-onchain" } : null;
  console.log(sym, "xstock:", p ?? "n/a");
  out[sym] = entry;
  await new Promise((r) => setTimeout(r, 400)); // be gentle
}

for (const dir of OUTS) {
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/quotes.json`, JSON.stringify(out));
  console.log("wrote", `${dir}/quotes.json`);
}
