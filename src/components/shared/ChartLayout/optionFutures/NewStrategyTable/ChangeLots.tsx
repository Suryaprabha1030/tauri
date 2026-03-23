import React, { useRef } from "react";
import { calculateHCF, lotNumbers } from "../optionFuturesUtil/newStrategyUtil";
import { getFutureData, getOptionData } from "@/lib/redux/slices/AnalyzerSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { getMultiplier } from "@/lib/redux/slices/OptionChainSlice";

const ChangeLots = ({
  option,
  setCopiedData,
  initialLotSizes,
  copiedData,
  keyData,
}:any) => {
  const dispatch = useDispatch();
  const optionDatas: any = useSelector(
    (state: RootState) => state.analyzer.optionDataList
  );
  const futureDatas: any = useSelector(
    (state: RootState) => state.analyzer.futureDataList
  );
  const inputRef = useRef<any>(1);

  const handleLotChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const newLotSize = Math.max(parseInt(event.target.value, 10), 1); // Ensure lot size is not below 1
    setCopiedData((prev: any) => {
      const updatedData: { [key: string]: any } = { ...prev };
      if (updatedData[key]) {
        // Calculate the new lot size based on initial lot size and current multiplier
        const initialLotSize = initialLotSizes[key];
        updatedData[key].lots = newLotSize;
      }
      return updatedData;
    });
    const commonUpdatedData = (prev: { [key: string]: any }) => {
      const updatedData = JSON.parse(JSON.stringify(prev));

      if (updatedData[key]) {
        updatedData[key] = {
          ...updatedData[key],
          lots: newLotSize,
        };
      }
      return updatedData;
    };
    dispatch(
      getOptionData({ optionData: { ...commonUpdatedData(optionDatas) } })
    );
    dispatch(
      getFutureData({ futureData: { ...commonUpdatedData(futureDatas) } })
    );

    const lotSizes = Object.values(copiedData).map((data: any) => data.lots);
    if (lotSizes.length > 0) {
      const newHCF = calculateHCF(lotSizes);
      dispatch(getMultiplier(newHCF));
    }
  };

  return (
    <select
      ref={inputRef}
      className=" w-[3rem] rounded-lg border border-gray-300  bg-gray-50 text-center text-[0.65rem] max-sm:w-[2.5rem] max-sm:px-0.5 max-sm:text-[0.55rem] xl:px-1 xl:max-2xl:text-[0.7rem] "
      value={option.lots}
      onChange={(event: any) => handleLotChange(event, keyData)}
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      {lotNumbers.map((num: any) => {
        const lotValue = num + 1;
        return (
          <option key={lotValue} value={lotValue}>
            {lotValue}
          </option>
        );
      })}
    </select>
  );
};

export default ChangeLots;
