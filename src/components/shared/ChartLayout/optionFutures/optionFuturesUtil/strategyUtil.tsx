import config from "@/lib/config";

const getBuyClassLive = (commonData: Record<string, any>, hashKey: string) => {
  const baseClass = `border-2 w-7 h-5 flex justify-center items-center px-2 shadow-strong-top rounded-md    `;

  if (commonData[hashKey] && commonData[hashKey].transaction_type === "LONG") {
    return `${baseClass} bg-z-green-500 shadow-lg text-white border-z-green-500  group-hover:bg-z-green-500 group-hover:text-white`;
  }

  return `${baseClass}   shadow-lg border-gray-50 bg-white text-black group-hover:bg-white group-hover:text-black`;
};
const getSellClassLive = (commonData: Record<string, any>, hashKey: string) => {
  const baseClass = `border-2 w-7 h-5 flex justify-center items-center px-2   shadow-strong-top rounded-md    `;
  if (commonData[hashKey] && commonData[hashKey].transaction_type === "SHORT") {
    return `${baseClass}  bg-red-500 border-red-500 text-white  border  shadow-lg group-hover:bg-red-500 group-hover:text-white   `;
  }
  return `border-2 border-gray-50 bg-white  border shadow-lg   ${baseClass}`;
};

const reverseTransformData = (commonData: any) => {
  const result: any = { LONG: { CE: [], PE: [] }, SHORT: { CE: [], PE: [] } };

  for (const [key, val] of Object.entries(commonData)) {
    const value = val as any;
    if (!value.transaction_type) {
      console.error(`Missing transaction_type in value:`, value);
      continue; // Skip this entry if transaction_type is missing
    }

    const type = value.transaction_type.toUpperCase(); // Safely convert transaction_type to uppercase
    const [strikePrice, optionType] = key.split("#");

    if (result[type] && result[type][optionType] !== undefined) {
      result[type][optionType].push(value);
    } else {
      console.error(`Invalid type or optionType: ${type}, ${optionType}`);
    }
  }

  return result;
};

const LivegetOptionChainForOptionType = (value: any, optionType: string) => {
  let result = {};

  // Check if `value` is an array before calling `forEach`
  if (Array.isArray(value)) {
    value.forEach((element: any) => {
      if (element.option_type === optionType) {
        result = element;
      }
    });
  } else {
    console.error("Expected an array but received:", value);
  }

  return result;
};

const getCloseValue = (
  value: any,
  optionType: string,
  websocketDataRead: any
) => {
  let result = "";
  value.forEach((element: any) => {
    if (element.option_type === optionType) {
      // result = element.ltp;
      result = websocketDataRead[element?.identifier];
    }
  });
  return result;
};

const buildSelectedOptionChain = (option_chain_data: any) => {
  let temp: Record<string, any> = {};
  let keys = [];
  if (!option_chain_data) {
    return temp;
  }

  Object.entries(option_chain_data).forEach(([key, value]: [string, any]) => {
    value.forEach((element: any) => {
      if (element.is_selected && element.option_type === "CE") {
        temp[getHashKey(key, "CE", element.expiry)] = element;
      }

      if (element.is_selected && element.option_type === "PE") {
        temp[getHashKey(key, "PE", element.expiry)] = element;
      }
    });
  });
  return temp;
};
const getCEClass = (optionChain: any, key: string, ltpChange: any) => {
  if (optionChain === parseInt(key)) {
    return `  flex  flex-row justify-center items-center  py-1 px-6   ${
      ltpChange > 0 ? "bg-green-50" : "bg-red-100"
    }`;
  }
  return optionChain > parseInt(key)
    ? "  flex flex-row  justify-center items-center  py-1   bg-blue-50 px-6  "
    : "  flex flex-row  justify-center items-center px-6   bg-white ";
};

// class name for PE close value
const getPEClass = (optionChain: any, key: string, ltpChange: any): string => {
  if (optionChain === parseInt(key)) {
    return `  flex flex-row justify-center items-center py-1 px-6   ${
      ltpChange > 0 ? "bg-green-50" : "bg-red-100"
    }`;
  }
  return optionChain < parseInt(key)
    ? "  flex flex-row justify-center items-center py-1  bg-blue-50   px-6  "
    : "  flex flex-row justify-center items-center  bg-white px-6    ";
};

