import React from "react";

interface CombinedOiLegendWithRangeProps {
  combinedOiMinStrikeRange: any;
  combinedOiMaxStrikeRange: any;
}

const CombinedOiLegendWithRange: React.FC<CombinedOiLegendWithRangeProps> = ({
  combinedOiMinStrikeRange,
  combinedOiMaxStrikeRange,
}) => {
  return (
    <div className="flex h-full w-full items-center justify-center text-[0.75rem] max-sm:flex-col max-sm:gap-3 sm:max-md:gap-10 md:gap-20">
      <span className="flex  items-center justify-center gap-3 sm:max-md:gap-6 md:max-xl:gap-10">
        <div className="flex items-center space-x-2 md:max-xl:space-x-4">
          <div className="h-3 w-3 rounded-sm bg-red-500"></div>
          <span className="font-label text-[0.75rem]">Call OI</span>
        </div>

        <div className="flex items-center space-x-2 md:max-xl:space-x-4">
          <div className="h-3 w-3 rounded-sm bg-green-500"></div>
          <span className="font-label text-[0.75rem]">Put OI</span>
        </div>
        <div className="flex items-center space-x-2 md:max-xl:space-x-4">
          <div className="h-3 w-3 rounded-sm bg-black"></div>
          <span className="font-label text-[0.75rem]">Spot Price</span>
        </div>
      </span>

      <span className="font-label text-[0.7rem]">
        Strike Price Range:
        <span className="font-label ml-2">
          {combinedOiMinStrikeRange}-{combinedOiMaxStrikeRange}
        </span>
      </span>
    </div>
  );
};

export default CombinedOiLegendWithRange;
