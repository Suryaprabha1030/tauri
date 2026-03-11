export const heatmapSeries = (HeatMapData: any[], toggleState: any) => [
  {
    data: HeatMapData.map((stock) => ({
      x: stock.displaySymbolName || stock.x || "Undefined",
      y:
        toggleState === "OI"
          ? stock.oiPercent || 0 // Default to 0 if missing
          : stock.chgPercent || 0, // Default to 0 if missing
      ltp: stock.ltp || 0, // Default to 0 if missing
      symbol: stock.displaySymbolName || stock.symbol || "Undefined",
      exchange: stock.exchange || "",
      identifier: stock.identifier || null,
      expiry: stock.expiry || null,
      option_type: stock.option_type || null,
      strike_price: stock.strike_price || null,
      index_name: stock.index_name || null,
      lot_size: stock.lot_size || null,
      position: stock.position || null,
      token: stock.token || null,
      oiPercent: stock.oiPercent || null,
      oi: stock.oi || null,
    })),
  },
];
