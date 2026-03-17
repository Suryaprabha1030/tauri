import { RootState } from "@/lib/redux/Store";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ResetButton from "../resetButton/ResetButton";

interface StrikeRangeProps {
  spotPriceRoundOff: number;
  oiIncrementor: any;
  setStrikeRange: Dispatch<SetStateAction<any>>;
  manuallyMinMax: boolean;
  setManuallyMinMax: Dispatch<SetStateAction<boolean>>;
  setResetRange: Dispatch<SetStateAction<boolean>>;
  resetRange: boolean;
  showOiChange: boolean;
  refreshStrikeRange: () => void;
  spinningAnimation: boolean;
}
const StrikeRange: React.FC<StrikeRangeProps> = ({
  spotPriceRoundOff,
  oiIncrementor,
  setStrikeRange,
  setManuallyMinMax,
  manuallyMinMax,
  setResetRange,
  resetRange,
  showOiChange,
  refreshStrikeRange,
  spinningAnimation,
}) => {
  const indexAddtionalData = useSelector(
    (state: RootState) => state.OI.OIAddtionalData,
  );

  const [increment, setIncrement] = useState<any>(null);
  const [minLimit, setMinLimit] = useState<any>(null);

  const [maxLimit, setMaxLimit] = useState<any>(null);
  const [minValue, setMinValue] = useState<any>(null);
  const [maxValue, setMaxValue] = useState<any>(null);
  useEffect(() => {
    if (oiIncrementor != null && spotPriceRoundOff != null) {
      if (!manuallyMinMax) {
        setMinLimit(spotPriceRoundOff - 10 * oiIncrementor);
        setMaxLimit(spotPriceRoundOff + 10 * oiIncrementor);
        setMinValue(spotPriceRoundOff - 10 * oiIncrementor);
        setMaxValue(spotPriceRoundOff + 10 * oiIncrementor);
        setIncrement(oiIncrementor);
      } else if (minValue == null || maxValue == null) {
        setMinLimit(spotPriceRoundOff - 10 * oiIncrementor);
        setMaxLimit(spotPriceRoundOff + 10 * oiIncrementor);
        setMinValue(spotPriceRoundOff - 10 * oiIncrementor);
        setMaxValue(spotPriceRoundOff + 10 * oiIncrementor);
        setIncrement(oiIncrementor);
      }
    }
  }, [oiIncrementor, spotPriceRoundOff, indexAddtionalData, manuallyMinMax]);

  useEffect(() => {
    if (resetRange && oiIncrementor != null && spotPriceRoundOff != null) {
      setMinLimit(spotPriceRoundOff - 10 * oiIncrementor);
      setMaxLimit(spotPriceRoundOff + 10 * oiIncrementor);
      setMinValue(spotPriceRoundOff - 10 * oiIncrementor);
      setMaxValue(spotPriceRoundOff + 10 * oiIncrementor);
      setIncrement(oiIncrementor);
    }
  }, [resetRange, oiIncrementor, spotPriceRoundOff]);

  const hasMounted = useRef(false);
  const handleMinChange = (change: number) => {
    setMinValue((prev: any) =>
      Math.min(maxValue, Math.max(minLimit, prev + change)),
    );
    setManuallyMinMax(true);
    setResetRange(false);
  };

  const handleMaxChange = (change: number) => {
    setMaxValue((prev: any) =>
      Math.max(minValue, Math.min(maxLimit, prev + change)),
    );
    setManuallyMinMax(true);
    setResetRange(false);
  };

  const getRange = () => {
    if (minValue == null || maxValue == null || increment == null) return [];
    const range: any = [];
    
    for (let i = minValue; i <= maxValue; i += increment) {
      range.push(i);
    }
    return range;
  };

  useEffect(() => {
 
    if (!hasMounted.current) {
      hasMounted.current = true;
    } else {
      setStrikeRange(getRange());
    }
  }, [minValue, maxValue]);

  return (
    <div className="flex w-full flex-row items-center justify-center bg-white text-[0.75rem]  max-xl:justify-start   max-md:py-2 xl:mt-5 xl:py-5 xl:max-2xl:pr-1.5 2xl:px-10 ">
      <span className="flex flex-row items-center justify-center gap-10 bg-white text-[0.75rem] max-2xl:w-full max-2xl:justify-start max-sm:w-[19rem] max-sm:gap-5 sm:max-md:w-[21.5rem] sm:max-md:gap-8 md:max-xl:w-[26rem] xl:max-2xl:w-[21.5rem] xl:max-2xl:gap-4 2xl:w-[95%]">
        <div className="flex  flex-row items-center justify-center gap-1 sm:max-xl:gap-2">
          <label className="text-[0.8rem] font-table text-black">Min</label>
          <button
            onClick={() => handleMinChange(-increment)}
            className="rounded-lg bg-z-green-500 px-2  py-1 text-white focus:outline-none max-xl:rounded-md max-md:px-1.5 max-md:py-0.5"
          >
            -
          </button>
          <input
            type="number"
            value={minValue}
            readOnly
            className="w-20 rounded-lg border bg-white px-2 py-1 text-center text-black shadow-lg focus:outline-none max-xl:rounded-md max-md:w-16 max-md:px-1 max-md:py-0.5 max-md:text-[0.6rem]"
          />
          <button
            onClick={() => handleMinChange(increment)}
            className="rounded-lg bg-z-green-500 px-2  py-1 text-white focus:outline-none max-xl:rounded-md max-md:px-1.5 max-md:py-0.5"
          >
            +
          </button>
        </div>
        <div className="flex flex-row items-center justify-center gap-1 sm:max-xl:gap-2">
          <label className="text-[0.8rem] font-table text-black">Max</label>
          <button
            onClick={() => handleMaxChange(-increment)}
            className="rounded-lg bg-z-green-500 px-2 py-1 text-white focus:outline-none max-xl:rounded-md max-md:px-1.5 max-md:py-0.5"
          >
            -
          </button>
          <input
            type="number"
            value={maxValue}
            readOnly
            className="w-20 rounded-lg border bg-white px-2 py-1 text-center text-black shadow-lg focus:outline-none max-xl:rounded-md max-md:w-16 max-md:px-1 max-md:py-0.5 max-md:text-[0.6rem] sm:max-md:py-1"
          />
          <button
            onClick={() => handleMaxChange(increment)}
            className="rounded-lg bg-z-green-500 px-2 py-1 text-white focus:outline-none max-xl:rounded-md max-md:px-1.5 max-md:py-0.5"
          >
            +
          </button>
        </div>
      </span>
      <span className=" w-[5%] 2xl:mr-5">
        {showOiChange && (
          <ResetButton
            handleReset={refreshStrikeRange}
            spinningAnimation={spinningAnimation}
          />
        )}
      </span>
    </div>
  );
};

export default StrikeRange;
