export const getTotalInvested = (seeds: any[]) => {
  return seeds.reduce((sum, s) => sum + s.avg * s.qty, 0);
};

export const buildSimulatedHoldings = (
  seeds: any[],
  webSocketDataRead: any
) => {
  return seeds.map((seed, idx) => {
    const symbol = seed.identifier.split(":")[1];

    const t1 = idx % 2 === 0 ? Math.floor(seed.qty * 0.2) : 0;
    const pledge = idx % 3 === 0 ? Math.floor(seed.qty * 0.3) : 0;

    return {
      symbol,
      broker_symbol: seed.identifier,
      symbol_name: null,

      identifier: seed.identifier,
      exchange: seed.identifier.split(":")[0],
      token: "",

      isin: "",

      ltp: webSocketDataRead[seed.identifier] ?? 0,
      close: seed.avg,

      average_price: seed.avg,

      profit_and_loss: 0,
      profit_and_loss_percent: 0,

      quantity: seed.qty,
      t1quantity: t1,

      collateral_quantity: pledge,
      collateral_type: pledge ? "pledge" : null,

      realised_quantity: seed.qty - t1,
      authorised_quantity: null,
      haircut: null,

      product: "CNC",

      net_change: 0,
      net_change_percent: 0,

      display_symbol_name: symbol,
    };
  });
};
