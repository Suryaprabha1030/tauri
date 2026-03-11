// ===============================
// Slippage Helper
// ===============================

function applySlippage(ltp: number, side: string) {
  const slip = ltp * 0.1;

  return side === "LONG"
    ? +(ltp + slip).toFixed(2) // BUY higher
    : +(ltp - slip).toFixed(2); // SELL lower
}

// ===============================
// Build Simulated Positions
// ===============================

export const buildSimulatedPositionsFromStrategy = (strategy: any) => {
  const positions: any[] = [];

  ["LONG", "SHORT"].forEach((side) => {
    const sideLegs = strategy?.legs?.[side];
    if (!sideLegs) return;

    ["CE", "PE"].forEach((optType) => {
      const contracts = sideLegs?.[optType] ?? [];

      contracts.forEach((c: any) => {
        const qty = c?.lot_size * 3;

        const signedQty = side === "SHORT" ? -qty : qty;

        // Apply slippage ONCE
        const fillPrice = applySlippage(c?.ltp, side);

        const buyValue = side === "LONG" ? fillPrice * qty : 0;
        const sellValue = side === "SHORT" ? fillPrice * qty : 0;

        positions.push({
          identifier: c?.identifier,
          token: c?.token,
          exchange: c?.exchange,
          symbol: c?.symbol,

          product: "NRML",

          // PRICE WITH SLIPPAGE
          avg_net_price: fillPrice,
          net_price: fillPrice,

          option_type: c?.option_type,
          lot_size: c?.lot_size,

          quantity: signedQty,

          transaction_type: side,

          index_name: c?.index_name,
          expiry: c?.expiry_date,
          contract_type: c?.option_type,
          strike_price: c?.strike_price,

          lots: c?.lots,

          display_symbol_name: c?.symbol,

          // REQUIRED BY ENGINE
          total_buy_value: buyValue,
          total_sell_value: sellValue,

          total_buy_avg_price: buyValue,
          total_sell_avg_price: sellValue,

          pnl: 0,
          realised_pnl: 0,
          unrealised_pnl: 0,
        });
      });
    });
  });

  return positions;
};

// ===============================
// Net Positions (same identifier)
// ===============================

export function netPositions(positions: any[]) {
  const map = new Map<string, any>();

  positions.forEach((p) => {
    const key = p.identifier;

    if (!map.has(key)) {
      map.set(key, { ...p });
      return;
    }

    const existing = map.get(key);

    // Same side → add lots
    if (existing.transaction_type === p.transaction_type) {
      existing.lots += p.lots;
      existing.quantity += p.quantity;

      existing.total_buy_value += p.total_buy_value;
      existing.total_sell_value += p.total_sell_value;

      return;
    }

    // Opposite side → net off
    if (Math.abs(existing.lots) > Math.abs(p.lots)) {
      existing.lots -= p.lots;
      existing.quantity += p.quantity;
    } else if (Math.abs(existing.lots) < Math.abs(p.lots)) {
      map.set(key, {
        ...p,
        lots: p.lots - existing.lots,
        quantity: p.quantity - existing.quantity,
      });
    } else {
      map.delete(key);
    }
  });

  return Array.from(map.values());
}
