import React, { useEffect, useRef, useState } from "react";
import { straddleTabPayload } from "../../OIUtil";
import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useNavigate } from "react-router-dom";
import config from "@/lib/config";
import StraddleStrangleChart from "./StaddleStrangleChart";
import MultiOiCustomLegend from "../multiOi/MultiOiCustomLegend";
import { getStraddleChartData } from "@/lib/redux/slices/StrategyChartSlice";
import { useDispatch, useSelector } from "react-redux";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { RootState } from "@/lib/redux/Store";

interface StraddleStrangleOiChartProps {
  oiLoad: {};
  brokerCode: number | null;
  oiExpiry: string;
  selected: number;
  showMultiStraddle: boolean;
  straddlePayload: any;
  isSumSelected: boolean;
  queryIdentifier: any;
  checkedCustomRows?: any;
  checkedStrangleRows: any;
  activeStraddleButton: any;
  setStraddleChartData?: React.Dispatch<React.SetStateAction<any>>;
  straddleChartData: any;
  checkedOIRadios?: any;
}

const StraddleStrangleOiChart: React.FC<StraddleStrangleOiChartProps> = ({
  showMultiStraddle,
  oiExpiry,
  straddlePayload,
  brokerCode,
  queryIdentifier,
  selected,
  isSumSelected,
  setStraddleChartData,
  oiLoad,
  checkedCustomRows,
  checkedStrangleRows,
  straddleChartData,
  activeStraddleButton,
  checkedOIRadios,
}) => {
  const router = useNavigate();
  const straddleIntervalRef = useRef<any>(null);
  const dispatch = useDispatch();
  const [uniqueSeries, setUniqueSeries] = useState<any>({});
  const isMarketHoliday = useSelector(
    (state: RootState) => state.MarketBasis.isMarketHoliday,
  );
  useEffect(() => {
    const fetchStraddleStrangle = () => {
      if (
        showMultiStraddle &&
        oiExpiry?.length > 0 &&
        Object.values(straddleTabPayload(straddlePayload))?.flat().length > 0
      ) {
        const intradayOiApi = new UserBrokerRouterApi(baseConfig());
        intradayOiApi
          .multiStraddleStrangleChartV1UsersMeBrokersBrokerCodeMultiStraddleStrangleChartPost(
            brokerCode,
            queryIdentifier,
            oiExpiry,
            selected,
            Object.values(straddleTabPayload(straddlePayload))?.flat(),
            isSumSelected,
          )
          .then((res: any) => {
            if (res && res?.status == 204) {
              setStraddleChartData && setStraddleChartData({});
              dispatch(getStraddleChartData({}));
            }
            setStraddleChartData && setStraddleChartData(res?.data);
            dispatch(getStraddleChartData(res?.data));
          })
          .catch((error) => {
            if (error?.response && error?.response?.status == 401) {
              autoLogoutTokenRemove(router);
            }
            // if (error?.response && error?.response?.status == 400) {
            //   setStraddleChartData && setStraddleChartData({});
            // }
             setStraddleChartData && setStraddleChartData({});
            if (error?.response && error?.response?.status == 456) {
              brokerLogoutTokenRemove(router);
            }
          });
      }
    };
    fetchStraddleStrangle();

    const fetchIfTradingTimeOiStraddleData = () => {
      if (config.isTradingTime() && brokerCode != null && !isMarketHoliday) {
        fetchStraddleStrangle();
      }
    };
    straddleIntervalRef.current = setInterval(
      fetchIfTradingTimeOiStraddleData,
      180000,
    );

    return () => {
      if (straddleIntervalRef.current) {
        clearInterval(straddleIntervalRef.current);
      }
    };
  }, [
    oiLoad,
    brokerCode,
    showMultiStraddle,
    straddlePayload,
    isSumSelected,
    selected,
  ]);
  return (
    <>
      {oiLoad &&
      Object.values(oiLoad).length > 0 &&
      straddleChartData &&
      Object.entries(straddleChartData).length > 0 &&
      Object.entries(straddlePayload).length > 0 &&
      showMultiStraddle &&
      ((activeStraddleButton == "strangle" &&
        // checkedCustomRows &&
        Object.values(checkedStrangleRows).some((u) => u == true)) ||
        (activeStraddleButton == "custom" &&
          Object.values(checkedCustomRows).some((u) => u == true)) ||
        (checkedOIRadios &&
          activeStraddleButton == "straddle" &&
          Object.values(checkedOIRadios).some((u) => u == true))) ? (
        <>
          <>
            <StraddleStrangleChart
              data={straddleChartData}
              isSumSelected={isSumSelected}
              setUniqueSeries={setUniqueSeries}
            />

            {showMultiStraddle &&
              straddleChartData &&
              Object.entries(straddleChartData).length > 0 &&
              showMultiStraddle && <MultiOiCustomLegend />}
          </>
          {/* ) : ( 
              ""
            )} */}
        </>
      ) : (
        <>
          {showMultiStraddle && (
            <div className="flex h-full w-full items-center justify-center max-sm:text-[0.75rem]">
              No Data Available
            </div>
          )}
        </>
      )}
    </>
  );
};

export default StraddleStrangleOiChart;
