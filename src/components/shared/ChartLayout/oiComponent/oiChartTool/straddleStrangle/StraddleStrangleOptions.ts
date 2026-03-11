import { formatValue, LableformatValue } from "../../OIUtil";

const StraddleStrangleOptions = (
  xAxisValues: any,
  ltp: any,
  series: any,
  pcrData: any,
  maxPainData: any
): any => {
  const pcrValues = [
    ...pcrData.flatMap((p) => p.pcr.flatMap((obj) => Object.values(obj))),
    // ...series.flatMap((s) => s.sumLtp.flatMap((obj) => Object.values(obj))),
    // ...series.flatMap((s) => s.vwap.flatMap((obj) => Object.values(obj))),
  ];
  const vwapValues = [
    ...series.flatMap((s) => s.vwap.flatMap((obj) => Object.values(obj))),
  ];
  const sumLtpValues = [
    ...series.flatMap((s) => s.sumLtp.flatMap((obj) => Object.values(obj))),
  ];

  const padding = 0;
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
      enabled: true,
      shared: false,
      intersect: false, // Try setting this to false if true is causing issues
      // intersect: true, // Keeps the tooltip fixed at specific data points
      followCursor: false, // Ensures tooltip stays at the data point
      onDatasetHover: {
        highlightDataSeries: true, // Toggle this to true for better stability
      },
      markers: {
        size: 8,
        hover: {
          size: 10,
        },
      },
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
        seriesName: "VWAP",
        show: false,
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
        // tickAmount: 4,
        min: Math.floor(Math.min(...ltp) / 10) * 10,
        max: Math.ceil(Math.max(...ltp) / 10) * 10,
      },
      {
        opposite: true,
        seriesName: "PCR",
        show: false,
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
      },
      {
        seriesName: "Max Pain",
        show: false,
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
        min: Math.floor(Math.min(...ltp) / 10) * 10,
        max: Math.ceil(Math.max(...ltp) / 10) * 10,
      },
      {
        opposite: true,
        seriesName: "Sum LTP",
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
              forceNiceScale: true,
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
              seriesName: "VWAP",
              show: false,
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
              labels: {
                show: true,
                formatter: (value: any) => LableformatValue(value),
                style: {
                  fontSize: "8px",
                  color: "#B2beb5",
                },
              },
              // tickAmount: 4,
              min: Math.floor(Math.min(...vwapValues) / 10) * 10,
              max: Math.ceil(Math.max(...vwapValues) / 10) * 10,
            },
            {
              opposite: true,
              seriesName: "PCR",
              show: false,
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
              labels: {
                show: true,
                formatter: (value: any) => LableformatValue(value),
                style: {
                  fontSize: "8px",
                  color: "#B2beb5",
                },
              },
            },
            {
              opposite: true,
              seriesName: "Max Pain",
              show: false,
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
              labels: {
                show: true,
                formatter: (value: any) => LableformatValue(value),
                style: {
                  fontSize: "8px",
                  color: "#B2beb5",
                },
              },
            },
            {
              opposite: true,
              seriesName: "Sum LTP",
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
              labels: {
                show: true,
                formatter: (value: any) => LableformatValue(value),
                style: {
                  fontSize: "8px",
                  color: "#B2beb5",
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
              seriesName: "VWAP",
              show: false,
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
              labels: {
                show: true,
                formatter: (value: any) => LableformatValue(value),
                style: {
                  fontSize: "10px",
                  color: "#B2beb5",
                },
              },
              // tickAmount: 4,
              min: Math.floor(Math.min(...vwapValues) / 10) * 10,
              max: Math.ceil(Math.max(...vwapValues) / 10) * 10,
            },
            {
              opposite: true,
              seriesName: "PCR",
              show: false,
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
              labels: {
                show: true,
                formatter: (value: any) => LableformatValue(value),
                style: {
                  fontSize: "10px",
                  color: "#B2beb5",
                },
              },
            },
            {
              opposite: true,
              seriesName: "Max Pain",
              show: false,
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
              labels: {
                show: true,
                formatter: (value: any) => LableformatValue(value),
                style: {
                  fontSize: "10px",
                  color: "#B2beb5",
                },
              },
            },
            {
              opposite: true,
              seriesName: "Sum LTP",
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
              labels: {
                show: true,
                formatter: (value: any) => LableformatValue(value),
                style: {
                  fontSize: "10px",
                  color: "#B2beb5",
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
              seriesName: "VWAP",
              show: false,
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
              // tickAmount: 4,
              min: Math.floor(Math.min(...vwapValues) / 10) * 10,
              max: Math.ceil(Math.max(...vwapValues) / 10) * 10,
            },
            {
              opposite: true,
              seriesName: "PCR",
              show: false,
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
            },
            {
              opposite: true,
              seriesName: "Max Pain",
              show: false,
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
            },
            {
              opposite: true,
              seriesName: "Sum LTP",
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

export default StraddleStrangleOptions;
