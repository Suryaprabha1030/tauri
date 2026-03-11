import React, { useEffect, useState } from "react";
import AddToDrafts from "../Sandbox/AddToDrafts";
import {
  setStockData,
  togglePlaceOrderVisibility,
} from "@/lib/redux/slices/PlaceOrder";
import { useDispatch, useSelector } from "react-redux";
import {
  getFutureData,
  getOptionData,
  setSelectedStrategy,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";
import { RootState } from "@/lib/redux/Store";
import { toast } from "react-toastify";
import { PlaceOrderStock } from "@/lib/util/sideToolBar/orders/OrderUtil";
import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";

import { formatStockData } from "@/lib/util/placeOrder/placeOrder";
import { formatNumber } from "@/lib/util/DraftUtil";
import { getBrokerCode } from "@/components/helpers";
import Multiplier from "./Multiplier";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface NewStrategyFooterProps {
  premium: number;
  draftData: {};
  DraftName: any;
  setCheckedOptionData: React.Dispatch<React.SetStateAction<{}>>;
  setSmartApi: React.Dispatch<React.SetStateAction<any>>;
  getCheckedData: any;
  setButtonId: any;
  setCheckedRows: React.Dispatch<React.SetStateAction<{}>>;
  orderExecuted: boolean;
  setOrderExecuted: React.Dispatch<React.SetStateAction<boolean>>;
  setAddTable: React.Dispatch<React.SetStateAction<boolean>>;
  setActive: React.Dispatch<React.SetStateAction<any>>;
  orderExecuteFromOptionChain: boolean;
  setOrderExecuteFromOptionChain: React.Dispatch<React.SetStateAction<boolean>>;
  checkedOptionData: any;
}

const NewStrategyFooter: React.FC<NewStrategyFooterProps> = ({
  premium,
  draftData,
  DraftName,
  setCheckedOptionData,
  setSmartApi,
  getCheckedData,
  setButtonId,
  setCheckedRows,
  orderExecuted,
  setOrderExecuted,
  setAddTable,
  setActive,
  orderExecuteFromOptionChain,
  setOrderExecuteFromOptionChain,
  checkedOptionData,
}) => {
  const dispatch = useDispatch();
  const optionDatas: any = useSelector(
    (state: RootState) => state.analyzer.optionDataList,
  );
  const futureDatas: any = useSelector(
    (state: RootState) => state.analyzer.futureDataList,
  );
  const webSocketDataRead: any = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const router = useRouter();
  const [hoverImage, setHoverImage] = useState(true);
  const [legHoverImage, setLegHoverImage] = useState(true);
  const [enableButtons, setEnableButtons] = useState(true);
  const handleTradeAll = () => {
    const stocks = getCheckedData;
    setSmartApi(true);
    setButtonId("trade");
    dispatch(togglePlaceOrderVisibility(true));
    dispatch(setStockData(stocks));
  };
  const premiumData: any = useSelector(
    (state: RootState) => state.PayoffChart.premiumData,
  );
  const PlaceOrderInitiated = useSelector(
    (state: RootState) => state.Position.orderPlaced,
  );

  const handlePlaceOrder = () => {
    const stocks = formatStockData(getCheckedData, webSocketDataRead);
    const formattedStocks: any = PlaceOrderStock(stocks);
    const brokerCode = getBrokerCode();
    const OrderApi = new UserBrokerRouterApi(baseConfig());
    OrderApi.placeMultiOrdersV1UsersMeBrokersBrokerCodeMultiOrdersPost(
      brokerCode,
      formattedStocks,
    )
      .then((res) => {
        toast("Orders Placed");
        const unchecked = Object.keys(getCheckedData).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});
        setCheckedRows((prev) => ({ ...prev, ...unchecked }));
        setOrderExecuted(true);
        setOrderExecuteFromOptionChain(false);
        dispatch(getOptionData({ optionData: {} }));
        const filteredOptionData = Object.fromEntries(
          Object.entries(optionDatas).filter(
            ([key]) => !checkedOptionData.hasOwnProperty(key),
          ),
        );
        const filteredFutureData = Object.fromEntries(
          Object.entries(futureDatas).filter(
            ([key]) => !checkedOptionData.hasOwnProperty(key),
          ),
        );

        // Dispatch the updated data
        dispatch(getOptionData({ optionData: filteredOptionData }));
        // dispatch(getOptionData({ optionData: {} }));
        dispatch(getFutureData({ futureData: filteredFutureData }));
        // setAddTable(false);
      })

      .catch((error) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  };

  useEffect(() => {
    if (orderExecuteFromOptionChain) {
      handlePlaceOrder();
    }
  }, [orderExecuteFromOptionChain]);

  useEffect(() => {
    //Switch to positions tab when click execute in newstrategy table and positions data set
    if (PlaceOrderInitiated && orderExecuted) {
      const timer = setTimeout(() => {
        dispatch(showPositionTable(true));
        dispatch(showStrategyTable(false));
        dispatch(showPnlTable(false));
        dispatch(showDraftPositions(false));
        dispatch(setSelectedStrategy({ setselectedStrategy: null }));
        setOrderExecuted(false);
      }, 5000); // 5 sec

      return () => clearTimeout(timer); // Cleanup in case the component unmounts or `PlaceOrderInitiated` changes
    }
  }, [PlaceOrderInitiated, orderExecuted]);
  useEffect(() => {
    if (getCheckedData && Object.entries(getCheckedData).length > 0) {
      setEnableButtons(true);
    } else {
      setEnableButtons(false);
    }
  }, [getCheckedData]);

  return (
    <div
      className="mt-5 flex h-[5%] w-full items-start justify-center
    gap-2 max-xl:flex-nowrap xl:flex-col xl:items-start
    xl:justify-start xl:gap-3"
    >
      <div
        className={`flex flex-row items-center  max-xl:justify-start max-xl:py-1 max-sm:gap-[1.2rem] max-sm:px-2 sm:max-md:w-1/2 sm:max-md:gap-[1.5rem] md:max-xl:gap-[2rem]  lg:max-xl:w-1/3 xl:w-full xl:justify-center   xl:gap-3`}
      >
        <Multiplier />

        <div className="  text-[0.8rem] font-normal text-black max-sm:text-[0.65rem]">
          {premium < 0
            ? `Premium Received: ${formatNumber(Math.abs(premiumData))}`
            : `Premium Pay: ${formatNumber(premiumData)}`}
        </div>
      </div>
      <div className="flex-row items-center justify-center gap-3     max-xl:inline-flex max-xl:justify-start  xl:flex  xl:w-full">
        <button
          id="Leg"
          className={`class-for-touch-event flex items-center justify-center gap-1 rounded-3xl border border-z-green-500 text-[0.75rem] font-medium leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white max-xl:hidden max-xl:hidden max-md:hidden max-sm:w-[4.5rem] max-sm:p-1 max-sm:text-[0.65rem] md:h-7 md:max-2xl:w-[5.8rem] xl:p-2 2xl:w-[6rem]
          `}
          title="Add Legs"
          onMouseEnter={() => setLegHoverImage(false)}
          onMouseLeave={() => setLegHoverImage(true)}
          onClick={() => {
            setAddTable(true);
          }}
        >
          <img
            src={legHoverImage ? "/svg/plusSymbol.svg" : "/svg/whiteAdd.svg"}
            width={15}
            height={15}
            alt=""
            className="max-sm:h-[0.6rem] max-sm:w-[0.6rem] md:max-xl:mb-0.5 md:max-xl:h-[0.9rem] md:max-xl:w-[0.9rem]"
          />
          Legs
        </button>
        <AddToDrafts
          draftData={draftData}
          DraftName={DraftName}
          setCheckedOptionData={setCheckedOptionData}
          enableButtons={enableButtons}
          setActive={setActive}
        />

        <button
          id="trade"
          className={`flex items-center justify-center gap-1 rounded-3xl border border-z-green-500 text-[0.75rem] font-medium leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white max-sm:w-[4.5rem] max-sm:p-1 max-sm:text-[0.65rem] sm:max-md:w-[5.5rem] sm:max-md:pb-[0.3rem] sm:max-md:pr-[0.25rem] sm:max-md:pt-[0.35rem] md:h-7 md:max-2xl:w-[5.8rem] md:max-xl:pr-[0.25rem] xl:p-2 xl:max-2xl:pr-3 2xl:w-[6rem] ${
            !enableButtons ? "pointer-events-none opacity-50" : ""
          }`}
          title="Basket"
          onClick={handleTradeAll}
          onDoubleClick={(event: any) => {
            event.stopPropagation();
          }}
          onMouseEnter={() => setHoverImage(false)}
          onMouseLeave={() => setHoverImage(true)}
        >
          <img
            src={hoverImage ? "/svg/plusSymbol.svg" : "/svg/whiteAdd.svg"}
            width={15}
            height={15}
            alt=""
            className="max-sm:h-[0.6rem] max-sm:w-[0.6rem] md:max-xl:mb-0.5 md:max-xl:h-[0.9rem] md:max-xl:w-[0.9rem]"
          />
          Basket
        </button>

        <button
          id="execute"
          className={`class-for-touch-event flex items-center justify-center gap-1 rounded-3xl border border-z-green-500 text-[0.75rem] font-medium leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white max-md:hidden max-sm:w-[4.5rem] max-sm:p-1 max-sm:text-[0.65rem] md:h-7 md:max-2xl:w-[5.8rem] xl:p-2 2xl:w-[6rem] ${
            enableButtons ? "" : "pointer-events-none opacity-50"
          }`}
          title="Execute"
          onClick={handlePlaceOrder}
          onTouchStart={handlePlaceOrder}
        >
          Execute
        </button>
      </div>
    </div>
  );
};

export default NewStrategyFooter;
