import React, { Dispatch, Suspense, useEffect, useRef, useState } from "react";
import { RootState } from "@/lib/redux/Store";
import { useSelector } from "react-redux";
import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import LiveChart from "../chartTool/LiveChart";
import { normalizeDate } from "@/lib/util/DraftUtil";
import { useDispatch } from "react-redux";
import { setShowpayoffChart } from "@/lib/redux/slices/AnalyzerSlice";
import { getDaysBetween } from "./optionFuturesUtil/legUtil";
import { useNavigate } from "react-router-dom";
import { removeTokenField } from "@/lib/util/analyzer/handleNewStrategyUtil";

import { MultiLegCalc } from "../payOffChartCalculation/MultiLegCalc";

import { setOiChartCall } from "@/lib/redux/slices/PayoffChartSlice";
import { calculateMarginData } from "../payOffChartCalculation/payOffChartUtils/marginCalculated";
import { analyseProfitAndLoss } from "../payOffChartCalculation/payOffChartUtils/profitLossCalculation";
import { getCommonStrikeObjects } from "../payOffChartCalculation/payOffChartUtils/calculateCommon";
import {
  getDaysToExpiry,
  getStraddleChartData,
} from "@/lib/redux/slices/StrategyChartSlice";
import {
  getCachedApiData,
  getCalcData,
  getLastApiCallTime,
} from "@/lib/redux/slices/OptionChainSlice";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { futFlattenTransformData } from "../payOffChartCalculation/payOffChartUtils/netPremium";
import domtoimage from "dom-to-image";

import { setPayoffStrategyName } from "@/lib/redux/slices/screenerSlice";
import PayoffScreenshot from "./PayoffScreenshot";
import {
  clearSavedImages,
  getAllSavedStrategyImages,
  saveStrategyImage,
  uploadAllFromIndexedDB,
} from "@/lib/util/Screenerutil/ScreenerUtil";

