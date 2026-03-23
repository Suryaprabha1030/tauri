import { useMemo } from "react";
import {
  buildSimulatedHoldings,
  getTotalInvested,
} from "./buildSimulatedHoldings";
import { HOLDINGS_MAP } from "./sampleHoldings";
import { calculateHoldingsPnL } from "@/lib/util/sideToolBar/holdingsUtil";

export const useSimulatedHoldings = (webSocketDataRead:any, holdingType:any) => {
  return useMemo(() => {
    if (!holdingType) return null;

    const selectedHoldings = HOLDINGS_MAP[holdingType] || [];

    if (!selectedHoldings.length) return null;

    const totalInvested = getTotalInvested(selectedHoldings);

    const baseHoldings = buildSimulatedHoldings(
      selectedHoldings,
      webSocketDataRead
    );

    const result = calculateHoldingsPnL(
      baseHoldings,
      webSocketDataRead,
      totalInvested
    );

    const holdings = result?.updatedHoldings ?? [];

    const total_profit_and_loss = holdings.reduce(
      (sum, h) => sum + (h.profit_and_loss || 0),
      0
    );

    const total_profit_and_loss_percent =
      totalInvested > 0 ? (total_profit_and_loss / totalInvested) * 100 : 0;

    return {
      total_profit_and_loss,
      total_invested_value: totalInvested,
      total_profit_and_loss_percent,
      holdings,
    };
  }, [webSocketDataRead, holdingType]);
};
