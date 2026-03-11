import { ApexOptions } from "apexcharts";
import { Dispatch, SetStateAction } from "react";
import { LableformatValue } from "../../../oiComponent/OIUtil";

interface HeatMapOptionsProps {
  setClickedHeatmapData?: Dispatch<SetStateAction<{}>>;
  seriesData: any;
}
type ColorRange = {
  from: number;
  to: number;
  color: string;
};

export const heatmapOptions = ({
  setClickedHeatmapData,
  seriesData,
}: HeatMapOptionsProps): ApexOptions => {
  const yValues = (seriesData ?? []).flatMap((series) =>
    series.data.map((d) => d.y)
  );

  // Split into positive and negative
  const positiveY = yValues.filter((y) => y > 0);
  const negativeY = yValues.filter((y) => y < 0);

  // Function to compute median safely
  const computeMedian = (arr: number[]) => {
    if (arr.length === 0) return null;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  };

  const posMedian = computeMedian(positiveY);
  const negMedian = computeMedian(negativeY);

  // Optional: Set thresholds with defaults if median is null
  const posThreshold = posMedian != null ? posMedian * 0.1 : 1;
  const negThreshold = negMedian != null ? Math.abs(negMedian * 0.1) : 1;
  const ranges: ColorRange[] = [];

  if (negMedian != null) {
    ranges.push(
      {
        from: -1000,
        to: negMedian - 3 * negThreshold,
        color: "#D32F2F",
      },
      {
        from: negMedian - 3 * negThreshold,
        to: negMedian - negThreshold,
        color: "#F44336",
      },
      {
        from: negMedian - negThreshold,
        to: negMedian,
        color: "#E57373",
      }
    );
  }

  if (negMedian != null && negMedian < 0) {
    const negSpan = Math.abs(negMedian); // from 0 to negMedian
    const negNeutralFrom = negMedian;
    const negNeutralTo = negMedian + negSpan * 0.3;

    ranges.push({
      from: negNeutralFrom,
      to: negNeutralTo,
      color: "#F3A9A9", // red
    });

    ranges.push({
      from: negNeutralTo,
      to: 0,
      color: "#888C88", //gray
    });
  }

  if (posMedian != null && posMedian > 0) {
    const posSpan = posMedian;
    const posNeutralFrom = posMedian - posSpan * 0.3;
    const posNeutralTo = posMedian;

    ranges.push({
      from: 0,
      to: posNeutralFrom,
      color: "#888C88", // gray
    });

    // Neutral zone (top 30%)
    ranges.push({
      from: posNeutralFrom,
      to: posNeutralTo,
      color: "#9CE8A0", // green
    });
  }

  if (posMedian != null) {
    ranges.push(
      {
        from: posMedian,
        to: posMedian + posThreshold,
        color: "#6CD672",
      },
      {
        from: posMedian + posThreshold,
        to: posMedian + 3 * posThreshold,
        color: "#51B72C",
      },
      {
        from: posMedian + 3 * posThreshold,
        to: 10000,
        color: "#388E3C",
      }
    );
  }

  return {
    chart: {
      type: "treemap",
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          const { dataPointIndex } = config;
          const clickedItem = config.w.config.series[0].data[dataPointIndex];
          setClickedHeatmapData && setClickedHeatmapData(clickedItem);
        },
      },
      height: 350,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: "12px",
      },
      formatter: function (text: any, op: any) {
        if (!op || !op.w || !op.w.config || !op.w.config.series) {
          return "";
        }

        const seriesData = op.w.config.series[op.seriesIndex]?.data;
        const dataPoint = seriesData?.[op.dataPointIndex];

        if (!dataPoint) {
          return "";
        }

        const symbolname = dataPoint.x || "Unknown";
        const chgPercent = dataPoint.y != null ? dataPoint.y : 0;
        const ltp = dataPoint.ltp != null ? dataPoint.ltp : 0;
        const oi = dataPoint.oi != null ? dataPoint.oi : null;
        const oiPercent =
          dataPoint.oiPercent != null ? dataPoint.oiPercent : null;

        const formattedChgPercent = `${chgPercent.toFixed(2)}%`;
        const formattedLtpPrice = `${ltp.toFixed(2)}`;
        const formattedOI = oi != null ? LableformatValue(oi.toFixed(2)) : "";
        const formattedOIPercent =
          oiPercent != null ? `(${oiPercent.toFixed(2)}%)` : "";

        if (chgPercent === 0) {
          return "";
        }

        return oi != null
          ? [
              formattedLtpPrice,
              `${formattedOI} ${formattedOIPercent}`,
              symbolname,
            ]
          : [formattedLtpPrice, formattedChgPercent, symbolname];
      },
      offsetY: -5,
    },
    tooltip: {
      enabled: true,
      custom: function ({ seriesIndex, dataPointIndex, w }: any) {
        const dataPoint = w.config.series[seriesIndex].data[dataPointIndex];

        const getTooltipColor = (yValue: number) => {
          const colorScale = w.config?.plotOptions?.treemap?.colorScale;
          if (!colorScale || !colorScale.ranges) return "#888C88"; // Default Gray

          const range = colorScale.ranges.find(
            (r) => yValue >= r.from && yValue < r.to
          );
          return range ? range.color : "#888C88";
        };

        const backgroundColor = getTooltipColor(dataPoint.y);
        const oi = dataPoint.oi != null ? dataPoint.oi : null;
        const oiPercent =
          dataPoint.oiPercent != null ? dataPoint.oiPercent : null;

        return oi != null
          ? `
        <div style="
          padding: 8px;
          font-size: 12px;
          background-color: ${backgroundColor};
          color: #fff;
          border-radius: 4px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
        ">
          LTP: ${dataPoint.ltp}<br/>
          OI: ${LableformatValue(dataPoint.oi?.toFixed(2))} ${
            oiPercent != null ? `(${oiPercent.toFixed(2)}%)` : ""
          }<br/>
          <strong>${dataPoint.x}${
            dataPoint.exchange ? ` (${dataPoint.exchange})` : ""
          }</strong><br/>
        </div>`
          : `
        <div style="
          padding: 8px;
          font-size: 12px;
          background-color: ${backgroundColor};
          color: #fff;
          border-radius: 4px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15);
        ">
          LTP: ${dataPoint.ltp}<br/>
          Chg: ${LableformatValue(dataPoint.y.toFixed(2))}% <br/>
          <strong>${dataPoint.x}${
            dataPoint.exchange ? ` (${dataPoint.exchange})` : ""
          }</strong><br/>
        </div>`;
      },
    },

    legend: {
      show: false,
    },
    plotOptions: {
      treemap: {
        enableShades: false,
        reverseNegativeShade: true,
        colorScale: {
          ranges,
        },
      },
    },
  };
};
