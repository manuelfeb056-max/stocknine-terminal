// STOCKNINE asset universe. Prices: underlying via Yahoo (mirrored by GH Action),
// xStocks via Jupiter Lite on-chain. Pyth: real on-chain price-feed accounts
// (PDAs: seeds [shard_id u16 LE, feed_id] under the Pyth push oracle program,
// verified on mainnet: owner rec5EKMGg6MxZYaMdyBfgwp4d5rB9T1VQH5pJv5LtFJ).
export const ASSETS = [
  { sym: "AAPL", name: "Apple Inc.", yahoo: "AAPL", xsym: "AAPLX",
    mint: "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp",
    pythU: { symbol: "Equity.US.AAPL/USD", id: "49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688", acct: "DJ2FyTgUAkEtXW3U5P9PF19meFTRtW4ZWKKFgACfVbUy" },
    pythX: { symbol: "Crypto.AAPLX/USD", id: "978e6cc68a119ce066aa830017318563a9ed04ec3a0a6439010fc11296a58675", acct: "Gs4DVtiGSJ9LJvXaQFjYp6vhLNK2QsH4qWox2ck1kuMp" } },
  { sym: "TSLA", name: "Tesla Inc.", yahoo: "TSLA", xsym: "TSLAX",
    mint: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
    pythU: { symbol: "Equity.US.TSLA/USD", id: "16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1", acct: "E8WFH8brgP58arcuW2wwsPHiomYrSvrgWTsRLZLAEZUQ" },
    pythX: { symbol: "Crypto.TSLAX/USD", id: "47a156470288850a440df3a6ce85a55917b813a19bb5b31128a33a986566a362", acct: "GpoWLTd6GoisYxYgHz7mTcZvgnfJu4SN7T6PxWjgUTFY" } },
  { sym: "NVDA", name: "NVIDIA Corp.", yahoo: "NVDA", xsym: "NVDAX",
    mint: "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
    pythU: { symbol: "Equity.US.NVDA/USD", id: "b1073854ed24cbc755dc527418f52b7d271f6cc967bbf8d8129112b18860a593", acct: "2w1Tg1XTZbUib7srfRoStJ4v5JXVsK7roQEGMsMaGZFC" },
    pythX: { symbol: "Crypto.NVDAX/USD", id: "4244d07890e4610f46bbde67de8f43a4bf8b569eebe904f136b469f148503b7f", acct: "6TPsjFigUaMFanRCsxQ4WbmG215xhRBXsb5y5Cn5L6eE" } },
  { sym: "MSFT", name: "Microsoft Corp.", yahoo: "MSFT", xsym: "MSFTX",
    mint: "XspzcW1PRtgf6Wj92HCiZdjzKCyFekVD8P5Ueh3dRMX",
    pythU: { symbol: "Equity.US.MSFT/USD", id: "d0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1", acct: "7VYuuJxz8w2rLA9tJG2KZ9T1fSMcjC7uECoYA6nDaqtK" },
    pythX: { symbol: "Crypto.MSFTX/USD", id: "bb723a70af731ab56b9a650eb7e8ac22b7bc07ea77f8670bd1fa9a37bf6df3f5", acct: "9KiECPa4BdbLHM61iur7u7svmRKA2MUJ76RLGfsVihvC" } },
  { sym: "AMZN", name: "Amazon.com Inc.", yahoo: "AMZN", xsym: "AMZNX",
    mint: "Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg",
    pythU: { symbol: "Equity.US.AMZN/USD", id: "b5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a", acct: "GBkjjFxbaFY9TBHpAPypk5JBchpPPve2jskAcd9zuFNd" },
    pythX: { symbol: "Crypto.AMZNX/USD", id: "7148fbe6e493ff2580305c92a8d7f8628c9943b11b9b253aebc24863fec290e8", acct: "HVWLZ3JEY6nV1zKtAmdsNsUm99SrYs4b5MGVCJkeAZ66" } },
  { sym: "META", name: "Meta Platforms", yahoo: "META", xsym: "METAX",
    mint: "Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu",
    pythU: { symbol: "Equity.US.META/USD", id: "78a3e3b8e676a8f73c439f5d749737034b139bbbe899ba5775216fba596607fe", acct: "GsKrMNoa1Mqjpif4SYk2WjdduWZP699hXRdP51yBM6K2" },
    pythX: { symbol: "Crypto.METAX/USD", id: "bf3e5871be3f80ab7a4d1f1fd039145179fb58569e159aee1ccd472868ea5900", acct: "HmqkFx31Jk1STgqVfxYAz6pKtwgn9mXZdNZfWnu6sqWS" } },
  { sym: "GOOGL", name: "Alphabet Inc.", yahoo: "GOOGL", xsym: "GOOGLX",
    mint: "XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN",
    pythU: { symbol: "Equity.US.GOOGL/USD", id: "5a48c03e9b9cb337801073ed9d166817473697efff0d138874e0f6a33d6d5aa6", acct: "HShKFQqhYkUiXpVyyLmrAALXwWqHB7ikLmPbrwJzpRNh" },
    pythX: { symbol: "Crypto.GOOGLX/USD", id: "b911b0329028cd0283e4259c33809d62942bd2716a58084e5f31d64c00b5424e", acct: "HeLrriTGigH3g9qgzZTpkWWkYe1yXKgE6nA7YdBjsvva" } },
  { sym: "SPY", name: "S&P 500 ETF", yahoo: "SPY", xsym: "SPYX",
    mint: "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W",
    pythU: { symbol: "Equity.US.SPY/USD", id: "19e09bb805456ada3979a7d1cbb4b6d63babc3a0f8e8a9509f68afa5c4c11cd5", acct: "9owhtgrdLiUMAH9JKxYFt5pUY4Luy4EzzLhdcWPVuDyy" },
    pythX: { symbol: "Crypto.SPYX/USD", id: "2817b78438c769357182c04346fddaad1178c82f4048828fe0997c3c64624e14", acct: "jf8MarLKgBte4f3NWufbNpGRCuBfJLhuZPuFigvSQR2" } },
];

// Pre-IPO / PreStocks watchlist (research; prices via Jupiter when available)
export const PREIPO = [
  { sym: "ANTHROPIC", name: "Anthropic", note: "Claude maker · IPO roadshow expected · token ~$1,006 (Sep 2026)", vol: "largest PreStocks listing" },
  { sym: "OPENAI", name: "OpenAI", note: "29.5% of PreStocks weekly volume · ATH week Sep 2026", vol: "$95M weekly record" },
  { sym: "SPACEX", name: "SpaceX", note: "28.1% of PreStocks weekly volume · confidential IPO filing reported", vol: "preSPAX live on Solana" },
  { sym: "ANDURIL", name: "Anduril", note: "20.9% of PreStocks weekly volume · defense tech", vol: "top-3 listing" },
  { sym: "KALSHI", name: "Kalshi", note: "Prediction markets · listed by PreStocks", vol: "watchlist" },
  { sym: "POLYMARKET", name: "Polymarket", note: "Prediction markets · listed by PreStocks", vol: "watchlist" },
];

export const JUP_PRICE_API = "https://lite-api.jup.ag/price/v3";
export const SOLANA_RPC = "https://api.mainnet-beta.solana.com";
export const METEORA_API = "https://dlmm.datapi.meteora.ag";
export const DATA_URL = "./data/quotes.json";
export const STARTING_CASH = 100000;
export const LS_KEY = "stocknine_portfolio_v1";
