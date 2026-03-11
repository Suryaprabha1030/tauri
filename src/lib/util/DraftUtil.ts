import config from "../config";
import { updateSymbolData } from "../redux/slices/StrategySlice";

export const formatNumber = (number: any): string => {
  const parsedNumber = Number(number); // Safely parse the input to a number

  if (isNaN(parsedNumber)) {
    return "0"; // Return '0' for invalid numbers
  }

  const absoluteNumber = Math.abs(parsedNumber); // Work with the absolute value for formatting

  if (absoluteNumber >= 1e7) {
    return `${(parsedNumber / 1e7).toFixed(2).replace(/\.?0+$/, "")}Cr`;
  } else if (absoluteNumber >= 1e5) {
    return `${(parsedNumber / 1e5).toFixed(2).replace(/\.?0+$/, "")}L`; // Lakh
  } else {
    return parsedNumber?.toFixed(2); // Less than a Lakh
  }
};

export const tableHighLowComparison = (current: any, prev: any) => {
  let status: any;
  status = current > prev ? true : false
  if(prev === null) status = null
  return status
}

type InputItem = {
  identifier: string;
  index_name: string;
  display_symbol_name: string;
  expiry_date: string;
  option_type: string;
  lots: number;
  avg_price: number;
  lot_size: number;
  strike_price: number;
  ltp: number;
  is_exited: boolean;
  transaction_type: "LONG" | "SHORT";
  instrument_type: "options";
  ivValue: number;
};

type InputObject = { [key: string]: InputItem };

type OutputItem = {
  identifier: string;
  symbol: string;
  strike_price: number;
  token: string; // Assuming `token` is not present in the input and needs to be generated or set.
  lot_size: number;
  option_type: string;
  index_name: string;
  exchange: string; // Assuming exchange is "NFO" as a default value.
  expiry: string;
  ltp: number;
  position: number; // Assuming `position` is an incremented value.
  transaction_type: "LONG" | "SHORT";
  button_type: "LONG" | "SHORT";
  target_ltp: number;
  lots: number;
  checked: boolean;
};

type OutputStructure = {
  LONG: { CE: OutputItem[]; PE: OutputItem[]; FUT: OutputItem[] };
  SHORT: { CE: OutputItem[]; PE: OutputItem[]; FUT: OutputItem[] };
};

export const transformToDesiredStructure = (
  input: InputObject,
  indexname: any
): OutputStructure => {
  const output: OutputStructure = {
    LONG: { CE: [], PE: [], FUT: [] },
    SHORT: { CE: [], PE: [], FUT: [] },
  };

  Object.values(input).forEach((item) => {
    const transactionType = item.transaction_type === "LONG" ? "LONG" : "SHORT";
    const section: any = output[transactionType];
    const type = item.option_type;

    if (section && section[type]) {
      const entry = {
        identifier: item.identifier,
        symbol: item.display_symbol_name,
        strike_price: item.strike_price,
        token: "", // Placeholder for `token` if unavailable in input
        lot_size: item.lot_size,
        option_type: item.option_type,
        index_name: item.index_name || indexname,
        exchange: "NFO", // Default value
        expiry: item.expiry_date,
        ltp: item.ltp,
        transaction_type: transactionType,
        button_type: item.transaction_type,
        target_ltp: item.ltp,
        lots: item.lots,
        checked: true, // Assuming checked should be true by default
        ivValue: item.ivValue || config.defaultIvValue,
      } as any;

      section[type].push(entry);
    }
  });

  return output;
};
export const normalizeDate = (date: Date) => {
  const normalizedDate = new Date(date); // Copy the original date to avoid mutation
  normalizedDate.setHours(0, 0, 0, 0); // Set time to midnight
  return normalizedDate;
};

