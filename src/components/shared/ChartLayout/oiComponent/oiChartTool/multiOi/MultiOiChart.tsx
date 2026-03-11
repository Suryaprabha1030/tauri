import React, { useEffect, useRef, useState } from "react";
import MultiOi from "./MultiOi";
import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { useRouter } from "next/navigation";
import config from "@/lib/config";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface MultiOiChartProps {
  showMultiOi: boolean;
  oiLoad: {};
  query: string;
  brokerCode: number | null;
  oiExpiry: string;
  selected: number;
  queryIdentifier: any;
}

const MultiOiChart: React.FC<MultiOiChartProps> = ({
  oiLoad,
  showMultiOi,
  brokerCode,
  selected,
  oiExpiry,
  queryIdentifier,
}) => {
  const oiIndexData: any = useSelector(
    (state: RootState) => state.OI.OiIndexData
  );
  const [oiChartData, setOiChartData] = useState<any>({});
  const router = useRouter();
  const intradayIntervalRef = useRef<any>(null);
  const isMarketHoliday = useSelector(
    (state: RootState) => state.MarketBasis.isMarketHoliday
  );
  useEffect(() => {
    const fecthIntraday = () => {
      if (
        oiLoad &&
        Object.values(oiLoad).length > 0 &&
        oiExpiry.length > 0 &&
        showMultiOi &&
        queryIdentifier.length > 0
      ) {
        const intradayOiApi = new UserBrokerRouterApi(baseConfig());
        intradayOiApi
          .fetchOiDataV1UsersMeBrokersBrokerCodeFetchOiDataPost(
            brokerCode,
            queryIdentifier,
            oiExpiry,
            selected,
            Object.values(oiLoad)
          )
          .then((res: any) => {
            if (res.data?.strike_price_groups?.length > 0) {
              setOiChartData(res.data);
            }
          })
          .catch((error: any) => {
            if (error?.response && error?.response?.status == 401) {
              autoLogoutTokenRemove(router);
            }
            if (error?.response && error?.response?.status == 400) {
              setOiChartData({});
            }
            if (error?.response && error?.response?.status == 456) {
              brokerLogoutTokenRemove(router);
            }
          });
      }
    };
    fecthIntraday();

    const fetchIfTradingTimeOiData = () => {
      if (config.isTradingTime() && brokerCode != null && !isMarketHoliday) {
        fecthIntraday();
      }
    };
    intradayIntervalRef.current = setInterval(fetchIfTradingTimeOiData, 180000);
    return () => {
      if (intradayIntervalRef.current) {
        clearInterval(intradayIntervalRef.current);
      }
    };
  }, [oiLoad, brokerCode, selected, showMultiOi]);

  return (
    <>
      {oiLoad &&
      Object.values(oiLoad).length > 0 &&
      oiChartData &&
      Object.entries(oiChartData).length > 0 ? (
        <>{showMultiOi ? <MultiOi data={oiChartData} /> : ""}</>
      ) : (
        <>
          {showMultiOi && (
            <div className="flex h-full w-full items-center justify-center max-sm:text-[0.75rem]">
              No Data Available
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MultiOiChart;
