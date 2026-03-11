import { RootState } from "@/lib/redux/Store";
import Image from "next/image";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getHashKey } from "./optionFuturesUtil/strategyUtil";
import {
  expiryFutTransformData,
  FutPayloadTransformData,
} from "./optionFuturesUtil/legUtil";
import {
  getFutureData,
  setSandboxDataObj,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";
import { lotNumbers } from "./optionFuturesUtil/newStrategyUtil";
import {
  getFutBuyClassLive,
  getFutSellClassLive,
} from "@/lib/util/analyzer/futureUtil/futUtil";
import { handlePopUp } from "@/lib/util/analyzer/handleSelect";
import CandleIcon from "./CandleIcon";
import {
  setChartIconClicked,
  setChartPanel,
  setSymbolIdentifier,
} from "@/lib/redux/slices/ChartsSlice";
import { getTempInputValues } from "@/lib/redux/slices/OptionChainSlice";

interface FutureStocksProps {
  setEntryPriceData: Dispatch<React.SetStateAction<any>>;
}

const FutureStocks: React.FC<FutureStocksProps> = ({ setEntryPriceData }) => {
  const [showComponent, setShowComponent] = useState(false);
  const [futureSymbol, setFutureSymbol] = useState([]);
  const futureStock = useSelector(
    (state: RootState) => state.strategy.indexFutureData,
  );
  const futureDatas: any = useSelector(
    (state: RootState) => state.analyzer.futureDataList,
  );
  const dispatch = useDispatch();
  const spotPriceInfo = useSelector(
    (state: RootState) => state.strategy.spotPriceData,
  );
  const indexObjData: any = useSelector(
    (state: RootState) => state.strategy.indexObj,
  );

  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );

  const FuttargetltpData: any = useSelector(
    (state: RootState) => state.analyzer.FutTargetLtpData,
  );
  const SandboxData: any = useSelector(
    (state: RootState) => state.analyzer.setSandboxData,
  );
  const inputRef = useRef<any>(1);
  const reset = useSelector((state: RootState) => state.optionChain.reset);

  useEffect(() => {
    if (futureStock && futureStock.length > 0 && spotPriceInfo != null) {
      const sort = [...futureStock].sort((a: any, b: any) => {
        const dateA = new Date(
          `${a.expiry.slice(5)}-${a.expiry.slice(2, 5)}-${a.expiry.slice(0, 2)}`,
        );
        const dateB = new Date(
          `${b.expiry.slice(5)}-${b.expiry.slice(2, 5)}-${b.expiry.slice(0, 2)}`,
        );
        return dateA.getTime() - dateB.getTime(); // Compare timestamps
      });
      setFutureSymbol(sort);
      const tData = expiryFutTransformData(FutPayloadTransformData(sort));

      let hasChanges = false;
      const updateCommonData = (
        prevCommonData: { [key: string]: any },
        tData: { [key: string]: any },
      ) => {
        const updatedCommonData = { ...prevCommonData };
        setEntryPriceData({});
        dispatch(getTempInputValues({}));

        Object.entries(tData).forEach(([key, value]) => {
          if (FuttargetltpData && prevCommonData[key]) {
            if (prevCommonData[key].ltp !== value.ltp) {
              updatedCommonData[key] = {
                ...prevCommonData[key],
                ltp: value.ltp,
                target_ltp: value.ltp,
              };
              hasChanges = true;
            }
          }
        });

        return hasChanges ? updatedCommonData : prevCommonData;
      };

      // Create the updated data
      const newCommonData = updateCommonData(FuttargetltpData, tData);

      // Dispatch to Redux if there are changes
      // if (hasChanges) {
      dispatch(getFutureData({ futureData: newCommonData }));
      // }
    }
  }, [reset]);

  useEffect(() => {
    if (futureStock && futureStock.length > 0 && spotPriceInfo != null) {
      const sort = [...futureStock].sort((a: any, b: any) => {
        const dateA = new Date(
          `${a?.expiry?.slice(5)}-${a?.expiry?.slice(2, 5)}-${a?.expiry?.slice(0, 2)}`,
        );
        const dateB = new Date(
          `${b?.expiry?.slice(5)}-${b?.expiry?.slice(2, 5)}-${b?.expiry?.slice(0, 2)}`,
        );
        return dateA.getTime() - dateB.getTime(); // Compare timestamps
      });
      setFutureSymbol(sort);
      const tData = expiryFutTransformData(
        FutPayloadTransformData(futureStock),
      );
      let hasChanges = false;
      const updateCommonData = (
        prevCommonData: { [key: string]: any },
        tData: { [key: string]: any },
      ) => {
        const updatedCommonData = { ...prevCommonData };

        Object.entries(tData).forEach(([key, value]) => {
          if (FuttargetltpData && prevCommonData[key]) {
            if (
              prevCommonData[key].ltp !== value.ltp &&
              prevCommonData[key].ltp == prevCommonData[key].target_ltp
            ) {
              updatedCommonData[key] = {
                ...prevCommonData[key],
                ltp: value.ltp,
                target_ltp: value.ltp,
              };
              hasChanges = true;
            }
          }
        });

        return hasChanges ? updatedCommonData : prevCommonData;
      };

      // Create the updated data

      const newCommonData = updateCommonData(FuttargetltpData, tData);

      // Dispatch to Redux if there are changes
      if (hasChanges) {
        dispatch(getFutureData({ futureData: newCommonData }));
      }
    }
  }, [spotPriceInfo]);

  const showFuture = () => {
    setShowComponent(!showComponent);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!document.querySelector(".dropdown-containerFut")?.contains(target)) {
        setShowComponent(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect =
    (hashkey: any, element: any, transactionType: string) => () => {
      dispatch(showPositionTable(false));
      dispatch(showStrategyTable(true));
      dispatch(showPnlTable(false));
      dispatch(showDraftPositions(false));
      const BuySellData = { ...futureDatas };
      const addData = { ...element };
      addData.transaction_type = transactionType;
      // addData.lot_size = 25;
      addData.option_type = "FUT";
      addData.target_ltp = element.ltp;

      if (
        (element.is_selected && element.transaction_type !== transactionType) ||
        !element.is_selected
      ) {
        addData.lots = 1;
      }

      if (futureDatas[hashkey]) {
        // If the transaction type is the same as the one selected
        if (futureDatas[hashkey].transaction_type === transactionType) {
          delete BuySellData[hashkey];
          dispatch(getFutureData({ futureData: { ...BuySellData } }));
        } else {
          // Handle the case where the transaction type is different
          if (element.transaction_type != transactionType) {
            // Remove the entry if a different type was selected previously
            delete BuySellData[hashkey];
          }
          // Add or update the element with the new transaction type
          BuySellData[hashkey] = addData;
          dispatch(getFutureData({ futureData: { ...BuySellData } }));
        }
      } else {
        // Handle the case where commonData does not have the key
        BuySellData[hashkey] = addData;
        dispatch(getFutureData({ futureData: { ...BuySellData } }));
      }
    };
  useEffect(() => {
    if (SandboxData && Object.entries(SandboxData).length > 0) {
      const updatedFutureData = { ...futureDatas };

      // Iterate through SandboxData to update matching identifiers in futureDatas
      Object.keys(SandboxData).forEach((identifier) => {
        if (updatedFutureData[identifier]) {
          // If transaction type is the same, update the lots
          if (
            updatedFutureData[identifier].transaction_type ===
            SandboxData[identifier].transaction_type
          ) {
            updatedFutureData[identifier] = {
              ...updatedFutureData[identifier],
              lots: SandboxData[identifier].lots, // Update the lots
            };
          } else {
            // If the transaction type is different, overwrite the data
            updatedFutureData[identifier] = {
              ...updatedFutureData[identifier],
              lots: SandboxData[identifier].lots,
              transaction_type: SandboxData[identifier].transaction_type,
            };
          }
        } else if (SandboxData[identifier].option_type === "FUT") {
          // Add new identifier only if option_type is "FUT"
          updatedFutureData[identifier] = SandboxData[identifier];
        }
      });

      // Dispatch the updated future data
      dispatch(getFutureData({ futureData: { ...updatedFutureData } }));
      dispatch(setSandboxDataObj({ setSandboxData: {} }));
    }
  }, [SandboxData]); // This will run whenever SandboxData changes

  const LivehandleUpdateLots =
    (hashkey: string, element: any) => (event: any) => {
      const BuySellData: any = { ...futureDatas };

      const addData = { ...BuySellData[hashkey] };
      addData.lots = parseInt(event.target.value);

      if (element.is_selected) {
        addData.old_lots = element.lots;
      }

      BuySellData[hashkey] = addData;

      dispatch(getFutureData({ futureData: { ...BuySellData } }));
    };

  return (
    <div className="relative z-30 flex cursor-pointer items-center justify-center gap-1 bg-white max-sm:h-[1.3rem] max-sm:w-[3rem] sm:max-xl:m-1 sm:max-md:h-[1.5rem] sm:max-md:w-[3.8rem] md:max-2xl:w-[4.5rem] md:max-xl:h-[1.5rem] xl:h-[1.8rem] 2xl:w-[5rem]">
      <div
        className="flex w-full cursor-pointer items-center justify-center max-xl:rounded-2xl max-xl:border-[1px] max-xl:border-solid max-xl:border-z-green-500 max-md:gap-[0.1rem] max-sm:m-1 max-sm:h-[1rem] sm:h-full sm:max-xl:pr-[0.2rem] sm:max-xl:pt-[0.1rem] md:max-xl:gap-[0.2rem] xl:gap-1"
        onClick={showFuture}
      >
        <img
          src="/svg/plusSymbol.svg"
          className=" relative h-[1rem] w-[1rem] cursor-pointer max-sm:h-[0.7rem] max-sm:w-[0.7rem] sm:max-xl:h-[0.9rem] sm:max-xl:w-[0.9rem]"
          width="20"
          height="20"
          alt="plus"
        />
        <span className="text-[0.8rem] max-sm:text-[0.6rem] sm:max-xl:text-[0.75rem]">
          FUT
        </span>
      </div>
      {futureSymbol && showComponent ? (
        <div className=" dropdown-containerFut absolute right-0 top-9 z-30 flex flex-col items-start justify-start overflow-y-auto rounded-lg bg-white text-[0.6rem]  text-black shadow-lg max-xl:scrollbar-none max-sm:h-[10rem] max-sm:w-[15rem]  sm:h-[11rem] sm:w-[20rem] xl:scrollbar-none">
          <table className="dropdown-containerFut relative h-full w-full overflow-y-auto border-2 border-z-blue-100 bg-white text-center text-[0.5rem] font-medium text-black shadow-lg">
            <thead className="dropdown-containerFut sticky -top-1 z-[11] bg-white uppercase text-gray-400 max-sm:text-[0.6rem] sm:text-[0.7rem] ">
              <tr className="border-b">
                <th
                  scope="col"
                  className="font-tableHead max-sm:px-0.5 max-sm:py-1 sm:px-1 sm:py-2"
                >
                  Expiry
                </th>
                <th
                  scope="col"
                  className="font-tableHead max-sm:px-0.5 max-sm:py-1 sm:px-1 sm:py-2"
                >
                  LTP
                </th>
                <th
                  scope="col"
                  className="font-tableHead max-sm:px-0.5 max-sm:py-1 sm:px-1 sm:py-2"
                >
                  b/s
                </th>
              </tr>
            </thead>
            <tbody>
              {futureSymbol.map((option: any, index: any) => {
                const key = option.symbol;

                const LiveselectedDataForFut =
                  futureDatas[getHashKey(option.symbol, "FUT", option.expiry)];

                return (
                  <>
                    <tr
                      key={index}
                      className=" border-b text-center font-table text-black max-sm:text-[0.6rem] sm:text-[0.65rem]"
                    >
                      <td className="whitespace-nowrap max-sm:px-0.5 max-sm:py-1 sm:px-1 sm:py-2">
                        {option.expiry}
                      </td>
                      <td className="whitespace-wrap text-black max-sm:px-0.5 max-sm:py-1 sm:px-1 xl:py-2">
                        {/* {option.ltp}{" "} */}
                        {webSocketDataRead &&
                          webSocketDataRead[option?.identifier]}
                      </td>
                      <td className=" whitespace-nowrap max-sm:px-0.5 max-sm:py-1 sm:px-1 sm:py-2">
                        <div className="flex flex-row items-center justify-center gap-1 ">
                          <button
                            className={`max-md:h-4 max-md:w-4 md:max-xl:h-5 md:max-xl:w-5 ${getFutBuyClassLive(
                              futureDatas,
                              getHashKey(key, "FUT", option.expiry),
                            )} `}
                            onClick={handleSelect(
                              getHashKey(key, "FUT", option.expiry),
                              option,
                              "LONG",
                            )}
                          >
                            B
                          </button>
                          <button
                            className={`max-md:h-4 max-md:w-4 md:max-xl:h-5 md:max-xl:w-5 ${getFutSellClassLive(
                              futureDatas,
                              getHashKey(key, "FUT", option.expiry),
                            )} `}
                            onClick={handleSelect(
                              getHashKey(key, "FUT", option.expiry),
                              option,
                              "SHORT",
                            )}
                          >
                            S
                          </button>

                          {/* Only visible on xl and above-xl screens and has different way of showing TV chart */}
                          <span className="hidden xl:block">
                            <CandleIcon
                              className="flex cursor-pointer items-center justify-center rounded  bg-white max-md:h-4 max-md:w-4 md:h-[1.35rem] md:w-[1.35rem]  "
                              onClick={() => {
                                dispatch(setChartIconClicked(true));
                                dispatch(setChartPanel(true));
                                dispatch(
                                  setSymbolIdentifier(option?.identifier),
                                );
                              }}
                            />
                          </span>
                          <span className="block xl:hidden">
                            {/* Only visible on below-xl screens and uses usual way of showing TV chart */}
                            <CandleIcon
                              className="flex cursor-pointer items-center justify-center rounded  bg-white max-md:h-4 max-md:w-4 md:h-[1.35rem] md:w-[1.35rem]  "
                              onClick={() => {
                                dispatch(setChartIconClicked(true));
                                handlePopUp(option, dispatch);
                              }}
                            />
                          </span>
                        </div>
                        {LiveselectedDataForFut && (
                          <div className="W-full mt-2  flex items-center justify-center">
                            <select
                              id="stockLots"
                              ref={inputRef}
                              className="rounded-lg border border-gray-300 bg-gray-50 text-center max-sm:w-[2.5rem] max-sm:px-0.5 max-sm:py-0.5 max-sm:text-[0.55rem] sm:text-[0.65rem] xl:w-[3rem] xl:px-1 xl:py-1"
                              value={LiveselectedDataForFut?.lots || 1} // Fallback to 1 if lots is undefined
                              onChange={(event) => {
                                const selectedValue = parseInt(
                                  event.target.value,
                                  10,
                                ); // Convert value to number
                                LivehandleUpdateLots(
                                  getHashKey(key, "FUT", option.expiry), // Correct hash key
                                  {
                                    ...LiveselectedDataForFut,
                                    lots: selectedValue, // Pass the updated lots value
                                  },
                                )(event); // Pass the event to the curried function
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
                          </div>
                        )}
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default FutureStocks;
