import { RootState } from "@/lib/redux/Store";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BuySellFutureData from "./BuySellFutureData";
import BuySellFutureOptions from "./BuySellFutureOptions";

import Chart from "react-apexcharts";
interface BuySellFutureChartProps {
  fnoTabActiveButton: string;
  setIndFutName: React.Dispatch<React.SetStateAction<string>>;
  indFutName: string;
  leftWidth: number;
}
const BuySellFutureChart: React.FC<BuySellFutureChartProps> = React.memo(
  ({ fnoTabActiveButton, setIndFutName, indFutName, leftWidth }) => {
    const [indFut, setIndFut] = useState<any[]>([]);
    const futureOptionsData = useSelector(
      (state: RootState) => state.FiiDiiData.futureOptionsList,
    );
    useEffect(() => {
      switch (fnoTabActiveButton) {
        case "fii":
          setIndFut(
            futureOptionsData?.map(
              (data: any) => data?.fii?.buy_sell?.index_futures?.ind_fut,
            ),
          );

          setIndFutName("FII Index Future");

          break;

        case "dii":
          setIndFut(
            futureOptionsData?.map(
              (data: any) => data?.dii?.buy_sell?.index_futures?.ind_fut,
            ),
          );

          setIndFutName("DII Index Future");

          break;

        case "pro":
          setIndFut(
            futureOptionsData?.map(
              (data: any) => data?.pro?.buy_sell?.index_futures?.ind_fut,
            ),
          );

          setIndFutName("Pro Index Future");

          break;
        case "client":
          setIndFut(
            futureOptionsData?.map(
              (data: any) => data?.client?.buy_sell?.index_futures?.ind_fut,
            ),
          );

          setIndFutName("Client Index Future");

          break;

        default:
          setIndFut([]);
          setIndFutName(""); // optional: empty if no match
          break;
      }
    }, [fnoTabActiveButton, futureOptionsData]);

    //   const fiiNetValue = futureOptionsData.map((data: any) => data.fii.net_value);
    const FiiDiiDate = useSelector(
      (state: RootState) => state.FiiDiiData.dateList,
    );
    const lineData = useSelector(
      (state: RootState) => state.FiiDiiData.FiiDiiLtpList,
    );
    const { series, XAxisValue } = BuySellFutureData(
      indFut,

      FiiDiiDate,
      lineData,
      indFutName,
    );
    const options = BuySellFutureOptions(
      XAxisValue,
      lineData,
      indFut,
      indFutName,
      leftWidth,
    );
    return (
      <Chart
        options={options}
        series={series}
        type="line"
        height="90%"
        width="100%"
      />
    );
  },
);

BuySellFutureChart.displayName = "BuySellFutureChart";
export default BuySellFutureChart;
