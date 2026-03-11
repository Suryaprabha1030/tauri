import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import ChangeCheckData from "./ChangeCheckData";
import ChangeOptionType from "./ChangeOptionType";
import ChangeLots from "./ChangeLots";
import ChangeStrikePrice from "./changeStrikePrice";
import ChangeTargetPrice from "./ChangeTargetPrice";
import DisplayHandleSellButton from "../../buySellButton/DisplayHandleSellButton";
import DeleteButton from "./DeleteButton";
import { updateTransactionType } from "../optionFuturesUtil/newStrategyUtil";
import { getFutureData, getOptionData } from "@/lib/redux/slices/AnalyzerSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import IVCounter from "./IVCounter";

interface NewStrategyDisplayProps {
  copiedData: { [key: string]: any };
  checkedRows: any;
  setChecked: Dispatch<SetStateAction<any>>;
  setCheckedRows: Dispatch<SetStateAction<any>>;
  checked: boolean;
  setCopiedData: Dispatch<SetStateAction<{}>>;
  initialLotSizes: any;
  min: any;
  decreaser: any;
  max: any;
  setEntryPriceData: React.Dispatch<React.SetStateAction<any>>;
  query: any;
}

const NewStrategyDisplay: React.FC<NewStrategyDisplayProps> = ({
  copiedData,
  checkedRows,
  setChecked,
  setCheckedRows,
  checked,
  setCopiedData,
  initialLotSizes,
  min,
  decreaser,
  max,
  setEntryPriceData,
  query,
}) => {
  const dispatch = useDispatch();
  const optionDatas: any = useSelector(
    (state: RootState) => state.analyzer.optionDataList
  );
  const futureDatas: any = useSelector(
    (state: RootState) => state.analyzer.futureDataList
  );

  const optionChainData: any = useSelector(
    (state: RootState) => state.strategy.ltpData
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  const changeTransaction = (
    key: any,
    transactionType: "LONG" | "SHORT",
    actionType: "BUY" | "SELL"
  ) => {
    const futUpdatedData = updateTransactionType(
      futureDatas,
      key,
      transactionType,
      actionType
    );

    const commonUpdatedData = updateTransactionType(
      optionDatas,
      key,
      transactionType,
      actionType
    );

    dispatch(getFutureData({ futureData: { ...futUpdatedData } }));

    if (optionDatas[key]) {
      dispatch(getOptionData({ optionData: { ...commonUpdatedData } }));
    }
  };
  return (
    <tbody>
      {Object.entries(copiedData).map(([key, option]: any) => (
        <tr
          key={key}
          className="h-8 w-full border-b text-center text-[0.78rem] font-table max-sm:text-[0.58rem] xl:max-2xl:h-[3rem] "
        >
          <td className="cursor-pointer whitespace-nowrap py-[0.1rem] sm:max-xl:py-[0.8rem] xl:max-2xl:h-7 xl:max-2xl:py-[0.6rem] ">
            <ChangeCheckData
              checkedRows={checkedRows}
              keyData={key}
              setChecked={setChecked}
              setCheckedRows={setCheckedRows}
              checked={checked}
            />
          </td>

          <td className="whitespace-nowrap py-[0.1rem] max-md:px-0.5 sm:max-xl:py-[0.8rem] md:px-1 xl:max-2xl:py-[0.6rem]">
            <ChangeOptionType
              option={option}
              optionChainData={optionChainData[query]}
              keyData={key}
              query={query}
            />
          </td>
          {option.option_type == "FUT" ? (
            <td></td>
          ) : (
            <td className="whitespace-nowrap  py-[0.1rem] max-md:px-0.5 max-sm:hidden sm:max-xl:py-[0.8rem] md:max-xl:px-1 xl:max-2xl:py-[0.6rem] 2xl:px-1">
              {/* IV */}

              <IVCounter
                setCopiedData={setCopiedData}
                keyData={key}
                option={option}
              />
            </td>
          )}

          {option.option_type == "FUT" ? (
            <td></td>
          ) : (
            <td className="whitespace-wrap flex w-full items-center justify-center  max-sm:h-7 sm:max-xl:mt-0.5 sm:max-xl:h-7 sm:max-xl:h-full sm:max-xl:py-[0.8rem] md:px-1 xl:max-2xl:mt-[0.4rem] xl:max-2xl:py-[0.6rem] 2xl:h-7">
              <ChangeStrikePrice
                keyData={key}
                option={option}
                max={max}
                decreaser={decreaser}
                min={min}
                optionChainData={optionChainData[query]}
              />
            </td>
          )}
          <td className="whitespace-nowrap py-[0.1rem] max-md:px-0.5 sm:max-xl:py-[0.8rem] md:px-1 xl:max-2xl:py-[0.6rem] ">
            <ChangeLots
              copiedData={copiedData}
              keyData={key}
              initialLotSizes={initialLotSizes}
              option={option}
              setCopiedData={setCopiedData}
            />
          </td>

          <td className="cursor-pointer whitespace-nowrap py-[0.1rem] max-md:px-0.5 sm:max-xl:py-[0.8rem] md:px-1 xl:max-2xl:py-[0.6rem]">
            <ChangeTargetPrice
              option={option}
              setEntryPriceData={setEntryPriceData}
              copiedData={copiedData}
            />
          </td>

          <td className="cursor-pointer whitespace-nowrap py-[0.1rem] max-md:px-0.5 sm:max-xl:py-[0.8rem] md:px-1 xl:max-2xl:py-[0.6rem]">
            <DisplayHandleSellButton
              type={option?.transaction_type}
              handleChange={() => {
                option?.transaction_type == "LONG"
                  ? changeTransaction(key, "SHORT", "SELL")
                  : changeTransaction(key, "LONG", "BUY");
              }}
              handleDoubleClick={(event: any) => {
                event.stopPropagation();
              }}
            />
          </td>

          <td className="cursor-pointer">
            <DeleteButton setCopiedData={setCopiedData} keyData={key} />
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default NewStrategyDisplay;
