"use client";
import CommonLayOut from "@/components/shared/ChartLayout/CommonLayOut";
import ExpirySlider from "@/components/shared/ChartLayout/optionFutures/ExpirySlider";
import FutureStocks from "@/components/shared/ChartLayout/optionFutures/FutureStocks";
import IndexChanger from "@/components/shared/ChartLayout/optionFutures/IndexChanger";
import {
  getDaysBetween,
  manageOrders,
} from "@/components/shared/ChartLayout/optionFutures/optionFuturesUtil/legUtil";
import NewStrategyLegTable from "@/components/shared/ChartLayout/optionFutures/NewStrategyLegTable";
import PnlTable from "@/components/shared/ChartLayout/optionFutures/PnlTable";
import PositionsTable from "@/components/shared/ChartLayout/optionFutures/PositionsTable";
import PriceSlider from "@/components/shared/ChartLayout/optionFutures/PriceSlider";
import StrategyChart from "@/components/shared/ChartLayout/optionFutures/StrategyChart";
import SwitchTab from "@/components/shared/ChartLayout/optionFutures/SwitchTab";
import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  checkPosition,
  getFutTargetltpData,
  getFutureData,
  getOptionData,
  getOptTargetltpData,
  getUpdatedTargetltpData,
  optionChainPayload,
  setSandboxDataObj,
  setSelectedStrategy,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
  updateSymbolLtp,
} from "@/lib/redux/slices/AnalyzerSlice";
import {
  addCartSuccess,
  addSymbol,
  indicesAlldata,
  setIndexRawApiResponse,
  updateSymbolData,
} from "@/lib/redux/slices/StrategySlice";
import { RootState } from "@/lib/redux/Store";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  enrichFutures,
  enrichOptionChain,
  getHashKey,
  getIdentifierFromQuery,
} from "@/components/shared/ChartLayout/optionFutures/optionFuturesUtil/strategyUtil";
import CommonOptionChain from "@/components/shared/ChartLayout/optionFutures/CommonOptionChain";
import {
  setChartIconClicked,
  setIndexFirstFutData,
  setShowTvResolution,
  showHeatmap,
  setChartPanel,
} from "@/lib/redux/slices/ChartsSlice";
import HeatMap from "@/components/shared/ChartLayout/sidetab/watchlist/HeatMap/Heatmap";
import ChartCards from "@/components/shared/ChartLayout/optionFutures/ChartCards";
import DraftPositionsTable from "@/components/shared/ChartLayout/optionFutures/Sandbox/DraftPositionTable";
import IndexChangerIconButton from "@/components/shared/ChartLayout/optionFutures/IndexChangerIconButton/IndexChangerIconButton";
import ToggleChartAndOptButton from "@/components/shared/ChartLayout/optionFutures/ToggleChartAndOptButton";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useParams, useRouter } from "next/navigation";
import { handlePopUp } from "@/lib/util/analyzer/handleSelect";
import {
  processAndDispatchLtpData,
  updateReduxWithFutureData,
} from "@/lib/util/DraftUtil";
import config from "@/lib/config";
import CandleIcon from "@/components/shared/ChartLayout/optionFutures/CandleIcon";
import { extractAndSortOptions } from "@/lib/util/HeatMapUtil/HeatmapUtil";
import { getBrokerCode, getBrokerName } from "@/components/helpers";
import {
  cardResult,
  marginRequired,
  premiumData,
  setOiChartCall,
} from "@/lib/redux/slices/PayoffChartSlice";
import { validateBrokerCode } from "@/lib/util/brokerIdCheck/brokersExist";
import { setAnalyzeOrderStocks } from "@/lib/redux/slices/PlaceOrder";
import MultiOiChart from "@/components/shared/ChartLayout/oiComponent/oiChartTool/multiOi/MultiOiChart";
import { ChartTogglebutton, ChartToggleButtonType } from "@/lib/util/oi/oiUtil";
import StraddleStrangleOiChart from "@/components/shared/ChartLayout/oiComponent/oiChartTool/straddleStrangle/StraddleStrangleOiChart";
import PayoffTable from "@/components/shared/ChartLayout/optionFutures/PayoffTable";

import {
  getCachedApiData,
  getCalcData,
  getConsolidatedData,
  getExpiryValue,
  getLastApiCallTime,
  getQuery,
  getTempInputValues,
  setSelectedIndexName,
} from "@/lib/redux/slices/OptionChainSlice";
import {
  getDaysToExpiry,
  getInputValue,
  getMinExpiryDate,
  getMultiOiLoad,
  getPayOffChartPayLoad,
  getPayoffExpiryDate,
  getStraddleChartData,
  getStrangleOiLoad,
} from "@/lib/redux/slices/StrategyChartSlice";
import SumButton from "@/components/shared/ChartLayout/oiComponent/SumButton";

import Multiplier from "@/components/shared/ChartLayout/optionFutures/NewStrategyTable/Multiplier";
import LiveChart from "@/components/shared/ChartLayout/chartTool/LiveChart";
import {
  defaultChartData,
  defaultdate,
  defaultOiData,
  defaultProjectedPnl,
  defaultSpotPrice,
  defaultSpotPriceRoundOff,
} from "@/lib/util/analyzer/defaultchart/defaultChartData";
import { setSymbolIdentifier } from "@/lib/redux/slices/ChartsSlice";
import MaxPainStrike from "@/components/shared/ChartLayout/optionFutures/MaxPainStrike";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import TradingViewChart from "@/components/tradingView/TradingViewChart";
import { tvWidgetId } from "@/lib/util/toggleButtonName/toggleButtonNames";
import Nimabutton from "@/components/NimaAI/Nimabutton";
import { setNimaGpt, setScreenerQuery } from "@/lib/redux/slices/screenerSlice";
import {
  setCurrentSection,
  setScreenerOpen,
} from "@/lib/redux/slices/CommonSlice";
import { fetchMarketDays } from "@/lib/util/generalUtil";

