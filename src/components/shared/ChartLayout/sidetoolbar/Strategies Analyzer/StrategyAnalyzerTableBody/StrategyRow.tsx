// StrategyRow.tsx
import React from "react";

import { lotNumbers } from "../../../optionFutures/optionFuturesUtil/newStrategyUtil";
import { formatNumber } from "@/lib/util/DraftUtil";
import {
  handleExecute,
  handleLotsChange,
  toggleRowExpansion,
} from "@/lib/util/StrategyAnalyzerUtil/StrategyAnalyerUtil";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { setChartPanel } from "@/lib/redux/slices/ChartsSlice";
import config from "@/lib/config";
import { setPayoffStrategyName } from "@/lib/redux/slices/screenerSlice";

interface StrategyRowProps {
  strategy: string;
  maxProfit: number;
  maxLoss: number;
  margin: any;
  legCount: number;
  isExpanded: boolean;
  hoveredRow: string | null;
  strategyLots: number;
  setHoveredRow: (row: string | null) => void;
  response: any;
  strategyApiData: (strategy: string) => void;
  setSelectedStrategy: React.Dispatch<React.SetStateAction<any>>;
  setExpandedRow: React.Dispatch<React.SetStateAction<any>>;
  setStrategyLots: React.Dispatch<React.SetStateAction<any>>;
  maxProfitPercent: number | undefined;
  maxLossPercent: number | undefined;
  isLastInGroup: any;
  brokerCode: any;

  expiry: string;
  allStrategyData: any;

  leftWidth: any;
}

