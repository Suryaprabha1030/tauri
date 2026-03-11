import { convertTime, formatLtp } from "@/lib/util/oi/oiUtil";
import { formatValue, LableformatValue } from "../../OIUtil";

const OiChangeChartOptions = (
  xAxisValues: any,
  fromOiTime: any,
  toOiTime: any,
  customTipStyle: any,
  imageCustomMargin: any,
  oiData: any,
  spotPriceInfo: any
): any => {
  let targetX = spotPriceInfo;

  // Find the nearest x value in the dataset
  let nearestX = xAxisValues
    ?.map(parseFloat)
    ?.reduce((prev: any, curr: any) =>
      Math.abs(curr - targetX) < Math.abs(prev - targetX) ? curr : prev
    );

  return {
    chart: {
      type: "bar",
      toolbar: { show: false },
      stacked: true,
    },
    animations: {
      enabled: true,
      easing: "easeinout",
      speed: 600,
      animateGradually: {
        enabled: true,
        delay: 200,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: xAxisValues?.map((value: any) => parseFloat(value)),
      tickAmount: 8,
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
    yaxis: {
      axisBorder: {
        show: true,
      },
      tickAmount: 5,
      min: Math.floor(Math.min(...oiData.flat()) / 10) * 10,
      max: Math.ceil(Math.max(...oiData.flat()) / 10) * 11,
      labels: {
        show: true,
        formatter: (value: number) => LableformatValue(value),
        style: {
          fontSize: "12px",
        },
      },
    },

    fill: {
      colors: [
        "#F44336",
        "#F44336",
        "#F44336",
        "transparent",
        "#4CAF50",
        "#4CAF50",
        "#4CAF50",
        "transparent",
      ], // Different colors for Call/Put bars
      type: [
        "solid",
        "solid",
        "pattern",
        "solid",
        "solid",
        "solid",
        "pattern",
        "solid",
      ],
      pattern: {
        style: [
          "solid",
          "solid",
          "slantedLines",
          "solid",
          "solid",
          "solid",
          "slantedLines",
          "solid",
        ],
      },
    },

    tooltip: {
      shared: true,
      intersect: false,

      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const callNeg = series[3][dataPointIndex];
        const callPost = series[2][dataPointIndex];
        const callChangeOi = callNeg
          ? series[3][dataPointIndex]
          : series[2][dataPointIndex];
        const fromCallOi = callNeg
          ? series[1][dataPointIndex] + series[3][dataPointIndex]
          : series[0][dataPointIndex];

        const toCallOi = callPost
          ? series[0][dataPointIndex] + series[2][dataPointIndex]
          : series[1][dataPointIndex];

        const putChangeNeg = series[7][dataPointIndex];
        const putChangePost = series[6][dataPointIndex];
        const putChangeOI = putChangeNeg
          ? series[7][dataPointIndex]
          : series[6][dataPointIndex];
        const fromPutOI = putChangeNeg
          ? series[5][dataPointIndex] + series[7][dataPointIndex]
          : series[4][dataPointIndex];
        const toPutOI = putChangePost
          ? series[4][dataPointIndex] + series[6][dataPointIndex]
          : series[5][dataPointIndex];
        const call = "#FF4560";
        const put = "#4CAF50";
        const callimageTag = callNeg
          ? `<span style="width: 9px; height: 9px; border:2px solid ${call};  display: inline-block; margin-right: 0.55rem;"/>`
          : `<img src="/images/red_stripes.png" width="9" height="9" alt="Tooltip Image" style="width: 9px; margin-right:${imageCustomMargin}"   />`;
        const putimageTag = putChangeNeg
          ? `<span style="width: 9px; height: 9px; border:2px solid ${put};  display: inline-block; margin-right: 0.55rem;"/>`
          : `<img src="/images/green_stripes.png" width="9" height="9" alt="Tooltip Image" style="margin-right:${imageCustomMargin}" />`;

        const FromPutOi = putChangeNeg
          ? `<span style="width: 9px; height: 9px; border:2px solid white;  display: inline-block; margin-right: 0.55rem;"/>`
          : `<span style="width: 9px; height: 9px; background-color:${put}; display: inline-block; margin-right: 0.55rem;"/>`;
        const ToPutOi = putChangePost
          ? `<span style="width: 9px; height: 9px; border:2px solid white;  display: inline-block; margin-right: 0.55rem;"/>`
          : `<span style="width: 9px; height: 9px; background-color:${put}; display: inline-block; margin-right: 0.55rem;"/>`;
        const FromcallOi = callPost
          ? `<span style="width: 9px; height: 9px; background-color:${call}; display: inline-block; margin-right: 0.55rem;"/>`
          : `<span style="width: 9px; height: 9px; border:2px solid white;  display: inline-block; margin-right: 0.55rem;"/>`;
        const TocallOi = callNeg
          ? `<span style="width: 9px; height: 9px; background-color:${call}; display: inline-block; margin-right: 0.55rem;"/>`
          : `<span style="width: 9px; height: 9px; border:2px solid white;  display: inline-block; margin-right: 0.55rem;"/>`;
        const xValue = w.globals.labels[dataPointIndex];
        return `
       <div class=" p-2 px-4 bg-white/30 backdrop-blur-md  border rounded shadow-md space-y-2"  
       style={{
        background: "rgba(255, 255, 255, 0.3)", 
        backdropFilter: "blur(10px)", // Glassy blur effect
        WebkitBackdropFilter: "blur(10px)", 
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "8px", 
        padding: "16px", 
        boxShadow: "2px 2px 6px rgba(0, 0, 0, 0.1)", 
       }} >
      <div class="mb-2  max-sm:text-[0.6rem]">Strike <span  style="font-weight:500;"> ${xValue}</span></div>
      <div class="sm:space-x-2 max-sm:text-[0.6rem] ">
         <span  style="display: inline-block;">${FromcallOi}</span>
         <span style="width:${customTipStyle?.width}; display: inline-block; "> Call OI at ${convertTime(fromOiTime)}</span>
         <span style=" display: inline-block;  margin-left:${customTipStyle?.margin};  font-weight:500">${formatValue(fromCallOi)}</span>
       </div>

      <div class="sm:space-x-2 max-sm:text-[0.6rem] ">
           <span  style="display: inline-block; " >${callimageTag}</span> 
           <span style="width:${customTipStyle?.width};  display: inline-block;">Call OI Chg</span> 
           <span style=" display: inline-block ;  margin-left:${customTipStyle?.margin}; font-weight:500 ">${formatValue(callChangeOi)}</span>
      </div>

     <div class="sm:space-x-2 max-sm:text-[0.6rem]">
          <span  style="display: inline-block;"> ${TocallOi}</span>
          <span style="width:${customTipStyle?.width}; display: inline-block;" >Call OI at ${convertTime(toOiTime)}</span> 
          <span  style=" display: inline-block ;  margin-left:${customTipStyle?.margin}; font-weight:500">${formatValue(toCallOi)}</span>
     </div>

    <hr/>

    <div class="sm:space-x-2  max-sm:text-[0.6rem]">
      <span  style="display: inline-block;">${FromPutOi}</span>
      <span style="width:${customTipStyle?.width}; display: inline-block;"> Put OI at ${convertTime(fromOiTime)}</span> 
      <span style=" display: inline-block; margin-left:${customTipStyle?.margin};  font-weight:500">${formatValue(fromPutOI)}</span>
    </div>

    
    <div class="sm:space-x-2 max-sm:text-[0.6rem]">
      <span style="display:inline-block; ">${putimageTag}</span> 
      <span  style="width:${customTipStyle?.width}; display: inline-block;">Put OI Chg </span>
      <span style=" display: inline-block ; margin-left:${customTipStyle?.margin}; font-weight:500"> ${formatValue(putChangeOI)}</span>
    </div>

    <div class="sm:space-x-2 max-sm:text-[0.6rem]">
      <span style="display: inline-block;">${ToPutOi}</span>
      <span style="width:${customTipStyle?.width}; display: inline-block; ">Put OI at ${convertTime(toOiTime)}</span> 
      <span style=" display: inline-block; margin-left:${customTipStyle?.margin}; font-weight:500 ">${formatValue(toPutOI)}</span>
    </div>
  </div>
`;
      },
    },

    legend: {
      show: false,
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
            min: Math.floor(Math.min(...oiData.flat()) / 10) * 10,
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
            axisBorder: {
              show: true,
              color: "#B2beb5",
            },
            tickAmount: 5,
            min: Math.floor(Math.min(...oiData.flat()) / 10) * 10,
            max: Math.ceil(Math.max(...oiData.flat()) / 10) * 11,
            labels: {
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
    stroke: {
      show: true,
      width: [2, 2, 2, 2, 2, 2],
      colors: [
        "#F44336",
        "#F44336",
        "#F44336",
        "#F44336",
        "#4CAF50",
        "#4CAF50",
        "#4CAF50",
        "#4CAF50",
      ],
    },
  };
};

export default OiChangeChartOptions;