const Strategies: React.FC = () => {
  const [brokerCode, setBrokerCode] = useState<number | null>(null);
  const [show, setShow] = useState<boolean>(false);
  const [showCreateWatchlist, setShowCreateWatchlist] =
    useState<boolean>(false);
  const [symbols, setSymbols] = useState<any[]>([]);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<number | null>(
    null,
  );
  const [apiKey, setApiKey] = useState<string>("");
  const stocks = useSelector((state: RootState) => state.strategy.stock);

  const dispatch = useDispatch();
  const [checkedOptionData, setCheckedOptionData] = useState<any>({});
  const [positionTableData, setpositionTableData] = useState<{
    [key: string]: any;
  }>({});
  const [entryPriceData, setEntryPriceData] = useState<
    Record<string, { entryPrice: number | null; type: string }>
  >({});
  const item = useSelector((state: RootState) => state.strategy.items);
  const [indexWiseTable, setIndexWiseTable] = useState({});
  const [pnlValue, setPnlValue] = useState(null);
  const [copiedData, setCopiedData] = useState<{ [key: string]: any }>([]);
  const spotPriceInfo = useSelector(
    (state: RootState) => state.strategy.spotPriceData,
  );
  const ltpData = useSelector((state: RootState) => state.strategy.ltpData);
  const strategyTable = useSelector(
    (state: RootState) => state.analyzer.setShowStrategyTable,
  );
  const PositionTable = useSelector(
    (state: RootState) => state.analyzer.setShowPositionTable,
  );
  const optionDatas = useSelector(
    (state: RootState) => state.analyzer.optionDataList,
  );
  const futureDatas = useSelector(
    (state: RootState) => state.analyzer.futureDataList,
  );
  const AllfutDatas = useSelector(
    (state: RootState) => state.strategy.indexFutureData,
  );
  const positionDatas = useSelector(
    (state: RootState) => state.analyzer.PositionDataList,
  );
  const chartPanel = useSelector((state: RootState) => state.charts.chartPanel);
  const [premium, setPremium] = useState(Number);
  const pnlTable = useSelector(
    (state: RootState) => state.analyzer.setShowPnlTable,
  );
  const [targetPayoffdata, settargetPayoffdata] = useState([]);
  const expiryDate = useSelector(
    (state: RootState) => state.strategy.expiryDate,
  );
  const [showlot, setShowlot] = useState(false);
  const [expiryPayload, setExpiryPayload] = useState<any>(null);
  const optionChainPayloadData: any = useSelector(
    (state: RootState) => state.analyzer.optionChainPayLoadData,
  );
  const indexname = useSelector((state: RootState) => state.strategy.indexName);
  const [targetDate, setTargetDate] = useState<any>();
  const showHeatMap = useSelector(
    (state: RootState) => state.charts.setShowHeatmap,
  );
  const [heatMapData, setHeatMapData] = useState<any>();
  const [clickedHeatmapData, setClickedHeatmapData] = useState<any>({});

  const [toggleOpt, setToggleOpt] = useState(true);

  const toggleState = useSelector(
    (state: RootState) => state.analyzer.toggleState,
  );
  const [DraftName, setDraftName] = useState<string>("");
  const DraftPositions = useSelector(
    (state: RootState) => state.analyzer.setShowDraftPositions,
  );
  const selectedStrategy = useSelector(
    (state: RootState) => state.analyzer.setselectedStrategy,
  );

  const SandboxData = useSelector(
    (state: RootState) => state.analyzer.setSandboxData,
  );
  const [draftData, setDraftData] = useState({});

  const [checkedPositionRows, setCheckedPositionRows] = useState<{
    [key: string]: boolean;
  }>({});
  const [addTable, setAddTable] = useState(false);
  const data: any = useSelector(
    (state: RootState) => state.analyzer.ChartDataList,
  );
  const AnalyzeOrderstock = useSelector(
    (state: RootState) => state.placeOrder.AnalyzeOrder,
  );
  const resolution = useSelector(
    (state: RootState) => state.charts.setTvResolution,
  );
  const brokerName = getBrokerName();
  const [triggerSpotPrice, setTriggerSpotPrice] = useState(false);
  const [PayoffTableOiChg, setPayoffTableOiChg] = useState("");
  const router: any = useNavigate();
  const Brokercode: any = useParams();
  const [isValid, setIsValid] = useState(false);
  const brokerData: any = sessionStorage.getItem("ExistbrokerCode");
  const [userId, setUserId] = useState("");
  const indexObjData: any = useSelector(
    (state: RootState) => state.strategy.indexObj,
  );
  const PAndL: any = useSelector(
    (state: RootState) => state.PayoffChart.cardResultData,
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const rawApiResponse: any = useSelector(
    (state: RootState) => state.strategy.rawIndexAPIresponse,
  );
  const netpercentage: any = useSelector(
    (state: RootState) => state.strategy.netChangepercent,
  );
  const reset = useSelector((state: RootState) => state.optionChain.reset);
  const ltp: any = useSelector((state: RootState) => state.strategy.ltpData);
  const currentExpiryOptionChainDataForHeatMap = useSelector(
    (state: RootState) =>
      state.optionChain.currentExpiryOptionChainDataForHeatMap,
  );
  const payOffChartPayLoad = useSelector(
    (state: RootState) => state.StrategyChart.payOffChartPayLoad,
  );
  const payoffExpiryDate = useSelector(
    (state: RootState) => state.StrategyChart.payoffExpiryDate,
  );
  const showPayoffchart = useSelector(
    (state: RootState) => state.analyzer.ShowPayOffChart,
  );
  const isMarketHoliday = useSelector(
    (state: RootState) => state.MarketBasis.isMarketHoliday,
  );
  useEffect(() => {
    dispatch(getExpiryValue(expiryDate));
  }, [expiryDate]);

  const oiPercent = useSelector(
    (state: RootState) => state.optionChain.oiPercent,
  );
  const calcData = useSelector(
    (state: RootState) => state.optionChain.calcData,
  );
  const oiValue = useSelector((state: RootState) => state.optionChain.oiValue);

  const [active, setActive] = useState(ChartToggleButtonType.Chart);
  const straddleChartData = useSelector(
    (state: RootState) => state.StrategyChart.straddleChartData,
  );
  const strangleOiLoad = useSelector(
    (state: RootState) => state.StrategyChart.strangleOiLoad,
  );
  const multiOiLoad = useSelector(
    (state: RootState) => state.StrategyChart.multiOiLoad,
  );
  const [targetSpotPrice, setTargetSpotPrice] = useState<any>();
  const [payoffdata, setPayoffdata] = useState([]);
  const [expandOptTable, setExpandOptTable] = useState(false);
  const queryIdentifier = useSelector(
    (state: RootState) => state.optionChain.queryIdentifier,
  );
  const query = useSelector((state: RootState) => state.optionChain.query);
  const [isSumSelected, setIsSumSelected] = useState(true);
  const intervalRef: any = useRef<any>(null);
  const queryRef = useRef(query);
  const isInitialRender = useRef(true);

  const [processedIndexes, setProcessedIndexes] = useState<boolean>(false);

  const Payoffstrategy = useSelector(
    (state: RootState) => state.Screener.PayoffStrategyName,
  );
  const expiryValue = useSelector(
    (state: RootState) => state.optionChain.expiryValue,
  );
  const WebsocketLtpRef = useRef(webSocketDataRead);
  const [orderExecuteFromOptionChain, setOrderExecuteFromOptionChain] =
    useState<boolean>(false);
  const [enableOptButtons, setEnableOptButtons] = useState(true);
  const inputValue = useSelector(
    (state: RootState) => state.StrategyChart.inputValue,
  );

  const [querySpotPrice, setQuerySpotPrice] = useState<any>(null);
  const lastQueryRef = useRef<string | null>(null);
  const spotPriceSetRef = useRef(false);

  useEffect(() => {
    validateBrokerCode(
      Brokercode,
      brokerData,
      router,
      setBrokerCode,
      setIsValid,
    );
  }, [Brokercode, router]);

  const fetchDataAll = () => {
    const fetchApi = new UserBrokerRouterApi(baseConfig());
    fetchApi
      .fetchMyBrokerV1UsersMeBrokersBrokerCodeGet(brokerCode)
      .then((response) => {
        setUserId(response?.data?.user_broker_mapping.user_id.toString());
        const apiKey = response?.data?.broker_meta?.api_key;
        const brokername = response?.data?.broker_meta?.name;
        sessionStorage.setItem("brokerName", brokername);
        setApiKey(apiKey);
      })
      .catch((error) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  };

  useEffect(() => {
    if (brokerCode != null) {
      fetchDataAll();
    }
  }, [brokerCode]);

  useEffect(() => {
    const fetchAndSetData = async () => {
      if (stocks && stocks?.index_name?.length > 0) {
        dispatch(getQuery(stocks?.index_name));
        dispatch(setSelectedIndexName(stocks.index_name));
      }
    };

    fetchAndSetData();
  }, [stocks, item]);

  useEffect(() => {
    if (stocks && stocks?.index_name?.length == 0) {
      dispatch(getQuery("NIFTY"));
    }
  }, []);

  // useEffect(() => {
  //   const ltpPayload = processAndDispatchLtpData(ltpData, dispatch); //To set the live ltp for the identifiers in the redux(Don't remove code)
  // }, [ltpData]);
  useEffect(() => {
    const updateFutLtp = updateReduxWithFutureData(AllfutDatas, dispatch); //Setting the ltp for futures in redux (Don't remove code)
  }, [AllfutDatas]);

  useEffect(() => {
    if (!config.OIindices) return;
    Object.values(config.OIindices)?.forEach((identifier) => {
      dispatch(
        addSymbol({
          symbol: identifier,
        }),
      );
    });
  }, []);
  //For passing spotprice to get indices full data API
  useEffect(() => {
    if (!query) return;

    // New query detected → reset flag
    if (query !== lastQueryRef.current) {
      lastQueryRef.current = query;
      spotPriceSetRef.current = false;
    }

    // Already set for this query → do nothing
    if (spotPriceSetRef.current) return;

    const identifier = getIdentifierFromQuery(query);
    if (!identifier) return;

    const spotPrice = WebsocketLtpRef.current?.[identifier];
    if (spotPrice == null) return;

    setQuerySpotPrice(spotPrice);
    spotPriceSetRef.current = true;
  }, [query, webSocketDataRead]);

  const fetchData = (
    brokerCode: any,
    query: any,
    querySpotprice: any,
    booleanState: any,
  ) => {
    const getAllDataApi = new UserBrokerRouterApi(baseConfig());
    if (!query?.length) return;
    getAllDataApi
      .getIndicesFullDataFromDbV1UsersMeBrokersBrokerCodeGetIndicesFullDataFromDbIndexNameGet(
        brokerCode,
        query,
        querySpotprice,
        booleanState,
      )
      .then((res: any) => {
        setQuerySpotPrice(null);
        dispatch(setIndexRawApiResponse(res?.data));
        setProcessedIndexes(false);

        dispatch(
          addSymbol({
            symbol: res?.data?.index_obj?.identifier,
            // token: res.data.index_obj.token,
          }),
        );
        Object.keys(res?.data?.option_chain || {}).forEach((expiry) => {
          const strikes = res?.data?.option_chain[expiry];

          Object.keys(strikes)?.forEach((strike) => {
            const options = strikes[strike]; // array of CE & PE objects

            options?.forEach((opt) => {
              dispatch(
                addSymbol({
                  symbol: opt?.identifier, // pick identifier
                  // token: opt.token, // pick token
                }),
              );
            });
          });
        });
        res?.data?.futures_data?.forEach((future: any) => {
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
  const updateData = () => {
    const indexId: any = rawApiResponse?.index_obj?.identifier;
    const indexspotPrice = indexId && webSocketDataRead[indexId];
    // Run only if this index is not already processed and WS data is available
    if (indexId && indexspotPrice) {
      const {
        option_chain,
        futures_data,
        lot_size,
        index_obj,
        expiry_dates,
        index_data,
        name,
      } = rawApiResponse;
      const enrichedOptionChain = enrichOptionChain(
        option_chain,
        WebsocketLtpRef.current,
        netpercentage,
      );
      const enrichedFutures: any = enrichFutures(
        futures_data,
        lot_size,
        WebsocketLtpRef.current,
        netpercentage,
      );

      dispatch(
        indicesAlldata({
          symbol: name ?? "",
          // tokenLtpData: res.data.option_chain,
          tokenLtpData: enrichedOptionChain ?? {},
          expiryDate: expiry_dates ?? [],
          addonData: index_data ?? {},
          futureData: enrichedFutures ?? [],
          spotPrice: indexspotPrice ?? null,
          indexData: index_obj ?? {},
          lotSize: lot_size ?? 0,
        }),
      );
      dispatch(
        addCartSuccess({
          items: {
            exchange: index_obj.exchange ?? "",
            index_name: name ?? "",
            // spot_price: res.data.spot_price,
            spot_price: indexspotPrice ?? null,
            expiryDate: "",
          },
        }),
      );

      // Sort and dispatch first fut
      const sortedFuts =
        futures_data?.length > 0
          ? [...futures_data]?.sort((a, b) =>
              new Date(a?.expiry) > new Date(b?.expiry) ? 1 : -1,
            )
          : [];
      if (sortedFuts.length > 0) {
        dispatch(
          setIndexFirstFutData({
            IndexFirstFutData: sortedFuts[0] ?? "",
            FutIndexName: indexId ?? "",
          }),
        );
      }
    }
    //  Mark this index as processed so it won’t repeat
  };

  useEffect(() => {
    if (!rawApiResponse) return;
    const indexId: any = rawApiResponse?.index_obj?.identifier;
    if (indexId && webSocketDataRead[indexId] && !processedIndexes) {
      updateData();
      setProcessedIndexes(true);
    }
    if (WebsocketLtpRef) {
      WebsocketLtpRef.current = webSocketDataRead;
    }
  }, [rawApiResponse, webSocketDataRead]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false; // skip first run
      return;
    }
    if (brokerCode !== null && query && query?.length > 0) {
      const identifier = getIdentifierFromQuery(query);
      if (!identifier) return;
      const spotPrice = WebsocketLtpRef.current?.[identifier];
      if (spotPrice != null) fetchData(brokerCode, query, spotPrice, false);
    }
  }, [reset]);
  useEffect(() => {
    const fetchAndSetData = async () => {
      if (stocks && stocks?.index_name?.length > 0) {
        dispatch(getInputValue(spotPriceInfo));
      }
    };
    fetchAndSetData();
  }, [stocks, item]);

  const handleMinExpiryDateChange = (minDate: Date | null) => {
    // Check if minDate is valid
    if (minDate && !isNaN(minDate.getTime())) {
      const day = minDate.getDate().toString().padStart(2, "0");
      let month = minDate
        .toLocaleString("default", { month: "short" })
        .substring(0, 3)
        .toUpperCase();
      const year = minDate.getFullYear().toString();
      const formattedDate = `${day}${month}${year}`;
      if (formattedDate != payoffExpiryDate) {
        dispatch(setOiChartCall(true));
      }

      dispatch(getPayoffExpiryDate(formattedDate));
      dispatch(getMinExpiryDate(minDate));
    }
  };

  useEffect(() => {
    setCopiedData(
      manageOrders(
        JSON.parse(JSON.stringify({ ...optionDatas, ...futureDatas })),
        webSocketDataRead,
      ),
    );
  }, [optionDatas, futureDatas]);

  useEffect(() => {
    if (Object.keys(copiedData).length == 0) {
      dispatch(getOptTargetltpData({ OptTargetLtpData: {} }));
      dispatch(getFutTargetltpData({ FutTargetLtpData: {} }));
      dispatch(getPayOffChartPayLoad({}));
      dispatch(getStrangleOiLoad({}));
      dispatch(getMultiOiLoad([]));
      dispatch(checkPosition(false));
    }
  }, [copiedData]);

  useEffect(() => {
    if (
      Object.keys(copiedData).length == 0 &&
      Object.entries(optionChainPayloadData?.response).length > 0 &&
      Object.keys(optionDatas).length > 0 &&
      indexname.length == 0
    ) {
      dispatch(getUpdatedTargetltpData({ targetltpData: {} }));
      dispatch(getPayOffChartPayLoad({}));
      dispatch(getMultiOiLoad([]));
      dispatch(getStrangleOiLoad({}));
      dispatch(checkPosition(false));
      dispatch(
        optionChainPayload({
          optionChainPayloadData: { ClickedRow: {}, response: {} },
        }),
      );
    }
  }, [ltp]);

  const handleHeatMap = () => {
    dispatch(showHeatmap(true));
  };

  useEffect(() => {
    setHeatMapData(
      extractAndSortOptions(
        currentExpiryOptionChainDataForHeatMap,
        oiPercent,
        oiValue,
        toggleState,
        webSocketDataRead,
        netpercentage,
      ),
    );
  }, [currentExpiryOptionChainDataForHeatMap, showHeatMap, toggleState]);

  useEffect(() => {
    if (clickedHeatmapData != undefined && clickedHeatmapData != null) {
      const key = clickedHeatmapData.strike_price + ".0";
      const hash = getHashKey(
        key,
        clickedHeatmapData.option_type,
        clickedHeatmapData.expiry,
      );
      const transactionType = clickedHeatmapData.y >= 0 ? "LONG" : "SHORT";
      const buttonType = clickedHeatmapData.y >= 0 ? "BUY" : "SELL";
      dispatch(
        getConsolidatedData({
          hash,
          clickedHeatmapData,
          transactionType,
          buttonType,
        }),
      );
    }
  }, [clickedHeatmapData]);

  useEffect(() => {
    if (
      checkedOptionData &&
      Object.keys(checkedOptionData)?.length === 0 &&
      positionDatas &&
      Object.keys(positionDatas)?.length === 0
    ) {
      settargetPayoffdata([]);
      setActive(ChartToggleButtonType.Chart);
      dispatch(getStraddleChartData({}));
      dispatch(getMultiOiLoad([]));
    }
  }, [checkedOptionData, positionDatas]);

  const handleButtonClickExpand = () => {
    setExpandOptTable(!expandOptTable); // Hide the table overlay
  };

  useEffect(() => {
    if (
      Object.entries(optionDatas).length == 0 &&
      Object.entries(futureDatas).length == 0 &&
      Object.entries(positionDatas).length == 0 &&
      selectedStrategy == null
    ) {
      dispatch(cardResult({}));
      dispatch(marginRequired(null));

      dispatch(premiumData(null));
      dispatch(getCalcData([]));
      dispatch(getStraddleChartData({}));
      dispatch(getMultiOiLoad([]));
    }
  }, [query]);

  useEffect(() => {
    if (
      Object.entries(optionDatas).length == 0 &&
      Object.entries(futureDatas).length == 0 &&
      Object.entries(positionDatas).length == 0 &&
      selectedStrategy == null
    ) {
      setActive(ChartToggleButtonType.Chart);
    }
  }, [optionDatas, futureDatas, positionDatas, selectedStrategy]);

  useEffect(() => {
    if (
      expiryDate &&
      expiryDate.length > 0 &&
      stocks &&
      stocks?.index_name?.length > 0
    )
      dispatch(getExpiryValue(expiryDate));
  }, [expiryDate]); //To change expiry in optionchain to the expiry in place order  when Analyze in place order

  useEffect(() => {
    dispatch(getPayOffChartPayLoad({}));
    dispatch(getMultiOiLoad([]));
    dispatch(getStrangleOiLoad({}));
  }, [AnalyzeOrderstock]);

  useEffect(() => {
    if (
      Object.entries(item).length > 0 &&
      Object.entries(payOffChartPayLoad).length > 0 &&
      item?.index_name?.length > 0 &&
      item?.index_name != ""
    )
      setTriggerSpotPrice(true);
    else setTriggerSpotPrice(false);
  }, [item?.index_name]); //For triggering Payoff chart when Click analyze from Basket

  useEffect(() => {
    if (
      brokerName != null &&
      brokerName.toLowerCase() == "fyers" &&
      (resolution == "D" || resolution == "1D" || resolution == "")
    ) {
      dispatch(setShowTvResolution("60"));
    } else {
      if (resolution == "" && brokerName.toLowerCase() !== "fyers")
        dispatch(setShowTvResolution("D"));
      else dispatch(setShowTvResolution(resolution));
    }
  }, [brokerName]);

  const handleclearStrategy = () => {
    dispatch(setSandboxDataObj({ setSandboxData: {} }));
    dispatch(setAnalyzeOrderStocks({}));
    if (
      Object.entries(optionDatas)?.length == 0 &&
      Object.entries(futureDatas)?.length == 0 &&
      Object.entries(positionDatas)?.length > 0
    ) {
      dispatch(showPositionTable(true));
      dispatch(showStrategyTable(false));
      dispatch(showPnlTable(false));
      dispatch(showDraftPositions(false));
    }

    if (
      Object.entries(optionDatas)?.length > 0 ||
      Object.entries(futureDatas)?.length > 0
    ) {
      if (
        (Object.entries(optionDatas)?.length > 0 ||
          Object.entries(futureDatas)?.length > 0) &&
        Object.entries(positionDatas)?.length == 0
      ) {
        setTimeout(() => {
          dispatch(getPayOffChartPayLoad({}));
          dispatch(getMultiOiLoad([]));
          dispatch(getStrangleOiLoad({}));
          dispatch(getMinExpiryDate(null));
          setExpiryPayload(null);
          dispatch(getInputValue(null));

          dispatch(setSelectedStrategy({ setselectedStrategy: null }));
          dispatch(getOptionData({ optionData: {} }));
          dispatch(getFutureData({ futureData: {} }));
          dispatch(getCalcData([]));
          dispatch(getStraddleChartData({}));
          dispatch(getOptTargetltpData({ OptTargetLtpData: {} }));
          dispatch(getFutTargetltpData({ FutTargetLtpData: {} }));
          dispatch(
            optionChainPayload({
              optionChainPayloadData: { ClickedRow: {}, response: {} },
            }),
          );
          dispatch(getTempInputValues({}));
          setEntryPriceData({});

          setCheckedOptionData({});
          dispatch(cardResult({}));
          dispatch(marginRequired(null));
          dispatch(getCachedApiData([]));
          dispatch(getLastApiCallTime(0));
        }, 100);
      }
      setTimeout(() => {
        dispatch(getOptionData({ optionData: {} }));
        dispatch(getFutureData({ futureData: {} }));
        dispatch(getOptTargetltpData({ OptTargetLtpData: {} }));
        dispatch(getFutTargetltpData({ FutTargetLtpData: {} }));
        if (Object.entries(positionDatas)?.length > 0) {
          dispatch(showPositionTable(true));
          dispatch(showStrategyTable(false));
          dispatch(showPnlTable(false));
          dispatch(showDraftPositions(false));
        }
        dispatch(
          optionChainPayload({
            optionChainPayloadData: { ClickedRow: {}, response: {} },
          }),
        );
        dispatch(getTempInputValues({}));
        setEntryPriceData({});

        setCheckedOptionData({});
        setActive(ChartToggleButtonType.Chart);
      }, 100);
    }
  };

  useEffect(() => {
    if (DraftPositions) {
      setActive(ChartToggleButtonType.Chart);
    }
  }, [DraftPositions]);

  // keep ref updated whenever Redux state changes
  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    }
    const fetchIfTradingTime = () => {
      const latestQuery = queryRef.current;
      if (
        config.isTradingTime() &&
        brokerCode != null &&
        latestQuery &&
        latestQuery?.length > 0 &&
        !isMarketHoliday
      ) {
        // updateData();
        const identifier = getIdentifierFromQuery(latestQuery);
        if (!identifier) return;
        const spotPrice = WebsocketLtpRef.current?.[identifier];

        if (spotPrice != null)
          fetchData(brokerCode, latestQuery, spotPrice, false);
      }
    };

    intervalRef.current = setInterval(fetchIfTradingTime, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      intervalRef.current = null;
    };
  }, [brokerCode]);

  // for trigger initiall trigger the api for pnl date change
  useEffect(() => {
    if (indexname && brokerCode !== null) {
      if (querySpotPrice != null)
        fetchData(brokerCode, query, querySpotPrice, false);
    }
  }, [brokerCode, querySpotPrice, query]);

  //initial render or psb re-render When option datas and future datas is empty,that time show opt table
  useEffect(() => {
    if (
      (Object.entries(optionDatas).length == 0 ||
        Object.entries(futureDatas).length == 0) &&
      Object.entries(optionChainPayloadData?.response).length == 0
    ) {
      setAddTable(true);
    }
  }, []);

  useEffect(() => {
    if (checkedOptionData && Object.entries(checkedOptionData).length > 0) {
      setEnableOptButtons(true);
    } else {
      setEnableOptButtons(false);
    }
  }, [checkedOptionData]);

  const NimaClick = () => {
    if (indexname) {
      dispatch(
        setScreenerQuery(`Give a detailed fno analysis for ${indexname}`),
      );
      dispatch(setNimaGpt("fno"));
      dispatch(setScreenerOpen(true));
      dispatch(setCurrentSection(null));
    }
  };
  const minExpiryDate = useSelector(
    (state: RootState) => state.StrategyChart.minExpiryDate,
  );
  useEffect(() => {
    if (minExpiryDate) {
      const daysToExpirys = getDaysBetween(new Date(), minExpiryDate);

      setExpiryPayload(daysToExpirys);

      dispatch(getDaysToExpiry(daysToExpirys));
      if (inputValue == null) {
        dispatch(getInputValue(spotPriceInfo));
      }
    }
  }, [minExpiryDate, chartPanel]);

  //  If isMarketHoliday is true, do not get data from this API; otherwise, make the API call.
  useEffect(() => {
    if (isMarketHoliday == null) {
      fetchMarketDays(dispatch, router);
    }
  }, []);

  if (!isValid) {
    return null; // Prevent further rendering if invalid
  }

  return (
    <CommonLayOut
      show={show}
      showCreateWatchlist={showCreateWatchlist}
      setShow={setShow}
      setShowCreateWatchlist={setShowCreateWatchlist}
      selectedWatchlistId={selectedWatchlistId}
      symbols={symbols}
      apiKey={apiKey}
      setEntryPriceData={setEntryPriceData}
      setCheckedOptionData={setCheckedOptionData}
      setExpiryPayload={setExpiryPayload}
      setDraftName={setDraftName}
      draftData={draftData}
      brokerCode={brokerCode}
      setBrokerCode={setBrokerCode}
      setToggleOpt={setToggleOpt}
      userId={userId}
    >
      <div className="relative flex flex-col justify-start  max-xl:h-full max-xl:w-full max-xl:overflow-y-auto max-xl:overflow-x-hidden max-xl:scrollbar-none xl:h-[calc(100dvh-(9.5%))] xl:w-[100%] xl:overflow-y-hidden">
        {/* 1st row */}
        <div
          className={`   flex   max-xl:flex-col-reverse  sm:w-full xl:h-[3rem] xl:flex-row xl:justify-end ${
            toggleOpt ? "max-sm:mb-[0.3rem] max-sm:h-[2rem]" : " "
          }  `}
        >
          {/* 1st row 1st col */}
          {(Object.keys(optionDatas)?.length > 0 ||
            Object.keys(futureDatas)?.length > 0 ||
            Object.keys(positionDatas)?.length > 0 ||
            (SandboxData && Object.entries(SandboxData)?.length > 0) ||
            (selectedStrategy && Object.keys(selectedStrategy)?.length > 0)) &&
            Object.entries(PAndL)?.length > 0 &&
            showPayoffchart != false &&
            calcData?.length > 0 && (
              <div
                className={` ${!Payoffstrategy ? "block" : "hidden"} flex items-center justify-center  max-xl:w-full  sm:max-md:h-[5rem] md:max-lg:h-[7rem] lg:max-xl:h-[8rem] xl:h-full  xl:w-[56%] 2xl:w-[50%] ${
                  toggleOpt
                    ? "max-xl:hidden"
                    : "max-md:mt-[3rem] md:max-xl:mt-[1.3rem] "
                } `}
              >
                <ChartCards />
              </div>
            )}
          {/* 1st row 1st col */}
          {/* 1st row 2nd cal */}
          <div className="flex flex-col bg-white  max-xl:fixed max-xl:top-[8%] max-xl:z-[100] max-xl:w-full max-xl:border-b-2 max-xl:border-t-2 max-xl:border-solid max-xl:border-gray-200 max-sm:h-[5%] sm:max-md:h-[2.8rem] md:max-xl:h-[3.3rem] xl:mt-1 xl:h-full xl:max-2xl:w-[44%] 2xl:w-[50%]">
            <span className="flex w-full items-center rounded-lg bg-white bg-opacity-80 max-xl:h-full max-xl:justify-between xl:h-[2.7rem] xl:justify-start xl:shadow-xl">
              <div className="flex w-full flex-row items-center max-sm:gap-1 max-sm:py-2 sm:max-xl:px-[0.3rem] sm:max-lg:gap-2 lg:max-xl:gap-3 xl:justify-between">
                <span className="flex h-full flex-row items-center   max-sm:w-[80%]  max-sm:justify-start max-sm:gap-[0.2rem] sm:max-xl:justify-start sm:max-xl:gap-[2rem] sm:max-lg:w-[86%] sm:max-lg:pr-2  lg:max-xl:w-[80%]  lg:max-xl:pr-2.5 xl:justify-start xl:max-2xl:w-[86.4%] xl:max-2xl:gap-2 2xl:w-[70%] 2xl:gap-5">
                  <IndexChanger
                    brokerCode={brokerCode}
                    setExpiryPayload={setExpiryPayload}
                    setActive={setActive}
                    avoidRepeatCall={true}
                  />

                  {/* Only visible on below-xl screens and shows TV chart in usual way */}
                  <span className=" block xl:hidden">
                    <CandleIcon
                      className=" flex cursor-pointer items-center justify-center rounded max-sm:h-[1.2rem] max-sm:w-[1.2rem] max-sm:p-[0.2rem] md:max-xl:h-[1.2rem] md:max-xl:w-[1.2rem] xl:h-[1.35rem] xl:w-[1.35rem]"
                      onClick={() => {
                        dispatch(setChartIconClicked(true));
                        if (
                          indexObjData &&
                          Object.entries(indexObjData).length > 0
                        ) {
                          handlePopUp(indexObjData, dispatch);
                        }
                      }}
                    />
                  </span>

                  {/* Only visible on xl and above-xl screens and has different way of showing TV chart */}
                  <span className="hidden xl:block">
                    {chartPanel ? (
                      <div
                        onClick={() => {
                          dispatch(setChartIconClicked(false));
                          dispatch(setChartPanel(false));
                        }}
                        className="group relative flex cursor-pointer items-center justify-center rounded max-sm:h-[1.2rem] max-sm:w-[1.2rem] max-sm:p-[0.2rem] md:max-xl:h-[1.2rem] md:max-xl:w-[1.2rem] xl:h-[1.35rem] xl:w-[1.35rem]"
                      >
                        <img
                          src="/svg/analyze.svg"
                          width={16}
                          height={16}
                          alt=""
                        />
                        <span className="absolute top-5 rounded bg-gray-800 px-1 text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 ">
                          Analyze
                        </span>
                      </div>
                    ) : (
                      <CandleIcon
                        className="flex cursor-pointer items-center justify-center rounded max-sm:h-[1.2rem] max-sm:w-[1.2rem] max-sm:p-[0.2rem] md:max-xl:h-[1.2rem] md:max-xl:w-[1.2rem] xl:h-[1.35rem] xl:w-[1.35rem]"
                        onClick={() => {
                          dispatch(setChartIconClicked(true));
                          dispatch(setChartPanel(true));
                          if (
                            indexObjData &&
                            Object.entries(indexObjData).length > 0
                          ) {
                            dispatch(
                              setSymbolIdentifier(indexObjData?.identifier),
                            );
                          }
                        }}
                      />
                    )}
                  </span>

                  <IndexChangerIconButton
                    handleHeatMap={handleHeatMap}
                    svg={"/svg/heatmap.svg"}
                    name={"Premium Map"}
                  />

                  <span>
                    <MaxPainStrike />
                  </span>
                </span>
                {/* Only for Small Screen  */}

                {/* Only for Small Screen */}
                {/* Only for Small Screen  */}
                <span className="xl:hidden">
                  <ToggleChartAndOptButton
                    toggleOpt={toggleOpt}
                    setToggleOpt={setToggleOpt}
                  />
                </span>
                {/* Only for Small Screen */}

                <span className="flex flex-row items-center gap-2">
                  <span className="max-2xl:hidden 2xl:flex">
                    <Nimabutton onClick={NimaClick} disabled={!indexname} />
                  </span>

                  <FutureStocks setEntryPriceData={setEntryPriceData} />
                </span>
              </div>
              {showHeatMap && (
                <HeatMap
                  HeatMapData={heatMapData}
                  displayedName={indexname}
                  setClickedHeatmapData={setClickedHeatmapData}
                  expiryValue={expiryValue}
                />
              )}
            </span>
          </div>
          {/* 1st row 2nd cal */}
        </div>
        {/* 1st row */}
        {/* 2nd roww */}
        <div
          className={`${chartPanel ? "xl:h-[100%]" : "xl:h-[85%]"} flex w-full    max-xl:flex-col-reverse max-xl:items-start max-xl:gap-1 max-sm:h-full xl:flex-row   ${
            toggleOpt
              ? "max-xl:h-screen max-xl:overflow-y-auto max-xl:scrollbar-none max-sm:mt-[1rem] max-sm:pb-[5rem] sm:max-xl:mt-[2.5rem] sm:max-xl:pb-[9rem]"
              : "max-xl:min-h-max max-sm:mb-[4rem] max-sm:pt-1 sm:max-xl:mb-[8rem] "
          } `}
        >
          {/* row of xl and 1st col of below xl */}
          <div
            className={` max-sm:oveflow-y-auto flex  w-[100%] 
            max-xl:flex-col  max-xl:items-center max-lg:items-center xl:h-[100%]   xl:flex-row  `}
          >
            {/* chart side part*/}
            <div
              className={` flex  flex-col  items-center gap-[0.01rem]  max-xl:w-[100%]
            max-xl:items-center lg:px-2 xl:w-[56%] xl:justify-center  2xl:w-[50%] ${toggleOpt ? "max-xl:hidden" : ""}`}
            >
              {!chartPanel &&
                (Object.keys(optionDatas)?.length > 0 ||
                  Object.keys(futureDatas)?.length > 0 ||
                  Object.keys(positionDatas)?.length > 0 ||
                  (SandboxData && Object.entries(SandboxData)?.length > 0) ||
                  (selectedStrategy &&
                    Object.keys(selectedStrategy)?.length > 0)) && (
                  // showPayoffchart != false &&
                  // (calcData?.length > 0 ||
                  //   Object.entries(straddleChartData).length > 0 ||
                  //   multiOiLoad?.length > 0) && (
                  <div
                    className={`flex w-[100%] items-center justify-center max-sm:flex-col sm:gap-2 sm:max-lg:mt-3 md:max-xl:mb-3 xl:items-start xl:justify-start xl:gap-3 ${Payoffstrategy ? "hidden" : "block"}`}
                  >
                    <div className="mt-2 flex justify-center gap-2 overflow-hidden rounded-3xl border border-gray-300 px-1 py-1">
                      {ChartTogglebutton.map((btn, index) => {
                        if (DraftPositions && (index === 1 || index === 2)) {
                          return null; // completely skip rendering
                        }
                        return (
                          <button
                            key={btn.id}
                            onClick={() => setActive(btn.type)}
                            className={`rounded-3xl px-2 py-1 text-[0.75rem] font-medium transition-colors ${
                              active === btn.type
                                ? "bg-z-green-500 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {btn.label}
                          </button>
                        );
                      })}
                    </div>
                    <div
                      className={`mt-2 flex justify-center  py-2  ${active == ChartToggleButtonType.MultiStraddle ? "block max-sm:hidden" : "hidden"}`}
                    >
                      <SumButton
                        setIsSumSelected={setIsSumSelected}
                        isSumSelected={isSumSelected}
                      />
                    </div>
                  </div>
                )}

              {active == ChartToggleButtonType.Chart ? (
                <>
                  {Object.keys(optionDatas).length > 0 ||
                  Object.keys(futureDatas).length > 0 ||
                  Object.keys(positionDatas).length > 0 ||
                  (SandboxData && Object.entries(SandboxData).length > 0) ||
                  (selectedStrategy &&
                    Object.keys(selectedStrategy).length > 0) ||
                  (AnalyzeOrderstock &&
                    Object.keys(AnalyzeOrderstock).length > 0) ? (
                    <div
                      className={`${chartPanel ? "border border-gray-200 xl:h-[98%]" : "h-[93%]"} flex w-[100%]  flex-col gap-[0.5rem]  max-xl:min-h-[100%] max-xl:w-[90%] max-xl:px-2 max-sm:mt-4 max-sm:min-h-[20rem] sm:max-lg:mt-[1rem] sm:max-md:min-h-[30rem] md:max-xl:mb-0
                md:max-lg:min-h-[30rem] lg:max-xl:min-h-[30rem] xl:items-center xl:justify-center`}
                    >
                      {chartPanel ? (
                        <TradingViewChart
                          brokerCode={brokerCode}
                          userId={userId}
                          chartId={tvWidgetId.MAINCHART}
                        />
                      ) : (
                        <StrategyChart
                          brokerCode={brokerCode}
                          checkedOptionData={checkedOptionData}
                          expiryPayload={expiryPayload}
                          setExpiryPayload={setExpiryPayload}
                          settargetPayoffdata={settargetPayoffdata}
                          triggerSpotPrice={triggerSpotPrice}
                          query={query}
                          targetSpotPrice={targetSpotPrice}
                          setPayoffdata={setPayoffdata}
                          setTargetSpotPrice={setTargetSpotPrice}
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      className={`${chartPanel ? "border border-gray-200 xl:h-[98%]" : "xl:h-[93%]"} flex  w-[100%] flex-col gap-[0.5rem]  bg-gray-100 backdrop-blur-3xl max-xl:min-h-[100%] max-xl:w-[90%] max-xl:px-2  max-sm:min-h-[24rem] max-sm:pb-[2.5rem]
                sm:max-xl:pb-[2.5rem] sm:max-xl:pt-[4rem] sm:max-md:min-h-[30rem] md:max-xl:mb-0 md:max-lg:min-h-[30rem] lg:max-xl:min-h-[30rem] xl:items-center xl:justify-center`}
                    >
                      {
                        chartPanel ? (
                          <TradingViewChart
                            brokerCode={brokerCode}
                            userId={userId}
                            chartId={tvWidgetId.MAINCHART}
                          />
                        ) : (
                          <LiveChart
                            data={defaultChartData}
                            spotPrice={defaultSpotPrice}
                            projectedPnl={defaultProjectedPnl}
                            targetSpotPrice={defaultSpotPriceRoundOff}
                            oiData={defaultOiData}
                            payoffExpiryDate={defaultdate}
                            defaultChartToolTip={false}
                          />
                        )
                        // {/* default chart */}
                      }
                    </div>
                  )}
                </>
              ) : active == ChartToggleButtonType.MultiOI ? (
                <div
                  className={`  ${chartPanel ? "h-[98%] border border-gray-200" : "h-[95%]"}  w-[100%] w-full max-xl:mb-3 max-xl:min-h-[100%] max-xl:w-[90%] max-sm:mt-4 max-sm:min-h-[20rem] sm:max-lg:mt-[1rem] sm:max-md:min-h-[30rem] md:max-lg:min-h-[30rem] lg:max-xl:min-h-[30rem]
                   ${toggleOpt ? "max-xl:hidden" : ""}
        `}
                >
                  {chartPanel ? (
                    <TradingViewChart
                      brokerCode={brokerCode}
                      userId={userId}
                      chartId={tvWidgetId.MAINCHART}
                    />
                  ) : Object.keys(optionDatas).length > 0 ||
                    Object.keys(futureDatas).length > 0 ||
                    Object.keys(positionDatas).length > 0 ||
                    (SandboxData && Object.entries(SandboxData).length > 0) ||
                    (selectedStrategy &&
                      Object.keys(selectedStrategy).length > 0) ||
                    (AnalyzeOrderstock &&
                      Object.keys(AnalyzeOrderstock).length > 0) ? (
                    <MultiOiChart
                      oiLoad={multiOiLoad}
                      query={query}
                      brokerCode={brokerCode}
                      oiExpiry={payoffExpiryDate}
                      selected={5}
                      queryIdentifier={queryIdentifier}
                      showMultiOi={true}
                    />
                  ) : (
                    <div
                      className={`flex w-[100%]  items-center justify-center font-medium text-gray-400 max-sm:min-h-[10rem] xl:h-[95%]`}
                    >
                      select buy/sell
                    </div>
                  )}
                </div>
              ) : active == ChartToggleButtonType.MultiStraddle ? (
                <div
                  className={`  ${chartPanel ? "h-[98%] border border-gray-200" : "h-[95%]"}  w-[100%] w-full max-xl:min-h-[100%] max-xl:w-[90%] max-sm:mb-3 max-sm:mt-4 max-sm:min-h-[20rem] sm:max-lg:mt-[1rem] sm:max-md:min-h-[30rem] md:max-xl:mb-3 md:max-lg:min-h-[30rem] lg:max-xl:min-h-[30rem]
                   ${toggleOpt ? "max-xl:hidden" : ""}
        `}
                >
                  {chartPanel ? (
                    <TradingViewChart
                      brokerCode={brokerCode}
                      userId={userId}
                      chartId={tvWidgetId.MAINCHART}
                    />
                  ) : Object.keys(optionDatas).length > 0 ||
                    Object.keys(futureDatas).length > 0 ||
                    Object.keys(positionDatas).length > 0 ||
                    (SandboxData && Object.entries(SandboxData).length > 0) ||
                    (selectedStrategy &&
                      Object.keys(selectedStrategy).length > 0) ||
                    (AnalyzeOrderstock &&
                      Object.keys(AnalyzeOrderstock).length > 0) ? (
                    <StraddleStrangleOiChart
                      showMultiStraddle={true}
                      oiExpiry={payoffExpiryDate}
                      straddlePayload={strangleOiLoad}
                      brokerCode={brokerCode}
                      queryIdentifier={queryIdentifier}
                      selected={5}
                      isSumSelected={isSumSelected}
                      oiLoad={multiOiLoad}
                      checkedStrangleRows={strangleOiLoad}
                      straddleChartData={straddleChartData}
                      activeStraddleButton={"strangle"}
                    />
                  ) : (
                    <div
                      className={`flex w-[100%]  items-center justify-center font-medium text-gray-400 max-sm:min-h-[10rem] xl:h-[95%] `}
                    >
                      select buy/sell
                    </div>
                  )}
                </div>
              ) : (
                active == ChartToggleButtonType.PayoffTable && (
                  <div
                    className={`${chartPanel ? "h-[98%] border border-gray-200 xl:mt-0 xl:w-[100%] " : "h-[94%] xl:mt-3 xl:w-[95%]"} flex   w-[100%] w-full  items-center  justify-center  max-xl:mb-3 max-xl:w-[90%] max-sm:mt-4 max-sm:h-[20rem] sm:max-lg:mt-[1rem]  sm:max-md:h-[25rem] md:max-lg:h-[25rem] lg:max-xl:h-[30rem] ${toggleOpt ? "max-xl:hidden" : ""}`}
                  >
                    {chartPanel ? (
                      <TradingViewChart
                        brokerCode={brokerCode}
                        userId={userId}
                        chartId={tvWidgetId.MAINCHART}
                      />
                    ) : Object?.keys(optionDatas)?.length > 0 ||
                      Object?.keys(futureDatas)?.length > 0 ||
                      Object?.keys(positionDatas)?.length > 0 ||
                      (SandboxData &&
                        Object?.entries(SandboxData)?.length > 0) ||
                      (selectedStrategy &&
                        Object?.keys(selectedStrategy)?.length > 0) ||
                      (AnalyzeOrderstock &&
                        Object?.keys(AnalyzeOrderstock)?.length > 0) ? (
                      <PayoffTable
                        payoffdata={payoffdata}
                        targetSpotPrice={targetSpotPrice}
                        payoffExpiryDate={payoffExpiryDate}
                        targetDate={targetDate}
                        oipercent={oiPercent}
                        PayoffTableOiChg={PayoffTableOiChg}
                      />
                    ) : (
                      <div
                        className={`flex w-[100%]  items-center justify-center font-medium text-gray-400 max-sm:min-h-[10rem] `}
                      >
                        select buy/sell
                      </div>
                    )}
                  </div>
                )
              )}
              {!chartPanel && (
                <div
                  className={`flex flex-col  justify-center  font-bold  max-xl:w-[100%] max-md:h-[5rem] max-md:items-center sm:max-md:mb-[1rem] md:max-xl:mb-[1.5rem] md:max-lg:h-[7rem] lg:gap-2 xl:h-[7%] xl:items-end xl:max-2xl:w-[96%] 2xl:w-[100%] 
                ${
                  active === ChartToggleButtonType.Chart &&
                  (Object.keys(optionDatas).length > 0 ||
                    Object.keys(futureDatas).length > 0 ||
                    Object.keys(positionDatas).length > 0 ||
                    (SandboxData && Object.entries(SandboxData).length > 0) ||
                    (selectedStrategy &&
                      Object.keys(selectedStrategy).length > 0) ||
                    (AnalyzeOrderstock &&
                      Object.keys(AnalyzeOrderstock).length > 0))
                    ? toggleOpt
                      ? "block max-xl:hidden" // show on xl+, hide below xl
                      : "block" // show everywhere
                    : "hidden"
                } 
                `}
                >
                  <div
                    className={`${!Payoffstrategy ? "block" : "hidden"}
                    flex h-[3rem] flex-row items-center justify-center  max-xl:w-full sm:max-xl:justify-center sm:max-md:w-[100%] lg:max-xl:gap-[1.5rem] xl:max-2xl:w-[96.4%] 2xl:w-[100%]`}
                  >
                    <PriceSlider
                      setTriggerSpotPrice={setTriggerSpotPrice}
                      triggerSpotPrice={triggerSpotPrice}
                    />
                    <ExpirySlider
                      setTargetDate={setTargetDate}
                      setExpiryPayload={setExpiryPayload}
                    />
                  </div>
                </div>
              )}
            </div>
            {/* chart side part*/}
            {/* chart side part*/}
            <div
              className={`max-h-full rounded-lg  
                border-2 border-gray-50
               bg-white font-bold text-black
               shadow-strong-top max-xl:min-h-[10rem] 
               max-xl:w-[90%] xl:w-[44%] xl:p-1 xl:scrollbar-thin xl:scrollbar-track-gray-100 xl:scrollbar-thumb-z-br-gray 2xl:w-[50%]`}
            >
              <SwitchTab
                setpositionTableData={setpositionTableData}
                positionTableData={positionTableData}
                query={query}
                pnlValue={pnlValue}
                setEntryPriceData={setEntryPriceData}
                showlot={showlot}
                setShowlot={setShowlot}
                setCheckedOptionData={setCheckedOptionData}
                setExpiryPayload={setExpiryPayload}
                checkedOptionData={checkedOptionData}
              />

              <NewStrategyLegTable
                copiedData={copiedData}
                setCopiedData={setCopiedData}
                premium={premium}
                setCheckedOptionData={setCheckedOptionData}
                onMinExpiryDateChange={handleMinExpiryDateChange}
                apiKey={apiKey}
                entryPriceData={entryPriceData}
                setEntryPriceData={setEntryPriceData}
                checkedOptionData={checkedOptionData}
                strategyTable={strategyTable}
                DraftName={DraftName}
                draftData={draftData}
                setDraftData={setDraftData}
                query={query}
                setAddTable={setAddTable}
                setActive={setActive}
                setOrderExecuteFromOptionChain={setOrderExecuteFromOptionChain}
                orderExecuteFromOptionChain={orderExecuteFromOptionChain}
              />

              <div
                className={`h-[100%] transition-opacity duration-500 ease-in-out ${
                  pnlTable ? "visible opacity-100" : "hidden opacity-0"
                }`}
              >
                <PnlTable
                  targetPayoffdata={targetPayoffdata}
                  showlot={showlot}
                />
              </div>

              <div
                className={`h-full transition-opacity duration-500 ease-in-out ${
                  PositionTable ? "visible opacity-100" : "hidden opacity-0"
                }`}
              >
                <PositionsTable
                  positionTableData={positionTableData}
                  setpositionTableData={setpositionTableData}
                  query={query}
                  indexWiseTable={indexWiseTable}
                  setIndexWiseTable={setIndexWiseTable}
                  setPnlValue={setPnlValue}
                  checkedPositionRows={checkedPositionRows}
                  setCheckedPositionRows={setCheckedPositionRows}
                />
              </div>
              <div
                className={`h-full transition-opacity duration-500 ease-in-out ${
                  DraftPositions ? "visible opacity-100" : "hidden opacity-0"
                }`}
              >
                <DraftPositionsTable
                  DraftName={DraftName}
                  onMinExpiryDateChange={handleMinExpiryDateChange}
                  setDraftName={setDraftName}
                  setToggleOpt={setToggleOpt}
                />
              </div>
            </div>
          </div>
          {/* row of xl and 1st col of below xl */}
          {/* one row of xl and 1st col of below xl */}

          <div
            className={`  z-40  flex items-center max-xl:justify-start sm:max-xl:static   xl:fixed xl:right-14 xl:top-[3.9rem]   xl:shadow-2xl
            ${expandOptTable ? "xl:h-[92%] xl:w-[95%] 2xl:w-[93%]" : "xl:h-[92%] xl:w-[42%] 2xl:w-[48%]"}  ${addTable ? "xl:visible" : "xl:hidden"} ${
              toggleOpt ? "" : "max-xl:hidden"
            } flex-col bg-white transition-all duration-300  max-2xl:w-full max-xl:h-[99%] max-xl:items-center max-sm:mt-5 max-sm:h-[70%]  max-sm:w-[100%] max-sm:pb-[1rem] sm:max-xl:h-[93%] sm:max-xl:w-[100%] sm:max-md:pb-[1.5rem] sm:max-md:pt-[2rem] md:max-xl:pb-[2.2rem] md:max-xl:pt-[2rem]  `}
          >
            <span
              className="flex h-[7%] w-[100%] items-center justify-between px-4 max-xl:hidden"
              onDoubleClick={handleButtonClickExpand}
            >
              <span
                className={`${expandOptTable ? "justify-start" : "justify-between"} flex h-full flex-row items-center gap-5 xl:gap-3.5 xl:w-[90%] `}
                onDoubleClick={handleButtonClickExpand}
              >
                <IndexChanger
                  brokerCode={brokerCode}
                  setExpiryPayload={setExpiryPayload}
                  setActive={setActive}
                  avoidRepeatCall={false}
                />
                <span className="flex flex-row gap-3">
                  {chartPanel ? (
                    <div
                      onClick={() => {
                        dispatch(setChartIconClicked(false));
                        dispatch(setChartPanel(false));
                      }}
                      className="group relative flex cursor-pointer items-center justify-center rounded max-sm:h-[1.2rem] max-sm:w-[1.2rem] max-sm:p-[0.2rem] md:max-xl:h-[1.2rem] md:max-xl:w-[1.2rem] xl:h-[1.35rem] xl:w-[1.35rem]"
                    >
                      <img
                        src="/svg/analyze.svg"
                        width={16}
                        height={16}
                        alt=""
                      />
                      <span className="absolute top-5 rounded bg-gray-800 px-1 text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 ">
                        Analyze
                      </span>
                    </div>
                  ) : (
                    <CandleIcon
                      className="flex cursor-pointer items-center justify-center rounded max-sm:h-[1.2rem] max-sm:w-[1.2rem] max-sm:p-[0.2rem] md:max-xl:h-[1.2rem] md:max-xl:w-[1.2rem] xl:h-[1.35rem] xl:w-[1.35rem]"
                      onClick={() => {
                        dispatch(setChartIconClicked(true));
                        dispatch(setChartPanel(true));
                        if (
                          indexObjData &&
                          Object.entries(indexObjData).length > 0
                        ) {
                          dispatch(
                            setSymbolIdentifier(indexObjData?.identifier),
                          );
                        }
                      }}
                    />
                  )}

                  <IndexChangerIconButton
                    handleHeatMap={handleHeatMap}
                    svg={"/svg/heatmap.svg"}
                    name={"Premium Map"}
                  />
                </span>
                {/* <IndexChangerIconButton
                  handleHeatMap={handleButtonClickExpand}
                  svg={
                    expandOptTable
                      ? "/svg/horizontalShrink.svg"
                      : "/svg/expand.svg"
                  }
                  name={expandOptTable ? "Shrink Table" : "Expand Table"}
                  hideExpandButton="max-xl:hidden"
                /> */}
                <span className="xl:max-2xl:hidden">
                  <Multiplier />
                </span>
                <MaxPainStrike />
              </span>

              <span className="flex h-[100%] items-center justify-end  gap-2 ">
                <div className="group relative inline-block cursor-pointer ">
                  <img
                    src="/svg/deleteNotes.svg"
                    height={15}
                    width={15}
                    alt="Clear All"
                    className=" xl:h-[1.3rem] xl:w-[1.3rem]"
                    onClick={(e) => {
                      e.stopPropagation();

                      handleclearStrategy();
                    }}
                    onDoubleClick={(event: any) => {
                      event.stopPropagation();
                    }}
                  />
                  <span className="pointer-events-none absolute left-full top-7 z-[1001] ml-1 w-[3.8rem] -translate-x-full -translate-y-1/2 transform rounded  bg-gray-800  px-1   text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden">
                    Clear All
                  </span>
                </div>
                <button
                  className=""
                  onClick={() => setAddTable(false)}
                  onDoubleClick={(event: any) => {
                    event.stopPropagation();
                  }}
                >
                  <img
                    src="/svg/removeSymbol.svg"
                    className="relative h-[1.5rem] w-[1.5rem]"
                    width="20"
                    height="20"
                    alt="remove"
                  />
                </button>
              </span>
            </span>
            <div
              className={` flex ${
                expandOptTable
                  ? " xl:h-[82%] xl:w-[98.2%] 2xl:w-[95%] "
                  : "  xl:h-[82%] xl:w-[94%] 2xl:w-[95%]"
              }  bg-white max-xl:h-[99%] max-xl:w-[90%]  xl:items-center xl:justify-center `}
            >
              <CommonOptionChain
                copiedData={copiedData}
                brokerCode={brokerCode}
                expandOptTable={expandOptTable}
                setActive={setActive}
                active={active}
                addTable={addTable}
                setProcessedIndexes={setProcessedIndexes}
                querySpotPrice={querySpotPrice}
                setQuerySpotPrice={setQuerySpotPrice}
              />
            </div>
            <div className="mt-2 flex flex-row items-center justify-center gap-5 max-xl:hidden">
              <span className="2xl:hidden">
                <Multiplier />
              </span>
              <button
                className={`class-for-touch-event flex items-center justify-center gap-1 rounded-3xl border border-z-green-500 text-[0.75rem] font-medium leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white max-md:hidden max-sm:w-[4.5rem] max-sm:p-1 max-sm:text-[0.65rem] md:h-7 md:max-2xl:w-[5.8rem]  ${
                  enableOptButtons ? "" : "pointer-events-none opacity-50"
                } xl:p-2 2xl:w-[6rem] `}
                title="Execute"
                onClick={() => setOrderExecuteFromOptionChain(true)}
              >
                Execute
              </button>
              <button
                className={`flex items-center justify-center gap-1 rounded-3xl border border-z-green-500 text-[0.75rem] font-medium leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white max-md:hidden max-sm:w-[4.5rem] max-sm:p-1 max-sm:text-[0.65rem] md:h-7 md:max-2xl:w-[5.8rem] xl:p-2 2xl:w-[6rem] `}
                title="close"
                onClick={() => setAddTable(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
        {/* 2nd roww */}
      </div>
    </CommonLayOut>
  );
};

export default Strategies;