const getCEOiClass = (optionChain: any, key: string) => {
  return optionChain > parseInt(key)
    ? "w-1/5 bg-blue-50 px-6 py-2 "
    : "w-1/5 px-6 py-2 ";
};

// class name for PE close value
const getPEOiClass = (optionChain: any, key: string) => {
  return optionChain < parseInt(key)
    ? "w-1/5 bg-blue-50 px-6 py-2 "
    : "w-1/5 px-6 py-2 ";
};

// class name for strikePrice value
const getSymbolClass = (optionChain: any, key: string, ltpChange: any) => {
  return optionChain === parseInt(key)
    ? `text-medium w-1/5    px-6 py-[0.52rem] 2xl:py-[1.35rem] font-medium ${
        ltpChange > 0 ? "bg-green-50" : "bg-red-100"
      }`
    : "text-medium w-1/5 bg-white px-6 py-[0.5rem] ";
};

const getHashKey = (key: string, optionType: string, expiry: string) => {
  return `${key}#${optionType}#${expiry}`;
};

const hasNonEmptyArrays = (strategy: any) =>
  strategy.PE.length > 0 || strategy.CE.length > 0 || strategy.FUT.length > 0;

const hasNonEmptyOptionArrays = (strategy: any) =>
  strategy.PE.length > 0 || strategy.CE.length > 0;

const futReverseTransformData = (Data: any) => {
  const result: any = {
    LONG: { CE: [], PE: [], FUT: [] },
    SHORT: { CE: [], PE: [], FUT: [] },
  };

  for (const [key, val] of Object.entries(Data)) {
    const value = val as any;
    if (!value?.transaction_type) {
      console.error(`Missing transaction_type in value:`, value);
      continue; // Skip this entry if transaction_type is missing
    }

    const type = value?.transaction_type; // Safely convert transaction_type to uppercase
    const [strikePrice, optionType] = key.split("#");

    if (result[type] && result[type][optionType] !== undefined) {
      result[type][optionType].push(value);
    } else {
      console.error(`Invalid type or optionType: ${type}, ${optionType}`);
    }
  }

  return result;
};

const mergeData = (target: any, source: any) => {
  // Check if both target and source are provided
  if (!target && !source) {
    throw new Error("Both target and source data are required");
  }

  // Merge LONG data
  if (target.LONG && source.LONG) {
    // Initialize the FUT array in the target if it doesn't exist
    if (!target.LONG.FUT) {
      target.LONG.FUT = [];
    }

    // Merge FUT data from the source into the target
    if (source.LONG.FUT && source.LONG.FUT.length > 0) {
      target.LONG.FUT = target.LONG.FUT.concat(source.LONG.FUT);
    }

    // Merge CE and PE data if necessary
    target.LONG.CE = target.LONG.CE.concat(source.LONG.CE || []);
    target.LONG.PE = target.LONG.PE.concat(source.LONG.PE || []);
  }

  // Merge SHORT data
  if (target.SHORT && source.SHORT) {
    // Initialize the FUT array in the target if it doesn't exist
    if (!target.SHORT.FUT) {
      target.SHORT.FUT = [];
    }

    // Merge FUT data from the source into the target
    if (source.SHORT.FUT && source.SHORT.FUT.length > 0) {
      target.SHORT.FUT = target.SHORT.FUT.concat(source.SHORT.FUT);
    }

    // Merge CE and PE data if necessary
    target.SHORT.CE = target.SHORT.CE.concat(source.SHORT.CE || []);
    target.SHORT.PE = target.SHORT.PE.concat(source.SHORT.PE || []);
  }

  return target;
};

function markSelectedByPosition(obj1: any, obj2: any) {
  for (const key in obj1) {
    obj1[key].forEach((item: any) => {
      if (item.position === obj2.position) {
        item.is_selected = true;
      }
    });
  }
}

