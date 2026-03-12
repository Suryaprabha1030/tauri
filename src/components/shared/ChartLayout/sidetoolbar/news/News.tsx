import { NewsRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import React, { useEffect, useState } from "react";
import NewsHeader from "./NewsHeader";
import NewsBox from "./NewsBox";
import NewsPagination from "./NewsPagination";
import NewsUpdateTime from "./NewsUpdateTime";
import {
  fetchNews,
  startIntervalAtQuarterHour,
} from "@/lib/util/sideToolBar/news/fetchNews";
import { useNavigate } from "react-router-dom";

interface NewsProps {
  brokerCode: number | null;
  leftWidth: number;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
}

const News: React.FC<NewsProps> = ({ brokerCode, setLeftWidth, leftWidth }) => {
  const [newsData, setNewsData] = useState<any>();
  const [currentPage, setCurrentPage] = useState(1);
  const [lastUpdated, setLastUpdated] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dispNews, setDispNews] = useState<any>();
  const router = useNavigate();
  useEffect(() => {
    fetchNews(currentPage, setNewsData, setLastUpdated, setDispNews, router);

    // Start the interval-aligned API call
    const cleanup = startIntervalAtQuarterHour(
      currentPage,
      setNewsData,
      setLastUpdated,
      setDispNews,
      router,
    );

    // Clean up everything on component unmount or dependency change
    return cleanup;
  }, [brokerCode, currentPage]);
  useEffect(() => {
    if (activeFilters.length == 0) {
      setNewsData(dispNews);
    }
  }, [activeFilters]);

  return (
    <>
      <NewsHeader
        leftWidth={leftWidth}
        setLeftWidth={setLeftWidth}
        setNewsData={setNewsData}
        setActiveFilters={setActiveFilters}
        activeFilters={activeFilters}
        newsData={dispNews}
      />
      <div className="mx-6 h-[75%] overflow-y-auto rounded-lg border border-2 scrollbar-thin max-xl:px-4 max-xl:py-1 sm:max-md:h-[73%] md:max-xl:mt-4 md:max-xl:h-[60%] xl:p-4 xl:max-2xl:h-[73.5%]">
        {newsData && newsData.length > 0 ? (
          <NewsBox newsData={newsData} tagTrue={true} AllNews={true} />
        ) : (
          <div className="flex h-full items-center justify-center py-10 text-center ">
            No News To Display
          </div>
        )}
      </div>
      {newsData && newsData.length > 0 && (
        <>
          <NewsUpdateTime lastUpdated={lastUpdated} />
          <NewsPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </>
  );
};

export default News;
