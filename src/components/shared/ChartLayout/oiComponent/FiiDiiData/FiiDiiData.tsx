import React, { useEffect, useRef, useState } from "react";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { OuterSourceMarketDataAPIApi } from "@/lib/api/base";
import { useDispatch } from "react-redux";
import { getFiiDiiData } from "@/lib/redux/slices/FiiDiiSlice";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import CashMarket from "./cashMarket/CashMarket";
import { useRouter } from "next/navigation";
import FiiDiiHistory from "./FiiDiiHistory/FiiDiiHistory";
import BuySellIndex from "./FiiDiiFno/fnoChart/buySellIndex/BuySellIndex";
import BuySellFutureChart from "./FiiDiiFno/fnoChart/BuySellFuture/BuySellFutureChart";
import OiIndexOptionsChart from "./FiiDiiFno/fnoChart/OiIndexOptions/OiIndexOptionsChart";
import OiIndexFutureChart from "./FiiDiiFno/fnoChart/OiIndexFuture/OiIndexFutureChart";
import FiiDiiFnoTab from "./FiiDiiFno/FiiDiiFnoTab";
import FuturesOptionsLegend from "./FiiDiiLegend/FuturesOptionsLegend";
import FuturesOptionsBuySellLegend from "./FiiDiiLegend/FutureOptionsBuySellLegend,";
import FiiDiiSummary from "./FiiDiiSummary/FiiDiiSummary";
import { getMonthsFromMay2025 } from "@/lib/util/FiiDiiUtil/FiiDiiUtil";
import MonthSelector from "./MonthSelector";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface FiiDiiDataProps {
  FiiDiiActiveButton: string;
  leftWidth: number;
  payLoadDate: any;
  setPayLoadDate: React.Dispatch<React.SetStateAction<any>>;
}

