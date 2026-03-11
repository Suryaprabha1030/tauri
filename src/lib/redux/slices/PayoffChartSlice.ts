import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PayoffChartState {
  margin: number | null;
  cardResultData: {};
  premiumData: null;
  oiChartCall: boolean;
}

const initialState: PayoffChartState = {
  margin: null,
  cardResultData: {},
  premiumData: null,
  oiChartCall: true,
};

const PayoffChartSlice = createSlice({
  name: "PayoffChart",
  initialState,
  reducers: {
    marginRequired(state, action: PayloadAction<any>) {
      state.margin = action.payload;
    },
    cardResult(state, action: PayloadAction<any>) {
      state.cardResultData = action.payload;
    },
    premiumData(state, action: PayloadAction<any>) {
      state.premiumData = action.payload;
    },
    setOiChartCall(state, action: PayloadAction<any>) {
      state.oiChartCall = action.payload;
    },
  },
});

export const { marginRequired, cardResult, premiumData, setOiChartCall } =
  PayoffChartSlice.actions;

export default PayoffChartSlice.reducer;
