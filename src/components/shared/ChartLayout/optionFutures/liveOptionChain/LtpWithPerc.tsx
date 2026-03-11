import { formatNumber } from "@/lib/util/DraftUtil";
import React from "react";

interface ltpWithPercProps {
  closePECE: string;
  closePECEPercentage: any;
}

const LtpWithPerc: React.FC<ltpWithPercProps> = ({
  closePECE,
  closePECEPercentage,
}) => {
  return (
    <div
      className={`flex w-[100%] items-center justify-center max-2xl:flex-col xl:max-2xl:gap-0.5 xl:max-2xl:pt-[0.3rem]  2xl:flex-col 2xl:gap-1`}
    >
      <span>{formatNumber(closePECE)}</span>

      <span
        className={`text-[0.65rem] ${
          parseFloat(closePECEPercentage) > 0
            ? "text-z-green-500"
            : parseFloat(closePECEPercentage) < 0
              ? "text-red-400"
              : parseFloat(closePECEPercentage) == 0
                ? "text-gray-500"
                : ""
        }`}
      >
        ({closePECEPercentage && closePECEPercentage?.toFixed(2)}
        %)
      </span>
    </div>
  );
};

export default LtpWithPerc;
