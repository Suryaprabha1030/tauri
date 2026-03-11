import React from "react";

import { useDispatch, useSelector } from "react-redux";
import StrategiesAnalyzerFilter from "./StrategiesAnalyzerFilter";
import RefreshButton from "../refresh";

import { formatExpiryDate } from "@/lib/util/DateUtil";
import RemoveButton from "../sharedContent/RemoveButton";
import {
  handleExpiry,
  handleHedged,
  handleSelectChange,
} from "@/lib/util/StrategyAnalyzerUtil/StrategyAnalyerUtil";
import { RootState } from "@/lib/redux/Store";
import HedgedCheckbox from "./HedgerCheckbox";
import { WidthAdjusterDoubleClick } from "@/lib/util/sideToolBar/sidetoolbarCommon";
import config from "@/lib/config";

interface StrategiesAnalyzerHeaderProps {
  showStrategyIcon: boolean;
  selectedIndex: string;
  indexRef: React.RefObject<any>;
  setSelectedIndex: React.Dispatch<React.SetStateAction<any>>;
  fnoIdentifiers: any[];
  indicesLotSize: any[];
  indexname: string;
  expiry: string;
  expiryDateRef: React.RefObject<any>;
  setExpiry: React.Dispatch<React.SetStateAction<any>>;
  liveExpiryList: string[];
  status: string;
  response: any;
  showData: boolean;

  hedgeddata: boolean;
  activeIndicatorFilter: any;
  setActiveIndicatorFilter: (value: any) => void;
  handlerefresh: () => void;
  sethedgedData: React.Dispatch<React.SetStateAction<any>>;
  leftWidth: any;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
}

