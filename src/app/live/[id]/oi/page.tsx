"use client";
import CommonLayOut from "@/components/shared/ChartLayout/CommonLayOut";

import OiIndex from "@/components/shared/ChartLayout/oiComponent/oiChartTool/OiIndex";
import OiPayOffChart from "@/components/shared/ChartLayout/oiComponent/oiChartTool/OiPayOffChart";
import DateRangeInputs from "@/components/shared/ChartLayout/oiComponent/OiDayRangeSection";
import OiExpiry from "@/components/shared/ChartLayout/oiComponent/OiExpiry";
import OITable from "@/components/shared/ChartLayout/oiComponent/OITable";
import OiTabName from "@/components/shared/ChartLayout/oiComponent/OiTabName";
import OiTimeRange from "@/components/shared/ChartLayout/oiComponent/OiTimeRange";
import SumButton from "@/components/shared/ChartLayout/oiComponent/SumButton";
import StrikeRange from "@/components/shared/ChartLayout/oiComponent/StrikeRange";
import { RootState } from "@/lib/redux/Store";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { TimeFilter } from "@/components/shared/ChartLayout/oiComponent/TimeFilter";
import CombinedOiExpiry from "@/components/shared/ChartLayout/oiComponent/CombinedOiExpiry";
import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { OIAlldata } from "@/lib/redux/slices/OISlice";
import ToggleButton from "@/components/shared/ChartLayout/ToggleButton/ToggleButton";
import {
  ltpOi,
  multiStarddleOPtions,
  OiOptions,
} from "@/lib/util/toggleButtonName/toggleButtonNames";

import { useParams, useRouter } from "next/navigation";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import ShowMargin from "@/components/shared/ChartLayout/oiComponent/ShowMargin";
import IndexChangerIconButton from "@/components/shared/ChartLayout/optionFutures/IndexChangerIconButton/IndexChangerIconButton";
import config from "@/lib/config";
import FiiDiiTab from "@/components/shared/ChartLayout/oiComponent/FiiDiiData/FiiDiiTab";
import FiiDiiData from "@/components/shared/ChartLayout/oiComponent/FiiDiiData/FiiDiiData";
import OiMatrix from "@/components/shared/ChartLayout/oiComponent/oiMatrix/OiMatrix";
import {
  setChartIconClicked,
  setIndexFirstFutData,
  setShowTvResolution,
  showHeatmap,
} from "@/lib/redux/slices/ChartsSlice";
import { extractAndSortOptions } from "@/lib/util/HeatMapUtil/HeatmapUtil";
import CandleIcon from "@/components/shared/ChartLayout/optionFutures/CandleIcon";
import { handlePopUp } from "@/lib/util/analyzer/handleSelect";
import HeatMap from "@/components/shared/ChartLayout/sidetab/watchlist/HeatMap/Heatmap";

import { getBrokerName } from "@/components/helpers";
import TogglePercentage from "@/components/shared/ChartLayout/oiComponent/oiMatrix/TogglePercentage";
import ClassicMode from "@/components/shared/ChartLayout/oiComponent/oiMatrix/ClassicMode";
import StrategyType from "@/components/shared/ChartLayout/oiComponent/oiMatrix/StrategyType";
import { validateBrokerCode } from "@/lib/util/brokerIdCheck/brokersExist";
import {
  addSymbol,
  setIndexRawApiResponse,
} from "@/lib/redux/slices/StrategySlice";
import {
  enrichFutures,
  enrichOptionChain,
  getIdentifierFromQuery,
} from "@/components/shared/ChartLayout/optionFutures/optionFuturesUtil/strategyUtil";
import { ATMCalculation } from "@/components/shared/ChartLayout/optionFutures/optionFuturesUtil/legUtil";
import MaxPainStrike from "@/components/shared/ChartLayout/optionFutures/MaxPainStrike";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { fetchMarketDays } from "@/lib/util/generalUtil";

