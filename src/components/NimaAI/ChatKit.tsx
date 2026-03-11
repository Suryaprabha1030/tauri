"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import AIResponseTable from "./AIResponseTable";
import { getBrokerCode } from "../helpers";
import RemoveButton from "../shared/ChartLayout/sidetoolbar/sharedContent/RemoveButton";
import { useDispatch, useSelector } from "react-redux";
import {
  setScreenerOpen,
  setToggleChart,
} from "@/lib/redux/slices/CommonSlice";
import {
  decryptChatLimitData,
  encryptChatLimitData,
  fetchSymbolPrices,
  getAllIndicesWithExpiryDetails,
  handleGenerate,
  sampleQuestions,
} from "./AIChat";
import { getJwtFromCookie } from "@/lib/util/cookies";
import LoginLimitPopup from "./LoginPopup";
import SearchInput from "./SearchBar";
import { ViewType } from "@/lib/util/toggleButtonName/toggleButtonNames";
import { RootState } from "@/lib/redux/Store";
import {
  getAllIndicesDataWithExpiry,
  setIsChatMode,
  setNimaGpt,
  setScreenerQuery,
} from "@/lib/redux/slices/screenerSlice";
import {
  consolidatedPositions,
  getUrlFromSavedImages,
} from "@/lib/util/Screenerutil/ScreenerUtil";

interface Message {
  role: string;
  text: string;
  duration?: number;
}

