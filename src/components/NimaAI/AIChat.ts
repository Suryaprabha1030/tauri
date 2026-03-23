import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig} from "@/lib/api/baseConfiguration";
import {
  getAllIndicesDataWithExpiry,
  setIsChatMode,
  setNimaGpt,
} from "@/lib/redux/slices/screenerSlice";
import { setScreenerOpen } from "@/lib/redux/slices/CommonSlice";
import { setOiChartCall } from "@/lib/redux/slices/PayoffChartSlice";
import {
  addSymbol,
  getIndexName,
  setStock,

} from "@/lib/redux/slices/StrategySlice";
import { strategyApiDataDetails } from "@/lib/util/StrategyAnalyzerUtil/StrategyAnalyerUtil";
import CryptoJS from "crypto-js";
import {
  setStockData,
  togglePlaceOrderVisibility,
} from "@/lib/redux/slices/PlaceOrder";
import { Dispatch } from "react";
import { Action } from "redux";
import config from "@/lib/config";
import { getJwtFromCookie } from "@/lib/util/cookies";
import {
  fetchFnoData,
  fetchHoldingsPositions,
  fetchNewsData,
  fetchOrdersData,
} from "@/lib/util/Screenerutil/ScreenerUtil";
import {
  setChartIconClicked,
  setChartPanel,
} from "@/lib/redux/slices/ChartsSlice";
export const sampleQuestions = [
  {
    tag: "Growth",
    text: "Growth stocks with revenue > 1Cr and YoY growth > 25%",
  },
  {
    tag: "Value",
    text: "Undervalued tech stocks with P/E < 15 and strong cash flow",
  },
  {
    tag: "Momentum",
    text: "High momentum stocks hitting 52-week highs with volume > 10M",
  },
  {
    tag: "Discovery",
    text: "Small caps in healthcare with increasing institutional ownership",
  },
];

const SECRET_KEY = "z_ai_screener_secret_key";

export const encryptChatLimitData = (data: string) => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptChatLimitData = (cipherText: string) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return null;
  }
};
interface Message {
  role: string;
  text: string;
  duration?: number;
}

const saveChat = (
  userMsg: Message,
  assistantMsg: Message,
  setPreviousChats: React.Dispatch<React.SetStateAction<any>>,
  STORAGE_KEY: any,
  brokerCode?: any
) => {
  if (!brokerCode) return;
  const newChatPair = [userMsg, assistantMsg];
  const savedChats = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const updatedChats = [...savedChats, newChatPair].slice(-5);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedChats));
  setPreviousChats(updatedChats);
};

const ReadymadeStrategies = [
  "Long Call",
  "Short Put",
  "Bull Call Spread",
  "Bull Put Spread",
  "Call Ratio Back Spread",
  "Bull Condor",
  "Bull Fly",
  "Range Forward",
  "Long Combo",
  "Long Synthetic Future",
  "Short Call",
  "Long Put",
  "Bear Call Spread",
  "Bear Put Spread",
  "Put Ratio Back Spread",
  "Bear Condor",
  "Bear Fly",
  "Short Combo",
  "Short Synthetic Future",
  "Short Straddle",
  "Long Straddle",
  "Short Strangle",
  "Long Strangle",
  "Iron Condor",
  "Iron Fly",
  "Batman",
  "Short Guts",
];
export function detectNimaGptType(q: string) {
  const query = q.toLowerCase();

  if (
    ["best stocks", "screen", "fy", "roe", "pe"].some((k) => query.includes(k))
  )
    return "screener";

  if (
    ["fno", "futures", "options", "derivatives", "option chain", "greeks"].some(
      (k) => query.includes(k)
    )
  )
    return "fno";

  if (
    ["news", "today", "latest", "headlines", "market update"].some((k) =>
      query.includes(k)
    )
  )
    return "news";

  if (
    ["place order", "buy", "sell", "journal", "orders"].some((k) =>
      query.includes(k)
    )
  )
    return "orders";

  if (
    ["portfolio", "holdings", "rebalance", "allocation", "positions"].some(
      (k) => query.includes(k)
    )
  )
    return "portfolio";

  if (
    [
      "strategies",
      "strategy",
      "option analysis",
      "pay off",
      "straddle",
      "strangle",
      "butterfly",
      "condor",
    ].some((k) => query.includes(k)) ||
    ReadymadeStrategies.some((s) => query.includes(s.toLowerCase()))
  )
    return "strategies";

  return "screener";
}

