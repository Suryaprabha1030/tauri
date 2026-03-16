import { RootState } from "@/lib/redux/Store";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import OiIndexFutureOptions from "./OiIndexFutureOptions";
import OiIndexFutureData from "./OiIndexFutureData";
import Chart from "react-apexcharts";
interface BuySellFutureChartProps {
  fnoTabActiveButton: string;
  setOiIIndFutName: React.Dispatch<React.SetStateAction<string>>;
  oiIndFutName: string;
  leftWidth: number;
}

const OiIndexFutureChart: React.FC<BuySellFutureChartProps> = React.memo(
  ({ fnoTabActiveButton, setOiIIndFutName, oiIndFutName, leftWidth }) => {
    const [oiIndFut, setOiIndFut] = useState<any[]>([]);

    const futureOptionsData = useSelector(
      (state: RootState) => state.FiiDiiData.futureOptionsList,
    );
    useEffect(() => {
      switch (fnoTabActiveButton) {
        case "fii":
          setOiIndFut(
            futureOptionsData?.map(
              (data: any) => data?.fii?.oi?.index_futures?.ind_fut,
            ),
          );

          setOiIIndFutName("FII Index Future OI");

          break;

        case "dii":
          setOiIndFut(
            futureOptionsData?.map(
              (data: any) => data?.dii?.oi?.index_futures?.ind_fut,
            ),
          );

          setOiIIndFutName("DII Index Future OI");

          break;

        case "pro":
          setOiIndFut(
            futureOptionsData?.map(
              (data: any) => data?.pro?.oi?.index_futures?.ind_fut,
            ),
          );

          setOiIIndFutName("Pro Index Future OI");

          break;
        case "client":
          setOiIndFut(
            futureOptionsData?.map(
              (data: any) => data?.client?.oi?.index_futures?.ind_fut,
            ),
          );

          setOiIIndFutName("Client Index Future OI");

          break;

        default:
          setOiIndFut([]);
          setOiIIndFutName(""); // optional: empty if no match
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
    const { series, XAxisValue } = OiIndexFutureData(
      oiIndFut,
      oiIndFutName,
      FiiDiiDate,
      lineData,
    );
    const options = OiIndexFutureOptions(
      XAxisValue,
      lineData,
      oiIndFut,
      oiIndFutName,
      leftWidth,
    );
    return <Chart options={options} series={series} type="line" height="90%" />;
  },
);

OiIndexFutureChart.displayName = "OiIndexFutureChart";
export default OiIndexFutureChart;
