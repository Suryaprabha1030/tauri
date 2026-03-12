import React, { Dispatch, SetStateAction } from "react";
import DisplayHandleSellButton from "../../../buySellButton/DisplayHandleSellButton";
import AddToWatchlist from "../AddToWatchlist";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { handlePinSymbol } from "@/lib/util/watchlist/heatMapHandle";
import { useNavigate } from "react-router-dom";
import config from "@/lib/config";

interface WatchListRowActionProps {
  clickedRow: any;
  symb: any;
  hoveredRow: string | null;
  selectedGroup: any;
  activePositionFilter: any;
  handleAddSymbolClick: any;
  addToWatchlist: any;
  isLastRow: any;
  selectedWatchlistId: number | null;
  pinnedSymbolslimit: any;
  handleMouseEnter: any;
  handleBuy: any;
  isFNO: any;
  index: any;
  // data: any;
  handleSell: any;
  setFutureOption: any;
  handleRemove: any;
  setAddTowatchlist: Dispatch<SetStateAction<any>>;
  setPinnedSymbolslimit: Dispatch<SetStateAction<any>>;
  pinnedSymbolsCount: number;
}

const WatchListRowAction: React.FC<WatchListRowActionProps> = ({
  clickedRow,
  symb,
  hoveredRow,
  selectedGroup,
  activePositionFilter,
  handleAddSymbolClick,
  addToWatchlist,
  isLastRow,
  selectedWatchlistId,
  pinnedSymbolslimit,
  handleMouseEnter,
  handleBuy,
  isFNO,
  index,
  // data,
  handleSell,
  setFutureOption,
  handleRemove,
  setAddTowatchlist,
  setPinnedSymbolslimit,
  pinnedSymbolsCount,
}) => {
  const dispatch = useDispatch();
  const pinUnpinRedux = useSelector(
    (state: RootState) => state.strategy.pinUnpinstate,
  );
  const pinnedSymbols = useSelector(
    (state: RootState) => state.strategy.pinnedsymbols,
  );
  const defaultWatchlistPinnedSymbol = useSelector(
    (state: RootState) => state.charts.setDefaultWatchlist,
  );
  const router = useNavigate();
  return (
    <>
      {(window.innerWidth < 1200 &&
        clickedRow &&
        clickedRow === symb?.identifier) ||
      (window.innerWidth >= 1200 &&
        hoveredRow &&
        hoveredRow === symb?.identifier) ? (
        <div
          className={`absolute right-3 flex flex-row items-center justify-end gap-1 max-xl:bg-z-br-gray max-sm:top-[0.7rem] max-sm:h-6 sm:max-xl:top-2 sm:max-md:h-8 md:max-xl:gap-2.5 md:max-lg:right-6 md:max-lg:h-10 lg:max-xl:right-8 lg:max-xl:h-12 xl:z-[10] xl:bg-gray-100 xl:max-2xl:right-4 xl:max-2xl:h-full 2xl:h-10`}
        >
          {(activePositionFilter != null || selectedGroup != null) && (
            <div
              className="group relative flex w-[1.5rem] items-center bg-gray-100 max-xl:hidden max-xl:bg-z-br-gray"
              onClick={() => handleAddSymbolClick(symb?.identifier)}
            >
              <img
                src="/svg/plusSymbol.svg"
                width={20}
                height={20}
                alt="plus"
                className=" cursor-pointer"
              />
              {!addToWatchlist && (
                <span
                  className={`pointer-events-none absolute w-[6rem] bg-gray-800  px-1 text-center text-[0.65rem] text-white  ${
                    isLastRow ? "-top-1 left-8" : "left-8 top-8"
                  } ml-1 -translate-x-full -translate-y-1/2 transform rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100 ${
                    (clickedRow && hoveredRow) === symb.identifier
                      ? "cursor-pointer"
                      : "hidden"
                  }`}
                >
                  Add To Watchlist
                </span>
              )}
            </div>
          )}
          {activePositionFilter === null && !selectedGroup && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                handlePinSymbol(
                  selectedWatchlistId,
                  symb?.identifier,
                  pinnedSymbols,
                  setPinnedSymbolslimit,
                  dispatch,
                  pinUnpinRedux,
                  defaultWatchlistPinnedSymbol,
                  router,
                  pinnedSymbolsCount,
                );
              }}
              className={`group relative flex h-[1.3rem] w-[1.3rem] items-center hover:cursor-pointer hover:rounded hover:bg-gray-300 max-md:hidden ${
                pinnedSymbols.includes(symb?.identifier) ||
                selectedGroup != null
                  ? "hidden"
                  : "flex"
              }`}
              onMouseEnter={handleMouseEnter}
            >
              <img
                src="/svg/pin.svg"
                width="15"
                height="15"
                alt="pin"
                className="md:max-xl:h-[1.2rem] md:max-xl:w-[1.2rem]"
              />
              {pinnedSymbolslimit == true && (
                <span
                  className={`${
                    isLastRow
                      ? "bottom-3 left-10"
                      : "left-10 top-10 md:max-xl:top-16"
                  } pointer-events-none absolute z-[9] ml-1 w-[8rem] -translate-x-full -translate-y-1/2  transform  rounded bg-gray-800 px-1  text-[0.55rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:max-xl:w-[15rem] md:max-xl:p-2 md:max-xl:text-[0.75rem]`}
                >
                  Pin limit reached. Unpin a symbol to add a new one.
                </span>
              )}
            </div>
          )}
          {activePositionFilter == null &&
          symb &&
          symb?.symbol_type !== "index" ? (
            <div className="flex flex-row items-center gap-1 text-center text-[0.7rem] md:max-xl:gap-2.5">
              <DisplayHandleSellButton
                type="LONG"
                handleChange={() => handleBuy(index)}
                id="buy-button"
              />
              <DisplayHandleSellButton
                type="SHORT"
                handleChange={() => handleSell(index)}
                id="sell-button"
              />
            </div>
          ) : null}

          {(isFNO == true ||
            (symb &&
              ["options", "futures"].includes(
                symb?.symbol_type?.split("_")[1],
              ) &&
              config?.supportIndices?.includes(symb?.symbol_name))) && (
            <div
              className="group relative flex items-center hover:rounded hover:bg-gray-300 xl:p-1"
              onClick={(e) =>
                setFutureOption(
                  symb,
                  e.currentTarget as HTMLTableCellElement,
                  symb?.symbol_type,
                )
              }
            >
              <img src="/svg/analyze.svg" width={14} height={14} alt="" />
              <span
                className={`pointer-events-none absolute ${
                  isLastRow ? "bottom-6 left-[-4]" : "left-[-2] top-6"
                } z-[1000] rounded bg-gray-800 px-1  text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100`}
              >
                Analyze
              </span>
            </div>
          )}
          {activePositionFilter === null && !selectedGroup && (
            <div className="group relative flex items-center hover:rounded hover:bg-gray-300">
              <img
                src="/svg/removeSymbol.svg"
                className={`w-[1.3rem] ${
                  (clickedRow && hoveredRow) === symb?.identifier
                    ? "xl:cursor-pointer"
                    : "xl:hidden"
                } ${
                  (clickedRow || hoveredRow) === symb?.identifier
                    ? "max-xl:cursor-pointer"
                    : "max-xl:hidden"
                }`}
                width="10"
                height="10"
                alt="plus"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(symb?.identifier);
                }}
              />
              <span
                className={`pointer-events-none absolute z-[9] ml-1 -translate-x-full -translate-y-1/2 transform rounded bg-gray-800  px-1 text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden
                              ${
                                (clickedRow && hoveredRow) === symb?.identifier
                                  ? "cursor-pointer"
                                  : "hidden"
                              } ${
                                isLastRow ? "bottom-4 left-5" : "left-5 top-8"
                              }`}
              >
                Delete
              </span>
            </div>
          )}
        </div>
      ) : null}
      {addToWatchlist && clickedRow === symb?.identifier && (
        <div
          className={`z-[10000] ${
            isLastRow ? "-top-24 right-20 " : "right-20 top-0 "
          } absolute`}
          onMouseLeave={() => setAddTowatchlist(false)}
        >
          <AddToWatchlist setAddToWatchlist={setAddTowatchlist} symbol={symb} />
        </div>
      )}
    </>
  );
};

export default WatchListRowAction;