export const handleGenerate = async (
  query: any,
  authSuccess: boolean,
  STORAGE_KEY: any,
  setMessages: React.Dispatch<React.SetStateAction<any>>,
  setChatLimit: React.Dispatch<React.SetStateAction<any>>,
  setLoading: React.Dispatch<React.SetStateAction<any>>,
  setQuery: React.Dispatch<React.SetStateAction<any>>,
  setPreviousChats: React.Dispatch<React.SetStateAction<any>>,
  dispatch: any,
  streamingAssistantRef: any,
  NimaGpt: string,
  lastUpdatedPositions: any,
  lastUpdatedHoldings: any,
  SelectedPositionsType: string,
  SelectedHoldingsType: string,
  DemoPositions: any,
  DemoHoldings: any,
  ordersDemo: boolean,
  DemoOrdersData: any,
  brokerCode?: any,
  queryText?: string
) => {
  let finalQuery = queryText || query;
  if (!finalQuery?.trim()) return;

  if (!NimaGpt) {
    NimaGpt = detectNimaGptType(finalQuery);
  }
  if (!authSuccess) {
    // Guest limit handling
    const encryptedLimit = localStorage.getItem("guest_limit");
    const currentLimit = encryptedLimit
      ? Number(decryptChatLimitData(encryptedLimit))
      : 0;

    if (currentLimit >= 3) {
      setMessages((prev:any) => [
        ...prev,
        {
          role: "assistant",
          text: "You’ve reached the limit of 3 queries. Please log in to continue using AI Screener.",
        },
      ]);
      return;
    }

    const newLimit = currentLimit + 1;
    localStorage.setItem(
      "guest_limit",
      encryptChatLimitData(newLimit.toString())
    );
    setChatLimit(newLimit);
  }

  let finalInput = query;
  const token = getJwtFromCookie();
  const pushAssistantMessage = (text: string) => {
    const userMessage: Message = { role: "user", text: finalQuery };
    setMessages((prev:any) => [...prev, userMessage]);
    if (!queryText) setQuery("");
    setMessages((prev:any) => [...prev, { role: "assistant", text }]);
    dispatch(setIsChatMode(true));
  };
  switch (NimaGpt) {
    case "orders": {
      const ordersData = await fetchOrdersData(
        brokerCode,
        token,
        ordersDemo,
        DemoOrdersData
      );

      if (ordersData?.error === "connect_broker") {
        pushAssistantMessage("Please connect your broker to continue.");
        return;
      }

      if (!ordersData || Object.keys(ordersData)?.length === 0) {
        pushAssistantMessage("You don’t have any orders.");
        return;
      }

      finalInput = ordersData;
      break;
    }

    case "news": {
      const newsData = await fetchNewsData(token);
      if (newsData?.error === "login required") {
        pushAssistantMessage("Please log in to view the latest market news.");
        return;
      }
      if (!newsData || !newsData?.News || newsData?.News?.length === 0) {
        pushAssistantMessage("No market news available. Try again later.");
        return;
      }

      finalInput = newsData;
      break;
    }

    case "fno": {
      const upperQuery = query.toUpperCase();

      const sortedIndices = Object.keys(config.OIindices).sort(
        (a, b) => b.length - a.length
      );

      const matchedIndex = sortedIndices?.find((index) =>
        upperQuery.includes(index)
      );

      const indexIdentifier = matchedIndex
        ? matchedIndex
        : config.NimaFnoSymbol;

      const fnoData = await fetchFnoData(brokerCode, indexIdentifier);

      if (fnoData?.error === "connect_broker") {
        pushAssistantMessage("Please connect your broker to continue.");
        return;
      }

      if (!fnoData) {
        pushAssistantMessage("Something went wrong. Try again later.");
        return;
      }

      finalInput = fnoData;
      break;
    }

    case "portfolio": {
      const holdingsData = await fetchHoldingsPositions(
        brokerCode,
        token,
        lastUpdatedPositions,
        lastUpdatedHoldings,
        SelectedPositionsType,
        SelectedHoldingsType,
        DemoPositions,
        DemoHoldings
      );

      if (holdingsData?.error === "connect_broker") {
        pushAssistantMessage("Please connect your broker to continue.");
        return;
      }

      const noHoldings =
        (!holdingsData?.holdings?.holdings ||
          holdingsData?.holdings?.holdings === null) &&
        Array.isArray(holdingsData?.positions?.positions) &&
        holdingsData?.positions?.positions?.length === 0;

      if (noHoldings) {
        pushAssistantMessage("You don’t have positions and holdings.");
        return;
      }

      if (!holdingsData) {
        pushAssistantMessage("Something went wrong. Try again later.");
        return;
      }
      const response: any = {};

      const holdings = holdingsData?.holdings;
      const positions = holdingsData?.positions;

      // attach holdings ONLY if array exists + not empty
      if (Array.isArray(holdings?.holdings) && holdings?.holdings?.length > 0) {
        response.holdings = holdings;
      }

      // attach positions ONLY if array exists + not empty
      if (
        Array.isArray(positions?.positions) &&
        positions?.positions?.length > 0
      ) {
        response.positions = positions;
      }

      //  both missing
      if (!response.holdings && !response.positions) {
        pushAssistantMessage("You don’t have positions and holdings.");
        return;
      }
      finalInput = response;
      break;
    }

    default:
      finalInput = query;
  }

  dispatch(setIsChatMode(true));
  setLoading(true);
  const userMessage: Message = { role: "user", text: finalQuery };
  setMessages((prev:any) => [...prev, userMessage]);
  if (!queryText) setQuery("");

  const startTime = performance.now();
  let firstChunkReceived = false;

  try {
    const isSimpleQuery = NimaGpt === "screener";
    const isConcatQuery = ["portfolio", "orders"].includes(NimaGpt);
    const existing_conversation_id = localStorage.getItem(
      `${brokerCode}_conversation_id`
    );
    const finalConversationId = existing_conversation_id
      ? existing_conversation_id
      : crypto.randomUUID();

    const payload = isSimpleQuery
      ? { query: finalQuery, conversation_id: finalConversationId }
      : isConcatQuery
        ? {
            query: finalQuery,
            ...finalInput,
            conversation_id: finalConversationId,
          }
        : {
            gpt: NimaGpt,
            query: finalInput,
          };

    const response =
      isSimpleQuery || isConcatQuery
        ? await fetch(`${config.nimaAPIUrl}/screener`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          })
        : await fetch(`${config.nimaAPIUrl}/route/stream`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

    if (!response.ok || !response.body) {
      const assistantMessage: Message = {
        role: "assistant",
        text: "Something went wrong. Please try again.",
        duration: 0,
      };
      setMessages((prev:any) => [...prev, assistantMessage]);
      setLoading(false);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let assistantMessage: Message | null = null;

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split(/\r?\n/);
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data:")) continue;

        let payload;
        try {
          payload = JSON.parse(line.slice(5).trim());
        } catch {
          continue; // ignore partial/malformed lines
        }

        // First token triggers creating the assistant message
        if (payload.type === "token") {
          if (!firstChunkReceived && payload.value.trim().length > 0) {
            firstChunkReceived = true;

            assistantMessage = {
              role: "assistant",
              text: payload.value,
              duration: Number(
                ((performance.now() - startTime) / 1000).toFixed(1)
              ),
            };

            streamingAssistantRef.current = assistantMessage;
            setMessages((prev:any) => [...prev, { ...assistantMessage }]);
          } else if (assistantMessage) {
            assistantMessage.text += payload.value;
            setMessages((prev:any) => [
              ...prev.slice(0, -1),
              { ...assistantMessage },
            ]);
          }
        }
        if (payload.conversation_id) {
          localStorage.setItem(
            `${brokerCode}_conversation_id`,
            payload.conversation_id
          );
        }

        if (payload.type === "workflow_completed") {
          if (assistantMessage) {
            // Append any remaining buffer (optional)
            if (buffer.trim()) {
              assistantMessage.text += buffer;
              setMessages((prev:any) => [
                ...prev.slice(0, -1),
                { ...assistantMessage },
              ]);
            }
          }

          setLoading(false);
          dispatch(setNimaGpt(""));
          if (brokerCode && assistantMessage) {
            streamingAssistantRef.current = null;
            saveChat(
              userMessage,
              assistantMessage,
              setPreviousChats,
              STORAGE_KEY,
              brokerCode
            );
          }

          return; // streaming finished
        }
      }
    }
  } catch (err) {
    setMessages((prev:any) => [
      ...prev,
      { role: "assistant", text: "Something went wrong. Please try again." },
    ]);
    setLoading(false);
  }
};