export default function AIScreener() {
  const token = getJwtFromCookie();
  const brokerCode = token ? getBrokerCode() : null; //  only when token exists
  const STORAGE_KEY = brokerCode
    ? `ai_screener_${brokerCode}`
    : `ai_screener_guest`;

  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [hoverImage, setHoverImage] = useState(true);
  const [previousChats, setPreviousChats] = useState<Message[][]>([]);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const [authSuccess, setAuthSuccess] = useState<boolean>(false);
  const [chatlimit, setChatLimit] = useState(0);
  const identifiersRef = useRef<Set<string>>(new Set());
  const [tableIdentifier, setTableIdentifier] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [fetchedIdentifiers, setFetchedIdentifiers] = useState<string[]>([]);
  const [strategyImageResult, setStrategyImageResult] = useState<
    {
      strategyName: string;
      image: string;
      fileType: string;
    }[]
  >([]);
  const ScreenerQuery: any = useSelector(
    (state: RootState) => state.Screener.screenerQuery,
  );
  const isChatMode: any = useSelector(
    (state: RootState) => state.Screener.isChatMode,
  );

  const screenerOpen: any = useSelector(
    (state: RootState) => state.common.ScreenerOpen,
  );
  const NimaGptType: any = useSelector(
    (state: RootState) => state.Screener.NimaGptType,
  );
  const streamingAssistantRef = useRef<Message | null>(null);

  const [showSuggestions, setShowSuggestions] = useState(true);
  const isSingleStockRef = useRef(false);
  const hasUnoStockRef = useRef(false);
  const hasIdentifierRef = useRef(false);
  const suggestions = [
    { text: "Analyze my portfolio", query: "portfolio" },
    { text: "Analyze my orders", query: "orders" },
    // { text: "Stock Screener", query: "" },
    { text: "F&O Analysis", query: "fno" },
    { text: "Market Research", query: "news" },
  ];
  const lastUpdatedPositions: any = useSelector(
    (state: RootState) => state.Screener.lastUpdatedpositions,
  );
  const lastUpdatedHoldings: any = useSelector(
    (state: RootState) => state.Screener.lastUpdatedholdings,
  );
  const selectedPositionType = useSelector(
    (state: RootState) => state.SimulationDemo.positionType,
  );
  const selectedHoldingsType = useSelector(
    (state: RootState) => state.SimulationDemo.holdingsType,
  );
  const positionsdata = useSelector(
    (state: RootState) => state.strategy.positions,
  );
  const positionPnl = useSelector(
    (state: RootState) => state.strategy.positionPnl,
  );
  const positionpnlpercent = useSelector(
    (state: RootState) => state.strategy.positionpnlpercent,
  );

  const holdingsdata: any = useSelector(
    (state: RootState) => state.strategy.holdingsData,
  );
  const simulatedOrders: any = useSelector(
    (state: RootState) => state.SimulationDemo.simulatedOrders,
  );
  const OrdersDemoEnabled = useSelector(
    (state: RootState) => state.SimulationDemo.ordersDemo,
  );
  const existing_conversation_id = localStorage.getItem(
    `${brokerCode}_conversation_id`,
  );
  const dispatch = useDispatch();
  //  Focus input when conversation completes or new message arrives
  const PositionsData = consolidatedPositions(
    positionsdata,
    positionPnl,
    positionpnlpercent,
  );

  useEffect(() => {
    if (ScreenerQuery != null && ScreenerQuery.length > 0) {
      dispatch(setIsChatMode(true));
      setAuthSuccess(true);

      setTimeout(() => {
        handleGenerate(
          ScreenerQuery,
          true,
          STORAGE_KEY,
          setMessages,
          setChatLimit,
          setLoading,
          setQuery,
          setPreviousChats,
          dispatch,
          streamingAssistantRef,
          NimaGptType,
          lastUpdatedPositions,
          lastUpdatedHoldings,
          selectedPositionType,
          selectedHoldingsType,
          PositionsData,
          holdingsdata,
          OrdersDemoEnabled,
          simulatedOrders,
          brokerCode,
        );
      }, 500);
    }
  }, [ScreenerQuery]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
      dispatch(setNimaGpt(""));
    }
  }, [messages, loading]);

  useEffect(() => {
    if (token) {
      setAuthSuccess(true);
    } else {
      setAuthSuccess(false);

      // Check guest limit from localStorage
      const encryptedLimit = localStorage.getItem("guest_limit");
      if (encryptedLimit) {
        const decrypted = decryptChatLimitData(encryptedLimit);
        if (decrypted) {
          setChatLimit(Number(decrypted));
        }
      }
    }
  }, [token]);
  const handleIdentifiersReady = (ids: string[]) => {
    setTableIdentifier((prev) => {
      const merged = new Set([...prev, ...ids]);
      return Array.from(merged);
    });
  };
  useEffect(() => {
    if (!loading && tableIdentifier?.length > 0) {
      // Find new identifiers that were not fetched before
      const newIds = tableIdentifier?.filter(
        (id) => !fetchedIdentifiers.includes(id),
      );
      if (newIds?.length > 0) {
        // Fetch only for new identifiers
        fetchSymbolPrices(brokerCode, newIds, dispatch);
        // Add these new ones to the fetched list
        setFetchedIdentifiers((prev) => [...prev, ...newIds]);
      }
    }
  }, [loading, tableIdentifier]);
  //  Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
  }, [messages]);

  // Load previous chats if brokerCode exists (authenticated mode)
  useEffect(() => {
    if (!brokerCode) return;
    const savedChats = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (savedChats.length > 0) {
      const flattenedMessages = savedChats.flat();
      setPreviousChats(savedChats);
      setMessages(flattenedMessages);
    }
  }, [brokerCode, screenerOpen]);

  const handleRemove = () => {
    dispatch(setScreenerOpen(false));
    dispatch(setToggleChart(ViewType.CANDLESTICK));
    dispatch(setScreenerQuery(""));
  };

  const handleSelect = (text: string, nimaGpt: string) => {
    setQuery(text);
    dispatch(setNimaGpt(nimaGpt));
    setShowSuggestions(false);
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 50);
  };

  useEffect(() => {
    let mounted = true;
    const loadImages = async () => {
      const images: any = await getUrlFromSavedImages();
      if (mounted) {
        setStrategyImageResult(images);
      }
    };
    loadImages();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className=" flex h-full w-full flex-col items-center bg-white py-1 transition-all duration-500  ">
      <div className="relative h-[100%] w-[100%]  bg-white px-6 transition-all duration-500 ">
        {/* Header */}
        {authSuccess && brokerCode && (
          <div className="flex w-[4rem] flex-row items-center gap-3 sm:max-md:w-[3.5rem] sm:max-md:gap-1 md:max-xl:w-[4.2rem] md:max-xl:pb-0.5">
            <RemoveButton
              additionStyle="top-[-1] pt-0  "
              onClick={handleRemove}
            />
          </div>
        )}
        {!isChatMode && (
          <div className="flex items-center space-x-3  py-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-z-green-100 max-sm:h-7 max-sm:w-7">
              <img
                src="/svg/sparkle.svg"
                width={30}
                height={30}
                alt="sparkle"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 max-sm:text-lg">
                NIMA AI
              </h1>
              <p className="text-sm text-gray-500 max-sm:text-[0.7rem]">
                Search in natural language
              </p>
            </div>
          </div>
        )}

        {/* Sample Prompts */}

        {!isChatMode && !existing_conversation_id && (
          <div className="mt-6   pb-32 max-sm:pb-5">
            <p className="mb-3 text-sm text-gray-600 max-sm:text-[0.85rem]">
              Try these examples
            </p>
            <div className="grid gap-3 max-sm:grid-cols-2 md:grid-cols-2">
              {sampleQuestions.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(item.text);
                    inputRef.current?.focus();
                  }}
                  className="hover:bg-z-green-50 flex flex-col items-start rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-sm text-gray-700 transition hover:border-z-green-500 hover:shadow-sm max-md:text-[0.75rem] max-sm:py-1 max-sm:text-[0.65rem]"
                >
                  <span className="mb-1 flex items-center gap-1 text-xs font-medium text-z-green-500">
                    <img
                      src="/svg/sparkle.svg"
                      width={20}
                      height={20}
                      alt="sparkle"
                    />
                    {item.tag}
                  </span>
                  {item.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages */}
        {isChatMode && (
          <div className="mt-4 flex h-[75%] w-full flex-col space-y-4 overflow-y-auto  p-2 scrollbar-none max-sm:h-[65%]">
            {messages?.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`relative max-w-[80%] rounded-2xl px-4 py-2 text-sm  shadow-md max-sm:text-[0.75rem] ${
                    m.role === "user"
                      ? "rounded-br-none bg-z-green-500 text-white"
                      : "rounded-bl-none bg-gray-50 text-gray-800"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <>
                      {/* <div> */}
                      <AIResponseTable
                        markdownTable={m.text}
                        setQuery={setQuery}
                        authSuccess={authSuccess}
                        identifiersRef={identifiersRef}
                        onIdentifiersReady={
                          // (ids: any) =>
                          // setTableIdentifier(ids)
                          handleIdentifiersReady
                        }
                        setTableIdentifier={setTableIdentifier}
                        setShowLoginPopup={setShowLoginPopup}
                        inputRef={inputRef}
                        loading={loading}
                        isSingleStockRef={isSingleStockRef}
                        hasUnoStockRef={hasUnoStockRef}
                        hasIdentifierRef={hasIdentifierRef}
                        strategyImageResult={strategyImageResult}
                      />
                      {m?.duration && m?.duration > 0 ? (
                        <div className="mt-1 flex items-end justify-end text-[0.7rem] text-gray-400">
                          {m?.duration}s
                        </div>
                      ) : (
                        <></>
                      )}
                      {/* </div> */}
                    </>
                  ) : (
                    <span className="whitespace-pre-wrap ">{m.text}</span>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-1 rounded-2xl bg-gray-100 px-3 py-2 text-sm text-gray-500">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 delay-150"></span>
                  <span className="h-2 w-2 animate-bounce rounded-full bg-gray-500 delay-300"></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Fixed Search Bar */}
        <div
          className={`absolute left-0 flex w-full justify-center px-6 py-10 ${showSuggestions && query.trim() === "" && token ? " bottom-4 max-md:bottom-[2.5rem] max-sm:bottom-[4.8rem]" : "bottom-4 "} max-sm:py-5`}
        >
          <div className="relative h-[4rem] w-full max-w-4xl">
            <div className="flex items-center  gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition focus-within:border-z-green-500 focus-within:ring-2 focus-within:ring-z-green-100">
              <SearchInput
                isChatMode={isChatMode}
                authSuccess={authSuccess}
                chatlimit={chatlimit}
                setShowLoginPopup={setShowLoginPopup}
                handleGenerate={handleGenerate}
                STORAGE_KEY={STORAGE_KEY}
                setMessages={setMessages}
                setChatLimit={setChatLimit}
                setLoading={setLoading}
                setQuery={setQuery}
                setPreviousChats={setPreviousChats}
                brokerCode={brokerCode}
                loading={loading}
                query={query}
                inputRef={inputRef}
                setShowSuggestions={setShowSuggestions}
                streamingAssistantRef={streamingAssistantRef}
              />
              <button
                onClick={() => {
                  if (!authSuccess && chatlimit >= 3) {
                    setShowLoginPopup(true);
                    return;
                  }
                  handleGenerate(
                    query,
                    authSuccess,
                    STORAGE_KEY,
                    setMessages,
                    setChatLimit,
                    setLoading,
                    setQuery,
                    setPreviousChats,
                    dispatch,
                    streamingAssistantRef,
                    NimaGptType,
                    lastUpdatedPositions,
                    lastUpdatedHoldings,
                    selectedPositionType,
                    selectedHoldingsType,
                    PositionsData,
                    holdingsdata,
                    OrdersDemoEnabled,
                    simulatedOrders,
                    brokerCode,
                  );
                }}
                onMouseEnter={() => setHoverImage(false)}
                onMouseLeave={() => setHoverImage(true)}
                disabled={loading || query?.length == 0}
                className={`flex items-center justify-between rounded-full border border-z-green-500 p-[0.1rem] text-[0.75rem] font-medium  transition ${!hoverImage ? "bg-z-green-500 text-white" : "bg-white text-z-green-500"} disabled:opacity-50`}
              >
                <img
                  src={
                    hoverImage ? "/svg/sendIcon.svg" : "/svg/sendIconWhite.svg"
                  }
                  width={25}
                  height={25}
                  alt="search"
                />
              </button>
            </div>
            {showSuggestions && query.trim() === "" && token && (
              <div className="mt-2 flex flex-row gap-1 max-xl:flex-wrap max-xl:gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    onMouseDown={() => handleSelect(s.text, s.query)}
                    className="flex items-center gap-2 rounded-md bg-gray-100 px-3 py-1.5 text-xs text-gray-700 transition hover:bg-gray-200 max-md:p-1 max-sm:text-[0.65rem]"
                  >
                    <span className="text-sm font-bold text-gray-500">+</span>
                    {s.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {showLoginPopup && (
        <LoginLimitPopup
          onClose={() => setShowLoginPopup(false)}
          chatLimit={chatlimit}
        />
      )}
    </div>
  );
}
