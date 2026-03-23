import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import HoldingsWatchlist from "../HoldingsWatchlist";
import PositionsWatchlist from "../PositionsWatchlist";

import { formatNumber } from "@/lib/util/DraftUtil";
import { RootState } from "@/lib/redux/Store";
import { useSelector } from "react-redux";
import WatchListRowAction from "./WatchListRowAction";

interface WatchListRowProps {
  symb: any;
  // data: any;
  netchange: any;
  netpercentage: any;
  clickedRow: any;
  handleRowClick: any;
  setSelectedRowIndex: any;
  setHoveredRow: any;
  hoveredRow: any;
  selectedWatchlistId: any;
  pinnedSymbols: any;
  handleUnpin: any;
  addToWatchlist: any;
  handleBuy: any;
  handleSell: any;
  setFutureOption: any;
  holdingsdata: any;
  positionsData: any;
  selectedGroup: any;
  columns: any;
  index: any;
  activePositionFilter: any;
  handleAddSymbolClick: any;
  isFNO: any;
  handleMouseEnter: any;
  isLastRow: any;
  setAddTowatchlist: any;
  handleRemove: any;
  pinnedSymbolslimit: any;
  setPinnedSymbolslimit: any;
  setSymbols: Dispatch<SetStateAction<any>>;
  selectPrevRow: any;
  selectNextRow: any;
  rowRefs: any;
  lastRowRef?: React.RefObject<HTMLTableRowElement | null>;
  pinnedSymbolsCount: number;
  leftWidth: any;
}
const WatchListTableRow: React.FC<WatchListRowProps> = ({
  symb,
  // data,
  netchange,
  netpercentage,
  clickedRow,
  handleRowClick,
  setSelectedRowIndex,
  setHoveredRow,
  hoveredRow,
  selectedWatchlistId,
  pinnedSymbols,
  handleUnpin,
  addToWatchlist,
  handleBuy,
  handleSell,
  setFutureOption,
  holdingsdata,
  positionsData,
  selectedGroup,
  columns,
  index,
  activePositionFilter,
  handleAddSymbolClick,
  isFNO,
  handleMouseEnter,
  isLastRow,
  setAddTowatchlist,
  handleRemove,
  pinnedSymbolslimit,
  setPinnedSymbolslimit,
  setSymbols,
  selectPrevRow,
  selectNextRow,
  rowRefs,
  lastRowRef,
  pinnedSymbolsCount,
  leftWidth,
}) => {
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const [showPinnedSymbols, setShowPinnedSymbols] =
    useState<any>(pinnedSymbols);
  useEffect(() => {
    if (rowRefs.current[index] && clickedRow === symb.identifier) {
      rowRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [clickedRow, index]);
  useEffect(() => {
    setShowPinnedSymbols(
      pinnedSymbolsCount == 1
        ? pinnedSymbols.slice(0, 1)
        : pinnedSymbolsCount == 2
          ? pinnedSymbols.slice(0, 2)
          : pinnedSymbols,
    );
  }, [pinnedSymbols, pinnedSymbolsCount]);

  const alignxlViewicons =
    holdingsdata?.holdings?.find(
      (holding: any) => holding?.identifier == symb?.identifier,
    ) ||
    positionsData?.find(
      (position: any) => position?.identifier == symb?.identifier,
    );

  return (
    <tr
      ref={(el) => {
        if (el) {
          rowRefs.current[index] = el; // Track all rows

          if (isLastRow && lastRowRef?.current !== undefined) {
            lastRowRef.current = el; // Always update the last row reference
          }
        }
      }}
      className={`relative w-full border-b border-gray-50 text-left text-[0.85rem] focus:outline-none max-md:text-[0.75rem] max-sm:h-[3rem] max-sm:px-2 sm:max-md:h-12 sm:max-md:px-5 md:max-lg:h-14 lg:max-xl:h-16 xl:h-10 xl:hover:bg-gray-100 ${
        clickedRow === symb.identifier ? "bg-z-br-gray" : ""
      }`}
      key={symb?.identifier}
      onClick={(e) => {
        handleRowClick(index);
        setSelectedRowIndex(index);
      }}
      onMouseEnter={() => setHoveredRow(symb?.identifier)}
      onMouseLeave={() => setHoveredRow(null)}
      data-symbol={symb.symbol}
      data-identifier={symb.identifier}
      tabIndex={0}
      onKeyDownCapture={(event) => {
        if (event.key === "ArrowDown") {
          selectNextRow();
          event.preventDefault();
        } else if (event.key === "ArrowUp") {
          selectPrevRow();
          event.preventDefault();
        } else if (event.key === "ArrowRight") {
          selectNextRow();
          event.preventDefault();
        } else if (event.key === "ArrowLeft") {
          selectPrevRow();
          event.preventDefault();
        }
      }}
    >
      {columns.map((column: any, index: any) => {
        const hasData = symb; // Check if `data` and `symb` are present
        switch (column.id) {
          case "price":
            return (
              <td
                key={index}
                className={`w-[5rem] pl-2 sm:max-md:pl-3 md:max-lg:pl-[1rem] lg:max-2xl:w-[20%] lg:max-xl:pl-[2rem] ${
                  (symb && netchange[symb?.identifier]) < 0
                    ? "text-red-400"
                    : (symb && netchange[symb?.identifier]) > 0
                      ? " text-green-500 "
                      : "text-black"
                }`}
              >
                {hasData
                  ? formatNumber(webSocketDataRead[symb?.identifier])
                  : ""}
              </td>
            );
          case "symbol":
            return (
              <td
                key={index}
                className="w-[53%] md:max-lg:pl-[1rem] lg:max-xl:pl-[2rem] xl:max-2xl:w-[60%] xl:max-2xl:py-2"
              >
                <div
                  className={`flex items-center gap-1 max-md:px-2 max-sm:w-[10rem] sm:max-md:w-full sm:max-md:pl-3 md:max-lg:w-[24rem] lg:max-xl:w-[30rem] xl:pl-2 ${
                    alignxlViewicons
                      ? "xl:max-2xl:flex-col xl:max-2xl:items-start xl:max-2xl:justify-center xl:max-2xl:gap-2"
                      : "xl:max-2xl:flex-row xl:max-2xl:gap-0 "
                  } `}
                >
                  <div className="flex items-center gap-2 xl:max-2xl:gap-1">
                    <div
                      className={` relative xl:max-2xl:max-w-[10ch] xl:max-2xl:overflow-hidden xl:max-2xl:truncate xl:max-2xl:text-ellipsis xl:max-2xl:whitespace-nowrap ${
                        (symb && netchange[symb?.identifier]) < 0
                          ? "text-red-400"
                          : (symb && netchange[symb?.identifier]) > 0
                            ? " text-green-500 "
                            : "text-black"
                      }`}
                      title={
                        symb?.display_symbol_name
                          ? symb?.display_symbol_name
                          : symb?.symbol
                      }
                    >
                      {symb?.display_symbol_name
                        ? (() => {
                            const name = symb.display_symbol_name;
                            const isSymbolInData =
                              holdingsdata?.holdings?.some(
                                (holding: any) =>
                                  holding.identifier == symb.identifier,
                              ) ||
                              positionsData?.some(
                                (position: any) =>
                                  position.identifier == symb.identifier,
                              );
                            const pinnedSymb = pinnedSymbols.some(
                              (pinSymb: any) => pinSymb == symb.identifier,
                            );

                            if (isSymbolInData && name.length > 12) {
                              return `${name.slice(0, 10)}...`;
                            }
                            if (name.length > 12 && pinnedSymb) {
                              return `${name.slice(0, 12)}...`;
                            }

                            if (name.length > 20) {
                              return `${name.slice(0, 20)}...`;
                            }

                            return name;
                          })()
                        : symb?.symbol}
                    </div>

                    <span
                      className={`flex ${
                        symb?.symbol_type !== "index" ? "h-3 w-6" : "h-3 w-8"
                      } items-center justify-center  rounded-sm border border-gray-200 bg-blue-100 px-[0.3rem] py-[0.05rem] text-center text-[0.5rem] text-indigo-600 `}
                    >
                      {symb?.symbol_type !== "index" ? symb?.exchange : "INDEX"}
                    </span>
                  </div>
                  <div
                    className={`flex items-center justify-center gap-2.5 xl:max-2xl:justify-start ${alignxlViewicons ? "xl:max-2xl:gap-2" : "xl:max-2xl:gap-1"} `}
                  >
                    {activePositionFilter != "positions" && (
                      <>
                        <span className="pl-2 max-md:mr-2 xl:max-2xl:pl-0">
                          <HoldingsWatchlist
                            symb={symb?.identifier}
                            holdingsdata={holdingsdata}
                          />
                        </span>
                        <span>
                          <PositionsWatchlist
                            symb={symb?.identifier}
                            positionsData={positionsData}
                          />
                        </span>
                      </>
                    )}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnpin(
                          selectedWatchlistId,
                          symb.identifier,
                          pinnedSymbolsCount,
                        );
                      }}
                      className={`group relative flex h-[1.3rem] w-[1.3rem] items-center hover:cursor-pointer hover:rounded hover:bg-gray-300 max-md:hidden ${
                        pinnedSymbols?.includes(symb?.identifier) &&
                        selectedGroup == null
                          ? "flex"
                          : "hidden"
                      } ${showPinnedSymbols?.includes(symb?.identifier) ? "md:max-xl:flex" : "md:max-xl:hidden"}`}
                    >
                      <img
                        src="/svg/unpin.svg"
                        width="12"
                        height="12"
                        alt="pin"
                        title="UnPin"
                      />
                    </div>
                  </div>
                </div>
              </td>
            );
          case "chg":
            return (
              <td
                key={index}
                className="w-[5rem] pl-2 sm:max-md:pl-3 md:max-lg:pl-[1rem] lg:max-xl:pl-[2rem] xl:max-2xl:w-[20%]"
              >
                {hasData &&
                netchange[symb?.identifier] !== undefined &&
                netchange[symb?.identifier] !== null ? (
                  <span>
                    {netchange[symb?.identifier] >= 0 && (
                      <span className="opacity-0">+</span>
                    )}
                    {Number(netchange[symb?.identifier]).toFixed(2)}
                  </span>
                ) : (
                  <span>
                    {" "}
                    <span className="opacity-0">+</span>0.00
                  </span>
                )}
              </td>
            );
          case "chgPercent":
            return (
              <td
                key={index}
                className={`w-[5rem] pl-2 sm:max-md:pl-3 md:max-lg:pl-[1rem] lg:max-xl:pl-[2rem] xl:max-2xl:w-[20%] ${leftWidth < 40 ? "xl:hidden" : ""}`}
              >
                {hasData &&
                netpercentage[symb?.identifier] !== undefined &&
                netpercentage[symb?.identifier] !== null ? (
                  <span>
                    {netpercentage[symb?.identifier] >= 0 && (
                      <span className="opacity-0">+</span>
                    )}
                    {Number(netpercentage[symb?.identifier]).toFixed(2)}%
                  </span>
                ) : (
                  <span>
                    {" "}
                    <span className="opacity-0">+</span>0.00%
                  </span>
                )}
              </td>
            );
          default:
            return "";
        }
      })}
      <WatchListRowAction
        clickedRow={clickedRow}
        symb={symb}
        hoveredRow={hoveredRow}
        selectedGroup={selectedGroup}
        activePositionFilter={activePositionFilter}
        handleAddSymbolClick={handleAddSymbolClick}
        addToWatchlist={addToWatchlist}
        isLastRow={isLastRow}
        selectedWatchlistId={selectedWatchlistId}
        handleMouseEnter={handleMouseEnter}
        handleBuy={handleBuy}
        isFNO={isFNO}
        index={index}
        // data={data}
        handleSell={handleSell}
        setFutureOption={setFutureOption}
        handleRemove={handleRemove}
        setAddTowatchlist={setAddTowatchlist}
        setPinnedSymbolslimit={setPinnedSymbolslimit}
        pinnedSymbolslimit={pinnedSymbolslimit}
        pinnedSymbolsCount={pinnedSymbolsCount}
      />
    </tr>
  );
};

export default WatchListTableRow;
