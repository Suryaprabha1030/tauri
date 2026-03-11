import { chartData } from "../types";

export const getChartData = (data: any) => {
  const chartData: chartData = [] as chartData;
  // console.log(data,"surya")
  for (
    var i = 0;
    i < Math.min(data.result.length, data.spot_prices.length);
    i++
  ) {
    var jsonObject = {
      result: data.result[i],
      spotPrice: data.spot_prices[i],
      strikePrice: data.strike_prices[i],
    };
    chartData.push(jsonObject);
  }
 
  return chartData;
};
