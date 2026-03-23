import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface OIState {
  OIIndexSymbol: string;
  OILtpData: { [key: string]: {} };
  OIIndexExpiryDate: { [key: string]: [] };
  OISpotPriceData: null;
  OIFndexFutureData: [];
  OIAddtionalData: { [key: string]: {} };
  strikePrice: { [key: string]: {} };
  OiIndexData: { [key: string]: {} };
  lotSizeData: { [key: string]: {} };
}

const initialState: OIState = {
  OIIndexSymbol: "",
  OILtpData: {},
  OIIndexExpiryDate: {},
  OISpotPriceData: null,
  OIFndexFutureData: [],
  OIAddtionalData: {},
  strikePrice: {},
  OiIndexData: {},
  lotSizeData: {},
};
const OISlice = createSlice({
  name: "analyzer",
  initialState,

  reducers: {
    OIAlldata: (
      state,
      action: PayloadAction<{
        OISymbol: string;
        OITokenLtpData: {};
        OIExpiryDate: [];
        OIFutureData: [];
        OIAddonData: {};
        OISpotPrice: any;
        indexObj: {};
        lotSize: number;
      }>
    ) => {
      const {
        OISymbol,
        OITokenLtpData,
        OIExpiryDate,
        OIAddonData,
        OISpotPrice,
        indexObj,
        lotSize,
      } = action.payload;
      state.OILtpData[OISymbol] = OITokenLtpData;
      state.OIIndexSymbol = OISymbol;
      state.OIIndexExpiryDate[OISymbol] = OIExpiryDate;

      state.OIAddtionalData[OISymbol] = OIAddonData;
      state.OISpotPriceData = OISpotPrice;
      state.OiIndexData[OISymbol] = indexObj;
      state.lotSizeData[OISymbol] = lotSize;
    },
    intradayOiData: (
      state,
      action: PayloadAction<{ oiStrikePrice: string; oiDataList: [] }>
    ) => {
      const { oiStrikePrice, oiDataList } = action.payload;
      state.strikePrice[oiStrikePrice] = oiDataList;
    },
  },
});

export const { OIAlldata, intradayOiData } = OISlice.actions;

export default OISlice.reducer;
