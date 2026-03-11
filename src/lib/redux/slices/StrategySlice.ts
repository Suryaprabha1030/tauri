import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../Store";

interface SelectedInfo {
  strategyId: string | null;
}

interface BrokerInfo {
  login_url: string;
  api_key: string;
  broker_name: string;
}

interface ClientInfo {
  [clientCode: string]: BrokerInfo;
}

export interface StrategyState {
  strategyName: (() => void) | null;
  selectedInfo: SelectedInfo;
  token: string;
  shouldRefresh: boolean;
  limitAddSymbol: boolean;
  primaryRefresh: boolean;
  spotPrice: any;
  symbolsPrice: { [key: string]: string };
  symbols: string[];
  items: {
    exchange: string;
    index_name: string;
    spot_price: string | null;
    expiryDate: string;
  };

  // payOffChartPayloadData: {};
  netChange: { [key: string]: string };
  netChangepercent: { [key: string]: string };
  // payOffChainPayload: {};
  holdingsData: any[];
  positions: any[];
  // symboltoken: { [key: string]: string };
  holdingstoggle: boolean;
  positionstoggle: boolean;
  pinUnpinstate: boolean;
  settingsData: { [key: string]: any };
  fundsData: {};
  pinnedsymbols: string[];
  dashboardtoggle: boolean;
  stock: { exchange: string; index_name: string; spot_price: string };
  positionpnlpercent: any;
  ltpData: { [key: string]: {} };
  indexExpiryDate: { [key: string]: [] };
  spotPriceData: null;
  indexFutureData: [];
  addtionalData: { [key: string]: {} };
  indexSymbol: string;
  headerPriceData: {};
  positionPnl: any;
  indexName: string;
  expiryDate: string;
  indexQuery: string;
  indicesLotsize: [];
  NewsToggle: boolean;
  indexObj: {};
  lotSizeData: { [key: string]: null };
  rawIndexAPIresponse: {};
}

const initialState: StrategyState = {
  strategyName: null,
  selectedInfo: {
    strategyId: null,
  },
  token: "",
  shouldRefresh: false,
  primaryRefresh: false,
  limitAddSymbol: false,
  symbolsPrice: {},
  symbols: [],
  items: {
    exchange: "",
    index_name: "",
    spot_price: null,
    expiryDate: "",
  },

  spotPrice: "6645",
  netChange: {},
  netChangepercent: {},
  holdingsData: [],
  positions: [],
  // symboltoken: {},
  holdingstoggle: false,
  positionstoggle: false,
  pinUnpinstate: false,
  settingsData: {},
  fundsData: {},
  pinnedsymbols: [],
  dashboardtoggle: false,
  stock: {
    exchange: "",
    index_name: "",
    spot_price: "",
  },

  ltpData: {},
  indexExpiryDate: {},
  indexFutureData: [],
  addtionalData: {},
  indexSymbol: "",
  headerPriceData: [],
  positionPnl: "",
  positionpnlpercent: "",
  spotPriceData: null,
  indexName: "NIFTY",
  expiryDate: "",
  indexQuery: "",
  indicesLotsize: [],
  NewsToggle: false,
  indexObj: {},
  lotSizeData: {},
  rawIndexAPIresponse: {},
};

