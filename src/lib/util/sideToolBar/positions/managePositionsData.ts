import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { autoLogoutTokenRemove } from "../../autoLogoutUtil/autoLogOutUtil";
import {
  setPositions,
} from "@/lib/redux/slices/StrategySlice";
import { brokerLogoutTokenRemove } from "../../autoLogoutUtil/brokerLogOutUtil";

export const initializePositionsData = (positions: any) => {
  const initialData = positions.map((position: any) => ({
    ...position,
    checked: false,
  }));
  const symbolsArray = Array.from(
    new Set(positions.map((position: any) => position.identifier))
  );
  const hasNetPrice = initialData.some(
    (position: any) => position.avg_net_price !== null
  );
  return { initialData, symbolsArray, hasNetPrice };
};

export const updatePositionsWithPnL = (
  positions: any,
  webSocketDataRead: any,
  currentBrokername: string
) => {
  let updatedTotalPnl = 0;

  const updatedPositions = positions.map((position: any) => {
    const isExited = position?.transaction_type === "EXITED";
    const ltp = webSocketDataRead[position?.identifier] || 0;
    let totalBuyValue, totalSellValue;

    // Use the correct values for total buy/sell calculations
    if (
      currentBrokername &&
      currentBrokername != null &&
      currentBrokername.toLowerCase() === "angelone"
    ) {
      totalBuyValue =
        position?.total_buy_value || position?.total_buy_avg_price || 0;
      totalSellValue =
        position?.total_sell_value || position?.total_sell_avg_price || 0;
    } else {
      totalBuyValue =
        position?.total_buy_avg_price || position?.total_buy_value || 0; //For zerodha calculate from  total_buy_avg_price
      totalSellValue =
        position?.total_sell_avg_price || position?.total_sell_value || 0;
    }

    let pnl: any;
    if (
      position?.transaction_type === "LONG" ||
      position?.transaction_type === "BUY"
    ) {
      pnl = totalSellValue + ltp * Math.abs(position?.quantity) - totalBuyValue;
    } else if (
      position?.transaction_type === "SHORT" ||
      position?.transaction_type === "SELL"
    ) {
      pnl = totalBuyValue + ltp * Math.abs(position?.quantity) - totalSellValue;
    } else {
      pnl = position?.pnl; // Keep as is if transaction type is EXITED
    }
    if (
      position?.transaction_type === "SHORT" ||
      position?.transaction_type === "SELL"
    ) {
      pnl = -pnl;
    }
    const positionPnl = isExited ? position?.pnl : pnl;
    updatedTotalPnl += positionPnl;

    return {
      ...position,
      ltp,
      pnl: positionPnl,
      unrealised_pnl: pnl,
    };
  });

  return {
    updatedPositions,
    updatedTotalPnl,
  };
};

export const fetchPosition = (brokerCode: any, dispatch: any, router: any) => {
  const fetchApi = new UserBrokerRouterApi(baseConfig());
  if (brokerCode) {
    fetchApi
      .fetchMyBrokerPositionsV1UsersMeBrokersBrokerCodePositionsGet(brokerCode)
      .then((response: any) => {
        dispatch(
          setPositions({
            positions: response?.data?.positions,
            positionPnl: response?.data?.total_pnl,
            positionpnlpercent: response?.data?.total_pnl_percent,
          })
        );
      })
      .catch((error) => {
        if (error?.response && error?.response.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  }
};
