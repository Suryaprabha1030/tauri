import React, { use, useEffect, useRef, useState } from "react";
import "rc-slider/assets/index.css"; // Import the default styles
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { setStock } from "@/lib/redux/slices/StrategySlice";
import { useDispatch } from "react-redux";
import Image from "next/image";
import { getInputValue } from "@/lib/redux/slices/StrategyChartSlice";

interface PriceSliderProps {
  setTriggerSpotPrice: React.Dispatch<React.SetStateAction<any>>;
  triggerSpotPrice: any;
}
const PriceSlider: React.FC<PriceSliderProps> = ({
  setTriggerSpotPrice,
  triggerSpotPrice,
}) => {
  const [value, setValue] = useState(0); // Initial value of the slider
  const hasMountedRef = useRef(false);
  const stocks = useSelector((state: RootState) => state.strategy.stock);
  const dispatch = useDispatch();
  const [isSpinning, setIsSpinning] = useState(false);
  const spotPriceInfo = useSelector(
    (state: RootState) => state.strategy.spotPriceData,
  );

  const showPayoffchart = useSelector(
    (state: RootState) => state.analyzer.ShowPayOffChart,
  );
  const [resetvalue, setResetvalue] = useState(false);
  const inputValue = useSelector(
    (state: RootState) => state.StrategyChart.inputValue,
  );

  const handleChange = (newValue: number | number[]) => {
    if (Array.isArray(newValue)) {
      setValue(newValue[0]);
    } else {
      setValue(newValue);
    }
  };

  useEffect(() => {
    if (inputValue == null) {
      setValue(0);
      dispatch(getInputValue(spotPriceInfo));
      setResetvalue(false);
    }
  }, [inputValue]);

  const handleReset = () => {
    setResetvalue(true);
    setValue(0);
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 300);
  };

  useEffect(() => {
    // Set the ref to true after the first render
    hasMountedRef.current = true;
  }, []);

  useEffect(() => {
    // Calculate the input value based on the spotPrice and the slider value
    if (resetvalue == true) {
      const spotPriceNum = Number(spotPriceInfo);

      const formattedValue = value / 100;
      const calculatedValue = spotPriceNum * formattedValue;

      const newInputValue: number =
        value > 0
          ? spotPriceNum + calculatedValue
          : spotPriceNum - Math.abs(calculatedValue);
      if (stocks && stocks.index_name.length == 0 && spotPriceInfo) {
        dispatch(getInputValue(Number(newInputValue?.toFixed(2))));
        setTriggerSpotPrice(!triggerSpotPrice);
      }
    }
  }, [value]);

  useEffect(() => {
    setValue(0);
    dispatch(getInputValue(spotPriceInfo));
    setResetvalue(false);
  }, [spotPriceInfo]);

  const roundUpToNearest10 = (num: number): number => {
    return Math.ceil(num / 10) * 10;
  };

  const valueColor =
    value > 0 ? "text-green-500" : value < 0 ? "text-red-500" : "text-gray-500";
  const formattedValue = value > 0 ? `+${value.toFixed(1)}` : value.toFixed(1);

  const handleIncrement = (e: any) => {
    setResetvalue(true);
    e.stopPropagation();
    dispatch(
      setStock({
        stock: {
          exchange: "",
          index_name: "",
          spot_price: "",
        },
      }),
    );

    setValue((prevValue) => {
      const newValue = prevValue + 0.5;
      return Math.min(newValue, 10); // Ensure the slider doesn't exceed the maximum value
    });

    // setTriggerSpotPrice(true);
  };

  const handleDecrement = () => {
    setResetvalue(true);
    dispatch(
      setStock({
        stock: {
          exchange: "",
          index_name: "",
          spot_price: "",
        },
      }),
    );
    setValue((prevValue) => {
      const newValue = prevValue - 0.5;
      return Math.max(newValue, -10); // Ensure the slider doesn't go below the minimum value
    });
  };

  return (
    <div
      className={` ${
        showPayoffchart != true
          ? "hidden"
          : " flex h-[1.5rem] flex-col items-center justify-start gap-1    text-[0.65rem] sm:max-md:justify-center sm:max-md:px-1 md:max-lg:mx-0 md:max-lg:w-[20rem] lg:max-xl:px-3 xl:max-2xl:mx-0 xl:max-2xl:w-[20rem] 2xl:w-[20rem] 2xl:text-[0.6rem]"
      }`}
    >
      <div className="flex w-full flex-row items-center max-lg:justify-start max-sm:gap-[1rem] sm:max-md:gap-[1.5rem] md:max-lg:gap-[0.5rem] lg:justify-center lg:max-xl:gap-[1rem] xl:max-2xl:justify-start xl:max-2xl:gap-1 2xl:gap-2  ">
        <span
          className={` text-xs font-letter max-lg:flex max-lg:flex-row max-sm:w-[7.5rem] max-sm:gap-1 sm:max-md:w-[10rem] sm:max-md:text-[0.85rem] md:max-lg:w-[7.4rem] lg:max-xl:w-[7.5rem] xl:max-2xl:w-[7.5rem] ${valueColor}`}
        >
          <span className="w-[2rem] font-letter text-black max-sm:w-[5rem] sm:max-md:w-[6rem] md:max-lg:w-[5rem]">
            Target Price:{" "}
          </span>
          {formattedValue}%
        </span>
        <div className="flex flex-row  items-center  max-sm:gap-0.5 sm:max-md:gap-3 md:max-lg:gap-4 md:max-lg:gap-[0.25rem] lg:max-xl:gap-[0.5rem] xl:max-2xl:gap-[0.2rem]  2xl:gap-1">
          <div className="whitespace-wrap flex h-7 w-[6rem] items-center justify-center   max-sm:w-[7rem] sm:max-md:w-[8rem]   md:max-lg:w-[7.5rem] lg:max-xl:w-[11rem] xl:max-2xl:w-[8rem]">
            <button
              className="rounded-l bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none max-xl:h-6 max-md:w-6 md:max-xl:w-8 xl:h-4 xl:w-5"
              onClick={handleDecrement}
            >
              -
            </button>
            <input
              id="priceInput"
              value={inputValue ?? ""}
              readOnly
              className="readonly w-24 border  border-gray-300 text-center font-letter focus:outline-none focus:ring-2 focus:ring-blue-500 max-xl:h-6 max-sm:w-16 md:max-lg:w-20 xl:h-4 xl:max-2xl:w-20 2xl:w-[4rem] "
            />
            <button
              className="rounded-r bg-gray-200 text-gray-800 hover:bg-gray-300 focus:outline-none max-xl:h-6 max-md:w-6 md:max-xl:w-8 xl:h-4 xl:w-5 "
              onClick={(e) => handleIncrement(e)}
            >
              +
            </button>
          </div>
          <button
            onClick={handleReset}
            className="flex h-5 w-[1.5rem] cursor-pointer flex-row items-center justify-center gap-1  px-1 py-1 max-sm:w-[1rem] max-sm:px-0.5 md:max-xl:w-[1.8rem]"
          >
            <img
              src="/svg/reset.svg"
              alt=""
              width={15}
              height={15}
              className={`md:max-xl:h-[1.1rem] md:max-xl:w-[1.1rem] ${isSpinning ? "animate-spin" : ""}`}
            />
          </button>
        </div>
        {/* <span className="text-xs font-[400] font-letter text-black xl:max-2xl:hidden">
          IV = 14
        </span> */}
      </div>
    </div>
  );
};

export default PriceSlider;