export const fetchSymbolPrices = async (
  identifiersList:any,
  dispatch:any
) => {
  try {
    const items = identifiersList;
    if (items) {
      items?.forEach((item: any) => {
        dispatch(
          addSymbol({
            symbol: item,
          })
        );
      });
    }
  } catch (error) {
    console.error("Error fetching symbol prices:", error);
  }
};

export const getAllIndicesWithExpiryDetails = async (
  brokerCode: any,
  dispatch: any
) => {
  const getAllIndices = new UserBrokerRouterApi(baseConfig());
  try {
    const Response =
      await getAllIndices.getAllIndicesWithExpV1UsersMeBrokersBrokerCodeGetAllIndicesWithExpPost(
        brokerCode
      );
    dispatch(getAllIndicesDataWithExpiry(Response?.data));
    return Response?.data ?? [];
  } catch (error) {
    console.log(error);
  }
};

export async function getIndexDetails(
  indexName: string,
  brokerCode: any,
  dispatch: Dispatch<any>,
  IndexDetails: any[]
) {
  let indicesList = IndexDetails;

  if (!indicesList || indicesList.length === 0) {
    indicesList = await getAllIndicesWithExpiryDetails(brokerCode, dispatch);
    dispatch(getAllIndicesDataWithExpiry(indicesList));
  }

  if (!indicesList || !Array.isArray(indicesList)) return null;

  return indicesList.find(
    (item) => item.index_name.toUpperCase() === indexName.toUpperCase()
  );
}

