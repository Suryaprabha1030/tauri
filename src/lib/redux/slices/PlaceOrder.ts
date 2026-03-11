import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Stock {
  expiry: string;
  strike_price: number;
  lots: number;
  ltp: number;
  transaction_type: string;
  option_type: string;
  product_type: string;
  order_type: string;
  validity: string;
  trigger: number;
  variety: string;
}
interface Bounds {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface PlaceOrderState {
  stockData: Stock[];
  isVisible: boolean;
  UpdateOrderStock: any[];
  AnalyzeOrder: any;
}

const initialState: PlaceOrderState = {
  stockData: [],
  isVisible: false, // Controls visibility of PlaceOrder component
  UpdateOrderStock: [],
  AnalyzeOrder: {},
};

const placeOrderSlice = createSlice({
  name: "placeOrder",
  initialState,
  reducers: {
    setStockData(state, action: PayloadAction<Stock[]>) {
      state.stockData = action.payload;
    },
    togglePlaceOrderVisibility(state, action: PayloadAction<boolean>) {
      state.isVisible = action.payload;
    },
    setUpdateStockData(state, action: PayloadAction<any[]>) {
      state.UpdateOrderStock = action.payload;
    },
    setAnalyzeOrderStocks(state, action: PayloadAction<any>) {
      state.AnalyzeOrder = action.payload;
    },
  },
});

export const {
  setStockData,
  togglePlaceOrderVisibility,
  setUpdateStockData,
  setAnalyzeOrderStocks,
} = placeOrderSlice.actions;

export default placeOrderSlice.reducer;
