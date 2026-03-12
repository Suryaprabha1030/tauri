import React, { useState, useEffect } from "react";

import { NewsRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import NewsBox from "../../sidetoolbar/news/NewsBox";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useNavigate } from "react-router-dom";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

const formatDateTime = (date: any) => {
  if (!date) return "";
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateOrTimeAgo = (publishedAt: any) => {
  const publishedDate: any = new Date(publishedAt);
  const now: any = new Date();
  const timeDiffInSeconds = Math.floor((now - publishedDate) / 1000);

  const secondsInMinute = 60;
  const secondsInHour = 3600;
  const secondsInDay = 86400;

  if (timeDiffInSeconds < secondsInMinute) {
    return `${timeDiffInSeconds} seconds ago`;
  } else if (timeDiffInSeconds < secondsInHour) {
    const minutes = Math.floor(timeDiffInSeconds / secondsInMinute);
    return `${minutes} minutes ago`;
  } else if (timeDiffInSeconds < secondsInDay) {
    const hours = Math.floor(timeDiffInSeconds / secondsInHour);
    return `${hours} hours ago`;
  } else {
    return publishedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
};

interface SentimentInfo {
  sentiment: "positive" | "neutral" | "negative";
  value: number;
}
interface MultiSymbolNewsProps {
  symbolsPerPage: number;
  symbols: any[];
}

const MultiSymbolNews: React.FC<MultiSymbolNewsProps> = ({
  symbolsPerPage,
  symbols,
}) => {
  const [newsData, setNewsData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0); // Track the current page for pagination
  const [totalPages, setTotalPages] = useState(0); // Track total pages
  const [sentimentData, setSentimentData] = useState<{
    [key: string]: SentimentInfo;
  }>({});
  const [hoveredSymbol, setHoveredSymbol] = useState<string | null>(null);
  const router = useNavigate();
  useEffect(() => {
    const multisymbolNewsApi = new NewsRouterApi(baseConfig());

    const fetchNews = () => {
      if (symbols && symbols.length > 0) {
        multisymbolNewsApi
          .fetchSymbolsV1NewsForSymbolsPost(symbols)
          .then((res) => {
            setNewsData(res.data || []);
            setLastUpdated(new Date());

            const sentiments: { [key: string]: SentimentInfo } = {};
            res.data.forEach((symbolData: any) => {
              const { overall_sentiment_counts } = symbolData;
              const maxSentiment = Math.max(
                overall_sentiment_counts.positive,
                overall_sentiment_counts.neutral,
                overall_sentiment_counts.negative,
              );
              const sentiment =
                maxSentiment === overall_sentiment_counts.positive
                  ? "positive"
                  : maxSentiment === overall_sentiment_counts.negative
                    ? "negative"
                    : "neutral";
              sentiments[symbolData.symbol] = {
                sentiment,
                value: maxSentiment,
              };
            });
            setSentimentData(sentiments);
          })
          .catch((err: any) => {
            if (err?.response && err?.response?.status == 401) {
              autoLogoutTokenRemove(router);
            }
            if (err?.response && err?.response?.status == 456) {
              brokerLogoutTokenRemove(router);
            }
          });
      }
    };

    fetchNews();

    // Calculate delay until the next 15-minute mark
    const now = new Date();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const millisecondsUntilNextQuarterHour =
      ((15 - (minutes % 15)) * 60 - seconds) * 1000;

    // Set a timeout to align with the next 15-minute mark
    const timeoutId = setTimeout(() => {
      // Call the API at the next quarter-hour mark
      fetchNews();

      // Set an interval to call the API every 15 minutes after the initial delay
      const intervalId = setInterval(
        () => {
          fetchNews();
        },
        15 * 60 * 1000,
      );

      // Clean up the interval on unmount
      return () => clearInterval(intervalId);
    }, millisecondsUntilNextQuarterHour);

    // Clean up the timeout on unmount
    return () => clearTimeout(timeoutId);
  }, [symbols]);

  useEffect(() => {
    // Recalculate the total number of pages based on symbolsPerPage
    const updatedTotalPages = Math.ceil(newsData.length / symbolsPerPage);
    setTotalPages(updatedTotalPages);

    // Ensure current page is valid after the number of symbols per page changes
    if (currentPage >= updatedTotalPages) {
      setCurrentPage(Math.max(updatedTotalPages - 1, 0)); // Adjust current page if it exceeds the new total pages
    }
  }, [symbolsPerPage, newsData.length]); // Triggered when either symbolsPerPage or newsData changes

  const currentSymbols = newsData.slice(
    currentPage * symbolsPerPage,
    (currentPage + 1) * symbolsPerPage,
  );

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getColorBasedOnSentiment = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-z-green-500"; // Green for positive
      case "negative":
        return "text-red-500"; // Red for negative
      case "neutral":
        return "text-black"; // Gray for neutral
      default:
        return "";
    }
  };

  const handleMouseEnter = (symbol: string) => setHoveredSymbol(symbol);
  const handleMouseLeave = () => setHoveredSymbol(null);

  return (
    <div className="flex h-full w-full flex-col gap-1 ">
      <div className="relative flex h-[90%] w-full flex-row gap-4 px-10 pt-5">
        {newsData && newsData.length > 0 ? (
          <>
            {/* Previous Button */}
            {newsData && newsData.length > 0 && (
              <button
                onClick={handlePrev}
                className={`absolute left-0 top-1/2 mx-2 h-[2rem] -translate-y-1/2 transform rounded-lg bg-slate-300 px-2 text-center hover:bg-slate-400 ${
                  currentPage === 0 ? "hidden" : ""
                }`}
                aria-label="Previous"
              >
                &#10094;
              </button>
            )}
            {/* News Cards */}
            {currentSymbols.map((symbolData) => {
              const apiSymbol = symbolData.symbol;

              const sentimentInfo = sentimentData[symbolData.symbol] || {
                sentiment: "neutral",
                value: 0,
              };

              if (
                !symbolData.news ||
                !Array.isArray(symbolData.news) ||
                symbolData.news.length === 0
              ) {
                return null; // Ignore if there's no news data
              }

              return (
                <div
                  key={apiSymbol}
                  className="h-[15rem] w-[17rem] rounded-lg  shadow-strong-top"
                >
                  <div className="mx-6 flex flex-row items-center justify-center">
                    <div
                      className="relative mx-6 flex flex-row items-center justify-center "
                      onMouseEnter={() => handleMouseEnter(symbolData.symbol)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <h1
                        className={`cursor-pointer py-1 text-center text-[0.75rem] font-medium ${getColorBasedOnSentiment(
                          sentimentInfo.sentiment,
                        )}`}
                      >
                        {apiSymbol}
                      </h1>
                      {hoveredSymbol === symbolData.symbol && (
                        <span className="pointer-events-none absolute left-0 top-10 z-[1000] ml-1 w-[9rem] -translate-x-full -translate-y-1/2 transform rounded bg-gray-800 px-1 text-[0.65rem] text-white opacity-100 transition-opacity duration-200">
                          Sentiment Analysis value of this Symbol is{" "}
                          {sentimentInfo.sentiment} with a value of{" "}
                          {sentimentInfo.value}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-full w-full">
                    <div className="h-[80%] overflow-y-auto rounded-lg px-4 scrollbar-thin  max-md:px-4  ">
                      <NewsBox
                        newsData={symbolData?.news}
                        tagTrue={false}
                        AllNews={false}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Next Button */}
            {newsData && newsData.length > 0 && (
              <button
                onClick={handleNext}
                className={`absolute right-0 top-1/2 mx-2 h-[2rem] -translate-y-1/2 transform rounded-lg bg-slate-300 px-2 text-center hover:bg-slate-400 ${
                  currentPage === totalPages - 1 ? "hidden" : ""
                }`}
                aria-label="Next"
              >
                &#10095;
              </button>
            )}
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[0.75rem]">
            No News To Display
          </div>
        )}
      </div>

      {newsData && newsData.length > 0 && (
        <h1 className="text-center text-[0.55rem] text-gray-400">
          News Last updated at{" "}
          {lastUpdated ? formatDateTime(lastUpdated) : "Fetching..."}
        </h1>
      )}
    </div>
  );
};

export default MultiSymbolNews;
