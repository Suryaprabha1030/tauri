import { ApexOptions } from "apexcharts";
import { formatNumber } from "@/lib/util/DraftUtil";
import { Dispatch, SetStateAction } from "react";
import { setOpenSymbolNewsPopup } from "@/lib/redux/slices/CommonSlice";

export const getStockChartOptions = (
  formattedData: {
    fullLabel: string;
    volume: any;
    value: any;
    high: any;
    low:any
  }[],
  xCategories: string[],
  AreaColor: string,
  volumeColor: string,
  showVolume: boolean,
  newsAnnotation: any,
  dispatch: Dispatch<SetStateAction<any>>
): ApexOptions => {
  return {
    chart: {
      type: "area",
      background: "white",
      toolbar: { show: false },
      animations: { enabled: true },
      zoom: { enabled: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const index = config.dataPointIndex;
          const xValue = xCategories[index];
          const matching = newsAnnotation?.find((a: any) => a.x === xValue);
          if (matching) {
            dispatch(
              setOpenSymbolNewsPopup({
                open: true,
                newsData: matching?.newsData,
                newsSymbol: matching?.symbol,
              })
            );
          }
        },
      },
    },

    xaxis: {
      type: "category",
      categories: xCategories,
      tickAmount: 5,
      axisTicks: { show: false },
      floating: false,
      labels: {
        rotate: 0,
        style: { fontSize: "10px" },
        offsetX: 4,
      },
    },
    yaxis: [
      {
        labels: { formatter: (val) => formatNumber(val), offsetX: -14 },
      },
      ...(showVolume
        ? [
            {
              opposite: true,
              labels: { formatter: (val) => formatNumber(val), offsetX: -10 },
              tickAmount: 6,
            },
          ]
        : []),
    ],
    stroke: { curve: "smooth", width: 2 },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: "vertical",
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [20, 100],
        colorStops: [
          { offset: 0, color: AreaColor, opacity: 0.4 },
          { offset: 100, color: AreaColor, opacity: 0 },
        ],
      },
    },
    colors: [AreaColor, volumeColor],
    tooltip: {
      enabled: true,
      followCursor: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const xValue =
          w.globals.labels[dataPointIndex] ||
          w.globals.seriesX?.[seriesIndex]?.[dataPointIndex];
        const zValue = xCategories[dataPointIndex];
        // Check if this point has a news marker
        const matching = newsAnnotation?.find((a: any) => a.x === zValue);

        // Get date and price from your actual data
        const fullLabel =
          formattedData[dataPointIndex]?.fullLabel || xValue || "N/A";

        const pointData = formattedData[dataPointIndex] || {};
        const price = pointData?.value ? formatNumber(pointData?.value) : 0;
        const volume = pointData?.volume ? formatNumber(pointData?.volume) : 0;
        const high = pointData?.high ? formatNumber(pointData?.high) : 0;
        const low = pointData?.low ? formatNumber(pointData?.low) : 0;

        // Get series colors
        const priceColor = AreaColor;
        const volColor = volumeColor;

        // Construct HTML tooltip matching your image alignment
        return `
      <div style="
        padding: 12px;
        background: #fff;
                border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        font-size: 12px;
        line-height: 1.4;
        z-index: 10000;
        min-width: 160px;
                color: #333;
      ">
        <!-- Date -->
        <div style="
          color: #666;
          font-size: 11px;
          margin-bottom: 8px;
        ">
          ${fullLabel}
        </div>
        
        <!-- Price with colored square -->
        <div style="display: flex; align-items: center; margin-bottom: ${volume ? "6px" : "0px"};">
          <div style="
            width: 12px;
            height: 12px;
            background-color: ${priceColor};
            border-radius: 2px;
            margin-right: 8px;
            flex-shrink: 0;
          "></div>
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; color: #666;">Price</span>
              <span style="font-size: 14px; font-weight: 600; color: #000; margin-left: 8px;">
                ${price}
              </span>
            </div>
          </div>
        </div>

        <!-- Volume with colored square if exists -->
        ${
          volume
            ? `
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="
              width: 12px;
              height: 12px;
              background-color: ${volColor};
              border-radius: 2px;
              margin-right: 8px;
              flex-shrink: 0;
            "></div>
            <div style="flex: 1; min-width: 0;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 11px; color: #666;">Volume</span>
                <span style="font-size: 14px; font-weight: 600; color: #000; margin-left: 8px;">
                  ${volume}
                </span>
              </div>
            </div>
          </div>
        `
            : ""
        }
        
        <!-- High and Low section -->

        <div style="display: flex; align-items: center; margin-bottom: ${volume ? "6px" : "0px"};">
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; color: #666;">High</span>
              <span style="font-size: 14px; font-weight: 600; color: #000; margin-left: 8px;">
                ${high}
              </span>
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; margin-bottom: ${volume ? "6px" : "0px"};">
          <div style="flex: 1; min-width: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; color: #666;">Low</span>
              <span style="font-size: 14px; font-weight: 600; color: #000; margin-left: 8px;">
                ${low}
              </span>
            </div>
          </div>
        </div>
        
        <!-- News Section (only if news exists) -->
        ${
          matching
            ? `
          <div class="tooltip-news-section" style="
            padding-top: 8px;
            border-top: 1px solid #f0f0f0;
            display: flex;
            align-items: center;
            cursor: pointer;
          ">
           
            <div style="flex: 1;">
              <span style="color:black; font-weight: 600; font-size: 14px;">
                 News (${matching?.newsData?.length || 1})
              </span>
            </div>
          </div>
        `
            : ""
        }
      </div>
    `;
      },
    },
    dataLabels: {
      enabled: true,
      distributed: false,
      formatter: function (val, opts) {
        const { dataPointIndex, seriesIndex } = opts
        if (seriesIndex !== 0) return '';
        const zValue = xCategories[dataPointIndex];
        const matching = newsAnnotation?.find((a: any) => a.x === zValue);
        if(!matching) return ""
        return matching && `${matching?.newsData?.length || 1}`
      },
      offsetY: -7, // move label above the point
      style: {
        colors: [`${volumeColor}`],
        fontSize: "10px",
        fontWeight: "bold",
      },
      background: {
        padding: 4,
      }
    },
    markers: {
      size: 0, // default: hide regular markers
      discrete: newsAnnotation?.map((a: any) => {
        return {
          seriesIndex: 0,
          dataPointIndex: xCategories.indexOf(a.x), // find index of your x point
          fillColor: volumeColor,
          strokeColor: "#fff",
          size: 8,
          shape: "circle",
        };
      }),
    },

    grid: { show: false },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    legend: { show: false },
    responsive: [
      {
        breakpoint: 576,
        options: {
          xaxis: {
            categories: xCategories,
            tickAmount: 1,
            axisTicks: { show: false },
            floating: false,
            labels: {
              rotate: 0,
              style: { fontSize: "10px" },
              offsetX: 4,
            },
          },
        },
      },
      {
        breakpoint: 768,
        options: {
          xaxis: {
            categories: xCategories,
            tickAmount: 3,
            axisTicks: { show: false },
            floating: false,
            labels: {
              rotate: 0,
              style: { fontSize: "10px" },
              offsetX: 4,
            },
          },
        },
      },
      {
        breakpoint: 992,
        options: {
          xaxis: {
            categories: xCategories,
            tickAmount: 4,
            axisTicks: { show: false },
            floating: false,
            labels: {
              rotate: 0,
              style: { fontSize: "10px" },
              offsetX: 4,
            },
          },
        },
      },
    ],
  };
};
