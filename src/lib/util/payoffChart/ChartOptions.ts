import { formatValue } from "../../../components/shared/ChartLayout/oiComponent/OIUtil";
import { ChartLabelFormatNumber } from "../formatUtil";
export const getChartOptions = (
  xAxisValues: number[],
  offset: any,
  ProjectedPnl: number,
  targetSpotprice: number,
  yAxis1Min: any,
  yAxis1Max: any,
  newYAxis2Min: any,
  newYAxis2Max: any,
  annotationX: number | null | any,
  calculateWidthPercentage: number,
  defaultChartToolTip: boolean
): any => {
  // Find the nearest x value in the dataset
  let nearestX = xAxisValues?.reduce((prev, curr) =>
    Math.abs(curr - annotationX) < Math.abs(prev - annotationX) ? curr : prev
  );

  return {
    chart: {
      type: "line",
      background: "transparent",
      stacked: false,
      toolbar: {
        show: false,
      },
      zoom: { enabled: false },
      animations: {
        enabled: false,

        animateGradually: {
          enabled: false,
        },
        dynamicAnimation: {
          enabled: false,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: !defaultChartToolTip
      ? ["#666666", " #a6a6a6", " #a6a6a6", "#707070"]
      : ["#4ADE80", "#051DB5", "rgba(255, 0, 0, 0.3)", "rgba(0, 187, 0, 0.3)"],

    stroke: {
      curve: "straight",
      width: [0.2, 2, 0, 0],
      colors: !defaultChartToolTip
        ? ["#666666", " #a6a6a6", " #a6a6a6", "#707070"]
        : [
            "#000000",
            "#051DB5",
            "rgba(255, 0, 0, 0.3)",
            "rgba(0, 187, 0, 0.3)",
          ],
    },
    fill: {
      type: ["gradient", "solid", "solid", "solid"],
      gradient: {
        shadeIntensity: 1,
        inverseColors: true,
        type: "vertical",
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, offset * 100, offset * 100, 100],
        colorStops: [
          {
            offset: 0,
            color: !defaultChartToolTip ? "#666666" : "#4ADE80",
            opacity: 0.9,
          },
          {
            offset: offset * 100,
            color: !defaultChartToolTip ? "#666666" : "#4ADE80",
            opacity: 0.4,
          },
          {
            offset: offset * 100,
            color: !defaultChartToolTip ? " #a6a6a6" : "#EF5350",
            opacity: 0.3,
          },
          {
            offset: 100,
            color: !defaultChartToolTip ? " #a6a6a6" : "#EF5350",
            opacity: 0.1,
          },
        ],
      },
    },
    plotOptions: {
      bar: {
        columnWidth: `${calculateWidthPercentage}%`,
        barAlignment: "center",
        dataLabels: {
          enabled: false,
        },
      },
    },
    xaxis: {
      type: "numeric",
      labels: {
        rotate: 0,
        style: {
          fontSize: "10px",
        },
      },
      tickAmount: Math.min(5, xAxisValues.length),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },

    yaxis: [
      {
        seriesName: "expiry",
        axisBorder: {
          show: false,
          color: "",
        },

        min: Math.min(0, yAxis1Min),
        max: yAxis1Max,
        forceNiceScale: true, // Forces ApexCharts to create "nice" intervals
        tickAmount: 8, // Limits the number of ticks to keep intervals readable
        labels: {
          show: true,
          formatter: (value: number) => {
            if (value === null) return "0";
            if (value === 0) return "0";
            return `${value?.toFixed(0)}`;
          },
          style: {
            fontSize: "10px",
            color: "#B2beb5",
          },
        },
        opposite: false,
      },
      {
        seriesName: "target",

        min: Math.min(0, yAxis1Min),
        max: yAxis1Max,
        show: false,
        tickAmount: 8,
        forceNiceScale: true,
        opposite: false,
      },
      {
        opposite: true,
        seriesName: "calloi",
        showForNullSeries: false,
        axisBorder: {
          show: false,
          color: "",
        },
        min: Math.min(0, newYAxis2Min),
        max: newYAxis2Max,
        forceNiceScale: true,
        tickAmount: 8,
        labels: {
          show: true,
          formatter: (value: any) =>
            value === null || value === 0 || value === -0
              ? "0"
              : ChartLabelFormatNumber(value),
          style: {
            fontSize: "10px",
            color: "#B2beb5",
          },
        },
      },
    ],

    tooltip: {
      enabled: defaultChartToolTip,
      shared: true, // Disable shared tooltip for precise control
      intersect: false,
      hideEmptySeries: true,

      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        // Get the x-value of the hovered point
        const xValue = w.globals.seriesX[seriesIndex][dataPointIndex];

        // Initialize tooltip content with your styling
        let tooltipContent = `
          <div class="pb-2 bg-white/30 backdrop-blur-md rounded shadow-md space-y-2"
            style="background: rgba(255, 255, 255, 0.3); ">
            <div class="bg-gray-100 px-4 max-sm:text-[0.6rem] text-[0.8rem]">
              <span class="p-2  " style="display: inline-block; font-weight: 450;">${xValue}</span>
              <hr>
            </div>`;

        // Define series metadata
        const seriesInfo = [
          {
            name: "Expiry Price",
            color: "#4ADE80",
            index: 0,
            useFormat: false,
          },
          { name: "Target PnL", color: "#051DB5", index: 1, useFormat: true },
          {
            name: "CallOI",
            color: "rgba(255, 0, 0, 0.3)",
            index: 2,
            useFormat: true,
          },
          {
            name: "PutOI",
            color: "rgba(0, 187, 0, 0.3)",
            index: 3,
            useFormat: true,
          },
        ];

        // Flag to check if any series has data
        let hasData = false;

        // Iterate through series to find matching data points
        seriesInfo.forEach(({ name, color, index, useFormat }) => {
          const seriesData = w.globals.initialSeries[index]?.data;
          if (!seriesData) return; // Skip if series doesn’t exist

          // Find the data point matching the x-value
          const matchingPoint = seriesData.find((point) => point.x === xValue);
          const displayColor =
            name === "ExpiryPNL" && matchingPoint.y < 0
              ? "rgba(239, 83, 80, 0.3)"
              : color;

          // Include only if a valid matching point exists
          if (
            matchingPoint &&
            matchingPoint.y !== null &&
            matchingPoint.y !== undefined
          ) {
            hasData = true;
            const value = useFormat
              ? formatValue(matchingPoint.y)
              : matchingPoint.y;
            tooltipContent += `
              <div class="sm:space-x-2 px-4 max-sm:text-[0.6rem] text-[0.8rem]">
                <span style="width: 8px; height: 8px; display: inline-block; border-radius: 50%; background-color: ${displayColor};"></span>
                <span style="width: 5rem; display: inline-block;">${name}</span>
                <span style="display: inline-block; font-weight: 350;">: </span>
                <span style="display: inline-block; font-weight: 500;">${value}</span>
              </div>`;
          }
        });

        // If no series have data for this x-value, return empty to hide tooltip
        if (!hasData) {
          return "";
        }

        tooltipContent += `</div>`;
        return tooltipContent;
      },
    },

    annotations: {
      xaxis: [
        {
          x: nearestX,
          borderColor: !defaultChartToolTip ? "#707070" : "#1E3E62",
          label: {
            text: `Spot Price: ${annotationX}`,
            orientation: "horizontal",
            position: "top",
            style: {
              color: !defaultChartToolTip ? "#fff" : "black",
              background: !defaultChartToolTip ? "#707070" : "lightblue",
              fontWeight: !defaultChartToolTip ? "" : "bold",
              padding: {
                left: 5,
                right: 30,
                top: 2,
                bottom: 2,
              },
              textAlign: "center",
              textAnchor: "middle",
            },
            offsetY: -10,
          },
        },

        {
          x: Math.round(targetSpotprice / 10) * 10,
          borderColor: "#243642", // The color of the annotation line
          strokeDashArray: 0, // Solid line (use a value > 0 for dashed)
          strokeWidth: 2,
          label: {
            style: {
              color: "#fff",
              background: !defaultChartToolTip
                ? "#707070"
                : ProjectedPnl > 0
                  ? "#449C4F"
                  : "red",
              padding: {
                left: 5,
                right: 30,
                top: 2,
                bottom: 2,
              },
              textAlign: "center",
              textAnchor: "middle",
            },
            text: `Target P&L: ${ProjectedPnl}`,
            position: "middle",
            orientation: "horizontal",
            offsetY: -10,
            cssClass: "apexcharts-point-annotation-label",
          },
        },
      ],
    },
    grid: {
      show: false,
    },
    markers: {
      size: 0, // Remove unnecessary markers
    },
    legend: {
      show: false,
    },
  };
};
