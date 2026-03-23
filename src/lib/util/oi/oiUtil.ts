import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { inidicesOptionsData } from "@/lib/redux/slices/CommonSlice";
import { autoLogoutTokenRemove } from "../autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "../autoLogoutUtil/brokerLogOutUtil";

const oiGetSymbolClass = (optionChain: any, key: string, ltpChange: any) => {
  return optionChain === parseInt(key)
    ? `
       w-1/5  flex  justify-center items-center
             ${ltpChange > 0 ? "bg-green-50" : "bg-red-100"}`
    : ` w-1/5 flex  justify-center items-center 
          `;
};

const oiGetCEClass = (
  optionChain: any,
  key: string,
  ltpChange: any,
  expandOiTable: any
) => {
  if (optionChain === parseInt(key)) {
    return `w-1/3 ${expandOiTable ? "xl:max-2xl:w-[23%]" : ""}  h-full flex flex-col justify-center items-center ${
      ltpChange > 0 ? "bg-green-50" : "bg-red-100"
    }`;
  }
  return optionChain > parseInt(key)
    ? `w-1/3 ${expandOiTable ? "xl:max-2xl:w-[23%]" : ""} h-full flex flex-col   justify-center items-center  bg-blue-50 `
    : `w-1/3 ${expandOiTable ? "xl:max-2xl:w-[23%]" : ""}  h-full flex flex-col   justify-center items-center  bg-white `;
};

// class name for PE close value
const oiGetPEClass = (
  optionChain: any,
  key: string,
  ltpChange: any,
  expandOiTable: any
): string => {
  if (optionChain === parseInt(key)) {
    return `w-1/3 ${expandOiTable ? "xl:max-2xl:w-[23%]" : ""}   h-full flex flex-col justify-center items-center  ${
      ltpChange > 0 ? "bg-green-50" : "bg-red-100"
    }`;
  }
  return optionChain < parseInt(key)
    ? `w-1/3 h-full ${expandOiTable ? "xl:max-2xl:w-[23%]" : ""}  flex flex-col justify-center items-center  bg-blue-50 `
    : `w-1/3 h-full ${expandOiTable ? "xl:max-2xl:w-[23%]" : ""}  flex flex-col justify-center items-center  bg-white`;
};

const determineMarketActionOi = (
  oiChange: number,
  priceChange: number,
  type: string
): string => {
  if (oiChange > 0 && priceChange > 0) {
    return `Long ${type === "CE" ? "Bullish" : "Bearish"}`;
  } else if (oiChange > 0 && priceChange < 0) {
    return ` Short ${type === "PE" ? "Bullish" : "Bearish"}`;
  } else if (oiChange < 0 && priceChange > 0) {
    return `Short Covering${type === "CE" ? "Bullish" : "Bearish"}`;
  } else if (oiChange < 0 && priceChange < 0) {
    return `Long Covering ${type === "PE" ? "Bullish" : "Bearish"}`;
  } else {
    // console.error("Invalid data: No significant change in OI or Option Price");

    return "No Trend Found"; // You can return a default value, or handle the case as needed
  }
};

const convertTime = (utcTime: any) => {
  const [hours, minutes] = utcTime.split(":").map(Number);

  if (isNaN(hours) || isNaN(minutes)) return "Invalid Time"; // Handle invalid input

  // Create a Date object for today's date with the given UTC time
  const utcDate = new Date();
  utcDate.setUTCHours(hours, minutes, 0, 0);

  // Convert to system's local time
  return utcDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatLtp = (ltp: any) => (ltp % 1 ? ltp.toFixed(2) : ltp);

function TransformDataForMargin(input: any) {
  const transformed: any = {};

  // Iterate over each date in the input object
  Object.keys(input).forEach((dateKey) => {
    const strikePriceObj = input[dateKey];

    // Iterate over each strike price in the nested object
    Object.keys(strikePriceObj).forEach((strikePriceKey) => {
      const dataArray = strikePriceObj[strikePriceKey];

      // Iterate through each object in the dataArray
      dataArray.forEach((data: any) => {
        const newKey = `${strikePriceKey}#${data.option_type}#${data.expiry}#Group 1`;
        transformed[newKey] = data; // Add the object to the transformed result
      });
    });
  });

  return transformed;
}

function straddleTransformData(input: any) {
  let output:any = {};

  Object.keys(input).forEach((key) => {
    if (input[key] === true) {
      const parts = key.split("#");
      if (parts.length === 3) {
        const [strikePrice, expiry, group] = parts;
        output[`${strikePrice}#CE#${expiry}#${group}`] = true;
        output[`${strikePrice}#PE#${expiry}#${group}`] = true;
      }
    }
  });

  return output;
}

const keyMapping: Record<string, string> = {
  symbol: "broker_symbol",
};

const updateMarginPayload = (
  checkedRows: any,
  ltp: any,
  query: any,
  setMarginPayload: any
) => {
  if (!checkedRows || Object.keys(checkedRows).length === 0) return;
  const allData: any = TransformDataForMargin(ltp[query]); // Convert to object
  const allDataMap: any = new Map(Object.entries(allData)); // Convert object to Map

  const matchedValues: any = Object.keys(checkedRows)
    .filter((key) => checkedRows[key] && allDataMap.has(key))
    .map((key) => {
      const data = { ...allDataMap.get(key) }; // Retrieve matched values

      // Modify key names dynamically based on keyMapping
      const updatedData = Object.fromEntries(
        Object.entries(data).map(([k, v]) => [keyMapping[k] || k, v])
      );

      return {
        ...updatedData,
        order_type: "MARKET",
        product_type: "NRML",
        lots: 1,
        transaction_type: "SHORT",
        broker_token: data.token, // Assign token value to broker_token
        broker_identifier: data.identifier,
      };
    });

  if (matchedValues.length > 0) {
    setMarginPayload(matchedValues);
  }
};

const fetchOiStoredData = async (dispatch: any, router: any) => {
  try {
    const oiStoredData = new UserBrokerRouterApi(baseConfig());
    const oiDataStored =
      await oiStoredData.getOiStoredIndicesV1UsersOiIndicesGet();
    dispatch(inidicesOptionsData({ allIndicesOptions: oiDataStored?.data }));
  } catch (error: any) {
    if (error?.response && error?.response?.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (error?.response && error?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }
  }
};

enum ChartToggleButtonType {
  Chart = "Chart",
  MultiOI = "Multi OI",
  MultiStraddle = "Multi Straddle",
  PayoffTable = "Payoff Table",
}

// Array of button configurations
const ChartTogglebutton = [
  { type: ChartToggleButtonType.Chart, label: "Chart", id: 1 },
  { type: ChartToggleButtonType.MultiOI, label: "Multi OI", id: 2 },
  {
    type: ChartToggleButtonType.MultiStraddle,
    label: "Multi Straddle",
    id: 3,
  },
  { type: ChartToggleButtonType.PayoffTable, label: "Payoff Table", id: 4 },
];

export {
  oiGetPEClass,
  oiGetCEClass,
  oiGetSymbolClass,
  determineMarketActionOi,
  convertTime,
  formatLtp,
  TransformDataForMargin,
  straddleTransformData,
  updateMarginPayload,
  fetchOiStoredData,
  ChartTogglebutton,
  ChartToggleButtonType,
};
