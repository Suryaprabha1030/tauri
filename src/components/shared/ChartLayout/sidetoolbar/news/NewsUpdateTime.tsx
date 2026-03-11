import { formatDateTime } from "@/lib/util/sideToolBar/news/TimeConverterUtil";
import React from "react";
interface NewsHeaderProps {
  lastUpdated: boolean;
}

const NewsUpdateTime: React.FC<NewsHeaderProps> = ({ lastUpdated }) => {
  return (
    <h1 className="text-center text-[0.55rem] text-gray-400 max-sm:pt-1 sm:max-md:pt-1.5 md:max-xl:pt-3 xl:max-2xl:pt-[0.8rem] ">
      News Last updated at{" "}
      {lastUpdated ? formatDateTime(lastUpdated) : "Fetching..."}
    </h1>
  );
};

export default NewsUpdateTime;
