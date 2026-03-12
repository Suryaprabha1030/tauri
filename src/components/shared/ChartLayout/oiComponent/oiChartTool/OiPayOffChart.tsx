import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import OiChangeChart from "./oiChangeChart/OiChangeChart";
import OpenIntChangeChart from "./openInterestChange/OpenIntChangeChart";
import OpenIntChart from "./openInterest/OpenIntChart";
import CustomLegend from "./oiChangeChart/Customlegend";
import CombinedBarChart from "./combinedOi/CombineBarChart";
import CombinedOiChart from "./combinedOi/CombinedOiChart";
import CombinedOiLegendWithRange from "./combinedOi/CombinedOiLegendWithRange";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useNavigate } from "react-router-dom";
import config from "@/lib/config";
import MultiOiChart from "./multiOi/MultiOiChart";
import StraddleStrangleOiChart from "./straddleStrangle/StraddleStrangleOiChart";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";

interface OiPayOffChartProps {
  oiLoad: {};
  query: string;
  brokerCode: number | null;
  oiExpiry: string;
  selected: number;
  showMultiStraddle: boolean;
  showMultiOi: boolean;
  showOiChange: boolean;
  oiChangeExpiry: string;
  strikeRange: any;
  fromOiTime: string;
  toOiTime: string;
  activeButton: string;
  straddlePayload: any;
  isSumSelected: boolean;
  queryIdentifier: any;
  showCombinedOi: boolean;
  combinedOiExpiry: string;
  checkedCustomRows: any;
  checkedStrangleRows: any;
  activeStraddleButton: any;
  showOiTable: boolean;
  checkedOIRadios: any;
  setStraddleChartData: Dispatch<SetStateAction<any>>;
  straddleChartData: any;
  WebsocketLtpRef: any;
}