export const constructRequestBody = (
  input: any,
  Name: string,
  exited: boolean,
  indexName?: string
) => {
  const data: any = {};
  Object.keys(input).forEach((key) => {
    const item = input[key];
    data[item.identifier] = {
      identifier: item.identifier,
      display_symbol_name: item.symbol,
      index_name: item.index_name || indexName,
      expiry_date: item.expiry,
      is_expired: false,
      option_type: item.option_type,
      lots: item.lots,
      avg_price: item.ltp,
      lot_size: item.lot_size,
      // token: item.token,

      ltp: item.ltp,
      is_exited: false,
      transaction_type: item.transaction_type == "LONG" ? "LONG" : "SHORT",
      instrument_type: item.option_type == "FUT" ? "futures" : "options",
      ...(item.option_type !== "FUT" && { strike_price: item.strike_price }),
    };
  });
  return {
    name: Name,
    index_name: indexName,
    data,
    is_all_exited: exited,
    ...(indexName && { index_name: indexName }),
  };
};

export const modifiedconstructRequestBody = (
  input: any,
  Name: string,
  exited: boolean,
  indexName: string
) => {
  const data: any = {};
  Object.keys(input).forEach((key) => {
    const item = input[key];
    data[item.identifier] = {
      identifier: item.identifier,
      display_symbol_name: item.symbol,
      index_name: item.index_name || indexName,
      expiry_date: item.expiry,
      is_expired: false,
      option_type: item.option_type,
      lots: item.lots,
      avg_price: item.ltp,
      lot_size: item.lot_size,
      // token: item.token,

      ltp: item.ltp,
      is_exited: false,
      transaction_type: item.transaction_type == "LONG" ? "LONG" : "SHORT",
      instrument_type: item.option_type == "FUT" ? "futures" : "options",
      ...(item.option_type !== "FUT" && { strike_price: item.strike_price }),
    };
  });
  return {
    name: Name,
    data,
    is_all_exited: exited,
  };
};

export const CalculatePnl = (
  ltp: number,
  avg_price: number,
  transaction_type: string
) => {
  let pnl = 0;

  if (transaction_type == "LONG" || transaction_type == "BUY") {
    pnl = ltp - avg_price;
  } else if (transaction_type == "SHORT" || transaction_type == "SELL") {
    pnl = avg_price - ltp;
  }
  return pnl;
};

export const transformedSandBoxObject = (inputArray: any) => {
  return inputArray.reduce((acc: any, item: any) => {
    const key =
      item.option_type === "FUT"
        ? `${item.display_symbol_name}#${item.option_type}#${item.expiry_date}`
        : `${item.strike_price.toFixed(1)}#${item.option_type}#${
            item.expiry_date
          }`;
    const exchange = item.identifier.slice(0, 3);
    acc[key] = {
      identifier: item.identifier,
      symbol: item.display_symbol_name,
      strike_price: item.strike_price,
      lot_size: item.lot_size,
      option_type: item.option_type,
      index_name: item.index_name,
      exchange: exchange,
      expiry: item.expiry_date,
      ltp: item.ltp,
      token: "",
      transaction_type: item.transaction_type === "LONG" ? "LONG" : "SHORT",
      button_type: item.transaction_type,
      target_ltp: item.ltp,
      lots: item.lots,
    };

    return acc; // Ensure you return the accumulator here
  }, {}); // Return the result of the reduce function
};

interface Option {
  identifier: string;
  ltp: number;
}
interface Strike {
  [key: string]: Option[];
}
interface Expiry {
  [key: string]: Strike;
}
interface Index {
  [key: string]: Expiry;
}
interface Data {
  [key: string]: Index;
}
export const processAndDispatchLtpData = (data: Data, dispatch: any) => {
  //function to store the liveLTP data from the optionchain data stored in redux
  data &&
    Object.values(data).forEach((index) => {
      index &&
        Object.values(index).forEach((expiry) => {
          expiry &&
            Object.values(expiry).forEach((strike) => {
              if (Array.isArray(strike)) {
                strike.forEach((option) => {});
              }
            });
        });
    });
};

export const updateReduxWithFutureData = (FutureData: any[], dispatch: any) => {
  FutureData?.forEach((option) => {
    dispatch(
      updateSymbolData({
        symbol: option.identifier, // Unique identifier for the symbol
        price: option.ltp, // Latest price
      })
    );
  });
};
