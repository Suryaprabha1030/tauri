import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
} from "react";
import { futReverseTransformData } from "./optionFuturesUtil/strategyUtil";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import {
  getFutTargetltpData,
  getOptTargetltpData,
} from "@/lib/redux/slices/AnalyzerSlice";
import { strategyChartPayload } from "@/lib/redux/slices/ClearAnalyzerSlice";
import {
  getMinimumExpiryDate,
  hcfOfTwoNumbers,
} from "./optionFuturesUtil/newStrategyUtil";
import TabEmptyInfo from "./emptyInfo/TabEmptyInfo";
import NewStrategyTableHeader from "./NewStrategyTable/NewStrategyTableHeader";
import NewStrategyFooter from "./NewStrategyTable/NewStrategyFooter";
import { handleCombineData } from "@/lib/util/analyzer/handleNewStrategyUtil";
import NewStrategyDisplay from "./NewStrategyTable/NewStrategyDisplay";
import { setOiChartCall } from "@/lib/redux/slices/PayoffChartSlice";
import {
  getMultiOiLoad,
  getPayOffChartPayLoad,
  getStrangleOiLoad,
} from "@/lib/redux/slices/StrategyChartSlice";
import {
  getMultiplier,
  getTempInputValues,
} from "@/lib/redux/slices/OptionChainSlice";
import Image from "next/image";
import { mergePositionsAndStrategy } from "./optionFuturesUtil/legUtil";

interface OptionData {
  symbol: string;
  strike_price: string;
  expiry: string;
  lots: number;
  ltp: number;
  transaction_type?: string;
}

interface NewStrategyLegTableProps {
  premium: number;
  setCheckedOptionData: Dispatch<SetStateAction<{}>>;
  copiedData: { [key: string]: any };
  setCopiedData: Dispatch<SetStateAction<{}>>;
  onMinExpiryDateChange: (minDate: Date | null) => void;
  apiKey: any;
  setEntryPriceData: Dispatch<React.SetStateAction<any>>;
  entryPriceData: any;
  checkedOptionData: {};
  DraftName: any;
  draftData: {};
  setDraftData: Dispatch<React.SetStateAction<{}>>;
  strategyTable: boolean;
  query: any;
  setAddTable: Dispatch<React.SetStateAction<any>>;
  setActive: Dispatch<React.SetStateAction<any>>;

  orderExecuteFromOptionChain: boolean;
  setOrderExecuteFromOptionChain: Dispatch<React.SetStateAction<boolean>>;
}

