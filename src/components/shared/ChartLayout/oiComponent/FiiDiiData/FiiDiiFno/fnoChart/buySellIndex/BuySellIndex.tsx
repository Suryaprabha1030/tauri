import { RootState } from "@/lib/redux/Store";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import BuySellIndexData from "./BuySellIndexData";
import BuySellIndexOptions from "./BuySellIndexOptions";
import Chart from "react-apexcharts";
interface BuySellIndexProps {
  fnoTabActiveButton: string;
  callchgName: string;
  setCallChgName: React.Dispatch<React.SetStateAction<string>>;
  putchgName: string;
  setPutChgName: React.Dispatch<React.SetStateAction<string>>;
  leftWidth: number;
}
const BuySellIndex: React.FC<BuySellIndexProps> = React.memo(
  ({
    fnoTabActiveButton,
    callchgName,
    setCallChgName,
    putchgName,
    setPutChgName,
    leftWidth,
  }) => {
    const [callChg, setCallChg] = useState<any[]>([]);
    const [putChg, setPutChg] = useState<any[]>([]);
    const futureOptionsData = useSelector(
      (state: RootState) => state.FiiDiiData.futureOptionsList,
    );
    useEffect(() => {
      switch (fnoTabActiveButton) {
        case "fii":
          setCallChg(
            futureOptionsData?.map(
              (data: any) => data?.fii?.buy_sell?.index_options?.call.call_chg,
            ),
          );
          setPutChg(
            futureOptionsData?.map(
              (data: any) => data?.fii?.buy_sell?.index_options?.put?.put_chg,
            ),
          );
          setCallChgName("FII Call Change");
          setPutChgName("FII Put Change");

          break;

        case "dii":
          setCallChg(
            futureOptionsData?.map(
              (data: any) => data?.dii?.buy_sell?.index_options?.call.call_chg,
            ),
          );
          setPutChg(
            futureOptionsData?.map(
              (data: any) => data?.dii?.buy_sell?.index_options?.put?.put_chg,
            ),
          );
          setCallChgName("DII Call Change");
          setPutChgName("DII Put Change");

          break;

        case "pro":
          setCallChg(
            futureOptionsData?.map(
              (data: any) => data?.pro?.buy_sell?.index_options?.call.call_chg,
            ),
          );
          setPutChg(
            futureOptionsData?.map(
              (data: any) => data?.pro?.buy_sell?.index_options?.put?.put_chg,
            ),
          );
          setCallChgName("Pro Call Change");
          setPutChgName("Pro Put Change");

          break;
        case "client":
          setCallChg(
            futureOptionsData?.map(
              (data: any) =>
                data?.client?.buy_sell?.index_options?.call.call_chg,
            ),
          );
          setPutChg(
            futureOptionsData?.map(
              (data: any) =>
                data?.client?.buy_sell?.index_options?.put?.put_chg,
            ),
          );
          setCallChgName("Client Call Change");
          setPutChgName("Client Put Change");

          break;

        default:
          setCallChg([]); // optional: empty if no match
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
    const { series, XAxisValue } = BuySellIndexData(
      callChg,
      putChg,
      FiiDiiDate,
      lineData,
      putchgName,
      callchgName,
    );
    const options = BuySellIndexOptions(
      XAxisValue,
      lineData,
      callChg,
      putChg,
      leftWidth,
    );
    return (
      <Chart
        options={options}
        series={series}
        type="line"
        height="90%"
        leftWidth="100%"
      />
    );
  },
);
BuySellIndex.displayName = "BuySellIndex";

export default BuySellIndex;
