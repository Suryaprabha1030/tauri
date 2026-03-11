"use client";

import { useEffect, useRef, useState } from "react";
import { sampleOrders } from "./sampleOrders";
import { useDispatch } from "react-redux";
import { addSymbol } from "@/lib/redux/slices/StrategySlice";

/**
 * Formats current date same like broker
 */
function getCurrentUpdateTime() {
  const now = new Date();

  return now
    .toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
    .replace(",", "");
}

export function useSimulatedOrders(websocketDataRead: any) {
  const [orders, setOrders] = useState<any[]>(sampleOrders);
  // Tracks already hydrated orders
  const hydratedOrders = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!websocketDataRead) return;

    setOrders((prev) =>
      prev.map((order) => {
        const key = order.order_id;

        if (hydratedOrders.current.has(key)) return order;

        const ltp = websocketDataRead[order.identifier];
        const avgVariation = Math.random() * 0.2;
        const averagePrice = +(ltp + avgVariation).toFixed(2);
        if (!ltp) return order;

        hydratedOrders.current.add(key);

        return {
          ...order,
          price: ltp,
          average_price: averagePrice,
          update_time: getCurrentUpdateTime(),
        };
      })
    );
  }, [websocketDataRead]);

  return orders;
}
