"use client";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateSymbolData } from "@/lib/redux/slices/StrategySlice";
import { setWebsocketOpen } from "@/lib/redux/slices/ChartsSlice";
import { Bar } from "recharts";
import { getJwtFromCookie } from "./util/cookies";
import { toast } from "react-toastify";
import { showCustomToast } from "@/components/shared/customToast";
import {
  setInitiateOrderToast,
  setToasterIdentifiers,
} from "./redux/slices/CommonSlice";

type SubscriptionItem = {
  subscriberUID: string;
  resolution: string;
  lastDailyBar: any;
  handlers: { id: string; callback: (bar: any) => void }[];
};
const channelToSubscription: any = new Map<string, SubscriptionItem>();

let worker: Worker | null = null;
if (typeof window !== "undefined") {
  worker = new Worker(
    new URL("../workers/websocketWorker.worker.ts", import.meta.url),
  );
}
const updateBuffer: Record<string, any> = {};
const timerMap: Record<string, NodeJS.Timeout> = {};

export function subscribeToSymbol(identifier: any) {
  if (!worker) {
    console.error("Worker is not initialized!");
    return;
  }
  const identifiers = Array.isArray(identifier) ? identifier : [identifier];
  worker.postMessage({
    type: "subscribe",
    payload: { identifier: identifiers },
  });
}

export function subscribeOnStream(
  symbolInfo: any,
  resolution: string,
  onRealtimeCallback: (bar: Bar) => void,
  subscriberUID: string,
  onResetCacheNeededCallback: () => void,
  lastDailyBar: Bar,
) {
  if (!worker) return;
  const channelString = symbolInfo.identifier;
  const handler = {
    id: subscriberUID,
    callback: onRealtimeCallback,
  };

  let subscriptionItem = channelToSubscription.get(channelString);
  subscriptionItem = {
    subscriberUID,
    resolution,
    lastDailyBar,
    handlers: [handler],
  };
  channelToSubscription.set(channelString, subscriptionItem);
  worker.postMessage({
    type: "subscribe",
    payload: { identifier: [channelString] },
  });
}

export function unsubscribeFromStream(subscriberUID: string) {
  if (!worker) return;
  for (const [
    channelString,
    subscriptionItem,
  ] of channelToSubscription?.entries()) {
    const handlerIndex = subscriptionItem.handlers.findIndex(
      (handler: any) => handler.id === subscriberUID,
    );

    if (handlerIndex !== -1) {
      subscriptionItem.handlers.splice(handlerIndex, 1);

      if (subscriptionItem.handlers.length === 0) {
        // worker.postMessage({
        //   type: "unsubscribe",
        //   payload: { identifier: [channelString] },
        // });

        channelToSubscription.delete(channelString);
      }
    }
  }
}
// Calculate next bar time
const getNextBarTime = (barTime: number, resolution: string) => {
  const date = new Date(barTime); // Convert UNIX timestamp to Date
  if (resolution.endsWith("D")) {
    // Daily resolution
    date.setUTCDate(date.getUTCDate() + (parseInt(resolution) || 1));
    date.setUTCHours(0, 0, 0, 0); // Align to 00:00 UTC
  } else if (resolution.endsWith("W")) {
    // Weekly resolution (move to next week's same day)
    date.setUTCDate(date.getUTCDate() + 7);
    date.setUTCHours(0, 0, 0, 0);
  } else if (resolution.endsWith("M")) {
    // Monthly resolution (move to next month's same date)
    date.setUTCMonth(date.getUTCMonth() + (parseInt(resolution) || 1));
    date.setUTCDate(1); // Set to first of the month to avoid month overflow
    date.setUTCHours(0, 0, 0, 0);
  } else {
    // Intraday resolution (in minutes)
    let minutes = parseInt(resolution) || 1;
    date.setUTCMinutes(date.getUTCMinutes() + minutes);
    date.setUTCSeconds(0, 0); // Ensure seconds reset to avoid mismatches
  }
  const nextTime = date.getTime();
  return nextTime > barTime ? nextTime : barTime + 1; // Ensure monotonic increase
};

