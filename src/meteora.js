// Meteora DLMM liquidity for xStocks: TVL, APY/APR, 24h volume & fees.
// Uses Meteora's public DLMM Data API (no key):
//   https://dlmm.datapi.meteora.ag/pools?query=<mint>&sort_by=tvl:desc
// Picks the highest-TVL non-blacklisted pool per xStock mint.

import { ASSETS, METEORA_API } from "./config.js";

async function poolsForMint(mint) {
  const r = await fetch(
    `${METEORA_API}/pools?query=${encodeURIComponent(mint)}&page=1&page_size=10&sort_by=tvl:desc`
  );
  if (!r.ok) return [];
  const j = await r.json();
  return (j?.data || []).filter((p) => !p.is_blacklisted && (p.tvl || 0) > 0);
}

export async function fetchMeteora() {
  const out = {};
  const results = await Promise.allSettled(ASSETS.map((a) => poolsForMint(a.mint)));
  results.forEach((res, i) => {
    if (res.status !== "fulfilled" || !res.value.length) return;
    const a = ASSETS[i];
    const pools = res.value.slice().sort((x, y) => (y.tvl || 0) - (x.tvl || 0));
    const top = pools[0];
    const oursIsX = top.token_x && top.token_x.address === a.mint;
    const quoteSym = oursIsX ? top.token_y?.symbol : top.token_x?.symbol;
    out[a.sym] = {
      address: top.address,
      name: top.name,
      quote: quoteSym || "?",
      tvl: top.tvl,
      apr: top.apr,
      apy: top.apy,
      fees24h: top.fees?.["24h"] ?? null,
      vol24h: top.volume?.["24h"] ?? null,
      binStep: top.pool_config?.bin_step ?? null,
      dynamicFeePct: top.dynamic_fee_pct ?? null,
      poolsFound: pools.length,
      totalTvl: pools.reduce((s, p) => s + (p.tvl || 0), 0),
    };
  });
  return out;
}
