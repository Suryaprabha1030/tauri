import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import NewsBox from "../../sidetoolbar/news/NewsBox";
import InfoNotes from "../InfoNotes";
import { useNavigate } from "react-router-dom";
import { formatDateTime } from "@/lib/util/sideToolBar/news/TimeConverterUtil";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import {
  fetchSymbolNews,
  setupNewsInterval,
} from "@/lib/util/Stockinfo/Stockinfo";

interface ClickedSymbol {
  symbol_name: string;
  symbol: string;
  identifier: any;
}

interface SymbolNewsProps {
  clickedSymbolData: ClickedSymbol;
  setRandomNews: Dispatch<SetStateAction<boolean>>;
  setSentimentAnalyze: Dispatch<SetStateAction<any>>;
  sentimentAnalyze: any;
  setSAvalue: Dispatch<SetStateAction<any>>;
  stockInfo?: boolean;
  callApi?: boolean;
}

const GetSymbolNews: React.FC<SymbolNewsProps> = ({
  clickedSymbolData,
  setRandomNews,
  setSentimentAnalyze,
  sentimentAnalyze,
  setSAvalue,
  stockInfo,
  callApi,
}) => {
  const [newsData, setNewsData] = useState<any>();
  const [lastUpdated, setLastUpdated] = useState<any>(null);
  const [currentSymbol, setCurrentSymbol] = useState(null);
  const [intervalId, setIntervalId] = useState(null);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [dispNews, setDispNews] = useState<any>();
  const router = useNavigate();
  const SymbolNews: any = useSelector(
    (state: RootState) => state.common.SymbolNewsData,
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (SymbolNews && currentSymbol && SymbolNews[currentSymbol]) {
      setNewsData(SymbolNews[currentSymbol]?.news);
      setDispNews(SymbolNews[currentSymbol]?.news);
      setRandomNews(SymbolNews[currentSymbol]?.random);
      setLastUpdated(new Date());
      setSentimentAnalyze(SymbolNews[currentSymbol]?.overall_sentiment_counts);
    }
  }, [SymbolNews, currentSymbol]);

  useEffect(() => {
    if (!clickedSymbolData) return;

    const symbolName = clickedSymbolData.identifier;
    if (currentSymbol !== symbolName) {
      setCurrentSymbol(symbolName);
      if (callApi) fetchSymbolNews(symbolName, dispatch, router);
    }
    if (callApi) {
      const cleanup = setupNewsInterval(
        symbolName,
        fetchSymbolNews,
        dispatch,
        router,
        setIntervalId,
      );

      return cleanup;
    }
  }, [clickedSymbolData, currentSymbol, activeFilters]);

  useEffect(() => {
    const maxValue = Math.max(
      sentimentAnalyze?.negative,
      sentimentAnalyze?.neutral,
      sentimentAnalyze?.positive,
    );
    if (maxValue === sentimentAnalyze?.positive) {
      setSAvalue("Positive");
    } else if (maxValue === sentimentAnalyze?.negative) {
      setSAvalue("Negative");
    } else if (maxValue === sentimentAnalyze?.neutral) {
      setSAvalue("Neutral");
    } else {
      setSAvalue(null);
    }
  }, [sentimentAnalyze, newsData]);
  useEffect(() => {
    if (activeFilters.length == 0) {
      setNewsData(dispNews);
    }
  }, [activeFilters]);

  return (
    <div
      id="newsSection"
      className="h-full w-full max-sm:pt-[0.5rem] sm:max-md:mb-[9rem] md:max-xl:mb-[13rem]"
    >
      <div className=" h-full w-full">
        {/* <NewsFilter
          setNewsData={setNewsData}
          setActiveFilters={setActiveFilters}
          activeFilters={activeFilters}
          newsData={dispNews}
        />{" "} */}
        {newsData && newsData.length > 0 ? (
          <>
            <div
              className={`my-2 ml-4 mr-3  h-[90%] overflow-y-auto rounded-lg border px-4 scrollbar-thin max-sm:py-1 xl:max-2xl:my-0.5 ${stockInfo ? "max-sm:mx-0 max-sm:max-h-[92%] max-sm:w-[100%] sm:max-lg:max-h-[100%] lg:max-xl:max-h-[95%] xl:max-2xl:max-h-[85%] 2xl:max-h-[90%]" : "max-sm:h-[78%] sm:max-lg:h-[100%] lg:max-xl:h-[95%] xl:max-2xl:h-[85%] 2xl:h-[90%]"} `}
            >
              <NewsBox newsData={newsData} tagTrue={true} AllNews={false} />
            </div>
            <h1 className="text-center text-[0.55rem] text-gray-400 sm:max-lg:py-1.5 lg:max-xl:py-2.5 xl:max-2xl:py-2">
              News Last updated at{" "}
              {lastUpdated ? formatDateTime(lastUpdated) : "Fetching..."}
            </h1>
          </>
        ) : (
          <InfoNotes name=" No News" />
        )}
      </div>
    </div>
  );
};
export default GetSymbolNews;
