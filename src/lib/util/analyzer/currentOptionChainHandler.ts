import { getOIRadioHashKey } from "@/components/shared/ChartLayout/oiComponent/OIUtil";
import {
  determineMarketAction,
  determineMarketActionIcon,
  getBuyClassLive,
  getCloseSymbol,
  getCloseValue,
  getCloseValuePercentage,
  getHashKey,
  getSellClassLive,
  LivegetOptionChainForOptionType,
  oiChangePercFromData,
} from "@/components/shared/ChartLayout/optionFutures/optionFuturesUtil/strategyUtil";
import classNames from "classnames";

export const currentOptionChainHandler = (
  key: string,
  value: any,
  expiryDateRef: any,
  optionDatas: any,
  expandTable: any,
  oiChangePerc: any,
  websocketDataRead: any,
  netChangePercentage: any
) => {
  const closeCE = getCloseValue(value, "CE", websocketDataRead);
  const closePE = getCloseValue(value, "PE", websocketDataRead);
  const closeSymbol = getCloseSymbol(value, "CE", websocketDataRead);
  const closeSymbolPE = getCloseSymbol(value, "PE", websocketDataRead);

  const closeCEPercentage: any = getCloseValuePercentage(
    value,
    "CE",
    netChangePercentage
  );

  const closePEPercentage = getCloseValuePercentage(
    value,
    "PE",
    netChangePercentage
  );

  const hash = getHashKey(key, "CE", expiryDateRef.current.value);
  const hashPE = getHashKey(key, "PE", expiryDateRef.current.value);

  const buyCEButtonKey = `${hash}#B`;
  const sellCEButtonKey = `${hash}#S`;
  const buyPEButtonKey = `${hashPE}#B`;
  const sellPEButtonKey = `${hashPE}#S`;

  const combinedSellClassNamesCE = classNames(
    getSellClassLive(optionDatas, hash)
  );
  const combinedSellClassNamesPE = classNames(
    getSellClassLive(optionDatas, hashPE)
  );

  const combinedBuyClassNamesCE = classNames(
    getBuyClassLive(optionDatas, hash)
  );
  const combinedBuyClassNamesPE = classNames(
    getBuyClassLive(optionDatas, hashPE)
  );

  const updatedOptionChainForCE = {
    ...LivegetOptionChainForOptionType(value, "CE"), // Keep all other fields
    ltp: closeCE, // Replace only the ltp field with closeCE
  };
  const updatedOptionChainForPE = {
    ...LivegetOptionChainForOptionType(value, "PE"), // Keep all other fields
    ltp: closePE, // Replace only the ltp field with closePE
  };
  const LiveselectedDataForCE = optionDatas[hash];

  const LiveselectedDataForPE = optionDatas[hashPE];
  const icon = determineMarketAction(
    oiChangePerc[`${key}#CE`],
    parseFloat(closeCEPercentage),
    "CE",
    expandTable
  );
  const iconPE = determineMarketAction(
    oiChangePerc[`${key}#PE`],
    parseFloat(closePEPercentage),
    "PE",
    expandTable
  );

  return {
    closeCE,
    closePE,

    LiveselectedDataForPE,
    LiveselectedDataForCE,
    updatedOptionChainForCE,
    updatedOptionChainForPE,
    combinedBuyClassNamesPE,
    combinedBuyClassNamesCE,
    closeCEPercentage,
    closePEPercentage,
    buyCEButtonKey,
    sellCEButtonKey,
    sellPEButtonKey,
    buyPEButtonKey,
    combinedSellClassNamesCE,
    combinedSellClassNamesPE,
    hashPE,
    hash,
    icon,
    closeSymbolPE,
    closeSymbol,
    iconPE,
  };
};
