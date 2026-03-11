import React from "react";

interface EmptyWatchlistProps {
  filteredSymbols: any[];
  activePositionFilter: string | null;
  selectedGroup: string | null;
  activeSymbolFilter: string | null;
  activePositionsHoldings: boolean;
}

const EmptyWatchlist: React.FC<EmptyWatchlistProps> = ({
  filteredSymbols,
  activePositionFilter,
  selectedGroup,
  activeSymbolFilter,
  activePositionsHoldings,
}) => {
  return (
    <>
      {activePositionsHoldings === false &&
        Array.isArray(filteredSymbols) &&
        filteredSymbols?.length == 0 &&
        !activePositionFilter && (
          <div className="flex h-[100%] w-[100%] items-center justify-center bg-white text-[0.75rem] font-light capitalize text-gray-400">
            {activeSymbolFilter && selectedGroup == null
              ? `Add ${activeSymbolFilter} Symbols To Watchlist`
              : selectedGroup && activeSymbolFilter != null
                ? `No ${activeSymbolFilter} symbols available in this Group`
                : "Add Symbols To Watchlist"}{" "}
          </div>
        )}
      {activePositionFilter != null &&
        Array.isArray(filteredSymbols) &&
        filteredSymbols?.length == 0 && (
          <div className="h-full w-full overflow-x-hidden  overflow-x-hidden  overflow-y-scroll text-black     scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-z-br-gray     ">
            <div className="flex h-full w-full items-center justify-center bg-white text-[0.75rem] font-light text-gray-400">
              {" "}
              No {activePositionFilter} available
            </div>
          </div>
        )}{" "}
    </>
  );
};

export default EmptyWatchlist;
