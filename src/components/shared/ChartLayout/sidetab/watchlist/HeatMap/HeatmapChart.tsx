import React, { Dispatch, SetStateAction } from "react";
import { heatmapOptions } from "./heatmapOptions";
import { heatmapSeries } from "./heatmapSeries";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import dynamic from "next/dynamic";

interface HeatMapProps {
  HeatMapData: any[];
  setClickedHeatmapData?: Dispatch<SetStateAction<{}>>;
  xlScreenHeight?: string;
}
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const HeatMapChart: React.FC<HeatMapProps> = ({
  HeatMapData,
  setClickedHeatmapData,
  xlScreenHeight,
}) => {
  const toggleState = useSelector(
    (state: RootState) => state.analyzer.toggleState
  );

  const series = heatmapSeries(HeatMapData, toggleState);
  const options = heatmapOptions({
    setClickedHeatmapData,
    seriesData: series,
  });

  return (
    <div id="heatmap" className={`h-[80%] w-full ${xlScreenHeight}`}>
      <Chart options={options} series={series} type="treemap" height="100%" />
    </div>
  );
};

export default HeatMapChart;
