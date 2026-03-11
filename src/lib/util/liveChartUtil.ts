export interface ChartData {
  expiry_pnl: number;
  spot_Price: number;
  strike_Price: number;
  target_pnl: number;
  target_spot_price: number;
}

export const getLiveChartData = (data: any): any => {
  const chartData: any = [];
  // console.log(data,"livePay:")
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    // console.log(item, "getchart");
    if (
      item &&
      item.expiry_pnl !== undefined &&
      item.spot_price !== undefined &&
      item.strike_price !== undefined
    ) {
      const jsonObject = {
        expiry_pnl: item.expiry_pnl,
        spotPrice: item.spot_price,
        strikePrice: item.strike_price,
        target_pnl: item.target_pnl,
        target_spot_price: item.target_spot_price,
      };
      chartData.push(jsonObject);
    }
  }

  return chartData;
};
