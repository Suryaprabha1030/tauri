import React from "react";
import CombinedOiData from "./CombinedOiData";
import CombinedOiOptions from "./CombinedOiOptions";
import dynamic from "next/dynamic";

interface CombinedBarChartProps {
  data: any;
}
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const CombinedBarChart: React.FC<CombinedBarChartProps> = ({ data }) => {
  const { series } = CombinedOiData(data);
  const options = CombinedOiOptions();

  return <Chart options={options} series={series} type="bar" height="100%" />;
};

export default CombinedBarChart;
