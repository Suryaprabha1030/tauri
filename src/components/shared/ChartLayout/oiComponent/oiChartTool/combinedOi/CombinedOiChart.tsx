import React from "react";
import CombinedOiData from "./CombinedOiData";
import CombinedOiLineOptions from "./CombinedOiLineOptions";
import CombinedOiOptions from "./CombinedOiOptions";

import Chart from "react-apexcharts";
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
