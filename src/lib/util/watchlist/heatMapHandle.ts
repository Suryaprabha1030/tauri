import { UserWatchlistRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { setDefaultWatchlistData } from "@/lib/redux/slices/ChartsSlice";
import {
  setPinnedSymbols,
  setPinUnpin,
} from "@/lib/redux/slices/StrategySlice";
import { autoLogoutTokenRemove } from "../autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "../autoLogoutUtil/brokerLogOutUtil";
import { setActivePosHoldFilter } from "@/lib/redux/slices/PositionSlicer";

interface SymbolData {
  symbol: string;
  identifier?: string;
  displaySymbolName?: string;
  exchange?: string;
  ltp: any;
  chgPercent: any;
}

const combineSymbolData = (
  filteredSymbols: any[],
  webSocketDataRead: any,
  netpercentage: any
): SymbolData[] => {
  return filteredSymbols
    .map((symb) => {
      const ltp = webSocketDataRead[symb.identifier] ?? 0;

      const chgPercent = netpercentage[symb.identifier] ?? 0;

      return {
        symbol: symb.symbol,

        // identifier: symb.identifier,
        displaySymbolName: symb.display_symbol_name || symb.symbol,
        exchange: symb.exchange,
        ltp,

        chgPercent,
      };
    })
    .sort((a: any, b: any) => b.chgPercent - a.chgPercent);
};

const handlePinSymbol = (
  selectedWatchlistId: number | null,
  payload: any,
  pinnedSymbols: any,
  setPinnedSymbolslimit: any,
  dispatch: any,
  pinUnpinRedux: boolean,
  defaultWatchlistPinnedSymbol: any,
  router: any,
  pinnedSymbolsCount?: any
) => {
  if (pinnedSymbols.length >= pinnedSymbolsCount) {
    setPinnedSymbolslimit(true);
  } else {
    const pinSymbol = new UserWatchlistRouterApi(baseConfig());
    pinSymbol
      .pinSymbolsInWatchlistsV1UsersMeWatchlistsWatchlistIdPinSymbolsPost(
        selectedWatchlistId,
        [payload]
      )
      .then((res) => {
        const validPinnedSymbols: string[] = Array.from(
          new Set(
            res.data.symbols
              .filter((symbol: any) =>
                res.data.pinned_symbols.includes(symbol.identifier)
              )
              .map((symbol: any) => symbol.identifier)
          )
        ); //remove duplicate occurs like banknifty ,finnifty occurs twice as index and equity
        dispatch(setPinnedSymbols(validPinnedSymbols)); // To include only  pinned symbols that are in watchlists symbols

        dispatch(setPinUnpin(!pinUnpinRedux));
        if (selectedWatchlistId === defaultWatchlistPinnedSymbol?.id) {
          const updatedWatchlist = {
            ...defaultWatchlistPinnedSymbol,
            pinned_symbols: [
              ...defaultWatchlistPinnedSymbol.pinned_symbols,
              payload, // assuming payload contains the new symbol to be added
            ],
          };
          // Dispatch updated watchlist with new pinned symbols
          dispatch(setDefaultWatchlistData(updatedWatchlist));
        }
      })
      .catch((error) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  }
};

const getColumnValue = (
  symbol: any,
  columnKey: any,
  webSocketDataRead: any,
  netchange: any,
  netpercentage: any
) => {
  const columnMapping: any = {
    price: webSocketDataRead[symbol?.identifier],
    chg: netchange[symbol.identifier],
    chgPercent: netpercentage[symbol.identifier],
  };

  // Handle cases where the columnKey is present in columnMapping
  if (columnMapping[columnKey] !== undefined) {
    return columnMapping[columnKey];
  }

  return symbol[columnKey];
};

const sortData = (
  columnKey: any,
  sortConfig: any,
  symbols: any,
  setSortConfig: any,
  setSymbols: any,
  webSocketDataRead: any,
  netchange: any,
  netpercentage: any
) => {
  const newDirection =
    sortConfig.key === columnKey
      ? sortConfig.direction === "ascending"
        ? "descending"
        : "ascending"
      : "ascending";

  // Sort the current symbols state
  const sortedData = [...symbols].sort((a, b) => {
    let aValue = getColumnValue(
      a,
      columnKey,
      webSocketDataRead,
      netchange,
      netpercentage
    );
    let bValue = getColumnValue(
      b,
      columnKey,
      webSocketDataRead,
      netchange,
      netpercentage
    );

    const aNumber = parseFloat(aValue);
    const bNumber = parseFloat(bValue);

    const isANumber = !isNaN(aNumber);
    const isBNumber = !isNaN(bNumber);

    if (isANumber && isBNumber) {
      return newDirection === "ascending"
        ? aNumber - bNumber
        : bNumber - aNumber;
    }

    aValue = String(aValue).toLowerCase();
    bValue = String(bValue).toLowerCase();

    if (newDirection === "ascending") {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  setSortConfig({ key: columnKey, direction: newDirection });
  setSymbols(sortedData); // Update symbols with sorted data
};

const filterSymbols = (
  responseSymboldata: any,
  activeSymbolFilter: any,
  activePositionFilter: any,
  setActivePositionsHoldings: any,
  holdingsdata: any,
  positionsData: any,
  sortConfig: any,
  setFilteredSymbols: any,
  setSymbols: any,
  webSocketDataRead: any,
  netchange: any,
  netpercentage: any,
  dispatch: any
) => {
  // let filtered = responseSymboldata; // Start with the original response data
  let filtered = Array.isArray(responseSymboldata)
    ? [...responseSymboldata]
    : [];
  if (activeSymbolFilter && activePositionFilter === null) {
    filtered = filtered.filter(
      (symbol: any) =>
        symbol.symbol_type === activeSymbolFilter ||
        (symbol.symbol_type &&
          symbol.symbol_type.split("_")[1] === activeSymbolFilter)
    );
    setActivePositionsHoldings(false);
  }

  if (activePositionFilter) {
    if (activePositionFilter === "holdings" && holdingsdata.length !== 0) {
      filtered = holdingsdata.holdings; // Filter directly from holdings
      setActivePositionsHoldings(false);
    } else if (
      activePositionFilter === "holdings" &&
      holdingsdata.length === 0
    ) {
      setActivePositionsHoldings(true);
      filtered = holdingsdata?.holdings;
    } else if (
      activePositionFilter === "positions" &&
      (positionsData !== null || positionsData?.length > 0)
    ) {
      filtered = positionsData; // Filter directly from positions
      setActivePositionsHoldings(false);
    } else if (
      activePositionFilter === "positions" &&
      (positionsData == null || positionsData.length == 0)
    ) {
      setActivePositionsHoldings(true);
      filtered = positionsData;
    }
  } else {
    setActivePositionsHoldings(false);
  }

  if (!Array.isArray(filtered)) {
    filtered = [];
  }
  // Now apply sorting to the filtered data
  const sortedFilteredData = [...filtered].sort((a, b) => {
    const { key, direction } = sortConfig;

    if (!key) return 0; // No sorting key defined yet

    let aValue = getColumnValue(
      a,
      key,
      webSocketDataRead,
      netchange,
      netpercentage
    );
    let bValue = getColumnValue(
      b,
      key,
      webSocketDataRead,
      netchange,
      netpercentage
    );

    const aNumber = parseFloat(aValue);
    const bNumber = parseFloat(bValue);

    const isANumber = !isNaN(aNumber);
    const isBNumber = !isNaN(bNumber);

    if (isANumber && isBNumber) {
      return direction === "ascending" ? aNumber - bNumber : bNumber - aNumber;
    }

    aValue = String(aValue).toLowerCase();
    bValue = String(bValue).toLowerCase();

    return direction === "ascending"
      ? aValue < bValue
        ? -1
        : aValue > bValue
          ? 1
          : 0
      : aValue < bValue
        ? 1
        : aValue > bValue
          ? -1
          : 0;
  });
  dispatch(setActivePosHoldFilter(true));
  setFilteredSymbols(sortedFilteredData);
  setSymbols(sortedFilteredData);
};

export { combineSymbolData, handlePinSymbol, sortData, filterSymbols };
