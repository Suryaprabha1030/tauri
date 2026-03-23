import { TechnicalAnalysisRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import GaugeChart from "./GaugeChart";
import TechnicalsTable from "./TechnicalsTable";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import InfoNotes from "../InfoNotes";
import TimeframeSelector from "../TimeFrameSelector/TimeFrameSelector";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useNavigate } from "react-router-dom";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface TechnicalProps {
  clickedSymbolData: any;
  brokerCode: any;
  setTechTableOpen: Dispatch<SetStateAction<boolean>>;
  TechTableOpen: boolean;
  setTechIndicator: Dispatch<SetStateAction<any>>;
  setTechValue: Dispatch<SetStateAction<any>>;
  stockInfo?: boolean;
}
const Technicals: React.FC<TechnicalProps> = ({
  brokerCode,
  clickedSymbolData,
  TechTableOpen,
  setTechTableOpen,
  setTechIndicator,
  setTechValue,
  stockInfo,
}) => {
  const [summary, setSummary] = useState<any>({});
  const [oscillator, setoscillator] = useState<any>({});
  const [movingAverage, setMovingAverage] = useState<any>({});
  const [oscillatorData, setOscillatorData] = useState([]);
  const [movingAvgData, setMovingAvgData] = useState([]);
  const [scrollToMA, setScrollToMA] = useState<boolean>(false);
  const resolution = useSelector(
    (state: RootState) => state.charts.setTvResolution,
  );
  const timeframes = ["5", "15", "30", "60", "1D"];
  const [selectedTimeframe, setSelectedTimeframe] = useState(
    timeframes.includes(resolution) ? resolution : "1D",
  );

  const router = useNavigate();

  useEffect(() => {
    const Technicals = new TechnicalAnalysisRouterApi(baseConfig());
    setTimeout(() => {
      Technicals.taStocksV1TaPost(
        brokerCode,
        clickedSymbolData?.identifier,
        selectedTimeframe,
      )
        //As of now only NSE is accepting
        .then((res) => {
          setSummary(res.data.summary);
          setoscillator(res.data.action_counts.oscillators);
          setMovingAverage(res.data.action_counts.moving_averages);
          setOscillatorData(res.data.oscillators);
          setMovingAvgData(res.data.moving_averages);
        })
        .catch((error: any) => {
          if (error?.response && error?.response?.status == 401) {
            autoLogoutTokenRemove(router);
          }
          if (error?.response && error?.response?.status == 456) {
            brokerLogoutTokenRemove(router);
          }
          if (error?.response) {
            setSummary({});
            setoscillator({});
            setMovingAverage({});
          }
        });
    }, 100);
  }, [clickedSymbolData, brokerCode, selectedTimeframe]);

  useEffect(() => {
    if (timeframes.includes(resolution)) {
      setSelectedTimeframe(resolution);
    }
  }, [resolution]);
  return (
    <div
      className={`h-full w-full sm:max-xl:flex sm:max-xl:flex-col xl:max-2xl:mb-[5rem] ${TechTableOpen ? " md:max-lg:mb-[7.5rem] lg:max-xl:mb-[12rem] " : "md:max-lg:mb-[16rem] md:max-lg:min-h-[100%] lg:max-xl:h-[100%]"} ${stockInfo ? "sm:max-md:h-[95%] lg:max-xl:h-[95%]" : "sm:max-md:h-[95vh]"}`}
    >
      <TimeframeSelector
        selectedTimeframe={selectedTimeframe}
        onSelectTimeframe={setSelectedTimeframe}
      />
      {(summary && Object.keys(summary).length > 0) ||
      (oscillator && Object.keys(oscillator).length > 0) ||
      (movingAverage && Object.keys(movingAverage).length > 0) ? (
        <>
          {!TechTableOpen && (
            <div
              className={`ml-4 mr-3 mt-1 flex h-[95%] flex-col overflow-y-auto rounded-lg border bg-white scrollbar-none max-md:justify-start max-sm:h-[75%] sm:max-h-[80%] xl:justify-between xl:gap-2 xl:max-2xl:mt-0 xl:max-2xl:h-[82%] 2xl:min-h-[93%] ${stockInfo ? "max-sm:mx-0 max-sm:h-[85%] max-sm:w-[100%] sm:max-md:h-[90%] md:max-xl:gap-4 md:max-lg:h-[80%] lg:max-2xl:h-[100%]" : "md:max-lg:min-h-[100%] lg:max-xl:max-h-[65%]"}`}
            >
              <div
                className={`w-full max-sm:h-[55%] sm:max-md:h-[60%] sm:max-md:pt-6 md:max-lg:pt-2 lg:max-xl:h-[100%] lg:max-xl:pt-6 ${stockInfo ? "max-sm:h-[60%] sm:max-md:h-[65%] md:max-lg:h-[75%] lg:max-xl:h-[80%] xl:max-2xl:h-[75%]" : "md:max-lg:h-[56%]"}`}
                onClick={() => setTechTableOpen(true)}
              >
                {summary && Object.keys(summary).length > 0 && (
                  <GaugeChart
                    summary={summary}
                    type="1"
                    setTechValue={setTechValue}
                    setTechIndicator={setTechIndicator}
                    isStockInfo={stockInfo}
                  />
                )}
              </div>
              <div
                className={`flex h-[40%] w-full flex-row justify-between ${stockInfo ? "max-sm:h-[50%] sm:max-md:h-[55%] md:max-lg:h-[60%] lg:max-xl:h-[100%] xl:max-2xl:h-[60%]" : "lg:max-xl:h-[100%]"} `}
              >
                {oscillator && Object.keys(oscillator).length > 0 && (
                  <div
                    className="h-full w-1/2"
                    onClick={() => {
                      setTechTableOpen(true);
                      setScrollToMA(false);
                    }}
                  >
                    <GaugeChart
                      summary={oscillator}
                      type="2"
                      isStockInfo={stockInfo}
                    />
                  </div>
                )}
                {movingAverage && Object.keys(movingAverage).length > 0 && (
                  <div
                    className="h-full w-1/2"
                    onClick={() => {
                      setTechTableOpen(true);
                      setScrollToMA(true);
                    }}
                  >
                    <GaugeChart
                      summary={movingAverage}
                      type="3"
                      isStockInfo={stockInfo}
                    />
                  </div>
                )}
              </div>
            </div>
          )}{" "}
          {TechTableOpen && (
            <div
              className={`h-[95%] w-full overflow-y-auto bg-white scrollbar-thin max-sm:h-[75%] sm:max-md:h-[97%] xl:max-2xl:h-[75%] ${stockInfo ? "max-sm:h-[82%] sm:max-md:h-[100%] md:max-lg:h-[80%] lg:max-xl:h-[95%]" : "sm:max-md:mb-[3.5rem] md:max-lg:h-[98%] lg:max-xl:min-h-[100%]"} `}
            >
              <TechnicalsTable
                Oscillatordata={oscillatorData}
                MAdata={movingAvgData}
                oscillator={oscillator}
                movingAverage={movingAverage}
                scrollToMA={scrollToMA}
              />
            </div>
          )}
        </>
      ) : (
        <InfoNotes name="No Technicals" />
      )}
    </div>
  );
};
Technicals.displayName = "Technicals";
export default React.memo(Technicals);