const StrategySlice = createSlice({
  name: "strategy",
  initialState,

  reducers: {
    updateStrategy(
      state,
      action: PayloadAction<{
        strategyName?: (() => void) | null;
        strategyId?: string;
      }>
    ) {
      const { strategyName, strategyId } = action.payload;
      if (strategyName !== undefined) {
        state.strategyName = strategyName;
      }
      if (strategyId !== undefined) {
        state.selectedInfo.strategyId = strategyId;
      }
    },

    setShouldRefresh(state, action: PayloadAction<boolean>) {
      state.shouldRefresh = action.payload;
    },

    setprimaryRefresh(state, action: PayloadAction<boolean>) {
      state.primaryRefresh = action.payload;
    },

    settoggleholdings(state, action: PayloadAction<boolean>) {
      state.holdingstoggle = action.payload;
    },
    settogglepositions(state, action: PayloadAction<boolean>) {
      state.positionstoggle = action.payload;
    },

    limitExceed(state, action: PayloadAction<boolean>) {
      state.limitAddSymbol = action.payload;
    },
    spotPriceData: (state: any, action: PayloadAction<{ spotPrice?: any }>) => {
      const { spotPrice } = action.payload;
      if (spotPrice !== undefined) {
        state.spotPrice = spotPrice;
      }
    },
    // for payoffchart payload from optionchain data(from getall data api)
    addCartSuccess(
      state: any,
      action: PayloadAction<{
        items?: {
          exchange: string;
          index_name: string;
          spot_price: any | null;
          expiryDate: string;
        } | null;
      }>
    ) {
      const { items } = action.payload;
      if (items !== undefined) {
        state.items = items;
      }
    },

    updateSymbolData: (
      state,
      action: PayloadAction<{
        symbol: string;
        price: string;
        change?: string;
        netpercentage?: string;
      }>
    ) => {
      const { symbol, price, change, netpercentage } = action.payload;
      state.symbolsPrice[symbol] = price;
      if (change !== undefined) {
        state.netChange[symbol] = change;
      }
      if (netpercentage !== undefined) {
        state.netChangepercent[symbol] = netpercentage;
      }
    },

    addSymbol: (state, action: PayloadAction<{ symbol: string }>) => {
      const { symbol } = action.payload;
      if (!state.symbols.includes(symbol)) {
        state.symbols.push(symbol);
      }
    },
    setHoldingsData(state, action: PayloadAction<{ holdingsData: any[] }>) {
      state.holdingsData = action.payload.holdingsData;
    },
    setPositions(
      state,
      action: PayloadAction<{
        positions: any[];
        positionPnl: any;
        positionpnlpercent: any;
      }>
    ) {
      state.positions = action.payload.positions;
      state.positionPnl = action.payload.positionPnl;
      state.positionpnlpercent = action.payload.positionpnlpercent;
    },
    setPinUnpin(state, action: PayloadAction<boolean>) {
      state.pinUnpinstate = action.payload;
    },
    setSettingsData(
      state,
      action: PayloadAction<{ settingsData: { [key: string]: any } }>
    ) {
      state.settingsData = action.payload.settingsData;
    },
    setFundsData(state, action: PayloadAction<{ fundsData: {} }>) {
      state.fundsData = action.payload.fundsData;
    },
    setPinnedSymbols(state, action: PayloadAction<string[]>) {
      state.pinnedsymbols = action.payload;
    },
    setDashboardtoggle(state, action: PayloadAction<boolean>) {
      state.dashboardtoggle = action.payload;
    },
    // set index name from chart to analyser(analyzer button from watchlist)
    setStock(
      state: any,
      action: PayloadAction<{
        stock?: {
          exchange: string;
          index_name: string;
          spot_price: string;
        } | null;
      }>
    ) {
      const { stock } = action.payload;
      if (stock !== undefined) {
        state.stock = stock;
      }
    },
    // get all data optionchain for analyzer page
    indicesAlldata: (
      state,
      action: PayloadAction<{
        symbol: string;
        tokenLtpData: {};
        expiryDate: [];
        futureData: [];
        addonData: {};
        spotPrice: any;
        indexData: {};
        lotSize: null;
      }>
    ) => {
      const {
        symbol,
        tokenLtpData,
        expiryDate,
        futureData,
        addonData,
        spotPrice,
        indexData,
        lotSize,
      } = action.payload;
      state.ltpData[symbol] = tokenLtpData;
      state.indexSymbol = symbol;
      state.indexExpiryDate[symbol] = expiryDate;
      state.indexFutureData = futureData;
      state.addtionalData[symbol] = addonData;
      state.spotPriceData = spotPrice;
      state.indexObj = indexData;
      state.lotSizeData[symbol] = lotSize;
    },

    setHeaderPrices: (state, action: PayloadAction<{ headerPrice: {} }>) => {
      const { headerPrice } = action.payload;
      state.headerPriceData = headerPrice;
    },

    getIndexName: (
      state,
      action: PayloadAction<{ indexName: string; expiryDate: string }>
    ) => {
      state.indexName = action.payload.indexName;
      state.expiryDate = action.payload.expiryDate;
    },
    getIndexQuery: (state, action: PayloadAction<{ indexQuery: string }>) => {
      state.indexQuery = action.payload.indexQuery;
    },
    getIndexLotSize: (state, action: PayloadAction<{ indicesLotsize: [] }>) => {
      state.indicesLotsize = action.payload.indicesLotsize;
    },
    setNewsToggle(state, action: PayloadAction<boolean>) {
      state.NewsToggle = action.payload;
    },
    setIndexRawApiResponse(state, action: PayloadAction<{}>) {
      state.rawIndexAPIresponse = action.payload;
    },
  },
});

export const {
  updateStrategy,
  setShouldRefresh,
  setprimaryRefresh,
  limitExceed,
  addCartSuccess,
  settoggleholdings,
  settogglepositions,
  setPinUnpin,
  setSettingsData,
  setFundsData,
  setPinnedSymbols,
  setDashboardtoggle,
  updateSymbolData,
  addSymbol,
  spotPriceData,
  setHoldingsData,
  setPositions,
  setStock,
  indicesAlldata,
  setHeaderPrices,
  getIndexName,
  getIndexQuery,
  getIndexLotSize,
  setNewsToggle,
  setIndexRawApiResponse,
} = StrategySlice.actions;

export default StrategySlice.reducer;