const NewStrategyLegTable: React.FC<NewStrategyLegTableProps> = ({
  setCheckedOptionData,
  copiedData,
  setCopiedData,
  premium,
  onMinExpiryDateChange,
  apiKey,
  setEntryPriceData,
  entryPriceData,
  checkedOptionData,

  DraftName,
  draftData,
  setDraftData,
  strategyTable,
  query,
  setAddTable,
  setActive,

  orderExecuteFromOptionChain,
  setOrderExecuteFromOptionChain,
}) => {
  const [checkedRows, setCheckedRows] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [checked, setChecked] = useState(true);
  const [allChecked, setAllChecked] = useState(true);
  const [isAllCheckedRows, setIsAllCheckedRows] = useState(false);
  const prevCopiedDataRef = useRef<any>(null);
  const [initialLotSizes, setInitialLotSizes] = useState<{
    [key: string]: number;
  }>({});
  const multiplier = useSelector(
    (state: RootState) => state.optionChain.multiplier
  );

  const prevMultiplierRef = useRef(multiplier);
  const [max, setMax] = useState<null>(null);
  const [min, setMin] = useState<null>(null);
  const [buttonId, setButtonId] = useState("");
  const [smartApi, setSmartApi] = useState(false);

  const dispatch = useDispatch();
  const optionDatas: any = useSelector(
    (state: RootState) => state.analyzer.optionDataList
  );
  const futureDatas: any = useSelector(
    (state: RootState) => state.analyzer.futureDataList
  );
  const positionDatas = useSelector(
    (state: RootState) => state.analyzer.PositionDataList
  );

  const [positions, setPositions] = useState({});
  const DraftPositions = useSelector(
    (state: RootState) => state.analyzer.setShowDraftPositions
  );

  const dataKey = useSelector((state: RootState) => state.optionChain.dataKey);
  const decreaser = useSelector(
    (state: RootState) => state.optionChain.decreaser
  );
  const tempInputValues = useSelector(
    (state: RootState) => state.optionChain.tempInputValues
  );
  const [addLegHoverImage, setaddLegHoverImage] = useState(true);
  const [orderExecuted, setOrderExecuted] = useState<boolean>(false);

  useEffect(() => {
    setPositions(positionDatas);
  }, [positionDatas]);

  // for handle option and future datas
  useEffect(() => {
    handleCombineData({
      optionDatas,
      futureDatas,
      checkedRows,
      multiplier,
      setCheckedRows,
      setInitialLotSizes,
      prevCopiedDataRef,
      prevMultiplierRef,
    });
  }, [optionDatas, futureDatas]);

  const hcfOfArray = (numbers: any) => {
    return numbers.reduce((hcf: any, number: any) =>
      hcfOfTwoNumbers(hcf, number)
    );
  };
  //  set multiplier
  useEffect(() => {
    if (prevCopiedDataRef.current && copiedData) {
      const currentLotSizes = Object.keys(copiedData).map(
        (key) => copiedData[key]?.lots
      );

      // Calculate the HCF of the current lot sizes
      if (currentLotSizes.length > 0) {
        const newHCF = hcfOfArray(currentLotSizes);
        dispatch(getMultiplier(newHCF)); // Update the multiplier with the new HCF
      }
    }

    // Update the previous copied data ref after processing changes
    prevCopiedDataRef.current = { ...copiedData };
    setOrderExecuted(false); //To stop navigate to position tab if positions data arrives
  }, [copiedData]);

  // checked data collect
  const getCheckedData: any = () => {
    return Object.entries(copiedData)
      .filter(([key]) => checkedRows[key] || false)
      .reduce(
        (acc, [key, value]: any) => {
          acc[key] = {
            ...value,
            checked: checkedRows[key] || false, // Add checked property
          };
          return acc;
        },
        {} as { [key: string]: OptionData }
      );
  };

  // when row check and uncheck ,apply the header row
  useEffect(() => {
    const allChecked = Object.keys(copiedData).every((key) => checkedRows[key]);
    setIsAllCheckedRows(allChecked);
  }, [copiedData, checked, checkedRows]);

  // if uncheck data need to empty targetltp data
  useEffect(() => {
    if (Object.entries(checkedOptionData).length == 0) {
      dispatch(getOptTargetltpData({ OptTargetLtpData: {} }));
      dispatch(getFutTargetltpData({ FutTargetLtpData: {} }));
    }
  }, [checkedOptionData]);

  // get uncheck data
  const getUncheckedData = () => {
    return Object.entries(copiedData)
      .filter(([key]) => !checkedRows[key] || false)
      .reduce(
        (acc, [key, value]) => {
          acc[key] = {
            ...value,
            checked: checkedRows[key] || false, // Add checked property
          };
          return acc;
        },
        {} as { [key: string]: OptionData }
      );
  };

  // for sandbox data hadling for payoff chart
  useEffect(() => {
    if (DraftPositions != true) {
      const debounceTimer = setTimeout(() => {
        const checkedDatas = getCheckedData();
        const unCheckedDatas = getUncheckedData();
        const futcheckedData: any = {};
        const optCheckedData: any = {};

        Object.entries(checkedDatas).forEach(([key, value]: any) => {
          if (value?.option_type === "FUT") {
            futcheckedData[key] = value;
          } else {
            optCheckedData[key] = value;
          }
        });

        setCheckedOptionData(checkedDatas);

        const comb: any = { ...checkedDatas, ...positionDatas };
        if (
          Object.entries(positionDatas).length === 0 &&
          Object.entries(futureDatas).length === 0 &&
          Object.entries(optionDatas).length === 0
        ) {
          dispatch(setOiChartCall(true));
          dispatch(getPayOffChartPayLoad({}));
          dispatch(getMultiOiLoad([]));
          dispatch(getStrangleOiLoad({})); // Reset the payoff chart payload
        }

        if (Object.entries(comb)?.length !== 0) {
          Object.keys(checkedDatas).forEach((key) => {
            const item = { ...checkedDatas[key] }; // Make a shallow copy of the item
            if (entryPriceData && entryPriceData[item.identifier]) {
              item.target_ltp = entryPriceData[item.identifier].entryPrice;
              item.ltp = entryPriceData[item.identifier].entryPrice; // Update target_ltp
            }
            checkedDatas[key] = item;
          });

          const optUpdData = {
            ...optCheckedData,
            ...unCheckedDatas,
          };

          const futUpdData = {
            ...futcheckedData,
            ...unCheckedDatas,
          };

          dispatch(getOptTargetltpData({ OptTargetLtpData: optUpdData }));
          dispatch(getFutTargetltpData({ FutTargetLtpData: futUpdData }));

          dispatch(
            getMultiOiLoad(
              Object.values(comb)?.map(
                (m: any) => `${m?.strike_price}#${m?.option_type}`
              )
            )
          );
          const changePayloadStrangle = (comb: any) => {
            let data: any = {};
            Object.values(comb)?.forEach((m: any) => {
              const keyData = `${m?.strike_price}.0#${m?.option_type}#${m?.expiry_date}`;
              data[keyData] = true;
            });
            return data;
          };
          dispatch(getStrangleOiLoad(changePayloadStrangle(comb)));
          const fixedData = mergePositionsAndStrategy(
            positionDatas,
            checkedDatas
          );

          // const futTransForm = futReverseTransformData(comb);
          const futTransForm = futReverseTransformData(
            mergePositionsAndStrategy(positionDatas, checkedDatas)
          );
          dispatch(getPayOffChartPayLoad(futTransForm));
          strategyChartPayload({ strategyChartPayloadList: futTransForm });
        }
      }, 1);

      return () => clearTimeout(debounceTimer);
    }
  }, [checkedRows, positions, entryPriceData, DraftPositions]);

  // set min & max for incre/decre strike price
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

  // target prive value set
  useEffect(() => {
    const copiedDataidentifiers = Object.values(copiedData).map(
      (item) => item.identifier
    );

    const updatedEntryPriceData = { ...entryPriceData };
    const updatedTempInputValues = { ...tempInputValues };

    // Check if tokens in entryPriceData exist in copiedData
    if (entryPriceData && Object.entries(entryPriceData).length > 0) {
      Object.keys(entryPriceData).forEach((identifier) => {
        if (!copiedDataidentifiers.includes(identifier)) {
          delete updatedEntryPriceData[identifier]; // Remove identifier from entryPriceData
          delete updatedTempInputValues[identifier]; // Also remove identifier from tempInputValues
        }
      });
    }
    // Update entryPriceData and tempInputValues if needed
    if (
      entryPriceData &&
      Object.keys(updatedEntryPriceData).length !==
        Object.keys(entryPriceData).length
    ) {
      setEntryPriceData(updatedEntryPriceData);
      // Ensure tempInputValues matches entryPriceData
      dispatch(getTempInputValues(updatedTempInputValues));
    }
  }, [copiedData, entryPriceData, tempInputValues]);

  // get mindata from stratgy and position or startegy or positions
  useEffect(() => {
    if (DraftPositions != true) {
      const checkedDatas = getCheckedData();
      setCheckedOptionData(checkedDatas);
      const filteredPositionDatas = Object.fromEntries(
        Object.entries(positionDatas).filter(
          ([, value]: [string, any]) => value.transaction_type !== "EXITED"
        )
      );
      const comb: any = { ...checkedDatas, ...filteredPositionDatas };
      onMinExpiryDateChange(getMinimumExpiryDate(comb));
    }
  }, [checked, allChecked, checkedRows, DraftPositions, positionDatas]);

  useEffect(() => {
    const checkedDraftData = getCheckedData();
    setDraftData(checkedDraftData);
  }, [checked, allChecked, checkedRows]);

  return (
    <div
      className={`relative h-full   transition-opacity duration-500 ease-in-out max-sm:w-full ${
        strategyTable ? "visible opacity-100" : "hidden opacity-0"
      }`}
    >
      <div className="flex  h-full w-full flex-col items-center justify-start gap-2">
        {Object.keys(copiedData).length > 0 ? (
          <>
            <div
              className={` max-h-[70%] w-full overflow-y-scroll max-xl:scrollbar-none max-sm:max-h-[11rem] sm:max-xl:max-h-[23rem] xl:scrollbar-thin xl:scrollbar-track-gray-100 xl:scrollbar-thumb-z-br-gray`}
            >
              <table className="w-full overflow-y-auto border-2 border-z-blue-100 text-center text-[0.55rem] xl:shadow-lg">
                <NewStrategyTableHeader
                  isAllCheckedRows={isAllCheckedRows}
                  setAllChecked={setAllChecked}
                  allChecked={allChecked}
                  setCheckedRows={setCheckedRows}
                  copiedData={copiedData}
                  setIsAllCheckedRows={setIsAllCheckedRows}
                />
                <NewStrategyDisplay
                  copiedData={copiedData}
                  checkedRows={checkedRows}
                  setChecked={setChecked}
                  setCheckedRows={setCheckedRows}
                  checked={checked}
                  setCopiedData={setCopiedData}
                  initialLotSizes={initialLotSizes}
                  min={min}
                  decreaser={decreaser}
                  max={max}
                  setEntryPriceData={setEntryPriceData}
                  query={query}
                />
              </table>
            </div>

            <NewStrategyFooter
              premium={premium}
              draftData={draftData}
              DraftName={DraftName}
              setCheckedOptionData={setCheckedOptionData}
              setSmartApi={setSmartApi}
              getCheckedData={getCheckedData()}
              setButtonId={setButtonId}
              setCheckedRows={setCheckedRows}
              orderExecuted={orderExecuted}
              setOrderExecuted={setOrderExecuted}
              setAddTable={setAddTable}
              setActive={setActive}
              orderExecuteFromOptionChain={orderExecuteFromOptionChain}
              setOrderExecuteFromOptionChain={setOrderExecuteFromOptionChain}
              checkedOptionData={checkedOptionData}
            />
          </>
        ) : (
          <>
            <div className="flex w-full flex-col items-center justify-center gap-2 text-center  text-[0.75rem] font-light max-xl:hidden xl:h-[85%]">
              <button
                className={`class-for-touch-event flex items-center justify-center gap-1 rounded-3xl border border-z-green-500 text-[0.75rem] font-medium leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white max-md:hidden max-sm:w-[4.5rem] max-sm:p-1 max-sm:text-[0.65rem] md:h-7 md:max-2xl:w-[5.8rem] xl:p-2  
              `}
                onClick={() => setAddTable(true)}
                onMouseEnter={() => setaddLegHoverImage(false)}
                onMouseLeave={() => setaddLegHoverImage(true)}
              >
                <Image
                  src={
                    addLegHoverImage
                      ? "/svg/plusSymbol.svg"
                      : "/svg/whiteAdd.svg"
                  }
                  width={15}
                  height={15}
                  alt=""
                  className="max-sm:h-[0.6rem] max-sm:w-[0.6rem] md:max-xl:mb-0.5 md:max-xl:h-[0.9rem] md:max-xl:w-[0.9rem]"
                />
                Legs
              </button>
            </div>
            <TabEmptyInfo
              name={` No Data Available`}
              tableName={"NewStrategyTable"}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default React.memo(NewStrategyLegTable);
