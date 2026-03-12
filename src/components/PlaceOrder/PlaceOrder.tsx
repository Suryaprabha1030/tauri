import React, { useState, useEffect, useRef } from "react";
import Draggable from "react-draggable";
import { useDispatch, useSelector } from "react-redux";
import {
  setStockData,
  setUpdateStockData,
  togglePlaceOrderVisibility,
} from "@/lib/redux/slices/PlaceOrder";
import OrderTable from "./OrderTable";
import PlaceOrderHeader from "./PlaceOrderHeader";
import { containsSameIndexWithCEorPE } from "@/lib/util/sideToolBar/orders/OrderUtil";
import { RootState } from "@/lib/redux/Store";
import { updateSymbolData } from "@/lib/redux/slices/StrategySlice";
import { useNavigate } from "react-router-dom";
import {
  formatStockData,
  handlePlaceOrder,
  orderBuySell,
  updateBounds,
  updateMarginData,
  updateStockData,
} from "@/lib/util/placeOrder/placeOrder";

interface PlaceOrderProps {
  stocks: any;
  brokerCode: any;
}

const PlaceOrder: React.FC<PlaceOrderProps> = ({ stocks, brokerCode }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [minimize, setMinimize] = useState(false);
  const [componentHeight, setComponentHeight] = useState("400px");
  const [tableVisible, setTableVisible] = useState(true);
  const [marginRequired, setMarginRequired] = useState<number>(0);
  const [marginAvail, setMarginAvail] = useState<number>(0);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [resetMargin, setResetmargin] = useState(false);
  const positionsdata = useSelector(
    (state: RootState) => state.strategy.positions,
  );
  const webSocketDataRead: any = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const handleOrder = (event: any) => {
    if (orderPlaced) return; // Prevent multiple triggers
    setOrderPlaced(true);
    const normalizedStockData = localStockData?.map((item: any) => {
      const wsLtp = webSocketDataRead?.[item?.identifier];

      return {
        ...item,
        ltp:
          item.order_type === "MARKET"
            ? (wsLtp ?? item.ltp ?? 0) // MARKET → websocket first
            : (item.ltp ?? wsLtp ?? 0), // NON-MARKET → item.ltp first
      };
    });

    handlePlaceOrder(normalizedStockData, brokerCode, dispatch, router); // Call your actual function
    // Reset after a short delay to allow new interactions
    setTimeout(() => setOrderPlaced(false), 500);
  };

  const [analyzeState, setAnalyzeState] = useState(false);
  const draggableRef = useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = useState({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  });
  const dispatch = useDispatch();
  const router = useNavigate();
  // Get updated stock data from Redux state
  const UpdatedOrderStockData = useSelector(
    (state: RootState) => state.placeOrder.UpdateOrderStock,
  );
  const [localStockData, setLocalStockData] = useState<any[]>([]);

  // Effect to update the Redux state when `stocks` prop changes
  useEffect(() => {
    if (
      stocks &&
      (Array.isArray(stocks)
        ? stocks.length > 0
        : Object.keys(stocks).length > 0)
    ) {
      const stocksArray = Array.isArray(stocks)
        ? stocks
        : Object.values(stocks);
      const preProcessedStocks = stocksArray?.map((stock) => {
        const matchingPosition =
          positionsdata &&
          positionsdata?.length > 0 &&
          positionsdata.find((pos) => pos?.identifier === stock?.identifier);

        return {
          ...stock,
          product:
            stock?.product ||
            (matchingPosition
              ? matchingPosition?.product_type || matchingPosition?.product
              : "MIS"),
        };
      });
      const newStockData = formatStockData(
        preProcessedStocks,
        webSocketDataRead,
      );

      const updatedStockData = UpdatedOrderStockData?.map((existingStock) => {
        const matchingStock = newStockData?.find(
          (newStock) => newStock?.identifier === existingStock?.identifier,
        );

        return matchingStock
          ? {
              ...matchingStock, // Update with new data
              transaction_type:
                matchingStock.product === "CNC"
                  ? "LONG"
                  : matchingStock?.transaction_type,
            }
          : existingStock;
      });

      // Add any new items from `newStockData` not in `UpdatedOrderStockData`
      const mergedStockData = [
        ...updatedStockData,
        ...newStockData.filter(
          (newStock) =>
            !UpdatedOrderStockData.some(
              (existingStock) =>
                existingStock?.identifier === newStock?.identifier,
            ),
        ),
      ];

      const orderedStockData = orderBuySell(mergedStockData);

      setLocalStockData(orderedStockData);
      dispatch(setUpdateStockData(orderedStockData));

      dispatch(setStockData([]));
    }
  }, [stocks]);

  const toggleMinimize = (event: any) => {
    setMinimize(!minimize);
    if (!minimize) {
      setComponentHeight("3.5rem"); // When minimized, set height to 3.5rem
      setTableVisible(false); // Hide the table
    } else {
      setComponentHeight("400px"); // Reset height when expanded
      setTableVisible(true); // Show the table again
    }
  };

  const handleClose = () => {
    dispatch(togglePlaceOrderVisibility(false));
    dispatch(setUpdateStockData([]));
  };

  const handleRadioButtonChange = (identifier: string, value: string) => {
    const updatedStockData = UpdatedOrderStockData.map((stock: any) =>
      stock?.identifier === identifier
        ? { ...stock, order_type: value }
        : stock,
    );

    dispatch(setUpdateStockData(updatedStockData));
  };

  const handleUpdateStock = (identifier: string, field: string, value: any) => {
    setLocalStockData((prevState) => {
      return prevState.map((stock: any) => {
        if (stock?.identifier !== identifier) return stock;

        let updatedFields: any = { [field]: value };

        if (field === "quantity") {
          const initialQty = stock?.lot_size ?? 1;
          const newQuantity = value;
          updatedFields = {
            ...updatedFields,
            quantity: newQuantity,
            lots: newQuantity / initialQty,
          };
        }

        return {
          ...stock,
          ...updatedFields,
        };
      });
    });
  };

  useEffect(() => {
    updateStockData(localStockData, UpdatedOrderStockData, dispatch);
  }, [localStockData]);

  useEffect(() => {
    if (localStockData.length == 0 && UpdatedOrderStockData.length != 0) {
      setLocalStockData(UpdatedOrderStockData);
    }
  }, []);

  const handleDelete = (identifier: string) => {
    const updatedLocalStockData = localStockData.filter(
      (stock: any) => stock.identifier !== identifier,
    );

    setLocalStockData(updatedLocalStockData);
    dispatch(setUpdateStockData(updatedLocalStockData));
  };

  useEffect(() => {
    updateMarginData(
      localStockData,
      UpdatedOrderStockData,
      brokerCode,
      setMarginRequired,
      setMarginAvail,
      router,
      webSocketDataRead,
    );
  }, [localStockData, resetMargin]);

  //To set the Analyze true or false
  useEffect(() => {
    const isBooleanTrue = containsSameIndexWithCEorPE(UpdatedOrderStockData);
    setAnalyzeState(isBooleanTrue);
  }, [UpdatedOrderStockData]);

  useEffect(() => {
    const update = () => updateBounds(draggableRef, setBounds, setPosition);

    update(); // Run once initially
    window.addEventListener("resize", update);

    return () => window.removeEventListener("resize", update);
  }, [componentHeight, UpdatedOrderStockData]);
  return (
    <Draggable
      position={position}
      cancel=".class-for-touch-event"
      bounds={bounds}
      onStop={(e, data) => setPosition({ x: data.x, y: data.y })}
    >
      <div
        ref={draggableRef}
        id="placeOrderTable"
        className="max-h-400 fixed z-[10000] cursor-move rounded-lg border-2 border-gray-300 bg-white py-2 shadow-top-bottom  max-sm:w-[22rem] max-sm:px-1   sm:max-md:w-[35rem]  md:max-lg:w-[45rem] lg:max-xl:w-[58rem] xl:w-[52rem] xl:px-4"
      >
        <div className="w-full">
          <PlaceOrderHeader
            minimize={minimize}
            toggleMinimize={toggleMinimize}
            handleClose={handleClose}
            StockDataLength={
              UpdatedOrderStockData && UpdatedOrderStockData.length
            }
            marginAvail={marginAvail}
            marginRequired={marginRequired}
            analyzeState={analyzeState}
            stockData={UpdatedOrderStockData}
            setResetmargin={setResetmargin}
            resetMargin={resetMargin}
          />
        </div>
        {UpdatedOrderStockData && UpdatedOrderStockData.length > 0 ? (
          <div
            className="flex max-h-[80%] w-full flex-col items-center justify-center"
            id="ordertable"
          >
            {tableVisible && (
              <>
                <OrderTable
                  stockData={UpdatedOrderStockData}
                  selectedOrderTypes={new Map()}
                  handleUpdateStock={handleUpdateStock}
                  handleRadioButtonChange={handleRadioButtonChange}
                  handleDelete={handleDelete}
                />
                {UpdatedOrderStockData.length > 0 && (
                  <div className=" mt-2 flex w-full flex-row items-center justify-center md:max-xl:py-2 ">
                    <button
                      id="trade"
                      className="class-for-touch-event flex w-[5rem] items-center justify-center rounded-3xl border  border-z-green-500  p-2 text-[0.75rem]  font-medium leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white"
                      title="Place order"
                      onClick={handleOrder}
                      onTouchStart={handleOrder}
                    >
                      Execute
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className="flex h-[80%] w-full items-center justify-center py-2 text-center  text-gray-700">
            Basket is empty
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default PlaceOrder;
