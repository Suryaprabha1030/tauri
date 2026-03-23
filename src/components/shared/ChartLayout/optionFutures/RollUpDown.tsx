import {
  setStockData,
  setUpdateStockData,
  togglePlaceOrderVisibility,
} from "@/lib/redux/slices/PlaceOrder";

import React, { useEffect, useState } from "react";
import { updateStrikePrice } from "./optionFuturesUtil/newStrategyUtil";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { toast } from "react-toastify";
import RollDropdown from "./RollDropDown";
import { manageOrders } from "./optionFuturesUtil/legUtil";

const RollUpDown = ({ query }:any) => {
  const dataKey = useSelector((state: RootState) => state.optionChain.dataKey);
  const [max, setMax] = useState<null | any>(null);
  const [min, setMin] = useState<null | any>(null);
  const decreaser: any = useSelector(
    (state: RootState) => state.optionChain.decreaser
  );
  const optionChainData: any = useSelector(
    (state: RootState) => state.strategy.ltpData
  );
  const dispatch = useDispatch();
  const positionDatas:any = useSelector(
    (state: RootState) => state.analyzer.PositionDataList
  );
  const showPlaceOrder = useSelector(
    (state: RootState) => state.placeOrder.isVisible
  );
  const [selectedRollUp, setSelectedRollUp] = useState<number | null | string>(
    ""
  );
  const [selectedRollDown, setSelectedRollDown] = useState<
    number | null | string
  >("");
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  useEffect(() => {
    if (dataKey.length > 0) {
      const numericValues = dataKey.map(Number);

      // Find the least (smallest) and biggest (largest) values
      const maxValue: any = Math.max(...numericValues);
      const minValue: any = Math.min(...numericValues);
      setMax(maxValue);
      setMin(minValue);
    }
  }, [dataKey]);

  const oppositeType = (t: "LONG" | "SHORT") =>
    t === "LONG" ? "SHORT" : "LONG";

  const netByIdentifier = (data: Record<string, any>) =>
    Object.values(data).reduce((a: any, o: any) => {
      const p = a[o.identifier];

      if (!p) {
        a[o.identifier] = { ...o };
        return a;
      }

      const netLots =
        p.transaction_type === o.transaction_type
          ? p.lots + o.lots
          : p.lots - o.lots;

      if (netLots === 0) {
        delete a[o.identifier];
      } else if (netLots > 0) {
        a[o.identifier] = { ...p, lots: netLots };
      } else {
        a[o.identifier] = { ...o, lots: Math.abs(netLots) };
      }

      return a;
    }, {});

  const reindexToCompositeKeyObject = (data: Record<string, any>) =>
    Object.values(data).reduce((acc: any, o: any) => {
      const key = `${Number(o.strike_price)}#${o.option_type}#${o.expiry}`;

      acc[key] = {
        ...o,
      };

      return acc;
    }, {});

  const adjustAllStrikePrices = (
    direction: "increase" | "decrease",
    rollSize: any
  ) => {
    const boundary: any = direction === "increase" ? max : min;
    const step =
      direction === "increase" ? decreaser * rollSize : -(decreaser * rollSize);

    let finalStockData: any = {};
    let index = 0;
    if (!positionDatas || Object.keys(positionDatas).length === 0) {
      return;
    }

    Object.entries(positionDatas).forEach(([key, option]: any) => {
      const [price, optionType, expiryDate] = key.split("#");

      if (
        Object.entries(optionChainData?.[query]?.[expiryDate] ?? {}).length ===
        0
      ) {
        toast("these expiry data doesnot exit", {
          toastId: "data-not-exist",
        });
        return;
      }
      if (optionType == "FUT") {
        toast("Not supportive FUT", {
          toastId: "fut-not-supported",
        });
        return;
      }

      const isValid =
        +price + step >= min &&
        +price + step <= max &&
        (+price + step - min) % decreaser === 0;

      if (
        // (direction == "increase" && +price + step > boundary) ||
        // (direction == "decrease" && +price + step < boundary) ||
        !isValid
      ) {
        toast("Not supportive for far away strike", {
          toastId: "strike-not-supported",
        });
        return;
      }

      if (
        optionChainData.length == 0 ||
        Object.entries(positionDatas)?.length == 0
      ) {
        return;
      }

      // exited leg
      const exitedType = oppositeType(option.transaction_type);
      finalStockData[index++] = {
        ...option,
        transaction_type: exitedType,
        button_type: exitedType === "LONG" ? "BUY" : "SELL",
      };

      // find next valid strike
      let strikePrice = option.strike_price + step;
      while (positionDatas[`${strikePrice}.0#${optionType}#${expiryDate}`]) {
        strikePrice += step;
      }

      const oldKey = `${option.strike_price}.0#${optionType}#${expiryDate}#positions#${option.transaction_type}`;
      const newKey = `${strikePrice}.0#${optionType}#${expiryDate}#positions#${option.transaction_type}`;

      const rolled = updateStrikePrice(
        positionDatas,
        oldKey,
        newKey,
        option.transaction_type,
        optionChainData[query],
        true,
        webSocketDataRead
      );

      Object.values(rolled).forEach((o: any, i) => {
        finalStockData[index++] = { ...o };
      });
    });

    if (!Object.keys(finalStockData).length) {
      setSelectedRollUp(null);
      setSelectedRollDown(null);
      dispatch(togglePlaceOrderVisibility(false));
      return;
    }

    const netted = (data: Record<string, any>) => {
      const netobj = netByIdentifier(data);
      return manageOrders(
        reindexToCompositeKeyObject(netobj),
        webSocketDataRead
      );
    };

    dispatch(setStockData([]));
    dispatch(setUpdateStockData([]));

    dispatch(togglePlaceOrderVisibility(true));
    dispatch(setStockData(netted(finalStockData)));
  };

  useEffect(() => {
    if (!showPlaceOrder) {
      setSelectedRollDown("");
      setSelectedRollUp("");
    }
  }, [showPlaceOrder]);
  const handleRollUpSelect = (value: number) => {
    dispatch(setStockData([]));
    dispatch(setUpdateStockData([]));
    setSelectedRollUp(value);
    setSelectedRollDown(null); // ✅ reset opposite
    adjustAllStrikePrices("increase", value);
  };

  const handleRollDownSelect = (value: number) => {
    dispatch(setStockData([]));
    dispatch(setUpdateStockData([]));
    setSelectedRollDown(value);
    setSelectedRollUp(null); // ✅ reset opposite
    adjustAllStrikePrices("decrease", value);
  };

  return (
    <div className="flex flex-row gap-4  max-sm:gap-2">
      {" "}
      <RollDropdown
        label="Roll Up"
        direction="increase"
        onSelect={(roll) => handleRollUpSelect(roll)}
        setSelectedRollUp={setSelectedRollUp}
        selectedRollUp={selectedRollUp}
      />
      <RollDropdown
        label="Roll Down"
        direction="decrease"
        onSelect={(roll) => handleRollDownSelect(roll)}
        setSelectedRollUp={setSelectedRollDown}
        selectedRollUp={selectedRollDown}
      />
    </div>
  );
};

export default RollUpDown;
