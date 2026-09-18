import { createChart, CandlestickSeries, LineSeries } from "lightweight-charts";
import { ASSETS, JUP_PRICE_API, DATA_URL, STARTING_CASH, LS_KEY } from "./config.js";
import "./styles.css";

const $ = (s) => document.querySelector(s);
const fmt$ = (n, d = 2) => n == null || isNaN(n) ? "—" : "$" + Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtPct = (n) => n == null || isNaN(n) ? "—" : (n >= 0 ? "+" : "") + n.toFixed(2) + "%";
const cls = (n) => n == null ? "" : n >= 0 ? "pos" : "neg";

// ---------- state ----------
let quotes = {};            // from data/quotes.json
let liveX = {};             // live xStock prices from Jupiter
let sparkX = {};            // per-asset recent xStock ticks (for sparkline)
let active = "AAPL";
let chart, candleSeries, xLineSeries;

// ---------- portfolio (localStorage) ----------
function loadPF() {
  try {
    const p = JSON.parse(localStorage.getItem(LS_KEY));
    if (p && typeof p.cash === "number") return p;
  } catch {}
  return { cash: STARTING_CASH, positions: {}, trades: [] };
}
let pf = loadPF();
const savePF = () => localStorage.setItem(LS_KEY, JSON.stringify(pf));

const xPrice = (sym) => liveX[sym] ?? quotes[sym]?.xstock?.price ?? null;

function portfolioValue() {
  let v = pf.cash;
  for (const [sym, pos] of Object.entries(pf.positions)) {
    const px = xPrice(sym);
    if (px) v += pos.qty * px;
  }
  return v;
}

// ---------- market clock (NYSE) ----------
function marketStatus() {
  const now = new Date();
  const et = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const day = et.getDay(), mins = et.getHours() * 60 + et.getMinutes();
  const open = day > 0 && day < 6 && mins >= 570 && mins < 960;
  return { open, et };
}

// ---------- data loading ----------
async function loadQuotes() {
  try {
    const r = await fetch(DATA_URL + "?t=" + Date.now(), { cache: "no-store" });
    if (!r.ok) throw new Error(r.status);
    quotes = await r.json();
    const upd = quotes._updated ? new Date(quotes._updated * 1000) : null;
    $("#dataAge").textContent = upd ? "data " + upd.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "";
    return true;
  } catch (e) {
    $("#dataAge").textContent = "data unavailable";
    return false;
  }
}

async function refreshLiveX() {
  try {
    const ids = ASSETS.map((a) => a.mint).join(",");
    const r = await fetch(`${JUP_PRICE_API}?ids=${ids}`, { cache: "no-store" });
    if (!r.ok) return;
    const d = await r.json();
    const t = Math.floor(Date.now() / 1000);
    for (const a of ASSETS) {
      const p = d[a.mint]?.usdPrice;
      if (p) {
        liveX[a.sym] = p;
        (sparkX[a.sym] ||= []).push({ time: t, value: p });
        if (sparkX[a.sym].length > 120) sparkX[a.sym].shift();
      }
    }
    renderList(); renderCompare(); renderPortfolio();
  } catch {}
}

// ---------- sidebar list ----------
function renderList() {
  const el = $("#assetList");
  el.innerHTML = "";
  for (const a of ASSETS) {
    const q = quotes[a.sym];
    const px = q?.underlying?.price ?? null;
    const chg = q?.underlying?.changePct ?? null;
    const xp = xPrice(a.sym);
    const row = document.createElement("button");
    row.className = "asset" + (a.sym === active ? " active" : "");
    row.innerHTML = `
      <div class="a-top"><span class="a-sym">${a.sym}</span><span class="a-px">${fmt$(px)}</span></div>
      <div class="a-sub"><span class="a-name">${a.name}</span><span class="a-chg ${cls(chg)}">${fmtPct(chg)}</span></div>
      <div class="a-x">xStock <b>${fmt$(xp, 4)}</b></div>`;
    row.onclick = () => { active = a.sym; renderList(); renderAll(); };
    el.appendChild(row);
  }
}