const StrategyRow: React.FC<StrategyRowProps> = ({
  strategy,
  maxProfit,
  maxLoss,
  margin,
  legCount,
  isExpanded,
  hoveredRow,
  strategyLots,
  setHoveredRow,
  strategyApiData,
  setSelectedStrategy,
  response,
  setStrategyLots,
  setExpandedRow,
  maxProfitPercent,
  maxLossPercent,
  isLastInGroup,

  brokerCode,
  expiry,
  allStrategyData,
  leftWidth,
}) => {
  const dispatch = useDispatch();
  const userEmail = useSelector((state: RootState) => state.common.userInfo);
  const isPrivilegedUser = config.userEmail.includes(userEmail?.email);
  const Payoffstrategy = useSelector(
    (state: RootState) => state.Screener.PayoffStrategyName,
  );
  return (
    <tr
      className={`relative h-10 w-[100%] overflow-hidden text-[0.75rem]  font-table hover:bg-gray-100 md:max-2xl:text-standard md:max-xl:h-16 2xl:text-global ${isLastInGroup || isExpanded ? "border-none" : "border-b"}`}
      style={{ width: "100%" }}
      onMouseEnter={() => setHoveredRow(strategy)}
      onMouseLeave={() => setHoveredRow(null)}
      onClick={(e) => {
        toggleRowExpansion(strategy, setExpandedRow);
        e.stopPropagation();
      }}
    >
      <td className=" py-2 max-sm:max-w-[10rem] max-sm:pl-0.5 sm:max-xl:w-[40%] sm:max-md:px-[0.5rem] xl:max-2xl:max-w-[14rem] xl:max-2xl:px-2 2xl:px-2">
        <div className="flex flex-row items-center max-md:gap-2 xl:max-2xl:gap-2 2xl:gap-4">
          <div
            className={`flex w-[13rem] flex-row items-center max-sm:w-[7.5rem] max-sm:gap-0.5 sm:max-md:w-[9rem] sm:max-md:gap-1 md:gap-2 ${isExpanded ? "xl:max-2xl:max-w-[65%] " : " xl:max-2xl:max-w-[80%]"} xl:max-2xl:justify-start`}
          >
            <div className="flex cursor-pointer max-sm:min-w-[0.8rem] sm:max-md:w-[0.8rem] xl:w-[1rem]">
              <img
                src="/svg/expand-icon.svg"
                alt=""
                width={10}
                height={10}
                className={`transform transition-transform md:max-xl:h-[1rem] md:max-xl:w-[1rem] ${
                  isExpanded ? "rotate-180" : "rotate-90"
                }`}
              />
            </div>
            <div className="max-sm:w-[4rem] max-sm:whitespace-normal max-sm:break-words xl:max-2xl:w-[5rem] xl:max-2xl:whitespace-normal xl:max-2xl:break-words">
              {strategy}
            </div>
            <span className="text-z-gray-300"> ({legCount})</span>
            {isExpanded && (
              <select
                className="w-[3rem] rounded-lg border border-gray-300 bg-gray-50 text-center text-gray-900 scrollbar-thin focus:border-blue-500 focus:ring-blue-500 max-2xl:text-[0.68rem] max-md:h-4 max-md:px-0.5 md:h-6 md:py-1 md:max-xl:w-[3.5rem] md:max-xl:px-2 xl:px-1 2xl:text-[0.78rem]"
                value={strategyLots}
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                  handleLotsChange(strategy, event, setStrategyLots, response);
                  event.stopPropagation();
                }}
                onClick={(event) => {
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
            )}
          </div>
          <div>
            {(hoveredRow === strategy && !isExpanded) || isExpanded ? (
              <div className="flex flex-row items-center gap-2 max-md:w-[2rem] md:max-xl:gap-6 md:max-xl:px-3 xl:w-[4rem] xl:max-2xl:justify-end ">
                <div
                  className="group relative inline-block cursor-pointer max-md:w-[0.9rem] xl:w-[1rem]"
                  onClick={(e) => {
                    dispatch(setChartPanel(false));
                    strategyApiData(strategy);
                    e.stopPropagation();
                    dispatch(setPayoffStrategyName(null));
                  }}
                >
                  <img
                    src="/svg/analyze.svg"
                    width={14}
                    height={14}
                    alt=""
                    className="md:max-xl:h-[1rem] md:max-xl:w-[1rem] "
                  />
                  <span className="pointer-events-none absolute left-[-2] top-6 z-[1000] rounded bg-gray-800 px-2 py-1 text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100 max-xl:hidden">
                    Analyze
                  </span>
                </div>
                <div className="max-md:w-[0.9rem] xl:w-[1rem]">
                  <button
                    className=" group relative inline-block"
                    onClick={(e) => {
                      handleExecute(
                        strategy,
                        response,
                        setSelectedStrategy,
                        dispatch,
                      );
                      e.stopPropagation();
                    }}
                  >
                    <img
                      src="/svg/execute.svg"
                      width={14}
                      height={14}
                      alt=""
                      className="md:max-xl:h-[1rem] md:max-xl:w-[1rem] "
                    />
                    <span className="pointer-events-none absolute left-[-2] top-6 z-[1000] rounded bg-gray-800 px-2 py-1 text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100 max-xl:hidden">
                      Execute
                    </span>
                  </button>
                </div>
                {isPrivilegedUser && !Payoffstrategy && (
                  <div
                    className={`group relative inline-block cursor-pointer max-xl:hidden max-md:w-[0.9rem] xl:flex xl:w-[1rem] ${Payoffstrategy ? "pointer-events-none opacity-50" : ""}
`}
                    onClick={(e) => {
                      dispatch(setChartPanel(false));
                      strategyApiData(strategy);
                      e.stopPropagation();
                      dispatch(setPayoffStrategyName(strategy));
                    }}
                  >
                    <img
                      src="/svg/zoom_in.svg"
                      width={16}
                      height={16}
                      alt=""
                      className="md:max-xl:h-[1rem] md:max-xl:w-[1rem] "
                    />
                    <span className="pointer-events-none absolute left-[-2] top-6 z-[1000] rounded bg-gray-800 px-2 py-1 text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100 max-xl:hidden">
                      Screenshot
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-md:w-[3rem] xl:w-[4rem]"></div>
            )}
          </div>
        </div>
      </td>

      <td className="w-[5rem] py-2 max-sm:px-[0.15rem] sm:max-md:px-4 xl:max-2xl:w-[3rem] xl:max-2xl:px-3 2xl:px-4">
        {formatNumber((strategyLots || 1) * margin?.total?.toFixed(2))}
      </td>
      <td
        className={`w-[5rem] py-2 max-md:px-[0.15rem] xl:max-2xl:w-[3rem] xl:max-2xl:px-3 2xl:px-4 ${leftWidth < 40 ? "xl:hidden" : ""} ${
          maxProfit < 0
            ? "text-red-400"
            : maxProfit > 0
              ? "text-z-green-500"
              : "text-gray-500"
        }`}
      >
        <span>
          {isFinite(maxProfit)
            ? maxProfit * (strategyLots || 1)
            : maxProfit}{" "}
        </span>
        {maxProfitPercent != undefined && (
          <span
            className={`w-[2rem] text-right text-[0.65rem] ${
              maxProfitPercent < 0
                ? "text-red-400"
                : maxProfitPercent > 0
                  ? "text-z-green-500"
                  : "text-gray-500"
            }`}
          >
            ({maxProfitPercent != undefined && maxProfitPercent.toFixed(2)}%)
          </span>
        )}
      </td>
      <td
        className={`w-[5rem] py-2 max-md:px-[0.15rem] xl:max-2xl:w-[3rem] xl:max-2xl:px-3 2xl:px-4 ${leftWidth < 40 ? "xl:!hidden" : ""} ${
          maxLoss > 0
            ? "text-z-green-500"
            : maxLoss < 0
              ? "text-red-400"
              : "text-gray-500"
        }`}
      >
        <span>
          {isFinite(maxLoss) ? maxLoss * (strategyLots || 1) : maxLoss}{" "}
        </span>
        {maxLossPercent != undefined && (
          <span
            className={`w-[2rem] text-right text-[0.65rem] ${
              maxLossPercent < 0
                ? "text-red-400"
                : maxLossPercent > 0
                  ? "text-z-green-500"
                  : "text-gray-500"
            }`}
          >
            ({maxLossPercent != undefined && maxLossPercent.toFixed(2)}%)
          </span>
        )}
      </td>
    </tr>
  );
};

export default StrategyRow;
