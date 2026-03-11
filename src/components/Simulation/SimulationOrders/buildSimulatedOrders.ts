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

const hydratedSymbols = new Set<string>();
export function simulateOrdersOnce(
  orders: any[],
  ltpMap: Record<string, number>
) {
  return orders.map((order) => {
    const identifier = order.identifier;

    // Already hydrated → skip
    if (hydratedSymbols.has(identifier)) {
      return order;
    }

    const ltp = ltpMap[identifier];

    // LTP not yet available
    if (!ltp) return order;

    hydratedSymbols.add(identifier);

    return {
      ...order,
      price: ltp,
      average_price: ltp,
      update_time: getCurrentUpdateTime(),
    };
  });
}
