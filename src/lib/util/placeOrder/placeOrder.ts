import { Dispatch } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  setStockData,
  setUpdateStockData,
  togglePlaceOrderVisibility,
} from "@/lib/redux/slices/PlaceOrder";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import {
  CalculateOrderMarginData,
  PlaceOrderStock,
} from "@/lib/util/sideToolBar/orders/OrderUtil";
import { setOrderPlaced } from "@/lib/redux/slices/PositionSlicer";
import config from "@/lib/config";
import { brokerLogoutTokenRemove } from "../autoLogoutUtil/brokerLogOutUtil";

export const handlePlaceOrder = (
  localStockData: any[],
  brokerCode: any,
  dispatch: Dispatch,
  router: any
) => {
  const formattedStocks: any = PlaceOrderStock(localStockData);
  const OrderApi = new UserBrokerRouterApi(baseConfig());

  OrderApi.placeMultiOrdersV1UsersMeBrokersBrokerCodeMultiOrdersPost(
    brokerCode,
    formattedStocks
  )
    .then(() => {
      toast("Orders Placed");
      dispatch(togglePlaceOrderVisibility(false));
      dispatch(setStockData([]));
      dispatch(setUpdateStockData([]));
    })
    .catch((error) => {
      if (error?.response?.status === 401) {
        autoLogoutTokenRemove(router);
      }
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
    });
};

export const updateMarginData = (
  localStockData: any[],
  UpdatedOrderStockData: any,
  brokerCode: any,
  setMarginRequired: (value: number) => void,
  setMarginAvail: (value: number) => void,
  router: any,
  websocketDataRead: any
) => {
  if (
    UpdatedOrderStockData &&
    UpdatedOrderStockData.length > 0 &&
    websocketDataRead
  ) {
    const normalizedStockData = localStockData?.map((item: any) => {
      const wsLtp = websocketDataRead?.[item?.identifier];

      return {
        ...item,
        ltp:
          item.order_type === "MARKET"
            ? (wsLtp ?? item?.ltp ?? 0) // MARKET → websocket first
            : (item?.ltp ?? wsLtp ?? 0), // NON-MARKET → item.ltp first
      };
    });

    const marginData = CalculateOrderMarginData(normalizedStockData);

    const MarginApi = new UserBrokerRouterApi(baseConfig());

    MarginApi.calculateMarginV1UsersMeBrokersBrokerCodeCalculateMarginPost(
      brokerCode,
      marginData
    )
      .then((res) => {
        setMarginRequired(res.data.total_margin_required);
        setMarginAvail(res.data.premium);
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  }
};

export const updateBounds = (
  draggableRef: any,
  setBounds: any,
  setPosition: any
) => {
  if (draggableRef.current) {
    const elementWidth = draggableRef.current.offsetWidth;
    const elementHeight = draggableRef.current.offsetHeight;

    setBounds({
      left: 0,
      top: 0,
      right: window.innerWidth - elementWidth,
      bottom: window.innerHeight - elementHeight,
    });

    setPosition({
      x: (window.innerWidth - elementWidth) / 2,
      y: (window.innerHeight - elementHeight) / 2,
    });
  }
};

export const orderBuySell = (data: any[]) => [
  ...data.filter(
    (item: any) =>
      item?.transaction_type?.toUpperCase() === "LONG" ||
      item?.transaction_type?.toUpperCase() === "BUY"
  ),
  ...data.filter(
    (item: any) =>
      item?.transaction_type?.toUpperCase() === "SHORT" ||
      item?.transaction_type?.toUpperCase() === "SELL"
  ),
];

export const updateStockData = (
  localStockData: any,
  UpdatedOrderStockData: any,
  dispatch: Dispatch
) => {
  if (localStockData.length > 0) {
    const updatedStockData = UpdatedOrderStockData.map((stock) => {
      // Find the matching local stock by identifier
      const localStock = localStockData.find(
        (local: any) => local && local.identifier === stock.identifier // Match by unique identifier
      );

      if (localStock) {
        // Merge the local stock with the updated stock data
        return {
          ...stock, // Keep existing data
          ...localStock, // Override with latest local state updates
        };
      }
      return stock;
    });
    const orderedStockData = [
      ...updatedStockData.filter(
        (item: any) =>
          item.transaction_type?.toUpperCase() === "LONG" ||
          item.transaction_type?.toUpperCase() === "BUY"
      ),
      ...updatedStockData.filter(
        (item: any) =>
          item.transaction_type?.toUpperCase() === "SHORT" ||
          item.transaction_type?.toUpperCase() === "SELL"
      ),
    ];
    // Dispatch the updated stock data
    dispatch(setUpdateStockData(orderedStockData));
  }
};

export const formatStockData = (stocks: any, websocketDataRead: any): any[] => {
  if (!stocks || (!Array.isArray(stocks) && Object.keys(stocks).length === 0)) {
    return [];
  }

  return (Array.isArray(stocks) ? stocks : Object.values(stocks)).map(
    (stock: any) => ({
      ...stock,
      order_type:
        stock?.symbol_type === "stock_options"
          ? "LIMIT"
          : stock?.order_type || "MARKET", // for stock options only limit
      validity: stock?.validity || "REGULAR",
      trigger: stock?.trigger || stock?.ltp || 0,
      variety: stock?.variety || "DAY",
      lots:
        typeof stock?.lots === "number" && !isNaN(stock.lots)
          ? Math.abs(stock.lots)
          : 1, // for stocks display qty instead of lots
      product:
        stock?.product_type || stock?.product
          ? stock?.product_type || stock?.product
          : stock?.exchange === "NFO" || stock?.exchange === "BFO"
            ? "NRML"
            : "MIS",

      transaction_type:
        stock?.product_type === "CNC"
          ? "LONG"
          : stock?.transaction_type || "BUY",
      quantity:
        typeof stock?.quantity === "number" && !isNaN(stock.quantity)
          ? Math.abs(stock.quantity)
          : (typeof stock?.lot_size === "number" && !isNaN(stock.lot_size)
              ? Math.abs(stock.lot_size)
              : 1) *
            (typeof stock?.lots === "number" && !isNaN(stock.lots)
              ? Math.abs(stock.lots)
              : 1),

      lot_size:
        typeof stock?.lot_size === "number" && !isNaN(stock.lot_size)
          ? stock.lot_size
          : 1,
      ivValue:
        typeof stock?.ivValue === "number" && !isNaN(stock?.ivValue)
          ? Math.abs(stock?.ivValue)
          : config.defaultIvValue,
      ltp:
        stock?.ltp ||
        (websocketDataRead && websocketDataRead[stock?.identifier]),
    })
  );
};
