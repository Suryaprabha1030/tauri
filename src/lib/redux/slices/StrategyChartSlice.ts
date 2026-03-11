import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface StrategyChartState {
  payOffChartPayLoad: {};
  inputValue: number | null;
  minExpiryDate: Date | null;
  daysToExpiry: number | null;
  payoffExpiryDate: string;
  straddleChartData: {};
  strangleOiLoad: {};
  multiOiLoad: any[];
  maxPainStrikeValue: any;
}

const initialState: StrategyChartState = {
  payOffChartPayLoad: {},
  inputValue: null,
  minExpiryDate: null,
  daysToExpiry: null,
  payoffExpiryDate: "",
  straddleChartData: {},
  strangleOiLoad: {},
  multiOiLoad: [],
  maxPainStrikeValue: "",
};
const StrategyChartSlice = createSlice({
  name: "StrategyChart",
  initialState,

  reducers: {
    getPayOffChartPayLoad(state, action: PayloadAction<{}>) {
      state.payOffChartPayLoad = action.payload;
    },
    getInputValue(state, action: PayloadAction<number | null>) {
      state.inputValue = action.payload;
    },
    getMinExpiryDate(state, action: PayloadAction<Date | null>) {
      state.minExpiryDate = action.payload;
    },
    getDaysToExpiry(state, action: PayloadAction<number | null>) {
      state.daysToExpiry = action.payload;
    },
    getPayoffExpiryDate(state, action: PayloadAction<string>) {
      state.payoffExpiryDate = action.payload;
    },
    getStraddleChartData(state, action: PayloadAction<{}>) {
      state.straddleChartData = action.payload;
    },
    getStrangleOiLoad(state, action: PayloadAction<{}>) {
      state.strangleOiLoad = action.payload;
    },
    getMultiOiLoad(state, action: PayloadAction<any>) {
      state.multiOiLoad = action.payload;
    },
    getMaxPainStrikeValue(state, action: PayloadAction<any>) {
      state.maxPainStrikeValue = action.payload;
    },
  },
});

export const {
  getPayOffChartPayLoad,
  getInputValue,
  getMinExpiryDate,
  getDaysToExpiry,
  getPayoffExpiryDate,
  getStraddleChartData,
  getStrangleOiLoad,
  getMultiOiLoad,
  getMaxPainStrikeValue,
} = StrategyChartSlice.actions;

export default StrategyChartSlice.reducer;
