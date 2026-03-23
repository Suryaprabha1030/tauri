import { Strategy, DataOption, CEOption } from "../api/base";
import { StrategyBuilderData } from "../types";

export const defaultStrategyBuilderData: StrategyBuilderData = {
  lots: 1,
  position: {
    label: "ATM",
    value: 0,
  },
  optionType: "CE",
  buy: true,
};

export const getCreateStrategyData = (strategy: Strategy) => {
  const finalObject = [] as StrategyBuilderData[];

  (Object.keys(strategy) as Array<keyof typeof strategy>).forEach(
    (strategyType: keyof Strategy) => {
      (Object.keys(strategy[strategyType]) as Array<keyof DataOption>).forEach(
        (optionType) => {
          strategy[strategyType][optionType].forEach((strategyData: any) => {
            const strategyBuilderData: StrategyBuilderData = {
              lots: strategyData.lots,
              position: {
                label: strategyData.position_str,
                value: strategyData.position,
              },
              optionType: optionType,
              buy: strategyType == "LONG" ? true : false,
            };
            finalObject.push(strategyBuilderData);
          });
        }
      );
    }
  );
  if (finalObject.length === 0) return [defaultStrategyBuilderData];
  return finalObject;
};

// export const convertStrategyBuilderDataToStrategy = (
//   strategyBuilderData: StrategyBuilderData[]
// ) => {
//   const strategy: Strategy = {
//     LONG: {
//       CE: [],
//       PE: [],
//     },
//     SHORT: {
//       CE: [],
//       PE: [],
//     },
//   } as Strategy;
//   strategyBuilderData.forEach((item) => {
//     const strategyData: CEOption = {
//       lots: item.lots,
//       position_str: item.position.label,
//       position: item.position.value,
//       option_type: item.optionType,
//     };
//     if (item.buy) {
//       strategy.LONG[item.optionType].push(strategyData);
//     } else {
//       // Short
//       strategy.SHORT[item.optionType].push(strategyData);
//     }
//   });
//   return strategy;
// };

export const consolidateStrategyBuilderData = (
  strategyBuilderData: StrategyBuilderData[]
) => {
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
  // construct Strategy data map
  // "LONG#CE#-5": 10

  let strategyDataMap = {} as any;

  strategyBuilderData.forEach((item) => {
    const key = `${item.buy ? "LONG" : "SHORT"}#${item.optionType}#${
      item.position.value
    }`;
    strategyDataMap[key] = strategyDataMap[key]
      ? strategyDataMap[key] + item.lots
      : item.lots;
  });

  for (const [key, value] of Object.entries(strategyDataMap)) {
    // construct CEOption

    const [strategyType, optionType, position] = key.split("#");
    const strategyData: CEOption = {
      lots: value,
      position_str: `ATM ${position}`,
      position: parseInt(position),
      option_type: optionType,
    };
    if (strategyType === "LONG") {
      strategy.LONG[optionType].push(strategyData);
    }
    if (strategyType === "SHORT") {
      strategy.SHORT[optionType].push(strategyData);
    }
  }
  return strategy;
};

export const consolidateSimulatorData = (optionChain: Record<string, any>) => {
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
  //       "strategy_type": "LONG"

  //   }
  // }

  Object.entries(optionChain).map(([key, value]) => {
    const [strikePrice, optionType] = key.split("#");

    const strategyData = {
      lots: value.lots,
      symbol: value.symbol,
      strike_price: parseInt(strikePrice),
      option_type: optionType,
    };

    if (value.strategy_type === "LONG") {
      strategy.LONG[optionType].push(strategyData);
    }
    if (value.strategy_type === "SHORT") {
      strategy.SHORT[optionType].push(strategyData);
    }
  });
  return strategy;
};

