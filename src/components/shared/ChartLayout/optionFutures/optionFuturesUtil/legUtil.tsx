import config from "@/lib/config";

// position transform data for table setting
const transformData = (positions: any, websocketDataRead: any) => {
  const result: any = {};

  positions &&
    positions.forEach((position: any) => {
      const {
        strike_price,
        option_type,
        expiry,
        symbol,
        transaction_type,
        identifier,
        ...rest
      } = position;
      // const key = `${strike_price}.0#${option_type}#${expiry}#positions`;
      const key =
        option_type === "FUT"
          ? `${symbol}#${option_type}#${expiry}#positions#${transaction_type}`
          : `${strike_price}.0#${option_type}#${expiry}#positions#${transaction_type}`;
      result[key] = { ...position, ltp: websocketDataRead[identifier] };
    });

  return result;
};

function mergeOptionsPositions(obj1: any, obj2: any) {
  const mergedObj = { ...obj1 };

  for (const key in obj2) {
    const { strike_price, option_type, lots } = obj2[key];

    const existingKey = Object.keys(mergedObj).find(
      (k) =>
        mergedObj[k].strike_price === strike_price &&
        mergedObj[k].option_type === option_type
    );

    if (existingKey) {
      // Add lots if the strike_price and option_type match
      mergedObj[existingKey].lots += lots;
    } else {
      // Otherwise, add the entry from obj2
      mergedObj[key] = obj2[key];
    }
  }

  return mergedObj;
}
// option chain data select based on position
function markSelectedBasedPosition(obj1: any, obj2: any) {
  // Create a new object to store the updated data
  const updatedObj1: any = {};

  // Loop through the keys of the first object
  for (const key in obj1) {
    updatedObj1[key] = obj1[key].map((item: any) => {
      // Make a copy of the current item
      let updatedItem = { ...item };

      // Loop through the keys of the second object
      for (const key2 in obj2) {
        const [strikePrice, optionType] = key2.split("#");

        // Check if the current item matches any property in the second object
        if (
          updatedItem.identifier === obj2[key2].identifier && // Match by identifier
          updatedItem.option_type === optionType // Match by option type
        ) {
          updatedItem = {
            ...updatedItem,
            is_selected: true, // Add is_selected = true if match is found
            lots: obj2[key2].lots, // Update lots
            transaction_type: obj2[key2].transaction_type,
            target_ltp: obj2[key2].target_ltp, // Update transactionType
            ivValue: obj2[key2]?.ivValue,
          };
        }
      }

      return updatedItem; // Return the updated or unchanged item
    });
  }

  return updatedObj1; // Return the new updated object
}
// option chain data select based on inbuilt strategy
const addSelectedFlagAndTransactionType = (obj1: any, obj2: any): any => {
  if (
    obj1 &&
    Object.entries(obj1).length === 0 &&
    Object.entries(obj2).length === 0
  ) {
    return null;
  }

  // Create a new object to hold the updated entries
  const updatedObj1 = { ...obj1 };

  // Iterate through each entry in obj1
  for (const [key, entries] of Object.entries(updatedObj1)) {
    if (Array.isArray(entries)) {
      // Create a new array for the updated entries
      updatedObj1[key] = entries.map((entry: any) => {
        let updatedEntry = entry;
        if (updatedEntry.is_selected) {
          delete updatedEntry.is_selected;
        }
        if (updatedEntry.transaction_type) {
          delete updatedEntry.transaction_type;
        }
        if (updatedEntry.lots) {
          delete updatedEntry.lots;
        }
        // Check obj2 for matching position and option_type
        for (const [transactionType, types] of Object.entries(obj2)) {
          const type = types as any;
          const matchingEntries = type[entry?.option_type];
          if (Array.isArray(matchingEntries)) {
            const match = matchingEntries.find(
              (e: any) =>
                e.position === entry.position &&
                e.option_type === entry.option_type
            );
            if (match) {
              // If entry is not extensible, create a deep copy and update it
              if (!Object.isExtensible(entry)) {
                updatedEntry = {
                  ...entry,
                  is_selected: true,
                  transaction_type: transactionType,
                  lots: match.lots,
                  target_ltp: entry.ltp,
                  ivValue: config.defaultIvValue,
                };
              } else {
                // If entry is extensible, directly update it
                updatedEntry = {
                  ...entry,
                  is_selected: true,
                  transaction_type: transactionType,
                  lots: match.lots,
                  target_ltp: entry.ltp,
                  ivValue: config.defaultIvValue,
                };
              }
            }
          }
        }

        return updatedEntry;
      });
    }
  }

  // Return the updated object
  return updatedObj1;
};
// group by index name in positions
function groupByCategory(input: any) {
  if (input == undefined || input == null) {
    return;
  }
  const output: any = [];

  Object.entries(input).forEach(([key, value]) => {
    const { index_name }: any = value;

    if (!output[index_name]) {
      output[index_name] = {};
    }

    output[index_name][key] = value;
  });

  return output;
}
// get group name from positions

