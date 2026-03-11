import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SimulationDemo {
  positionType: string;
  holdingsType: string;
  ordersDemo: boolean;
  simulatedOrders: [];
  strategiesPnlDemo: any;
  refreshStrategiesPnl: boolean;
}

const initialState: SimulationDemo = {
  positionType: "",
  holdingsType: "",
  ordersDemo: false,
  simulatedOrders: [],
  strategiesPnlDemo: null,
  refreshStrategiesPnl: false,
};

const SimulationDemo = createSlice({
  name: "SimulationDemo",
  initialState,
  reducers: {
    setOrdersDemoEnabled(state, action: PayloadAction<boolean>) {
      state.ordersDemo = action.payload;
    },
    setPositionTypes(state, action: PayloadAction<string>) {
      state.positionType = action.payload;
    },
    setHoldingsTypes(state, action: PayloadAction<string>) {
      state.holdingsType = action.payload;
    },
    setSimulatedOrders(state, action: PayloadAction<[]>) {
      state.simulatedOrders = action.payload;
    },
    setStrategiesPnlDemo(state, action: PayloadAction<{}>) {
      state.strategiesPnlDemo = action.payload;
    },
    setStrategiesPnlRefresh(state, action: PayloadAction<boolean>) {
      state.refreshStrategiesPnl = action.payload;
    },
  },
});

export const {
  setOrdersDemoEnabled,
  setPositionTypes,
  setHoldingsTypes,
  setSimulatedOrders,
  setStrategiesPnlDemo,
  setStrategiesPnlRefresh,
} = SimulationDemo.actions;

export default SimulationDemo.reducer;
