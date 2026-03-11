import { RootState } from "@/lib/redux/Store";
import React from "react";
import { useSelector } from "react-redux";

interface OptionChainKeyProps {
  optKey: any;
  spotPriceRoundOff: number | null;
  spotPriceInfo: number | null;
  noOiData: boolean;
}

const OptionChainKey: React.FC<OptionChainKeyProps> = ({
  optKey,
  spotPriceRoundOff,
  spotPriceInfo,
  noOiData,
}) => {
  const MaxPainStrike = useSelector(
    (state: RootState) => state.StrategyChart.maxPainStrikeValue
  );
  return (
    <span
      className={`flex  h-full w-full flex-col items-center justify-center`}
    >
      {Number(optKey) === spotPriceRoundOff ? (
        <div className="flex h-full   flex-col items-center justify-center gap-[0.1rem]">
          <span>{optKey}</span>{" "}
          <span className="text-[0.6rem] text-blue-300">({spotPriceInfo})</span>
        </div>
      ) : (
        <span>{optKey}</span>
      )}
      {!noOiData && (
        <span className="block text-[0.6rem] font-semibold uppercase  max-sm:text-[0.5rem] sm:max-md:text-[0.5rem] xl:text-[0.5rem] 2xl:text-[0.6rem] ">
          {`${MaxPainStrike}.0` == optKey ? "Max Pain" : ""}
        </span>
      )}
    </span>
  );
};

export default OptionChainKey;