function extractKeywords(data: Record<string, any>): string[] {
  return Object.keys(data);
}
// payload data formate set in positions(here net price set as ltp)
const PositiontransformData = (data: { [key: string]: any }, lotSize: any) => {
  const transformedData: { [key: string]: any } = {};

  Object.entries(data).forEach(([key, item]) => {
    transformedData[key] = {
      button_type: item.transaction_type == "LONG" ? "BUY" : "SELL",
      identifier: item.identifier,
      symbol: item.symbol,
      strike_price: item.strike_price,
      token: item.token,
      lot_size: item.lot_size ?? lotSize,
      option_type: item.option_type,
      index_name: item.index_name,
      exchange: item.exchange,
      expiry: item.expiry,
      ltp: item.avg_net_price,
      transaction_type: item.transaction_type, // Adding fixed value
      // Adding fixed value
      lots: item.lots
        ? Math.abs(item.lots)
        : Math.abs(Math.round(item.quantity / lotSize)),
      // Adding original lots value
      ivValue: config.defaultIvValue,
      product: item?.product,
    };
  });

  return transformedData;
};
// future data formate as payload
const FutPayloadTransformData = (data: { [key: string]: any }) => {
  const transformedData: { [key: string]: any } = {};

  Object.entries(data).forEach(([key, item]) => {
    transformedData[key] = {
      identifier: item.identifier,
      symbol: item.symbol,
      strike_price: item.strike_price,
      token: item.token,
      lot_size: item.lot_size,
      option_type: item.option_type,
      index_name: item.index_name,
      exchange: item.exchange,
      expiry: item.expiry,
      ltp: item.ltp,
      transaction_type: item.transaction_type, // Adding fixed value
      // Adding fixed value
      lots: item.lots, // Adding original lots value
      target_ltp: item.target_ltp,
    };
  });

  return transformedData;
};
// total pnl calc in positions
const calculateTotalPnl = (data: { [key: string]: any }) => {
  return Object.values(data).reduce((total, item) => total + item.pnl, 0);
};

// expiry wise optchain data transform for 30 sec data update
function ExpiryTransformData(input: any) {
  const transformed: any = {};

  // Iterate over each date in the input object
  Object.keys(input).forEach((dateKey) => {
    const strikePriceObj = input[dateKey];

    // Iterate over each strike price in the nested object
    Object.keys(strikePriceObj).forEach((strikePriceKey) => {
      const dataArray = strikePriceObj[strikePriceKey];

      // Iterate through each object in the dataArray
      dataArray.forEach((data: any) => {
        const newKey = `${strikePriceKey}#${data.option_type}#${data.expiry}`;
        transformed[newKey] = data; // Add the object to the transformed result
      });
    });
  });

  return transformed;
}