// ---------- chart ----------
function buildChart() {
  const el = $("#chart");
  chart = createChart(el, {
    layout: { background: { color: "transparent" }, textColor: "#8b93a7", fontFamily: "JetBrains Mono, monospace" },
    grid: { vertLines: { color: "rgba(255,255,255,0.04)" }, horzLines: { color: "rgba(255,255,255,0.04)" } },
    rightPriceScale: { borderColor: "rgba(255,255,255,0.1)" },
    timeScale: { borderColor: "rgba(255,255,255,0.1)", timeVisible: true },
    crosshair: { mode: 1 },
  });
  candleSeries = chart.addSeries(CandlestickSeries, {
    upColor: "#26d07c", downColor: "#ff4d67", wickUpColor: "#26d07c", wickDownColor: "#ff4d67",
    borderVisible: false,
  });
  xLineSeries = chart.addSeries(LineSeries, { color: "#7c5cff", lineWidth: 2, priceLineVisible: false, lastValueVisible: true });
  new ResizeObserver(() => chart.applyOptions({ width: el.clientWidth, height: el.clientHeight })).observe(el);
}

function renderChart() {
  const a = ASSETS.find((x) => x.sym === active);
  const q = quotes[active];
  const candles = q?.underlying?.candles || [];
  candleSeries.setData(candles);
  // xStock line: underlying candles scaled by live basis ratio (tracks ~1:1)
  const u = q?.underlying?.price, x = xPrice(active);
  if (u && x && candles.length) {
    const ratio = x / u;
    xLineSeries.setData(candles.map((c) => ({ time: c.time, value: +(c.close * ratio).toFixed(4) })));
    xLineSeries.applyOptions({ title: a.xsym + " (derived)" });
  } else xLineSeries.setData([]);
  chart.timeScale().scrollToRealTime();
  $("#chartTitle").textContent = `${a.sym} · ${a.name} — 5m candles (underlying) + ${a.xsym} overlay`;
}

// ---------- comparator ----------
function renderCompare() {
  const a = ASSETS.find((x) => x.sym === active);
  const q = quotes[active];
  const u = q?.underlying?.price ?? null;
  const x = xPrice(active);
  const spread = u && x ? x - u : null;
  const bps = u && spread != null ? (spread / u) * 10000 : null;
  $("#cmpU").textContent = fmt$(u);
  $("#cmpX").textContent = fmt$(x, 4);
  const sEl = $("#cmpSpread");
  sEl.textContent = spread == null ? "—" : `${spread >= 0 ? "+" : ""}${fmt$(spread, 4)} · ${bps >= 0 ? "+" : ""}${bps.toFixed(1)} bps`;
  sEl.className = "cmp-val " + cls(spread);
  $("#cmpFeedU").textContent = a.pythU.symbol;
  $("#cmpFeedX").textContent = a.pythX.symbol;
  $("#cmpFeedUid").textContent = "feed " + a.pythU.id.slice(0, 12) + "…";
  $("#cmpFeedXid").textContent = "feed " + a.pythX.id.slice(0, 12) + "…";
  const src = q?.underlying?.source || "mirror";
  const upd = quotes._updated ? new Date(quotes._updated * 1000).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "";
  $("#cmpSrc").textContent = `underlying: ${src} · xStock: jupiter on-chain · mirror ${upd}`;
}

// ---------- trading ----------
function renderTradePanel() {
  const a = ASSETS.find((x) => x.sym === active);
  const px = xPrice(active);
  $("#tradeSym").textContent = a.xsym;
  $("#tradePx").textContent = fmt$(px, 4);
  const pos = pf.positions[active];
  $("#posInfo").textContent = pos ? `${pos.qty.toFixed(4)} @ ${fmt$(pos.avgCost, 4)}` : "no position";
  $("#cashInfo").textContent = fmt$(pf.cash);
}

