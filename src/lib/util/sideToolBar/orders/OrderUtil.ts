// sortUtils.ts

import config from "@/lib/config";


// Function for alphabetical sorting
export const alphabeticalSort = (
  data: any[],
  key: string,
  direction: "ascending" | "descending"
) => {
  return [...data].sort((a, b) => {
    const aValue = a[key]?.toLowerCase();
    const bValue = b[key]?.toLowerCase();

    if (aValue < bValue) return direction === "ascending" ? -1 : 1;
    if (aValue > bValue) return direction === "ascending" ? 1 : -1;
    return 0;
  });
};

// Function for numerical sorting
export const numericalSort = (
  data: any[],
  key: string,
  direction: "ascending" | "descending"
) => {
  return [...data].sort((a, b) => {
    const getValue = (item: any) => {
      if (Array.isArray(item[key])) {
        return item[key][0];
      } else if (item[key] && typeof item[key] === "object") {
        return Object.values(item[key])[0];
      } else {
        return item[key];
      }
    };

    const aValue = getValue(a);
    const bValue = getValue(b);

    const aValid =
      aValue !== undefined && aValue !== null
        ? Number(aValue)
        : Number.NEGATIVE_INFINITY;
    const bValid =
      bValue !== undefined && bValue !== null
        ? Number(bValue)
        : Number.NEGATIVE_INFINITY;

    if (aValid < bValid) return direction === "ascending" ? -1 : 1;
    if (aValid > bValid) return direction === "ascending" ? 1 : -1;
    return 0;
  });
};

export const PlaceOrderStock = (stock: any) => {
  // Helper function to map individual stock object
  const mapStock = (stock: any) => ({
    product: stock?.product || stock?.product_type || "MIS",
    variety: "REGULAR",
    validity: "DAY",
    identifier: stock.identifier || "",
    order_type: stock.order_type || "MARKET",
    lots: stock.lots || 0,
    ltp: stock.ltp || 0,
    lot_size: stock.lot_size || 0,
    transaction_type: stock.transaction_type || "LONG",
    tag: stock.tag || "",
    disclosed_qty: stock.disclosed_qty || 0,
    quantity: stock.quantity || 0,
  });

  // Check if the input is an array
  if (Array.isArray(stock)) {
    // If it's an array, map over it and apply the transformation to each item
    return stock.map((item) => mapStock(item));
  } else {
    // If it's a single object, apply the transformation directly
    return mapStock(stock);
  }
};

export const ModifyOrderData = (editedOrder: any) => {
  return {
    order_id: editedOrder?.order_id,
    product: editedOrder?.product,
    variety: "REGULAR",
    validity: "DAY",
    identifier: editedOrder?.identifier,
    order_type: editedOrder?.order_type,
    lots: editedOrder?.lots, // Number of lots
    ltp: editedOrder?.price || 0,
    lot_size: editedOrder?.lot_size || 1,
    quantity: editedOrder?.quantity,
    transaction_type:
      editedOrder?.transaction_type == "BUY" ||
      editedOrder?.transaction_type == "LONG"
        ? "LONG"
        : "SHORT", // Default to "LONG"
    tag: "zoonest_order", // Static tag as per your example
    disclosed_qty: editedOrder?.disclosed_qty || 0, // Default to 0 if disclosed_qty is not provided
  };
};

export const parseSymbol = (symbol: string): string => {
  const match = symbol.match(/([A-Z]+)(\d{2}[A-Z]{3}\d{2})([A-Z]+)/);

  if (!match) {
    throw new Error("Invalid symbol format");
  }

  const [_, indexName, expiryDate, strikePrice, optionType] = match;

  return `${indexName} `;
};

export const CalculateOrderMarginData = (data: any) => {
  const arrayData = data.map((item: any) => ({
    exchange: item.exchange,
    lot_size: item.lot_size || 0,
    lots: item.lots || 0,
    token: item.token,
    broker_token: item.token,
    broker_symbol: item.symbol,
    product_type: item.product,
    transaction_type: item.transaction_type,
    identifier: item.identifier,
    broker_identifier: item.broker_identifier
      ? item.broker_identifier
      : item.identifier,
    ltp: item.ltp,
    order_type: item.order_type,
  }));
  return arrayData;
};

export const extractDetails = (symbol: any) => {
  let expiry: any = null;
  let option_type: any = null;

  if (symbol.includes("FUT")) {
    // Futures
    const match = symbol.match(/(\d{2}[A-Z]{3}\d{2})FUT/);
    if (match) {
      expiry = match[1]; // Extract expiry date for Futures
      option_type = "FUT";
    }
  } else if (symbol.includes("CE") || symbol.includes("PE")) {
    // Options
    const match = symbol.match(/(\d{2}[A-Z]{3}\d{2})\s\d+\s(CE|PE)/);
    if (match) {
      expiry = match[1]; // Extract expiry date for Options
      option_type = match[2]; // Extract option type (CE or PE)
    }
  }

  return { expiry, option_type };
};

export const extractIndexName = (symbol: any) => {
  const match = symbol.match(/^[A-Z]+/); // Match only the leading alphabets
  return match ? match[0] : null; // Return the matched index name or null if not found
};

export const containsSameIndexWithCEorPE = (StockData: any) => {
  const supportIndices = config.supportIndices;

  if (!Array.isArray(StockData) || StockData.length === 0) {
    return false;
  }

  if (StockData.length === 1) {
    const { index_name, option_type } = StockData[0];
    if (
      index_name &&
      supportIndices.includes(index_name) &&
      (option_type === "CE" || option_type === "PE")
    ) {
      return true;
    }
    return false;
  }

  const indexNames = new Map<string, boolean>();

  for (const stock of StockData) {
    const { index_name, option_type } = stock;

    if (
      !index_name ||
      !supportIndices.includes(index_name) ||
      (option_type !== "CE" && option_type !== "PE")
    ) {
      return false;
    }

    if (indexNames.has(index_name)) {
      indexNames.set(index_name, true);
    } else {
      indexNames.set(index_name, false);
    }
  }

  if (indexNames.size > 1) {
    return false;
  }

  const validEntries = Array.from(indexNames.values()).filter((value) => value);
  return validEntries.length > 0;
};

export const AnalyzeOrderObject = (inputArray: any) => {
  return inputArray.reduce((acc: any, item: any) => {
    // Use expiry_date if available, otherwise fall back to expiry
    const expiry = item.expiry_date || item.expiry;

    const key = `${item.strike_price.toFixed(1)}#${item.option_type}#${expiry}`;
    const exchange = item.identifier.slice(0, 3);

    acc[key] = {
      identifier: item.identifier,
      symbol: item.display_symbol_name,
      strike_price: item.strike_price,
      lot_size: item.lot_size,
      option_type: item.option_type,
      index_name: item.index_name,
      exchange: exchange,
      expiry: expiry,
      ltp: item.ltp,
      token: "",
      transaction_type: item.transaction_type === "LONG" ? "LONG" : "SHORT",
      button_type: item.transaction_type,
      target_ltp: item.ltp,
      lots: item.lots,
      ivValue: item?.ivValue,
    };

    return acc; // Ensure you return the accumulator here
  }, {}); // Return the result of the reduce function
};
