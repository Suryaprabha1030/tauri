import { useMemo } from "react";
import {
  buildSimulatedPositionsFromStrategy,
  netPositions,
} from "./buildSimulatedPositions";
import { updatePositionsWithPnL } from "@/lib/util/sideToolBar/positions/managePositionsData";

const SIM_TRADER_MAP = {
  INTRADAY: ["Iron Condor"],
  SWING: ["Long Straddle"],
  SCALPER: ["Short Straddle"],
  ARBITRAGE: ["Short Strangle"],
};

export const useSimulatedPositions = (
  strategyApiResponse,
  ws,
  brokerName,
  selectedPositionType
) => {
  return useMemo(() => {
    if (!strategyApiResponse || !selectedPositionType) return null;

    const strategiesForTrader = SIM_TRADER_MAP[selectedPositionType] || [];

    if (!strategiesForTrader.length) return null;

    const selectedStrategies = strategiesForTrader
      .map((name) => strategyApiResponse[name])
      .filter(Boolean);

    if (!selectedStrategies.length) return null;

    const rawPositions = selectedStrategies.flatMap((strategy) =>
      buildSimulatedPositionsFromStrategy(strategy)
    );

    const basePositions = netPositions(rawPositions);

    if (!basePositions.length) return null;

    const engineResult = updatePositionsWithPnL(basePositions, ws, brokerName);

    if (!engineResult) return null;

    const { updatedPositions, updatedTotalPnl } = engineResult;

    return {
      positions: updatedPositions.map((p) => ({
        ...p,
        symbol_name: null,
        buy_avg_price: null,
        sell_avg_price: null,
        close: 0,
        display_symbol_name:
          `${p.index_name} ${p.expiry} ${p.strike_price} ${p.contract_type}` ||
          p.display_symbol_name,
      })),
      total_pnl: updatedTotalPnl,
      total_pnl_percent: 0,
    };
  }, [strategyApiResponse, ws, brokerName, selectedPositionType]);
};
