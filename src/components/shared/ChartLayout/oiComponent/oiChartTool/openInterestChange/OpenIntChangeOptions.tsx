import { formatLtp } from "@/lib/util/oi/oiUtil";
import { formatValue, LableformatValue } from "../../OIUtil";

const OpenIntChangeOptions = (
  xAxisValues: any,
  oiData: any,
  spotPriceInfo: any
): any => {
  let targetX = spotPriceInfo;
  let nearestX = xAxisValues
    ?.map(parseFloat)
    ?.reduce((prev: any, curr: any) =>
      Math.abs(curr - targetX) < Math.abs(prev - targetX) ? curr : prev
    );
  return {
    chart: {
      type: "bar",
      toolbar: { show: false },
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
        grouped: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: xAxisValues?.map((value: any) => parseFloat(value)),
      tickAmount: 6,
    },
    yaxis: {
      tickAmount: 5,
      min: Math.floor(Math.min(...oiData.flat()) / 10) * 12,
      max: Math.ceil(Math.max(...oiData.flat()) / 10) * 11,
      axisBorder: {
        show: true,
      },
      labels: {
        show: true,
        formatter: (value: number) => LableformatValue(value),
        style: {
          fontSize: "12px",
        },
      },
    },

    fill: {
      opacity: 1,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => formatValue(value),
      },
    },
    responsive: [
      {
        breakpoint: 575,
        options: {
          xaxis: {
            categories: xAxisValues?.map((value: any) => parseFloat(value)),
            tickAmount: 4,
            labels: {
              show: true,
              rotate: -45,
              style: {
                fontSize: "8px",
              },
            },
          },
          yaxis: {
            tickAmount: 5,
            min: Math.floor(Math.min(...oiData.flat()) / 10) * 11,
            max: Math.ceil(Math.max(...oiData.flat()) / 10) * 11,
            axisBorder: {
              show: true,
              color: "#B2beb5",
            },
            labels: {
              formatter: (value: number) => LableformatValue(value),
              style: {
                fontSize: "8px",
              },
            },
          },
        },
      },
      {
        breakpoint: 1199,
        options: {
          xaxis: {
            categories: xAxisValues?.map((value: any) => parseFloat(value)),
            tickAmount: 4,
            labels: {
              show: true,
              rotate: -45,
              style: {
                fontSize: "10px",
              },
            },
          },
          yaxis: {
            tickAmount: 5,
            min: Math.floor(Math.min(...oiData.flat()) / 10) * 11,
            max: Math.ceil(Math.max(...oiData.flat()) / 10) * 11,
            axisBorder: {
              show: true,
              color: "#B2beb5",
            },
            labels: {
              show: true,
              formatter: (value: number) => LableformatValue(value),
              style: {
                fontSize: "10px",
              },
            },
          },
        },
      },
    ],
    grid: {
      show: false,
    },

    legend: {
      show: true,
    },
    annotations: {
      xaxis: [
        {
          x: nearestX,
          borderColor: "#1E3E62",
          label: {
            text: `Spot Price:${formatLtp(spotPriceInfo)}`,
            orientation: "horizontal",
            position: "top",
            style: {
              color: "black",
              background: "lightgray",
              fontWeight: "bold",
              padding: {
                left: 5,
                right: 5,
                top: 2,
                bottom: 2,
              },
              textAlign: "center",
              textAnchor: "middle",
            },
            offsetY: -10,
          },
        },
      ],
    },
  };
};

export default OpenIntChangeOptions;