// Ensure tooltip stays within parent bounds
export const adjustTooltipPosition = (
  x: number,
  y: number,

  parentRef:any
) => {
  const parentRect = parentRef.current?.getBoundingClientRect();
  const tooltipWidth = 160;
  const tooltipHeight = 40;
  if (!parentRect) return { x, y };

  const minX = 8;
  const minY = 8;
  const maxX = parentRect.width - tooltipWidth - 16;
  const maxY = parentRect.height - tooltipHeight + 8;

  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, minY), maxY),
  };
};

export const AIstrategyDisplay = (
  strategy: string,
  brokerCode: any,
  path: any,
  strategyLots: any,
  item: any,
  dispatch: any,
  router: any,
  positionDatas: any,
  futureDatas: any,
  allStrategyData: any,
  optionDatas: any,
  indexName: any,
  expiryDate: any
) => {
  // router.push(`${config.brokersListUrl}/${brokerCode}/psb`);
  dispatch(getIndexName({ indexName: indexName, expiryDate: expiryDate }));
  if (Object.keys(optionDatas)?.length == 0) {
    dispatch(setOiChartCall(true));
  }
  strategyApiDataDetails(
    strategy,
    brokerCode,
    path,
    strategyLots,
    item,
    dispatch,
    router,
    positionDatas,
    futureDatas,
    allStrategyData,
    true
  );

  dispatch(setScreenerOpen(false));
};

export const fetchIndexDetails = async (
  selectedIndex: any,
  brokerCode: any,
  selectedStrategy: any,
  path: any,
  webSocketDataRead: any,
  dispatch: Dispatch<any>,
  router: any,
  positionDatas: any,
  futureDatas: any,
  allStrategyDetail: any,
  optionDatas: any,
  IndexDetails: any
) => {
  const indexName = selectedIndex?.toUpperCase() || "NIFTY";
  const indexDetails = await getIndexDetails(
    indexName,
    brokerCode,
    dispatch,
    IndexDetails
  );
  if (!indexDetails) return;

  const [exchange] = indexDetails?.identifier.split(":");
  const monthMap: Record<string, number> = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
  };

  const parseExpiry = (s: string) => {
    const day = parseInt(s.slice(0, 2), 10);
    const month = monthMap[s.slice(2, 5)];
    const year = parseInt(s.slice(5), 10);
    return new Date(year, month, day);
  };
  const index = IndexDetails.find(
    (i: any) => i?.index_name.toUpperCase() === indexName.toUpperCase()
  );
  if (!index || !index?.expiries?.length) return "";

  const sortedExpiries = [...index.expiries].sort(
    (a, b) => parseExpiry(a).getTime() - parseExpiry(b).getTime()
  );
  const nearestExpiry = sortedExpiries?.length > 0 ? sortedExpiries[0] : "";

  AIstrategyDisplay(
    selectedStrategy,
    brokerCode,
    path,
    indexDetails?.lot_size,
    {
      exchange,
      index_name: indexDetails?.index_name,
      spot_price: webSocketDataRead?.[indexDetails?.identifier] ?? 0,
      expiryDate: nearestExpiry,
    },
    dispatch,
    router,
    positionDatas,
    futureDatas,
    allStrategyDetail,
    optionDatas,
    indexDetails?.index_name,
    nearestExpiry
  );
  dispatch(
    setStock({
      stock: {
        exchange: exchange,
        index_name: indexName,
        spot_price: webSocketDataRead?.[indexDetails?.identifier] ?? 0,
      },
    })
  );
  dispatch(setChartIconClicked(false));
  dispatch(setChartPanel(false));
};

export const handleStockTransaction = (
  symbol: any,
  Transaction: "LONG" | "SHORT",
  webSocketDataRead: any,
  dispatch: Dispatch<Action>
) => {
  const identifier = symbol?.identifier?.replace("-", ":");
  const exchange = identifier?.split(":")[0];
  const stock = {
    ...symbol,
    identifier: identifier,
    transaction_type: Transaction,
    ltp: webSocketDataRead[identifier],
    index_name: symbol?.identifier?.split("-")[1] || symbol?.symbol || "",
    lot_size: 1,
    expiry: "",
    option_type: null,
    symbol_type: "equity",
    symbol: symbol?.symbol,
    exchange: exchange,
  };
  dispatch(togglePlaceOrderVisibility(true)); // draggable component redux
  dispatch(setStockData([stock]));
};