const updateSelectData = (
  data: Record<string, any>,
  key: string,
  element: any,
  transactionType: string,
  buttonType: string
) => {
  const updatedData = { ...data };
  const addData = { ...element };
  addData.transaction_type = transactionType;
  addData.button_type = buttonType;

  if (
    (element.is_selected && element.transaction_type !== transactionType) ||
    !element.is_selected
  ) {
    addData.lots = 1;
  }

  if (data[key]) {
    if (data[key].transaction_type === transactionType) {
      delete updatedData[key];
    } else {
      if (element.transaction_type !== transactionType) {
        delete updatedData[key];
      }

      if (data[key].transaction_type != element.identifier) {
        delete updatedData[key];
      }

      updatedData[key] = addData;
    }
  } else {
    updatedData[key] = addData;
  }

  return updatedData;
};

const sortByExpiryDate = (obj: any[]): any[] => {
  return obj.sort((a: any, b: any) => {
    // Convert the expiry_date format to a valid Date object
    const dateA = new Date(
      `${a.expiry_date.slice(5)}-${a.expiry_date.slice(
        2,
        5
      )}-${a.expiry_date.slice(0, 2)}`
    );
    const dateB = new Date(
      `${b.expiry_date.slice(5)}-${b.expiry_date.slice(
        2,
        5
      )}-${b.expiry_date.slice(0, 2)}`
    );

    // Compare the two dates
    return dateA.getTime() - dateB.getTime();
  });
};

function OiFormatPayload(payload: any) {
  return payload.reduce((acc: any, item: any) => {
    const key = `${item.strike_price}.0#${item.option_type}`;
    acc[key] = item.oi_percentage;
    return acc;
  }, {});
}
function OiChgPayload(payload: any) {
  return payload.reduce((acc: any, item: any) => {
    const key = `${item.strike_price}.0#${item.option_type}`;
    acc[key] = item.oi_change;
    return acc;
  }, {});
}
function FormatOiValue(payload: any) {
  return payload.reduce((acc: any, item: any) => {
    const key = `${item.strike_price}.0#${item.option_type}`;
    acc[key] = item.latest_oi;
    return acc;
  }, {});
}

const getSymbolOiClass = (optionChain: any, key: string) => {
  return optionChain === parseInt(key)
    ? "text-medium w-1/5 flex justify-center items-center  bg-green-50 px-6 py-2 font-bold"
    : "text-medium w-1/5 flex justify-center items-center  bg-white px-6 py-2";
};

const getCloseValuePercentage = (
  value: any,
  optionType: string,
  netchangePercent: any
) => {
  let result = "";
  value.forEach((element: any) => {
    if (element.option_type === optionType) {
      // result = element.net_chg_perc;
      result = netchangePercent[element?.identifier];
    }
  });
  return result;
};

function oiChangePercFromData(payload: any) {
  return payload.reduce((acc: any, item: any) => {
    const key = `${item.strike_price}.0#${item.option_type}`;
    acc[key] = item.oi_change_percentage;
    return acc;
  }, {});
}

const determineMarketAction = (
  oiChange: any,
  priceChange: any,
  type: string,
  expandTable: any
): any => {
  if (parseFloat(oiChange) > 0 && parseFloat(priceChange) > 0) {
    return expandTable
      ? ` ${type === "CE" ? "Call" : "Put"} Buying `
      : `${type === "CE" ? "CB" : "PB"}`;
  } else if (parseFloat(oiChange) > 0 && parseFloat(priceChange) < 0) {
    return expandTable
      ? `${type === "CE" ? "Call" : "Put"} Writing`
      : `${type === "CE" ? "CW" : "PW"}`;
  } else if (parseFloat(oiChange) < 0 && parseFloat(priceChange) > 0) {
    return expandTable
      ? `${type === "CE" ? "Call" : "Put"} Short Covering `
      : `${type === "CE" ? "CSC" : "PSC"}`;
  } else if (parseFloat(oiChange) < 0 && parseFloat(priceChange) < 0) {
    return expandTable
      ? ` ${type === "CE" ? "Call" : "Put"} Long Covering`
      : `${type === "CE" ? "CLC" : "PLC"}`;
  } else {
    // console.error("Invalid data: No significant change in OI or Option Price");

    return expandTable ? "No Trend Found" : "NTF"; // You can return a default value, or handle the case as needed
  }
};

function oiData(payload: any) {
  return payload.reduce((acc: any, item: any) => {
    const key = `${item.strike_price}.0#${item.option_type}`;
    acc[key] = item.latest_oi;
    return acc;
  }, {});
}

