const OiChangeData = (data: any) => {
  const strikePriceMap: any = {};

  // Group the data by strike price
  data.forEach((item: any) => {
    if (!strikePriceMap[item.strike_price]) {
      strikePriceMap[item.strike_price] = {
        fromCallOI: null,
        toCallOI: null,
        fromPutOI: null,
        toPutOI: null,
        callChange: null,
        putChange: null,
      };
    }

    if (item.option_type === "CE") {
      strikePriceMap[item.strike_price].fromCallOI = item.from_time_oi;
      strikePriceMap[item.strike_price].toCallOI = item.to_time_oi;
      strikePriceMap[item.strike_price].callChange = item.oi_change;
    } else if (item.option_type === "PE") {
      strikePriceMap[item.strike_price].fromPutOI = item.from_time_oi;
      strikePriceMap[item.strike_price].toPutOI = item.to_time_oi;
      strikePriceMap[item.strike_price].putChange = item.oi_change;
    }
  });

  const series = [
    {
      name: "From Call OI",
      data: Object.keys(strikePriceMap).map((key) => {
        return strikePriceMap[key].callChange > 0
          ? strikePriceMap[key].fromCallOI || 0
          : null;
      }),

      group: "Call",
      stack: "fromCallStack",
    },
    {
      name: "To Call OI",
      data: Object.keys(strikePriceMap).map((key) => {
        return strikePriceMap[key].callChange < 0
          ? strikePriceMap[key].toCallOI || 0
          : null;
      }),
      group: "Call",
      stack: "toCallStack",
    },
    {
      name: "Call OI Change",
      data: Object.keys(strikePriceMap).map((key) => {
        return strikePriceMap[key].callChange > 0
          ? strikePriceMap[key].callChange || 0
          : null;
      }),

      group: "Call",
      stack: "fromCallStack",
    },

    {
      name: "Call OI Change",
      data: Object.keys(strikePriceMap).map((key) => {
        return strikePriceMap[key].callChange < 0
          ? -strikePriceMap[key].callChange || 0
          : null;
      }),

      group: "Call",
      stack: "toCallStack",
    },
    {
      name: "From put OI",
      data: Object.keys(strikePriceMap).map((key) => {
        return strikePriceMap[key].putChange > 0
          ? strikePriceMap[key].fromPutOI || 0
          : null;
      }),
      group: "Put",
      stack: "fromPutStack",
    },
    {
      name: "To Put OI",
      data: Object.keys(strikePriceMap).map((key) => {
        return strikePriceMap[key].putChange < 0
          ? strikePriceMap[key].toPutOI || 0
          : null;
      }),
      group: "Put",
      stack: "toPutStack",
    },
    {
      name: "Put OI Change",
      data: Object.keys(strikePriceMap).map((key) => {
        return strikePriceMap[key].putChange > 0
          ? strikePriceMap[key].putChange || 0
          : null;
      }),

      group: "Put",
      stack: "fromPutStack",
    },
    {
      name: "Put OI Change",
      data: Object.keys(strikePriceMap).map((key) => {
        return strikePriceMap[key].putChange < 0
          ? -strikePriceMap[key].putChange || 0
          : null; // Show change above the bar
      }),

      group: "Put",

      stack: "toPutStack",
    },
  ];

  const xAxisValues = Object.keys(strikePriceMap);

  return {
    series,
    xAxisValues,
    oiData: [
      Object.keys(strikePriceMap).map(
        (key) => strikePriceMap[key].toPutOI || 0
      ),
      Object.keys(strikePriceMap).map(
        (key) => strikePriceMap[key].fromPutOI || 0
      ),
      Object.keys(strikePriceMap).map(
        (key) => strikePriceMap[key].fromCallOI || 0
      ),
      Object.keys(strikePriceMap).map(
        (key) => strikePriceMap[key].toCallOI || 0
      ),
    ],
  };
};

export default OiChangeData;
