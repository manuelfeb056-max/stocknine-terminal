// Real on-chain Pyth oracle reads (no API key needed).
// Pyth push-feed accounts are PDAs: seeds [shard_id u16 LE, feed_id] under the
// Pyth push oracle program, owned by the Pyth receiver program. The account
// addresses below were derived off-chain and VERIFIED on Solana mainnet:
// owner == rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ and the embedded
// feed_id matches the configured feed. The parser re-verifies the feed_id
// inside the account data on every read, so a wrong address can never
// produce a wrong price.
//
// Account layout (push oracle, 134 bytes):
//   0..8    anchor discriminator (PriceUpdateV2: 22f123639d7ef4cd)
//   8..40   write_authority
//   40      verification level (0x01 = Full)
//   41..73  feed_id (32 bytes)            <- verified per read
//   73..81  price (i64 LE)
//   81..89  conf  (u64 LE)
//   89..93  exponent (i32 LE)
//   93..101 publish_time (unix seconds)

import { ASSETS, SOLANA_RPC } from "./config.js";

function hexToBytes(hex) {
  const b = new Uint8Array(hex.length / 2);
  for (let i = 0; i < b.length; i++) b[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return b;
}

function b64ToBytes(s) {
  const bin = atob(s);
  const b = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
  return b;
}

function parsePriceUpdate(v, feed) {
  try {
    if (!v || !v.data || !v.data[0]) return null;
    const d = b64ToBytes(v.data[0]);
    if (d.length < 101) return null;
    const id = hexToBytes(feed.id);
    for (let k = 0; k < 32; k++) if (d[41 + k] !== id[k]) return null; // feed mismatch -> reject
    const dv = new DataView(d.buffer, d.byteOffset, d.byteLength);
    const price = Number(dv.getBigInt64(73, true));
    const conf = Number(dv.getBigUint64(81, true));
    const expo = dv.getInt32(89, true);
    const publishTime = Number(dv.getBigInt64(93, true));
    if (!isFinite(price) || !isFinite(expo) || expo < -18 || expo > 18) return null;
    const scale = Math.pow(10, expo);
    return {
      price: price * scale,
      conf: conf * scale,
      publishTime,
      ageSec: Math.max(0, Date.now() / 1000 - publishTime),
      symbol: feed.symbol,
      acct: feed.acct,
    };
  } catch {
    return null;
  }
}

// Returns { SYM: { u: <underlying feed quote|null>, x: <xStock feed quote|null> } }
export async function fetchPyth() {
  const addrs = [];
  const keys = [];
  for (const a of ASSETS) {
    addrs.push(a.pythU.acct, a.pythX.acct);
    keys.push(a.sym + "|u", a.sym + "|x");
  }
  const r = await fetch(SOLANA_RPC, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "getMultipleAccounts",
      params: [addrs, { encoding: "base64" }],
    }),
  });
  if (!r.ok) throw new Error("rpc " + r.status);
  const j = await r.json();
  const vals = j?.result?.value || [];
  const out = {};
  vals.forEach((v, i) => {
    const [sym, side] = keys[i].split("|");
    const a = ASSETS.find((x) => x.sym === sym);
    const feed = side === "u" ? a.pythU : a.pythX;
    (out[sym] ||= {})[side] = parsePriceUpdate(v, feed);
  });
  return out;
}

export function fmtAge(ageSec) {
  if (ageSec == null) return "—";
  if (ageSec < 90) return Math.round(ageSec) + "s ago";
  if (ageSec < 5400) return Math.round(ageSec / 60) + "m ago";
  if (ageSec < 172800) return (ageSec / 3600).toFixed(1) + "h ago";
  return (ageSec / 86400).toFixed(1) + "d ago";
}