const OiPayOffChart: React.FC<OiPayOffChartProps> = ({
  oiLoad,
  query,
  brokerCode,
  oiExpiry,
  selected,
  showMultiOi,
  showMultiStraddle,
  showOiChange,
  oiChangeExpiry,
  strikeRange,
  toOiTime,
  fromOiTime,
  activeButton,
  straddlePayload,
  isSumSelected,
  queryIdentifier,
  showCombinedOi,
  combinedOiExpiry,
  checkedCustomRows,
  checkedStrangleRows,
  activeStraddleButton,
  showOiTable,
  checkedOIRadios,
  setStraddleChartData,
  straddleChartData,
  WebsocketLtpRef,
}) => {
  const [oiChangeData, setOiChangeData] = useState<any>({});
  const [oiChangeboolean, setoiChangeboolean] = useState<any>(true);

  const [combinedOiPayload, setCombinedOiPayload] = useState<any>({});
  const [combinedOiMinStrikeRange, setCombinedOiMinStrikeRange] = useState<any>(
    {},
  );
  const [combinedOiMaxStrikeRange, setCombinedOiMaxStrikeRange] = useState<any>(
    {},
  );

  const oiChangeIntervalRef = useRef<any>(null);

  const combinedOiIntervalRef = useRef<any>(null);
  const router = useNavigate();
  const isMarketHoliday = useSelector(
    (state: RootState) => state.MarketBasis.isMarketHoliday,
  );
  useEffect(() => {
    if (activeButton == "oi") {
      setoiChangeboolean(false);
    } else {
      setoiChangeboolean(true);
    }
  }, [activeButton]);

  useEffect(() => {
    const payload = {
      strike_prices: strikeRange,
      expiries: oiChangeExpiry,
    };

    const fetchData = () => {
      if (
        showOiChange &&
        oiChangeExpiry?.length > 0 &&
        strikeRange?.length > 0 &&
        toOiTime?.length > 0 &&
        fromOiTime?.length > 0
      ) {
        const intradayOiChangeApi = new UserBrokerRouterApi(baseConfig());
        intradayOiChangeApi
          .fetchOiChangeV1UsersMeBrokersBrokerCodeOiChangePost(
            brokerCode,
            queryIdentifier,
            payload,
            true,
            oiChangeboolean,
            fromOiTime,
            toOiTime,
          )
          .then((res: any) => {
            if (res && res?.status == 204) {
              setOiChangeData({});
            }
            if (res?.data?.length > 0) {
              setOiChangeData(res.data);
            }
          })
          .catch((error: any) => {
            if (error?.response && error?.response?.status == 401) {
              autoLogoutTokenRemove(router);
            }
            if (error?.response && error?.response?.status == 400) {
              setOiChangeData({});
            }
            if (error?.response && error?.response?.status == 456) {
              brokerLogoutTokenRemove(router);
            }
          });
      }
    };
    fetchData();
    const fetchIfTradingTimeOiChangeData = () => {
      if (config.isTradingTime() && brokerCode != null && !isMarketHoliday) {
        fetchData();
      }
    };
    oiChangeIntervalRef.current = setInterval(
      fetchIfTradingTimeOiChangeData,
      180000,
    );
    // oiChangeIntervalRef.current = setInterval(fetchData, 180000); // 3 minutes

    // Cleanup function to clear the interval on component unmount
    return () => {
      if (oiChangeIntervalRef.current) {
        clearInterval(oiChangeIntervalRef.current);
      }
    };
  }, [
    brokerCode,
    showOiChange,
    oiChangeExpiry,
    strikeRange,
    toOiTime,
    fromOiTime,
    oiChangeboolean,
  ]);

  useEffect(() => {
    const fectchCombinedOi = () => {
      if (showCombinedOi && combinedOiExpiry?.length > 0) {
        const intradayOiApi = new UserBrokerRouterApi(baseConfig());
        intradayOiApi
          .combinedOiV1UsersMeBrokersBrokerCodeCombinedOiPost(
            brokerCode,
            queryIdentifier,
            combinedOiExpiry,
            // oiIndexData[query]?.token,
            selected,
          )
          .then((res: any) => {
            if (res && res?.status == 204) {
              setCombinedOiPayload({});
            }
            setCombinedOiPayload(res?.data);
            setCombinedOiMinStrikeRange(res?.data?.min_strike_price);
            setCombinedOiMaxStrikeRange(res?.data?.max_strike_price);
          })
          .catch((error: any) => {
            if (error?.response && error?.response?.status == 401) {
              autoLogoutTokenRemove(router);
            }
            if (error?.response && error?.response?.status == 400) {
              setCombinedOiPayload({});
            }
            if (error?.response && error?.response?.status == 456) {
              brokerLogoutTokenRemove(router);
            }
          });
      }
    };
    fectchCombinedOi();

    const fetchIfTradingTimeCombinedOiData = () => {
      if (config.isTradingTime() && brokerCode != null && !isMarketHoliday) {
        fectchCombinedOi();
      }
    };
    combinedOiIntervalRef.current = setInterval(
      fetchIfTradingTimeCombinedOiData,
      180000,
    );
    return () => {
      if (combinedOiIntervalRef.current) {
        clearInterval(combinedOiIntervalRef.current);
      }
    };
  }, [brokerCode, showCombinedOi, combinedOiExpiry, queryIdentifier, selected]);

  return (
    <div
      className={`w-[100%] ${showOiChange ? "xl:h-3/4" : "xl:h-[90%]"} ${
        showOiTable
          ? `${showMultiOi || showMultiStraddle ? "max-xl:hidden" : ""}`
          : ""
      } ${
        showOiChange
          ? "max-sm:h-[24rem] sm:max-md:h-[32rem] md:max-lg:min-h-[32rem] lg:max-xl:mt-[1rem] lg:max-xl:h-[31rem] "
          : showCombinedOi
            ? "max-xl:scroll-y-auto max-xl:pb-[1rem] max-sm:h-full sm:max-xl:h-[70rem] "
            : showMultiStraddle
              ? "max-sm:h-[27rem] sm:max-md:h-[38rem] md:max-xl:h-[37.5rem]"
              : "max-sm:h-[27rem] sm:max-md:h-[38rem] md:max-xl:h-[40rem]"
      } xl:pl-10  `}
    >
      <>
        <MultiOiChart
          oiLoad={oiLoad}
          query={query}
          brokerCode={brokerCode}
          oiExpiry={oiExpiry}
          selected={selected}
          queryIdentifier={queryIdentifier}
          showMultiOi={showMultiOi}
        />
      </>
      <>
        <StraddleStrangleOiChart
          showMultiStraddle={showMultiStraddle}
          oiExpiry={oiExpiry}
          straddlePayload={straddlePayload}
          brokerCode={brokerCode}
          queryIdentifier={queryIdentifier}
          selected={selected}
          isSumSelected={isSumSelected}
          setStraddleChartData={setStraddleChartData}
          oiLoad={oiLoad}
          checkedCustomRows={checkedCustomRows}
          checkedStrangleRows={checkedStrangleRows}
          straddleChartData={straddleChartData}
          activeStraddleButton={activeStraddleButton}
          checkedOIRadios={checkedOIRadios}
        />
      </>

      <>
        {oiChangeData && Object.entries(oiChangeData).length > 0 ? (
          <>
            {showOiChange && activeButton == "Both" ? (
              <OiChangeChart
                data={oiChangeData}
                fromOiTime={fromOiTime}
                toOiTime={toOiTime}
                query={query}
                WebsocketLtpRef={WebsocketLtpRef}
              />
            ) : (
              ""
            )}
          </>
        ) : (
          <>
            {showOiChange && activeButton == "Both" && (
              <div className="flex h-full w-full items-center justify-center">
                No Data Available
              </div>
            )}
          </>
        )}
        {oiChangeData &&
        Object.entries(oiChangeData).length > 0 &&
        showOiChange &&
        activeButton == "Both" ? (
          <CustomLegend />
        ) : (
          ""
        )}

        {oiChangeData && Object.entries(oiChangeData).length > 0 ? (
          <>
            {showOiChange && activeButton == "oichange" ? (
              <OpenIntChangeChart
                data={oiChangeData}
                query={query}
                WebsocketLtpRef={WebsocketLtpRef}
              />
            ) : (
              ""
            )}
          </>
        ) : (
          <>
            {showOiChange && activeButton == "oichange" && (
              <div className="flex h-full w-full items-center justify-center">
                No Data Available
              </div>
            )}
          </>
        )}

        {oiChangeData && Object.entries(oiChangeData).length > 0 ? (
          <>
            {showOiChange && activeButton == "oi" ? (
              <OpenIntChart
                data={oiChangeData}
                query={query}
                WebsocketLtpRef={WebsocketLtpRef}
              />
            ) : (
              ""
            )}
          </>
        ) : (
          <>
            {showOiChange && activeButton == "oi" && (
              <div className="flex h-full w-full items-center justify-center">
                No Data Available
              </div>
            )}
          </>
        )}
      </>

      <>
        {combinedOiPayload && Object.entries(combinedOiPayload).length > 0 ? (
          <>
            {showCombinedOi ? (
              <div className="flex h-[95%] w-full max-xl:flex-col max-sm:gap-[1rem] sm:max-md:gap-[1rem] md:max-xl:gap-[1.5rem] xl:flex-row xl:gap-5">
                <span className="h-full max-xl:w-full max-sm:h-[20rem] sm:max-xl:h-[38rem] xl:w-1/4">
                  <CombinedBarChart data={combinedOiPayload} />
                </span>
                <span className="flex flex-col max-xl:w-full max-sm:mb-[3rem] max-sm:h-[35rem] sm:max-md:h-[55rem] sm:max-md:gap-[0.8rem] md:max-xl:h-[45rem] md:max-xl:gap-[1rem] xl:h-full xl:w-3/4">
                  <CombinedOiChart data={combinedOiPayload} />
                  <span className="flex h-10 w-full items-center justify-center">
                    <CombinedOiLegendWithRange
                      combinedOiMaxStrikeRange={combinedOiMaxStrikeRange}
                      combinedOiMinStrikeRange={combinedOiMinStrikeRange}
                    />
                  </span>
                </span>
              </div>
            ) : (
              ""
            )}
          </>
        ) : (
          <>
            {showCombinedOi && (
              <div className="flex h-full w-full items-center justify-center font-letter">
                No Data Available
              </div>
            )}
          </>
        )}
      </>
      {/* :""} */}
    </div>
  );
};

export default OiPayOffChart;
