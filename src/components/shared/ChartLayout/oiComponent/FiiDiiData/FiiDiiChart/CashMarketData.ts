const CashMarketData = (cashFlowData: any, FiiDiiDate: any, lineData: any) => {
  const barSeries: any = [
    {
      name: "ltp",
      data: lineData,
      color: "#000000",
      type: "line",
      zIndex: 1,
    },
    {
      name: "DII Net Value",
      data: Array.isArray(cashFlowData)
        ? cashFlowData?.map((data: any) => data?.dii?.net_value)
        : [],
      color: "#009990",
      type: "column",
    },
    {
      name: "FII Net Value",
      data: Array.isArray(cashFlowData)
        ? cashFlowData.map((data: any) => data?.fii?.net_value)
        : [],
      color: "#B771E5",
      type: "column",
    },
  ];
  return { series: barSeries, XAxisValue: FiiDiiDate };
};

export default CashMarketData;
