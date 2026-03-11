import React, { Dispatch, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import {
  getFutureData,
  getOptionData,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";
import {
  addCartSuccess,
  addSymbol,
  getIndexName,
  setStock,
  updateSymbolData,
} from "@/lib/redux/slices/StrategySlice";
import { useRouter } from "next/navigation";

import { AnalyzeOrderObject } from "@/lib/util/sideToolBar/orders/OrderUtil";
import { setAnalyzeOrderStocks } from "@/lib/redux/slices/PlaceOrder";
import { formatNumber } from "@/lib/util/DraftUtil";
import { setOiChartCall } from "@/lib/redux/slices/PayoffChartSlice";
import { getBrokerCode } from "../helpers";
import config from "@/lib/config";
import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { updateMarginData } from "@/lib/util/placeOrder/placeOrder";

interface PlaceOrderHeaderProps {
  minimize: boolean;
  toggleMinimize: (e: any) => void;
  handleClose: () => void;
  StockDataLength: any;
  marginAvail: number;
  marginRequired: number;
  analyzeState: boolean;
  stockData: any;
  setResetmargin: Dispatch<React.SetStateAction<boolean>>;
  resetMargin: boolean;
}

const PlaceOrderHeader: React.FC<PlaceOrderHeaderProps> = ({
  minimize,
  toggleMinimize,
  handleClose,
  StockDataLength,
  marginAvail,
  marginRequired,
  analyzeState,
  stockData,
  setResetmargin,
  resetMargin,
}) => {
  const path = window.location.pathname;
  const FundsDataRedux: any = useSelector(
    (state: RootState) => state.strategy.fundsData,
  );

  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const indexname = useSelector((state: RootState) => state.strategy.indexName);
  const [spinningAnimation, setSpinningAnimation] = useState(false);
  const brokerCode = getBrokerCode();
  const dispatch = useDispatch();
  const router = useRouter();

  const resetPrices = async () => {
    setSpinningAnimation(true);
    const payload = stockData?.map((stock: any) => stock?.identifier);
    if (!payload) return;

    if (Array.isArray(payload) && payload?.length > 0) {
      payload?.forEach((id: any) => {
        dispatch(addSymbol({ symbol: id }));
      });
    }
    setResetmargin(!resetMargin);
    setTimeout(() => setSpinningAnimation(false), 500);
  };

  const AnalyzeStocks = (symb: any) => {
    dispatch(setOiChartCall(true));
    const AnalyzeStock = AnalyzeOrderObject(symb);

    dispatch(getOptionData({ optionData: {} }));
    dispatch(getFutureData({ futureData: {} }));
    dispatch(showPositionTable(false));
    dispatch(showStrategyTable(true));
    dispatch(showPnlTable(false));
    dispatch(showDraftPositions(false));
    dispatch(setAnalyzeOrderStocks(AnalyzeStock));
    const firstObject: any = Object.values(symb)[0]; // Get the first value
    const result = {
      index_name: firstObject?.index_name,
      exchange: firstObject?.exchange,
      expiry: firstObject?.expiry,
    };

    dispatch(
      getIndexName({
        indexName: result?.index_name,
        expiryDate: result?.expiry,
      }),
    );

    dispatch(
      setStock({
        stock: {
          exchange: result?.exchange,
          index_name: result?.index_name,
          spot_price: webSocketDataRead[firstObject.identifier],
        },
      }),
    );

    if (result?.index_name != indexname && indexname?.length > 0) {
      dispatch(
        addCartSuccess({
          items: {
            exchange: "",
            index_name: "",
            spot_price: null,
            expiryDate: "",
          },
        }),
      );
    }

    if (!(path === `${config.brokersListUrl}/${brokerCode}/psb`)) {
      router.push(`${config.brokersListUrl}/${brokerCode}/psb`);
    }
  };

  return (
    <div className="flex flex-row  justify-between max-xl:items-start md:max-xl:px-2 md:max-xl:py-2 xl:items-center">
      <div className="flex flex-row items-center justify-between max-sm:w-[60%] sm:max-md:w-[24rem] md:max-xl:w-[36rem] xl:w-[33rem]">
        {" "}
        <div className="px-2 py-1 font-medium max-sm:text-[0.7rem] sm:max-md:text-[0.8rem] md:text-[1rem]">
          Basket ({StockDataLength})
        </div>
        <div className="max-sm:text-[0.7rem] sm:max-md:text-[0.8rem] md:text-[1rem]">
          Margin Required:{" "}
          <span
            className={` text-black max-sm:text-[0.7rem] sm:max-md:text-[0.8rem] md:text-[1rem]`}
          >
            {StockDataLength == 0 ? "0.00" : formatNumber(marginRequired)}
          </span>
        </div>
        <div className="max-sm:hidden sm:max-md:text-[0.8rem]  md:text-[1rem]">
          Available Margin:{" "}
          <span
            className={`text-black  sm:max-md:text-[0.8rem] md:text-[1rem]`}
          >
            {formatNumber(FundsDataRedux?.net_amount)}
          </span>
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-2 px-2 max-sm:w-[30%] md:max-xl:h-[2rem]">
        <div className=" flex flex-row gap-1">
          <div
            className={`class-for-touch-event group relative inline-block cursor-pointer p-1 hover:bg-gray-100  ${
              analyzeState ? "" : "pointer-events-none opacity-0"
            }`}
            onClick={() => AnalyzeStocks(stockData)}
          >
            <img
              src="/svg/analyze.svg"
              className=" max-md:w-[1.5rem] max-sm:h-[1rem] max-sm:w-[1rem] sm:max-md:h-[1rem] md:max-xl:h-[1rem] md:max-xl:w-[1.5rem]"
              height={14}
              width={14}
              alt="Analyze"
            />
            <span className="pointer-events-none absolute left-[-2] top-6 z-[1000] rounded bg-gray-800 px-2 py-1 text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100 max-xl:hidden">
              Analyze
            </span>
          </div>
          <div className="group relative flex   items-center px-1 hover:bg-gray-100">
            <button
              className="class-for-touch-event hover:cursor-pointer hover:bg-gray-100"
              onClick={resetPrices}
            >
              <img
                src="/svg/reset.svg"
                height={13}
                width={13}
                alt="refresh"
                className={`max-sm:h-[1.1rem] max-sm:w-[1.1rem] md:max-xl:h-[1rem] md:max-xl:w-[1rem] ${spinningAnimation ? "animate-spin" : ""}`}
              />
            </button>
            <span className="pointer-events-none absolute left-[-2] top-6 z-[1000] rounded bg-gray-800 px-2 py-1 text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100 max-xl:hidden">
              Refresh
            </span>
          </div>

          <div className="flex cursor-pointer items-center hover:bg-gray-100 max-sm:w-[1.8rem]">
            {!minimize ? (
              <img
                src="/svg/verticalShrink.svg"
                height={20}
                width={20}
                alt="minimize"
                onClick={toggleMinimize}
                onTouchStart={toggleMinimize}
                className="max-md:h-[1.2rem] max-md:w-[1.8rem] md:max-xl:h-[1.6rem] md:max-xl:w-[2rem]"
              />
            ) : (
              <img
                src="/svg/maximize.svg"
                height={15}
                width={15}
                alt="maximize"
                onClick={toggleMinimize}
                onTouchStart={toggleMinimize}
                className="max-xl:h-[1rem] max-xl:w-[1.5rem]"
              />
            )}
          </div>
          <button
            className="class-for-touch-event text-gray-600 hover:text-black"
            onClick={handleClose}
            onTouchStart={handleClose}
          >
            <img
              src={"/svg/removeSymbol.svg"}
              className="max-xl:w-[1.6rem] max-md:h-[1.4rem] md:max-xl:h-[1.6rem]"
              height={20}
              width={20}
              alt=""
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderHeader;