const determineMarketActionIcon = (
  oiChange: any,
  priceChange: any,
  type: string,
  expandTable: any
): string => {
  if (parseFloat(oiChange) > 0 && parseFloat(priceChange) > 0) {
    return expandTable
      ? ` ${type === "CE" ? "Call" : "Put"}Buying `
      : `${type === "CE" ? "CB" : "PB"}`;
  } else if (parseFloat(oiChange) > 0 && parseFloat(priceChange) < 0) {
    return expandTable
      ? `${type === "CE" ? "Call" : "Put"}Writing`
      : `${type === "CE" ? "CW" : "PW"}`;
  } else if (parseFloat(oiChange) < 0 && parseFloat(priceChange) > 0) {
    return expandTable
      ? `${type === "CE" ? "Call" : "Put"}ShortCovering `
      : `${type === "CE" ? "CSC" : "PSC"}`;
  } else if (parseFloat(oiChange) < 0 && parseFloat(priceChange) < 0) {
    return expandTable
      ? ` ${type === "CE" ? "Call" : "Put"}LongCovering`
      : `${type === "CE" ? "CLC" : "PLC"}`;
  } else {
    // console.error("Invalid data: No significant change in OI or Option Price");

    return expandTable ? "No Trend Found" : "NTF"; // You can return a default value, or handle the case as needed
  }
};

function oiFromData(payload: any) {
  return payload.reduce((acc: any, item: any) => {
    const key = `${item.strike_price}.0#${item.option_type}`;
    acc[key] = item.latest_oi;
    return acc;
  }, {});
}

const getCloseSymbol = (
  value: any,
  optionType: any,
  websocketDataRead: any
) => {
  let result = "";
  let key = "";
  const data: any = {};

  value.forEach((element: any) => {
    if (element.option_type === optionType) {
      // result = element.ltp;
      result = websocketDataRead[element?.identifier];

      result = element.identifier;
      key = `${element?.strike_price}.0`;
    }
  });

  return (data[key] = result);
};

// 🔹 Enrich Option Chain with websocket LTP + net % change
function enrichOptionChain(
  optionChain: any,
  webSocketDataRead: any,
  netpercentage: any
) {
  const enriched: any = {};

  Object.keys(optionChain || {})?.forEach((expiry) => {
    const strikes = optionChain[expiry];
    enriched[expiry] = {};

    Object.keys(strikes)?.forEach((strike) => {
      const options = strikes[strike]; // CE & PE array

      enriched[expiry][strike] = options?.map((opt: any) => ({
        ...opt,
        ltp: webSocketDataRead?.[opt?.identifier] ?? 0,
        net_chg_perc: netpercentage?.[opt?.identifier] ?? 0,
      }));
    });
  });

  return enriched;
}

// 🔹 Enrich Futures with websocket LTP + net % change
function enrichFutures(
  futures: [],
  lotSize: number,
  webSocketDataRead: any,
  netpercentage: any
) {
  return futures?.map((future: any) => ({
    ...future,
    lot_size: lotSize,
    ltp: webSocketDataRead?.[future?.identifier] ?? 0,
    net_chg_perc: netpercentage?.[future?.identifier] ?? 0,
  }));
}
const getIdentifierFromQuery = (query: string) => {
  const key = Object.keys(config.OIindices).find(
    (k) => k.toLowerCase() === query.toLowerCase()
  );

  return key ? config.OIindices[key as keyof typeof config.OIindices] : null;
};

export {
  getBuyClassLive,
  getSellClassLive,
  reverseTransformData,
  LivegetOptionChainForOptionType,
  getCloseValue,
  buildSelectedOptionChain,
  getCEClass,
  getSymbolClass,
  getPEClass,
  getHashKey,
  hasNonEmptyArrays,
  futReverseTransformData,
  mergeData,
  hasNonEmptyOptionArrays,
  markSelectedByPosition,
  updateSelectData,
  sortByExpiryDate,
  OiFormatPayload,
  getCEOiClass,
  getPEOiClass,
  getSymbolOiClass,
  getCloseValuePercentage,
  FormatOiValue,
  determineMarketAction,
  oiChangePercFromData,
  oiFromData,
  getCloseSymbol,
  determineMarketActionIcon,
  OiChgPayload,
  oiData,
  enrichOptionChain,
  enrichFutures,
  getIdentifierFromQuery,
};
