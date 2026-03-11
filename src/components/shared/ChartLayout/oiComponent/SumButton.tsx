import { getStraddleChartData } from "@/lib/redux/slices/StrategyChartSlice";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";

interface SumButtonProps {
  setIsSumSelected: Dispatch<SetStateAction<boolean>>;
  isSumSelected: boolean;
  setStraddleChartData?: Dispatch<SetStateAction<any>>;
}

const SumButton: React.FC<SumButtonProps> = ({
  isSumSelected,
  setIsSumSelected,
  setStraddleChartData,
}) => {
  const dispatch = useDispatch();
  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id="checkbox"
        checked={isSumSelected}
        onChange={() => {
          setIsSumSelected(!isSumSelected),
            setStraddleChartData && setStraddleChartData({}),
            dispatch(getStraddleChartData({}));
        }}
        className="h-4 w-4 cursor-pointer"
      />
      <span className="text-[0.85rem]">Sum</span>
    </div>
  );
};

export default SumButton;
