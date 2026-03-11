import { getCurrentFormattedDate } from "@/components/shared/ChartLayout/payOffChartCalculation/payOffChartUtils/calculateCommon";

export const getChartSeries = (
  chartData: any,
  oiData: any,
  payoffExpiryDate: any
) => {
  const series = [
    {
      name: "Expiry PnL",
      type: "area",
      data:
        chartData?.map((i: any) => ({
          x: i.strike_price,
          y: Number(i?.expiry_pnl?.toFixed(2)),
        })) || [],
    },
    {
      name: "TargetPrice",
      type: "line",
      data:
        getCurrentFormattedDate() == payoffExpiryDate
          ? []
          : chartData.map((i: any) => ({
              x: i.strike_price,
              y: Number(i?.target_pnl?.toFixed(2)),
            })) || [],
    },
    {
      name: "Call OI",
      type: "bar",

      data: oiData?.map((i: any) => ({ x: i.strike_price, y: i?.ce_oi })) || [],
    },
    {
      name: "Put OI",
      type: "bar",
      data: oiData?.map((i: any) => ({ x: i.strike_price, y: i?.pe_oi })) || [],
    },
  ];

  return series;
};
