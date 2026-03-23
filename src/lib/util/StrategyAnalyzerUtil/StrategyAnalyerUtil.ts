import {
  addCartSuccess,
  addSymbol,
  getIndexName,
  getIndexQuery,
  setprimaryRefresh,
  setStock,
} from "@/lib/redux/slices/StrategySlice";
import { Dispatch } from "react";
import { extractIndexName } from "../sideToolBar/orders/OrderUtil";
import {
  setStockData,
  togglePlaceOrderVisibility,
} from "@/lib/redux/slices/PlaceOrder";
import { OptionsStrategyBuilderApi, UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  checkPosition,
  getCheckedPositionData,
  getFutureData,
  optionChainPayload,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";
import { ShowStrategiesPopup } from "@/lib/redux/slices/ChartsSlice"
import { autoLogoutTokenRemove } from "../autoLogoutUtil/autoLogOutUtil";
import config from "@/lib/config";
import { brokerLogoutTokenRemove } from "../autoLogoutUtil/brokerLogOutUtil";
import {
  setStrategyCount,
} from "@/lib/redux/slices/screenerSlice";

export const updateLotsBasedOnMultiplier = (
  strategyName: string,
  apiResponse: any,
  strategyLots: Record<string, number>,
) => {
  //updating lots value of API response with the manually changed lots
  const multiplier = strategyLots[strategyName] || 1;
  // Iterate over the legs and update the lots values
  const updatedResponse = { ...apiResponse };
  Object.keys(updatedResponse).forEach((positionType) => {
    ["CE", "PE"].forEach((optionType) => {
      if (updatedResponse[positionType][optionType]) {
        updatedResponse[positionType][optionType] = updatedResponse[
          positionType
        ][optionType].map((leg: any) => ({
          ...leg,
          lots: leg.lots * multiplier,
        }));
      }
    });
  });

  return updatedResponse;
};

interface HandleSelectChangeProps {
  event: React.ChangeEvent<HTMLSelectElement>;
  dispatch: Dispatch<any>;
  fnoIdentifiers: any[];
  indicesLotSize: any[];
  expiryDate: string;
  webSocketDataRead: { [key: string]: any };
  setSelectedIndex: React.Dispatch<React.SetStateAction<any>>;
}
export const handleSelectChange = ({
  event,
  dispatch,
  fnoIdentifiers,
  indicesLotSize,
  expiryDate,
  webSocketDataRead,
  setSelectedIndex,
}: HandleSelectChangeProps) => {
  setSelectedIndex(event.target.value);
  const selectedValue = event.target.value;

  dispatch(getIndexName({ indexName: selectedValue, expiryDate }));
  dispatch(getIndexQuery({ indexQuery: selectedValue }));

  const selectedItem = fnoIdentifiers
    ? fnoIdentifiers.find((item: any) => item.index_name === selectedValue)
    : indicesLotSize.find((item: any) => item.index_name === selectedValue);

  if (selectedItem) {
    dispatch(
      addCartSuccess({
        items: {
          exchange: "",
          index_name: "",
          spot_price: null,
          expiryDate: "",
        },
      }),
    );
    dispatch(
      setStock({
        stock: {
          exchange: "NSE",
          index_name: selectedItem.index_name,
          spot_price: webSocketDataRead[selectedItem.identifier],
        },
      }),
    );
  }
};

export const toggleRowExpansion = (
  strategy: string,
  setExpandedRow: React.Dispatch<React.SetStateAction<any>>,
) => {
  setExpandedRow((prev: any) => (prev === strategy ? null : strategy));
};

export const handleLotsChange = (
  strategyName: string,
  event: React.ChangeEvent<HTMLSelectElement>,
  setStrategyLots: React.Dispatch<React.SetStateAction<any>>,
  response: any,
) => {
  const selectedLots = parseInt(event.target.value, 10);
  setStrategyLots((prev: any) => ({
    ...prev,
    [strategyName]: selectedLots,
  }));
  response[strategyName].lots = selectedLots;
};

export const handleHedged = (
  sethedgedData: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  sethedgedData((prev: any) => !prev);
};

export const handleExecute = (
  strategyName: any,
  response: any,
  setSelectedStrategy: React.Dispatch<React.SetStateAction<any>>,
  dispatch: Dispatch<any>,
) => {
  const strategy: any = response?.[strategyName];
  const combinedLegs = [
    ...(strategy.legs?.LONG?.CE || []),
    ...(strategy.legs?.LONG?.PE || []),
    ...(strategy.legs?.SHORT?.CE || []),
    ...(strategy.legs?.SHORT?.PE || []),
  ];
  const updatedLegs = combinedLegs.map((leg) => ({
    ...leg,
    lots: strategy.lots ?? leg.lots,
    index_name: extractIndexName(leg.symbol), // Add index_name using extractIndexName
  }));
  setSelectedStrategy(strategyName);
  dispatch(togglePlaceOrderVisibility(true));
  dispatch(setStockData(updatedLegs));
};

export function calculateLegsCount(legs: any): number {
  let count = 0;

  Object.keys(legs).forEach((positionType) => {
    ["CE", "PE"].forEach((optionType) => {
      count += legs[positionType][optionType].length;
    });
  });

  return count;
}

export const handleExpiry = (
  e: React.ChangeEvent<HTMLSelectElement>,
  setExpiry: React.Dispatch<React.SetStateAction<any>>,
) => {
  const currentExpiryvalue = e.target.value;
  setExpiry(currentExpiryvalue);
};

export const fetchLiveExpiry = async (
  payload: any,
  brokerCode: any,
  expiryDateRef: any,
  setLiveExpiryList: React.Dispatch<React.SetStateAction<any>>,
  setExpiry: React.Dispatch<React.SetStateAction<any>>,
  router: any,
) => {
  const supportedIndexNames = config.BSESupportIndices.map((i) => i);
  const isSupportedIndex = supportedIndexNames.includes(payload);
  const exchange = isSupportedIndex ? "BSE" : "NSE";
  const liveExpirydates = new UserBrokerRouterApi(baseConfig());
  try {
    const res =
      await liveExpirydates.getLiveExpiryDatesV1UsersMeBrokersBrokerCodeLiveExpiryDatesPost(
        brokerCode,
        payload,
        exchange,
      );
    if (res.data && expiryDateRef.current && res.data.length > 0) {
      if (isSupportedIndex) {
        //Display only 1st expiry for BSE temporarily
        setLiveExpiryList([res.data[0]]);
      } else {
        setLiveExpiryList(res.data);
      }
      setExpiry(res.data[0]);
    }
  } catch (err: any) {
    if (err?.response && err?.response?.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (err?.response && err?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }
  }
};

export const strategyDirection = (
  response: any,
  setSortedResponse: React.Dispatch<React.SetStateAction<any>>,
) => {
  const strategyOrder = ["bullish", "bearish", "neutral", "directional"];
  const responseArray = Object.entries(response);
  const sortedArray = responseArray.sort(([, valueA], [, valueB]) => {
    const directionA = (valueA as any).strategy_direction.toLowerCase();
    const directionB = (valueB as any).strategy_direction.toLowerCase();

    const indexA = strategyOrder.indexOf(directionA);
    const indexB = strategyOrder.indexOf(directionB);

    return (
      (indexA === -1 ? strategyOrder.length : indexA) -
      (indexB === -1 ? strategyOrder.length : indexB)
    );
  });
  const sortedResponsedata = Object.fromEntries(sortedArray);
  setSortedResponse(sortedResponsedata);
};

export const fetchStrategiesPnl = async (
  brokerCode: any,
  indexname: any,
  price: any,
  lotsize: any,
  expiry: any,
  setResponse: React.Dispatch<React.SetStateAction<any>>,
  setShowData: React.Dispatch<React.SetStateAction<any>>,
  setStatus: React.Dispatch<React.SetStateAction<any>>,
  dispatch: Dispatch<any>,
  router: any,
  setExpiry?: React.Dispatch<React.SetStateAction<any>>,
) => {
  const livestrategy = new UserBrokerRouterApi(baseConfig());
  try {
    const res =
      await livestrategy.getAllStrategiesPnlV1UsersMeBrokersBrokerCodeAllStrategiesPnlIndexNameGet(
        brokerCode,
        indexname,
        price,
        lotsize,
        expiry,
      );
    setResponse(res.data.pnl);
    dispatch(setStrategyCount(res?.data?.pnl));
    if (setExpiry && res.data.expiry_date) {
      setExpiry(res.data.expiry_date);
    } // Check if expiry needs to be set

    if (res?.status === 204) {
      setShowData("error");
    } else {
      setShowData(true);
    }
    setStatus("success");
  } catch (err: any) {
    if (err?.response && err?.response?.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (err?.response && err?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }
    setShowData(false);
    setStatus("error");
  }
};

export const strategyApiDataDetails = (
  strategy: string,
  brokerCode: any,
  path: any,
  strategyLots: any,
  item: any,
  dispatch: Dispatch<any>,
  router: any,
  positionDatas: any,
  futureDatas: any,
  allStrategyData: any,
  isAI?: boolean,
) => {
  if (path === `${config.brokersListUrl}/${brokerCode}/psb`) {
    dispatch(showPnlTable(false));
    dispatch(showPositionTable(false));
    dispatch(showStrategyTable(true));
    dispatch(showDraftPositions(false));
    if (Object.entries(positionDatas).length > 0) {
      dispatch(getCheckedPositionData({ PositionData: {} }));
      dispatch(checkPosition(false));
    }
    if (Object.entries(futureDatas).length > 0) {
      dispatch(getFutureData({ futureData: {} }));
    }
    const responsePayLoad = allStrategyData.find(
      (item: any) => item?.strategy_name === strategy,
    )?.result;

    // Deep clone so it's fully mutable (like API data)
    const mutableResponsePayload = JSON.parse(JSON.stringify(responsePayLoad));
    //  Then apply multiplier logic
    const updatedResponse = updateLotsBasedOnMultiplier(
      strategy,
      mutableResponsePayload,
      strategyLots,
    );

    //  Now use `updatedResponse` everywhere — NOT `responsePayLoad`
    dispatch(
      optionChainPayload({
        optionChainPayloadData: {
          ClickedRow: {},
          response: { responsePayLoad: updatedResponse },
        },
      }),
    );
    dispatch(
      addCartSuccess({
        items: {
          exchange: item.exchange,
          index_name: item.index_name,
          spot_price: item.spot_price,
          expiryDate: item.expiryDate,
        },
      }),
    );
  } else if (!(path === `${config.brokersListUrl}/${brokerCode}/psb`)) {
    const PayloadOPtionChainApi = new OptionsStrategyBuilderApi(baseConfig());

    PayloadOPtionChainApi.getReadyMadeStrategyByNameV1StrategiesByNameStrategyNameGet(
      strategy,
    )
      .then((res: any) => {
        const responsePayLoad = res.data.result;
        const updatedResponse = updateLotsBasedOnMultiplier(
          strategy,
          responsePayLoad,
          strategyLots,
        );

        dispatch(showPositionTable(false));
        dispatch(showStrategyTable(true));
        dispatch(showPnlTable(false));
        dispatch(showDraftPositions(false));
        dispatch(
          addCartSuccess({
            items: {
              exchange: "",
              index_name: "",
              spot_price: null,
              expiryDate: "",
            },
          }),
        );

        dispatch(
          optionChainPayload({
            optionChainPayloadData: {
              ClickedRow: {},
              response: { responsePayLoad },
            },
          }),
        );
        router(`${config.brokersListUrl}/${brokerCode}/psb`);
        dispatch(setprimaryRefresh(false));
        if (!isAI) {
          dispatch(ShowStrategiesPopup(true));
        }
      })
      .catch((err) => {
        if (err?.response && err?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (err?.response && err?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  }
};

export const fetchSymbolData = async (
  payload: any,
  brokerCode: any,
  dispatch: Dispatch<any>,
  router: any,
) => {
  if (!payload) return;
  if (Array.isArray(payload) && payload.length > 0) {
    payload.forEach((id: any) => {
      dispatch(addSymbol({ symbol: id }));
    });
  }
};

export const filterStrategies = (data: any, activeIndicatorFilter: any) => {
  if (!data) return {};
  return Object.fromEntries(
    Object.entries(data).filter(([_, strategyData]) => {
      return (strategyData as any).strategy_direction === activeIndicatorFilter;
    }),
  );
};

export const filterStrategiesUtil = (
  activeIndicatorFilter: any,
  sortedresponse: any,
  hedgeddata: boolean | null,
) => {
  let dataToFilter = hedgeddata
    ? Object.fromEntries(
        Object.entries(sortedresponse).filter(
          ([_, strategyData]) => (strategyData as any).is_hedged,
        ),
      )
    : sortedresponse;

  if (
    activeIndicatorFilter === "Bearish" ||
    activeIndicatorFilter === "Bullish" ||
    activeIndicatorFilter === "Neutral"
  ) {
    return filterStrategies(dataToFilter, activeIndicatorFilter);
  } else {
    return dataToFilter;
  }
};

export const AllStrategyUtil = (setAllStrategyData: any, router: any) => {
  const PayloadOPtionChainApi = new OptionsStrategyBuilderApi(baseConfig());

  PayloadOPtionChainApi.getReadyMadeStrategyByNameV1StrategiesByNameStrategyNameGet(
    "All",
  )
    .then((res: any) => {
      if (res?.data?.result.length > 0) {
        setAllStrategyData(res?.data?.result);
      }
    })
    .catch((err) => {
      if (err?.response && err?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      }
      if (err?.response && err?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
    });
};
