import axios from "axios";
import { ResolutionString } from "../../../../public/static/charting_library/charting_library";
import { subscribeOnStream, unsubscribeFromStream } from "@/lib/websocket";
import { format } from "date-fns";
import config from "@/lib/config";
import { getBrokerCode, getBrokerName } from "../../../components/helpers";
import { getJwtFromCookie } from "@/lib/util/cookies";
import { autoLogoutTokenRemove } from "../autoLogoutUtil/autoLogOutUtil";
import { getGlobalSymbolNewsData } from "@/lib/OItoggleExpiry";
import { fetchNewsMarks, groupNewsByTime } from "../sideToolBar/news/fetchNews";
import { brokerLogoutTokenRemove } from "../autoLogoutUtil/brokerLogOutUtil";

const lastBarsCache = new Map();
const url = config.apiUrl;
const accessToken = getJwtFromCookie();
const configurationData = {
  supported_resolutions: [
    "1",
    "3",
    "5",
    "15",
    "30",
    "60",
    // "120",
    // "240",
    "D",
    "1W",
    "1M",
  ],

  exchanges: [
    { value: "NSE", name: "NSE", desc: "NSE" },
    { value: "BSE", name: "BSE", desc: "BSE" },
  ],
  // index_options, indices, index_futures, stock_futures, index_options, equities
  symbols_types: [
    { name: "Stocks", value: "equities" },
    { name: "Indices", value: "indices" },
    { name: "Index Options", value: "index_options" },
    { name: "Stocks Options", value: "stock_options" },
    { name: "Stocks Futures", value: "stock_futures" },
    { name: "Index Futures", value: "index_futures" },
  ],
};

// Types for symbols and responses
interface Symbol {
  symbol: string;
  ticker: string;
  description: string;
  exchange: string;
  type: string;
  identifier: string;
  symbol_type: string;
}

interface SymbolInfo {
  ticker: string;
  name: string;
  description: string;
  type: string;
  session: string;
  timezone: string;
  exchange: string;
  minmov: number;
  pricescale: number;
  has_intraday: boolean;
  visible_plots_set: string;
  has_weekly_and_monthly: boolean;
  supported_resolutions: string[];
  volume_precision: number;
  data_status: string;
  identifier: string;
  symbol_type: string;
}

interface Bar {
  time: number;
  low: number;
  high: number;
  open: number;
  close: number;
  volume: number;
}
let dynamicSupportedResolutions: string[] = [];
const emptyResponseCounter = new Map<string, number>();
const MAX_EMPTY_ATTEMPTS = 5;

