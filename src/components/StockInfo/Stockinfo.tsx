import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import TabNavigation from "./TabNavigation";
import LightweightChart from "./StockInfoChart";
import { useRouter } from "next/navigation";
import CompanyProfile from "./CompanyProfile";
import StockFinancial from "./StockFinancials";
import TimeframeSelector from "../shared/ChartLayout/sidetab/TimeFrameSelector/TimeFrameSelector";

import ResultsTable from "./FormattedTableDisplay";
import DisplayIncreDecrease from "../shared/ChartLayout/DisplayIncreDecrease/DisplayIncreDecrease";
import StockHeaderInfo from "./StockHeaderInfo";
import Technicals from "../shared/ChartLayout/sidetab/TechnicalAnalysis/Technicals";

import GetSymbolNews from "../shared/ChartLayout/sidetab/News/GetSymbolNews";
import Pivots from "../shared/ChartLayout/sidetab/Pivots/Pivots";

import NoData from "./NoData";
import SentimentAnalysis from "./SentimentAnalysis";
import {
  fetchChartData,
  fetchStockData,
  fetchSymbolNews,
  formatToChartFullLabel,
  getSymbolDetails,
  setupNewsInterval,
} from "@/lib/util/Stockinfo/Stockinfo";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { StockInfoAPIApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import CashFlowTable from "./CashFlowTable";
import PePbChart from "./PePbChart";
import StockInfoNavbar from "./StockInfoNavbar";
import PeersComparison from "./PeersComparison";
import TrendsSection from "./TrendsSection";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import DocumentSection from "./DocumentSection";

interface StockInfoProps {
  symbol: any;
  symbolName: any;
  brokerCode: any;
  scopeId: any;
  clickedSymbolData?: any;
  setShowNewsPivots?: Dispatch<SetStateAction<boolean>>;
  showNewsPivots?: boolean;
  setShowTechnicals?: Dispatch<SetStateAction<boolean>>;
  showTechnicals?: boolean;
  webSocketDataRead?: any;
  netpercentage?: any;
  InsideChat?: boolean;
}

const StockInfo: React.FC<StockInfoProps> = ({
  symbol,
  symbolName,
  brokerCode,
  scopeId,
  clickedSymbolData,
  setShowNewsPivots,
  setShowTechnicals,
  showNewsPivots,
  showTechnicals,
  webSocketDataRead,
  netpercentage,
  InsideChat,
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [info, setInfo] = useState({});
  const [incomeStatement, setIncomeStatement] = useState({});
  const [quaterlySheet, setQuaterlysheet] = useState({});
  const [cashflow, setcashFlow] = useState({});
  const [balanceSheet, setbalanceSheet] = useState({});
  const [peersData, setPeersData] = useState([]);
  const [pepbData, setPepbData] = useState([]);
  const [trendsData, setTrendsData] = useState<any>([]);
  const [documentsData, setDocumentsData] = useState<any>([]);
  const resolution = useSelector(
    (state: RootState) => state.charts.setTvResolution
  );
  const router = useRouter();
  const timeframes = ["5", "15", "30", "60", "1D"];
  const [selectedTimeframe, setSelectedTimeframe] = useState(
    timeframes.includes(resolution) ? resolution : "1D"
  );

  const [AreaColor, setAreaColor] = useState("");
  const [volumeColor, setvolumeColor] = useState("");
  const [showVolume, setShowVolume] = useState(false);
  const [techValue, setTechValue] = useState("");
  const [TechTableOpen, setTechTableOpen] = useState<boolean>(false);
  const [techIndicator, setTechIndicator] = useState("");
  const [sentimentAnalyze, setSentimentAnalyze] = useState("");
  const [SAvalue, setSAvalue] = useState<any>("");
  const [randomNews, setRandomNews] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [symbolInfo, setSymbolInfo] = useState<any>(null);
  const technicalsRef = useRef<HTMLDivElement | null>(null);
  const newsRef = useRef<HTMLDivElement | null>(null);
  const peersRef = useRef<HTMLDivElement | null>(null);
  const trendsRef = useRef<HTMLDivElement | null>(null);
  const pePbRef = useRef<HTMLDivElement | null>(null);
  const docsRef = useRef<HTMLDivElement | null>(null);
  const [SymbolNews, setSymbolNews] = useState<any>();
  const hasRenderedTechnicals = useRef(false);
  const hasRenderedNews = useRef(false);
  const hasRenderedPeers = useRef(false);
  const hasRenderedTrends = useRef(false);
  const hasRenderedPePb = useRef(false);
  const [newsByTime, setNewsByTime] = useState<any>({});
  const SymbolNewsData: any = useSelector(
    (state: RootState) => state.common.SymbolNewsData
  );
  const screenerOpen: any = useSelector(
    (state: RootState) => state.common.ScreenerOpen
  );
  const isEquity = clickedSymbolData?.symbol_type === "equity" ? true : false;

  // Below 3 arrays has the required fields for corresponding tables
  const quarterlyResultFields = [
    "Net Debt",
    "Gross PPE",
    "Total Debt",
    "Share Issued",
    "Total Assets",
    "Dividends Payable",
    "Total Tax Payable",
    "Invested Capital",
    "Tangible Book Value",
    "Total Capitalization",
  ];
  const cashFlowFields = [
    "Operating Cash Flow",
    "Financing Cash Flow",
    "Investing Cash Flow",
  ];
  const balanceSheetFields = [
    "Cash And Cash Equivalents",
    "Receivables",
    "Net PPE",
    "Goodwill And Other Intangible Assets",
    "Invested Capital",
    "Total Assets",
    "Payables",
    "Dividends Payable",
    "Total Debt",
    "Stockholders Equity",
    "Retained Earnings",
  ];

  const dispatch = useDispatch();

  // Peer comparison API
  async function fetchPeerComparison() {
    const fetchApi = new StockInfoAPIApi(baseConfig());
    try {
      const res =
        await fetchApi.getPeerComparisonSymbolInfoPeerComparisonGet(symbol);
      if (res?.status == 204 || res?.status == 400) {
        setPeersData([]);
        return;
      }
      setPeersData(res?.data);
    } catch (error: any) {
      if (error?.response && error?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      }
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
      if (error?.response && error?.response?.status == 400) {
        setPeersData([]);
      }
    }
  }
  // Stock Info (Fetch TA)
  async function fetchStockInfo() {
    const fetchApi = new StockInfoAPIApi(baseConfig());
    try {
      const res =
        await fetchApi.fetchTaPivotsWithYfinanceHistoryCandlesSymbolInfoStockDataGet(
          brokerCode,
          symbol
        );
      if (res?.status == 204) {
        setPepbData([]);
        setDocumentsData([]);
        return;
      }
      setPepbData(res?.data?.pe_pb_ratio);
      setDocumentsData(res?.data?.notification);
    } catch (error: any) {
      if (error?.response && error?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      }
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
      if (error?.response && error?.response?.status == 400) {
        setPepbData([]);
        setDocumentsData([]);
      }
    }
  }
  // Trends Data API
  async function fetchTrendsData() {
    const fetchApi = new StockInfoAPIApi(baseConfig());
    try {
      const res = await fetchApi.fetchTrendsDataSymbolInfoTrendsGet(symbol);
      if (res?.status == 204) {
        setTrendsData([]);
        return;
      }
      setTrendsData(res?.data);
    } catch (error: any) {
      if (error?.response && error?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      }
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
      if (error?.response && error?.response?.status == 400) {
        setTrendsData([]);
      }
    }
  }

  useEffect(() => {
    setSymbolNews(SymbolNewsData[symbol]);
  }, [SymbolNewsData]);

  useEffect(() => {
    if (!symbol) return;

    const fetchSymbolDetails = async () => {
      const info = await getSymbolDetails(brokerCode, symbol, router);
      setSymbolInfo(info);
    };

    fetchSymbolDetails();
  }, [symbol]); // runs only when symbol changes

  useEffect(() => {
    if (!symbolInfo) return;

    fetchChartData(
      symbol,
      selectedTimeframe,
      setChartData,
      brokerCode,
      router,
      symbolInfo
    );
  }, [selectedTimeframe, symbolInfo]);

  useEffect(() => {
    if (chartData && chartData.length > 0) {
      const showVolumes = chartData.some((item) => item.volume !== 0);
      setShowVolume(showVolumes);
      setShowCheckbox(showVolumes);
    }
  }, [chartData]);

  useEffect(() => {
    if (symbol != undefined && symbol != null) {
      fetchStockData(
        setInfo,
        setQuaterlysheet,
        setIncomeStatement,
        setcashFlow,
        setbalanceSheet,
        symbol,
        router
      );

      fetchSymbolNews(symbol, dispatch, router);

      const cleanup = setupNewsInterval(
        symbol,
        fetchSymbolNews,
        dispatch,
        router,
        () => {}
      );

      if (
        netpercentage[symbol] !== undefined &&
        netpercentage[symbol] !== null &&
        Number(netpercentage[symbol]) >= 0
      ) {
        setAreaColor("#aad688");
        setvolumeColor("#5ea758");
      } else {
        setAreaColor("#ff8c69");
        setvolumeColor("#f44336");
      }

      return cleanup;
    }

    return () => {
      setInfo([]),
        setQuaterlysheet([]),
        setIncomeStatement([]),
        setcashFlow([]),
        setbalanceSheet([]);
    };
  }, [symbol]);

  useEffect(() => {
    if (!SymbolNews?.news) return;
    const grouped: any = {};
    SymbolNews.news.forEach((item: any) => {
      const formattedKey = formatToChartFullLabel(item?.published_at);
      if (!grouped[formattedKey]) {
        grouped[formattedKey] = [];
      }
      grouped[formattedKey].push({
        ...item,
        formattedKey,
      });
    });
    setNewsByTime(grouped);
  }, [SymbolNews]);

  const handleback = () => {
    setTechTableOpen(false);
  };
  const isInViewport = (el: HTMLElement | null) => {
    if (!el) return false;
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
  };

  // Reset and trigger initial visibility check on symbol change
  useEffect(() => {
    if (setShowTechnicals && setShowNewsPivots) {
      hasRenderedTechnicals.current = false;
      hasRenderedNews.current = false;
      hasRenderedPeers.current = false;
      hasRenderedTrends.current = false;
      hasRenderedPePb.current = false;
      setShowTechnicals(false);
      setShowNewsPivots(false);

      const timeout = setTimeout(() => {
        const techInView = isInViewport(technicalsRef.current);
        const newsInView = isInViewport(newsRef.current);

        if (techInView && !hasRenderedTechnicals.current) {
          hasRenderedTechnicals.current = true;
          setShowTechnicals(true);
        }

        if (newsInView && !hasRenderedNews.current) {
          hasRenderedNews.current = true;
          setShowNewsPivots(true);
        }
      }, 150);

      return () => clearTimeout(timeout);
    }
  }, [symbol]);

  //Intersection observer for lazy render
  useEffect(() => {
    if (setShowTechnicals && setShowNewsPivots) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            if (
              entry.target === technicalsRef.current &&
              !hasRenderedTechnicals.current
            ) {
              hasRenderedTechnicals.current = true;
              setShowTechnicals(true);
            }

            if (entry.target === newsRef.current && !hasRenderedNews.current) {
              hasRenderedNews.current = true;
              setShowNewsPivots(true);
            }
          });
        },
        { threshold: 0.15 }
      );

      if (technicalsRef.current) observer.observe(technicalsRef.current);
      if (newsRef.current) observer.observe(newsRef.current);

      return () => observer.disconnect();
    }
  }, []);

  useEffect(() => {
    if (timeframes.includes(resolution)) {
      setSelectedTimeframe(resolution);
    }
  }, [resolution]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          if (entry.target === peersRef.current && !hasRenderedPeers.current) {
            fetchPeerComparison();
            hasRenderedPeers.current = true;
          }
          if (
            entry.target === trendsRef.current &&
            !hasRenderedTrends.current
          ) {
            fetchTrendsData();
            hasRenderedTrends.current = true;
          }
          if (entry.target === pePbRef.current && !hasRenderedPePb.current) {
            fetchStockInfo();
            hasRenderedPePb.current = true;
          }
          if (entry.target === docsRef.current && !hasRenderedPePb.current) {
            fetchStockInfo();
            hasRenderedPePb.current = true;
          }
        });
      },
      { threshold: 0.15 }
    );
    if (peersRef.current) observer.observe(peersRef.current);
    if (trendsRef.current) observer.observe(trendsRef.current);
    if (pePbRef.current) observer.observe(pePbRef.current);
    if (docsRef.current) observer.observe(docsRef.current);

    return () => {
      observer.disconnect();
      setPeersData([]);
      setTrendsData([]);
      setPepbData([]);
      setDocumentsData([]);
    };
  }, [symbol]);
  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-white  scrollbar-none">
      <div
        className={`sticky top-0 z-[30] mt-1 flex flex-row items-center justify-between bg-white   shadow-sm max-xl:z-[50] max-lg:flex-col max-lg:items-start max-lg:justify-start lg:h-[4rem]  xl:max-2xl:flex-col xl:max-2xl:items-start xl:max-2xl:justify-start ${info && Object.entries(info).length > 0 ? `max-lg:gap-[0.5rem]   ${InsideChat ? "sm:max-lg:h-[3rem] xl:max-2xl:h-[3rem]" : "sm:max-md:h-[5.5rem] md:max-lg:h-[6.5rem] xl:max-2xl:h-[6.5rem]"} xl:max-2xl:gap-[0.5rem]` : "max-lg:h-[3rem]"}`}
      >
        <div className="flex flex-col justify-center  px-4 max-lg:flex-row max-lg:gap-2 max-lg:pt-2 xl:max-2xl:flex-row xl:max-2xl:gap-2 xl:max-2xl:pr-2 xl:max-2xl:pt-2">
          {" "}
          <p className="text-lg font-semibold uppercase text-black max-md:text-sm max-sm:pl-6 sm:max-lg:pl-10">
            {symbolName}
          </p>
          <div
            className={`flex w-[8rem] flex-row items-center gap-1 text-global font-medium max-md:text-[0.75rem] ${
              netpercentage[symbol] !== undefined &&
              netpercentage[symbol] !== null &&
              Number(netpercentage[symbol]) < 0
                ? "text-red-400"
                : Number(netpercentage[symbol]) > 0
                  ? "text-z-green-500"
                  : "text-gray-500"
            }`}
          >
            <span>
              {webSocketDataRead[symbol] != null
                ? Number(webSocketDataRead[symbol])?.toFixed(2)
                : "0.00"}
            </span>
            <span className=" text-[0.65rem] max-sm:text-[0.6rem]">
              (
              {netpercentage[symbol] !== undefined &&
                netpercentage[symbol] !== null &&
                Number(netpercentage[symbol])?.toFixed(2)}
              %)
            </span>
            <DisplayIncreDecrease
              value={
                netpercentage[symbol] !== undefined &&
                netpercentage[symbol] !== null &&
                Number(netpercentage[symbol])
              }
            />
          </div>
        </div>
        {info && Object.entries(info).length > 0 && !InsideChat && (
          <StockHeaderInfo info={info} />
        )}
        {!screenerOpen && brokerCode && !InsideChat ? (
          <TabNavigation />
        ) : (
          <div className="w-[10%]"></div>
        )}
      </div>

      {isEquity && chartData && !InsideChat && (
        <StockInfoNavbar info={info} scopeId={scopeId} />
      )}
      {!InsideChat && (
        <div
          id={`${scopeId}-Overview`}
          className="mx-auto my-4 w-[97%] scroll-mt-28 rounded-lg border-gray-200 bg-green-100 shadow-md max-2xl:scroll-mt-36 max-xl:scroll-mt-28 max-lg:scroll-mt-36 max-sm:scroll-mt-32"
        >
          {info && isEquity && !InsideChat && <CompanyProfile info={info} />}
        </div>
      )}

      <div
        id={`${scopeId}-Price History`}
        className={`mx-auto  ${InsideChat ? "max-lg:hidden" : ""} my-2 flex h-[60%] w-[97%] scroll-mt-28  flex-col gap-2 rounded-lg border p-2 shadow-md max-2xl:scroll-mt-36 max-xl:scroll-mt-28 max-lg:scroll-mt-36 max-sm:scroll-mt-32`}
      >
        <h1 className="p-1 text-lg font-semibold max-md:text-sm">
          Price History
        </h1>
        <div className="flex w-[100%] flex-row items-center justify-between px-4 max-sm:px-2">
          <TimeframeSelector
            selectedTimeframe={selectedTimeframe}
            onSelectTimeframe={setSelectedTimeframe}
          />
          <div>
            {showCheckbox && (
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="checkbox"
                  checked={showVolume}
                  onChange={() => {
                    setShowVolume(!showVolume);
                  }}
                  className="h-4 w-4 cursor-pointer"
                />
                <span className="text-[0.75rem]">Volume</span>
              </div>
            )}
          </div>
        </div>
        <div className={`   ${InsideChat ? "h-[17rem]" : "h-[95%]  w-[98%]"}`}>
          {chartData && Object.entries(chartData).length > 0 ? (
            <LightweightChart
              data={chartData}
              AreaColor={AreaColor}
              volumeColor={volumeColor}
              showVolume={showVolume}
              newsByTime={newsByTime}
              symbol={symbol}
            />
          ) : (
            <NoData data={"Chart"} />
          )}
        </div>
      </div>
      {isEquity && (
        <div
          id={`${scopeId}-Financial Sheets`}
          className={`mx-auto my-4 w-[97%] scroll-mt-28 max-2xl:scroll-mt-36 max-xl:scroll-mt-28 max-lg:scroll-mt-36 max-sm:scroll-mt-32`}
        >
          {info && Object.entries(info)?.length > 0 ? (
            <>
              {info &&
                Object.entries(info)?.length > 0 &&
                incomeStatement &&
                Object.entries(incomeStatement)?.length > 0 && (
                  <StockFinancial
                    info={info}
                    income={incomeStatement}
                    InsideChat={InsideChat}
                  />
                )}

              {quaterlySheet &&
                Object.entries(quaterlySheet)?.length > 0 &&
                !InsideChat && (
                  <div className="mx-auto my-4 flex w-full rounded-lg border px-2 py-2 shadow-md">
                    <ResultsTable
                      data={quaterlySheet}
                      section={"Quarterly Result"}
                      fields={quarterlyResultFields}
                      Insidechat={InsideChat}
                    />
                  </div>
                )}
              {cashflow &&
                Object.entries(cashflow)?.length > 0 &&
                !InsideChat && (
                  <div className="mx-auto my-4 flex w-full rounded-lg border px-2 py-2 shadow-md">
                    <CashFlowTable
                      data={cashflow}
                      section={"Cash Flows"}
                      fields={cashFlowFields}
                    />
                  </div>
                )}
              {balanceSheet &&
                Object.entries(balanceSheet)?.length > 0 &&
                !InsideChat && (
                  <div className="mx-auto my-4 flex w-full rounded-lg border px-2 py-2 shadow-md">
                    <ResultsTable
                      data={balanceSheet}
                      section={"Balance Sheet"}
                      fields={balanceSheetFields}
                      Insidechat={InsideChat}
                    />
                  </div>
                )}
            </>
          ) : (
            <div className="w-full rounded-lg border border-gray-200 p-2 shadow-md">
              <h1 className="items-center p-1 text-lg font-semibold max-md:text-sm">
                Financial Sheets
              </h1>
              <span className="flex h-[250px] w-full items-center justify-center text-lg text-gray-400 max-sm:text-sm">
                No Finance Sheets Available{" "}
              </span>
            </div>
          )}
        </div>
      )}

      {peersData && isEquity && !InsideChat && (
        <div
          ref={peersRef}
          id={`${scopeId}-Peers`}
          className="mx-auto my-4 flex w-[97%] scroll-mt-28 flex-col rounded-lg border p-2 shadow-md max-2xl:scroll-mt-36 max-xl:scroll-mt-28 max-lg:scroll-mt-36 max-sm:scroll-mt-32"
        >
          <PeersComparison peersData={peersData} />
        </div>
      )}
      {pepbData && isEquity && !InsideChat && (
        <div
          ref={pePbRef}
          id={`${scopeId}-PE/PB History`}
          className="mx-auto my-4 w-[97%] scroll-mt-28 rounded-md border border-gray-200 p-2 shadow-md max-2xl:scroll-mt-36 max-xl:scroll-mt-28 max-lg:scroll-mt-36 max-sm:scroll-mt-32"
        >
          <PePbChart data={pepbData} />
        </div>
      )}
      {trendsData && isEquity && !InsideChat && (
        <div
          ref={trendsRef}
          id={`${scopeId}-Trends`}
          className="mx-auto my-4 w-[97%] scroll-mt-28 rounded-md border border-gray-200 p-2 shadow-md max-2xl:scroll-mt-36 max-xl:scroll-mt-28 max-lg:scroll-mt-36 max-sm:scroll-mt-32"
        >
          <TrendsSection trendsData={trendsData} />
        </div>
      )}

      {!InsideChat && (
        <div
          id={`${scopeId}-Technicals`}
          className="mx-auto my-4 flex h-[90%] w-[97%] scroll-mt-28 flex-col rounded-lg border p-2 shadow-md max-2xl:scroll-mt-36 max-xl:scroll-mt-28 max-lg:scroll-mt-36 max-sm:scroll-mt-32"
          ref={technicalsRef}
        >
          <div className="px-1 py-2 text-lg font-semibold max-md:text-sm">
            Technicals
            {TechTableOpen && (
              <span
                className={`mx-2 w-[3.5rem] cursor-pointer gap-2 text-[0.75rem] font-medium text-gray-500 max-md:pt-[0.3rem] max-sm:text-[0.65rem] md:max-xl:pt-[0.2rem]`}
                onClick={() => (TechTableOpen ? handleback() : "")}
              >
                {" "}
                &lt;&lt; Back
              </span>
            )}
          </div>

          <div className="h-[95%] w-full max-md:h-[98%]">
            {showTechnicals == true && hasRenderedTechnicals.current ? (
              <Technicals
                brokerCode={brokerCode}
                clickedSymbolData={clickedSymbolData}
                setTechValue={setTechValue}
                setTechIndicator={setTechIndicator}
                setTechTableOpen={setTechTableOpen}
                TechTableOpen={TechTableOpen}
                stockInfo={true}
              />
            ) : null}
          </div>
        </div>
      )}
      {documentsData && isEquity && !InsideChat && (
        <div
          id={`${scopeId}-Documents`}
          ref={docsRef}
          className="mx-auto my-4 flex w-[97%] scroll-mt-28 rounded-md border px-2 py-2 shadow-md max-2xl:scroll-mt-36 max-xl:scroll-mt-28 max-lg:scroll-mt-36 max-sm:scroll-mt-32"
        >
          <DocumentSection data={documentsData} />
        </div>
      )}

      {!InsideChat && (
        <div
          id={`${scopeId}-Pivots & News`}
          className="mx-auto my-4 flex h-[95%] w-[97%] scroll-mt-28 flex-row rounded-lg border shadow-md max-2xl:scroll-mt-36 max-xl:scroll-mt-28 max-xl:flex-col max-lg:scroll-mt-36 max-sm:h-[72rem] max-sm:scroll-mt-32 sm:max-md:h-[89rem] md:max-xl:h-[98rem]"
          ref={newsRef}
        >
          <div className=" flex h-[100%] w-1/2 flex-col  gap-10 p-2 max-xl:w-[100%] max-sm:h-[47%] sm:max-xl:h-[44%]">
            <div className="flex h-[95%] w-full flex-col gap-2 max-xl:h-[100%]">
              <div className=" flex w-full flex-row  items-center justify-center text-lg font-semibold max-xl:justify-start max-md:text-sm max-sm:px-1 sm:max-xl:px-4">
                Pivots
              </div>
              {showNewsPivots && hasRenderedNews.current ? (
                <div className="h-[100%]">
                  <Pivots
                    brokerCode={brokerCode}
                    clickedSymbolData={clickedSymbolData}
                    stockInfo={true}
                  />
                </div>
              ) : null}
            </div>
          </div>
          <div className="flex h-[100%] w-1/2 flex-col items-center justify-center gap-1 p-2 max-xl:h-[50%] max-xl:w-[100%]">
            <div className=" flex w-full flex-row  justify-center gap-2 text-lg font-semibold max-xl:justify-start max-md:text-sm max-sm:px-1 sm:max-xl:pl-4">
              News{" "}
              {showNewsPivots && hasRenderedNews.current ? (
                <span className="h-7 pt-[0.01rem] text-[0.75rem] font-medium text-gray-500 max-sm:text-[0.65rem] sm:max-md:pt-[0.1rem] md:max-2xl:pt-[0.15rem]">
                  {randomNews ? "Related News" : ""}
                  {/*  Only for medium to xl */}
                  <span className="hidden sm:max-xl:flex">
                    <SentimentAnalysis
                      SAvalue={SAvalue}
                      randomNews={randomNews}
                      sentimentAnalyze={sentimentAnalyze}
                    />
                  </span>
                  {/*  Only for medium to xl */}
                </span>
              ) : null}
            </div>
            <div className="flex h-[95%] flex-col items-center gap-2 md:max-xl:w-[100%]">
              {/*  Only for max-sm and above xl */}
              {showNewsPivots &&
              hasRenderedNews.current &&
              clickedSymbolData ? (
                <>
                  <span className="sm:max-xl:hidden xl:max-2xl:mt-3">
                    <SentimentAnalysis
                      SAvalue={SAvalue}
                      randomNews={randomNews}
                      sentimentAnalyze={sentimentAnalyze}
                    />
                  </span>
                  {/*  Only for max-sm and above xl */}
                  <GetSymbolNews
                    clickedSymbolData={clickedSymbolData}
                    setRandomNews={setRandomNews}
                    sentimentAnalyze={sentimentAnalyze}
                    setSentimentAnalyze={setSentimentAnalyze}
                    setSAvalue={setSAvalue}
                    stockInfo={true}
                    callApi={false}
                  />
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
StockInfo.displayName = "StockInfo";
export default React.memo(StockInfo);