const useWebSocket = (
  url: string,
  onConnectionStatusChange: (connected: boolean) => void,
) => {
  const [websocketError, setWebSocketError] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const dispatch = useDispatch();
  const [jwt, setJwt] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchJwt = async () => {
      // const token = await getJwtFromCookie();
      const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwidXNlcl9pZCI6MiwiZXhwIjoxNzczMzA1MjcwfQ.a3ov2Txlr-XLY6shqkWUAF1k3n2M9Gv423gqKEqIYy0`;
      if (token) {
        setJwt(token);
        clearInterval(intervalId); // Stop polling once JWT is available
      }
    };

    fetchJwt(); // Try fetching initially
    intervalId = setInterval(fetchJwt, 5000); // Retry every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);
  useEffect(() => {
    if (typeof window === "undefined" || !worker || jwt == undefined) return; // Prevent SSR execution
    if (!worker) return;
    const connectWebSocket = () => {
      if (!worker) return;
      // console.log("Connecting WebSocket...");
      worker.postMessage({ type: "connect", payload: { url, jwt } });
    };
    const handleOnline = () => {
      // console.log("Back online, reconnecting WebSocket...");
      connectWebSocket();
      onConnectionStatusChange(true);
    };

    const handleOffline = () => {
      // console.log("Connection lost, closing WebSocket...");
      onConnectionStatusChange(false);
      worker?.postMessage({ type: "disconnect" });
    };

    // Connect WebSocket on mount
    connectWebSocket();

    // Listen for online/offline events
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    worker.onmessage = (event) => {
      const { type, payload, id } = event.data;
      switch (type) {
        case "connected":
          setWebSocketError(false);
          dispatch(setWebsocketOpen(true));
          onConnectionStatusChange(true);
          break;

        case "disconnected":
          dispatch(setWebsocketOpen(false));
        case "error":
          setWebSocketError(true);
          dispatch(setWebsocketOpen(false));
          // onConnectionStatusChange(false);
          break;

        case "data":
          const symbol = payload.identifier;

          // Store the latest update in buffer
          updateBuffer[symbol] = {
            symbol,
            price: payload.ltp,
            change: payload.net_change,
            netpercentage: payload.net_change_percent,
          };

          // If a timer already exists for this symbol, do nothing (let it run)
          if (!timerMap[symbol]) {
            timerMap[symbol] = setTimeout(() => {
              // Dispatch latest buffered update
              dispatch(updateSymbolData(updateBuffer[symbol]));

              // Cleanup
              delete updateBuffer[symbol];
              clearTimeout(timerMap[symbol]);
              delete timerMap[symbol];
            }, 5); // delay before dispatch
          }
          const {
            ltp: tradePrice,
            // volume: tradeVolume,
            time: tradeTime,
            identifier,
          } = payload;
          const subscriptionItem = channelToSubscription.get(identifier);

          if (!subscriptionItem) return;

          let bar = { ...subscriptionItem.lastDailyBar };
          let nextBarTime = getNextBarTime(
            bar.time,
            subscriptionItem.resolution,
          );

          if (tradeTime * 1000 >= nextBarTime) {
            bar = {
              time: nextBarTime,
              open: tradePrice,
              high: tradePrice,
              low: tradePrice,
              close: tradePrice,
              // volume: tradeVolume || 0,
            };
          } else {
            bar.high = Math.max(bar.high, tradePrice);
            bar.low = Math.min(bar.low, tradePrice);
            bar.close = tradePrice;
            // bar.volume += tradeVolume || 0;
          }

          subscriptionItem.lastDailyBar = bar;
          subscriptionItem.handlers.forEach((handler: any) =>
            handler.callback(bar),
          );

          break;

        case "show-toast":
          if (id) {
            dispatch(setToasterIdentifiers(id));
          }
          // showCustomToast(payload?.title, payload?.message, payload?.details);
          dispatch(setInitiateOrderToast({ payload }));
          break;
        case "barUpdate":
          break;
      }
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [url, jwt]);

  return websocketError;
};

export default useWebSocket;
