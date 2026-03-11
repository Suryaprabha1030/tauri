import { formatValue, LableformatValue } from "../../OIUtil";

const MultiChartOptions = (xAxisValues: any, ltp: any, oiData: any): any => {
  return {
    chart: {
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    background: "transparent",
    stroke: {
      show: true,
      curve: "straight",
      lineCap: "butt",
      width: 2,
      dashArray: [8, 0, 0, 0, 0, 0, 0, 0, 0],
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: xAxisValues,
      tickAmount: Math.min(xAxisValues.length, 5),

      labels: {
        show: true,
        rotate: 0,
        style: {
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      shared: false,
      intersect: false,

      y: {
        formatter: (value: any) => formatValue(value),
      },
    },
    yaxis: [
      {
        seriesName: "Spot Price",
        axisBorder: {
          show: true,
        },

        labels: {
          show: true,
          formatter: (value: any) => `${Math.floor(Math.min(value) / 10) * 10}`,
          style: {
            fontSize: "12px",
            color: "#B2beb5",
          },
        },
        tickAmount: 4,
        min: Math.floor(Math.min(...ltp) / 10) * 10,
        max: Math.ceil(Math.max(...ltp) / 10) * 10,
      },

      {
        opposite: true,
        seriesName: "OI",
        axisBorder: {
          show: true,
          color: "#B2beb5",
        },
        labels: {
          show: true,
          formatter: (value: any) => LableformatValue(value),
          style: {
            fontSize: "12px",
            color: "#B2beb5",
          },
        },
        tickAmount: 6,

        min: Math.floor(Math.min(...oiData.flat()) / 10) * 10,
        max: Math.ceil(Math.max(...oiData.flat()) / 10) * 10,
      },
    ],
    responsive: [
      {
        breakpoint: 575,
        options: {
          xaxis: {
            categories: xAxisValues,
            tickAmount: 4,
            labels: {
              show: true,
              rotate: -45,
              style: {
                fontSize: "8px",
              },
            },
          },
          yaxis: [
            {
              seriesName: "Spot Price",
              show: true,
              tickAmount: 4,
              labels: {
                show: true,
                formatter: (value: any) =>
                  `${Math.floor(Math.min(value) / 10) * 10}`,
                style: {
                  fontSize: "8px",
                },
              },
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
            },
            {
              opposite: true,
              seriesName: "OI",
              show: true,
              min: Math.floor(Math.min(...oiData.flat()) / 10) * 10,
              max: Math.ceil(Math.max(...oiData.flat()) / 10) * 10,
              tickAmount: 6,

              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
              labels: {
                show: true,
                formatter: (value: any) => LableformatValue(value),
                style: {
                  fontSize: "8px",
                },
              },
            },
          ],
        },
      },
      {
        breakpoint: 1199,
        options: {
          xaxis: {
            categories: xAxisValues,
            tickAmount: 4,
            labels: {
              show: true,
              rotate: -45,
              style: {
                fontSize: "10px",
              },
            },
          },
          yaxis: [
            {
              seriesName: "Spot Price",
              show: true,
              forceNiceScale: true,
              labels: {
                show: true,
                formatter: (value: any) =>
                  `${Math.floor(Math.min(value) / 10) * 10}`,
                style: {
                  fontSize: "10px",
                },
              },
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
            },
            {
              opposite: true,
              seriesName: "OI",
              show: true,
              tickAmount: 6,
              forceNiceScale: true,
              min: Math.floor(Math.min(...oiData.flat()) / 10) * 10,
              max: Math.ceil(Math.max(...oiData.flat()) / 10) * 10,
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
              labels: {
                show: true,
                formatter: (value: any) => LableformatValue(value),
                style: {
                  fontSize: "10px",
                },
              },
            },
          ],
        },
      },
      {
        breakpoint: 1399,
        options: {
          xaxis: {
            categories: xAxisValues,
            tickAmount: 4,
            labels: {
              show: true,
              rotate: -45,
              style: {
                fontSize: "12px",
              },
            },
          },
          yaxis: [
            {
              seriesName: "Spot Price",
              show: true,
              forceNiceScale: true,
              labels: {
                show: true,
                formatter: (value: any) =>
                  `${Math.floor(Math.min(value) / 10) * 10}`,
                style: {
                  fontSize: "12px",
                },
              },
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
            },
            {
              opposite: true,
              seriesName: "OI",
              show: true,
              tickAmount: 6,
              forceNiceScale: true,
              min: Math.floor(Math.min(...oiData.flat()) / 10) * 10,
              max: Math.ceil(Math.max(...oiData.flat()) / 10) * 10,
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
              labels: {
                show: true,
                formatter: (value: any) => LableformatValue(value),
                style: {
                  fontSize: "12px",
                },
              },
            },
          ],
        },
      },
    ],
    grid: {
      show: false,
    },
    legend: {
      show: false,
    },
  };
};

export default MultiChartOptions;
