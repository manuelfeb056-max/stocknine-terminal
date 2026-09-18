# STOCKNINE — Submission Draft (STOCKLANA)

> STATUS: DRAFT — ready for review. Do NOT submit until Mannuel approves.
> Deadline: Friday, September 25, 2026, 4:00 PM ET
> Submit at: https://hackathons.solana.com/hackathons/stocklana

## Project name
STOCKNINE — 24/7 Tokenized-Stocks Terminal on Solana

## One-liner
A trading terminal that treats every listed equity and its Solana token as two sides of the same market — live xStock prices, underlying parity, real on-chain Pyth oracle reads, Meteora liquidity, pre-IPO coverage, and paper trading.

## Links
- Live app: https://manuelfeb056-max.github.io/stocknine-terminal/
- Repo: https://github.com/manuelfeb056-max/stocknine-terminal
- Demo video: https://files.catbox.moe/ebh7l6.mp4 (also in repo: docs/demo.mp4)

## Description
STOCKNINE is a Bloomberg-style terminal for tokenized stocks on Solana, built for STOCKLANA's brief: *make stocks on Solana better than a traditional brokerage account.*

**What it does:**
- **Watchlist + charting** — 8 assets (AAPL, TSLA, NVDA, MSFT, AMZN, META, GOOGL, SPY). 5-minute underlying candles with the live on-chain xStock price overlaid.
- **Parity comparator** — underlying (Nasdaq) vs xStock (Solana) side by side, with the basis in USD and basis points: the exact window an arbitrageur watches, 24/7.
- **Real Pyth integration** — reads 16 Pyth price-feed accounts directly on Solana mainnet (shard-0 PDAs derived from feed IDs; account owner and embedded feed ID verified on every read). Shows price ± confidence interval plus data age per feed, and the xStock-vs-Pyth basis in bps. Zero API keys.
- **Meteora liquidity** — top DLMM pool per xStock via Meteora's public Data API: TVL, fee APY, 24h volume and fees, with a deep link to the pool.
- **Pre-IPO / PreStocks tab** — watchlist of tokenized pre-IPO exposure (ANTHROPIC, OPENAI, SPACEX, ANDURIL, KALSHI, POLYMARKET), the segment that drove ~50% of Solana tokenized-asset volume in the record $169M week of September 2026.
- **Paper trading** — $100,000 simulated portfolio, market buy/sell at live xStock prices, positions with unrealized P&L, trade history, persisted locally. No wallet, no real funds, no KYC.

**Data architecture (no keys, no backend):** a scheduled GitHub Action mirrors Yahoo 5m candles + Jupiter on-chain xStock prices into a JSON file every 5 minutes; the static app reads it same-origin. In the browser, xStock prices stream live from Jupiter, Pyth quotes come straight from Solana RPC, and pool stats from Meteora's API.

## What makes it unique
1. **Three oracles, one screen.** Nasdaq mirror + Jupiter on-chain + Pyth on-chain accounts, compared live with basis in bps. Nobody else at STOCKLANA shows the oracle triangle.
2. **Real on-chain Pyth reads, no Hermes key.** Pyth's free API now requires a key — STOCKNINE bypasses it entirely by parsing the on-chain price-feed accounts (with feed-ID verification per read and honest staleness display).
3. **Liquidity-aware.** Tokenized stocks are only as good as their pools — the Meteora panel makes TVL/APY part of the trading view.
4. **Pre-IPO is the growth story.** PreStocks drove half of tokenized volume; STOCKNINE is the first terminal to give it a dedicated desk next to xStocks.
5. **Zero-friction.** Static site, no signup, no wallet, no KYC — open the URL and trade (paper).

## Sponsor tracks targeted
- **Main track ($100,000)** — full terminal.
- **Pyth** — on-chain price-feed reads, conf intervals, staleness + basis vs Pyth ("live financial data doing real work").
- **Meteora ($5,000)** — DLMM TVL/APY/24h volume+fees per xStock, pool deep links.
- **PreStocks** — dedicated pre-IPO tab with the PreStocks universe and volume narrative.
- Clawpump / Tessera: not targeted by this build.

## Tech
Vite + lightweight-charts. Solana JSON-RPC (`getMultipleAccounts`), Jupiter Lite price API, Meteora DLMM Data API. GitHub Actions oracle mirror. GitHub Pages hosting.

## Team
Solo builder: manuelfeb056-max.

## Disclaimer
Paper trading only. Not financial advice. PreStocks tokens are not affiliated with or endorsed by the underlying companies.
