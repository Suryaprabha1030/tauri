// chartOptions.ts

import { ApexOptions } from "apexcharts";

const getGaugeChartOptions = (label: string) => {
  return {
    chart: {
      type: "donut",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 100,
      },
    },
    plotOptions: {
      pie: {
        startAngle: -90,
        endAngle: 90,
        expandOnClick: false,
        donut: {
          size: "60%",
          labels: {
            show: false,
          },
        },
      },
    },
    fill: {
      colors: ["#449C4F", "#9CA3AF", "#EF4444"], // Red for sell, gray for neutral, green for buy
    },
    labels: [label],
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: ["#FFFFFF"],
        fontSize: "8px",
      },
      formatter: (val: number) => `${val.toFixed(2)}%`,
    },
    tooltip: {
      enabled: true,
      custom: ({ seriesIndex, w }: { seriesIndex: number; w: any }) => {
        const colors = ["#449C4F", "#9CA3AF", "#EF4444"];
        const labels = ["Bullish", "Neutral", "Bearish"];
        const value = w.globals.series[seriesIndex];
        const totalValue = w.globals.series.reduce(
          (a: number, b: number) => a + b,
          0
        );
        const percentage = totalValue > 0 ? (value / totalValue) * 100 : 0;

        return `<div style="background-color: ${
          colors[seriesIndex]
        }; padding: 5px; border-radius: 5px;">
                    <span style="color: white; font-size: 12px;">
                      ${labels[seriesIndex]}: ${percentage.toFixed(2)}%
                    </span>
                  </div>`;
      },
      style: {
        fontSize: "12px",
        fontFamily: undefined,
      },
    },
  } as ApexOptions;
};

export default getGaugeChartOptions;
