// import { io } from "socket.io-client";
// // import { parseFullSymbol } from './helpers';

// interface SubscriptionItem {
//   subscriberUID: string;
//   resolution: string;
//   lastDailyBar: Bar;
//   handlers: Handler[];
// }

// interface Handler {
//   id: string;
//   callback: (bar: Bar) => void;
// }

// interface Bar {
//   time: number;
//   open: number;
//   high: number;
//   low: number;
//   close: number;
// }

// interface SymbolInfo {
//   exchange: string;
//   name: string;
// }

// interface SubscriptionMessage {
//   subs: string[];
// }
// // npm install socket.io-client
// const path = "/ws/connect";

// const socket = io("wss://zoonestmac.pagekite.me", {
//   path: path, // Make sure this matches the server configuration
//   transports: ["websocket"], // Ensure you're using the correct transport
// });

// const channelToSubscription: Map<string, SubscriptionItem> = new Map();

// socket.on("connect", () => {
//   console.log("[socket] Connected");
// });

// socket.on("disconnect", (reason: string) => {
//   console.log("[socket] Disconnected:", reason);
// });

// socket.on("error", (error: Error) => {
//   console.log("[socket] Error:", error);
// });

// socket.on("m", (data: string) => {
//   console.log("[socket] Message:", data);
//   const [
//     eventTypeStr,
//     exchange,
//     fromSymbol,
//     toSymbol,
//     ,
//     ,
//     tradeTimeStr,
//     ,
//     tradePriceStr,
//   ] = data.split("~");

//   if (parseInt(eventTypeStr) !== 0) {
//     // Skip all non-trading events
//     return;
//   }
//   const tradePrice = parseFloat(tradePriceStr);
//   const tradeTime = parseInt(tradeTimeStr);
//   const channelString = `0~${exchange}~${fromSymbol}~${toSymbol}`;
//   const subscriptionItem = channelToSubscription.get(channelString);
//   if (subscriptionItem === undefined) {
//     return;
//   }
//   const lastDailyBar = subscriptionItem.lastDailyBar;
//   const nextDailyBarTime = getNextDailyBarTime(lastDailyBar.time);

//   let bar: Bar;
//   if (tradeTime >= nextDailyBarTime) {
//     bar = {
//       time: nextDailyBarTime,
//       open: tradePrice,
//       high: tradePrice,
//       low: tradePrice,
//       close: tradePrice,
//     };
//     console.log("[socket] Generate new bar", bar);
//   } else {
//     bar = {
//       ...lastDailyBar,
//       high: Math.max(lastDailyBar.high, tradePrice),
//       low: Math.min(lastDailyBar.low, tradePrice),
//       close: tradePrice,
//     };
//     console.log("[socket] Update the latest bar by price", tradePrice);
//   }
//   subscriptionItem.lastDailyBar = bar;

//   // Send data to every subscriber of that symbol
//   subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
// });

// function getNextDailyBarTime(barTime: number): number {
//   const date = new Date(barTime * 1000);

//   date.setDate(date.getDate() + 1);
//   return date.getTime() / 1000;
// }

// interface ParsedSymbol {
//   // Define the structure of ParsedSymbol here
//   symbol: string;
//   description: string;
//   exchange: string;
//   fromSymbol: string;
//   toSymbol: string;

//   // Add other properties as needed
// }

// export function subscribeOnStream(
//   symbolInfo: SymbolInfo,
//   resolution: string,
//   onRealtimeCallback: (bar: Bar) => void,
//   subscriberUID: string,
//   onResetCacheNeededCallback: () => void,
//   lastDailyBar: Bar
// ): void {
//   const parsedSymbol = symbolInfo.name; //parseFullSymbol(`${symbolInfo.exchange}:${symbolInfo.name}`);
//   if (parsedSymbol !== null) {
//     const channelString = symbolInfo.name; //`0~${parsedSymbol.exchange}~${parsedSymbol.fromSymbol}~${parsedSymbol.toSymbol}`;
//     const handler: Handler = {
//       id: subscriberUID,
//       callback: onRealtimeCallback,
//     };
//     let subscriptionItem = channelToSubscription.get(channelString);
//     if (subscriptionItem) {
//       // Already subscribed to the channel, use the existing subscription
//       subscriptionItem.handlers.push(handler);
//       return;
//     }
//     subscriptionItem = {
//       subscriberUID,
//       resolution,
//       lastDailyBar,
//       handlers: [handler],
//     };
//     channelToSubscription.set(channelString, subscriptionItem);
//     console.log(
//       "[subscribeBars]: Subscribe to streaming. Channel:",
//       channelString
//     );
//     const subMessage: SubscriptionMessage = { subs: [channelString] };
//     socket.emit("SubAdd", subMessage);
//   } else {
//     console.error("Failed to parse symbol.");
//   }
// }

// export function unsubscribeFromStream(subscriberUID: string): void {
//   // Find a subscription with id === subscriberUID
//   for (const channelString of channelToSubscription.keys() as any) {
//     const subscriptionItem = channelToSubscription.get(channelString);
//     if (!subscriptionItem) continue;

//     const handlerIndex = subscriptionItem.handlers.findIndex(
//       (handler) => handler.id === subscriberUID
//     );

//     if (handlerIndex !== -1) {
//       // Remove from handlers
//       subscriptionItem.handlers.splice(handlerIndex, 1);

//       if (subscriptionItem.handlers.length === 0) {
//         // Unsubscribe from the channel if it is the last handler
//         console.log(
//           "[unsubscribeBars]: Unsubscribe from streaming. Channel:",
//           channelString
//         );
//         const subMessage: SubscriptionMessage = { subs: [channelString] };
//         socket.emit("SubRemove", subMessage);
//         channelToSubscription.delete(channelString);
//         break;
//       }
//     }
//   }
// }
