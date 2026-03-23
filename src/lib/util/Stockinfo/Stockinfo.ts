import {
  NewsRouterApi,
  StockInfoAPIApi,
  UserBrokerRouterApi,
} from "@/lib/api/base";
import { autoLogoutTokenRemove } from "../autoLogoutUtil/autoLogOutUtil";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { setSymbolNewsData } from "@/lib/redux/slices/CommonSlice";
import { format } from "date-fns";
import { brokerLogoutTokenRemove } from "../autoLogoutUtil/brokerLogOutUtil";

export const getSymbolDetails = async (
  brokerCode: any,
  name: any,
  router: any
) => {
  const symbolDetails = new UserBrokerRouterApi(baseConfig());

  try {
    const res =
      await symbolDetails.getSymbolV1UsersMeBrokersBrokerCodeGetSymbolGet(
        brokerCode,
        name
      );
    return res?.data;
  } catch (err: any) {
    if (err?.response && err?.response?.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (err?.response && err?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }
  }
};
export const fetchChartData = async (
  symbol: string,
  selectedTimeframe: any,
  setChartData: any,
  brokerCode: any,
  router: any,
  symbolInfo: any
) => {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  let from;

  // Get previous day's timestamp
  const oneDayAgo = now - 24 * 60 * 60; // 1 day ago
  const oneMonthAgo = now - 30 * 24 * 60 * 60; // 1 month ago

  switch (selectedTimeframe) {
    case "5":
      from = oneDayAgo; // Set from to the same time yesterday
      break;
    case "15":
    case "30":
      from = now - 2 * 24 * 60 * 60; //two days
      break;
    case "1D":
      from = oneMonthAgo; // Set from to 30 days ago
      break;
    default:
      from = now - 7 * 24 * 60 * 60; // Default: last 7 days
  }

  const formData = {
    exchange: symbolInfo?.exchange,
    broker_identifier: symbolInfo?.identifier,
    interval: selectedTimeframe,
    from_date_ts: from,
    to_date_ts: now,
  };
  const symbolDetails = new UserBrokerRouterApi(baseConfig());
  symbolDetails
    .fetchCandleDataV1UsersMeBrokersBrokerCodeCandleDataPost(
      brokerCode,
      formData
    )
    .then((res) => {
      const formattedData = res?.data?.map((bar:any) => ({
        time: bar?.time, // Keep in milliseconds if TradingView expects it
        value: bar?.close, // Use closing price for line chart
        volume: bar?.volume,
        high: bar?.high,
        low: bar?.low,
      }));
      setChartData(formattedData);
    })
    .catch((err: any) => {
      if (err?.response && err?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      }
      if (err?.response && err?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
    });
};
export const fetchStockData = (
  setInfo: any,
  setQuaterlysheet: any,
  setIncomeStatement: any,
  setcashFlow: any,
  setbalanceSheet: any,
  symbol: any,
  router: any
) => {
  const fetchStockApi = new StockInfoAPIApi(baseConfig());
  fetchStockApi
    .getSymbolInfoSymbolInfoInfoGet(symbol)
    .then((response) => {
      if (response?.status == 204) {
        setInfo({});
        setQuaterlysheet({});
        setIncomeStatement({});
        setcashFlow({});
        setbalanceSheet({});
        return;
      }
      setInfo(response?.data?.info);
      setQuaterlysheet(response?.data?.quarterly_balance_sheet);
      setIncomeStatement(response?.data?.income_statement);
      setcashFlow(response?.data?.cashflow);
      setbalanceSheet(response?.data?.balance_sheet);
    })
    .catch((err: any) => {
      if (err?.response && err?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      }
      if (err?.response && err?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
      if (err?.response && err?.response?.status == 404) {
        setInfo({});
        setQuaterlysheet({});
        setIncomeStatement({});
        setcashFlow({});
        setbalanceSheet({});
      }
    });
};

export const fetchSymbolNews = (
  symbolName: any,
  dispatch: any,
  router: any
) => {
  const Allnews = new NewsRouterApi(baseConfig());
  const sanitizedSymbolName = symbolName?.replace(/\s+/g, "");
  Allnews.fetchSymbolV1NewsForSymbolIdentifierGet(sanitizedSymbolName)
    .then((res) => {
      dispatch(
        setSymbolNewsData({ symbol: sanitizedSymbolName, newsData: res?.data })
      );
    })
    .catch((err: any) => {
      if (err?.response && err?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      }
      if (err?.response && err?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
    });
};

export function formatToChartFullLabel(dateString: string): string {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  // Round minutes to nearest multiple of 5
  let minutes = Math.round(date.getMinutes() / 5) * 5;
  let hours = date.getHours();

  // Handle case where rounding goes to 60
  if (minutes === 60) {
    minutes = 0;
    hours = (hours + 1) % 24;
  }

  const hoursStr = String(hours).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");

  return `${day} ${month} ${year} ${hoursStr}:${minutesStr}`;
}

export function adjustToMarketTime(dateString: string | number) {
  const date = new Date(dateString);

  // Convert to IST (UTC +5:30)
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + istOffset);

  // Market open/close boundaries
  const marketOpen = new Date(istDate);
  marketOpen.setHours(9, 15, 0, 0);
  const marketClose = new Date(istDate);
  marketClose.setHours(15, 30, 0, 0);

  // Round minutes to nearest multiple of 5
  let minutes = Math.round(istDate.getMinutes() / 5) * 5;
  if (minutes === 60) {
    istDate.setHours(istDate.getHours() + 1);
    minutes = 0;
  }
  istDate.setMinutes(minutes, 0, 0);

  // Clamp within market hours
  if (istDate < marketOpen) istDate.setHours(9, 15, 0, 0);
  else if (istDate > marketClose) istDate.setHours(15, 30, 0, 0);

  // Output formatted versions
  return {
    istDate,
    formatted: format(istDate, "dd MMM yyyy HH:mm"),
    dateLabel: format(istDate, "dd MMM yyyy"),
  };
}

export const setupNewsInterval = (
  symbolName: string,
  fetchSymbolNews: Function,
  dispatch: any,
  router: any,
  setIntervalId: Function
) => {
  // Clear any previous intervals
  let intervalId: any;

  // Align to next 15-minute mark
  const now = new Date();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const millisecondsUntilNextFifteenMinutes =
    ((15 - (minutes % 15)) * 60 - seconds) * 1000;

  // Wait until next 15-minute mark
  const timeoutId = setTimeout(() => {
    fetchSymbolNews(symbolName, dispatch, router);

    // Start recurring 15-minute interval
    intervalId = setInterval(
      () => {
        fetchSymbolNews(symbolName, dispatch, router);
      },
      15 * 60 * 1000
    );

    setIntervalId(intervalId);
  }, millisecondsUntilNextFifteenMinutes);

  // Cleanup
  return () => {
    clearTimeout(timeoutId);
    if (intervalId) clearInterval(intervalId);
  };
};
