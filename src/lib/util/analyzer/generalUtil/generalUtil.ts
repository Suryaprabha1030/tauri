const filter1 = [
  { title: "Indices", type: "indices" },
  { title: "Stocks", type: "equities" },
];

const filter2 = [
  { title: "Options", type: "options" },
  { title: "Futures", type: "futures" },
];

const exchangeFilter = [
  { title: "NSE", type: "NSE" },
  { title: "BSE", type: "BSE" },
];

const searchTypeMap: Record<string, Record<string, string>> = {
  Stocks: {
    none: "equities",
    Options: "stock_options",
    Futures: "stock_futures",
  },
  Indices: {
    none: "indices",
    Options: "index_options",
    Futures: "index_futures",
  },
};

export { filter1, filter2, exchangeFilter, searchTypeMap };
