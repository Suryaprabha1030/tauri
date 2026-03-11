import React from "react";
import { Dispatch, SetStateAction } from "react";

interface SentimentAnalysisProps {
  SAvalue: any;
  randomNews: boolean;
  sentimentAnalyze: any;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({
  SAvalue,
  randomNews,
  sentimentAnalyze,
}) => {
  return (
    <div>
      {SAvalue != null && SAvalue.length > 0 && !randomNews && (
        <div className="text-center text-[0.75rem] text-gray-500 max-sm:text-[0.65rem] sm:max-xl:text-[0.7rem]">
          Sentiment Analysis is {SAvalue} with value{" "}
          {sentimentAnalyze[SAvalue.toLowerCase()]} out of 25 News
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;
