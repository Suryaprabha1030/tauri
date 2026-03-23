import { RootState } from "@/lib/redux/Store";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  enrichFutures,
  enrichOptionChain,
  FormatOiValue,
  getCEClass,
  getIdentifierFromQuery,
  getPEClass,
  getSymbolClass,
  LivegetOptionChainForOptionType,
  oiChangePercFromData,
  OiChgPayload,
  OiFormatPayload,
  oiFromData,
} from "./optionFuturesUtil/strategyUtil";
import {
  addSelectedFlagAndTransactionType,
  ATMCalculation,
  ExpiryTransformData,
  filterOptionDatas,
  findValuesByCategory,
  groupByCategory,
  isFirstIndexNameMatching,
  prepareSortedSelectedData,
  transformDataForPeriodic,
  updateOptionDatas,
} from "./optionFuturesUtil/legUtil";
import { buildSelectedOptionChain } from "./optionFuturesUtil/strategyUtil";
import {
  addCartSuccess,
  addSymbol,
  getIndexName,
  indicesAlldata,
  setIndexRawApiResponse,
  updateSymbolData,
} from "@/lib/redux/slices/StrategySlice";
import { useDispatch } from "react-redux";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { UserBrokerRouterApi } from "@/lib/api/base";
import {
  getOptionData,
  showPositionTable,
  showStrategyTable,
  optionChainPayload,
  showPnlTable,
  showDraftPositions,
  setSelectedStrategy,
  setSandboxDataObj,
  updateSymbolLtp,
} from "@/lib/redux/slices/AnalyzerSlice";
import PositionsWatchlist from "../sidetab/watchlist/PositionsWatchlist";
import { toast } from "react-toastify";
import HeaderRow from "./liveOptionChain/HeaderRow";
import BuysellButton from "./liveOptionChain/BuySellButton";
import BuysellLots from "./liveOptionChain/BuySellLots";
import LtpWithPerc from "./liveOptionChain/LtpWithPerc";
import OptionChainKey from "./liveOptionChain/OptionChainKey";
import { handleSelect } from "@/lib/util/analyzer/handleSelect";
import { currentOptionChainHandler } from "@/lib/util/analyzer/currentOptionChainHandler";
import OITrend from "./liveOptionChain/OITrend";
import OiWithPercentage from "./liveOptionChain/OiWithPercentage";
import { setAnalyzeOrderStocks } from "@/lib/redux/slices/PlaceOrder";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useNavigate } from "react-router-dom";
import config from "@/lib/config";
import { setIndexFirstFutData } from "@/lib/redux/slices/ChartsSlice";
import { setOiChartCall } from "@/lib/redux/slices/PayoffChartSlice";
import {
  getCachedApiData,
  getcurrentExpiryOptionChainDataForHeatMap,
  getDataKey,
  getDecreaser,
  getExpiryValue,
  getLastApiCallTime,
  getOiPercent,
  getOiValue,
  getPayoffTableOiChg,
  getQueryIdentifier,
  getSpotPriceRoundOff,
  NooiDataAvailablity,
} from "@/lib/redux/slices/OptionChainSlice";
import { ChartToggleButtonType } from "@/lib/util/oi/oiUtil";
import { getMaxPainStrikeValue } from "@/lib/redux/slices/StrategyChartSlice";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import {
  calculateBlackScholes,
  timeToExpiry,
} from "../payOffChartCalculation/payOffChartUtils/netPremium";
import { getHighestOIStrikes } from "@/lib/util/analyzer/optUtil";

interface CommonOptionChainProps {
  copiedData: {};
  brokerCode: number | null;
  expandOptTable: boolean;
  setActive: Dispatch<React.SetStateAction<any>>;
  active: any;
  addTable: boolean;
  setProcessedIndexes: Dispatch<React.SetStateAction<any>>;
  querySpotPrice: any;
  setQuerySpotPrice: Dispatch<React.SetStateAction<any>>;
}

