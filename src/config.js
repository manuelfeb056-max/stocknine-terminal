// STOCKNINE asset universe. Prices: underlying via Yahoo (mirrored by GH Action),
// xStocks via Jupiter Lite on-chain. Pyth feed IDs shown for oracle alignment.
export const ASSETS = [
  { sym: "AAPL", name: "Apple Inc.", yahoo: "AAPL", xsym: "AAPLX",
    mint: "XsbEhLAtcf6HdfpFZ5xEMdqW8nfAvcsP5bdudRLJzJp",
    pythU: { symbol: "Equity.US.AAPL/USD", id: "49f6b65cb1de6b10eaf75e7c03ca029c306d0357e91b5311b175084a5ad55688" },
    pythX: { symbol: "Crypto.AAPLX/USD", id: "978e6cc68a119ce066aa830017318563a9ed04ec3a0a6439010fc11296a58675" } },
  { sym: "TSLA", name: "Tesla Inc.", yahoo: "TSLA", xsym: "TSLAX",
    mint: "XsDoVfqeBukxuZHWhdvWHBhgEHjGNst4MLodqsJHzoB",
    pythU: { symbol: "Equity.US.TSLA/USD", id: "16dad506d7db8da01c87581c87ca897a012a153557d4d578c3b9c9e1bc0632f1" },
    pythX: { symbol: "Crypto.TSLAX/USD", id: "47a156470288850a440df3a6ce85a55917b813a19bb5b31128a33a986566a362" } },
  { sym: "NVDA", name: "NVIDIA Corp.", yahoo: "NVDA", xsym: "NVDAX",
    mint: "Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh",
    pythU: { symbol: "Equity.US.NVDA/USD", id: "b1073854ed24cbc755dc527418f52b7d271f6cc967bbf8d8129112b18860a593" },
    pythX: { symbol: "Crypto.NVDAX/USD", id: "4244d07890e4610f46bbde67de8f43a4bf8b569eebe904f136b469f148503b7f" } },
  { sym: "MSFT", name: "Microsoft Corp.", yahoo: "MSFT", xsym: "MSFTX",
    mint: "XspzcW1PRtgf6Wj92HCiZdjzKCyFekVD8P5Ueh3dRMX",
    pythU: { symbol: "Equity.US.MSFT/USD", id: "d0ca23c1cc005e004ccf1db5bf76aeb6a49218f43dac3d4b275e92de12ded4d1" },
    pythX: { symbol: "Crypto.MSFTX/USD", id: "bb723a70af731ab56b9a650eb7e8ac22b7bc07ea77f8670bd1fa9a37bf6df3f5" } },
  { sym: "AMZN", name: "Amazon.com Inc.", yahoo: "AMZN", xsym: "AMZNX",
    mint: "Xs3eBt7uRfJX8QUs4suhyU8p2M6DoUDrJyWBa8LLZsg",
    pythU: { symbol: "Equity.US.AMZN/USD", id: "b5d0e0fa58a1f8b81498ae670ce93c872d14434b72c364885d4fa1b257cbb07a" },
    pythX: { symbol: "Crypto.AMZNX/USD", id: "7148fbe6e493ff2580305c92a8d7f8628c9943b11b9b253aebc24863fec290e8" } },
  { sym: "META", name: "Meta Platforms", yahoo: "META", xsym: "METAX",
    mint: "Xsa62P5mvPszXL1krVUnU5ar38bBSVcWAB6fmPCo5Zu",
    pythU: { symbol: "Equity.US.META/USD", id: "78a3e3b8e676a8f73c439f5d749737034b139bbbe899ba5775216fba596607fe" },
    pythX: { symbol: "Crypto.METAX/USD", id: "bf3e5871be3f80ab7a4d1f1fd039145179fb58569e159aee1ccd472868ea5900" } },
  { sym: "GOOGL", name: "Alphabet Inc.", yahoo: "GOOGL", xsym: "GOOGLX",
    mint: "XsCPL9dNWBMvFtTmwcCA5v3xWPSMEBCszbQdiLLq6aN",
    pythU: { symbol: "Equity.US.GOOGL/USD", id: "5a48c03e9b9cb337801073ed9d166817473697efff0d138874e0f6a33d6d5aa6" },
    pythX: { symbol: "Crypto.GOOGLX/USD", id: "b911b0329028cd0283e4259c33809d62942bd2716a58084e5f31d64c00b5424e" } },
  { sym: "SPY", name: "S&P 500 ETF", yahoo: "SPY", xsym: "SPYX",
    mint: "XsoCS1TfEyfFhfvj8EtZ528L3CaKBDBRqRapnBbDF2W",
    pythU: { symbol: "Equity.US.SPY/USD", id: "19e09bb805456ada3979a7d1cbb4b6d63babc3a0f8e8a9509f68afa5c4c11cd5" },
    pythX: { symbol: "Crypto.SPYX/USD", id: "2817b78438c769357182c04346fddaad1178c82f4048828fe0997c3c64624e14" } },
];

export const JUP_PRICE_API = "https://lite-api.jup.ag/price/v3";
export const DATA_URL = "./data/quotes.json";
export const STARTING_CASH = 100000;
export const LS_KEY = "stocknine_portfolio_v1";
