import { RootState } from "@/lib/redux/Store";
import React, { Dispatch, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  optionChainPayload,
  setSelectedStrategy,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";
import Image from "next/image";
import { extractKeywords, groupByCategory } from "./optionFuturesUtil/legUtil";
import ClearStrategy from "./ClearStrategy";
import { strategyTabs } from "@/lib/util/toggleButtonName/toggleButtonNames";
import { formatNumber } from "@/lib/util/DraftUtil";
import {
  getDaysToExpiry,
  getMultiOiLoad,
  getPayOffChartPayLoad,
  getStrangleOiLoad,
} from "@/lib/redux/slices/StrategyChartSlice";
import {
  getReset,
  getTempInputValues,
} from "@/lib/redux/slices/OptionChainSlice";
import RollUpDown from "./RollUpDown";

interface SwitchTabProps {
  setpositionTableData: React.Dispatch<React.SetStateAction<{}>>;
  positionTableData: {};
  query: string;
  pnlValue: any;
  setEntryPriceData: Dispatch<React.SetStateAction<any>>;
  setShowlot: Dispatch<React.SetStateAction<boolean>>;
  showlot: boolean;
  setCheckedOptionData: Dispatch<React.SetStateAction<any>>;
  setExpiryPayload: Dispatch<React.SetStateAction<any>>;
  checkedOptionData: Dispatch<React.SetStateAction<{}>>;
}

const SwitchTab: React.FC<SwitchTabProps> = ({
  setpositionTableData,
  positionTableData,
  query,
  pnlValue,
  setEntryPriceData,
  setShowlot,
  showlot,
  setCheckedOptionData,
  setExpiryPayload,
  checkedOptionData,
}) => {
  const positionsdata = useSelector(
    (state: RootState) => state.strategy.positions,
  );
  const positionGroup = groupByCategory(positionTableData);
  const dispatch = useDispatch();
  const keywords = extractKeywords(positionGroup);
  const strategyTable = useSelector(
    (state: RootState) => state.analyzer.setShowStrategyTable,
  );
  const positionTable = useSelector(
    (state: RootState) => state.analyzer.setShowPositionTable,
  );
  const pnlTable = useSelector(
    (state: RootState) => state.analyzer.setShowPnlTable,
  );
  const DraftPositions = useSelector(
    (state: RootState) => state.analyzer.setShowDraftPositions,
  );

  const [isSpinning, setIsSpinning] = useState(false);

  const targetValue = strategyTabs.find(
    (tab) => tab.activeConditionKey && eval(tab.activeConditionKey),
  )?.label;

  const [selectedValue, setSelectedValue] = useState(targetValue);
  const PnlPositions = useSelector(
    (state: RootState) => state.Position.totalCheckedPnl,
  );
  const [switchValue, setSwitchValue] = useState(false);
  const switchdropdownRef = useRef<any>(null);
  const switchdropdownButtonRef = useRef<any>(null);
  const showTable = useSelector(
    (state: RootState) => state.optionChain.showTable,
  );
  const reset = useSelector((state: RootState) => state.optionChain.reset);
  const positionDatas = useSelector(
    (state: RootState) => state.analyzer.PositionDataList,
  );

  useEffect(() => {
    if (!positionTable && !strategyTable && !pnlTable && !DraftPositions) {
      dispatch(showPositionTable(false));
      dispatch(showStrategyTable(true));
      dispatch(showPnlTable(false));
      dispatch(showDraftPositions(false));
    }
  }, []);

  const showOption = () => {
    dispatch(getPayOffChartPayLoad({}));
    dispatch(getMultiOiLoad([]));
    dispatch(getStrangleOiLoad({}));
    dispatch(showStrategyTable(true));
    dispatch(showPositionTable(false));
    dispatch(showPnlTable(false));
    dispatch(showDraftPositions(false));
    dispatch(setSelectedStrategy({ setselectedStrategy: null }));
  };

  const showPosition = () => {
    dispatch(showPositionTable(true));
    dispatch(showStrategyTable(false));
    dispatch(showPnlTable(false));
    dispatch(showDraftPositions(false));
    dispatch(setSelectedStrategy({ setselectedStrategy: null }));
  };
  const showPnl = () => {
    dispatch(showStrategyTable(false));
    dispatch(showPositionTable(false));
    dispatch(showPnlTable(true));
    dispatch(showDraftPositions(false));
    dispatch(setSelectedStrategy({ setselectedStrategy: null }));
  };
  const handleDraftPositions = () => {
    // dispatch(getDaysToExpiry(null));
    dispatch(showStrategyTable(false));
    dispatch(showPositionTable(false));
    dispatch(showPnlTable(false));
    dispatch(showDraftPositions(true));
  };

  const resetPrices = () => {
    dispatch(getReset(!reset));
    setEntryPriceData({});
    dispatch(getTempInputValues({}));

    dispatch(
      optionChainPayload({
        optionChainPayloadData: { ClickedRow: {}, response: {} },
      }),
    );
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
    }, 500);
  };

  const setToggle = () => {
    setShowlot(!showlot);
  };

  const functionsMap: any = {
    showOption,
    showPnl,
    showPosition,
    handleDraftPositions,
  };

  useEffect(() => {
    setSelectedValue(targetValue);
  }, [targetValue]);

  const handleSwitchDropdown = (label: string) => {
    const selectedOption = strategyTabs.find((tab) => tab.label === label);
    if (selectedOption && selectedOption.onClick) {
      functionsMap[selectedOption.onClick]();
    }
    setSelectedValue(label);
    setSwitchValue(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        switchdropdownRef.current &&
        !switchdropdownRef.current.contains(event.target) &&
        switchdropdownButtonRef.current &&
        !switchdropdownButtonRef.current.contains(event.target)
      ) {
        setSwitchValue(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-3 flex w-[100%] flex-row  items-center justify-between  text-[0.75rem] max-sm:pl-1 max-sm:pr-2 sm:max-xl:p-1 xl:gap-1">
      {/* Only for large Screen */}
      <div
        className={`relative flex w-[30.5rem] justify-start  font-medium max-2xl:hidden `}
      >
        {strategyTabs.map((tab, index) => (
          <span
            key={index}
            className={`flex h-[1.5rem] cursor-pointer items-center justify-center gap-2 border-r border-gray-100 shadow-lg ${
              typeof tab.widthCondition === "function"
                ? tab.widthCondition(positionsdata, keywords, query)
                : tab.width
            } ${index === 0 ? "rounded-l-lg" : ""} ${
              index === strategyTabs.length - 1 ? "rounded-r-lg" : ""
            } ${
              tab.activeConditionKey && eval(tab.activeConditionKey)
                ? "bg-white text-black"
                : "text-gray-400"
            }`}
            onClick={functionsMap[tab.onClick]}
            onDoubleClick={(event: any) => {
              event.stopPropagation();
            }}
          >
            <h1 className=" flex w-4/5 flex-row items-center justify-center   text-center text-[0.75rem] font-medium">
              {tab.label}
              {tab.label == "New Strategy" &&
                Object.entries(checkedOptionData).length > 0 && (
                  <span>({Object.entries(checkedOptionData).length})</span>
                )}
              {tab.label == "Positions" && (
                <span className="font-lighter max-w-[5.5rem] text-right text-gray-500">
                  {keywords &&
                    keywords.includes(query) &&
                    keywords.map((keyword, key) => (
                      <div
                        key={key}
                        className="flex w-full flex-row items-center justify-start"
                      >
                        {keyword === query && (
                          <span
                            className={`  ${
                              (PnlPositions ?? pnlValue) < 0
                                ? "text-red-400"
                                : (PnlPositions ?? pnlValue) > 0
                                  ? "text-z-green-500"
                                  : "text-gray-500"
                            } mt-[0.05rem] px-1`}
                          >
                            (
                            {(PnlPositions ?? pnlValue) > 0
                              ? `+${formatNumber(PnlPositions) ?? formatNumber(pnlValue)}`
                              : (formatNumber(PnlPositions) ??
                                formatNumber(pnlValue))}
                            )
                          </span>
                        )}
                      </div>
                    ))}
                </span>
              )}
            </h1>
          </span>
        ))}
      </div>
      {/* Only for large Screen */}

      {/* Only for Small Screen */}
      <div
        className={`relative cursor-pointer   text-[0.85rem] font-normal max-sm:text-[0.75rem] 2xl:hidden`}
      >
        <div
          ref={switchdropdownButtonRef}
          onClick={() => setSwitchValue(!switchValue)}
          className="flex   items-center justify-center"
        >
          {strategyTabs.map((tab, index) => {
            return tab.label == selectedValue ? (
              <div key={index} className="flex  flex-row ">
                <span
                  className={`${tab.label == "New Strategy" ? "pr-2" : ""}`}
                >
                  {tab.label}
                </span>
                {tab.label == "New Strategy" &&
                  Object.entries(checkedOptionData).length > 0 && (
                    <span>({Object.entries(checkedOptionData).length})</span>
                  )}
                {tab.label == "Positions" && (
                  <span className="font-lighter max-w-[6rem]  text-right text-gray-500">
                    {keywords &&
                      keywords.includes(query) &&
                      keywords.map((keyword, key) => (
                        <div
                          key={key}
                          className="flex  flex-row  items-center justify-start"
                        >
                          {keyword === query && (
                            <span
                              className={`  ${
                                (PnlPositions ?? pnlValue) < 0
                                  ? "text-red-400"
                                  : (PnlPositions ?? pnlValue) > 0
                                    ? "text-z-green-500"
                                    : "text-gray-500"
                              } mt-[0.05rem] px-1`}
                            >
                              (
                              {(PnlPositions ?? pnlValue) > 0
                                ? `+${formatNumber(PnlPositions) ?? formatNumber(pnlValue)}`
                                : (formatNumber(PnlPositions) ??
                                  formatNumber(pnlValue))}
                              )
                            </span>
                          )}
                        </div>
                      ))}
                  </span>
                )}
              </div>
            ) : (
              ""
            );
          })}
          <span>
            <img
              src="/svg/DropDowns.svg"
              height={25}
              width={25}
              alt={""}
              className="xl:max-2xl:w-[3rem]"
            />
          </span>
        </div>
        <div
          ref={switchdropdownRef}
          className={`absolute left-0 top-8 z-[100] flex h-[6rem] w-[8rem]  flex-col items-start justify-start gap-0.5 rounded-lg border border-gray-300 bg-white text-[0.75rem] shadow-lg ${switchValue ? "" : "hidden"}`}
        >
          {strategyTabs.map((tab, index) => {
            return tab.label != selectedValue ? (
              <div
                key={index}
                onClick={() => handleSwitchDropdown(tab.label)}
                className={`w-full px-2 py-1 hover:bg-blue-500 hover:text-white ${index == 0 ? "rounded-t-lg" : ""}`}
              >
                {tab.label}
              </div>
            ) : (
              ""
            );
          })}
        </div>
      </div>
      {/* Only for Small Screen */}

      {/* buttons */}

      <div
        className={`flex w-[30rem] flex-row max-xl:justify-end  max-sm:justify-end  ${positionTable ? "max-sm:w-[28rem]  " : " max-sm:w-[13rem]"} max-sm:gap-1 sm:max-md:w-[22rem] sm:max-md:gap-2.5 md:max-xl:gap-6 xl:justify-end xl:max-2xl:w-[15rem] xl:max-2xl:justify-end xl:max-2xl:gap-4 xl:max-2xl:px-1 2xl:gap-2 ${(!pnlTable || !positionTable) && "max-sm:w-[9.5rem]"} `}
      >
        {positionTable &&
          positionDatas &&
          Object.entries(positionDatas).length > 0 && (
            <RollUpDown query={query} />
          )}
        {pnlTable && (
          <div className="flex flex-row items-center max-sm:w-[8rem] max-sm:gap-1 sm:max-md:gap-1.5 md:max-xl:gap-2  2xl:px-2  ">
            <button
              className="flex items-center justify-center gap-2 max-sm:h-[1rem] max-sm:w-[1.5rem] xl:w-[2rem]  "
              onClick={setToggle}
              onDoubleClick={(event: any) => {
                event.stopPropagation();
              }}
            >
              <img
                src={showlot ? "/svg/toggleIcon.svg" : "/svg/toggleOff.svg"}
                height={25}
                width={25}
                alt={showlot == true ? "Toggle On" : "Toggle Off"}
              />
            </button>

            <span className="text-[0.75rem] font-medium max-sm:text-[0.6rem]">
              Multiply by lot size
            </span>
          </div>
        )}
        {!positionTable && !DraftPositions && !pnlTable && strategyTable && (
          <div className="flex flex-row  items-center gap-[2rem] max-sm:w-[4rem]  md:max-xl:w-[6rem]  ">
            <div
              className="flex cursor-pointer flex-row items-center justify-center gap-1 rounded-2xl bg-gray-100 py-[0.2rem] font-medium max-xl:w-full max-xl:px-3 max-sm:text-[0.65rem] sm:max-md:gap-2 sm:max-md:text-[0.75rem] md:max-xl:gap-3 xl:px-3 xl:max-2xl:gap-2 "
              onClick={resetPrices}
              onDoubleClick={(event: any) => {
                event.stopPropagation();
              }}
            >
              Prices
              <img
                src="/svg/reset.svg"
                height={10}
                width={10}
                alt="refresh"
                className={`md:max-xl:h-[1rem] md:max-xl:w-[1rem] ${isSpinning ? "animate-spin" : ""}`}
              />
            </div>
          </div>
        )}
        {!positionTable && !DraftPositions && !pnlTable && strategyTable ? (
          <ClearStrategy
            setEntryPriceData={setEntryPriceData}
            setCheckedOptionData={setCheckedOptionData}
            setExpiryPayload={setExpiryPayload}
            pnlTable={pnlTable}
          />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default SwitchTab;
