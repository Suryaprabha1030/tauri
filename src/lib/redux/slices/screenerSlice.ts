import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateProps {
  screenerQuery: string;
  isChatMode: boolean;
  PayoffStrategyName: any;
  StrategyCount: any;
  IndicesDataWithExpiry: any;
  NimaGptType: string;
  lastUpdatedpositions: {
    positionsData: {};
    lastUpdatedTime: any;
  };
  lastUpdatedholdings: {
    holdingsData: {};
    lastUpdatedTime: any;
  };
}

const initialState: initialStateProps = {
  screenerQuery: "",
  isChatMode: false,
  PayoffStrategyName: null,
  StrategyCount: null,
  IndicesDataWithExpiry: null,
  NimaGptType: "",
  lastUpdatedpositions: {
    positionsData: {},
    lastUpdatedTime: null,
  },
  lastUpdatedholdings: {
    holdingsData: {},
    lastUpdatedTime: null,
  },
};

const ScreenerSlice = createSlice({
  name: "Screener",
  initialState,
  reducers: {
    setScreenerQuery: (state, action: PayloadAction<any>) => {
      state.screenerQuery = action.payload;
    },
    setIsChatMode: (state, action: PayloadAction<any>) => {
      state.isChatMode = action.payload;
    },
    setPayoffStrategyName: (state, action: PayloadAction<any>) => {
      state.PayoffStrategyName = action.payload;
    },
    setStrategyCount: (state, action: PayloadAction<any>) => {
      state.StrategyCount = action.payload;
    },
    getAllIndicesDataWithExpiry: (state, action: PayloadAction<any>) => {
      state.IndicesDataWithExpiry = action.payload;
    },
    setNimaGpt: (state, action: PayloadAction<any>) => {
      state.NimaGptType = action.payload;
    },
    setLastUpdatedPositions(
      state,
      action: PayloadAction<{ data: any; time?: number }>
    ) {
      state.lastUpdatedpositions.positionsData = action.payload.data;
      state.lastUpdatedpositions.lastUpdatedTime =
        action.payload.time ?? Date.now();
    },

    setLastUpdatedHoldings(
      state,
      action: PayloadAction<{ data: any; time?: number }>
    ) {
      state.lastUpdatedholdings.holdingsData = action.payload.data;
      state.lastUpdatedholdings.lastUpdatedTime =
        action.payload.time ?? Date.now();
    },
  },
});

export const {
  setScreenerQuery,
  setPayoffStrategyName,
  setIsChatMode,
  setStrategyCount,
  getAllIndicesDataWithExpiry,
  setNimaGpt,
  setLastUpdatedHoldings,
  setLastUpdatedPositions,
} = ScreenerSlice.actions;

export default ScreenerSlice.reducer;