// expiry wise future data transform for 30 sec data update
const expiryFutTransformData = (data: any) => {
  const transformedData: any = {};

  Object.keys(data).forEach((key) => {
    const item = data[key];

    const newKey = `${item.symbol}#${item.option_type}#${item.expiry}`;

    transformedData[newKey] = {
      identifier: item.identifier,
      symbol: item.symbol,
      strike_price: item.strike_price,
      token: item.token,
      lot_size: item.lot_size, // You can change this value based on the lot size you need
      option_type: item.option_type,
      exchange: item.exchange,
      expiry: item.expiry,
      ltp: item.ltp,
      transaction_type: item.transaction_type,
      lots: 1,
      target_ltp: item.ltp,
      checked: item.checked,
    };
  });

  return transformedData;
};
// update buy data 1st in newstrategytable
function manageOrders(ordersObj: any, websocketDataRead: any) {
  const longs: any = {}; // To hold all LONG/BUY orders
  const shorts: any = {}; // To hold all SHORT orders

  for (const key in ordersObj) {
    const order = { ...ordersObj[key] };

    if (websocketDataRead && websocketDataRead[order?.identifier]) {
      order.ltp = websocketDataRead[order?.identifier];
      order.target_ltp = websocketDataRead[order?.identifier];
    }

    if (
      order?.transaction_type === "LONG" ||
      order?.transaction_type === "BUY"
    ) {
      longs[key] = order;
    } else if (order?.transaction_type === "SHORT") {
      shorts[key] = order;
    }
  }

  return { ...longs, ...shorts };
}

//days gap calc in given dates(for payoffchart payload)
const getDaysBetween = (start: Date, end: Date | null): number | null => {
  if (
    !(start instanceof Date && !isNaN(start.getTime())) ||
    !(end instanceof Date && !isNaN(end.getTime()))
  ) {
    return null; // Return 0 if either date is invalid
  }
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  return Math.ceil((end.getTime() - start.getTime()) / oneDay);
};

function isFirstIndexNameMatching(
  analyzeOrderStock: any,
  currentOptionChain: any
) {
  const analyzeOrderStockFirst: any = Object.values(analyzeOrderStock)[0]; // Get the first entry of Analyzeorderstock
  const currentOptionChainFirst: any =
    currentOptionChain[Object.keys(currentOptionChain)[0]][0]; // Get the first object of currentOptionChain

  return (
    analyzeOrderStockFirst?.index_name === currentOptionChainFirst?.index_name
  );
}
// Function to update optionDatas with new values
function updateOptionDatas(existingData: any, newData: any): any {
  const updatedOptionDatas: any = { ...existingData };

  Object.keys(newData).forEach((identifier: string) => {
    const entry: any = newData[identifier];

    // Exclude entries where option_type is "FUT"
    if (entry.option_type === "FUT") {
      return;
    }

    if (
      updatedOptionDatas[identifier] &&
      (updatedOptionDatas[identifier].lots !== entry.lots ||
        updatedOptionDatas[identifier].transaction_type !==
          entry.transaction_type)
    ) {
      // Update existing data
      updatedOptionDatas[identifier] = {
        ...updatedOptionDatas[identifier],
        lots: entry.lots,
        transaction_type: entry.transaction_type,
        ivValue: entry.ivValue,
      };
    } else if (!updatedOptionDatas[identifier]) {
      // Add new identifier if it doesn't exist
      updatedOptionDatas[identifier] = entry;
    }
  });

  return updatedOptionDatas;
}

// Function to filter out FUT and expiryValue options
function filterOptionDatas(optionDatas: any, expiryValue: any): any {
  return Object.entries(optionDatas)
    .filter(
      ([key, value]: [string, any]) =>
        value.expiry !== expiryValue && value.option_type !== "FUT"
    )
    .reduce((acc: any, [key, value]: [string, any]) => {
      acc[key] = value;
      return acc;
    }, {});
}

