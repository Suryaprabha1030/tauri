import React from "react";

import CashMarketData from "./CashMarketData";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import CashMarketOptions from "./CashMarketOptions";

import Chart from "react-apexcharts";

interface CashMarketChartProps {
  leftWidth: number;
}
const CashMarketChart: React.FC<CashMarketChartProps> = React.memo(
  ({ leftWidth }) => {
    const cashFlowData = useSelector(
      (state: RootState) => state.FiiDiiData.cashFlowList,
    );

    const diiNetValue = cashFlowData?.map((data: any) => data?.dii?.net_value);
    const fiiNetValue = cashFlowData?.map((data: any) => data?.fii?.net_value);
    const FiiDiiDate = useSelector(
      (state: RootState) => state.FiiDiiData.dateList,
    );
    const lineData = useSelector(
      (state: RootState) => state.FiiDiiData.FiiDiiLtpList,
    );
    const { series, XAxisValue } = CashMarketData(
      cashFlowData,
      FiiDiiDate,
      lineData,
    );
    const options = CashMarketOptions(
      XAxisValue,
      lineData,
      diiNetValue,
      fiiNetValue,
      leftWidth,
    );

    return (
      <Chart
        options={options}
        series={series}
        type="line"
        height="90%"
        width="100%"
      />
    );
  },
);
CashMarketChart.displayName = "CashMarketChart";

export default CashMarketChart;
