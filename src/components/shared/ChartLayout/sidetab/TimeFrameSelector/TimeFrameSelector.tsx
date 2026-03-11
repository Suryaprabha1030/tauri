import { setShowTvResolution } from "@/lib/redux/slices/ChartsSlice";
import React from "react";
import { useDispatch } from "react-redux";

interface TimeframeSelectorProps {
  selectedTimeframe: string;
  onSelectTimeframe: (timeframe: string) => void;
}

const timeframes = ["5", "15", "30", "60", "1D"];

const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedTimeframe,
  onSelectTimeframe,
}) => {
  const dispatch = useDispatch();
  return (
    <div className="bg-white p-1 max-sm:py-[1rem] sm:max-md:py-[1.2rem] md:max-lg:py-[1.5rem] lg:max-xl:py-[1.8rem] xl:max-2xl:py-[0.5rem] ">
      <div className="flex justify-center space-x-2 md:max-lg:space-x-4 lg:max-xl:space-x-6">
        {timeframes.map((timeframe) => (
          <button
            key={timeframe}
            onClick={() => {
              onSelectTimeframe(timeframe);
              dispatch(setShowTvResolution(timeframe));
            }}
            className={`rounded-md px-2 text-[0.75rem] ${
              selectedTimeframe === timeframe
                ? "bg-z-green-500 text-white"
                : "bg-gray-200 text-black"
            } transition-colors duration-300`}
          >
            {timeframe === "1D"
              ? timeframe
              : timeframe === "60"
                ? "1h"
                : `${timeframe}m`}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeframeSelector;
