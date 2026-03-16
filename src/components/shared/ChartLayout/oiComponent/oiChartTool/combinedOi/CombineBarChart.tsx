import React from "react";
import CombinedOiData from "./CombinedOiData";
import CombinedOiOptions from "./CombinedOiOptions";

interface CombinedBarChartProps {
  data: any;
}
import Chart from "react-apexcharts";
const CombinedBarChart: React.FC<CombinedBarChartProps> = ({ data }) => {
  const { series } = CombinedOiData(data);
  const options = CombinedOiOptions();

  return <Chart options={options} series={series} type="bar" height="100%" />;
};

export default CombinedBarChart;
