# STOCKNINE — 24/7 Tokenized-Stocks Terminal on Solana

> Built for **STOCKLANA** (Solana Foundation hackathon, [hackathons.solana.com](https://hackathons.solana.com/hackathons/stocklana)).
> Main track: **$100,000** · total pool **$121,000** incl. sponsor tracks · **deadline: September 25, 2026, 4 PM ET**.
> Targeting the **Pyth Network track**: *"Best use of Pyth market data — build a Solana app where live financial data does real work."*

**Live app:** https://manuelfeb056-max.github.io/stocknine-terminal/

## What it is

A trading terminal for **tokenized stocks (xStocks) on Solana** that treats the underlying equity and the on-chain token as two sides of the same market:

- **Live xStock prices on-chain** — AAPLX, TSLAX, NVDAX, MSFTX, AMZNX, METAX, GOOGLX, SPYX via Jupiter's price API (real Solana token prices, refreshed every 20s).
- **Underlying equity candles** — 5-minute OHLC from a GitHub-Action oracle mirror (Yahoo Finance, refreshed every 5 min into `docs/data/quotes.json`).
- **Underlying-vs-xStock parity comparator** — live basis in $ and bps, the exact "compare both feeds" idea from the Pyth brief. Each asset shows its Pyth feed symbols + feed IDs (`Equity.US.AAPL/USD` vs `Crypto.AAPLX/USD`, …).
- **Paper trading** — $100,000 simulated portfolio, market buy/sell on live xStock prices, positions with unrealized P&L, trade history, persisted in `localStorage`. No wallet, no real funds, no KYC.
- **NYSE market clock** — open/closed indicator in ET.

## Data architecture (why no API keys)

Pyth's Hermes price endpoints now require an API key (401 since the July 2026 Core upgrade), and Yahoo blocks browser CORS. So STOCKNINE uses an **oracle-mirror pattern**:

1. A scheduled GitHub Action (`.github/workflows/data.yml`, every 5 min) fetches Yahoo 5m candles + Jupiter on-chain xStock prices and commits `docs/data/quotes.json`.
2. The static app reads that JSON same-origin (zero CORS issues, zero keys).
3. In the browser, xStock prices additionally stream live from Jupiter every 20s.

Pyth alignment: every asset carries its canonical Pyth feed IDs (see `src/config.js`); the comparator is built around the `Equity.*` vs `Crypto.*X` feed pair the brief suggests.

## Roadmap

- [x] Scaffold: repo, terminal UI, live xStock prices, parity comparator, paper trading
- [x] Oracle-mirror GitHub Action (5-min refresh)
- [ ] Swap execution via Jupiter (real on-chain trades, user wallet)
- [ ] Limit orders + alerts on basis deviation (arb signal)
- [ ] Backpack xStocks mint/redeem integration
- [ ] Mobile-first layout pass
- [ ] Submit to STOCKLANA (before Sep 25, 4 PM ET)

## Dev

```bash
npm install
node scripts/fetch-data.mjs   # refresh local data
npm run dev                   # dev server
npm run build                 # builds into docs/ (GitHub Pages)
```

## Disclaimer

Paper trading only. Nothing here moves real funds or is financial advice.
