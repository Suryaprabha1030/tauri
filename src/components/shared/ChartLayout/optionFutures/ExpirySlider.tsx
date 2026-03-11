import React, { useState, useEffect, Dispatch } from "react";
import "rc-slider/assets/index.css"; // Import the default styles
import Image from "next/image";
import { getDaysBetween } from "./optionFuturesUtil/legUtil";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { getDaysToExpiry } from "@/lib/redux/slices/StrategyChartSlice";

interface SliderWithExpiryProps {
  setTargetDate: Dispatch<React.SetStateAction<any>>;
  setExpiryPayload: Dispatch<React.SetStateAction<any>>;
}

const ExpirySlider: React.FC<SliderWithExpiryProps> = ({
  setTargetDate,
  setExpiryPayload,
}) => {
  const [value, setValue] = useState(0); // Slider value in days
  const [minDate, setMinDate] = useState<Date>(new Date()); // Current date
  const [maxDate, setMaxDate] = useState<Date>(new Date()); // Expiry date
  const [displayDate, setDisplayDate] = useState<Date>(new Date()); // Target date based on slider value
  const [daysBetween, setDaysBetween] = useState<number | null>(null); // Number of days between minDate and maxDate
  const [isSpinning, setIsSpinning] = useState(false);

  const showPayoffchart = useSelector(
    (state: RootState) => state.analyzer.ShowPayOffChart
  );
  const expiryDate = useSelector(
    (state: RootState) => state.StrategyChart.minExpiryDate
  );
  const dispatch = useDispatch();
  useEffect(() => {
    let parsedExpiryDate: Date;

    if (expiryDate instanceof Date) {
      parsedExpiryDate = expiryDate;
    } else if (typeof expiryDate === "string") {
      parsedExpiryDate = new Date(expiryDate);
    } else {
      return;
    }

    if (isNaN(parsedExpiryDate.getTime())) {
      return;
    }

    setMaxDate(parsedExpiryDate);
    setMinDate(new Date()); // Set minDate to current date

    // Recalculate daysBetween whenever minDate or maxDate changes
    const newDaysBetween = getDaysBetween(new Date(), parsedExpiryDate);
    setDaysBetween(newDaysBetween);
    setValue(0); // Reset slider to start at the minDate
  }, [expiryDate]);

  useEffect(() => {
    if (minDate && maxDate) {
      // Calculate the target date based on the slider value
      const targetDate = new Date(minDate);
      targetDate.setDate(minDate.getDate() + value);
      setTargetDate(targetDate);
      setDisplayDate(targetDate);
    }
  }, [value, minDate, maxDate]);

  const handleChange = (newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      const newValueNumber = newValue[0];
      if (newValueNumber >= 0) {
        setValue(newValueNumber);
      }
    } else {
      if (newValue >= 0) {
        setValue(newValue);
      }
    }
  };

  const handleReset = () => {
    setValue(0); // Reset the slider to 0 days
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 300);
  };

  // Format date to DD MMM YYYY
  const getOrdinalSuffix = (day: any): string => {
    if (day > 3 && day < 21) return "th"; // Handles 11th-19th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  // Format date to DD MMM YYYY
  const formatDate = (date: Date): any => {
    if (!date || isNaN(date.getTime())) {
      return <>Invalid Date</>;
    }
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "short" })
      .slice(0, 3);
    const day = date.getDate();
    const dayWithSuffix = `${getOrdinalSuffix(day)}`; // Append suffix to day as string
    const month = date
      .toLocaleString("en-US", { month: "short" })
      .slice(0, 3)
      .toUpperCase();
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // Return the date formatted as a string with the ordinal suffix
    return (
      <>
        {dayName} {day}
        <sup>{dayWithSuffix}</sup> {month} {year}
      </>
    );
  };
  // && value!=0
  useEffect(() => {
    if (daysBetween != null) {
      let daysToExpiry: number = daysBetween - value;

      setExpiryPayload(daysToExpiry - 1);
      dispatch(getDaysToExpiry(daysToExpiry));
    }
  }, [value]);

  return (
    <div
      className={`max-md:hidden ${
        showPayoffchart != true
          ? "hidden"
          : "flex h-[1.5rem] flex-col items-center justify-start gap-1  px-2 text-[0.65rem] md:max-lg:mx-0 md:max-lg:w-[23.5rem] md:max-lg:px-2 lg:max-xl:px-1 xl:max-2xl:mx-0 xl:max-2xl:w-[25rem] xl:max-2xl:px-0 2xl:w-[28.5rem]"
      }`}
    >
      <div className="flex w-full flex-row items-center justify-between md:max-lg:gap-1 lg:max-xl:gap-[1.2rem] xl:max-2xl:justify-end xl:max-2xl:gap-1 2xl:justify-center 2xl:gap-1">
        <span className="text-xs font-letter text-black xl:max-2xl:w-[10rem]">
          <span className="font-letter text-black md:max-lg:mr-1 xl:max-2xl:w-[2rem] ">
            Target Date:
          </span>{" "}
          {Number(daysBetween) - value}{" "}
          <span className="max-xl:hidden 2xl:hidden">D</span>
          <span className="xl:max-2xl:hidden ">Days</span> to Expiry
        </span>
        <div className="flex flex-row items-center gap-2 md:max-xl:gap-[0.5rem] xl:max-2xl:gap-0.5">
          <div className="whitespace-wrap flex h-7 w-[9rem] items-center justify-center px-1 lg:max-xl:w-[12rem]">
            <button
              className="h-4 w-5 rounded-l bg-gray-200 text-black hover:bg-gray-300 focus:outline-none md:max-xl:h-6 md:max-xl:w-8"
              onClick={() => handleChange(Math.max(value - 1, 0))}
            >
              -
            </button>
            <div className="readonly h-4 w-24 border border-gray-300 p-[0.1rem] text-center text-[0.55rem] font-letter focus:outline-none focus:ring-2  focus:ring-blue-500 md:max-xl:h-6 md:max-xl:w-40 md:max-xl:px-[0.1rem] md:max-xl:pt-[0.35rem]">
              {formatDate(displayDate)}
            </div>
            <button
              className="h-4 w-5 rounded-r bg-gray-200 text-black hover:bg-gray-300 focus:outline-none md:max-xl:h-6 md:max-xl:w-8"
              onClick={() =>
                handleChange(Math.min(value + 1, Number(daysBetween)))
              }
            >
              +
            </button>
          </div>
          <button
            onClick={handleReset}
            className="flex h-5 w-[1.5rem] cursor-pointer flex-row items-center justify-center gap-1 px-1 py-1 md:max-xl:w-[1.8rem] "
          >
            <Image
              src="/svg/reset.svg"
              alt=""
              width={15}
              height={15}
              className={`md:max-xl:h-[1.1rem] md:max-xl:w-[1.1rem] ${isSpinning ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* <Slider
      min={0}
      max={Number(daysBetween)} // Set max value to ensure the final date is the expiry date
      step={1}
      value={value}
      onChange={handleChange}
      className="w-full max-w-md"
    /> */}
    </div>
  );
};

export default ExpirySlider;
