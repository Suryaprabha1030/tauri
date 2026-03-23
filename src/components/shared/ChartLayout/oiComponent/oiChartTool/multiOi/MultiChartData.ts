import {
  convertStrikePriceOption,
  formatDateToCustomString,
  generateColorFromStrikePrice,
} from "../../OIUtil";

const MultiChartData = (data:any) => {
  if (!data) return { series: [], xAxisValues: [], ltp1: [] };

  const ltpArr = data.spot_price_data || [];
  const oiArr = data.strike_price_groups || [];

  const transformedSpots = ltpArr
    .map((item:any) => ({ [item.time]: item.spot_price }))
    .sort(
      (a:any, b:any) =>
        new Date(Object.keys(a)[0]).getTime() -
        new Date(Object.keys(b)[0]).getTime()
    );

  const transformedStrikes = oiArr.map((item:any) => ({
    strike_price_option: item.strike_price_option,
    data: item.data
      .map((curr:any) => ({ [curr.created_at]: curr.oi }))
      .sort(
        (a:any, b:any) =>
          new Date(Object.keys(a)[0]).getTime() -
          new Date(Object.keys(b)[0]).getTime()
      ),
  }));

  function filterMatchingKeys(arr1:any, arr2:any) {
    const keysSet = new Set(arr1.map((obj:any) => Object.keys(obj)[0]));

    const filteredArr2 = arr2.map((item:any) => ({
      ...item,
      data: item.data.filter((dataObj:any) => keysSet.has(Object.keys(dataObj)[0])),
    }));

    const validKeysInArr2 = new Set(
      filteredArr2.flatMap((item:any) =>
        item.data.map((dataObj:any) => Object.keys(dataObj)[0])
      )
    );

    return {
      filteredArr1: arr1.filter((obj:any) =>
        validKeysInArr2.has(Object.keys(obj)[0])
      ),
      filteredArr2,
    };
  }

  const { filteredArr1, filteredArr2 } = filterMatchingKeys(
    transformedSpots,
    transformedStrikes
  );

  const ltp1 = filteredArr1.map((obj:any) => Object.values(obj)[0]);

  const series1 = filteredArr2.map((item:any) => ({
    name: convertStrikePriceOption(item.strike_price_option),
    data: item.data.map((obj:any) => Object.values(obj)[0]),
    yAxis: 1,
    color: generateColorFromStrikePrice(item.strike_price_option),
  }));

  const permanentSeries = {
    name: "Spot Price",
    data: ltp1.length > 0 ? ltp1 : Array(10).fill(50),
    color: "#000000",
    yAxis: 0,
    type: "line",
  };

  const xAxisValues = filteredArr1.map((obj:any) =>
    formatDateToCustomString(Object.keys(obj)[0])
  );

  return {
    series: [permanentSeries, ...series1],
    xAxisValues,
    ltp: ltp1,
    oiData: filteredArr2?.map((item:any) =>
      item.data.map((obj:any) => Object.values(obj)[0])
    ),
  };
};

export default MultiChartData;
