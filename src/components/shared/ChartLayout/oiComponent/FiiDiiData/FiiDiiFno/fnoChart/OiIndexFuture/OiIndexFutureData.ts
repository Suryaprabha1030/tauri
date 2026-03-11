import React from "react";

const OiIndexFutureData = (
  oiIndFut: any[],
  oiIndFutName: string,
  FiiDiiDate: any[],
  lineData: any[]
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
      name: oiIndFutName,
      data: oiIndFut,
      color: "#0118D8",
      type: "column",
    },
  ];
  return { series: barSeries, XAxisValue: FiiDiiDate };
};

export default OiIndexFutureData;