const StrategiesAnalyzerHeader: React.FC<StrategiesAnalyzerHeaderProps> = ({
  showStrategyIcon,
  selectedIndex,
  indexRef,

  fnoIdentifiers,
  indicesLotSize,
  indexname,
  expiry,
  expiryDateRef,
  setExpiry,
  liveExpiryList,
  status,
  response,
  showData,

  hedgeddata,
  activeIndicatorFilter,
  setActiveIndicatorFilter,
  handlerefresh,
  setSelectedIndex,
  sethedgedData,
  leftWidth,
  setLeftWidth,
}) => {
  const dispatch = useDispatch();
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  const expiryDate = useSelector(
    (state: RootState) => state.strategy.expiryDate
  );

  return (
    <div
      className="flex flex-row items-center justify-between max-md:py-1.5 md:max-xl:py-[0.8rem] xl:py-2"
      onDoubleClick={(event: any) => {
        WidthAdjusterDoubleClick(leftWidth, setLeftWidth);
      }}
    >
      <div className="flex flex-row items-center">
        <h1 className="flex font-heading max-lg:flex-col max-md:gap-1 max-md:text-lg max-sm:pl-2 max-sm:pr-1 sm:max-xl:sticky sm:max-xl:top-0 sm:max-md:px-4 md:items-center md:text-xl md:max-lg:items-start md:max-lg:gap-10 md:max-lg:px-6 lg:flex-row lg:px-4 lg:max-xl:gap-24 xl:gap-2 xl:max-2xl:flex-col xl:max-2xl:items-start">
          {leftWidth > 50 ? "Hedged Options" : "Hedged"}
          <div className="flex flex-row items-center font-table max-md:text-[0.65rem] max-sm:gap-1 sm:max-md:gap-6 sm:max-md:pl-3 md:text-[0.75rem] md:max-xl:gap-12 xl:gap-4">
            {showStrategyIcon ? (
              <div>
                <select
                  id="indexDropdown"
                  value={selectedIndex}
                  ref={indexRef}
                  onChange={(event) =>
                    handleSelectChange({
                      event,
                      dispatch,
                      fnoIdentifiers,
                      indicesLotSize,
                      expiryDate,
                      webSocketDataRead,
                      setSelectedIndex,
                    })
                  }
                  onDoubleClick={(event: any) => {
                    event.stopPropagation();
                  }}
                  className="cursor-pointer rounded-lg border border-2 max-md:text-[0.6rem] sm:max-md:rounded-full sm:max-md:px-[0.14rem] sm:max-md:py-[0.3rem] md:max-xl:px-[0.6rem] md:max-xl:py-[0.6rem]"
                >
                  {fnoIdentifiers
                    ? fnoIdentifiers.map((item) => (
                        <option key={item.identifier} value={item.index_name}>
                          {item.index_name}
                        </option>
                      ))
                    : indicesLotSize.map((item) => (
                        <option key={item.identifier} value={item.index_name}>
                          {item.index_name}
                        </option>
                      ))}
                </select>
              </div>
            ) : (
              <div className=" text-gray-500 max-md:text-[0.65rem] md:text-[0.75rem]">
                {indexname}
              </div>
            )}
            {showStrategyIcon ? (
              <div
                className={` max-md:px-1 max-md:text-[0.65rem] md:text-[0.75rem] ${
                  leftWidth < 35 ? "hidden" : ""
                }`}
              >
                <select
                  className={`max-md:text-[0.65rem] max-sm:w-[5.2rem] sm:max-md:w-[5.5rem] sm:max-md:rounded-full sm:max-md:px-[0.14rem] sm:max-md:py-[0.3rem] md:max-xl:px-[0.6rem] md:max-xl:py-[0.6rem] xl:w-[6rem] ${
                    config.BSESupportIndices.includes(selectedIndex)
                      ? "pointer-events-none appearance-none"
                      : "focus:border-tertiary cursor-pointer rounded-lg border border-2"
                  }`}
                  ref={expiryDateRef}
                  value={expiry}
                  onChange={(e) =>
                    handleExpiry(e, setExpiry, dispatch, indexname)
                  }
                  onDoubleClick={(event: any) => {
                    event.stopPropagation();
                  }}
                >
                  {liveExpiryList.slice(0, 3).map((c, idx) => (
                    <option key={idx} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              leftWidth >= 35 && (
                <div className="text-gray-500 max-md:text-[0.65rem] md:text-[0.75rem]">
                  {expiry && formatExpiryDate(expiry)}
                </div>
              )
            )}
          </div>
        </h1>
        <h1 className="flex flex-row max-md:pt-[1.95rem] max-sm:gap-1 sm:max-md:gap-6 sm:max-md:px-1.5 md:items-center md:max-xl:gap-12 md:max-xl:px-12 md:max-lg:pt-[4rem] xl:max-2xl:w-[15rem] xl:max-2xl:justify-between xl:max-2xl:px-7 xl:max-2xl:pt-[2.2rem] 2xl:gap-2">
          {leftWidth >= 40 && (
            <StrategiesAnalyzerFilter
              activeIndicatorFilter={activeIndicatorFilter}
              setActiveIndicatorFilter={setActiveIndicatorFilter}
            />
          )}
          <div
            className={`group relative inline-block w-[4rem] cursor-pointer rounded-lg p-1`}
          >
            {status === "success" &&
              response &&
              showData &&
              leftWidth >= 35 && (
                <HedgedCheckbox
                  isChecked={hedgeddata}
                  onToggle={() => handleHedged(sethedgedData)}
                />
              )}
          </div>
        </h1>
      </div>
      <div className="flex w-[4rem] flex-row justify-between max-2xl:absolute max-2xl:right-0 max-2xl:top-0 max-md:pt-[0.65rem] md:max-xl:w-[4.5rem] md:max-xl:pt-[0.9rem] xl:max-2xl:pr-4 xl:max-2xl:pt-[0.6rem] 2xl:items-center 2xl:pb-2.5 2xl:pt-0.5">
        <RefreshButton onClick={handlerefresh} />

        <RemoveButton />
      </div>
    </div>
  );
};

export default StrategiesAnalyzerHeader;
