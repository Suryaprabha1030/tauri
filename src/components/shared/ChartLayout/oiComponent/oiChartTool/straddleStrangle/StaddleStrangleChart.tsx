import React, { useEffect } from "react";
import ApexCharts from "react-apexcharts";
import StraddleStrangleOptions from "./StraddleStrangleOptions";
import StraddleStrangleData from "./StarddleStrangleData";
import dynamic from "next/dynamic";

interface StraddleStrangleChartProps {
  data: any;
  isSumSelected: boolean;
  setUniqueSeries: React.Dispatch<React.SetStateAction<any>>;
}
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const StraddleStrangleChart: React.FC<StraddleStrangleChartProps> = React.memo(
  ({ data, isSumSelected, setUniqueSeries }) => {
    const {
      series,
      xAxisValues,
      ltp,
      uniqueCombinedSeries,
      uniqueSeries,
      filteredArr2,
      pcrData,
      maxPainData,
    }: any = StraddleStrangleData(data);

    const combo =
      uniqueCombinedSeries?.length > 0 && uniqueCombinedSeries?.flat();

    const options = StraddleStrangleOptions(
      xAxisValues,
      ltp,
      filteredArr2,
      pcrData,
      maxPainData
    );

    return (
      <>
        {isSumSelected ? (
          <Chart options={options} series={series} type="line" height="98%" />
        ) : (
          <>
            {uniqueSeries &&
            uniqueSeries?.length > 0 &&
            combo &&
            combo.length > 0 ? (
              <ApexCharts
                options={options}
                series={combo}
                type="line"
                height="98%"
              />
            ) : (
              ""
            )}
          </>
        )}
      </>
    );
  }
);
StraddleStrangleChart.displayName = "StraddleStrangleChart";
export default StraddleStrangleChart;
