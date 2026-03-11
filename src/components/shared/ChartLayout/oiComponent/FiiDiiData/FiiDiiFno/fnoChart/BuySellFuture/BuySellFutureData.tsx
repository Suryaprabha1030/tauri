import React from "react";

const BuySellFutureData = (
  indFut: any[],
  FiiDiiDate: any[],
  lineData: any[],
  indFutName: string
) => {
  const barSeries: any = [
    {
      name: "ltp",
      data: lineData,
      color: "#000000",
      type: "line",
      zIndex: 1,
    },
    {
      name: indFutName,
      data: indFut,
      color: "#0118D8",
      type: "column",
    },
  ];
  return { series: barSeries, XAxisValue: FiiDiiDate };
};

export default BuySellFutureData;
