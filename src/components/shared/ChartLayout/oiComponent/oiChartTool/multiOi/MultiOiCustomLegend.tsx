import React from "react";

const MultiOiCustomLegend = () => {
  return (
    <div className="flex w-full  items-center justify-center gap-5  max-sm:text-[0.75rem]">
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 rounded-sm bg-black"></div>
        <span className="text-sm max-sm:text-[0.75rem]">Spot Price</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 rounded-sm bg-z-pcr"></div>
        <span className="text-sm max-sm:text-[0.75rem]">PCR</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 rounded-sm bg-z-vwap"></div>
        <span className="text-sm max-sm:text-[0.75rem]">VWAP</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="h-3 w-3 rounded-sm bg-z-maxpain"></div>
        <span className="text-sm max-sm:text-[0.75rem]">Max Pain</span>
      </div>
    </div>
  );
};

export default MultiOiCustomLegend;
