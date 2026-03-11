import React from "react";
import { getMarketSentiment, getMarketSentimentColor } from "./colorGrade";

interface StrategyTypeProps {
  tableData: any;
}

const StrategyType: React.FC<StrategyTypeProps> = ({ tableData }) => {
  return (
    <div className="flex flex-row items-center  justify-center gap-1 space-x-2 text-[0.85rem] text-black max-2xl:hidden">
      <span>OI Trend :</span>
      <span className={`${getMarketSentimentColor(tableData)}`}>
        {getMarketSentiment(tableData)}
      </span>
    </div>
  );
};

export default StrategyType;
