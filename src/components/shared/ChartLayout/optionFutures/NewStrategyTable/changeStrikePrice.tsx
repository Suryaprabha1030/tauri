import { getOptionData } from "@/lib/redux/slices/AnalyzerSlice";
import { RootState } from "@/lib/redux/Store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateStrikePrice } from "../optionFuturesUtil/newStrategyUtil";

interface ChangeStrikePriceProps {
  option: any;
  max: any;
  decreaser: any;
  min: any;
  optionChainData: { [key: string]: any };
  keyData: any;
}

const ChangeStrikePrice: React.FC<ChangeStrikePriceProps> = ({
  option,
  max,
  decreaser,
  min,
  optionChainData,
  keyData,
}) => {
  const dispatch = useDispatch();
  const optionDatas: any = useSelector(
    (state: RootState) => state.analyzer.optionDataList
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  const adjustStrikePrice = (
    key: any,
    option: any,
    direction: "increase" | "decrease"
  ) => {
    const input = key;
    const spiltparts = input.split("#");
    const [price, optionType, expiryDate] = spiltparts;

    const boundary = direction === "increase" ? max : min;

    if (price == boundary) {
      return 1;
    }

    const updatedOption = { ...option };
    let strikePrice: any =
      updatedOption.strike_price +
      (direction === "increase" ? decreaser : -decreaser);

    // Find a unique strike price by skipping existing duplicates
    while (optionDatas[`${strikePrice}.0#${optionType}#${expiryDate}`]) {
      strikePrice += direction === "increase" ? decreaser : -decreaser;
    }

    const oldKey = `${updatedOption.strike_price}.0#${optionType}#${expiryDate}`;
    const newKey = `${strikePrice}.0#${optionType}#${expiryDate}`;

    const updateCommonData: {} = updateStrikePrice(
      optionDatas,
      oldKey,
      newKey,
      option.transaction_type,
      optionChainData,
      false,
      webSocketDataRead
    );

    // Dispatch the updated state
    dispatch(getOptionData({ optionData: { ...updateCommonData } }));
  };

  return (
    <>
      <button
        className="h-4 rounded-l bg-gray-200 text-black hover:bg-gray-300 focus:outline-none max-sm:w-2.5 sm:max-xl:flex sm:max-xl:w-4 sm:max-xl:items-center sm:max-xl:justify-center sm:max-md:text-[0.8rem] md:w-5"
        onClick={() => adjustStrikePrice(keyData, option, "decrease")}
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        -
      </button>
      <input
        id={keyData}
        value={option.strike_price}
        className="readonly h-4  border border-gray-300 text-center focus:outline-none  focus:ring-2 focus:ring-blue-500 max-sm:w-10 sm:w-16 sm:max-md:text-[0.75rem] xl:max-2xl:w-12"
      />

      <button
        className="h-4 rounded-r bg-gray-200 text-black hover:bg-gray-300 focus:outline-none max-sm:w-2.5 sm:max-xl:flex sm:max-xl:w-4 sm:max-xl:items-center sm:max-xl:justify-center sm:max-md:text-[0.8rem] md:w-5"
        onClick={() => adjustStrikePrice(keyData, option, "increase")}
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        +
      </button>
    </>
  );
};

export default ChangeStrikePrice;