const CommonOptionChain: React.FC<CommonOptionChainProps> = ({
  copiedData,
  brokerCode,
  setActive,
  expandOptTable,
  active,
  addTable,
  setProcessedIndexes,
  querySpotPrice,
  setQuerySpotPrice,
}) => {
  const expiryDateRef = useRef<any>(null);
  const ltp: any = useSelector((state: RootState) => state.strategy.ltpData);
  const indexAddtionalData: any = useSelector(
    (state: RootState) => state.strategy.addtionalData,
  );
  const spotPriceInfo: any = useSelector(
    (state: RootState) => state.strategy.spotPriceData,
  );
  const expiry: any = useSelector(
    (state: RootState) => state.strategy.indexExpiryDate,
  );
  const optionChainPayloadData: any = useSelector(
    (state: RootState) => state.analyzer.optionChainPayLoadData,
  );
  const dispatch = useDispatch();
  const optionDatas: any = useSelector(
    (state: RootState) => state.analyzer.optionDataList,
  );

  const OpttargetltpData: any = useSelector(
    (state: RootState) => state.analyzer.OptTargetLtpData,
  );

  const indexObjData: any = useSelector(
    (state: RootState) => state.strategy.indexObj,
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );

  // const [spotPriceInfo, setSpotPriceInfo] = useState(null);
  const netpercentage: any = useSelector(
    (state: RootState) => state.strategy.netChangepercent,
  );
  const SandboxData: any = useSelector(
    (state: RootState) => state.analyzer.setSandboxData,
  );

  const intervalRef: any = useRef<any>(null);

  const [oiChangePerc, setOiChangePerc] = useState<any>("");

  const [oi, setOi] = useState({});

  const positionsdata = useSelector(
    (state: RootState) => state.strategy.positions,
  );

  const AnalyzeOrderstock = useSelector(
    (state: RootState) => state.placeOrder.AnalyzeOrder,
  );

  const frompositionsdata = useSelector(
    (state: RootState) => state.strategy.positions,
  );

  const router = useNavigate();
  const indicesData: any = useSelector(
    (state: RootState) => state.common.allIndicesOptionsList,
  );

  const indexname = useSelector((state: RootState) => state.strategy.indexName);
  const futureDatas = useSelector(
    (state: RootState) => state.analyzer.futureDataList,
  );
  const positionDatas = useSelector(
    (state: RootState) => state.analyzer.PositionDataList,
  );
  const selectedStrategy = useSelector(
    (state: RootState) => state.analyzer.setselectedStrategy,
  );
  const [currentExpiryOptionChainData, setCurrentExpiryOptionChainData] =
    useState<any>({});
  const [optionChainData, setOptionChainData] = useState<any>({});
  const noOiData = useSelector(
    (state: RootState) => state.optionChain.nooiData,
  );
  const expandTable = useSelector(
    (state: RootState) => state.optionChain.expandTable,
  );
  const oiPercent :any= useSelector(
    (state: RootState) => state.optionChain.oiPercent,
  );

  const consolidatedData: any = useSelector(
    (state: RootState) => state.optionChain.consolidatedData,
  );
  const reset = useSelector((state: RootState) => state.optionChain.reset);
  const expiryValue = useSelector(
    (state: RootState) => state.optionChain.expiryValue,
  );
  const [spotPriceRoundOff, setSpotPriceRoundOff] = useState<any>(null);
  const isInitialRender = useRef(true);
  const query = useSelector((state: RootState) => state.optionChain.query);
  const WebsocketLtpRef = useRef(webSocketDataRead);
  const [oiSupportResistance, setOiSupportResistance] = useState<any>({});
  const isMarketHoliday = useSelector(
    (state: RootState) => state.MarketBasis.isMarketHoliday,
  );
  useEffect(() => {
    if (WebsocketLtpRef) {
      WebsocketLtpRef.current = webSocketDataRead;
    }
  }, [webSocketDataRead]);

  const fetchData = async (
    brokerCode: any,
    query: any,
    querySpotPrice: any,
    booleanState: any,
  ) => {
    const getAllDataApi = new UserBrokerRouterApi(baseConfig());
    if (!query?.length) return;
    getAllDataApi
      .getIndicesFullDataFromDbV1UsersMeBrokersBrokerCodeGetIndicesFullDataFromDbIndexNameGet(
        brokerCode,
        query,
        querySpotPrice,
        booleanState,
      )
      .then((res: any) => {
        dispatch(setIndexRawApiResponse(res?.data));
        setQuerySpotPrice(null);
        setProcessedIndexes(false);
        const Indexfuture = res?.data?.futures_data;
        const IndexName = res?.data?.index_obj?.identifier;
        const sortedFuts =
          Indexfuture &&
          Indexfuture.length > 0 &&
          [...Indexfuture].sort((a, b) =>
            new Date(a.expiry) > new Date(b.expiry) ? 1 : -1,
          );
        const firstFut = sortedFuts[0];
        dispatch(
          setIndexFirstFutData({
            IndexFirstFutData: firstFut,
            FutIndexName: IndexName,
          }),
        ); //For displaying FUT in Tv chart Popup
        dispatch(
          addSymbol({
            symbol: res?.data?.index_obj?.identifier,
            // token: res?.data?.index_obj?.token,
          }),
        );

        Object.keys(res?.data?.option_chain || {}).forEach((expiry) => {
          const strikes = res?.data?.option_chain[expiry];

          Object.keys(strikes).forEach((strike) => {
            const options = strikes[strike]; // array of CE & PE objects

            options.forEach((opt:any) => {
              dispatch(
                addSymbol({
                  symbol: opt?.identifier, // pick identifier
                  // token: opt.token, // pick token
                }),
              );
            });
          });
        });
        res?.data?.futures_data.forEach((future: any) => {
          dispatch(
            addSymbol({
              symbol: future?.identifier,
              // token: future.token,
            }),
          );
        });
      })

      .catch((error: any) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  };
  useEffect(() => {
    if (querySpotPrice != null && query && query?.length > 0)
      fetchData(brokerCode, query, querySpotPrice, true);
  }, [query, querySpotPrice]);

  const oiPercentData = async (uniBrokerCode: any, index: any, expiry: any) => {
    const oiBarApi = new UserBrokerRouterApi(baseConfig());
    await oiBarApi
      .fetchLatestOiWithPercentageV1UsersMeBrokersBrokerCodeFetchLatestOiWithPercentagePost(
        uniBrokerCode,
        index,
        expiry,
      )
      .then((res) => {
        if (res?.status == 204 || res?.status == 400) {
          dispatch(NooiDataAvailablity(true));
          return;
        }
        dispatch(NooiDataAvailablity(false));
        setOiChangePerc(oiChangePercFromData(res?.data?.strike_prices));
        setOi(oiFromData(res?.data?.strike_prices));

        setOiSupportResistance(getHighestOIStrikes(res?.data?.strike_prices));
        dispatch(getOiPercent(OiFormatPayload(res?.data?.strike_prices)));
        dispatch(getPayoffTableOiChg(OiChgPayload(res?.data?.strike_prices)));
        dispatch(getOiValue(FormatOiValue(res?.data?.strike_prices)));
        dispatch(getMaxPainStrikeValue(res?.data?.max_pain?.max_pain_strike));
      })
      .catch((error: any) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  };

  useEffect(() => {
    const fetchData = () => {
      // Stop calling the API after 3:30 PM

      if (
        expiry[query]?.length > 0 &&
        indexObjData &&
        Object.entries(indexObjData)?.length > 0
      ) {
        oiPercentData(brokerCode, query, expiryDateRef.current.value);
      }
    };
    fetchData();

    const fetchIfTradingTimeOiData = () => {
      if (config.isTradingTime() && brokerCode != null && !isMarketHoliday) {
        fetchData();
      }
    };
    intervalRef.current = setInterval(fetchIfTradingTimeOiData, 60000);

    // Cleanup function to clear the interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [expiry, query, indexObjData, brokerCode]);

  const handleChange = (event: any) => {
    if (
      optionChainPayload &&
      Object.entries(optionChainPayloadData.response).length > 0
    ) {
      dispatch(
        optionChainPayload({
          optionChainPayloadData: { ClickedRow: {}, response: {} },
        }),
      );
    }
    const expiry = event.target.value;

    dispatch(getExpiryValue(event.target.value));
    oiPercentData(brokerCode, query, expiry);
    dispatch(getCachedApiData([]));
    dispatch(getLastApiCallTime(0));
    dispatch(setOiChartCall(true));

    const asend = optionChainData[expiry];
    if (asend === undefined) {
      // setCallIndices(true);

      const getAllDataApi = new UserBrokerRouterApi(baseConfig());
      const identifier = getIdentifierFromQuery(query);
      const querySpotPrice =
        webSocketDataRead &&
        identifier != null &&
        WebsocketLtpRef.current[identifier];
      if (querySpotPrice != null)
        getAllDataApi
          .getIndicesFullDataFromDbV1UsersMeBrokersBrokerCodeGetIndicesFullDataFromDbIndexNameGet(
            brokerCode,
            query,
            querySpotPrice,
            false,
          )
          .then((res: any) => {
            dispatch(setIndexRawApiResponse(res?.data));
            setQuerySpotPrice(null);
            setProcessedIndexes(false);
            const Indexfuture = res?.data?.futures_data;
            const IndexName = res?.data?.index_obj?.identifier;
            const sortedFuts =
              Indexfuture &&
              Indexfuture.length > 0 &&
              [...Indexfuture].sort((a, b) =>
                new Date(a.expiry) > new Date(b.expiry) ? 1 : -1,
              );
            const firstFut = sortedFuts[0];
            dispatch(
              setIndexFirstFutData({
                IndexFirstFutData: firstFut,
                FutIndexName: res.data?.index_obj?.identifier ?? "",
              }),
            );

            dispatch(
              addSymbol({
                symbol: res?.data?.index_obj?.identifier,
                // token: res?.data?.index_obj?.token,
              }),
            );

            Object.keys(res?.data?.option_chain || {}).forEach((expiry) => {
              const strikes = res?.data?.option_chain[expiry];

              Object.keys(strikes).forEach((strike) => {
                const options = strikes[strike]; // array of CE & PE objects

                options.forEach((opt:any) => {
                  dispatch(
                    addSymbol({
                      symbol: opt?.identifier, // pick identifier
                      // token: opt.token, // pick token
                    }),
                  );
                });
              });
            });
          })
          .catch((error: any) => {
            if (error?.response && error?.response?.status == 401) {
              autoLogoutTokenRemove(router);
            }
            if (error?.response && error?.response?.status == 456) {
              brokerLogoutTokenRemove(router);
            }
          });
    }

    if (optionChainData && optionChainData[expiry]) {
      const asend = optionChainData[expiry];
      const spotPriceRoundOff = expiry && indexAddtionalData[expiry];
      const sortedEntries = asend
        ? Object.entries(asend).sort(([keyA], [keyB]) => {
            return keyA.localeCompare(keyB);
          })
        : null;
      const sorted: any = sortedEntries
        ? Object.fromEntries(sortedEntries)
        : null;
      const atmStrike = ATMCalculation(sorted, webSocketDataRead, indexObjData);
      setSpotPriceRoundOff(atmStrike);
      setCurrentExpiryOptionChainData(sorted);
      dispatch(getcurrentExpiryOptionChainDataForHeatMap(sorted));
    }
  };

  useEffect(() => {
    if (ltp[query]) {
      setOptionChainData(ltp[query]);
      const atmStrike: any = ATMCalculation(
        currentExpiryOptionChainData,
        webSocketDataRead,
        indexObjData,
      );
      setSpotPriceRoundOff(atmStrike);
      dispatch(getSpotPriceRoundOff(atmStrike));
    }
  }, [ltp, query]);

  useEffect(() => {
    if (expiryValue) {
      dispatch(
        getIndexName({
          indexName: query,
          expiryDate: expiryValue,
        }),
      );
    }
  }, [query, ltp, expiryDateRef, expiryValue]);

  useEffect(() => {
    if (expiry[query] && expiry[query].length > 0 && indexname != query) {
      expiryDateRef.current.value = expiry[query][0]; // If the query changed then Set to first expiry date
      dispatch(getExpiryValue(expiry[query][0]));
    } else if (indexname != query) {
      if (
        expiryDateRef &&
        expiryDateRef.current &&
        expiryDateRef.current.value != null
      )
        expiryDateRef.current.value = ""; //if no data in the expiry available then set the expiry after the data arrives
      dispatch(getExpiryValue(""));
    }
  }, [query]);

  useEffect(() => {
    if (expiryDateRef.current && optionChainData && spotPriceInfo != null) {
      if (optionChainData && optionChainData[expiryDateRef.current.value]) {
        const expiry = expiryDateRef.current.value;
        dispatch(getExpiryValue(expiryDateRef.current.value));
        const asend = optionChainData[expiryDateRef.current.value];
        const sortedEntries = asend
          ? Object.entries(asend).sort(([keyA], [keyB]) => {
              return keyA.localeCompare(keyB);
            })
          : null;
        const sorted: any = sortedEntries
          ? Object.fromEntries(sortedEntries)
          : null;

        setCurrentExpiryOptionChainData(sorted);
        dispatch(getcurrentExpiryOptionChainDataForHeatMap(sorted));
        dispatch(getQueryIdentifier(indexObjData?.identifier));
        const tData = ExpiryTransformData(optionChainData);
        const positionData = transformDataForPeriodic(frompositionsdata);
        let hasChanges = 1;
        const updateCommonData = (
          prevCommonData: { [key: string]: any },
          tData: { [key: string]: any },
        ) => {
          const updatedCommonData = { ...prevCommonData };

          Object.entries(tData).forEach(([key, value]) => {
            if (
              OpttargetltpData[key] &&
              prevCommonData[key] &&
              Object.entries(copiedData || {}).length > 0
            ) {
              dispatch(
                optionChainPayload({
                  optionChainPayloadData: { ClickedRow: {}, response: {} },
                }),
              );
              if (
                prevCommonData[key].ltp !== value.ltp &&
                prevCommonData[key].ltp == prevCommonData[key].target_ltp
              ) {
                updatedCommonData[key] = {
                  ...prevCommonData[key],
                  ltp: value.ltp,
                  target_ltp: value.ltp,
                };
                hasChanges = 2;
              }
            }
          });

          return hasChanges ? updatedCommonData : prevCommonData;
        };

        const newCommonData = updateCommonData(OpttargetltpData, tData);
        dispatch(setSandboxDataObj({ setSandboxData: {} }));

        if (hasChanges == 2) {
          dispatch(getOptionData({ optionData: newCommonData }));
        }
        const spotPriceRoundOffz = expiry && indexAddtionalData[query][expiry];
        dispatch(getDecreaser(spotPriceRoundOffz?.incrementer));
        // position data upadte to websocket store from 30 sec call update
        let hasPositionChanges = false;
        const updatePositionData = (
          prevPostionData: { [key: string]: any },
          tData: { [key: string]: any },
        ) => {
          const updatedPositionData = { ...prevPostionData };

          tData &&
            Object.entries(tData)?.forEach(([key, value]) => {
              if (
                prevPostionData[key] &&
                Object.entries(positionData).length > 0
              ) {
                if (
                  prevPostionData[key].ltp !== value.ltp &&
                  prevPostionData[key].identifier == value.identifier &&
                  prevPostionData[key].transaction_type != "EXITED"
                ) {
                  updatedPositionData[key] = {
                    ...prevPostionData[key],
                    ltp: value.ltp,
                    target_ltp: value.ltp,
                  };
                  hasPositionChanges = true;
                }
              }
            });

          return hasPositionChanges ? updatedPositionData : prevPostionData;
        };
        const newOptionData = updatePositionData(
          transformDataForPeriodic(
            findValuesByCategory(query, groupByCategory(frompositionsdata)),
          ),

          tData,
        );

        if (hasPositionChanges) {
          Object.values(newOptionData).map((data: any, index) => {
            dispatch(
              addSymbol({
                symbol: data?.identifier,
                // token: data.token,
              }),
            );
          });
        }
        // position data upadte to websocket store from 30 sec call update
      }
    }
  }, [optionChainData, expiryValue]); //when expiryChanges from Basket Analyze need to change the currentExpiryOptionChain

  useEffect(() => {
    if (expiryDateRef.current && optionChainData && spotPriceInfo != null) {
      if (optionChainData && optionChainData[expiryDateRef.current.value]) {
        const expiry = expiryDateRef.current.value;

        dispatch(getExpiryValue(expiryDateRef.current.value));
        const enrichedOptionChain = enrichOptionChain(
          optionChainData,
          webSocketDataRead,
          netpercentage,
        );
        const asend = enrichedOptionChain[expiryDateRef.current.value];
        const sortedEntries = asend
          ? Object.entries(asend).sort(([keyA], [keyB]) => {
              return keyA.localeCompare(keyB);
            })
          : null;
        const sorted: any = sortedEntries
          ? Object.fromEntries(sortedEntries)
          : null;

        setCurrentExpiryOptionChainData(sorted);
        const tData = ExpiryTransformData(ltp[query]);
        let hasChanges = 1;
        const updateCommonData = (
          prevCommonData: { [key: string]: any },
          tData: { [key: string]: any },
        ) => {
          const updatedCommonData = { ...prevCommonData };

          Object.entries(tData).forEach(([key, value]) => {
            if (
              prevCommonData[key] &&
              OpttargetltpData &&
              Object.entries(copiedData).length > 0
            ) {
              if (prevCommonData[key]) {
                updatedCommonData[key] = {
                  ...prevCommonData[key],
                  ltp: webSocketDataRead[value?.identifier],
                  target_ltp: webSocketDataRead[value?.identifier],
                  // ltp: value.ltp,
                  // target_ltp: value.ltp,
                };
                hasChanges = 2;
              }
            }
          });

          // return hasChanges ? updatedCommonData : prevCommonData;

          return hasChanges ? updatedCommonData : prevCommonData;
        };

        // Create the updated data
        const newCommonData = updateCommonData(OpttargetltpData, tData);

        if (hasChanges == 2) {
          dispatch(getOptionData({ optionData: newCommonData }));
        }

        const spotPriceRoundOffz = expiry && indexAddtionalData[query][expiry];

        // setSpotPriceRoundOff(
        //   spotPriceRoundOffz && spotPriceRoundOffz.spot_price_round_off
        // );
        const atmStrike = ATMCalculation(
          sorted,
          webSocketDataRead,
          indexObjData,
        );

        setSpotPriceRoundOff(atmStrike);

        dispatch(getDecreaser(spotPriceRoundOffz.incrementer));
      }
    }
  }, [reset]);

  useEffect(() => {
    if (
      currentExpiryOptionChainData &&
      WebsocketLtpRef.current &&
      indexObjData
    ) {
      const calculateATMStrike = () => {
        const atmStrike: any = ATMCalculation(
          currentExpiryOptionChainData,
          WebsocketLtpRef.current,
          indexObjData,
        );
        setSpotPriceRoundOff(atmStrike);
        dispatch(getSpotPriceRoundOff(atmStrike));
      };

      calculateATMStrike();

      const interval = setInterval(calculateATMStrike, 30000);

      // Cleanup interval on unmount or dependency change
      return () => clearInterval(interval);
    }
  }, [currentExpiryOptionChainData, indexObjData]);

  useEffect(() => {
    const scrollToMiddle = () => {
      if (expiry && ltp[query]) {
        const data = expiry && query && expiry[query][0];
        // const spotPriceRoundOffz = expiry && indexAddtionalData[query][data];
        const elementId: string = `#result_${spotPriceRoundOff}`;
        const section = document.querySelector(elementId);

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
          });
        }
      }
    };
    scrollToMiddle();
  }, [spotPriceRoundOff, currentExpiryOptionChainData, addTable]);

  useEffect(() => {
    if (
      currentExpiryOptionChainData &&
      Object.entries(currentExpiryOptionChainData).length > 0
    ) {
      const key = Object.keys(currentExpiryOptionChainData);

      dispatch(getDataKey(key));
    }
  }, [currentExpiryOptionChainData]);

  useEffect(() => {
    const obj2 =
      (optionChainPayloadData.response &&
        optionChainPayloadData.response.responsePayLoad) ||
      {};

    if (
      optionChainPayloadData &&
      optionChainPayloadData.response &&
      optionChainPayloadData?.response?.responsePayLoad &&
      expiryDateRef.current &&
      Object.entries(ltp).length > 0 &&
      query.length > 0 &&
      Object.entries(optionChainPayloadData?.response?.responsePayLoad).length >
        0 &&
      spotPriceInfo != null
    ) {
      const obj1 =
        ltp && query && ltp[query] && ltp[query][expiryDateRef.current.value];
      const strategyData = addSelectedFlagAndTransactionType(obj1, obj2);

      if (strategyData && Object.keys(strategyData).length > 0) {
        const sortedEntries =
          Object.entries(strategyData).length > 0
            ? Object.entries(strategyData).sort(([keyA], [keyB]) => {
                return keyA.localeCompare(keyB);
              })
            : null;
        const sorted: any = sortedEntries
          ? Object.fromEntries(sortedEntries)
          : null;
        const atmStrike = ATMCalculation(
          sorted,
          webSocketDataRead,
          indexObjData,
        );
        setSpotPriceRoundOff(atmStrike);
        setCurrentExpiryOptionChainData(sorted);
        dispatch(getcurrentExpiryOptionChainDataForHeatMap(sorted));

        setActive(ChartToggleButtonType.Chart);
        // for payoffchart calculation

        dispatch(
          getOptionData({
            optionData: {
              ...buildSelectedOptionChain(sorted),
            },
          }),
        );
      }
    }
  }, [optionChainPayloadData, ltp]);

  useEffect(() => {
    if (
      SandboxData &&
      Object.entries(SandboxData).length > 0 &&
      currentExpiryOptionChainData &&
      Object.entries(currentExpiryOptionChainData).length > 0
    ) {
      const updatedOptionDatas = updateOptionDatas(optionDatas, SandboxData);
      const filteredOptionDatas = filterOptionDatas(
        updatedOptionDatas,
        expiryValue,
      );

      const optionData = currentExpiryOptionChainData;
      const sorted = prepareSortedSelectedData(optionData, updatedOptionDatas);

      if (sorted) {
        const atmStrike = ATMCalculation(
          sorted,
          webSocketDataRead,
          indexObjData,
        );
        setSpotPriceRoundOff(atmStrike);
        setCurrentExpiryOptionChainData(sorted);

        dispatch(
          getOptionData({
            optionData: {
              ...buildSelectedOptionChain(sorted),
              ...filteredOptionDatas,
            },
          }),
        );

        dispatch(setSandboxDataObj({ setSandboxData: {} }));
      }
    }
  }, [SandboxData]);

  useEffect(() => {
    if (
      AnalyzeOrderstock &&
      Object.entries(AnalyzeOrderstock).length > 0 &&
      currentExpiryOptionChainData &&
      Object.entries(currentExpiryOptionChainData).length > 0
    ) {
      const result = isFirstIndexNameMatching(
        AnalyzeOrderstock,
        currentExpiryOptionChainData,
      );
      if (result) {
        const updatedOptionDatas = updateOptionDatas(
          optionDatas,
          AnalyzeOrderstock,
        );
        const filteredOptionDatas = filterOptionDatas(
          updatedOptionDatas,
          expiryValue,
        );

        const optionData = currentExpiryOptionChainData;
        const sorted = prepareSortedSelectedData(
          optionData,
          updatedOptionDatas,
        );

        if (sorted) {
          const atmStrike = ATMCalculation(
            sorted,
            webSocketDataRead,
            indexObjData,
          );
          setSpotPriceRoundOff(atmStrike);
          setCurrentExpiryOptionChainData(sorted);
          dispatch(getcurrentExpiryOptionChainDataForHeatMap(sorted));
          setActive(ChartToggleButtonType.Chart);
          // for payoffchart calculation
          dispatch(
            getOptionData({
              optionData: {
                ...buildSelectedOptionChain(sorted),
                ...filteredOptionDatas,
              },
            }),
          );

          dispatch(setAnalyzeOrderStocks({}));
        }
      }
    }
  }, [AnalyzeOrderstock, currentExpiryOptionChainData]);

  const LivehandleUpdateLots =
    (hashkey: string, element: any) => (event: any) => {
      const BuySellData: any = { ...optionDatas };

      const addData = { ...BuySellData[hashkey] }; // copy the selected data else its updating the state directly
      addData.lots = parseInt(event.target.value);

      if (element.is_selected) {
        addData.old_lots = element.lots;
      }

      BuySellData[hashkey] = addData;
      dispatch(getOptionData({ optionData: { ...BuySellData } }));
    };

  useEffect(() => {
    if (
      consolidatedData &&
      Object.keys(
        (consolidatedData && consolidatedData?.clickedHeatmapData) || {},
      ).length > 0
    ) {
      const hashkey = consolidatedData.hash;
      if (optionDatas[hashkey]) {
        if (
          optionDatas[hashkey].transaction_type !==
          consolidatedData.transactionType
        ) {
          handleSelect(
            consolidatedData.hash,
            consolidatedData.clickedHeatmapData,
            consolidatedData.transactionType,
            consolidatedData.buttonType,
            dispatch,
            optionDatas,
            showStrategyTable,
            showPositionTable,
            showPnlTable,
            getOptionData,
            toast,
            setSelectedStrategy,
            showDraftPositions,
            futureDatas,
            positionDatas,

            selectedStrategy,
            setActive,
            active,
          )();
        }
      } else {
        handleSelect(
          consolidatedData.hash,
          consolidatedData.clickedHeatmapData,
          consolidatedData.transactionType,
          consolidatedData.buttonType,
          dispatch,
          optionDatas,
          showStrategyTable,
          showPositionTable,
          showPnlTable,
          getOptionData,
          toast,
          setSelectedStrategy,
          showDraftPositions,
          futureDatas,
          positionDatas,
          selectedStrategy,
          setActive,
          active,
        )();
      }
    }
  }, [consolidatedData]);
  const removeWhitespaceNodes = (children: any) =>
    React.Children.toArray(children).filter(
      (child) => !(typeof child === "string" && child.trim() === ""),
    );

  return (
    <div
      className={`flex h-full w-full flex-col items-center  overflow-auto rounded-bl-xl   rounded-br-xl border border-z-blue-200   scrollbar-none `}
    >
      <table className="h-full w-full rounded-bl-xl rounded-br-xl border border-blue-200 text-center text-[0.75rem] duration-500">
        <HeaderRow
          expiryDateRef={expiryDateRef}
          noOiData={noOiData}
          handleChange={handleChange}
          query={query}
          expiryValue={expiryValue}
          expandOptTable={expandOptTable}
        />
        <tbody
          className="flex h-[90%] flex-col rounded-lg text-center text-[0.75rem]"
          id={`result_${spotPriceRoundOff}`}
        >
          {removeWhitespaceNodes(
            currentExpiryOptionChainData &&
              Object.entries(currentExpiryOptionChainData).length > 0 &&
              expiryDateRef.current
              ? Object.entries(currentExpiryOptionChainData).map(
                  ([key, value]: [string, any]) => {
                    const {
                      closeCE,
                      closePE,
                      hashPE,
                      hash,
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
                      closeSymbol,
                      closeSymbolPE,
                      icon,
                      iconPE,
                    } = currentOptionChainHandler(
                      key,
                      value,
                      expiryDateRef,
                      optionDatas,
                      expandOptTable,
                      oiChangePerc,
                      webSocketDataRead,
                      netpercentage,
                    );

                    return (
                      <tr
                        id={"result_" + key}
                        key={key}
                        className="group m-0  flex flex-row items-center justify-center border-b-2 border-gray-200 p-0  text-[0.7rem] md:max-2xl:justify-between"
                      >
                        {!noOiData && (
                          <td
                            className={`  sm:max-md:w-[40%]  ${
                              spotPriceInfo == null
                                ? expandOptTable
                                  ? "basis-1/4"
                                  : "basis-1/2"
                                : ""
                            }${
                              optionDatas[hashPE] || optionDatas[hash]
                                ? " max-md:h-[4.2rem] md:max-xl:h-[5rem]"
                                : " max-sm:h-[3.2rem] sm:max-md:h-[4rem] md:max-xl:h-[4rem]"
                            }
                       ${expandOptTable ? "py-2   md:max-xl:w-[24%] xl:w-[17%] 2xl:w-[20%]  " : "flex-row items-center justify-center xl:max-2xl:w-[25%] 2xl:w-[13.3%]"}
                           
                          justify-center  max-xl:flex max-xl:w-[23%] max-xl:items-center
                          max-md:w-[35%] max-sm:hidden group-hover:max-sm:h-[4.5rem] group-hover:md:max-xl:h-[5rem]`}
                          >
                            <OiWithPercentage
                              optionType="CE"
                              oi={oi}
                              oiChangePerc={oiChangePerc}
                              rowKey={key}
                              expandOptTable={expandOptTable}
                            />
                          </td>
                        )}
                        {expandOptTable && !noOiData && (
                          <td
                            className={`flex       max-xl:hidden ${
                              expandOptTable
                                ? " xl:w-[29%] 2xl:w-[30%]"
                                : "xl:max-2xl:w-[25%]"
                            } py-2`}
                          >
                            <OITrend
                              expandTable={expandOptTable}
                              icon={icon}
                              rowKey={key}
                              closeCEPEPercentage={closeCEPercentage}
                              oiChangePerc={oiChangePerc}
                              optionType="CE"
                            />
                          </td>
                        )}

                        {expandOptTable &&
                          spotPriceInfo != null &&
                          expiryDateRef.current &&
                          key != null && (
                            <td
                              className={`flex   justify-center     max-xl:hidden ${
                                expandOptTable
                                  ? " xl:w-[12%] 2xl:w-[14%] 2xl:px-2"
                                  : " xl:max-2xl:w-[25%]"
                              } py-2`}
                            >
                              {
                                calculateBlackScholes(
                                  spotPriceInfo,
                                  parseInt(key, 10),
                                  "CE",
                                  timeToExpiry(expiryDateRef.current.value),
                                  // expiryDateRef.current.value,
                                  config.defaultIvValue / 100,
                                )?.greeks?.gamma
                              }
                            </td>
                          )}
                        {expandOptTable &&
                          spotPriceInfo != null &&
                          expiryDateRef.current &&
                          key != null && (
                            <td
                              className={`flex  justify-center     max-xl:hidden ${
                                expandOptTable
                                  ? " xl:w-[12%] 2xl:w-[14%] 2xl:px-2"
                                  : " xl:max-2xl:hidden xl:max-2xl:w-[25%]"
                              } py-2`}
                            >
                              {calculateBlackScholes(
                                spotPriceInfo,
                                parseInt(key, 10),
                                "CE",
                                timeToExpiry(expiryDateRef.current.value),
                                // expiryDateRef.current.value,
                                config.defaultIvValue / 100,
                              )?.greeks?.vega?.toFixed(2)}
                            </td>
                          )}
                        {expandOptTable &&
                          spotPriceInfo != null &&
                          expiryDateRef.current &&
                          key != null && (
                            <td
                              className={`flex justify-center     max-xl:hidden ${
                                expandOptTable
                                  ? " xl:w-[12%] 2xl:w-[14%] 2xl:px-2"
                                  : " xl:max-2xl:w-[25%]"
                              } py-2`}
                            >
                              {calculateBlackScholes(
                                spotPriceInfo,
                                parseInt(key, 10),
                                "CE",
                                timeToExpiry(expiryDateRef.current.value),
                                // expiryDateRef.current.value,
                                config.defaultIvValue / 100,
                              )?.greeks?.theta?.toFixed(2)}
                            </td>
                          )}

                        {spotPriceInfo != null &&
                          expiryDateRef.current &&
                          key != null && (
                            <td
                              className={`flex  justify-center     max-xl:hidden ${
                                expandOptTable
                                  ? " xl:w-[12%] 2xl:w-[14%] 2xl:px-2"
                                  : " xl:max-2xl:hidden  2xl:w-[15%] 2xl:px-2"
                              } py-2`}
                            >
                              {calculateBlackScholes(
                                spotPriceInfo,
                                parseInt(key, 10),
                                "CE",
                                timeToExpiry(expiryDateRef.current.value),
                                // expiryDateRef.current.value,
                                config.defaultIvValue / 100,
                              )?.greeks?.delta?.toFixed(2)}
                            </td>
                          )}

                        {/* BUY/SELL button for CE  */}
                        <td
                          className={`relative max-md:flex max-md:items-center group-hover:max-md:h-[4.5rem] max-sm:w-[35%] sm:max-md:w-[40%] group-hover:md:max-xl:h-[5rem] group-hover:md:max-xl:pb-[1rem] xl:max-2xl:h-[4.6rem]  ${
                            optionDatas[hashPE] || optionDatas[hash]
                              ? "  max-md:h-[4.4rem] md:max-xl:h-[5rem] md:max-xl:pb-[1rem]"
                              : " max-sm:h-[4.4rem] sm:max-md:h-[4rem] md:max-xl:h-[4rem]"
                          } ${noOiData ? "basis-1/2" : ""}  ${
                            expandOptTable
                              ? "md:w-[24%] xl:w-[24%] 2xl:w-[24%]  "
                              : "md:max-xl:w-[20%] xl:max-2xl:w-[32%] 2xl:w-[25%]"
                          }   ${getCEClass(
                            spotPriceRoundOff,
                            key,
                            // indexObjData?.net_change_percent
                            netpercentage[indexObjData?.identifier],
                          )}  col-span-5 `}
                        >
                          <div className="flex h-full w-full flex-col max-md:py-1 max-sm:items-start max-sm:justify-start sm:items-center sm:justify-center  md:max-xl:w-full  xl:py-[1rem]">
                            <LtpWithPerc
                              closePECE={closeCE}
                              closePECEPercentage={closeCEPercentage}
                            />
                            {!noOiData && (
                              <div
                                className={`text-center text-[0.6rem] font-semibold uppercase max-sm:block max-sm:w-full max-sm:text-[0.5rem] sm:max-md:text-[0.5rem]  xl:text-[0.5rem] 2xl:text-[0.6rem] 
                                  
                                 ${
                                   oiSupportResistance?.peStrike ==
                                   oiSupportResistance?.ceStrike
                                     ? ""
                                     : `${oiSupportResistance?.peStrike}.0` ==
                                         key
                                       ? "text-transparent"
                                       : ""
                                 }`}
                              >
                                {`${oiSupportResistance?.ceStrike}.0` == key
                                  ? "OI-Resistance"
                                  : oiSupportResistance?.peStrike ==
                                      oiSupportResistance?.ceStrike
                                    ? ""
                                    : `${oiSupportResistance?.peStrike}.0` ==
                                        key
                                      ? "--"
                                      : ""}
                              </div>
                            )}

                            {closeCE && (
                              <>
                                <div
                                  className={`absolute right-0 z-[5] max-xl:bottom-1.5 xl:max-2xl:bottom-[4px] ${
                                    optionDatas[hash]
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }  flex h-[1.2rem] w-full flex-row items-center justify-end gap-1 group-hover:opacity-100`}
                                >
                                  {LiveselectedDataForCE && (
                                    <BuysellLots
                                      LiveselectedDataForPECE={
                                        LiveselectedDataForCE
                                      }
                                      LivehandleUpdateLots={LivehandleUpdateLots(
                                        hash,
                                        LivegetOptionChainForOptionType(
                                          value,
                                          "CE",
                                        ),
                                      )}
                                    />
                                  )}
                                  <BuysellButton
                                    combinedBuyClassNamesPECE={
                                      combinedBuyClassNamesCE
                                    }
                                    buyPECEButtonKey={buyCEButtonKey}
                                    hashPECE={hash}
                                    updatedOptionChainForPECE={
                                      updatedOptionChainForCE
                                    }
                                    combinedSellClassNamesPECE={
                                      combinedSellClassNamesCE
                                    }
                                    sellPECEButtonKey={sellCEButtonKey}
                                    optionDatas={optionDatas}
                                    optionType="CE"
                                    active={active}
                                    setActive={setActive}
                                  />
                                </div>
                              </>
                            )}
                            <div
                              className={` absolute z-[5] flex flex-row items-center justify-center gap-1 max-2xl:z-[1] max-md:w-[2rem] xl:max-2xl:w-[2rem] 2xl:w-full ${
                                key == `${spotPriceRoundOff}.0`
                                  ? "max-sm:right-[38%] max-sm:top-[3.2rem] sm:max-md:right-[40%] sm:max-md:top-[3.2rem] group-hover:sm:max-md:top-[3.5rem] md:max-xl:-right-1 md:max-xl:top-[1.9rem] group-hover:md:max-xl:top-[3rem] xl:top-[3.7rem] xl:max-2xl:right-[36%] 2xl:top-[3.8rem]"
                                  : "max-sm:right-[38%] max-sm:top-[3.2rem] sm:max-md:right-[40%] sm:max-md:top-[3.2rem] group-hover:sm:max-md:top-[3.5rem] md:max-xl:-right-1 md:max-xl:top-[1.9rem] group-hover:md:max-xl:top-[3rem] xl:top-[3.7rem] xl:max-2xl:right-[36%] 2xl:top-[3.8rem]"
                              } ${
                                optionDatas[hashPE] || optionDatas[hash]
                                  ? "sm:max-md:top-[3.1rem] md:max-xl:top-[2rem]"
                                  : ""
                              }`}
                            >
                              <PositionsWatchlist
                                symb={closeSymbol}
                                positionsData={positionsdata}
                              />
                            </div>
                          </div>
                          {!noOiData && (
                            <div
                              className={`absolute right-0  xl:h-[1.2rem] ${
                                key == `${spotPriceRoundOff}.0`
                                  ? "top-[1rem]"
                                  : `top-[0.75rem]`
                              }  rounded-l-full bg-z-orange-oi opacity-30`}
                              style={{ width: `${oiPercent[`${key}#CE`]}%` }}
                            ></div>
                          )}
                        </td>

                        <td
                          className={`relative  max-md:flex max-md:items-center group-hover:max-md:h-[4.5rem] max-sm:w-[39%] sm:max-md:w-[40%] md:max-xl:w-[22%] group-hover:md:max-xl:h-[5rem]  xl:max-2xl:h-[4.6rem] ${expandOptTable ? "xl:w-[16%] 2xl:w-[17%]" : "xl:w-[30%] 2xl:w-[17%]"}   ${
                            optionDatas[hashPE] || optionDatas[hash]
                              ? "max-md:h-[4.4rem]  md:max-xl:h-[5rem]"
                              : "max-sm:h-[4.4rem]  sm:max-md:h-[4rem] md:max-xl:h-[4rem]"
                          }  ${noOiData ? "basis-1/2" : ""}  ${getSymbolClass(
                            spotPriceRoundOff,
                            key,
                            // indexObjData?.net_change_percent
                            netpercentage[indexObjData?.identifier],
                          )}`}
                        >
                          <OptionChainKey
                            optKey={key}
                            spotPriceRoundOff={spotPriceRoundOff}
                            spotPriceInfo={
                              indexObjData &&
                              webSocketDataRead[indexObjData?.identifier]
                            }
                            noOiData={noOiData}
                          />
                        </td>

                        <td
                          className={`relative  max-md:flex max-md:items-center group-hover:max-md:h-[4.5rem] max-sm:w-[35%] sm:max-md:w-[40%] group-hover:md:max-xl:h-[5rem] group-hover:md:max-xl:pb-[1rem] xl:max-2xl:h-[4.6rem] ${
                            optionDatas[hashPE] || optionDatas[hash]
                              ? "max-md:h-[4.4rem] md:max-xl:h-[5rem] md:max-xl:pb-[1rem]"
                              : "max-sm:h-[4.4rem] sm:max-md:h-[4rem] md:max-xl:h-[4rem]"
                          } ${noOiData ? "basis-1/2" : ""}  ${
                            expandOptTable
                              ? "md:w-[24%]  xl:w-[18%] 2xl:w-[24%]"
                              : "md:max-xl:w-[21%] xl:max-2xl:w-[30%] 2xl:w-[24%]"
                          } ${getPEClass(
                            spotPriceRoundOff,
                            key,
                            // indexObjData?.net_change_percent
                            netpercentage[indexObjData?.identifier],
                          )} `}
                        >
                          <div className="flex h-full flex-col max-sm:h-[100%] max-sm:items-start max-sm:justify-start max-sm:py-0.5 sm:items-center sm:justify-center sm:max-md:py-1 md:max-xl:w-full xl:py-[1rem]">
                            <LtpWithPerc
                              closePECE={closePE}
                              closePECEPercentage={closePEPercentage}
                            />
                            {!noOiData && (
                              <span
                                className={` block text-center text-[0.6rem] font-semibold  uppercase max-sm:text-[0.5rem] sm:max-md:text-[0.5rem] xl:text-[0.5rem] 2xl:text-[0.6rem] 
                                  ${
                                    oiSupportResistance?.peStrike ==
                                    oiSupportResistance?.ceStrike
                                      ? ""
                                      : `${oiSupportResistance?.ceStrike}.0` ==
                                          key
                                        ? "text-transparent"
                                        : ""
                                  }`}
                              >
                                {`${oiSupportResistance?.peStrike}.0` == key
                                  ? "OI-Support"
                                  : oiSupportResistance?.peStrike ==
                                      oiSupportResistance?.ceStrike
                                    ? ""
                                    : `${oiSupportResistance?.ceStrike}.0` ==
                                        key
                                      ? "--"
                                      : ""}
                              </span>
                            )}

                            {closePE && (
                              <>
                                <div
                                  className={`absolute left-0 z-[5] flex h-[1.2rem] w-full flex-row-reverse justify-end gap-1 max-xl:bottom-1.5 xl:max-2xl:bottom-[4px] ${
                                    optionDatas[hashPE]
                                      ? "opacity-100"
                                      : "opacity-0"
                                  }  group-hover:opacity-100 `}
                                >
                                  {LiveselectedDataForPE && (
                                    <BuysellLots
                                      LiveselectedDataForPECE={
                                        LiveselectedDataForPE
                                      }
                                      LivehandleUpdateLots={LivehandleUpdateLots(
                                        hashPE,
                                        LivegetOptionChainForOptionType(
                                          value,
                                          "PE",
                                        ),
                                      )}
                                    />
                                  )}
                                  <BuysellButton
                                    combinedBuyClassNamesPECE={
                                      combinedBuyClassNamesPE
                                    }
                                    buyPECEButtonKey={buyPEButtonKey}
                                    hashPECE={hashPE}
                                    updatedOptionChainForPECE={
                                      updatedOptionChainForPE
                                    }
                                    combinedSellClassNamesPECE={
                                      combinedSellClassNamesPE
                                    }
                                    sellPECEButtonKey={sellPEButtonKey}
                                    optionDatas={optionDatas}
                                    optionType="PE"
                                    active={active}
                                    setActive={setActive}
                                  />
                                </div>
                              </>
                            )}
                            <div
                              className={`absolute z-[5] flex flex-row items-center justify-center max-2xl:z-[1]  max-md:w-[2rem] xl:gap-2 xl:max-2xl:w-[2rem] 2xl:w-full ${
                                key == `${spotPriceRoundOff}.0`
                                  ? "max-sm:right-[38%] max-sm:top-[3.2rem] sm:max-md:right-[40%] sm:max-md:top-[3.2rem] group-hover:sm:max-md:top-[3.5rem] md:max-xl:-right-1 md:max-xl:top-[1.9rem] group-hover:md:max-xl:top-[2rem] xl:top-[3.8rem]  xl:max-2xl:right-[36%] 2xl:top-[3.8rem]"
                                  : "max-sm:right-[38%] max-sm:top-[3.2rem] sm:max-md:right-[40%] sm:max-md:top-[3.2rem] group-hover:sm:max-md:top-[3.5rem] md:max-xl:-right-1 md:max-xl:top-[1.9rem] group-hover:md:max-xl:top-[2rem] xl:top-[3.8rem]   xl:max-2xl:right-[36%]  2xl:top-[3.8rem]"
                              } ${
                                optionDatas[hashPE] || optionDatas[hash]
                                  ? "sm:max-md:top-[3.1rem] md:max-xl:top-[2rem]"
                                  : ""
                              }`}
                            >
                              <PositionsWatchlist
                                symb={closeSymbolPE}
                                positionsData={positionsdata}
                              />
                            </div>
                          </div>
                          {!noOiData && (
                            <div
                              className={`absolute left-0  xl:h-[1.2rem] ${
                                key == `${spotPriceRoundOff}.0`
                                  ? "top-[1rem]"
                                  : `top-[0.75rem]`
                              }  rounded-r-full bg-z-green-500 opacity-30`}
                              style={{ width: `${oiPercent[`${key}#PE`]}%` }}
                            ></div>
                          )}
                        </td>

                        {/* BUY/SELL button for PE */}

                        {spotPriceInfo != null &&
                          expiryDateRef.current &&
                          key != null && (
                            <td
                              className={`flex justify-center      max-xl:hidden ${
                                expandOptTable
                                  ? " xl:w-[12%] 2xl:w-[14%] 2xl:px-2"
                                  : "w-[15%]  xl:max-2xl:hidden  xl:max-2xl:w-[25%] 2xl:w-[15%] 2xl:px-2"
                              } py-2`}
                            >
                              {calculateBlackScholes(
                                spotPriceInfo,
                                parseInt(key, 10),
                                "PE",
                                timeToExpiry(expiryDateRef.current.value),
                                // expiryDateRef.current.value,
                                config.defaultIvValue / 100,
                              )?.greeks?.delta?.toFixed(2)}
                            </td>
                          )}

                        {expandOptTable &&
                          spotPriceInfo != null &&
                          expiryDateRef.current &&
                          key != null && (
                            <td
                              className={`flex justify-center      max-xl:hidden ${
                                expandOptTable
                                  ? " xl:w-[12%] 2xl:w-[14%] 2xl:px-2"
                                  : " xl:max-2xl:w-[25%]"
                              } py-2`}
                            >
                              {calculateBlackScholes(
                                spotPriceInfo,
                                parseInt(key, 10),
                                "PE",
                                timeToExpiry(expiryDateRef.current.value),
                                // expiryDateRef.current.value,
                                config.defaultIvValue / 100,
                              )?.greeks.theta?.toFixed(2)}
                            </td>
                          )}
                        {expandOptTable &&
                          spotPriceInfo != null &&
                          expiryDateRef.current &&
                          key != null && (
                            <td
                              className={`flex justify-center      max-xl:hidden ${
                                expandOptTable
                                  ? " xl:w-[12%] 2xl:w-[14%] 2xl:px-2 "
                                  : " xl:max-2xl:w-[25%]"
                              } py-2`}
                            >
                              {calculateBlackScholes(
                                spotPriceInfo,
                                parseInt(key, 10),
                                "PE",
                                timeToExpiry(expiryDateRef.current.value),
                                // expiryDateRef.current.value,
                                config.defaultIvValue / 100,
                              )?.greeks.vega?.toFixed(2)}
                            </td>
                          )}
                        {expandOptTable &&
                          spotPriceInfo != null &&
                          expiryDateRef.current &&
                          key != null && (
                            <td
                              className={`flex  justify-center    max-xl:hidden ${
                                expandOptTable
                                  ? " xl:w-[12%] 2xl:w-[14%] 2xl:px-2"
                                  : " xl:max-2xl:w-[25%] "
                              } py-2`}
                            >
                              {
                                calculateBlackScholes(
                                  spotPriceInfo,
                                  parseInt(key, 10),
                                  "PE",
                                  timeToExpiry(expiryDateRef.current.value),
                                  // expiryDateRef.current.value,
                                  config.defaultIvValue / 100,
                                )?.greeks?.gamma
                              }
                            </td>
                          )}
                        {expandOptTable && !noOiData && (
                          <td
                            className={`flex  max-xl:hidden  ${
                              expandOptTable
                                ? " xl:w-[29%] 2xl:w-[30%]"
                                : "xl:max-2xl:w-[23%]"
                            } py-2`}
                          >
                            <OITrend
                              expandTable={expandOptTable}
                              icon={iconPE}
                              rowKey={key}
                              closeCEPEPercentage={closePEPercentage}
                              oiChangePerc={oiChangePerc}
                              optionType="PE"
                            />
                          </td>
                        )}
                        {!noOiData && (
                          <td
                            className={`   ${
                              spotPriceInfo == null
                                ? expandOptTable
                                  ? "basis-1/4"
                                  : "basis-1/2"
                                : ""
                            } sm:max-md:w-[40%] ${
                              optionDatas[hashPE] || optionDatas[hash]
                                ? " max-md:h-[4.2rem] md:max-xl:h-[5rem]"
                                : " max-sm:h-[3.2rem] sm:max-md:h-[4rem] md:max-xl:h-[4rem]"
                            }
                     ${expandOptTable ? "py-2  md:max-xl:w-[24%] xl:w-[17%] 2xl:w-[20%] " : "flex-row items-center justify-center xl:max-2xl:w-[25%] 2xl:w-[13.3%]"}
                         
                        items-center justify-center max-2xl:items-center max-xl:flex max-xl:w-[23%] max-md:w-[35%] max-sm:hidden
                        group-hover:max-sm:h-[4.5rem] group-hover:md:max-xl:h-[5rem]   group-hover:md:max-xl:h-[5rem]
                          `}
                          >
                            <OiWithPercentage
                              optionType="PE"
                              oi={oi}
                              oiChangePerc={oiChangePerc}
                              rowKey={key}
                              expandOptTable={expandOptTable}
                            />
                          </td>
                        )}
                      </tr>
                    );
                  },
                )
              : "",
          )}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(CommonOptionChain);
