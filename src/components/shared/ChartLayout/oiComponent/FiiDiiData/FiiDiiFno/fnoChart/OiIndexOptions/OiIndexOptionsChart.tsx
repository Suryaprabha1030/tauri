import { RootState } from "@/lib/redux/Store";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import OIIndexOptionsData from "./OIIndexOptionsData";
import OIIndexOptionsChartOptions from "./OIIndexOptionsChartOptions";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
interface OiIndexOptionsChartProps {
  fnoTabActiveButton: string;
  callOiName: string;
  setCallOiName: React.Dispatch<React.SetStateAction<string>>;
  putOiName: string;
  setPutOiName: React.Dispatch<React.SetStateAction<string>>;
  leftWidth: number;
}
const OiIndexOptionsChart: React.FC<OiIndexOptionsChartProps> = React.memo(({
  fnoTabActiveButton,
  callOiName,
  setCallOiName,
  putOiName,
  setPutOiName,
  leftWidth,
}) => {
  const [callOi, setCallOi] = useState<any[]>([]);
  const [putOi, setPutOi] = useState<any[]>([]);
  const futureOptionsData = useSelector(
    (state: RootState) => state.FiiDiiData.futureOptionsList
  );
  useEffect(() => {
    switch (fnoTabActiveButton) {
      case "fii":
        setCallOi(
          futureOptionsData?.map(
            (data: any) => data?.fii?.oi?.index_options?.call_oi
          )
        );
        setPutOi(
          futureOptionsData?.map(
            (data: any) => data?.fii?.oi?.index_options?.put_oi
          )
        );
        setCallOiName("FII Call OI");
        setPutOiName("FII Put OI");

        break;

      case "dii":
        setCallOi(
          futureOptionsData?.map(
            (data: any) => data?.dii?.oi?.index_options?.call_oi
          )
        );
        setPutOi(
          futureOptionsData?.map(
            (data: any) => data?.dii?.oi?.index_options?.put_oi
          )
        );
        setCallOiName("DII Call OI");
        setPutOiName("DII Put OI");
        break;

      case "pro":
        setCallOi(
          futureOptionsData?.map(
            (data: any) => data?.pro?.oi?.index_options?.call_oi
          )
        );
        setPutOi(
          futureOptionsData?.map(
            (data: any) => data?.pro?.oi?.index_options?.put_oi
          )
        );
        setCallOiName("Pro Call OI");
        setPutOiName("Pro Put OI");

        break;
      case "client":
        setCallOi(
          futureOptionsData?.map(
            (data: any) => data?.client?.oi?.index_options?.call_oi
          )
        );
        setPutOi(
          futureOptionsData?.map(
            (data: any) => data?.client?.oi?.index_options?.put_oi
          )
        );
        setCallOiName("Client Call OI");
        setPutOiName("Client Put OI");

        break;

      default:
        setCallOi([]);
        setPutOi([]);
        setCallOiName("");
        setPutOiName(""); // optional: empty if no match
        break;
    }
  }, [fnoTabActiveButton, futureOptionsData]);

  //   const fiiNetValue = futureOptionsData.map((data: any) => data.fii.net_value);
  const FiiDiiDate = useSelector(
    (state: RootState) => state.FiiDiiData.dateList
  );
  const lineData = useSelector(
    (state: RootState) => state.FiiDiiData.FiiDiiLtpList
  );
  const { series, XAxisValue } = OIIndexOptionsData(
    callOi,
    putOi,
    FiiDiiDate,
    lineData,
    putOiName,
    callOiName
  );
  const options = OIIndexOptionsChartOptions(
    XAxisValue,
    lineData,
    callOi,
    putOi,
    leftWidth
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
});

OiIndexOptionsChart.displayName = "OiIndexOptionsChart";
export default OiIndexOptionsChart;
