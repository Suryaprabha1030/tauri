import React, { Dispatch, SetStateAction } from "react";
import { lotNumbers } from "../optionFuturesUtil/newStrategyUtil";
import { getFutureData, getOptionData } from "@/lib/redux/slices/AnalyzerSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { getMultiplier } from "@/lib/redux/slices/OptionChainSlice";

interface multiplierProps {}
const Multiplier: React.FC<multiplierProps> = ({}) => {
  const dispatch = useDispatch();
  const optionDatas = useSelector(
    (state: RootState) => state.analyzer.optionDataList
  );
  const futureDatas = useSelector(
    (state: RootState) => state.analyzer.futureDataList
  );

  const multiplier = useSelector(
    (state: RootState) => state.optionChain.multiplier
  );
  const handleMultiplierChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newMultiplier = parseInt(event.target.value, 10);
    const commonUpdatedData = (prevCommonData: { [key: string]: any }) => {
      const updatedCommonData: { [key: string]: any } = { ...prevCommonData };

      for (const key in updatedCommonData) {
        if (updatedCommonData[key]) {
          const currentMultiplier = multiplier;
          const previousInitialLotSize = updatedCommonData[key].lots;
          const currentlotscalc = previousInitialLotSize / currentMultiplier;
          updatedCommonData[key] = {
            ...updatedCommonData[key],
            multiplier: newMultiplier,
            lots: Math.round(currentlotscalc * newMultiplier),
            initialLotSize: Math.round(currentlotscalc) / newMultiplier,
          };
        }
      }

      return updatedCommonData;
    };

    dispatch(
      getOptionData({ optionData: { ...commonUpdatedData(optionDatas) } })
    );
    dispatch(
      getFutureData({ futureData: { ...commonUpdatedData(futureDatas) } })
    );
    dispatch(getMultiplier(newMultiplier));
  };
  return (
    <div className="flex flex-row items-center justify-center  text-[0.8rem] font-normal max-xl:items-end max-sm:hidden sm:max-xl:gap-2 ">
      Multiplier:&nbsp;
      <select
        id="multiplier"
        className="h-6 w-[3.5rem] rounded-lg border border-gray-300 bg-gray-50  px-1 py-1 text-center text-[0.78rem] text-gray-900 scrollbar-thin focus:border-blue-500 focus:ring-blue-500 sm:max-xl:w-[3rem]"
        value={multiplier}
        onChange={(e: any) => handleMultiplierChange(e)}
        onMouseDown={(e) => e.stopPropagation()}
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        {lotNumbers.map((num: any) => {
          const value = num + 1;
          return (
            <option key={value} value={value}>
              {value}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Multiplier;
