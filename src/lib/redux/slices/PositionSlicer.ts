import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PositionState {
  ClientCode: any;
  BrokerName: any;
  initiateTvChart: any;
  totHoldingsPnl: any;
  totPositionsPnl: any;
  totalCheckedPnl: any;
  orderPlaced: boolean;
  userId: any;
  SymbolPnl: { [key: string]: any };
  identifiersSet: boolean;
  TotalPositionsPnl: any;
  activePosHoldFilter: any;
}
const initialState: PositionState = {
  ClientCode: "",
  BrokerName: "",
  initiateTvChart: null,
  totPositionsPnl: 0,
  totHoldingsPnl: 0,
  totalCheckedPnl: null,
  orderPlaced: false,
  userId: null,
  SymbolPnl: {},
  identifiersSet: false,
  TotalPositionsPnl: "",
  activePosHoldFilter: false,
};
const PositionSlice = createSlice({
  name: "Positions",
  initialState,
  reducers: {
    getProfileDetail: (
      state,
      action: PayloadAction<{ ClientCode: any; BrokerName: any }>
    ) => {
      const { ClientCode, BrokerName } = action.payload;
      state.ClientCode = ClientCode;
      state.BrokerName = BrokerName;
    },
    setInitiateTvChart(state, action: PayloadAction<any>) {
      state.initiateTvChart = action.payload;
    },
    setTotalPnl(
      state,
      action: PayloadAction<{ totHoldingsPnl: any; totPositionsPnl: any }>
    ) {
      const { totHoldingsPnl, totPositionsPnl } = action.payload;
      state.totHoldingsPnl = totHoldingsPnl;
      state.totPositionsPnl = totPositionsPnl;
    },
    setCheckedTotalPnl(state, action: PayloadAction<{ totalCheckedPnl: any }>) {
      const { totalCheckedPnl } = action.payload;
      state.totalCheckedPnl = totalCheckedPnl;
    },
    setOrderPlaced(state, action: PayloadAction<any>) {
      state.orderPlaced = action.payload;
    },
    setUserId(state, action: PayloadAction<any>) {
      state.userId = action.payload;
    },
    updateSymbolPnl(
      state,
      action: PayloadAction<{ symbol: string; pnl: any }>
    ) {
      const { symbol, pnl } = action.payload;
      state.SymbolPnl[symbol] = pnl;
    },
    setIdentifiersSet(state, action: PayloadAction<boolean>) {
      state.identifiersSet = action.payload;
    },
    setTotalPositionsPnl(state, action: PayloadAction<any>) {
      state.TotalPositionsPnl = action.payload;
    },
    setActivePosHoldFilter(state, action: PayloadAction<any>) {
      state.activePosHoldFilter = action.payload;
    },
  },
});

export const {
  getProfileDetail,
  setInitiateTvChart,
  setTotalPnl,
  setCheckedTotalPnl,
  setOrderPlaced,
  setUserId,
  updateSymbolPnl,
  setIdentifiersSet,
  setTotalPositionsPnl,
  setActivePosHoldFilter,
} = PositionSlice.actions;

export default PositionSlice.reducer;
