import React, { useEffect, useMemo, useState } from "react";
import OiChangeData from "./OiChangeData";
import OiChangeChartOptions from "./OiChangeChartOptions";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const OiChangeChart = ({
  data,
  fromOiTime,
  toOiTime,
  query,
  WebsocketLtpRef,
}: any) => {
  const { series, xAxisValues, oiData } = OiChangeData(data);

  const [customTipStyle, setCustomTipStyle] = useState({
    margin: "0.55rem",
    width: "8.5rem",
  });

  const [imageCustomMargin, setImageCustomMargin] = useState("");
  const oiIndexData: any = useSelector(
    (state: RootState) => state.OI.OiIndexData
  );
  const [spotPriceInfoValue, setSpotPriceInfoValue] = useState();
  useEffect(() => {
    const value = WebsocketLtpRef[oiIndexData[query]?.identifier];
    setSpotPriceInfoValue(value);
  }, [oiIndexData, query]);

  useEffect(() => {
    const updateMargin = () => {
      setCustomTipStyle(
        window.innerWidth < 576
          ? { margin: "0.55rem", width: "5.3rem" }
          : { margin: "0.2rem", width: "8.5rem" }
      );
      setImageCustomMargin(window.innerWidth > 576 ? "" : "0.55rem");
    };

    updateMargin(); // Set initial value
    window.addEventListener("resize", updateMargin);

    return () => window.removeEventListener("resize", updateMargin);
  }, [window.innerWidth]);

  const options = useMemo(
    () =>
      OiChangeChartOptions(
        xAxisValues,
        fromOiTime,
        toOiTime,
        customTipStyle,
        imageCustomMargin,
        oiData,
        spotPriceInfoValue
      ),
    [data, customTipStyle, imageCustomMargin]
  );

  return <Chart options={options} series={series} type="bar" height="95%" />;
};

export default OiChangeChart;
