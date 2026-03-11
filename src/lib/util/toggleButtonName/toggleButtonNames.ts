export const sideTabButtonName = {
  TECHNICALS: "Technicals",
  NEWS: "News",
  NOTES: "Notes",
  Pivots: "Pivots",
};

const sideTabButtons = [
  { label: "News", value: sideTabButtonName.NEWS },
  { label: "Tech", value: sideTabButtonName.TECHNICALS },
  { label: "Pivots", value: sideTabButtonName.Pivots },
  { label: "Notes", value: sideTabButtonName.NOTES },
];

const OiOptions = [
  { value: "oi", label: "Oi" },
  { value: "oichange", label: "Oi Change" },
  { value: "Both", label: "Both" },
];

const multiStarddleOPtions = [
  { value: "straddle", label: "Straddle" },
  { value: "strangle", label: "Strangle" },
  { value: "custom", label: "Custom" },
];

const strategyTabs = [
  {
    label: "New Strategy",
    width: "w-[8.5rem]",
    activeConditionKey: "strategyTable", // Use a key to reference state
    onClick: "showOption", // Use a key to reference the function
  },
  {
    label: "Target P&L",
    width: "w-[6rem]",
    activeConditionKey: "pnlTable",
    onClick: "showPnl",
  },
  {
    label: "Positions",
    widthCondition: (positionsdata: any, keywords?: any, query?: any) =>
      positionsdata && positionsdata.length && keywords?.includes(query) > 0
        ? "w-[10rem]"
        : "w-[6rem]",
    activeConditionKey: "positionTable",
    onClick: "showPosition",
  },
  {
    label: "Sandbox",
    width: "w-[6rem]",
    activeConditionKey: "DraftPositions",
    onClick: "handleDraftPositions",
  },
];

const OiTab = [
  {
    label: "Multi Strike",
    activeConditionKey: "showMultiOi",
    border: "border-r-2 rounded-l-lg",
    width: "w-[6rem]",
    onClick: "multiOi",
  },
  {
    label: "Multi Straddle",
    activeConditionKey: "showMultiStraddle",
    border: "border-r-2",
    width: "w-[7rem]",
    onClick: "multiStraddle",
  },
  {
    label: "OI Change",
    activeConditionKey: "showOiChange",
    border: "border-r-2",
    width: "w-[5.5rem]",
    onClick: "oiChange",
  },
  {
    label: "Combined OI",
    activeConditionKey: "showCombinedOi",
    border: "border-r-2",
    width: "w-[6.5rem]",
    onClick: "combinedOi",
  },
  // {
  //   label: "FII/DII",
  //   activeConditionKey: "showFiiDiiData",
  //   border: "border-r-2",
  //   width: "w-[6.5rem]",
  //   onClick: "FiiDiiData",
  // },
  {
    label: "Matrix View",
    activeConditionKey: "showOiMatrix",
    border: "rounded-r-lg",
    width: "w-[6.5rem]",
    onClick: "oiMatrix",
  },
];

const FiiDiiOptions = [
  { value: "summary", label: "Summary" },

  { value: "futureOptions", label: "F&O" },
  { value: "cashMarket", label: "Cash Market" },
  { value: "fiiDiiHistory", label: "History" },
];

const ViewType = {
  CANDLESTICK: "CandleStick",
  SCREENER: "screener",
  STOCK_INFO: "stockInfo",
};

const FnoOptions = [
  { value: "fii", label: "FII" },
  { value: "dii", label: "DII" },
  { value: "pro", label: "Pro" },
  { value: "client", label: "Client" },
];

const matrixOptions = [
  { value: "CE", label: "CE" },
  { value: "PE", label: "PE" },
  { value: "", label: "Both" },
];

const tvWidgetId = {
  MAINCHART: "main-tv",
  POPUPCHART: "popup-tv",
};
const ltpOi = [
  { value: "oi", label: "OI" },
  { value: "ltp", label: "LTP" },
];

const chartTable = [
  { value: "table", label: "Table" },
  { value: "chart", label: "Chart" },
];

const pePb = [
  { value: "pb", label: "PB" },
  { value: "pe", label: "PE" },
];

const portfolioOptions = [
  { value: "holdings", label: "Holdings" },
  { value: "positions", label: "Positions" },
];

export {
  sideTabButtons,
  OiOptions,
  multiStarddleOPtions,
  strategyTabs,
  OiTab,
  ViewType,
  FiiDiiOptions,
  FnoOptions,
  matrixOptions,
  tvWidgetId,
  ltpOi,
  chartTable,
  pePb,
  portfolioOptions,
};
