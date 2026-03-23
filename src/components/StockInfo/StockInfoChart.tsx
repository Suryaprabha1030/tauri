"use client";

import React from "react";

import { format } from "date-fns";
import { getStockChartOptions } from "./StockChart/getStockChartOptions";
import { getStockChartSeries } from "./StockChart/getStockChartSeries";
import { useDispatch } from "react-redux";
import { adjustToMarketTime } from "@/lib/util/Stockinfo/Stockinfo";

import Chart from "react-apexcharts";

const LightWeightCharts = React.memo(
  ({
    data,
    AreaColor,
    volumeColor,
    showVolume,
    newsByTime,
    symbol,
  }: {
    data: {
      time: number;
      value: number;
      volume: number;
      high: number;
      low: number;
    }[];
    AreaColor: string;
    volumeColor: string;
    showVolume: boolean;
    newsByTime: any;
    symbol: string;
  }) => {
    const formattedData = data.map((point, index) => {
      const timestampInSeconds =
        point.time < 1_000_000_000_000 ? point.time : point.time / 1000;

      const istTime = new Date(timestampInSeconds * 1000);

      return {
        time: istTime.getTime(),
        dateLabel: format(istTime, "dd MMM yyyy"),
        fullLabel: format(istTime, "dd MMM yyyy HH:mm"),
        value: point?.value,
        volume: point?.volume,
        prevValue: index > 0 ? data[index - 1].value : point.value,
        high: point?.high,
        low: point?.low,
      };
    });

    const xCategories = formattedData?.map((d) => d?.fullLabel);
    const newsAnnotations = Object.entries(newsByTime).map(
      ([key, articles]: any) => {
        const { istDate, dateLabel } = adjustToMarketTime(key);

        const sameDayData = formattedData?.filter(
          (d) => d.dateLabel === dateLabel,
        );
        if (sameDayData.length === 0) return null;

        const closestPoint = sameDayData?.reduce((prev, curr) => {
          return Math.abs(curr.time - istDate.getTime()) <
            Math.abs(prev.time - istDate.getTime())
            ? curr
            : prev;
        });

        return {
          x: closestPoint?.fullLabel,
          borderColor: "#FF4560",
          label: {
            style: { color: "#fff", background: "#FF4560" },
            text: `${articles?.length} `,
          },
          articles,
          newsData: newsByTime[key],
          symbol: symbol,
        };
      },
    );

    const mergedAnnotations = Object.values(
      newsAnnotations?.reduce((acc: any, curr: any) => {
        if (!curr) return acc;
        if (!acc[curr.x]) acc[curr.x] = { ...curr, newsData: [] };
        acc[curr.x]?.newsData.push(...curr?.newsData);
        acc[curr.x].label.text = `${acc[curr.x].newsData?.length} `;
        return acc;
      }, {}),
    );

    const dispatch = useDispatch();
    const options = getStockChartOptions(
      formattedData,
      xCategories,
      AreaColor,
      volumeColor,
      showVolume,
      mergedAnnotations,
      dispatch,
    );

    const series = getStockChartSeries(formattedData, showVolume);

    return (
      <div className="relative h-full w-full overflow-hidden">
        <div className="absolute left-0 h-full w-full">
          <Chart
            options={options}
            series={series}
            type="line"
            height="100%"
            width="100%"
          />
        </div>
      </div>
    );
  },
);
LightWeightCharts.displayName = "LightWeightCharts";
export default LightWeightCharts;
