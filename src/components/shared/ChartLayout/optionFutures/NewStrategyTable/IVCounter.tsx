import { getFutureData, getOptionData } from "@/lib/redux/slices/AnalyzerSlice";
import { RootState } from "@/lib/redux/Store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const IVCounter = ({ setCopiedData, keyData, option }) => {
  const dispatch = useDispatch();
  const optionDatas: any = useSelector(
    (state: RootState) => state.analyzer.optionDataList
  );
  const futureDatas: any = useSelector(
    (state: RootState) => state.analyzer.futureDataList
  );

  const updateIVValue = (delta: number, key: string) => {
    setCopiedData((prev: any) => {
      const updatedData: { [key: string]: any } = { ...prev };
      if (updatedData[key]) {
        // Clamp IV between 5 and 20
        const newIV = Math.min(
          Math.max((updatedData[key].iv || 5) + delta, 5),
          20
        );
        updatedData[key].ivValue = newIV;
      }
      return updatedData;
    });

    const commonUpdatedData = (prev: { [key: string]: any }) => {
      const updatedData = JSON.parse(JSON.stringify(prev));
      if (updatedData[key]) {
        const newIV = Math.min(
          Math.max((updatedData[key].ivValue || 5) + delta, 5),
          20
        );
        updatedData[key] = {
          ...updatedData[key],
          ivValue: newIV,
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
  };

  return (
    <div className="whitespace-wrap flex w-full items-center justify-center">
      <button
        className="h-4 w-6 rounded-l  bg-gray-200 text-black hover:bg-gray-300 focus:outline-none max-sm:w-4 "
        onClick={() => updateIVValue(-1, keyData)}
      >
        -
      </button>

      {/* <div className="readonly h-4 w-8 border border-gray-300 bg-red-200  text-center text-[0.75rem] font-letter focus:outline-none focus:ring-2 focus:ring-blue-500 md:max-xl:h-6 md:max-xl:w-40 md:max-xl:px-[0.1rem] ">
        {option?.ivValue}
      </div> */}
      <input
        id={keyData}
        value={option?.ivValue}
        className="readonly h-4  border border-gray-300 text-center focus:outline-none  focus:ring-2 focus:ring-blue-500 max-sm:w-4 sm:w-8 sm:max-md:text-[0.75rem]"
      />
      <button
        className=" h-4 w-6 rounded-r bg-gray-200 text-black hover:bg-gray-300 focus:outline-none max-sm:w-4"
        onClick={() => updateIVValue(1, keyData)}
      >
        +
      </button>
    </div>
  );
};

export default IVCounter;