function OpenInterest() {
  const [groupName, setGroupName] = useState("Group 1");
  const [oiLoad, setOiLoad] = useState({});
  const [brokerCode, setBrokerCode] = useState<number | null>(null);
  const [query, setQuery] = useState("NIFTY");
  const [oiExpiry, setOiExpiry] = useState("");
  const [checkedOIRows, setCheckedOIRows] = useState<{
    [key: string]: boolean;
  }>({});
  const [selected, setSelected] = useState(5);
  const [showMultiOi, setShowMultiOi] = useState<any>(false);
  const [showMultiStraddle, setShowMultiStraddle] = useState<any>(false);
  const [showOiChange, setShowOiChange] = useState(false);
  const [spotPriceRoundOff, setSpotPriceRoundOff] = useState<any>(null);
  const [oiIncrementor, setOiIncrementor] = useState(null);
  const [strikeRange, setStrikeRange] = useState([]);
  const [fromOiTime, setFromOiTime] = useState("");
  const [toOiTime, setToOiTime] = useState("");
  const [activeButton, setActiveButton] = useState("Both");
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [activeStraddleButton, setActiveStraddleButton] = useState("");
  const [oiChangeExpiry, setOiChangeExpiry] = useState<any>([]);
  const [buttonName, setButtonName] = useState("Intraday");
  const [straddlePayload, setStraddlePayload] = useState([]);
  const [checkedStrangleRows, setCheckedStrangleRows] = useState<any>({});
  const [checkedCustomRows, setCheckedCustomRows] = useState<any>({});
  const [isSumSelected, setIsSumSelected] = useState(true);
  const [queryIdentifier, setQueryIdentifier] = useState("NSE:NIFTY50");
  const [showCombinedOi, setShowCombinedOi] = useState(false);
  const [combinedOiExpiry, setCombinedOiExpiry] = useState<any>("");
  const [manuallyCheckedStraddle, setManuallyCheckedStraddle] = useState(false);
  const [checkedOIRadios, setCheckedOiradios] = useState<any>({});
  const dispatch = useDispatch();
  const [calculateMargin, setCalculateMargin] = useState(false);
  const expiries: any = useSelector(
    (state: RootState) => state.OI.OIIndexExpiryDate,
  );

  const indexAddtionalData: any = useSelector(
    (state: RootState) => state.OI.OIAddtionalData,
  );
  const isInitialRender = useRef(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [showOiTable, setShowOiTable] = useState(false);
  const [manageTimeRange, setManageTimeRange] = useState<any>(
    activeButton === "Both" ? true : false,
  );
  const [userId, setUserId] = useState("");
  // Function to toggle the name
  const router: any = useRouter();
  const id: any = useParams();
  const [isValid, setIsValid] = useState(false);
  const brokerData: any = sessionStorage.getItem("ExistbrokerCode");
  const [expandOiTable, setExpandOiTable] = useState(false);
  const [straddleChartData, setStraddleChartData] = useState<any>({});
  const [marginPayload, setMarginPayload] = useState<any>([]);
  const [showMargin, setShowMargin] = useState<any>(null);
  const [manuallyMinMax, setManuallyMinMax] = useState(false);
  const [resetRange, setResetRange] = useState<any>(false);
  const [spinningAnimation, setSpinningAnimation] = useState(false);
  const [showFiiDiiData, setShowFiiDiiData] = useState(false);
  const [FiiDiiActiveButton, setFiiDiiActiveButton] = useState("summary");
  const [showOiMatrix, setShowOiMatrix] = useState(false);
  const [OIData, setOIData] = useState();
  const [oiDataPercent, setOiDataPercent] = useState<any>("");
  const [oiValue, setOiValue] = useState<any>({});
  const [heatMapData, setHeatMapData] = useState<any>();
  const [showClassic, setShowClassic] = useState(true);
  const showheatMap = useSelector(
    (state: RootState) => state.charts.setShowHeatmap,
  );
  const toggleState = useSelector(
    (state: RootState) => state.analyzer.toggleState,
  );
  const resolution = useSelector(
    (state: RootState) => state.charts.setTvResolution,
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const netpercentage: any = useSelector(
    (state: RootState) => state.strategy.netChangepercent,
  );
  const brokerName = getBrokerName();

  const [tempValue, setTempValue] = useState<string>("NIFTY");

  const [requireData, setRequireData] = useState("oi");
  const [showChgPerc, setShowChgPerc] = useState(false);

  const [selectedIndexName, setSelectedIndexName] = useState("NIFTY");
  const [tableData, setTableData] = useState<any>({});
  const [processedIndexes, setProcessedIndexes] = useState<boolean>();
  const rawApiResponse: any = useSelector(
    (state: RootState) => state.strategy.rawIndexAPIresponse,
  );
  const WebsocketLtpRef = useRef(webSocketDataRead);
  const indexData: any = useSelector(
    (state: RootState) => state.OI.OiIndexData,
  );
  const [querySpotPrice, setQuerySpotPrice] = useState<any>(null);
  const lastQueryRef = useRef<string | null>(null);
  const spotPriceSetRef = useRef(false);
  const isMarketHoliday = useSelector(
    (state: RootState) => state.MarketBasis.isMarketHoliday,
  );
  useEffect(() => {
    validateBrokerCode(id, brokerData, router, setBrokerCode, setIsValid);
  }, [id, router]);

  // used to set straddle-strangle tab button
  useEffect(() => {
    if (showMultiStraddle) {
      setStraddlePayload([]);
      setActiveStraddleButton("straddle");
    } else {
      setActiveStraddleButton("");
    }
  }, [
    showMultiStraddle,
    showMultiOi,
    showOiChange,
    showCombinedOi,
    showOiMatrix,
    showFiiDiiData,
  ]);
  // for oichange api control
  useEffect(() => {
    if (!showOiChange) {
      setToOiTime("");
      setFromOiTime("");
      setActiveButton("");
      setStrikeRange([]);
    } else {
      setActiveButton("Both");
    }
  }, [
    showMultiStraddle,
    showMultiOi,
    showOiChange,
    showCombinedOi,
    showOiMatrix,
    showFiiDiiData,
  ]);

  const fetchUserIdData = async () => {
    if (!brokerCode) return; // Ensure brokerCode is valid

    try {
      const fetchApi = new UserBrokerRouterApi(baseConfig());
      const response =
        await fetchApi.fetchMyBrokerV1UsersMeBrokersBrokerCodeGet(brokerCode);
      const brokername = response?.data?.broker_meta?.name;
      sessionStorage.setItem("brokerName", brokername);
      setUserId(response?.data?.user_broker_mapping.user_id.toString());
    } catch (err: any) {
      if (err?.response?.status === 401) {
        autoLogoutTokenRemove(router);
      }
      if (err?.response && err?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
    }
  };
  //For passing spotprice to get indices full data API
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
  // make intial cal for
  useEffect(() => {
    if (query.length != 0 && querySpotPrice != null) {
      fetchData(brokerCode, query, querySpotPrice, true);
    }
  }, [brokerCode, query, querySpotPrice]);

  useEffect(() => {
    fetchUserIdData();
  }, [brokerCode]);

  // set intial payloads for combine and oichanges
  useEffect(() => {
    if (
      expiries &&
      expiries[query] &&
      Array.isArray(expiries[query]) &&
      expiries[query].length > 0 &&
      (showCombinedOi || showOiChange || showOiMatrix)
    ) {
      if (combinedOiExpiry.length == 0) {
        setCombinedOiExpiry(expiries[query][0]);
      }
      if (!showOiMatrix) {
        // setSpotPriceRoundOff(
        //   indexAddtionalData[query][expiries[query][0]]?.spot_price_round_off
        // );
        const atmStrike: any = ATMCalculation(
          OIData,
          WebsocketLtpRef.current,
          indexData[query],
        );
        setSpotPriceRoundOff(atmStrike);
        setOiIncrementor(
          indexAddtionalData[query][expiries[query][0]]?.incrementer,
        );
      }
    }
  }, [showCombinedOi, showOiChange, expiries, spotPriceRoundOff, showOiMatrix]);

  // get indices full data api

  const fetchData = (
    broker: any,
    index: any,
    querySpotPrice: any,
    apiBoolean: any,
  ) => {
    const getAllDataApi = new UserBrokerRouterApi(baseConfig());
    getAllDataApi
      .getIndicesFullDataFromDbV1UsersMeBrokersBrokerCodeGetIndicesFullDataFromDbIndexNameGet(
        broker,
        index,
        querySpotPrice,
        apiBoolean,
      )
      .then((res: any) => {
        dispatch(setIndexRawApiResponse(res?.data));
        setQuerySpotPrice(null);
        setProcessedIndexes(false);
        dispatch(
          addSymbol({
            symbol: res?.data?.index_obj?.identifier,
            // token: res?.data?.index_obj?.token,
          }),
        );
        Object.keys(res?.data?.option_chain || {}).forEach((expiry) => {
          const strikes = res?.data?.option_chain[expiry];

          Object.keys(strikes)?.forEach((strike) => {
            const options = strikes[strike]; // array of CE & PE objects

            options.forEach((opt) => {
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
    const indexId = rawApiResponse?.index_obj?.identifier ?? "";

    // Run only if this index is not already processed and WS data is available
    if (indexId && webSocketDataRead[indexId] && !processedIndexes) {
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
        webSocketDataRead,
        netpercentage,
      );
      const enrichedFutures: any = enrichFutures(
        futures_data,
        lot_size,
        webSocketDataRead,
        netpercentage,
      );

      dispatch(
        OIAlldata({
          OISymbol: name,
          // OITokenLtpData: res.data.option_chain,
          OITokenLtpData: enrichedOptionChain ?? {},
          OIExpiryDate: expiry_dates ?? [],
          OIAddonData: index_data ?? {},
          // OIFutureData: res.data.futures_data,
          OIFutureData: enrichedFutures ?? [],
          OISpotPrice: webSocketDataRead[indexId] ?? null,
          indexObj: index_obj ?? {},
          lotSize: lot_size ?? 0,
        }),
      );

      // Sort and dispatch first fut
      const sortedFuts =
        futures_data?.length > 0
          ? [...futures_data]?.sort((a, b) =>
              new Date(a?.expiry) > new Date(b?.expiry) ? 1 : -1,
            )
          : [];
      if (sortedFuts?.length > 0) {
        dispatch(
          setIndexFirstFutData({
            IndexFirstFutData: sortedFuts[0],
            FutIndexName: indexId,
          }),
        );
      }
    }
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
  // for get indicess full data periodic call
  useEffect(() => {
    // Skip the initial API call on first render
    if (isInitialRender.current) {
      isInitialRender.current = false; // Mark it as not the initial render
    }

    // Set up an interval to call fetchData every 30 seconds
    const fetchIfTradingTime = () => {
      const identifier = getIdentifierFromQuery(query);
      if (!identifier) return;
      const spotPrice = WebsocketLtpRef.current?.[identifier];
      if (
        config.isTradingTime() &&
        brokerCode != null &&
        query?.length != 0 &&
        spotPrice != null &&
        !isMarketHoliday
      ) {
        fetchData(brokerCode, query, spotPrice, false);
        // updateData();
      }
    };

    // Call immediately if within trading time

    intervalRef.current = setInterval(fetchIfTradingTime, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [query, brokerCode]);

  // oi change sub button
  const handleClickActiveOiButton = (buttonValue: any) => {
    setActiveButton(buttonValue);
  };

  // multi-straddle sub button
  const handleStraddleClick = (buttonValue: any) => {
    setShowMultiStraddle(true);
    setCalculateMargin(false);
    setManuallyCheckedStraddle(false);
    setActiveStraddleButton(buttonValue);
  };
  // for sm device
  useEffect(() => {
    setManageTimeRange(activeButton === "Both" ? true : false);
  }, [activeButton]);

  // If multi-oi or multi-straddle is unchecked (length 0), clicking Combine or OI Change should recheck the tab.
  useEffect(() => {
    if (
      Object.entries(expiries)?.length == 0 ||
      query?.length == 0 ||
      expiries[query]?.length == 0
    ) {
      return;
    }

    const expiry =
      expiries &&
      typeof query !== "undefined" &&
      expiries[query] &&
      expiries[query].length > 0
        ? expiries[query][0]
        : undefined;

    const spotPriceData = indexAddtionalData[query]?.[expiry];
    if (!spotPriceData) return;

    const defaultSelector = spotPriceData?.spot_price_round_off;
    const defaultLoad = [
      `${defaultSelector}.0#CE#${expiry}#${groupName}`,
      `${defaultSelector}.0#PE#${expiry}#${groupName}`,
    ];
    const initialOiLoad = Object.fromEntries(
      defaultLoad.map((key) => [
        key,
        `${key.split(".0")[0]}#${key.split("#")[1]}`,
      ]),
    );

    const initialRadioLoad = Object.fromEntries(
      [`${defaultSelector}.0#${expiry}#${groupName}`].map((key) => [
        key,
        [`${key.split(".0")[0]}CE`, `${key.split(".0")[0]}PE`],
      ]),
    );

    const updateCheckedRows = (setter, condition) => {
      if (condition) {
        setter({}); // Reset the state before updating
        setter((prev) => ({
          ...prev,
          [`${defaultSelector}.0#CE#${expiry}#${groupName}`]: true,
          [`${defaultSelector}.0#PE#${expiry}#${groupName}`]: true,
        }));
        setOiLoad(initialOiLoad);
      }
    };
    const updateMultiStraddleRows = (setter, condition) => {
      if (condition) {
        setter({}); // Reset the state before updating
        setter((prev) => ({
          ...prev,
          [`${defaultSelector}.0#CE#${expiry}#${groupName}`]: true,
          [`${defaultSelector}.0#PE#${expiry}#${groupName}`]: true,
        }));
        setOiLoad(initialOiLoad);
      }
    };

    const updateCheckedRadios = (setter, condition) => {
      if (condition) {
        setManuallyCheckedStraddle(false);
        setter({});
        setter((prev) => ({
          ...Object.keys(prev).reduce((acc, key) => {
            if (key === `${defaultSelector}.0#${expiry}#${groupName}`)
              acc[key] = true;
            return acc;
          }, {}),
          [`${defaultSelector}.0#${expiry}#${groupName}`]: true,
        }));
        setOiLoad(initialOiLoad);
      }
    };

    // all unchecked when tab switch and again click multi oi tab
    updateCheckedRows(
      setCheckedOIRows,
      !showMultiOi &&
        (showMultiStraddle || showOiChange || showCombinedOi) &&
        (Object?.entries(checkedOIRows).length == 0 ||
          Object?.values(checkedOIRows)?.every((value) => !value)),
    );
    // all unchecked when tab switch and again click multi starddle -custom tab
    updateMultiStraddleRows(
      setCheckedCustomRows,
      !showMultiStraddle &&
        showMultiOi &&
        (Object?.entries(checkedCustomRows).length == 0 ||
          Object?.values(checkedCustomRows)?.every((value) => !value)),
    );
    // all unchecked when tab switch and again click multi starddle-strangle tab
    updateMultiStraddleRows(
      setCheckedStrangleRows,
      (showMultiOi || showOiChange || showCombinedOi) &&
        !showMultiStraddle &&
        (Object?.entries(checkedStrangleRows).length == 0 ||
          Object?.values(checkedStrangleRows)?.every((value) => !value)),
    );

    // all unchecked when tab switch and again click multi starddle-strangle tab
    updateCheckedRadios(
      setCheckedOiradios,
      (showMultiOi || showOiChange || showCombinedOi) &&
        !showMultiStraddle &&
        (Object?.entries(checkedOIRadios).length == 0 ||
          Object?.values(checkedOIRadios)?.every((value) => !value)),
    );
  }, [showOiChange, showCombinedOi]);
  const handleHeatMap = () => {
    dispatch(showHeatmap(true));
  };
  useEffect(() => {
    setHeatMapData(
      extractAndSortOptions(
        OIData,
        oiDataPercent,
        oiValue,
        toggleState,
        webSocketDataRead,
        netpercentage,
      ),
    );
  }, [OIData, showheatMap, toggleState]);

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
  useEffect(() => {
    if (isMarketHoliday == null) {
      fetchMarketDays(dispatch, router);
    }
  }, []);

  if (!isValid) {
    return null; // Prevent further rendering if invalid
  }

  const handleExpandShrinkClick = () => {
    setExpandOiTable(!expandOiTable);
  };

  //refresh strike range
  const refreshStrikeRange = () => {
    setSpinningAnimation(true);
    setResetRange?.(true);
    setTimeout(() => {
      setSpinningAnimation(false);
    }, 300);
  };

  const handleClickActiveOiMatrixButton = (buttonValue: any) => {
    setRequireData(buttonValue);
  };

  //  If isMarketHoliday is true, do not get data from this API; otherwise, make the API call.

  return (
    <CommonLayOut
      brokerCode={brokerCode}
      setBrokerCode={setBrokerCode}
      userId={userId}
    >
      <div
        className={`h-full w-full ${
          showOiChange ? "gap-5" : "gap-10"
        } flex flex-row  `}
      >
        <div
          className={`flex h-[98%] w-[100%] flex-col items-center justify-start max-xl:h-[100%] max-xl:overflow-y-auto max-xl:scrollbar-none ${showOiMatrix ? "max-xl:h-[93%] " : ""} `}
        >
          <div
            className={` mt-2 flex w-full  max-xl:flex-col-reverse max-xl:gap-2 max-xl:pb-[0.59rem] max-sm:h-[12%] sm:max-md:h-[15%] sm:max-md:pb-[2rem] lg:max-xl:h-[24%] xl:h-[7%] xl:flex-row  ${!showFiiDiiData ? "" : "xl:justify-center"} ${showOiTable && showMultiOi ? "sm:max-xl:mb-[0.3rem]" : ""} ${showMultiOi || showCombinedOi ? "md:max-lg:h-[18%] " : "md:max-lg:h-[24%] "} ${showOiChange || showCombinedOi || showOiMatrix ? "  xl:flex-row xl:items-center xl:justify-start" : ""} `}
          >
            <span
              className={`flex h-full flex-row   max-xl:w-full max-xl:items-center max-md:justify-between max-sm:mt-[3rem] max-sm:px-3 sm:max-xl:px-[2rem] sm:max-md:pt-[4rem] md:max-xl:gap-[1rem] md:max-lg:flex-col md:max-lg:justify-start lg:justify-center ${
                (showMultiOi || showMultiStraddle) && !expandOiTable
                  ? "xl:max-2xl:w-[67%]"
                  : "xl:max-2xl:w-[67%] "
              } xl:max-2xl:gap-3 ${
                showFiiDiiData ? "2xl:w-[100%]" : "2xl:w-[65%]"
              } 2xl:gap-5 `}
            >
              <>
                <OiTabName
                  setShowMultiOi={setShowMultiOi}
                  showMultiStraddle={showMultiStraddle}
                  setShowMultiStraddle={setShowMultiStraddle}
                  setShowOiChange={setShowOiChange}
                  showOiChange={showOiChange}
                  setSelected={setSelected}
                  setSpotPriceRoundOff={setSpotPriceRoundOff}
                  showCombinedOi={showCombinedOi}
                  setShowCombinedOi={setShowCombinedOi}
                  setCheckedOIRows={setCheckedOIRows}
                  straddlePayload={straddlePayload}
                  setManuallyCheckedStraddle={setManuallyCheckedStraddle}
                  setStraddlePayload={setStraddlePayload}
                  query={query}
                  showMultiOi={showMultiOi}
                  setCombinedOiExpiry={setCombinedOiExpiry}
                  setExpandOiTable={setExpandOiTable}
                  setMarginPayload={setMarginPayload}
                  setShowMargin={setShowMargin}
                  setCalculateMargin={setCalculateMargin}
                  setShowFiiDiiData={setShowFiiDiiData}
                  showFiiDiiData={showFiiDiiData}
                  setShowOiMatrix={setShowOiMatrix}
                  showOiMatrix={showOiMatrix}
                  setQuery={setQuery}
                  setTempValue={setTempValue}
                  setSelectedIndexName={setSelectedIndexName}
                />
                {/* {showFiiDiiData && (
                  <span className="flex w-full flex-row items-center gap-2 max-xl:justify-start max-md:pl-[1rem] sm:max-md:px-[2rem] md:max-lg:mt-[0.8rem] lg:max-xl:mt-[0.2rem] lg:max-xl:h-full lg:max-xl:items-end lg:max-xl:pb-0.5 xl:justify-start xl:max-2xl:items-start ">
                    <FiiDiiTab
                      FiiDiiActiveButton={FiiDiiActiveButton}
                      setFiiDiiActiveButton={setFiiDiiActiveButton}
                    />
                  </span>
                )} */}
                {/* show till md  */}
                {showOiChange ? (
                  <span className="flex w-full flex-row items-center gap-2 max-md:justify-start max-md:pl-[1rem] sm:max-md:px-[2rem] md:hidden ">
                    <ToggleButton
                      buttons={OiOptions}
                      LiveButton={activeButton}
                      space="px-3 py-1 text-[0.75rem] max-sm:px-2.5 max-sm:py-0.5 max-sm:text-[0.7rem]"
                      onButtonClick={handleClickActiveOiButton}
                    />
                  </span>
                ) : showMultiStraddle ? (
                  <span className="flex w-full flex-row items-center justify-center gap-2 max-md:justify-start max-sm:pl-[0.5rem] sm:max-md:px-[2rem] sm:max-md:pl-[1rem] md:hidden">
                    <ToggleButton
                      buttons={multiStarddleOPtions}
                      LiveButton={activeStraddleButton}
                      space="px-3 py-1 text-[0.75rem] max-sm:px-2 max-sm:py-0.5 max-sm:text-[0.7rem]"
                      onButtonClick={handleStraddleClick}
                    />
                  </span>
                ) : (
                  ""
                )}
                {/*show till md  */}
              </>
            </span>
            {!showFiiDiiData && (
              <span
                className={`bg-white max-xl:fixed max-xl:z-[20] max-xl:flex max-xl:w-full max-xl:flex-row max-xl:items-center max-xl:justify-between max-xl:border-b-[0.05rem] max-xl:border-gray-200 max-sm:top-[7.25%] max-sm:gap-[2rem] max-sm:px-2 sm:max-xl:h-[2.8rem] sm:max-xl:gap-[2.5rem] sm:max-xl:px-[1.5rem] sm:max-md:top-[7.9%] md:max-xl:top-[8%] xl:flex xl:items-center  2xl:justify-start ${showOiChange || showCombinedOi || showOiMatrix ? "mt-2 h-[2rem] rounded-lg rounded-r-lg xl:flex  xl:w-[25%] xl:flex-row xl:items-center xl:justify-start  xl:gap-5 xl:shadow-strong-top" : "xl:max-2xl:w-[35%]  2xl:w-[35%]"}`}
              >
                <OiIndex
                  brokerCode={brokerCode}
                  setQuery={setQuery}
                  setCheckedOIRows={setCheckedOIRows}
                  setOiLoad={setOiLoad}
                  query={query}
                  setQueryIdentifier={setQueryIdentifier}
                  setCheckedCustomRows={setCheckedCustomRows}
                  setCheckedStrangleRows={setCheckedStrangleRows}
                  setCheckedOiradios={setCheckedOiradios}
                  setStraddlePayload={setStraddlePayload}
                  setStrikeRange={setStrikeRange}
                  setOiChangeExpiry={setOiChangeExpiry}
                  setCombinedOiExpiry={setCombinedOiExpiry}
                  StyleForSmallScreen={` sm:max-xl:w-full     sm:max-xl:h-full max-xl:px-0.5 max-sm:pt-[0.25rem] sm:max-md:max-w-[65%] md:max-lg:max-w-[60%] lg:max-xl:max-w-[50%]  `}
                  IconPadding="max-sm:pt-1"
                  setMarginPayload={setMarginPayload}
                  setManuallyMinMax={setManuallyMinMax}
                  setCalculateMargin={setCalculateMargin}
                  setOiExpiry={setOiExpiry}
                  setTempValue={setTempValue}
                  tempValue={tempValue}
                  setSelectedIndexName={setSelectedIndexName}
                  selectedIndexName={selectedIndexName}
                  dropDownClassName={` ${showOiChange || showCombinedOi || showOiMatrix ? "border-r rounded-l-lg sm:max-xl:border" : "border rounded-lg"}`}
                />
                {(showMultiOi ||
                  showMultiStraddle ||
                  showOiMatrix ||
                  showCombinedOi ||
                  showOiChange) && (
                  <div className="mx-2 flex flex-row items-center justify-center gap-5 max-sm:gap-2 ">
                    <CandleIcon
                      className=" flex cursor-pointer items-center justify-center rounded max-sm:h-[1.2rem] max-sm:w-[1.2rem] max-sm:p-[0.2rem] max-sm:pt-1 md:max-xl:h-[1.2rem] md:max-xl:w-[1.2rem] xl:h-[1.35rem] xl:w-[1.35rem]"
                      onClick={() => {
                        dispatch(setChartIconClicked(true));
                        if (queryIdentifier && queryIdentifier.length > 0) {
                          handlePopUp(
                            { identifier: queryIdentifier },
                            dispatch,
                          );
                        }
                      }}
                    />
                    {showheatMap && (showMultiOi || showMultiStraddle) && (
                      <HeatMap
                        HeatMapData={heatMapData}
                        displayedName={query}
                        expiryValue={oiExpiry}
                        // setClickedHeatmapData={setClickedHeatmapData}
                      />
                    )}
                    {(showMultiOi || showMultiStraddle) && (
                      <IndexChangerIconButton
                        handleHeatMap={handleHeatMap}
                        svg={"/svg/heatmap.svg"}
                        name={"Premium Map"}
                      />
                    )}
                    {(showMultiOi || showMultiStraddle) && (
                      <IndexChangerIconButton
                        handleHeatMap={handleExpandShrinkClick}
                        svg={
                          expandOiTable
                            ? "/svg/horizontalShrink.svg"
                            : "/svg/expand.svg"
                        }
                        name={expandOiTable ? "Shrink Table" : "Expand Table"}
                        hideExpandButton="max-xl:hidden xl:max-2xl:px-[0.3rem]"
                      />
                    )}
                    {(showMultiOi || showMultiStraddle) && (
                      <span className="lg:max-xl:flex xl:max-2xl:hidden 2xl:flex">
                        <MaxPainStrike />
                      </span>
                    )}
                  </div>
                )}
              </span>
            )}
          </div>
          {/* second one */}
          {showOiMatrix ? (
            <div className="flex h-[90%] w-full flex-col gap-5 max-xl:h-[100%] max-sm:pl-[1rem] sm:max-xl:pl-[2rem] xl:pl-10">
              <span className="flex h-[10%] w-full flex-row items-center justify-start gap-5 max-sm:h-[15%] max-sm:gap-2 max-sm:flex-wrap">
                <TimeFilter
                  setSelected={setSelected}
                  selected={selected}
                  showMultiOi={showMultiOi}
                  showOiChange={showOiChange}
                />
                <span className="">
                  <CombinedOiExpiry
                    setCombinedOiExpiry={setCombinedOiExpiry}
                    combinedOiExpiry={combinedOiExpiry}
                    query={query}
                    showCombinedOi={showCombinedOi}
                  />
                </span>

                {/* oi/ltp toggle in oi matrix */}
                <span className="">
                  <ToggleButton
                    buttons={ltpOi}
                    LiveButton={requireData}
                    space="xl:max-2xl:px-2 px-3  text-[0.75rem] md:max-xl:px-5"
                    onButtonClick={handleClickActiveOiMatrixButton}
                  />
                </span>

                <ClassicMode
                  setShowClassic={setShowClassic}
                  showClassic={showClassic}
                  setShowChgPerc={setShowChgPerc}
                />
                <TogglePercentage
                  setShowChgPerc={setShowChgPerc}
                  showChgPerc={showChgPerc}
                  showClassic={showClassic}
                />
                {Object.entries(tableData).length > 0 && (
                  <StrategyType tableData={tableData} />
                )}
              </span>

              <span className="flex  max-h-[85%] w-full justify-start  ">
                <OiMatrix
                  brokerCode={brokerCode}
                  queryIdentifier={queryIdentifier}
                  selected={selected}
                  combinedOiExpiry={combinedOiExpiry}
                  query={query}
                  requireData={requireData}
                  showChgPerc={showChgPerc}
                  showClassic={showClassic}
                  tableData={tableData}
                  setTableData={setTableData}
                />
              </span>
            </div>
          ) : (
            <span
              className={`flex w-full max-xl:flex-col-reverse max-sm:min-h-[100%] sm:max-xl:h-full sm:max-xl:scrollbar-none md:max-lg:mt-[0.8rem] lg:max-xl:mt-[1rem] xl:h-[90%] xl:flex-row xl:max-2xl:mt-[0.8rem] ${showOiChange ? "max-xl:min-h-[100%] max-sm:mt-[0.5rem] sm:max-xl:overflow-y-auto sm:max-xl:pb-[5rem] md:max-lg:mt-[2rem]" : showMultiStraddle ? "sm:max-xl:mb-[4rem] md:max-lg:mt-[0.9rem]" : showCombinedOi ? "max-sm:min-h-max" : "max-xl:mb-[4rem]"} `}
            >
              <span
                className={`${
                  expandOiTable
                    ? "w-0"
                    : showCombinedOi && !expandOiTable
                      ? "w-[100%]"
                      : "max-xl:w-full xl:max-2xl:w-[70%] 2xl:w-[65%]"
                } ${(showMultiOi || showMultiStraddle) && !expandOiTable ? "xl:max-2xl:w-[65%]" : ""} ${showOiChange ? "max-xl:min-h-max" : ""} flex h-full flex-col xl:items-center xl:max-2xl:justify-start 2xl:justify-start`}
              >
                <>
                  {!expandOiTable && expiries[query]?.length > 0 ? (
                    <>
                      <span
                        className={`flex w-full flex-row max-xl:gap-[1rem] max-md:my-[0.65rem] max-sm:px-3 sm:max-xl:px-[2rem] xl:gap-5 xl:max-2xl:pl-8 2xl:justify-between 2xl:pl-10 ${
                          (showMultiOi || showMultiStraddle) && showOiTable
                            ? "max-xl:hidden"
                            : showMultiOi || showMultiStraddle
                              ? "max-md:gap-0 max-sm:flex-col sm:max-md:pr-3"
                              : ""
                        } `}
                      >
                        <span
                          className={`flex flex-row max-2xl:w-full max-xl:gap-[1rem] max-md:my-[0.65rem] xl:gap-5  2xl:w-[75%] ${
                            (showMultiOi || showMultiStraddle) && showOiTable
                              ? "max-xl:hidden"
                              : showMultiOi || showMultiStraddle
                                ? "max-sm:mb-[1.5rem] sm:max-md:w-[27rem] md:max-lg:h-[2rem]"
                                : ""
                          } `}
                        >
                          {(showMultiOi ||
                            showMultiStraddle ||
                            showCombinedOi) && (
                            <TimeFilter
                              setSelected={setSelected}
                              selected={selected}
                              showMultiOi={showMultiOi}
                              showOiChange={showOiChange}
                            />
                          )}

                          {showCombinedOi && expiries[query]?.length > 0 ? (
                            <CombinedOiExpiry
                              setCombinedOiExpiry={setCombinedOiExpiry}
                              combinedOiExpiry={combinedOiExpiry}
                              query={query}
                              showCombinedOi={showCombinedOi}
                            />
                          ) : (
                            ""
                          )}
                          {showMultiStraddle ? (
                            <SumButton
                              setIsSumSelected={setIsSumSelected}
                              isSumSelected={isSumSelected}
                              setStraddleChartData={setStraddleChartData}
                            />
                          ) : (
                            ""
                          )}
                          {showOiChange ? (
                            <span className="flex w-full flex-row items-center gap-2 max-xl:justify-start max-md:hidden md:max-lg:mb-[1rem] md:max-lg:mt-[0.4rem] lg:max-xl:mt-[0.2rem] lg:max-xl:h-full lg:max-xl:items-end lg:max-xl:pb-0.5 xl:justify-start xl:max-2xl:items-start ">
                              <ToggleButton
                                buttons={OiOptions}
                                LiveButton={activeButton}
                                space="xl:max-2xl:px-2 px-3 py-1 text-[0.75rem] md:max-xl:px-5"
                                onButtonClick={handleClickActiveOiButton}
                              />
                            </span>
                          ) : showMultiStraddle ? (
                            <span className="flex w-full flex-row items-center justify-center gap-2 max-md:hidden md:max-xl:justify-start md:max-lg:mt-[0.1rem] lg:max-2xl:items-start lg:max-xl:h-full lg:max-xl:pb-0.5 xl:max-2xl:justify-start">
                              <ToggleButton
                                buttons={multiStarddleOPtions}
                                LiveButton={activeStraddleButton}
                                space="px-3 xl:max-2xl:px-2  py-1 md:max-xl:py-0.5 text-[0.75rem] md:max-lg:px-3 lg:max-xl:px-5"
                                onButtonClick={handleStraddleClick}
                              />
                            </span>
                          ) : (
                            ""
                          )}
                        </span>

                        {(showMultiStraddle || showMultiOi) && (
                          <span className="flex w-[35%] justify-end max-sm:w-full max-sm:justify-start">
                            <ShowMargin
                              marginPayload={marginPayload}
                              showCombinedOi={showCombinedOi}
                              showOiChange={showOiChange}
                              showMultiStraddle={showMultiStraddle}
                              showMultiOi={showMultiOi}
                              checkedStrangleRows={checkedStrangleRows}
                              checkedCustomRows={checkedCustomRows}
                              checkedOIRows={checkedOIRows}
                              checkedOIRadios={checkedOIRadios}
                              brokerCode={brokerCode}
                              setShowMargin={setShowMargin}
                              showMargin={showMargin}
                              calculateMargin={calculateMargin}
                              setCalculateMargin={setCalculateMargin}
                              spinningAnimation={spinningAnimation}
                              setSpinningAnimation={setSpinningAnimation}
                            />
                          </span>
                        )}
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                  {(showMultiOi ||
                    showMultiStraddle ||
                    showOiChange ||
                    showCombinedOi) &&
                    !expandOiTable && (
                      <OiPayOffChart
                        oiLoad={oiLoad}
                        query={query}
                        showMultiOi={showMultiOi}
                        showMultiStraddle={showMultiStraddle}
                        brokerCode={brokerCode}
                        oiExpiry={oiExpiry}
                        selected={selected}
                        showOiChange={showOiChange}
                        oiChangeExpiry={oiChangeExpiry}
                        strikeRange={strikeRange}
                        fromOiTime={fromOiTime}
                        toOiTime={toOiTime}
                        activeButton={activeButton}
                        straddlePayload={straddlePayload}
                        isSumSelected={isSumSelected}
                        queryIdentifier={queryIdentifier}
                        showCombinedOi={showCombinedOi}
                        combinedOiExpiry={combinedOiExpiry}
                        checkedStrangleRows={checkedStrangleRows}
                        checkedCustomRows={checkedCustomRows}
                        activeStraddleButton={activeStraddleButton}
                        showOiTable={showOiTable}
                        checkedOIRadios={checkedOIRadios}
                        setStraddleChartData={setStraddleChartData}
                        straddleChartData={straddleChartData}
                        WebsocketLtpRef={WebsocketLtpRef.current}
                      />
                    )}
                  {showOiChange && activeButton != "oi" ? (
                    <OiTimeRange
                      setFromOiTime={setFromOiTime}
                      setToOiTime={setToOiTime}
                      manageTimeRange={manageTimeRange}
                    />
                  ) : (
                    ""
                  )}
                  {/* Only for Small Screen */}
                  {showOiTable === false ? (
                    <img
                      src="/svg/plusIcon.svg"
                      height={15}
                      width={15}
                      alt=""
                      onClick={() => {
                        if (showMultiOi || showMultiStraddle) {
                          setShowOiTable(!showOiTable);
                        }
                      }}
                      className={`absolute bottom-[13%] right-[1.2rem] z-10 flex h-[3rem] w-[3rem] items-center justify-center rounded-full bg-white p-2.5 shadow-strong-top sm:max-md:bottom-[10%] md:max-xl:right-[0.8rem] ${
                        showCombinedOi || showOiChange ? "hidden" : ""
                      } xl:hidden`}
                    />
                  ) : (
                    ""
                  )}
                  {/* Only for Small Screen */}
                </>
              </span>

              {!showCombinedOi && (
                <span
                  className={`max-xl:mx-[2.5%] max-xl:w-[95%] xl:-mt-[0.05rem] xl:h-full ${expandOiTable ? " xl:flex xl:w-[100%] xl:items-center xl:justify-center" : "xl:max-2xl:w-[35%] 2xl:w-[35%]"}    ${
                    showOiTable ? "max-xl:h-full" : ""
                  } ${(showMultiOi || showMultiStraddle) && !expandOiTable ? "xl:max-2xl:w-[36%]" : ""}`}
                >
                  {/* Only for Small Screen */}
                  {showOiTable ? (
                    <span
                      className={`px-1 font-normal text-gray-500 ${
                        showCombinedOi || showOiChange ? "hidden" : ""
                      } xl:hidden`}
                      onClick={() => {
                        if (showMultiOi || showMultiStraddle) {
                          setShowOiTable(!showOiTable);
                        }
                      }}
                    >
                      <span>&lt;&lt;&lt;</span> Back to Chart
                    </span>
                  ) : (
                    " "
                  )}
                  {/* Only for Small Screen */}
                  {!showOiChange ? (
                    <>
                      <OITable
                        groupName={groupName}
                        setOiLoad={setOiLoad}
                        brokerCode={brokerCode}
                        query={query}
                        setOiExpiry={setOiExpiry}
                        setCheckedOIRows={setCheckedOIRows}
                        checkedOIRows={checkedOIRows}
                        spotPriceRoundOff={spotPriceRoundOff}
                        setSpotPriceRoundOff={setSpotPriceRoundOff}
                        setOiIncrementor={setOiIncrementor}
                        activeStraddleButton={activeStraddleButton}
                        setStraddlePayload={setStraddlePayload}
                        setCheckedCustomRows={setCheckedCustomRows}
                        checkedCustomRows={checkedCustomRows}
                        setCheckedStrangleRows={setCheckedStrangleRows}
                        checkedStrangleRows={checkedStrangleRows}
                        showMultiStraddle={showMultiStraddle}
                        showMultiOi={showMultiOi}
                        oiExpiry={oiExpiry}
                        setManuallyCheckedStraddle={setManuallyCheckedStraddle}
                        manuallyCheckedStraddle={manuallyCheckedStraddle}
                        setCheckedOiradios={setCheckedOiradios}
                        checkedOIRadios={checkedOIRadios}
                        showOiTable={showOiTable}
                        setMarginPayload={setMarginPayload}
                        expandOiTable={expandOiTable}
                        calculateMargin={calculateMargin}
                        setCalculateMargin={setCalculateMargin}
                        OIData={OIData}
                        setOIData={setOIData}
                        oiDataPercent={oiDataPercent}
                        setOiDataPercent={setOiDataPercent}
                        setOiValue={setOiValue}
                        oiValue={oiValue}
                        setProcessedIndexes={setProcessedIndexes}
                        WebsocketDataLtp={WebsocketLtpRef.current}
                        setQuerySpotPrice={setQuerySpotPrice}
                        querySpotPrice={querySpotPrice}
                      />
                    </>
                  ) : (
                    <>
                      {showOiChange ? (
                        <div
                          className={`flex w-full flex-col ${config.BSESupportIndices.includes(query) ? "items-start justify-start " : "items-center justify-center "} rounded-lg max-xl:gap-[0.65rem] max-lg:py-1 max-sm:px-1 sm:max-xl:items-start sm:max-xl:px-[1rem] xl:gap-5 xl:py-4 xl:shadow-xl`}
                        >
                          {buttonName === "Custom" && (
                            <DateRangeInputs
                              fromDate={fromDate}
                              toDate={toDate}
                              setFromDate={setFromDate}
                              setToDate={setToDate}
                            />
                          )}
                          <StrikeRange
                            spotPriceRoundOff={spotPriceRoundOff}
                            oiIncrementor={oiIncrementor}
                            setStrikeRange={setStrikeRange}
                            setManuallyMinMax={setManuallyMinMax}
                            manuallyMinMax={manuallyMinMax}
                            resetRange={resetRange}
                            setResetRange={setResetRange}
                            showOiChange={showOiChange}
                            spinningAnimation={spinningAnimation}
                            refreshStrikeRange={refreshStrikeRange}
                          />
                          <OiExpiry
                            setOiChangeExpiry={setOiChangeExpiry}
                            oiChangeExpiry={oiChangeExpiry}
                            query={query}
                          />
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </span>
              )}
            </span>
          )}
        </div>
      </div>
    </CommonLayOut>
  );
}

export default OpenInterest;