export const combineOptionChainAndStrategyData = (
  strategyData: Strategy,
  optionChain: Record<string, any>,

) => {
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

  // convert StrategyData to map
  // "LONG#CE#18000": {
  //     "lots": 1,
  //       "symbol": "BANKNIFTY21JUL18000CE",
  //       "strike_price": 18000,
  //       "option_type": "CE"
  //       "strategy_type": "LONG"
  //   }

  let strategyDataMap = {} as Record<string, any>;

  (Object.keys(strategyData) as Array<keyof typeof strategyData>).forEach(
    (strategyType: keyof Strategy) => {
      (
        Object.keys(strategyData[strategyType]) as Array<keyof DataOption>
      ).forEach((optionType) => {
        strategyData[strategyType][optionType].forEach((strategyData: any) => {
          const key = `${strategyType}#${optionType}#${strategyData.strike_price}`;
          strategyDataMap[key] = strategyData;
        });
      });
    }
  );

  // combine strategyDataMap and optionChain
  // "LONG#CE#18000": { ...optionChain, ...strategyDataMap }

  Object.entries(optionChain).map(([key, value]) => {
    const [strikePrice, optionType] = key.split("#");

    const strategyData = {
      lots: value.lots,
      symbol: value.symbol,
      strike_price: parseInt(strikePrice),
      option_type: optionType,
    };

    const strategyMapKey = `${value.strategy_type}#${optionType}#${strikePrice}`;

    // if key exists increase lot and average entry price

    strategyDataMap[strategyMapKey] = strategyData;
  });

  // convert strategyDataMap to strategy
  Object.entries(strategyDataMap).map(([key, value]) => {
    const [strategyType, optionType, strikePrice] = key.split("#");

    const strategyData = {
      lots: value.lots,
      symbol: value.symbol,
      strike_price: parseInt(strikePrice),
      option_type: optionType,
    };

    if (strategyType === "LONG") {
      strategy.LONG[optionType].push(strategyData);
    }
    if (strategyType === "SHORT") {
      strategy.SHORT[optionType].push(strategyData);
    }
  });

  return strategy;
};

export const constructNewSymbolData = (
  optionChain: Record<string, any>,
  preloadedOptionChain: Record<string, any>
) => {
  const symbolData = {} as Record<string, any>;
  // symbol#transaction_Type: {
  //   "lots": value.lots,
  //   "entry_price": value.close, (close)
  //   "transaction_type": LONG/SHORT
  //   "option_type": optionType,
  //   "strike_price": parseInt(strikePrice),
  // }

  // construct a map of preloadedOptionChain
  // "BANKNIFTY21JUL18000CE#LONG#CE": {
  //   "lots": 1,
  //   "entry_price": 100,
  //   "transaction_type": "LONG",
  //   "option_type": "CE",
  //   "strike_price": 18000,
  // }

  console.log("preloadedOptionChain", preloadedOptionChain);
  console.log("optionChain", optionChain);

  let preloadedOptionChainMap = constructPreloadedOptionChainMap(
    preloadedOptionChain.option_chain_data
  );

  console.log("preloadedOptionChainMap", preloadedOptionChainMap);

  // subctract option chain lots from PreloadedOptionChainMap lots
  Object.keys(optionChain).forEach((key) => {
    if (
      preloadedOptionChainMap[key] &&
      preloadedOptionChainMap[key].strategy_type ===
        optionChain[key].strategy_type
    )
      optionChain[key].lots -= preloadedOptionChainMap[key].lots;
  });

  Object.entries(optionChain).map(([key, value]) => {
    const [strikePrice, optionType] = key.split("#");
    symbolData[`${value.symbol}#${value.strategy_type}#${optionType}`] = {
      lots: value.lots,
      entry_price: value.close,
      option_type: optionType,
      transaction_type: value.strategy_type,
      strike_price: parseInt(strikePrice),
    };
  });

  console.log("symbolData", symbolData);

  return symbolData;
};

const constructPreloadedOptionChainMap = (optionChain: Record<string, any>) => {
  const temp = {} as any;
  if (!optionChain) return temp;
  Object.entries(optionChain).forEach(([key, value]: [string, any]) => {
    value.forEach((element: any) => {
      if (element.is_selected && element.option_type === "CE") {
        element["strategy_type"] = element.transaction_type;
        temp[`${key}#CE`] = element;
      }
      if (element.is_selected && element.option_type === "PE") {
        element["strategy_type"] = element.transaction_type;
        temp[`${key}#PE`] = element;
      }
    });
  });

  return temp;
};
export interface DateTimeInput {
  date: string;
  time: string;
}
