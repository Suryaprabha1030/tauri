import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AnalyzerState {
  optionDataList: {};
  futureDataList: {};
  PositionDataList: {};
  selectPositionDataList: {};
  setShowStrategyTable: boolean;
  setShowPositionTable: boolean;
  checkPositionData: boolean;
  optionChainPayLoadData: { ClickedRow: {}; response: {} };
  targetltpDataList: {};
  setShowPnlTable: boolean;
  symbolPrice: any;
  symbolPriceChgPercent: any;
  toggleState: any;
  setShowDraftPositions: boolean;
  setShowDraftNamePopUp: boolean;
  setListAllSandbox: boolean;
  setSelectedSandboxName: string;
  setSelectedSandboxId: number | null;
  setselectedStrategy: any | null;
  ltpIdentifierData: { [key: string]: number };
  setUpdateData: boolean;
  ShowPayOffChart: boolean;
  setSandboxData: {};
  OptTargetLtpData: {};
  FutTargetLtpData: {};
  ChartDataList: {};
  SandboxExited: string;
  ExpandSelectedSandbox: boolean;
}

const initialState: AnalyzerState = {
  optionDataList: {},
  futureDataList: {},
  PositionDataList: {},
  selectPositionDataList: {},
  setShowStrategyTable: false,
  setShowPositionTable: false,
  checkPositionData: false,
  optionChainPayLoadData: { ClickedRow: {}, response: {} },
  targetltpDataList: {},
  setShowPnlTable: false,
  symbolPrice: "",
  symbolPriceChgPercent: "",
  toggleState: "LTP",
  setShowDraftPositions: false,
  setShowDraftNamePopUp: false,
  setListAllSandbox: false,
  setSelectedSandboxName: "",
  setSelectedSandboxId: null,
  setselectedStrategy: null,
  ltpIdentifierData: {},
  setUpdateData: false,
  ShowPayOffChart: false,
  setSandboxData: {},
  OptTargetLtpData: {},
  FutTargetLtpData: {},
  ChartDataList: {},
  SandboxExited: "",
  ExpandSelectedSandbox: false,
};
const AnalyzerSlice = createSlice({
  name: "analyzer",
  initialState,

  reducers: {
    getOptionData: (state, action: PayloadAction<{ optionData: {} }>) => {
      const { optionData } = action.payload;
      state.optionDataList = optionData;
    },
    getFutureData: (state, action: PayloadAction<{ futureData: {} }>) => {
      const { futureData } = action.payload;
      state.futureDataList = futureData;
    },
    getCheckedPositionData: (
      state,
      action: PayloadAction<{ PositionData: {} }>
    ) => {
      const { PositionData } = action.payload;
      state.PositionDataList = PositionData;
    },
    getSelectPositionData: (
      state,
      action: PayloadAction<{ selectPositionData: {} }>
    ) => {
      const { selectPositionData } = action.payload;
      state.selectPositionDataList = selectPositionData;
    },

    showStrategyTable(state, action: PayloadAction<boolean>) {
      state.setShowStrategyTable = action.payload;
    },
    showPositionTable(state, action: PayloadAction<boolean>) {
      state.setShowPositionTable = action.payload;
    },
    checkPosition(state, action: PayloadAction<boolean>) {
      state.checkPositionData = action.payload;
    },
    optionChainPayload: (
      state: any,
      action: PayloadAction<{
        optionChainPayloadData?: { ClickedRow: {}; response: {} };
      }>
    ) => {
      const { optionChainPayloadData } = action.payload;
      if (optionChainPayloadData !== undefined) {
        // state.optionChainPayloadData = optionChainPayloadData
        state.optionChainPayLoadData = optionChainPayloadData;
      }
    },
    getUpdatedTargetltpData: (
      state,
      action: PayloadAction<{ targetltpData: {} }>
    ) => {
      const { targetltpData } = action.payload;
      state.targetltpDataList = targetltpData;
    },
    showPnlTable(state, action: PayloadAction<boolean>) {
      state.setShowPnlTable = action.payload;
    },
    updateSymbolLtp: (
      state,
      action: PayloadAction<{ symbolPrice: any; symbolPriceChgPercent: any }>
    ) => {
      const { symbolPrice, symbolPriceChgPercent } = action.payload;
      state.symbolPrice = symbolPrice;
      state.symbolPriceChgPercent = symbolPriceChgPercent;
    },
    getToggleState: (state, action: PayloadAction<{ toggleState: string }>) => {
      state.toggleState = action.payload.toggleState;
    },
    showDraftPositions(state, action: PayloadAction<boolean>) {
      state.setShowDraftPositions = action.payload;
    },
    showDraftNamePopUp(state, action: PayloadAction<boolean>) {
      state.setShowDraftNamePopUp = action.payload;
    },
    showAllSandboxNames(state, action: PayloadAction<boolean>) {
      state.setListAllSandbox = action.payload;
    },
    setShowSelectedSandboxName: (
      state,
      action: PayloadAction<{
        setSelectedSandboxName: string;
        setSelectedSandboxId: number;
      }>
    ) => {
      state.setSelectedSandboxName = action.payload.setSelectedSandboxName;
      state.setSelectedSandboxId = action.payload.setSelectedSandboxId;
    },
    setSelectedStrategy: (
      state,
      action: PayloadAction<{ setselectedStrategy: {} | null }>
    ) => {
      state.setselectedStrategy = action.payload.setselectedStrategy;
    },

    setDataUpdated(state, action: PayloadAction<boolean>) {
      state.setUpdateData = action.payload;
    },
    setShowpayoffChart(state, action: PayloadAction<boolean>) {
      state.ShowPayOffChart = action.payload;
    },
    setSandboxDataObj(state, action: PayloadAction<{ setSandboxData: {} }>) {
      state.setSandboxData = action.payload.setSandboxData;
    },
    getOptTargetltpData: (
      state,
      action: PayloadAction<{ OptTargetLtpData: {} }>
    ) => {
      state.OptTargetLtpData = action.payload.OptTargetLtpData;
    },
    getFutTargetltpData: (
      state,
      action: PayloadAction<{ FutTargetLtpData: {} }>
    ) => {
      state.FutTargetLtpData = action.payload.FutTargetLtpData;
    },
    getPayOffData: (state, action: PayloadAction<{ chartData: {} }>) => {
      const { chartData } = action.payload;
      state.ChartDataList = chartData;
    },
    setSandboxExited(state, action: PayloadAction<string>) {
      state.SandboxExited = action.payload;
    },
    setExpandSelectedSandbox(state, action: PayloadAction<boolean>) {
      state.ExpandSelectedSandbox = action.payload;
    },
  },
});

export const {
  getOptionData,
  getFutureData,
  getCheckedPositionData,
  getSelectPositionData,
  showStrategyTable,
  showPositionTable,
  checkPosition,
  optionChainPayload,
  getUpdatedTargetltpData,
  showPnlTable,
  updateSymbolLtp,
  getToggleState,
  showDraftPositions,
  showDraftNamePopUp,
  showAllSandboxNames,
  setShowSelectedSandboxName,
  setSelectedStrategy,

  setDataUpdated,
  setShowpayoffChart,
  setSandboxDataObj,
  getFutTargetltpData,
  getOptTargetltpData,
  getPayOffData,
  setSandboxExited,
  setExpandSelectedSandbox,
} = AnalyzerSlice.actions;

export default AnalyzerSlice.reducer;
