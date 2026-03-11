import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateProps {
  cashFlowList: any[];
  fiiDiiHistoryList: any[];
  dateList: any[];
  futureOptionsList: any[];
  FiiDiiLtpList: any[];
  datewiseSummaryList: {};
  fiiDiiLtpChgList: any[];
}

const initialState: initialStateProps = {
  cashFlowList: [],
  fiiDiiHistoryList: [],
  dateList: [],
  futureOptionsList: [],
  FiiDiiLtpList: [],
  datewiseSummaryList: {},
  fiiDiiLtpChgList: [],
};

const FiiDiiSlice = createSlice({
  name: "FiiDiiData",
  initialState,
  reducers: {
    getFiiDiiData: (
      state,
      action: PayloadAction<{
        cashFlowData: [];
        fiiDiiHistoryData: [];
        FiiDiiDate: [];
        futureOptionsData: [];
        FiiDiiLtpData: [];
        FiiDiiLtpChgData: [];
        datewiseSummaryData: {};
      }>
    ) => {
      const {
        cashFlowData,
        fiiDiiHistoryData,
        FiiDiiDate,
        futureOptionsData,
        FiiDiiLtpData,
        FiiDiiLtpChgData,
        datewiseSummaryData,
      } = action.payload;
      state.cashFlowList = cashFlowData;
      state.fiiDiiHistoryList = fiiDiiHistoryData;
      state.dateList = FiiDiiDate;
      state.futureOptionsList = futureOptionsData;
      state.FiiDiiLtpList = FiiDiiLtpData;
      state.datewiseSummaryList = datewiseSummaryData;
      state.fiiDiiLtpChgList = FiiDiiLtpChgData;
    },
  },
});

export const { getFiiDiiData } = FiiDiiSlice.actions;

export default FiiDiiSlice.reducer;
