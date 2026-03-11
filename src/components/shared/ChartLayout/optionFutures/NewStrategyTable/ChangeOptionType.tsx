import { formatExpiryDate } from "@/lib/util/DateUtil";
import React from "react";
import { updateOptionType } from "../optionFuturesUtil/newStrategyUtil";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { getOptionData } from "@/lib/redux/slices/AnalyzerSlice";

interface ChangeOptionTypeProps {
  option: any;
  optionChainData: { [key: string]: any };
  keyData: any;
  query: any;
}

const ChangeOptionType: React.FC<ChangeOptionTypeProps> = ({
  option,
  optionChainData,
  keyData,
  query,
}) => {
  const optionDatas: any = useSelector(
    (state: RootState) => state.analyzer.optionDataList
  );
  const dispatch = useDispatch();
  const lotSize: any = useSelector(
    (state: RootState) => state.strategy.lotSizeData
  );
  const handleOptionTypeClick = (key: any, option: any) => {
    if (option.option_type == "FUT" || key === optionDatas[key]) {
      return;
    }

    const updatedOption = { ...option };

    const strikePrice = updatedOption.strike_price;
    const oldKey = key;
    const input = key;
    const spiltparts = input.split("#");
    const [price, optionType, expiryDate] = spiltparts;

    const newKey = `${price}#${optionType == "CE" ? "PE" : "CE"}#${expiryDate}`;
    if (Object.hasOwn(optionDatas, newKey)) {
      return;
    }

    const commonUpdatedData: {} = updateOptionType(
      //   optionDatas,
      oldKey,
      newKey,
      option.transaction_type,
      optionChainData,
      optionDatas,
      lotSize[query]
    );

    if (optionDatas[key]) {
      dispatch(getOptionData({ optionData: { ...commonUpdatedData } }));
    }
  };

  return (
    <>
      {formatExpiryDate(option.expiry) || formatExpiryDate(option.expiry_date)}
      <span
        className={`whitespace-nowrap px-1 py-[0.1rem]  ${
          option.option_type == "FUT" ? "" : "cursor-pointer"
        }`}
      >
        <div className="inline-flex h-5 w-7  items-center justify-center rounded-xl border border-2 ">
          <div
            className="flex h-5 w-5 items-center justify-center text-center  text-black"
            onClick={() => handleOptionTypeClick(keyData, option)}
            onDoubleClick={(event: any) => {
              event.stopPropagation();
            }}
          >
            {option.option_type}
          </div>
        </div>
      </span>
    </>
  );
};

export default ChangeOptionType;
