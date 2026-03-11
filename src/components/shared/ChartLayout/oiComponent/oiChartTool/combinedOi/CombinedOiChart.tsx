import React from "react";
import CombinedOiData from "./CombinedOiData";
import CombinedOiLineOptions from "./CombinedOiLineOptions";
import CombinedOiOptions from "./CombinedOiOptions";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const CombinedOiChart = ({ data }: any) => {
  const { xAxisValues, lineSeries, ltp, oiData } = CombinedOiData(data);
  const lineOptions = CombinedOiLineOptions(xAxisValues, ltp, oiData);

  return (
    <Chart
      options={lineOptions}
      series={lineSeries}
      type="line"
      height="100%"
    />
  );
};

export default CombinedOiChart;
