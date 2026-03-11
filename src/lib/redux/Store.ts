import { configureStore, combineReducers } from "@reduxjs/toolkit";
import StrategyReducer from "./slices/StrategySlice";
import AnalyzerReducer from "./slices/AnalyzerSlice"; // Example of another slice
import OIReducer from "./slices/OISlice";
import ClearAnalyzerReducer from "./slices/ClearAnalyzerSlice";
import ChartsReducer from "./slices/ChartsSlice";
import PositionReducer from "./slices/PositionSlicer";
import placeOrderReducer from "./slices/PlaceOrder";
import CommonReducer from "./slices/CommonSlice";
import FiiDiiReducer from "./slices/FiiDiiSlice";
import PayoffChartReducer from "./slices/PayoffChartSlice";
import OptionChainReducer from "./slices/OptionChainSlice";
import StrategyChartReducer from "./slices/StrategyChartSlice";
import ScreenerReducer from "./slices/screenerSlice";
import SimulationReducer from "./slices/SimulationSlice";
import MarketBasisReducer from "./slices/MarketBasisSlice";
import GroupsSliceReducer from "./slices/GroupSlice";

// Combine all reducers into a rootReducer
const rootReducer = combineReducers({
  strategy: StrategyReducer,
  analyzer: AnalyzerReducer, // Add more reducers as needed
  OI: OIReducer,
  clearAnalyzer: ClearAnalyzerReducer,
  charts: ChartsReducer,
  Position: PositionReducer,
  placeOrder: placeOrderReducer,
  common: CommonReducer,
  FiiDiiData: FiiDiiReducer,
  PayoffChart: PayoffChartReducer,
  optionChain: OptionChainReducer,
  StrategyChart: StrategyChartReducer,
  Screener: ScreenerReducer,
  SimulationDemo: SimulationReducer,
  MarketBasis: MarketBasisReducer,
  Groups: GroupsSliceReducer,
});

// Configure the store with the rootReducer
export const Store = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["StrategyChart/getMinExpiryDate"],
          ignoredPaths: ["StrategyChart.minExpiryDate"],
        },
      }),
  });
};

// Infer the `RootState` and `AppStore` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof Store>;
