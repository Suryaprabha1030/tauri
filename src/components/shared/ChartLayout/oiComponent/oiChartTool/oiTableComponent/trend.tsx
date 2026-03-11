import { determineMarketActionOi } from "@/lib/util/oi/oiUtil";
import React from "react";

interface TrendProps {
  oiChangePerct: any;
  closeCEPEPercentage: any;
  oiKey: any;
  optionType: string;
}

const Trend: React.FC<TrendProps> = ({
  oiChangePerct,
  closeCEPEPercentage,
  oiKey,
  optionType,
}) => {
  return (
    <span className="w-[100%] whitespace-nowrap text-[0.55rem] text-black">
      {determineMarketActionOi(
        oiChangePerct[`${oiKey}#${optionType}}`],
        parseFloat(closeCEPEPercentage),
        optionType
      )}
    </span>
  );
};

export default Trend;
