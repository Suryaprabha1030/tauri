import { getYAxisTicks } from "@/lib/util/FiiDiiUtil/FiiDiiUtil";
import { FIIformatValue, formatValue } from "../../OIUtil";

const CashMarketOptions = (
  XAxisValue: any,
  lineData: any,
  fiiNetValue: any,
  diiNetValue: any,
  leftWidth: number
): any => {
  const allValues = [...diiNetValue, ...fiiNetValue];

  const minY = Math.min(...allValues);
  const maxY = Math.max(...allValues);

  const yAxisTicks = getYAxisTicks(minY, maxY);

  const tickAmount =
    leftWidth <= 60
      ? Math.min(XAxisValue.length, 3)
      : Math.min(XAxisValue.length, 5);
  const fontSize = leftWidth < 40 ? "10px" : "12px";

  return {
    chart: {
      type: "line",
      stacked: false,
      offsetX: 0,
      offsetY: 0,
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
      dashArray: [8, 0, 0],
    },
    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: XAxisValue?.map((date: any) => date?.replace(/-/g, " ")),
      tickAmount: tickAmount,
      axisBorder: {
        show: true,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: true,
        rotate: leftWidth < 35 ? -45 : 0, 
        style: {
          fontSize: fontSize,
        },
      },
    },
    tooltip: {
      shared: true,
      intersect: false,

      y: {
        formatter: (value: any) => formatValue(value),
      },
    },
    yaxis: [
      {
        seriesName: "ltp",
        axisBorder: {
          show: true,
        },

        labels: {
          show: true,
          formatter: (value: any) => `${Math.floor(Math.min(value) / 10) * 10}`,
          style: {
            fontSize: fontSize,
            color: "#B2beb5",
          },
        },
        tickAmount: 4,
        min: Math.floor(Math.min(...lineData) / 10) * 10,
        max: Math.ceil(Math.max(...lineData) / 10) * 10,
        forceNiceScale: false,
      },

      {
        opposite: true,
        seriesName: "NetValue",
        axisBorder: {
          show: true,
          color: "#B2beb5",
        },
        labels: {
          show: true,
          formatter: (value: any) => FIIformatValue(value),
          style: {
            fontSize: fontSize,
            color: "#B2beb5",
          },
        },

        forceNiceScale: false, // Important → Don't auto calculate
        tickAmount: undefined, // Don't use it
        categories: yAxisTicks, // Direct feed your ticks here
      },
    ],

    grid: {
      show: false,
      padding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 13,
      },
    },
    legend: {
      show: false,
    },

    // configured for responsiveness
     responsive: [ 
      {
        breakpoint: 576,
        options: {
          xaxis: {
            categories: XAxisValue?.map((date: any) => date?.replace(/-/g, " ")),
            tickAmount: 3,
            axisBorder: {
              show: true,
            },
            axisTicks: {
              show: false,
            },
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
              seriesName: "ltp",
              axisBorder: {
                show: true,
              },

              labels: {
                show: true,
                formatter: (value: any) => `${Math.floor(Math.min(value) / 10) * 10}`,
                style: {
                  fontSize: "8px",
                  color: "#B2beb5",
                },
              },
              tickAmount: 3,
              min: Math.floor(Math.min(...lineData) / 10) * 10,
              max: Math.ceil(Math.max(...lineData) / 10) * 10,
              forceNiceScale: false,
            },

            {
              opposite: true,
              seriesName: "NetValue",
              axisBorder: {
                show: true,
                color: "#B2beb5",
              },
              labels: {
                show: true,
                formatter: (value: any) => FIIformatValue(value),
                style: {
                  fontSize: "8px",
                  color: "#B2beb5",
                },
              },

              forceNiceScale: false, // Important → Don't auto calculate
              tickAmount: undefined, // Don't use it
              categories: yAxisTicks, // Direct feed your ticks here
            },
          ],
          tooltip: {
            shared: true,
            intersect: false,

            y: {
              formatter: (value: any) => formatValue(value),
            },
            style: {
              fontSize: "9px",
            }
          },
        }
      }, 
      {
        breakpoint: 1200,
        options: {
            xaxis: {
              categories: XAxisValue?.map((date: any) => date?.replace(/-/g, " ")),
              tickAmount: tickAmount,
              axisBorder: {
                show: true,
              },
              axisTicks: {
                show: false,
              },
              labels: {
                show: true,
                rotate: 0, 
                style: {
                  fontSize: fontSize,
                },
              },
          }
        }
      }, 
      {
        breakpoint: 1399,
        options: {
          xaxis: {
            categories: XAxisValue?.map((date: any) => date?.replace(/-/g, " ")),
            tickAmount: 3,
            axisBorder: {
              show: true,
            },
            axisTicks: {
              show: false,
            },
            labels: {
              show: true,
              rotate: leftWidth <= 40 ? -45 : 0,
              style: {
                fontSize: fontSize,
              },
            },
          }
        }
      }
     ]
  };
};

export default CashMarketOptions;
