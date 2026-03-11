import { ViewType } from "@/lib/util/toggleButtonName/toggleButtonNames";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface CommonState {
  googleSignInUserData: {};
  showPwaicon: boolean;
  showTVpopup: boolean;
  CandleAreaToggle: any;
  allIndicesOptionsList: [];
  isSidetabCollapsed: boolean;
  initiateOrderToast: {};

  allPositionUnChecked: boolean;

  showSwitchbroker: boolean;
  currentHoldingsValue: number;
  openOiSettings: any[];
  tvOIexpiry: string;
  cePeBarColors: { ce: string; pe: string };
  currentSection: string | null;
  SelectedAiStock: {};
  ScreenerOpen: boolean;
  StockInfoOpen: boolean;
  SymbolNewsData: { [key: string]: {} };
  OpenSymbolNewsPopup: boolean;
  PopupNewsData: any;
  newsSymbol: string;
  toasterIdentifiers: string[];
  userInfo: any;
  selectedChart: string[]
}
const initialState: CommonState = {
  googleSignInUserData: {},
  showPwaicon: false,
  showTVpopup: false,
  CandleAreaToggle: ViewType.CANDLESTICK,
  allIndicesOptionsList: [],
  isSidetabCollapsed: false,
  initiateOrderToast: {},
  allPositionUnChecked: false,
  showSwitchbroker: false,
  currentHoldingsValue: 0,
  openOiSettings: [],
  tvOIexpiry: "",
  cePeBarColors: {
    ce: "rgba(124,216,129,0.6)",
    pe: "rgba(231,111,112,0.6)",
  },
  currentSection: null,
  SelectedAiStock: {},
  ScreenerOpen: false,
  StockInfoOpen: false,
  SymbolNewsData: {},
  OpenSymbolNewsPopup: false,
  PopupNewsData: {},
  newsSymbol: "",
  toasterIdentifiers: [],
  userInfo: null,
  selectedChart: ["ROE", "Net Income", "Sales"]
};

const CommonSlice = createSlice({
  name: "common",
  initialState,

  reducers: {
    getGoogleSignInUser: (
      state,
      action: PayloadAction<{ googleSignInUser: {} }>
    ) => {
      const { googleSignInUser } = action.payload;
      state.googleSignInUserData = googleSignInUser;
    },
    setShowPWAicon(state, action: PayloadAction<boolean>) {
      state.showPwaicon = action.payload;
    },
    setShowTVpopup(state, action: PayloadAction<boolean>) {
      state.showTVpopup = action.payload;
    },
    setToggleChart(state, action: PayloadAction<any>) {
      state.CandleAreaToggle = action.payload;
    },
    inidicesOptionsData: (
      state,
      action: PayloadAction<{ allIndicesOptions: [] }>
    ) => {
      const { allIndicesOptions } = action.payload;
      state.allIndicesOptionsList = allIndicesOptions;
    },
    setIsSidetabCollapsed(state, action: PayloadAction<boolean>) {
      state.isSidetabCollapsed = action.payload;
    },
    setInitiateOrderToast(state, action: PayloadAction<{}>) {
      state.initiateOrderToast = action.payload;
    },

    setCheckedPositionNull(state, action: PayloadAction<boolean>) {
      state.allPositionUnChecked = action.payload;
    },

    setShowSwitchbroker(state, action: PayloadAction<boolean>) {
      state.showSwitchbroker = action.payload;
    },
    setCurrentHoldingsvalue(state, action: PayloadAction<number>) {
      state.currentHoldingsValue = action.payload;
    },
    setOpenOiSettings(state, action: PayloadAction<any[]>) {
      state.openOiSettings = action.payload;
    },
    setTvOiExpiry(state, action: PayloadAction<string>) {
      state.tvOIexpiry = action.payload;
    },
    setCePeBarColors: (
      state,
      action: PayloadAction<{ ce: string; pe: string }>
    ) => {
      state.cePeBarColors.ce = action.payload.ce;
      state.cePeBarColors.pe = action.payload.pe;
    },
    setCurrentSection(state, action: PayloadAction<string | null>) {
      state.currentSection = action.payload;
    },
    setSelectedAiStock(state, action: PayloadAction<{}>) {
      state.SelectedAiStock = action.payload;
    },
    setScreenerOpen(state, action: PayloadAction<boolean>) {
      state.ScreenerOpen = action.payload;
    },
    setStockInfoOpen(state, action: PayloadAction<boolean>) {
      state.StockInfoOpen = action.payload;
    },
    setSymbolNewsData(
      state,
      action: PayloadAction<{
        symbol: string;
        newsData: {};
      }>
    ) {
      const { symbol, newsData } = action.payload;
      state.SymbolNewsData[symbol] = newsData;
    },
    setOpenSymbolNewsPopup(
      state,
      action: PayloadAction<{ open: boolean; newsData?: any; newsSymbol?: any }>
    ) {
      state.OpenSymbolNewsPopup = action.payload.open;
      if (action.payload.newsData) {
        state.PopupNewsData = action.payload.newsData;
        state.newsSymbol = action.payload.newsSymbol;
      }
    },
    setToasterIdentifiers(state, action: PayloadAction<string>) {
      state.toasterIdentifiers.push(action.payload);
    },
    setUserInfo(state, action: PayloadAction<any>) {
      state.userInfo = action.payload;
    },
    setSelectedChart(state, action: PayloadAction<{index: number; value: string;}>) {
      state.selectedChart[action.payload.index] = action.payload.value
    }
  },
});

export const {
  getGoogleSignInUser,
  setShowPWAicon,
  setShowTVpopup,
  setToggleChart,
  inidicesOptionsData,
  setIsSidetabCollapsed,
  setInitiateOrderToast,
  setCheckedPositionNull,
  setShowSwitchbroker,
  setCurrentHoldingsvalue,
  setOpenOiSettings,
  setTvOiExpiry,
  setCePeBarColors,
  setCurrentSection,
  setSelectedAiStock,
  setScreenerOpen,
  setStockInfoOpen,
  setSymbolNewsData,
  setOpenSymbolNewsPopup,
  setToasterIdentifiers,
  setUserInfo,
  setSelectedChart
} = CommonSlice.actions;

export default CommonSlice.reducer;
