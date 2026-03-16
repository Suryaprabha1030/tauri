import React from "react";
import ApexCharts from "react-apexcharts";
import MultiChartData from "./MultiChartData";
import MultiChartOptions from "./MultiChartOptions";

import Chart from "react-apexcharts";
const MultiOi = React.memo(({ data }: any) => {
  const { series, xAxisValues, ltp, oiData } = MultiChartData(data);

  const options = MultiChartOptions(xAxisValues, ltp, oiData);

  return <Chart options={options} series={series} type="line" height="100%" />;
});
MultiOi.displayName = "MultiOi";
export default MultiOi;