export const chart_datafeed = {
  onReady: (callback: (data: typeof configurationData) => void) => {
    //   // console.log("[onReady]: Method call");
    //   setTimeout(() => callback(configurationData));

    const brokerName = getBrokerName();

    dynamicSupportedResolutions = [
      "1",
      "3",
      "5",
      "15",
      "30",
      "60",
      // "120",
      // "240",
      "D",
      "1W",
      "1M",
    ];

    // if (brokerName.toLowerCase() !== "fyers") {
    //   dynamicSupportedResolutions.push("D");
    // }

    const updatedConfiguration = {
      ...configurationData,
      // supported_resolutions: dynamicSupportedResolutions,
      supports_timescale_marks: true,
    };

    setTimeout(() => callback(updatedConfiguration));
  },

  searchSymbols: async (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResultReadyCallback: (symbols: Symbol[]) => void
  ) => {
    try {
      const payload = {
        exchange: exchange,
        search_symbol: userInput,
        search_symbol_type: symbolType,
      };
      if (
        typeof userInput !== "string" ||
        userInput.trim() === "" ||
        userInput.trim().length < 2
      ) {
        console.error("Invalid userInput. It must be a non-empty string.");
        return "l";
      }

      const symbols = await axios.post(
        `${url}/v1/users/me/brokers/${getBrokerCode()}/search_symbol`,
        payload,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${getJwtFromCookie()}`,
          },
        }
      );
      // console.log(symbols);
      const newSymbols = symbols.data.filter((symbol: any) => {
        const isFullSymbolContainsInput =
          symbol.identifier.toLowerCase().indexOf(userInput.toLowerCase()) !==
          -1;
        // console.log(symbol.identifier,"sym")
        // console.log(userInput ,"userInput")
        // console.log(isFullSymbolContainsInput)
        return isFullSymbolContainsInput;
      });
      onResultReadyCallback(newSymbols);
    } catch (error: any) {
      if (error?.response && error?.response?.status == 401) {
        autoLogoutTokenRemove(null);
      }
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(null);
      }
    }
  },

  resolveSymbol: async (
    symbolName: string,
    onSymbolResolvedCallback: (symbolInfo: SymbolInfo) => void,
    onResolveErrorCallback: (error: string) => void,
    extension: any,
    exchange: string
  ) => {
    // console.log(
    //   "[resolveSymbol]: Method call",
    //   symbolName,
    //   extension,
    //   exchange
    // );
    // const symbols = await getAllSymbols();
    try {
      if (getBrokerCode() != null) {
        const symbol_result = await axios.get(
          `${url}/v1/users/me/brokers/${getBrokerCode()}/get_symbol?name=${symbolName}`,
          // const symbol_result  = await axios.get(`https://zoonest.pagekite.me/v1/users/me/brokers/${ getBrokerCode()}/get_symbol?name=`+symbolName,
          {
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${getJwtFromCookie()}`,
            },
          }
        );

        let symbol: Symbol = {
          symbol: symbol_result.data.symbol,
          ticker: symbol_result.data.identifier,
          description: symbol_result.data.symbol,
          exchange: symbol_result.data.exchange,
          type: symbol_result.data.instrument_type,
          identifier: symbol_result.data.identifier,
          symbol_type: symbol_result.data.symbol_type,
        };
        // const symbolItem = symbols.find(({ identifier, symbol }) => (identifier === symbolName || symbol === symbolName));
        const symbolItem =
          symbol.identifier === symbolName || symbol.symbol === symbolName
            ? symbol
            : "";
        if (!symbolItem) {
          // console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
          onResolveErrorCallback("Cannot resolve symbol");
          return;
        }
        // Symbol information object
        const symbolInfo: SymbolInfo = {
          ticker: symbolItem.ticker,
          name: symbolItem.symbol,
          description: symbolItem.description,
          type: symbolItem.type,
          session: "0915-1530:1234567",
          timezone: "Asia/Kolkata",
          exchange: symbolItem.exchange,
          minmov: 1,
          pricescale: 100,
          has_intraday: true,
          visible_plots_set: "ohlc",
          has_weekly_and_monthly: false,
          supported_resolutions: dynamicSupportedResolutions,
          volume_precision: 2,
          data_status: "streaming",
          identifier: symbolItem.identifier,
          symbol_type: symbolItem.symbol_type,
        };

        // console.log('[resolveSymbol]: Symbol resolved', symbolName);
        onSymbolResolvedCallback(symbolInfo);
      }
    } catch (error: any) {
      if (error?.response && error?.response?.status == 401) {
        autoLogoutTokenRemove(null);
      }
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(null);
      }
    }
  },

  getBars: async (
    symbolInfo: SymbolInfo,
    resolution: string,
    periodParams: {
      from: number;
      to: number;
      firstDataRequest: boolean;
      countBack: number;
    },
    onHistoryCallback: (bars: Bar[], meta: { noData: boolean }) => void,
    onErrorCallback: (error: string) => void
  ) => {
    // const { from, to, firstDataRequest, countBack } = periodParams;
    let { from, to, firstDataRequest, countBack } = periodParams;
    //  Limit 1D resolution to max 365 days
    //  Limit range based on resolution
    if (resolution === "1D" || resolution === "D") {
      const maxRangeInSeconds = 365 * 24 * 60 * 60; // 1 year
      const actualRange = to - from;

      if (actualRange > maxRangeInSeconds) {
        from = to - maxRangeInSeconds;
      }
    } else if (resolution === "1W" || resolution === "W") {
      const maxWeeks = 104; // 2 years
      const maxRangeInSeconds = maxWeeks * 7 * 24 * 60 * 60;
      const actualRange = to - from;

      if (actualRange > maxRangeInSeconds) {
        from = to - maxRangeInSeconds;
      }
    } else if (resolution === "1M" || resolution === "M") {
      const maxMonths = 60; // 5 years
      const maxRangeInSeconds = maxMonths * 30 * 24 * 60 * 60;
      const actualRange = to - from;

      if (actualRange > maxRangeInSeconds) {
        from = to - maxRangeInSeconds;
      }
    }

    let from_date: any = new Date(from * 1000); // Convert Unix time (seconds) to milliseconds
    from_date = format(from_date, "yyyy-MM-dd HH:mm:ss");
    let to_date: any = new Date(to * 1000); // Convert Unix time (seconds) to milliseconds
    to_date = format(to_date, "yyyy-MM-dd HH:mm:ss");
    const symbolKey = symbolInfo.identifier;
    const parsedSymbol = symbolInfo.ticker; // token
    const formData = {
      exchange: symbolInfo.exchange,
      // token: parsedSymbol,
      broker_identifier: symbolInfo.identifier,
      interval: resolution,
      from_date_ts: from,
      to_date_ts: to,
      //  "from_date": "2024-06-01 11:15",
      //  "to_date": "2024-07-01 11:15"
    };

    try {
      const data = await axios.post(
        `${url}/v1/users/me/brokers/${getBrokerCode()}/candle_data`,
        formData,
        {
          headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${getJwtFromCookie()}`,
          },
          validateStatus: (status) => true, // Allow manual handling of all status codes
        }
      );
      if (data.status === 401) {
        autoLogoutTokenRemove(null);
        return;
      }
      if (data.status === 456) {
        brokerLogoutTokenRemove(null);
        return;
      }

      if (data.status === 204) {
        // No Content, definitely no data
        onHistoryCallback([], { noData: true });
        return;
      }
      const barsData = data.data;

      if (!Array.isArray(barsData) || barsData.length === 0) {
        // Increment empty count
        const count = emptyResponseCounter.get(symbolKey) || 0;
        emptyResponseCounter.set(symbolKey, count + 1);

        if (count + 1 >= MAX_EMPTY_ATTEMPTS) {
          onHistoryCallback([], { noData: true }); // Now finally stop
        } else {
          onHistoryCallback([], { noData: false }); // Keep trying
        }
        return;
      }

      // Reset empty count on valid data
      emptyResponseCounter.set(symbolKey, 0);

      let bars: Bar[] = [];
      data.data.forEach((bar: any) => {
        if (bar.time >= from && bar.time < to) {
          let bar_time: any = new Date(bar.time * 1000); // Convert Unix time (seconds) to milliseconds
          bar_time = format(bar_time, "yyyy-MM-dd HH:mm:ss");
          // console.log("websocket getBars",resolution, bar_time, bar.open, bar.high, bar.low, bar.close)
          bars = [
            ...bars,
            {
              time: bar.time * 1000,
              low: bar.low,
              high: bar.high,
              open: bar.open,
              close: bar.close,
              volume: bar.volume,
            },
          ];
        }
      });
      if (firstDataRequest) {
        lastBarsCache.set(symbolInfo.identifier, { ...bars[bars.length - 1] });
      }

      onHistoryCallback(bars, { noData: false });
    } catch (error: any) {
      if (error?.response && error?.response?.status == 401) {
        autoLogoutTokenRemove(null);
      }
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(null);
      }
      onErrorCallback(error);
    }
  },
  getTimescaleMarks(
    symbolInfo: any,
    startTime: number,
    endTime: number,
    onDataCallback: any,
    resolution: string
  ) {
    const allNewsData = getGlobalSymbolNewsData();
    const symbol = symbolInfo.ticker;
    const symbolData = allNewsData?.[symbol];
    const newsData = symbolData?.news || [];

    // Skip marks if random = true
    if (symbolData?.random) {
      onDataCallback([]);
      return;
    }

    // Decide grouping strategy
    const isDailyOrAbove = [
      "15",
      "30",
      "60",
      "1D",
      "D",
      "1W",
      "W",
      "1M",
      "M",
    ].includes(resolution.toUpperCase());

    // Group news
    const groupedNews: Record<string, any[]> = {};
    for (const item of newsData) {
      const publishedAt = new Date(item.published_at);

      // If resolution >= 1D → group by calendar date (ignore time)
      const groupKey = isDailyOrAbove
        ? publishedAt.toISOString().split("T")[0] // yyyy-mm-dd
        : Math.floor(publishedAt.getTime() / 1000).toString(); // exact timestamp in seconds

      if (!groupedNews[groupKey]) groupedNews[groupKey] = [];
      groupedNews[groupKey].push(item);
    }

    //  Build one mark per group (timestamp or date)
    const marks = Object.entries(groupedNews).map(([key, items], idx) => {
      // For daily grouping, convert date (yyyy-mm-dd) to timestamp (at 00:00)
      const time = isDailyOrAbove
        ? Math.floor(new Date(key).getTime() / 1000)
        : Number(key);

      return {
        id: idx.toString(),
        time,
        color: "#4CA856",
        imageUrl: `/svg/flash.svg`,
        tooltip: items.map((n) => `${n.title}`),
      };
    });

    onDataCallback(marks);
  },
  subscribeBars: (
    symbolInfo: SymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: any,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void
  ) => {
    // console.log(
    //   "[subscribeBars]: Method call with subscriberUID:",
    //   subscriberUID,
    //   symbolInfo.identifier,
    //   lastBarsCache
    // );
    subscribeOnStream(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberUID,
      onResetCacheNeededCallback,
      lastBarsCache.get(symbolInfo.identifier)
    );
  },

  unsubscribeBars: (subscriberUID: string) => {
    // Implement unsubscription logic here
    unsubscribeFromStream(subscriberUID);
    // console.log(
    //   "[unsubscribeBars]: Method call with subscriberUID:",
    //   subscriberUID
    // );
  },
};
