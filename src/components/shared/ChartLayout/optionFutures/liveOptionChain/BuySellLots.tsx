import React from "react";
import { lotNumbers } from "../optionFuturesUtil/newStrategyUtil";

interface lotNumbersProps {
  LiveselectedDataForPECE: any;
  LivehandleUpdateLots: (event: any) => void;
}

const BuysellLots: React.FC<lotNumbersProps> = ({
  LiveselectedDataForPECE,
  LivehandleUpdateLots,
}) => {
  return (
    <div className="flex flex-row">
      <select
        className="block rounded-lg bg-gray-50 py-[0.05rem] text-center text-black shadow-strong-top outline-none scrollbar-thin focus:border-blue-500 focus:ring-blue-500 max-md:w-[2.3rem] max-md:px-[0.05rem] max-md:text-[0.65rem] md:w-[2.7rem] md:text-[0.75rem] md:max-xl:py-0.5 xl:px-[0.1rem]"
        value={LiveselectedDataForPECE?.lots}
        onChange={LivehandleUpdateLots}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {lotNumbers.map((num) => {
          const lotValue = num + 1;
          const minLots = LiveselectedDataForPECE?.is_selected
            ? LiveselectedDataForPECE?.old_lots || LiveselectedDataForPECE?.lots
            : 1;

          return lotValue >= minLots ||
            lotValue <= LiveselectedDataForPECE?.lots ? (
            <option key={lotValue} value={lotValue}>
              {lotValue}
            </option>
          ) : null;
        })}
      </select>
    </div>
  );
};

export default BuysellLots;
