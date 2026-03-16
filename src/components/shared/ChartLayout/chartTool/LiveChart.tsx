"use client";

import { useEffect, useMemo, useState } from "react";
import { getChartSeries } from "@/lib/util/payoffChart/ChartSeries";
import { getChartOptions } from "@/lib/util/payoffChart/ChartOptions";
import Chart from "react-apexcharts";

const LiveChart = ({
  data,
  spotPrice,
  projectedPnl,
  targetSpotPrice,

  oiData,
  payoffExpiryDate,
  defaultChartToolTip,
}: any) => {
  let yAxis1Data: number[] = [];

  yAxis1Data = useMemo(() => {
    const expiryPnls = data?.map((i: any) => i?.expiry_pnl) || [];
    const targetPnls = data?.map((i: any) => i?.target_pnl) || [];

    const maxExpiry = Math.max(...expiryPnls, -Infinity);
    const maxTarget = Math.max(...targetPnls, -Infinity);
    return maxExpiry >= maxTarget ? expiryPnls : targetPnls;
  }, [data]); //To set the max value for the Y axis (either expiry pnl or target pnl)

  const yAxis2Data = useMemo(() => {
    // if (!oiAvailable) return []; // Return empty array if OI data is not available
    return [
      ...oiData?.map((i: any) => i?.ce_oi),
      ...oiData?.map((i: any) => i?.pe_oi),
    ].filter((item) => item !== null);
  }, [data]);

  const xAxisValues = useMemo(
    () =>
      [
        ...(data?.map((i: any) => i?.strike_price) || []),
        // Add your single number here
      ].sort((a, b) => a - b),
    [data, spotPrice], // Add 'additionalValue' to the dependencies
  );

  // Calculations for Y-Axis limits
  const maxYAxis1 = useMemo(
    () =>
      Math.max(
        Math.abs(Math.min(...yAxis1Data)),
        Math.abs(Math.max(...yAxis1Data)),
      ),
    [yAxis1Data],
  );

  const maxYAxis2 = useMemo(() => {
    // if (!oiAvailable || yAxis2Data.length === 0) return 0;
    return Math.max(
      Math.abs(Math.min(...yAxis2Data)),
      Math.abs(Math.max(...yAxis2Data)),
    );
  }, [yAxis2Data]);

  const yAxis1Min = useMemo(
    () => -Math.ceil(maxYAxis1 / 1000) * 1000,
    [maxYAxis1],
  );
  const yAxis1Max = useMemo(
    () => Math.ceil(maxYAxis1 / 1000) * 1000,
    [maxYAxis1],
  );

  const yAxis2Min = useMemo(
    () => -Math.ceil(maxYAxis2 / 1000) * 1000,
    [maxYAxis2],
  );
  const yAxis2Max = useMemo(
    () => Math.ceil(maxYAxis2 / 1000) * 1000,
    [maxYAxis2],
  );
  const gradientOffset = useMemo(() => {
    const dataMax =
      data?.length > 0 ? Math.max(...data.map((i: any) => i.expiry_pnl)) : 0;
    const dataMin =
      data?.length > 0 ? Math.min(...data.map((i: any) => i.expiry_pnl)) : 0;
    return dataMax / (dataMax - dataMin);
  }, [data]);
  const calculateWidthPercentage = useMemo(() => {
    if (data.length >= 20 && data.length < 50) return 30;
    if (data.length >= 50 && data.length < 100) return 50;
    if (data.length >= 100 && data.length < 200) return 250;
    if (data.length >= 200 && data.length < 350) return 300;
    if (data.length >= 350 && data.length < 600) return 800;
    if (length >= 600) return 700;
    return 30; // Default width
  }, [data]);

  const series = useMemo(
    () => getChartSeries(data, oiData, payoffExpiryDate),
    [data, oiData],
  );
  const options = useMemo(
    () =>
      getChartOptions(
        xAxisValues,
        gradientOffset,
        projectedPnl,
        targetSpotPrice,
        yAxis1Min,
        yAxis1Max,
        yAxis2Min,
        yAxis2Max,
        spotPrice,
        calculateWidthPercentage,
        defaultChartToolTip,
      ),
    [data, oiData],
  );

  return (
    // <div
    //   className={`ml-2 flex h-full w-full flex-col items-center justify-center ${oiAvailable ? "" : "pr-4"} `}
    // >
    <div className="relative h-full w-full ">
      <Chart
        options={options}
        series={series}
        type="line"
        height="100%"
        width="100%"
      />
    </div>
    // </div>
  );
};

export default LiveChart;
