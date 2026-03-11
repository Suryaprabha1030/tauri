import {
  setStockData,
  togglePlaceOrderVisibility,
} from "@/lib/redux/slices/PlaceOrder";
import React from "react";
import { useDispatch } from "react-redux";

interface PositionExitAllProps {
  setSmartApi: React.Dispatch<React.SetStateAction<boolean>>;
  setButtonId: React.Dispatch<React.SetStateAction<string>>;
  checkedData: any[];
}

const PositionExitAll: React.FC<PositionExitAllProps> = ({
  setSmartApi,
  setButtonId,
  checkedData,
}) => {
  const dispatch = useDispatch();
  const handleExit = () => {
    setSmartApi(true);
    setButtonId("exit");
    dispatch(togglePlaceOrderVisibility(true));
    const updatedCheckedData = checkedData.map((item: any) => ({
      ...item,
      transaction_type: item.transaction_type === "SHORT" ? "LONG" : "SHORT",
    }));
    dispatch(setStockData(updatedCheckedData));
  };
  return (
    <div className="  py-1 text-center">
      <button
        id="exit"
        className="rounded-3xl border border-red-500 text-[0.75rem] font-medium leading-none text-red-500 hover:bg-red-500 hover:text-white max-md:py-1 max-sm:w-[3rem] max-sm:text-[0.65rem] sm:max-md:w-[4rem] md:w-[5rem] md:py-2 md:max-xl:my-4"
        onClick={() => handleExit()}
      >
        Exit All
      </button>
    </div>
  );
};

export default PositionExitAll;
