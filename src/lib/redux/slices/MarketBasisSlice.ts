import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface MarketBasisState {
  isMarketHoliday: boolean | null;
}

const initialState: MarketBasisState = {
  isMarketHoliday: null,
};
const MarketBasisSlice = createSlice({
  name: "MarketBasis",
  initialState,

  reducers: {
    getMarketHolidays: (state, action: PayloadAction<boolean>) => {
      state.isMarketHoliday = action.payload;
    },
  },
});

export const { getMarketHolidays } = MarketBasisSlice.actions;

export default MarketBasisSlice.reducer;