function order(side) {
  const px = xPrice(active);
  if (!px) return alert("Price not available yet.");
  const amt = parseFloat($("#tradeAmt").value);
  if (!amt || amt <= 0) return alert("Enter a USD amount.");
  const a = ASSETS.find((x) => x.sym === active);
  if (side === "buy") {
    if (amt > pf.cash) return alert("Insufficient paper cash.");
    const qty = amt / px;
    const pos = pf.positions[active] || { qty: 0, avgCost: 0 };
    pos.avgCost = (pos.avgCost * pos.qty + amt) / (pos.qty + qty);
    pos.qty += qty;
    pf.positions[active] = pos;
    pf.cash -= amt;
    pf.trades.unshift({ t: Date.now(), sym: active, side: "BUY", qty, px, amt });
  } else {
    const pos = pf.positions[active];
    if (!pos || pos.qty <= 0) return alert("No position to sell.");
    const qty = Math.min(amt / px, pos.qty);
    const proceeds = qty * px;
    const realized = (px - pos.avgCost) * qty;
    pos.qty -= qty;
    if (pos.qty < 1e-9) delete pf.positions[active];
    pf.cash += proceeds;
    pf.trades.unshift({ t: Date.now(), sym: active, side: "SELL", qty, px, amt: proceeds, pnl: realized });
  }
  pf.trades = pf.trades.slice(0, 100);
  savePF(); renderPortfolio(); renderTradePanel();
}

function renderPortfolio() {
  const val = portfolioValue();
  const pnl = val - STARTING_CASH;
  const pnlPct = (pnl / STARTING_CASH) * 100;
  $("#pfVal").textContent = fmt$(val);
  const pe = $("#pfPnl");
  pe.textContent = `${pnl >= 0 ? "+" : ""}${fmt$(pnl)} (${fmtPct(pnlPct)})`;
  pe.className = "pf-pnl " + cls(pnl);
  $("#pfCash").textContent = fmt$(pf.cash);

  const tb = $("#posBody");
  tb.innerHTML = "";
  for (const [sym, pos] of Object.entries(pf.positions)) {
    const px = xPrice(sym);
    const mv = px ? pos.qty * px : null;
    const upnl = px ? (px - pos.avgCost) * pos.qty : null;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><b>${sym}</b></td><td>${pos.qty.toFixed(4)}</td><td>${fmt$(pos.avgCost, 4)}</td>
      <td>${fmt$(px, 4)}</td><td>${fmt$(mv)}</td><td class="${cls(upnl)}">${upnl == null ? "—" : (upnl >= 0 ? "+" : "") + fmt$(upnl)}</td>`;
    tb.appendChild(tr);
  }
  if (!tb.children.length) tb.innerHTML = `<tr><td colspan="6" class="empty">No open positions — pick an asset and buy.</td></tr>`;

  const hb = $("#tradeBody");
  hb.innerHTML = "";
  for (const t of pf.trades.slice(0, 12)) {
    const d = new Date(t.t);
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}</td>
      <td class="${t.side === "BUY" ? "pos" : "neg"}"><b>${t.side}</b></td><td><b>${t.sym}</b></td>
      <td>${t.qty.toFixed(4)}</td><td>${fmt$(t.px, 4)}</td>
      <td class="${cls(t.pnl)}">${t.pnl != null ? (t.pnl >= 0 ? "+" : "") + fmt$(t.pnl) : "—"}</td>`;
    hb.appendChild(tr);
  }
  if (!hb.children.length) hb.innerHTML = `<tr><td colspan="6" class="empty">No trades yet.</td></tr>`;
}

// ---------- header ----------
function renderHeader() {
  const { open, et } = marketStatus();
  const dot = $("#mktDot"), txt = $("#mktTxt");
  dot.className = "dot " + (open ? "open" : "closed");
  txt.textContent = open ? "NYSE OPEN" : "NYSE CLOSED";
  $("#clock").textContent = et.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " ET";
}

function renderAll() { renderChart(); renderCompare(); renderTradePanel(); }

// ---------- init ----------
async function init() {
  buildChart();
  $("#buyBtn").onclick = () => order("buy");
  $("#sellBtn").onclick = () => order("sell");
  $("#resetBtn").onclick = () => {
    if (confirm("Reset paper portfolio to $100,000?")) {
      pf = { cash: STARTING_CASH, positions: {}, trades: [] };
      savePF(); renderPortfolio(); renderTradePanel();
    }
  };
  $("#refreshBtn").onclick = async () => { await loadQuotes(); await refreshLiveX(); renderAll(); };
  renderHeader(); setInterval(renderHeader, 1000);
  await loadQuotes();
  renderList(); renderAll(); renderPortfolio();
  await refreshLiveX();
  setInterval(refreshLiveX, 20000);
  setInterval(async () => { await loadQuotes(); renderList(); renderAll(); }, 120000);
  window.addEventListener("resize", () => renderAll());
}
init();
