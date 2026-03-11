import { formatNumber } from "@/lib/util/DraftUtil";
import React from "react";

interface OiWithPercentageProps {
  oi: any;
  rowKey: any;
  oiChangePerc: any;
  optionType: any;
  expandOptTable?: boolean;
}
const OiWithPercentage: React.FC<OiWithPercentageProps> = ({
  oi,
  rowKey,
  oiChangePerc,
  optionType,
  expandOptTable,
}) => {
  return (
    <span
      className={` flex flex-col sm:max-lg:flex sm:max-lg:flex-col xl:max-2xl:inline-flex xl:max-2xl:flex-col xl:max-2xl:gap-0.5 `}
    >
      {formatNumber(oi[`${rowKey}#${optionType}`])}
      <span
        className={`2xl:ml-1 ${
          oiChangePerc[`${rowKey}#${optionType}`] > 0
            ? "text-z-green-500"
            : oiChangePerc[`${rowKey}#${optionType}`] < 0
              ? "text-red-400"
              : "text-gray-500"
        }`}
      >
        ({oiChangePerc[`${rowKey}#${optionType}`]}%)
      </span>
    </span>
  );
};

export default OiWithPercentage;
