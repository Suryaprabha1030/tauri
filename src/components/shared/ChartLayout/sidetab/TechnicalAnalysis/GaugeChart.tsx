import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";

import getGaugeChartOptions from "./GaugechartOptions";
import Image from "next/image";
import dynamic from "next/dynamic";

interface SummaryData {
  sell: number;
  neutral: number;
  buy: number;
}

interface chartProps {
  summary: SummaryData;
  type: string;
  setTechValue?: Dispatch<SetStateAction<any>>;
  setTechIndicator?: Dispatch<SetStateAction<any>>;
  isStockInfo?: boolean;
}
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const GaugeWithThreePartitions: React.FC<chartProps> = ({
  summary,
  type,
  setTechIndicator,
  setTechValue,
  isStockInfo,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const total = summary.sell + summary.neutral + summary.buy;
  const [chartLoaded, setChartLoaded] = useState(false);
  const getPercentage = (value: number) =>
    total > 0 ? (value / total) * 100 : 0;

  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState("Neutral");
  const [currentValue, setCurrentValue] = useState(summary.neutral);
  const labelColorMap: { [key: string]: string } = {
    "Strong Bearish": "#EF4444",
    Bearish: "#EF4444",
    Neutral: "#9CA3AF",
    Bullish: "#449C4F",
    "Strong Bullish": "#449C4F",
  };

  useEffect(() => {
    const sellPercentage = getPercentage(summary.sell);
    const buyPercentage = getPercentage(summary.buy);
    const maxValue = Math.max(summary.buy, summary.sell, summary.neutral);

    if (maxValue === summary.buy) {
      if (buyPercentage >= 80) {
        setLabel("Strong Bullish");
      } else {
        setLabel("Bullish");
      }
      setCurrentValue(summary.buy);
    } else if (maxValue === summary.sell) {
      if (sellPercentage >= 80) {
        setLabel("Strong Bearish");
      } else {
        setLabel("Bearish");
      }
      setCurrentValue(summary.sell);
    } else if (maxValue === summary.neutral) {
      setLabel("Neutral");
      setCurrentValue(summary.neutral);
    }
  }, [summary]);

  // Use the imported getChartOptions function
  const chartOptions = getGaugeChartOptions(label);
  const chartSeries = [summary.buy, summary.neutral, summary.sell];
  useEffect(() => {
    if (type === "1" && setTechIndicator && setTechValue) {
      setTechIndicator(label);
      setTechValue(currentValue);
    }
  }, [type, label, setTechIndicator, summary, currentValue]);

  useEffect(() => {
    const timeout = setTimeout(() => setChartLoaded(true), 200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      ref={chartContainerRef}
      className={`relative flex h-full flex-col items-center justify-center  ${
        type != "1" ? "cursor-pointer  " : ""
      }`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {chartLoaded && (
        <h2 className="text-center font-bold uppercase text-gray-700 max-sm:text-[0.65rem] sm:max-md:text-[0.7rem] md:text-[0.75rem]">
          {type === "1"
            ? "Summary"
            : type === "2"
              ? "Oscillators"
              : "Moving Averages"}
        </h2>
      )}
      <div
        className={`relative ${
          type == "1"
            ? `h-[75%] sm:max-xl:h-[80%] md:max-xl:w-full ${isStockInfo ? "max-sm:w-[80%] sm:max-md:h-[90%] md:max-lg:h-[85%] lg:max-xl:h-[90%]" : ""} `
            : `${isStockInfo ? "max-xl:w-[80%] max-sm:h-[80%] sm:max-md:h-[85%] md:max-xl:h-[80%] xl:w-[18rem] xl:max-2xl:h-[100%]" : "w-[10rem]"} sm:max-md:h-[80%] md:max-lg:h-[100%] md:max-lg:w-[70%] lg:max-xl:h-[80%] lg:max-xl:w-[80%]`
        }`}
      >
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          height={350}
        />
        {chartLoaded && (
          <>
            <div
              className={`${
                type === "1"
                  ? "text-[0.85rem] max-sm:text-[0.7rem]"
                  : "text-[0.75rem] max-sm:text-[0.55rem]"
              } absolute text-center font-semibold ${
                type === "1"
                  ? `max-sm:bottom-[28%] md:max-lg:bottom-[24%] lg:max-xl:bottom-[26%] xl:max-2xl:bottom-[33%] 2xl:bottom-[40%] ${isStockInfo ? "max-sm:bottom-[22%] sm:max-md:bottom-[20%] md:max-lg:bottom-[18%] lg:max-xl:bottom-[24%] xl:max-2xl:bottom-[20%]" : "sm:max-md:bottom-[36%]"} `
                  : ` ${
                      isStockInfo
                        ? "max-sm:bottom-[30%] max-sm:w-full sm:max-md:bottom-[22%] md:max-lg:bottom-[23%] lg:max-xl:bottom-[30%] xl:max-2xl:bottom-[28%] 2xl:bottom-[50%]"
                        : "max-sm:bottom-[26%] sm:max-md:bottom-[36%] sm:max-md:w-full md:max-lg:bottom-[24%] lg:max-xl:bottom-[30%] xl:bottom-[30%]"
                    }`
              } left-1/2 -translate-x-1/2 transform`}
              style={{ color: labelColorMap[label] }}
            >
              <div>{label}</div>
              <div className="max-sm:text-[0.6rem] sm:max-md:text-[0.7rem] md:text-[0.75rem]">
                {getPercentage(currentValue).toFixed(2)}%
              </div>
            </div>

            <div
              className={`absolute flex w-full flex-row items-center justify-center gap-5 font-semibold text-gray-500 max-sm:text-[0.65rem] sm:max-md:text-[0.7rem] md:text-[0.75rem] ${
                type === "1"
                  ? `max-sm:bottom-[10%] ${isStockInfo ? "sm:max-md:bottom-[5%]" : "sm:max-md:bottom-[18%]"} lg:max-xl:bottom-[9%] xl:max-2xl:bottom-[15%] 2xl:bottom-[20%] ${isStockInfo ? "max-sm:bottom-[3%] sm:max-md:bottom-[0.2rem] md:max-lg:bottom-[0.5%] lg:max-xl:bottom-[0.2%] xl:max-2xl:bottom-[2%] " : "md:max-lg:bottom-[7%]"}`
                  : ` max-sm:bottom-[2%] ${isStockInfo ? "sm:max-md:bottom-[1%]" : "sm:max-md:bottom-[13%]"}  md:max-lg:bottom-[1%] lg:max-xl:bottom-[11%] ${
                      isStockInfo
                        ? "max-sm:bottom-[10%] sm:max-md:bottom-[0.1rem] md:max-lg:bottom-[0.2%] lg:max-xl:bottom-[10%] xl:max-2xl:bottom-[10%] 2xl:bottom-[30%]"
                        : "xl:bottom-[7%]"
                    }`
              } left-1/2 -translate-x-1/2 transform `}
            >
              <div className="text-center text-z-green-500">
                <p>
                  <img
                    src="/svg/bull-icon.svg"
                    width={15}
                    height={15}
                    alt="Bullish"
                    className="max-sm:h-[0.8rem] max-sm:w-[0.8rem] "
                  />
                </p>
                <p>{summary.buy}</p>
              </div>
              <div className="text-center text-gray-400">
                <p>
                  <img
                    src="/svg/target-icon.svg"
                    width={15}
                    height={15}
                    alt="Neutral"
                    className="max-sm:h-[0.8rem] max-sm:w-[0.8rem] "
                  />
                </p>
                <p>{summary.neutral}</p>
              </div>
              <div className="text-center text-red-400">
                <p>
                  <img
                    src="/svg/bear-icon.svg"
                    width={15}
                    height={15}
                    alt="Bearish"
                    className="max-sm:h-[0.8rem] max-sm:w-[0.8rem] "
                  />
                </p>
                <p>{summary.sell}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GaugeWithThreePartitions;
