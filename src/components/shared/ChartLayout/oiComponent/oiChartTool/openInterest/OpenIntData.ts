const OpenIntData = (data: any) => {
  const strikePriceMap: any = {};

  // Group the data by strike price
  data.forEach((item: any) => {
    if (!strikePriceMap[item.strike_price]) {
      strikePriceMap[item.strike_price] = { call: null, put: null };
    }
    if (item.option_type === "CE") {
      strikePriceMap[item.strike_price].call = item.current_time_oi;
    } else if (item.option_type === "PE") {
      strikePriceMap[item.strike_price].put = item.current_time_oi;
    }
  });

  const series = [
    {
      name: "Call OI ",
      data: Object.keys(strikePriceMap).map(
        (key) => strikePriceMap[key].call || 0
      ),
      color: "#F44336",
    },
    {
      name: "Put OI ",
      data: Object.keys(strikePriceMap).map(
        (key) => strikePriceMap[key].put || 0
      ),
      color: "#4CAF50",
    },
  ];

  const xAxisValues = Object.keys(strikePriceMap);
  return {
    series,
    xAxisValues,
    oiData: [
      Object.keys(strikePriceMap).map((key) => strikePriceMap[key].call || 0),
      Object.keys(strikePriceMap).map((key) => strikePriceMap[key].put || 0),
    ],
  };
};

export default OpenIntData;
