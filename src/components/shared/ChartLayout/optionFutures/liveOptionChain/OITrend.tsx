import React from "react";
import { determineMarketAction } from "../optionFuturesUtil/strategyUtil";
import { getTrend } from "@/lib/util/analyzer/iconUtil";

interface OITrendProps {
  expandTable: any;
  oiChangePerc: any;
  closeCEPEPercentage: any;
  icon: any;
  rowKey: any;
  optionType: any;
}
const OITrend: React.FC<OITrendProps> = ({
  expandTable,
  oiChangePerc,
  closeCEPEPercentage,
  icon,
  rowKey,
  optionType,
}) => {
  return (
    <span
      className={`flex w-[100%] items-center justify-center ${getTrend(icon)} whitespace-nowrap text-[0.75rem] font-table text-black xl:text-[0.7rem]`}
    >
      {determineMarketAction(
        oiChangePerc[`${rowKey}#${optionType}`],
        parseFloat(closeCEPEPercentage),
        optionType,
        expandTable,
      )}
    </span>
  );
};

export default OITrend;
