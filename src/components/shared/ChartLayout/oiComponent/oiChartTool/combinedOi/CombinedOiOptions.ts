import { formatValue, LableformatValue } from "../../OIUtil";

const CombinedOiOptions = (): any => {
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
        distributed: true,
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
      categories: ["Call", "Put"],
    },
    yaxis: {
      labels: {
        show: true,
        axisBorder: {
          show: true,
          color: "#B2beb5",
        },
        formatter: (value: number) => LableformatValue(value),
        style: {
          fontSize: "12px",
        },
      },
    },
    responsive: [
      {
        breakpoint: 575,
        options: {
          xaxis: {
            categories: ["Call", "Put"],
            labels: {
              show: true,
              style: {
                fontSize: "8px",
              },
            },
          },
          yaxis: {
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
            categories: ["Call", "Put"],
            labels: {
              show: true,
              rotate: -45,
              style: {
                fontSize: "10px",
              },
            },
          },
          yaxis: {
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
    fill: {
      opacity: 1,
    },
    grid: {
      show: false,
    },

    tooltip: {
      shared: false,
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        const category = w.globals.labels[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        const color = category == "Call" ? "#FF4560" : "#4CAF50";
        return `
                  <div class="tooltip">
                    <div class="ash-box p-2 text-black bg-gray-200 font-semibold text-[0.7rem]">${category}</div> 
                    <div style="display: flex; align-items: center;" class='text-[0.7rem] p-2' >
                    <div class='text-[0.7rem] p-2' style="background-color: ${color}; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px;"></div>
                    <div style="font-size: 14px;" class='[text-[0.7rem]'>${category} : <span class='[text-[0.5rem] font-semibold'>${formatValue(
                      value
                    )}</span></div>
                  </div>
                  </div>`;
      },
    },
    legend: {
      show: false,
    },
    colors: ["#F44336", "#4CAF50"],
  };
};

export default CombinedOiOptions;
