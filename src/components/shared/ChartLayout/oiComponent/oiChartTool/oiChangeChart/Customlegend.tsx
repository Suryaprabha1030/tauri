// components/CustomLegend.js
import Image from "next/image";
import React from "react";

const CustomLegend = () => {
  return (
    <div className="w-full items-center max-md:grid max-md:grid-cols-3 max-md:justify-items-center max-md:gap-3 sm:max-md:my-[0.8rem] md:flex md:justify-center md:max-xl:my-[1.5rem] md:max-xl:gap-8 xl:gap-3 ">
      {/* Call OI */}
      <div className="flex items-center space-x-2 md:max-xl:space-x-4">
        <div className="h-3 w-3 rounded-sm bg-red-500"></div>
        <span className="text-sm">Call OI</span>
      </div>
      {/* Increase (Call OI) - Red Stripes */}
      <div className="flex items-center space-x-2 md:max-xl:space-x-4">
        <img
          src="/images/red_stripes.png"
          alt=""
          width={12}
          height={12}
          style={{ width: "0.7rem", height: "0.7rem" }}
        />
        <span className="font-label text-sm">Increase</span>
      </div>
      {/* Decrease (Call OI) */}
      <div className="flex items-center space-x-2 md:max-xl:space-x-4">
        <div className="h-3 w-3 rounded-sm border-2 border-red-500"></div>
        <span className="font-label text-sm">Decrease</span>
      </div>
      {/* Put OI */}
      <div className="flex items-center space-x-2 md:max-xl:space-x-4">
        <div className="h-3 w-3 rounded-sm bg-green-500"></div>
        <span className="font-label text-sm">Put OI</span>
      </div>
      {/* Increase (Put OI) - Green Stripes */}
      <div className="flex items-center space-x-2 md:max-xl:space-x-4">
        <img
          src="/images/green_stripes.png"
          alt=""
          width={12}
          height={12}
          style={{ width: "0.7rem", height: "0.7rem" }}
        />
        <span className="font-label text-sm">Increase</span>
      </div>
      {/* Decrease (Put OI) */}
      <div className="flex items-center space-x-2 md:max-xl:space-x-4">
        <div className="h-3 w-3 rounded-sm border-2 border-green-500"></div>
        <span className="font-label text-sm">Decrease</span>
      </div>
    </div>
  );
};

export default CustomLegend;