interface LivePayoffChartProps {
  brokerCode: number | null;
  checkedOptionData: {};
  settargetPayoffdata: any;
  expiryPayload: number | null;
  setExpiryPayload: Dispatch<React.SetStateAction<any>>;
  triggerSpotPrice: any;
  query: string;
  setPayoffdata: Dispatch<React.SetStateAction<any>>;
  targetSpotPrice: any;
  setTargetSpotPrice: Dispatch<React.SetStateAction<any>>;
}
interface OptionChainInput {
  brokerCode: number;
  spotPrice: number | null;
  spotPriceRoundoff: number | null;
  exchange: string;
  indexName: string;
  any: any;
  manualSpotPrice: any;
  daysToexpiryDate: number | null;
  payoffExpiryDate: string;
}
const StrategyChart: React.FC<LivePayoffChartProps> = ({
  brokerCode,
  checkedOptionData,
  settargetPayoffdata,
  expiryPayload,
  setExpiryPayload,
  triggerSpotPrice,
  query,
  setPayoffdata,
  targetSpotPrice,
  setTargetSpotPrice,
}) => {
  const item = useSelector((state: RootState) => state.strategy.items);

  const [selectedData, setSelectedData] = useState<any>();

  const spotPriceInfo = useSelector(
    (state: RootState) => state.strategy.spotPriceData,
  );

  const positionDatas = useSelector(
    (state: RootState) => state.analyzer.PositionDataList,
  );

  const showPayoffchart = useSelector(
    (state: RootState) => state.analyzer.ShowPayOffChart,
  );
  const selectedStrategy = useSelector(
    (state: RootState) => state.analyzer.setselectedStrategy,
  );
  const strategyExited = useSelector(
    (state: RootState) => state.analyzer.SandboxExited,
  );
  const dispatch = useDispatch();
  const [projectedPnl, setprojectedPnl] = useState<any>();

  const expiry: any = useSelector(
    (state: RootState) => state.strategy.indexExpiryDate,
  );
  const router = useNavigate();
  const [payOffchartDisplay, setPayOffchartDisplay] = useState(true);
  const payOffChartPayLoad = useSelector(
    (state: RootState) => state.StrategyChart.payOffChartPayLoad,
  );
  const sanitizedPayOffChartPayload = removeTokenField(payOffChartPayLoad);
  const indexAddtionalData: any = useSelector(
    (state: RootState) => state.strategy.addtionalData,
  );
  const oiChartCall = useSelector(
    (state: RootState) => state.PayoffChart.oiChartCall,
  );
  const [oiData, setOiData] = useState([]);
  const [invalidExpiry, setInvalidExpiry] = useState<any[]>([]);
  const spotPriceRoundOff = useSelector(
    (state: RootState) => state.optionChain.spotPrice,
  );
  const noOiData = useSelector(
    (state: RootState) => state.optionChain.nooiData,
  );
  const oiPercent = useSelector(
    (state: RootState) => state.optionChain.oiPercent,
  );

  const PayoffTableOiChg = useSelector(
    (state: RootState) => state.optionChain.payoffTableOiChg,
  );
  const calcData = useSelector(
    (state: RootState) => state.optionChain.calcData,
  );
  const lastApiCallTime = useSelector(
    (state: RootState) => state.optionChain.lastApiCallTime,
  );
  const cachedApiData = useSelector(
    (state: RootState) => state.optionChain.cachedApiData,
  );
  const inputValue = useSelector(
    (state: RootState) => state.StrategyChart.inputValue,
  );
  const minExpiryDate = useSelector(
    (state: RootState) => state.StrategyChart.minExpiryDate,
  );
  const daysToExpiry = useSelector(
    (state: RootState) => state.StrategyChart.daysToExpiry,
  );
  const payoffExpiryDate = useSelector(
    (state: RootState) => state.StrategyChart.payoffExpiryDate,
  );
  const indexObjData: any = useSelector(
    (state: RootState) => state.strategy.indexObj,
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );

  const lotSizes = useSelector(
    (state: RootState) => state.strategy.lotSizeData,
  );
  const Payoffstrategy = useSelector(
    (state: RootState) => state.Screener.PayoffStrategyName,
  );
  const StrategyCount = useSelector(
    (state: RootState) => state.Screener.StrategyCount,
  );
  const indexname = useSelector((state: RootState) => state.strategy.indexName);
  const expiryValue = useSelector(
    (state: RootState) => state.optionChain.expiryValue,
  );
  const captureRef = useRef<HTMLDivElement>(null);

  const defaultInput: OptionChainInput = {
    brokerCode: brokerCode!,
    spotPrice: spotPriceInfo,
    spotPriceRoundoff: spotPriceRoundOff,
    exchange: item && item.exchange,
    indexName: item && item.index_name,
    manualSpotPrice: Number(inputValue),
    daysToexpiryDate: daysToExpiry,
    any: sanitizedPayOffChartPayload && sanitizedPayOffChartPayload,
    payoffExpiryDate: payoffExpiryDate,
  };

  const livePayOffChart = async (input: OptionChainInput) => {
    const currentTime = Date.now();

    // Use cached API data if within 60 seconds
    let apiData = cachedApiData;

    // let apiExecutionTimeMs = 0;

    if (
      currentTime - lastApiCallTime < 60000 &&
      cachedApiData &&
      !oiChartCall
    ) {
      dispatch(getCachedApiData(apiData));
    } else {
      try {
        const liveOptionApi = new UserBrokerRouterApi(baseConfig());
        const res =
          await liveOptionApi.fetchPayOffChartOiV1UsersMeBrokersBrokerCodePayOffChartOiPost(
            brokerCode,
            query,
            payoffExpiryDate,
          );
        if (res.status == 204) {
          setOiData([]);
          apiData = [];
          dispatch(getCachedApiData([]));
        } else {
          dispatch(getLastApiCallTime(currentTime));
          dispatch(getCachedApiData(res.data));
          apiData = res.data;
          dispatch(setOiChartCall(false));
        }
      } catch (err: any) {
        dispatch(setOiChartCall(true));
        if (err.status === 429) {
          setTimeout(() => livePayOffChart(input), 60000);
        } else {
          if (err?.response && err?.response?.status == 401) {
            autoLogoutTokenRemove(router);
          } else if (err?.response && err?.response?.status == 456) {
            brokerLogoutTokenRemove(router);
          }
          setOiData([]);
          apiData = [];
          dispatch(getCachedApiData([]));
        }

        // return; // Exit on API error
      }
    }

    const data = MultiLegCalc(
      input.spotPrice,
      input.spotPriceRoundoff,
      input.exchange,
      input.indexName,
      input.any,
      input.manualSpotPrice,
      input.daysToexpiryDate,
      input.payoffExpiryDate,
      dispatch,
      router,
      query,
      indexAddtionalData[query][expiry[query][0]]?.incrementer,
    );

    if (data?.renamedData?.length == 0) {
      setPayOffchartDisplay(false);
      dispatch(setShowpayoffChart(true));
      dispatch(getCalcData([]));
      dispatch(getStraddleChartData({}));

      return;
    }
    dispatch(getCalcData(data.renamedData));

    dispatch(setShowpayoffChart(true));
    setPayOffchartDisplay(true);
    settargetPayoffdata(data?.target_pnl_table);
    setTargetSpotPrice(input.manualSpotPrice);
    setPayoffdata(data.renamedData);

    setprojectedPnl(data?.projectedPnl?.target_pnl?.toFixed(2));
    // match oi data for exit strike price  from multileg calc

    // const calcNetPremium = (items, lotSize, TransactionType) => {

    if (apiData?.length > 0) {
      const getOireData = getCommonStrikeObjects(apiData, data.renamedData);

      setOiData(getOireData);
    }

    // profit loss calculation
    analyseProfitAndLoss(
      data?.validatePayOffData,
      dispatch,
      futFlattenTransformData(sanitizedPayOffChartPayload),
      lotSizes[query],
      input,
    );

    // margin caculation
    calculateMarginData(data?.margin_payload, dispatch, router, brokerCode);
  };

  useEffect(() => {
    if (
      query &&
      query?.length > 0 &&
      brokerCode &&
      inputValue != null &&
      expiryPayload != null &&
      Object.entries(item).length > 0 &&
      Object.entries(payOffChartPayLoad).length > 0 &&
      spotPriceRoundOff &&
      item?.spot_price &&
      daysToExpiry !== null
      // triggerSpotPrice
      // inputValue !== Number(item.spot_price)
    ) {
      const firstExpiryDate: any =
        expiry && expiry[defaultInput.indexName]?.[0];
      if (firstExpiryDate) {
        const payoffExpiryDate = new Date(defaultInput.payoffExpiryDate);
        const firstExpiry = new Date(firstExpiryDate);
        const normalizedPayoffExpiryDate = normalizeDate(payoffExpiryDate);
        const normalizedFirstExpiry = normalizeDate(firstExpiry);

        if (
          normalizedPayoffExpiryDate.getTime() < normalizedFirstExpiry.getTime()
        ) {
          dispatch(setShowpayoffChart(false));
        } else {
          livePayOffChart(defaultInput);
        }
      }
    }
  }, [payOffChartPayLoad, triggerSpotPrice]);

  useEffect(() => {
    if (
      brokerCode &&
      daysToExpiry !== null &&
      inputValue != null &&
      daysToExpiry !== expiryPayload &&
      Object.entries(item).length > 0 &&
      spotPriceRoundOff &&
      Object.entries(payOffChartPayLoad).length > 0
    ) {
      const firstExpiryDate = expiry && expiry[defaultInput.indexName]?.[0];
      if (firstExpiryDate) {
        const payoffExpiryDate = new Date(defaultInput.payoffExpiryDate);
        const firstExpiry = new Date(firstExpiryDate);
        const normalizedPayoffExpiryDate = normalizeDate(payoffExpiryDate);
        const normalizedFirstExpiry = normalizeDate(firstExpiry);
        if (
          normalizedPayoffExpiryDate.getTime() < normalizedFirstExpiry.getTime()
        ) {
          dispatch(setShowpayoffChart(false));
        } else {
          livePayOffChart(defaultInput);
        }
      }
    }
  }, [daysToExpiry]);

  useEffect(() => {
    if (!Array.isArray(expiry?.[query])) return;

    const allowedExpiries = expiry[query];

    const invalidExpiries =
      positionDatas &&
      Object.values(positionDatas)
        .map((pos: any) => pos?.expiry)
        .filter((posExpiry: string) => !allowedExpiries.includes(posExpiry));

    if (invalidExpiries?.length > 0) {
      setInvalidExpiry(invalidExpiries);
      dispatch(setShowpayoffChart(false));
    } else {
      setInvalidExpiry([]);
      dispatch(setShowpayoffChart(true));
    }
  }, [payOffChartPayLoad]);

  const generatChartImage = async (strategyName: string) => {
    const normalize = (v: string) => v.toLowerCase().replace(/\s+/g, "_");

    const el = captureRef.current;
    if (!el) return;

    try {
      await document.fonts.ready;
      await new Promise((r) => requestAnimationFrame(r));
      window.dispatchEvent(new Event("resize"));
      await new Promise((r) => setTimeout(r, 150));

      if (el.offsetWidth === 0 || el.offsetHeight === 0) {
        setTimeout(() => generatChartImage(strategyName), 150);
        return;
      }

      const base64 = await domtoimage.toPng(el, {
        bgcolor: "#FFFFFF",
        cacheBust: true,
        width: el.offsetWidth * 2,
        height: el.offsetHeight * 2,
        style: {
          transform: "scale(2)",
          transformOrigin: "top left",
        },
      });
      if (indexname && expiryValue) {
        const imgName = `${normalize(indexname)}_${normalize(expiryValue)}_${normalize(strategyName)}`;

        await saveStrategyImage(imgName, base64);

        const strategyKeys = Object.keys(StrategyCount);
        const lastStrategyKey = normalize(
          strategyKeys[strategyKeys.length - 1],
        );

        if (normalize(strategyName) === lastStrategyKey) {
          const savedImages = await getAllSavedStrategyImages();
          await uploadAllFromIndexedDB(savedImages, dispatch);
          dispatch(setPayoffStrategyName(null));
          await clearSavedImages();
        }
        dispatch(setPayoffStrategyName(null));
      }
    } catch (err) {
      console.error("error in img generation:", err);
    }
  };

  useEffect(() => {
    if (Payoffstrategy != null) {
      generatChartImage(Payoffstrategy);
    }
  }, [calcData]);
  return (
    <Suspense>
      {(checkedOptionData && Object.keys(checkedOptionData).length > 0) ||
      (positionDatas && Object.keys(positionDatas).length > 0) ||
      (selectedStrategy && Object.keys(selectedStrategy).length > 0) ? (
        <>
          {calcData?.length > 0 &&
          spotPriceInfo != null &&
          showPayoffchart != false &&
          payOffchartDisplay &&
          invalidExpiry &&
          invalidExpiry?.length == 0 ? (
            <>
              {!Payoffstrategy ? (
                <div className="flex w-full flex-col items-center justify-center gap-1 max-sm:mt-4 max-sm:h-full sm:h-[95%] xl:max-2xl:h-[97%]">
                  <LiveChart
                    data={calcData}
                    spotPrice={
                      typeof item?.spot_price === "number"
                        ? Number(item?.spot_price)?.toFixed(0)
                        : spotPriceInfo
                    }
                    projectedPnl={projectedPnl}
                    targetSpotPrice={targetSpotPrice}
                    oiData={oiData}
                    payoffExpiryDate={payoffExpiryDate}
                    defaultChartToolTip={true}
                    // captureRef={captureRef}
                  />
                </div>
              ) : (
                <PayoffScreenshot
                  captureRef={captureRef}
                  calcData={calcData}
                  item={item}
                  spotPriceInfo={spotPriceInfo}
                  projectedPnl={projectedPnl}
                  targetSpotPrice={targetSpotPrice}
                  oiData={oiData}
                  payoffExpiryDate={payoffExpiryDate}
                />
              )}
            </>
          ) : invalidExpiry && invalidExpiry?.length > 0 ? (
            <div className=" flex w-full items-center justify-center font-medium text-gray-400 max-xl:h-[90%] max-sm:text-center max-sm:text-[0.7rem] xl:h-[95%]">
              No Data Available for Unsupported Expiry
            </div>
          ) : showPayoffchart === false &&
            payOffchartDisplay === true &&
            spotPriceInfo != null &&
            (selectedStrategy != null || selectedData !== undefined) &&
            invalidExpiry &&
            invalidExpiry?.length == 0 ? (
            <div className=" flex w-full items-center justify-center font-medium text-gray-400 max-sm:h-[90%] max-sm:text-center max-sm:text-[0.7rem] xl:h-[95%]">
              {" "}
              Payoff Chart Cannot be Rendered For {strategyExited}{" "}
              Contracts{" "}
            </div>
          ) : (
            !payOffchartDisplay && (
              <div className=" flex w-full items-center justify-center font-medium text-gray-400 max-xl:h-[90%] max-sm:text-center max-sm:text-[0.7rem] xl:h-[95%]">
                No Data Available
              </div>
            )
          )}
        </>
      ) : (
        <div className="flex  h-full   w-full items-center justify-center font-normal text-gray-400">
          select buy/sell
        </div>
      )}
    </Suspense>
  );
};

export default StrategyChart;
