import React from "react";

const OIIndexOptionsData = (
  callOi: any[],
  putOi: any[],
  FiiDiiDate: any[],
  lineData: any[],
  putOiName: string,
  callOiName: string
): any => {
  const barSeries: any = [
    {
      name: "ltp",
      data: lineData,
      color: "#000000",
      type: "line",
      zIndex: 1,
    },
    {
      name: callOiName,
      data: callOi,
      color: "#4CAF50",
      type: "column",
    },
    {
      name: putOiName,
      data: putOi,
      color: "#F44336",
      type: "column",
    },
  ];
  return { series: barSeries, XAxisValue: FiiDiiDate };
};

export default OIIndexOptionsData;
