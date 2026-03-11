// GroupHeader.tsx
import React from "react";
import Image from "next/image";
import { getImageSrc } from "@/lib/util/analyzer/iconUtil";

interface GroupHeaderProps {
  strategyDirection: string;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ strategyDirection }) => {
  return (
    <tr className="w-[100%]">
      <td
        colSpan={5}
        className="h-8 w-full text-[0.75rem] text-gray-500 md:max-xl:h-14"
      >
        <div className="flex items-center space-x-2 md:max-xl:space-x-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <div className="flex items-center space-x-2 md:max-xl:space-x-4">
            <img
              src={getImageSrc(strategyDirection)}
              alt={strategyDirection}
              width={14}
              height={14}
              className="md:max-xl:h-[1rem] md:max-xl:w-[1rem]"
            />
            <span
              className={`font-semibold capitalize ${
                strategyDirection === "Bullish"
                  ? "text-z-green-500"
                  : strategyDirection === "Bearish"
                    ? "text-red-400"
                    : "text-gray-500"
              }`}
            >
              {strategyDirection}
            </span>
          </div>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
      </td>
    </tr>
  );
};

export default GroupHeader;
