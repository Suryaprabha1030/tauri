import React, { useEffect, useState } from "react";
import ApexCharts from "react-apexcharts";
import OpenIntChangeData from "./OpenIntChangeData";
import OpenIntChangeOptions from "./OpenIntChangeOptions";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const OpenIntChangeChart = ({ data, query, WebsocketLtpRef }: any) => {
  const oiIndexData: any = useSelector(
    (state: RootState) => state.OI.OiIndexData
  );
  const [spotPriceInfoValue, setSpotPriceInfoValue] = useState();
  useEffect(() => {
    const value = WebsocketLtpRef[oiIndexData[query]?.identifier];
    setSpotPriceInfoValue(value);
  }, [oiIndexData, query]);

  const { series, xAxisValues, oiData } = OpenIntChangeData(data);
  const options = OpenIntChangeOptions(xAxisValues, oiData, spotPriceInfoValue);

  return <Chart options={options} series={series} type="bar" height="100%" />;
};

export default OpenIntChangeChart;
