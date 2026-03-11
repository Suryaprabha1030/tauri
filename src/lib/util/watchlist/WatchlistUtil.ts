import { UserWatchlistRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { setDefaultWatchlistData } from "@/lib/redux/slices/ChartsSlice";
import {
  setPinnedSymbols,
  setPinUnpin,
} from "@/lib/redux/slices/StrategySlice";
import { autoLogoutTokenRemove } from "../autoLogoutUtil/autoLogOutUtil";
import { Dispatch } from "redux";
import {
  setStockData,
  togglePlaceOrderVisibility,
} from "@/lib/redux/slices/PlaceOrder";
import { brokerLogoutTokenRemove } from "../autoLogoutUtil/brokerLogOutUtil";

export const processSymbols = (symbols: any[]): any[] => {
  return symbols.reduce<any[]>((acc, curr) => {
    const existing = acc.find((item) => item.identifier === curr.identifier);

    if (!existing) {
      acc.push(curr);
    } else if (curr.symbol_type?.toLowerCase() === "index") {
      acc = acc.filter((item) => item.identifier !== curr.identifier);
      acc.push(curr);
    }

    return acc;
  }, []);
};

export const handleUnpin = async (
  selectedWatchlistId: number | null,
  payload: string,
  pinUnpinRedux: any,
  defaultWatchlistPinnedSymbol: any,
  pinnedSymbols: any,
  setPinnedSymbolslimit: any,
  dispatch: Dispatch,
  router: any,
  pinnedSymbolsCount?: any
) => {
  const unpinSymbol = new UserWatchlistRouterApi(baseConfig());
  await unpinSymbol
    .unpinSymbolsInWatchlistsV1UsersMeWatchlistsWatchlistIdUnpinSymbolsPost(
      selectedWatchlistId,
      [payload]
    )
    .then((res) => {
      const validPinnedSymbols = res.data.symbols
        .filter((symbol: any) =>
          res.data.pinned_symbols.includes(symbol.identifier)
        )
        .map((symbol: any) => symbol.identifier);
      dispatch(setPinnedSymbols(validPinnedSymbols));
      dispatch(setPinUnpin(!pinUnpinRedux));
      if (selectedWatchlistId === defaultWatchlistPinnedSymbol.id) {
        // Remove symbols that are in defaultWatchlist but not in the response
        const updatedSymbols =
          defaultWatchlistPinnedSymbol.pinned_symbols.filter((symbol: any) =>
            res.data.pinned_symbols.includes(symbol)
          );
        // Update defaultWatchlist with the new pinned_symbols array
        const updatedWatchlist = {
          ...defaultWatchlistPinnedSymbol,
          pinned_symbols: updatedSymbols,
        };
        // Dispatch updated default watchlist symbols
        dispatch(setDefaultWatchlistData(updatedWatchlist));
      }
    })
    .catch((error: any) => {
      if (error?.response && error?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      }
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
    });
  if (pinnedSymbols.length >= pinnedSymbolsCount) {
    setPinnedSymbolslimit(true);
  } else {
    setPinnedSymbolslimit(false);
  }
};

export const handleTransaction = (
  index: any,
  transactionType: "LONG" | "SHORT",
  buttonID: string,
  setSell: any,
  setBuy: any,
  filteredSymbols: any,
  setbuttonID: any,
  setClickedRow: any,
  setSelectedSymbol: any,
  symbols: any,
  webSocketDataRead: any,
  dispatch: Dispatch
) => {
  if (transactionType === "LONG") {
    setSell(false);
    setBuy(true);
  } else {
    setBuy(false);
    setSell(true);
  }

  setbuttonID(buttonID);

  const selectedRow = filteredSymbols[index];
  if (!selectedRow) return;

  const rowData = selectedRow.identifier;
  setClickedRow(rowData);
  setSelectedSymbol(rowData);

  const clickedSymbol = symbols.find(
    (symb: any) => symb.identifier === rowData
  );

  const stock = [
    {
      ...clickedSymbol,
      transaction_type: transactionType,
      ltp: webSocketDataRead[clickedSymbol?.identifier],
      index_name: clickedSymbol.symbol_name,
    },
  ];
  dispatch(togglePlaceOrderVisibility(true)); // draggable component redux
  dispatch(setStockData(stock));
};

export const loadMoreSymbols = (
  visibleSymbols: any,
  filteredSymbols: any,
  setCurrentPage: any,
  ITEMS_PER_PAGE: any,
  setVisibleSymbols: any,
  setAllIdentifiers: any,
  selectedGroup: any,
  activePositionsFilter: any
) => {
  if (visibleSymbols?.length >= filteredSymbols?.length) return; // Stop when all symbols are loaded

  setCurrentPage((prevPage) => {
    const nextPage = prevPage + 1;

    setVisibleSymbols((prevSymbols: any) => {
      const newSymbols = filteredSymbols?.slice(
        prevSymbols?.length,
        prevSymbols?.length + ITEMS_PER_PAGE
      );

      const newIdentifiers = newSymbols?.map((s) => s.identifier);
      if (selectedGroup != null && activePositionsFilter == null) {
        //only group acctive
        setAllIdentifiers(newIdentifiers);
      }

      return [...prevSymbols, ...newSymbols];
    });

    return nextPage;
  });
};
