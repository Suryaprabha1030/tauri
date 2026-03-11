import React, { useEffect, useState } from "react";
import OpenIntData from "./OpenIntData";
import OpenIntOptions from "./OpenIntOptions";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const OpenIntChart = ({ data, query, WebsocketLtpRef }: any) => {
  const oiIndexData: any = useSelector(
    (state: RootState) => state.OI.OiIndexData
  );
  const [spotPriceInfoValue, setSpotPriceInfoValue] = useState();
  useEffect(() => {
    const value = WebsocketLtpRef[oiIndexData[query]?.identifier];
    setSpotPriceInfoValue(value);
  }, [oiIndexData, query]);

  const { series, xAxisValues, oiData } = OpenIntData(data);

  const options = OpenIntOptions(xAxisValues, oiData, spotPriceInfoValue);

  return <Chart options={options} series={series} type="bar" height="100%" />;
};

export default OpenIntChart;
