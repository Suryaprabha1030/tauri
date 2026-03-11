import { OptionChainParsedResult, Strategy } from "@/lib/api/base";

// class name for CE close value
const getCEClass = (optionChain: OptionChainParsedResult, key: string) => {
  return optionChain.spot_price_round_off > parseInt(key)
    ? "w-1/5 bg-blue-50 px-6 py-4"
    : "w-1/5 px-6 py-4";
};

// class name for PE close value
const getPEClass = (optionChain: OptionChainParsedResult, key: string) => {
  return optionChain.spot_price_round_off < parseInt(key)
    ? "w-1/5 bg-blue-50 px-6 py-4"
    : "w-1/5 px-6 py-4";
};

// class name for strikePrice value
const getSymbolClass = (optionChain: OptionChainParsedResult, key: string) => {
  return optionChain.spot_price_round_off === parseInt(key)
    ? "text-medium w-1/5 bg-green-50 px-6 py-4 font-bold"
    : "text-medium w-1/5 bg-yellow-50 px-6 py-4";
};


const getBuyClass = (selected: Record<string, any>, hashKey: string) => {
  console.log(selected,"data")
  if (selected[hashKey] && selected[hashKey].transaction_type === "LONG") {
    return "border px-1 bg-green-500 text-white";
  }
  return "border px-1";
};

const getSellClass = (selected: Record<string, any>, hashKey: string) => {
  if (selected[hashKey] && selected[hashKey].transaction_type === "SHORT") {
    return "border px-1 bg-red-500 text-white";
  }
  return "border px-1";
};

const getCloseValue = (value: any, optionType: string) => {
  let result = "";
  value.forEach((element: any) => {
    if (element.option_type === optionType) {
      result = element.close;
    }
  });
  return result;
};



const scrollToMiddle = (optionChain: OptionChainParsedResult) => {
  const section = document.querySelector(
    "#result_" + optionChain.spot_price_round_off
  );
  section?.scrollIntoView({
    behavior: "smooth",
    block: "center",
    inline: "center",
  });
};

const getHashKey = (key: string, optionType: string) => {
  return `${key}#${optionType}`;
};

const getOptionChainForOptionType = (value: any, optionType: string) => {
  let result = {};
  console.log(value,optionType,"update")
  value.forEach((element: any) => {
    if (element.option_type === optionType) {
      console.log(element.option_type,"update")
      result = element;
    }
  });

  return result;
  
};


const buildSelectedOptionChain = (option_chain_data: any) => {
  let temp: Record<string, any> = {};
  if (!option_chain_data) {
    return temp;
  }

  Object.entries(option_chain_data).forEach(([key, value]: [string, any]) => {
    value.forEach((element: any) => {
      if (element.is_selected && element.option_type === "CE") {
        temp[getHashKey(key, "CE")] = element;
      }
      if (element.is_selected && element.option_type === "PE") {
        temp[getHashKey(key, "PE")] = element;
      }
    });
  });
  return temp;
};

const getUpdatedDataFromSelection = (selectedData: Record<string, any>) => {
  if (!selectedData) {
    return {};
  }

  const result: Record<string, any> = {};

  Object.entries(selectedData).forEach(([key, value]: [string, any]) => {
    // if value.is_selected is true and value.old_lots is present then it is a new selection
    if (value.is_selected && value.old_lots) {
      result[key] = value;
    }
    // if value.is_selected is not present then its a new selection
    else if (!value.is_selected) {
      result[key] = value;
    }
  });

  return result;
};

const buildStrategyDataFromOptionChain = (optionChain: Record<string, any>) => {
  const strategy: Strategy = {
    LONG: {
      CE: [],
      PE: [],
    },
    SHORT: {
      CE: [],
      PE: [],
    },
  } as Strategy;

  //
  // {
  //   "18000#CE": {
  //     "lots": 1,
  //       "symbol": "BANKNIFTY21JUL18000CE",
  //       "strike_price": 18000,
  //       "option_type": "CE"
  //       "transaction_type": "LONG"

  //   }
  // }

  Object.entries(optionChain).map(([key, value]) => {
    const [strikePrice, optionType] = key.split("#");

    const strategyData = {
      lots: value.lots,
      symbol: value.symbol,
      strike_price: parseInt(strikePrice),
      option_type: value.option_type,
    };

    if (value.transaction_type === "LONG") {
      strategy.LONG[optionType].push(strategyData);
    }
    if (value.transaction_type === "SHORT") {
      strategy.SHORT[optionType].push(strategyData);
    }
  });

  return strategy;
};

const buildAddLegsFromOptionChain = (optionChain: Record<string, any>) => {
  if (!optionChain || Object.keys(optionChain).length === 0) {
    return {};
  }

  const symbolData = {} as Record<string, any>;
  // symbol#transaction_Type: {
  //   "lots": value.lots,
  //   "entry_price": value.close, (close)
  //   "transaction_type": LONG/SHORT
  //   "option_type": optionType,
  //   "strike_price": parseInt(strikePrice),
  // }

  // contents of OptionChain
  // {
  //   "18000#CE": {
  //     "lots": 1,
  //       "symbol": "BANKNIFTY21JUL18000CE",
  //       "strike_price": 18000,
  //       "option_type": "CE"
  //       "transaction_type": "LONG"
  //   }

  Object.entries(optionChain).map(([key, value]) => {
    const [strikePrice, optionType] = key.split("#");
    symbolData[`${value.symbol}#${value.transaction_type}#${optionType}`] = {
      lots: value.is_selected ? value.lots - value.old_lots : value.lots,
      entry_price: value.close,
      option_type: optionType,
      transaction_type: value.transaction_type,
      strike_price: parseInt(strikePrice),
    };
  });

  console.log("symbolData", symbolData);

  return symbolData;
};

export {
  getCEClass,
  getPEClass,
  getSymbolClass,
  getCloseValue,
  scrollToMiddle,
  getHashKey,
  getOptionChainForOptionType,
  getBuyClass,
  getSellClass,
  getUpdatedDataFromSelection,
  buildSelectedOptionChain,
  buildStrategyDataFromOptionChain,
  buildAddLegsFromOptionChain,
  
};
