import config from "@/lib/config";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface optionChainState {
  nooiData: boolean;
  expandTable: boolean;
  showTable: boolean;
  spotPrice: number | null;
  dataKey: string[];
  decreaser: number | null;
  oiPercent: {};
  expiryValue: string;
  oiValue: {};
  payoffTableOiChg: {};
  consolidatedData: {};
  calcData: [];
  lastApiCallTime: number;
  minimize: boolean;
  cachedApiData: [];
  tempInputValues: {};
  reset: boolean;
  currentExpiryOptionChainDataForHeatMap: [];
  queryIdentifier: string;
  query: string;
  tempValue: string;
  defaultDD: any[];
  selectedIndexName: string;
  indexData: any[];
  multiplier: number;
}

const initialState: optionChainState = {
  nooiData: true,
  expandTable: false,
  showTable: true,
  spotPrice: null,
  dataKey: [],
  decreaser: null,
  oiPercent: {},
  expiryValue: "",
  oiValue: {},
  payoffTableOiChg: {},
  consolidatedData: {},
  calcData: [],
  lastApiCallTime: 0,
  minimize: false,
  cachedApiData: [],
  tempInputValues: {},
  reset: false,
  currentExpiryOptionChainDataForHeatMap: [],
  queryIdentifier: "",
  query: "",
  tempValue: config.initializeIndex.defaultQuery,
  defaultDD: [],
  selectedIndexName: "",
  indexData: [],
  multiplier: 1,
};

const OptionChainSlice = createSlice({
  name: "optionChain",
  initialState,

  reducers: {
    NooiDataAvailablity(state, action: PayloadAction<boolean>) {
      state.nooiData = action.payload;
    },
    expandleTableStatus(state, action: PayloadAction<boolean>) {
      state.expandTable = action.payload;
    },
    showTableStatus(state, action: PayloadAction<boolean>) {
      state.showTable = action.payload;
    },
    getSpotPriceRoundOff(state, action: PayloadAction<number | null>) {
      state.spotPrice = action.payload;
    },
    getDataKey(state, action: PayloadAction<string[]>) {
      state.dataKey = action.payload;
    },
    getDecreaser(state, action: PayloadAction<number | null>) {
      state.decreaser = action.payload;
    },
    getOiPercent(state, action: PayloadAction<{}>) {
      state.oiPercent = action.payload;
    },
    getExpiryValue(state, action: PayloadAction<string>) {
      state.expiryValue = action.payload;
    },
    getOiValue(state, action: PayloadAction<{}>) {
      state.oiValue = action.payload;
    },
    getPayoffTableOiChg(state, action: PayloadAction<{}>) {
      state.payoffTableOiChg = action.payload;
    },
    getConsolidatedData(state, action: PayloadAction<{}>) {
      state.consolidatedData = action.payload;
    },
    getCalcData(state, action: PayloadAction<[]>) {
      state.calcData = action.payload;
    },
    getLastApiCallTime(state, action: PayloadAction<number>) {
      state.lastApiCallTime = action.payload;
    },
    minimizeStatus(state, action: PayloadAction<boolean>) {
      state.minimize = action.payload;
    },
    getCachedApiData(state, action: PayloadAction<[]>) {
      state.cachedApiData = action.payload;
    },
    getTempInputValues(state, action: PayloadAction<{}>) {
      state.tempInputValues = action.payload;
    },
    getReset(state, action: PayloadAction<boolean>) {
      state.reset = action.payload;
    },
    getcurrentExpiryOptionChainDataForHeatMap(
      state,
      action: PayloadAction<[]>
    ) {
      state.currentExpiryOptionChainDataForHeatMap = action.payload;
    },
    getQueryIdentifier(state, action: PayloadAction<string>) {
      state.queryIdentifier = action.payload;
    },
    getQuery(state, action: PayloadAction<string>) {
      state.query = action.payload;
    },
    setDefaultDD(state, action: PayloadAction<any[]>) {
      state.defaultDD = action.payload;
    },
    setSelectedIndexName(state, action: PayloadAction<string>) {
      state.selectedIndexName = action.payload;
    },
    setIndexData(state, action: PayloadAction<any[]>) {
      state.indexData = action.payload;
    },
    getMultiplier(state, action: PayloadAction<number>) {
      state.multiplier = action.payload;
    },
  },
});

export const {
  NooiDataAvailablity,
  expandleTableStatus,
  showTableStatus,
  getSpotPriceRoundOff,
  getDataKey,
  getDecreaser,
  getOiPercent,
  getExpiryValue,
  getOiValue,
  getPayoffTableOiChg,
  getConsolidatedData,
  getCalcData,
  getLastApiCallTime,
  minimizeStatus,
  getCachedApiData,
  getTempInputValues,
  getReset,
  getcurrentExpiryOptionChainDataForHeatMap,
  getQueryIdentifier,
  getQuery,
  setDefaultDD,
  setSelectedIndexName,
  setIndexData,
  getMultiplier,
} = OptionChainSlice.actions;

export default OptionChainSlice.reducer;
