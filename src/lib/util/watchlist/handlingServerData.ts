import { UserBrokerRouterApi, UserWatchlistRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  addSymbol,
  limitExceed,
  setPinnedSymbols,
  setPinUnpin,
  setShouldRefresh,
  
} from "@/lib/redux/slices/StrategySlice";
import { processSymbols } from "./WatchlistUtil";
import { autoLogoutTokenRemove } from "../autoLogoutUtil/autoLogOutUtil";
import {
  getAllIndicesDataFetched,
  setDefaultWatchlistData,
} from "@/lib/redux/slices/ChartsSlice";
import config from "@/lib/config";
import { brokerLogoutTokenRemove } from "../autoLogoutUtil/brokerLogOutUtil";

let NSE: any[] = [];
let BSE: any[] = [];
export const getCachedIndices = async (
  brokerCode: any,
  dispatch: any,
  router: any
): Promise<{ NSE: any[]; BSE: any[] }> => {
  const getPriceApi = new UserBrokerRouterApi(baseConfig());
  try {
    const [indicesResponse, BSEResponse] = await Promise.all([
      getPriceApi.getAllIndicesV1UsersMeBrokersBrokerCodeGetAllIndicesPost(
        brokerCode,
        "NSE",
        "index_options"
      ),
      getPriceApi.getAllIndicesV1UsersMeBrokersBrokerCodeGetAllIndicesPost(
        brokerCode,
        "BSE",
        "index_options"
      ),
    ]);

    const NSE = indicesResponse?.data || [];
    const BSE = BSEResponse?.data || [];

    // Dispatch to Redux
    dispatch(
      getAllIndicesDataFetched({
        NSE,
        BSE,
      })
    );

    return { NSE, BSE };
  } catch (err: any) {
    if (err?.response && err?.response?.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (err?.response && err?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }
    return { NSE: [], BSE: [] };
  }
};

const removeSymbolarray = async (
  payload: string[],
  selectedWatchlistId: number | null,
  dispatch: any,
  shouldRefreshRedux: boolean,
  router: any
) => {
  const removeData = new UserWatchlistRouterApi(baseConfig());

  try {
    const res =
      await removeData.removeSymbolsInWatchlistsV1UsersMeWatchlistsWatchlistIdRemoveSymbolsPost(
        selectedWatchlistId,
        payload
      );

    // Dispatch action to update the state
    dispatch(setShouldRefresh(!shouldRefreshRedux));
  } catch (err: any) {
    if (err?.response && err?.response?.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (err?.response && err?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }
  }
};

const fetchWatchlistData = async (
  selectedWatchlistId: number | null,
  setName: any,
  setIdentifiers: any,
  setResponseSymboldata: any,
  setSymbols: any,
  dispatch: any,
  setShow: any,
  setDefaultWatchlist: any,
  router: any,
  pinUnpinRedux: any,
  defaultWatchlistPinnedSymbol: any
) => {
  const api = new UserWatchlistRouterApi(baseConfig());

  if (selectedWatchlistId != null) {
    try {
      const res =
        await api.getUserWatchlistV1UsersMeWatchlistsIdGet(selectedWatchlistId);

      const watchlistData: any = res?.data;
      setName(watchlistData?.name.trim());
      const filteredIdentifiers = watchlistData?.symbols?.map(
        (item:any) => item.identifier
      );
      setIdentifiers(filteredIdentifiers);
      const processedSymbols = processSymbols(watchlistData?.symbols || []);
      setResponseSymboldata(processedSymbols);
      setSymbols(watchlistData?.symbols);

      if (watchlistData?.symbols?.length > 0) {
        // Only dispatch if there are symbols
        watchlistData?.symbols?.forEach((symbol: any) =>
          dispatch(
            addSymbol({
              symbol: symbol?.identifier,
              // token: symbol.token
            })
          )
        );
      }

      if (watchlistData?.symbols?.length === 0) {
        setShow(true);
      }
      if (watchlistData?.symbols?.length >= 50) {
        dispatch(limitExceed(true));
      }
      if (watchlistData?.symbols?.length < 50) {
        dispatch(limitExceed(false));
      }
      if (watchlistData?.primary) {
        setDefaultWatchlist(watchlistData);
      }
      //To set the pinned symbols from the selected watchlists
      const validPinnedSymbols = res?.data?.symbols
        .filter((symbol: any) =>
          res?.data?.pinned_symbols?.includes(symbol.identifier)
        )
        .map((symbol: any) => symbol?.identifier);
      dispatch(setPinnedSymbols(validPinnedSymbols)); // To include only  pinned symbols that are in watchlists symbols

      dispatch(setPinUnpin(!pinUnpinRedux));
      if (selectedWatchlistId === defaultWatchlistPinnedSymbol?.id) {
        const updatedWatchlist = {
          ...defaultWatchlistPinnedSymbol,
          pinned_symbols: [...defaultWatchlistPinnedSymbol?.pinned_symbols],
        };
        // Dispatch updated watchlist with new pinned symbols
        dispatch(setDefaultWatchlistData(updatedWatchlist));
      }
    } catch (error: any) {
      if (error?.response && error?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      }
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
    }
  }
};

const fetchSymbolPriceData = async (
  payload: any,
  brokerCode: any,
  // setData: any,
  setFnoIdentifiers: any,
  selectedWatchlistId: number | null,
  dispatch: any,
  shouldRefreshRedux: boolean,
  getAllindices: any,
  router: any
) => {
  // const getPriceApi = new UserBrokerRouterApi(baseConfig());

  try {
    // Fetch Symbol Prices
    // const symbolPricesResponse =
    //   await getPriceApi.getSymbolPricesV1UsersMeBrokersBrokerCodeGetSymbolPricesPost(
    //     brokerCode,
    //     payload
    //   );
    // Fetch indices from cache (or API if not cached)
    if (getAllindices?.NSE?.length && getAllindices?.BSE?.length) {
      NSE = getAllindices.NSE;
      BSE = getAllindices.BSE;
    } else {
      const cached = await getCachedIndices(brokerCode, dispatch, router);
      NSE = cached.NSE;
      BSE = cached.BSE;
    }
    // Filter supported indices
    const filtered = [
      ...(NSE.filter((item) =>
        config.supportIndices.includes(item?.index_name)
      ) || []),
      ...(BSE.filter((item) =>
        config.supportIndices.includes(item?.index_name)
      ) || []),
    ];
    // const datas = symbolPricesResponse?.data;
    // setData(datas);
    setFnoIdentifiers(filtered);
    // Define derivatives types to check
    const derivativesTypes = new Set([
      "index_options",
      "stock_options",
      "index_futures",
      "stock_futures",
    ]);

    // Filter payload identifiers
    const payloadIdentifiers = Array.isArray(payload) ? payload : [];

    // Identify symbols to remove (options & futures with ltp === 0)
    const identifiersToRemove = payloadIdentifiers
      .filter(
        (item: any) => item.ltp === 0 && derivativesTypes.has(item.symbol_type) // Only remove if it's a derivative and LTP is 0
      )
      .map((item: any) => item.identifier);

    // Remove symbols from the watchlist if needed
    if (identifiersToRemove.length > 0) {
      removeSymbolarray(
        identifiersToRemove,
        selectedWatchlistId,
        dispatch,
        shouldRefreshRedux,
        router
      );
    }
    // Update Redux with the symbol data for each valid item
    const updates = payload?.map((item: any) => [
      dispatch(
        addSymbol({
          symbol: item,
          // token: item.token
        })
      ),
    ]);

    // Await all dispatch actions for performance optimization
    await Promise.all(updates.flat());
  } catch (error: any) {
    if (error?.response && error?.response?.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (error?.response && error?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }
    // Optionally handle the error and update state for user feedback
  }
};

export { removeSymbolarray, fetchWatchlistData, fetchSymbolPriceData };