// Function to sort and prepare selected data
function prepareSortedSelectedData(
  optionData: any,
  updatedOptionDatas: any
): any {
  const selected: any = markSelectedBasedPosition(
    optionData,
    updatedOptionDatas
  );

  if (Object.keys(selected).length > 0) {
    const sortedEntries = Object.entries(selected).sort(([keyA], [keyB]) =>
      keyA.localeCompare(keyB)
    );
    return sortedEntries.length > 0 ? Object.fromEntries(sortedEntries) : null;
  } else {
    console.warn("Selected is empty, not updating state.");
    return null;
  }
}

const transformDataForPeriodic = (positions: any) => {
  const result: any = {};

  positions &&
    Object?.values(positions)?.forEach((position: any) => {
      const { strike_price, option_type, expiry, ...rest } = position;
      const key = `${strike_price}.0#${option_type}#${expiry}`;
      result[key] = { ...position };
    });

  return result;
};

const findValuesByCategory = (
  category: string,
  positionGroup: any
): Record<string, any> | null => {
  return positionGroup?.[category] || null;
};

const ATMCalculation = (
  currentExpiryOptionChainData: any,
  webSocketDataRead: any,
  indexObjData: any
) => {
  if (
    currentExpiryOptionChainData &&
    Object.keys(currentExpiryOptionChainData).length > 0
  ) {
    const spotPrice = Number(webSocketDataRead[indexObjData?.identifier]);
    const strikePrices = Object.keys(currentExpiryOptionChainData).map(Number);
    const differences = strikePrices.map((strike) =>
      Math.abs(spotPrice - strike)
    );
    const minDiffIndex = differences.indexOf(Math.min(...differences));
    const atmData = strikePrices[minDiffIndex];
    return atmData;
  }
};
function normalizeKey(key: string): string {
  // remove trailing "#positions" if present
  return key.replace(/#positions.*$/, "");
}

function mergePositionsAndStrategy(positions: any, strategy: any) {
  const merged: any = {};
  const normalizedPositions: any = {};

  // normalize positions keys (remove #positions suffix)
  for (const key in positions) {
    const cleanKey = normalizeKey(key);
    normalizedPositions[cleanKey] = positions[key];
  }

  // merge both datasets
  const allKeys = new Set([
    ...Object.keys(normalizedPositions),
    ...Object.keys(strategy),
  ]);

  for (const key of Array.from(allKeys)) {
    const pos = normalizedPositions[key];
    const strat = strategy[key];

    if (!pos) {
      merged[key] = strat;
      continue;
    }
    if (!strat) {
      merged[key] = pos;
      continue;
    }

    // Both exist for same instrument
    if (pos?.transaction_type === strat?.transaction_type) {
      // same direction → sum lots
      merged[key] = {
        ...strat,
        lots: pos?.lots + strat?.lots,
      };
    } else {
      // opposite direction → offset
      const diff = strat?.lots - pos?.lots;

      if (diff === 0) {
        // skip sending to margin API
        continue;
      }

      merged[key] = {
        ...strat,
        lots: Math.abs(diff),
        transaction_type:
          diff > 0 ? strat?.transaction_type : pos?.transaction_type,
      };
    }
  }

  return merged;
}

export {
  transformData,
  mergeOptionsPositions,
  markSelectedBasedPosition,
  addSelectedFlagAndTransactionType,
  groupByCategory,
  extractKeywords,
  PositiontransformData,
  calculateTotalPnl,
  ExpiryTransformData,
  FutPayloadTransformData,
  expiryFutTransformData,
  manageOrders,
  getDaysBetween,
  isFirstIndexNameMatching,
  updateOptionDatas,
  filterOptionDatas,
  prepareSortedSelectedData,
  transformDataForPeriodic,
  findValuesByCategory,
  ATMCalculation,
  mergePositionsAndStrategy,
};