const FiiDiiData: React.FC<FiiDiiDataProps> = ({
  FiiDiiActiveButton,
  leftWidth,
  payLoadDate,
  setPayLoadDate,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [fnoTabActiveButton, setFnoTabActiveButton] = useState("fii");
  const [marketData, setMarketData] = useState<any>({});

  const [indFutName, setIndFutName] = useState("");
  const [putOiName, setPutOiName] = useState("");
  const [callOiName, setCallOiName] = useState("");
  const [oiIndFutName, setOiIIndFutName] = useState("");
  const [callchgName, setCallChgName] = useState("");
  const [putchgName, setPutChgName] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const fectFiDiiData = async () => {
    const FiDiiApi = new OuterSourceMarketDataAPIApi(baseConfig());
    try {
      const response: any =
        await FiDiiApi.getCombinedMarketDataMarketDataMarketDataPost(
          payLoadDate
        );
      if (response.status === 204) {
        setMarketData({});
      }
      if (Object.entries(response?.data).length > 0) {
        setMarketData(response?.data);
        const cashFlowData: any = [];
        const FiiDiiHistory: any = [];
        const futureOptions: any = [];
        const date: any = [];
        const FiiDiiLtp: any = [];
        const FiiDiiLtpChg: any = [];
        const summaryData: any = {};
        Object.entries(response?.data)
          ?.sort(
            ([a], [b]) =>
              new Date(a.replace(/-/g, " ")).getTime() -
              new Date(b.replace(/-/g, " ")).getTime()
          )
          .forEach(([key, value]: any) => {
            cashFlowData.push(value?.market_overview);
            FiiDiiHistory.push(value?.market_data);
            futureOptions.push(value?.participants);
            date.push(key);
            FiiDiiLtp.push(value?.nifty);
            FiiDiiLtpChg.push(value?.nifty_chg);
            summaryData[key] = value?.summary;
          });

        dispatch(
          getFiiDiiData({
            cashFlowData: cashFlowData,
            fiiDiiHistoryData: FiiDiiHistory,
            FiiDiiDate: date,
            futureOptionsData: futureOptions,
            FiiDiiLtpData: FiiDiiLtp,
            FiiDiiLtpChgData: FiiDiiLtpChg,
            datewiseSummaryData: summaryData,
          })
        );
      }
    } catch (error: any) {
      setMarketData({});
      if (error?.response && error?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      }
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
    }
  };

  useEffect(() => {
    if (payLoadDate?.length > 0) {
      fectFiDiiData();
    }
  }, [payLoadDate]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [FiiDiiActiveButton]);

  return (
    <div
      ref={containerRef}
      className={` w-[100%]  ${FiiDiiActiveButton == "fiiDiiHistory" || FiiDiiActiveButton == "summary" || Object.entries(marketData)?.length == 0 ? "h-full overflow-hidden" : "max-h-[100%] overflow-y-auto"} overflow-x-hidden scrollbar-none`}
    >
      {Object.entries(marketData)?.length == 0 ||
      marketData?.message == "Not enough data for comparison" ? (
        <div className="flex h-[100%] w-[100%] flex-col  items-center justify-center">
          <h1>No Data Available</h1>
        </div>
      ) : (
        <>
          {FiiDiiActiveButton == "cashMarket" && (
            <span className="flex flex-col pb-10">
              <CashMarket leftWidth={leftWidth} />
            </span>
          )}

          {FiiDiiActiveButton == "futureOptions" && (
            <span className=" mb-5 ml-5 flex w-full flex-col items-center justify-center gap-5 px-5 pb-10 max-sm:px-2">
              <span className="flex h-[3.5rem] w-full items-end ">
                <FiiDiiFnoTab
                  fnoTabActiveButton={fnoTabActiveButton}
                  setFnoTabActiveButton={setFnoTabActiveButton}
                />
              </span>
              <span className=" flex w-full flex-col items-center justify-center gap-[3.5rem] pb-10 ">
                <div className="flex h-[25rem] w-full flex-col gap-4 max-2xl:px-1.5">
                  <h1 className="h-[5%]  text-[1rem] font-[440]">
                    Buy Sell in Index Options
                  </h1>

                  <FuturesOptionsBuySellLegend
                    CallName={callchgName}
                    putName={putchgName}
                    callColor="#4CAF50"
                    putColor="#F44336"
                    leftWidth={leftWidth}
                  />

                  <BuySellIndex
                    fnoTabActiveButton={fnoTabActiveButton}
                    setPutChgName={setPutChgName}
                    putchgName={putchgName}
                    setCallChgName={setCallChgName}
                    callchgName={callchgName}
                    leftWidth={leftWidth}
                  />
                </div>
                <div className="flex h-[25rem] w-full flex-col gap-4 max-2xl:px-1.5">
                  <h1 className="h-[5%] text-[1rem] font-[440]">
                    Buy Sell in Index Future
                  </h1>
                  <FuturesOptionsLegend
                    CallName={indFutName}
                    leftWidth={leftWidth}
                  />
                  <BuySellFutureChart
                    fnoTabActiveButton={fnoTabActiveButton}
                    setIndFutName={setIndFutName}
                    indFutName={indFutName}
                    leftWidth={leftWidth}
                  />
                </div>
                <div className="flex h-[25rem]  w-full flex-col gap-4 max-2xl:px-1.5">
                  <h1 className="h-[5%] text-[1rem] font-[440]">
                    OI in Index Options
                  </h1>
                  <FuturesOptionsBuySellLegend
                    CallName={callOiName}
                    putName={putOiName}
                    callColor="#4CAF50"
                    putColor="#F44336"
                    leftWidth={leftWidth}
                  />
                  <OiIndexOptionsChart
                    fnoTabActiveButton={fnoTabActiveButton}
                    setPutOiName={setPutOiName}
                    putOiName={putOiName}
                    setCallOiName={setCallOiName}
                    callOiName={callOiName}
                    leftWidth={leftWidth}
                  />
                </div>
                <div className="flex h-[25rem]  w-full flex-col gap-4 max-2xl:px-1.5">
                  <h1 className="h-[5%] text-[1rem] font-[440]">
                    OI in Index Future
                  </h1>
                  <FuturesOptionsLegend
                    CallName={oiIndFutName}
                    leftWidth={leftWidth}
                  />
                  <OiIndexFutureChart
                    fnoTabActiveButton={fnoTabActiveButton}
                    oiIndFutName={oiIndFutName}
                    setOiIIndFutName={setOiIIndFutName}
                    leftWidth={leftWidth}
                  />
                </div>
              </span>
            </span>
          )}
          {FiiDiiActiveButton == "fiiDiiHistory" && (
            <span className="h-[100vh] w-full ">
              <FiiDiiHistory leftWidth={leftWidth} />
            </span>
          )}
          {FiiDiiActiveButton == "summary" && (
            <span className="h-[100vh] w-full ">
              <FiiDiiSummary leftwidth={leftWidth} />
            </span>
          )}
        </>
      )}
    </div>
  );
};

export default FiiDiiData;
