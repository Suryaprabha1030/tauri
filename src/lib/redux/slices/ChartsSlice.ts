import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface ChartState {
  setShowHeatmap: boolean;
  setAddSymbols: boolean;
  setShowStrategies: boolean;
  setShowStrategiesPopup: boolean;
  setTvResolution: any;
  setDefaultWatchlist: any;
  SymbolIdentifier: any;
  websocketOpen: boolean;
  ChartIconClicked: boolean;
  IndexFirstFutData: any;
  FutIndexName: any;
  TvAddSymbolPopup: boolean;
  getAllIndicesData: any;
  chartPanel: boolean
}
const initialState: ChartState = {
  setShowHeatmap: false,
  setAddSymbols: false,
  setShowStrategies: false,
  setShowStrategiesPopup: false,
  setTvResolution: "60",
  setDefaultWatchlist: {},
  SymbolIdentifier: null,
  websocketOpen: false,
  ChartIconClicked: false,
  IndexFirstFutData: null,
  FutIndexName: null,
  TvAddSymbolPopup: false,
  getAllIndicesData: {},
  chartPanel: false
};

const ChartSlice = createSlice({
  name: "charts",
  initialState,

  reducers: {
    showHeatmap(state, action: PayloadAction<boolean>) {
      state.setShowHeatmap = action.payload;
    },
    symbolAddedToWatchlist(state, action: PayloadAction<boolean>) {
      state.setAddSymbols = action.payload;
    },
    ShowStrategies(state, action: PayloadAction<boolean>) {
      state.setShowStrategies = action.payload;
    },
    ShowStrategiesPopup(state, action: PayloadAction<boolean>) {
      state.setShowStrategiesPopup = action.payload;
    },
    setShowTvResolution(state, action: PayloadAction<any>) {
      state.setTvResolution = action.payload;
    },
    setDefaultWatchlistData(state, action: PayloadAction<any>) {
      state.setDefaultWatchlist = action.payload;
    },
    setSymbolIdentifier(state, action: PayloadAction<any>) {
      state.SymbolIdentifier = action.payload;
    },
    setWebsocketOpen(state, action: PayloadAction<boolean>) {
      state.websocketOpen = action.payload;
    },
    setChartIconClicked(state, action: PayloadAction<boolean>) {
      state.ChartIconClicked = action.payload;
    },
    setIndexFirstFutData(
      state,
      action: PayloadAction<{
        IndexFirstFutData: any;
        FutIndexName: string;
      }>
    ) {
      state.IndexFirstFutData = action.payload.IndexFirstFutData;
      state.FutIndexName = action.payload.FutIndexName;
    },
    setTvAddSymbPopup(state, action: PayloadAction<boolean>) {
      state.TvAddSymbolPopup = action.payload;
    },
    getAllIndicesDataFetched(state, action: PayloadAction<{}>) {
      state.getAllIndicesData = action.payload;
    },
    setChartPanel(state, action: PayloadAction<boolean>) {
      state.chartPanel = action.payload
    },
  },
});

export const {
  showHeatmap,
  symbolAddedToWatchlist,
  ShowStrategies,
  ShowStrategiesPopup,
  setShowTvResolution,
  setDefaultWatchlistData,
  setSymbolIdentifier,
  setWebsocketOpen,
  setChartIconClicked,
  setIndexFirstFutData,
  setTvAddSymbPopup,
  getAllIndicesDataFetched,
  setChartPanel
} = ChartSlice.actions;

export default ChartSlice.reducer;
