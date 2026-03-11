import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface clearAnalyzerState {
  legTempValue: {};
  strategyChartPayloadData: {};
}

const initialState: clearAnalyzerState = {
  legTempValue: {},
  strategyChartPayloadData: {},
};
const ClearAnalyzerSlice = createSlice({
  name: "clearAnalyzer",
  initialState,

  reducers: {
    entryTempValue: (state, action: PayloadAction<{ getLegTempValue: {} }>) => {
      const { getLegTempValue } = action.payload;
      state.legTempValue = getLegTempValue;
    },
    strategyChartPayload: (
      state,
      action: PayloadAction<{ strategyChartPayloadList: {} }>
    ) => {
      const { strategyChartPayloadList } = action.payload;
      state.strategyChartPayloadData = strategyChartPayloadList;
    },
  },
});

export const { entryTempValue, strategyChartPayload } =
  ClearAnalyzerSlice.actions;

export default ClearAnalyzerSlice.reducer;
