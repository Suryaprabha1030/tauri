const BuySellIndexData = (
  callChg: any,
  putChg: any,
  FiiDiiDate: any,
  lineData: any,
  putchgName: string,
  callchgName: string
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
      name: callchgName,
      data: callChg,
      color: "#4CAF50",
      type: "column",
    },
    {
      name: putchgName,
      data: putChg,
      color: "#F44336",
      type: "column",
    },
  ];
  return { series: barSeries, XAxisValue: FiiDiiDate };
};

export default BuySellIndexData;
