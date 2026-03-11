export const calculateHoldingsPnL = (
  holdings: any[],
  webSocketData: any,
  totinvestedValue: any
) => {
  let totalPnL = 0;
  let totalInvested = 0;
  let currentValue = totinvestedValue;
  const updatedHoldings = holdings.map((holding: any) => {
    const adjustedQuantity =
      holding?.collateral_type === "pledge"
        ? holding?.quantity + holding?.collateral_quantity + holding?.t1quantity
        : holding?.quantity + holding?.t1quantity;
    const currentPrice = webSocketData[holding?.identifier] ?? holding.ltp;
    const pnl = (currentPrice - holding?.average_price) * adjustedQuantity; // Profit/Loss per holding
    const investedValue = holding?.average_price * adjustedQuantity; // Total invested value per holding

    totalPnL += pnl; // Aggregate total profit/loss
    totalInvested += investedValue; // Aggregate total investment
    currentValue = totinvestedValue + totalPnL;
    return {
      ...holding,
      profit_and_loss: pnl,
      profit_and_loss_percent:
        investedValue > 0 ? (pnl / investedValue) * 100 : 0, // PnL% relative to invested value
    };
  });

  const totalPnLPercent =
    totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0; // Overall PnL% relative to total invested value

  return {
    updatedHoldings,
    totalPnL,
    totalPnLPercent,
    currentValue,
  };
};
