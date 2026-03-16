import { UserBrokerRouterApi, UserWatchlistRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { addSymbol, updateSymbolData } from "@/lib/redux/slices/StrategySlice";
import { RootState } from "@/lib/redux/Store";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import DisplayIncreDecrease from "../DisplayIncreDecrease/DisplayIncreDecrease";
import { tvWidget } from "@/components/tradingView/chartSetup";
import {
  setChartIconClicked,
  setDefaultWatchlistData,
  setSymbolIdentifier,
} from "@/lib/redux/slices/ChartsSlice";
import { formatNumber } from "@/lib/util/DraftUtil";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { setShowTVpopup } from "@/lib/redux/slices/CommonSlice";
import config from "@/lib/config";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { useNavigate } from "react-router-dom";

interface StocksCardProps {
  brokerCode: number | null;
  selectedWatchlistId: number;
}
const StocksCard: React.FC<StocksCardProps> = ({
  brokerCode,
  selectedWatchlistId,
}) => {
  const [data, setData] = useState<any[]>([]);
  const [symbs, setSymbols] = useState<Symbol[]>([]);
  const [identifiers, setIdentifiers] = useState<any>([]);

  const router = useNavigate();
  const symbols: any = [
    { symbol: "Nifty 50", identifier: "NSE:NIFTY50" },
    { symbol: "Nifty Bank", identifier: "NSE:BANKNIFTY" },
    { symbol: "Nifty Fin Service", identifier: "NSE:FINNIFTY" },
  ];
  const identifier: string[] = ["NSE:NIFTY50", "NSE:BANKNIFTY", "NSE:FINNIFTY"];
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );

  const netchange: any = useSelector(
    (state: RootState) => state.strategy.netChange,
  );

  const netpercentage: any = useSelector(
    (state: RootState) => state.strategy.netChangepercent,
  );
  const pinUnpinRedux = useSelector(
    (state: RootState) => state.strategy.pinUnpinstate,
  );
  const pinnedSymbols = useSelector((state: RootState) =>
    Array.from(new Set(state.strategy.pinnedsymbols)),
  );

  const defaultWatchlistPinnedSymbol = useSelector(
    (state: RootState) => state.charts.setDefaultWatchlist,
  );
  const SymbolIdentifier = useSelector(
    (state: RootState) => state.charts.SymbolIdentifier,
  );
  const path = window.location.pathname;
  const dispatch = useDispatch();
  const [visibleCardsCount, setVisibleCardsCount] = useState(3);
  // api formate for get symbol prices
  const fetchSymbolData = async (payload: any) => {
    if (!payload) return;

    if (Array.isArray(payload) && payload.length > 0) {
      payload.forEach((id: any) => {
        dispatch(addSymbol({ symbol: id }));
      });
    }
  };
  // initially call that default symbols
  useEffect(() => {
    if (identifier.length > 0) {
      fetchSymbolData(identifier);
      setSymbols(symbols);
      // for display default symbols
    }
  }, [brokerCode]);
  const fetchDefaultWatchlist = async () => {
    try {
      const api = new UserWatchlistRouterApi(baseConfig());

      const res = await api.fetchWatchlistsV1UsersMeWatchlistsGet();
      if (res?.data?.length == 0) {
        return;
      }
      const defaultList = res.data.find(
        (watchlist: any) => watchlist.primary === true,
      );

      if (defaultList) {
        dispatch(setDefaultWatchlistData(defaultList));
      }
    } catch (err: any) {
      if (err?.response && err?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      }
      if (err?.response && err?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
    }
  };

  useEffect(() => {
    if (
      path == `${config.brokersListUrl}/${brokerCode}/psb` ||
      path == `${config.brokersListUrl}/${brokerCode}/oi`
    ) {
      if (
        defaultWatchlistPinnedSymbol &&
        Object.entries(defaultWatchlistPinnedSymbol).length == 0
      ) {
        fetchDefaultWatchlist();
      }
    }
  }, [path, brokerCode]);

  useEffect(() => {
    //To display the pinned symbols in primary watchlist
    if (
      path === `${config.brokersListUrl}/${brokerCode}/psb` ||
      path === `${config.brokersListUrl}/${brokerCode}/oi`
    ) {
      const validPinnedSymbols =
        defaultWatchlistPinnedSymbol &&
        Object.entries(defaultWatchlistPinnedSymbol).length > 0 &&
        defaultWatchlistPinnedSymbol?.symbols
          .filter((symbol: any) =>
            defaultWatchlistPinnedSymbol?.pinned_symbols.includes(
              symbol.identifier,
            ),
          )
          .map((symbol: any) => symbol.identifier);
      const pinnedSymbols = validPinnedSymbols;
      if (pinnedSymbols?.length > 0) {
        // Filter out any empty strings from the pinned_symbols array
        const filteredSymbols = pinnedSymbols.filter(
          (symbol: any) => symbol !== "",
        );

        if (
          filteredSymbols.length > 0 &&
          filteredSymbols.every((symbol: any) =>
            pinnedSymbols?.includes(symbol),
          )
        ) {
          const timer = setTimeout(() => {
            handlePin(filteredSymbols);
            fetchSymbolData(filteredSymbols);
          }, 500);
          return () => clearTimeout(timer);
        }
      } else {
        setSymbols(symbols);
        setIdentifiers(identifier);
      }
    }
  }, [path, defaultWatchlistPinnedSymbol, brokerCode]);

  useEffect(() => {
    if (path === `${config.brokersListUrl}/${brokerCode}/psv`) {
      const timer = setTimeout(() => {
        handlePin(pinnedSymbols);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedWatchlistId, pinUnpinRedux]);

  const handlePin = async (pinnedSymbols: string[]) => {
    let updatedSymbols: any = [];
    let updatedIdentifiers: any = [];
    // Remove duplicates from pinnedSymbols
    const uniquePinnedSymbols = Array.from(new Set(pinnedSymbols));

    // If no symbols are pinned, use the default symbols
    if (uniquePinnedSymbols.length === 0) {
      updatedSymbols = symbols.slice(0, 3);
      updatedIdentifiers = identifier.slice(0, 3);
    } else {
      // Map the unique pinned symbols to their respective symbol/identifier format
      updatedSymbols = uniquePinnedSymbols.map((id) => ({
        symbol: id.split(":")[1],
        identifier: id,
      }));
      updatedIdentifiers = uniquePinnedSymbols;

      // Check if there's space for more symbols (up to 3)
      const remainingSlots = 3 - updatedSymbols.length;

      if (remainingSlots > 0) {
        // Add default symbols that are not already pinned (ensure we don't exceed 3)
        const filteredDefaults = symbols.filter(
          (sym) => !updatedIdentifiers.includes(sym.identifier),
        );
        const filteredIdentifiers = identifier.filter(
          (id) => !updatedIdentifiers.includes(id),
        );

        // Add the remaining symbols to fill the slots (up to 3)
        updatedSymbols = [
          ...updatedSymbols,
          ...filteredDefaults.slice(0, remainingSlots),
        ];
        updatedIdentifiers = [
          ...updatedIdentifiers,
          ...filteredIdentifiers.slice(0, remainingSlots),
        ];
      }

      // Ensure no more than 3 symbols
      updatedSymbols = updatedSymbols.slice(0, 3);
      updatedIdentifiers = updatedIdentifiers.slice(0, 3);
    }

    // Update the state with the modified symbols and identifiers
    setSymbols(updatedSymbols);
    setIdentifiers(updatedIdentifiers);
  };

  // for tv chart feed from header
  const refreshTvChart = (symbol: any) => {
    const psvPath = `${config.brokersListUrl}/${brokerCode}/psv`;

    if (path !== psvPath) {
      dispatch(setSymbolIdentifier(symbol));
      dispatch(setShowTVpopup(true));
      dispatch(setChartIconClicked(false));
      // router.push(psvPath);
    } else {
      tvWidget?.onChartReady(async () => {
        const resolution = tvWidget.activeChart().resolution();
        tvWidget.activeChart().setSymbol(symbol);
        tvWidget.activeChart().setResolution(resolution);
      });
    }
  };

  useEffect(() => {
    if (!SymbolIdentifier) return;
    const updateChart = () => {
      if (!tvWidget) return;
      tvWidget.onChartReady(() => {
        const resolution = tvWidget.activeChart().resolution();
        tvWidget.activeChart().setSymbol(SymbolIdentifier);
        tvWidget.activeChart().setResolution(resolution);

        dispatch(setSymbolIdentifier(null)); // Reset after update
      });
    };
    requestAnimationFrame(updateChart); // Ensures it runs after UI stabilizes
  }, [SymbolIdentifier, tvWidget]);

  const updateVisibleItems = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;

      if (width >= 576 && width <= 991) {
        setVisibleCardsCount(-1); // Only one iteration (index 0)
      } else if (width >= 992 && width <= 1400) {
        setVisibleCardsCount(-2); // Only two iterations (index 0 & 1)
      } else {
        setVisibleCardsCount(-3); // Run normally (full map)
      }
    }
  };

  // Run on mount and window resize
  useEffect(() => {
    updateVisibleItems(); // Initial check
    window.addEventListener("resize", updateVisibleItems);

    return () => {
      window.removeEventListener("resize", updateVisibleItems);
    };
  }, [window.innerWidth]);

  return (
    <>
      {symbs?.slice(visibleCardsCount)?.map((symbol: any, index: number) => (
        <div
          key={index}
          className=" max-w-[16rem] cursor-pointer items-center rounded-xl border-2 border-z-br-gray  p-[0.2rem] px-2"
          onClick={() => refreshTvChart(symbol.identifier)}
        >
          <div className="flex h-[2.6rem]  items-center justify-center gap-[0.1rem] ">
            <span className="flex min-w-[8rem]  flex-col ">
              <div className=" flex flex-row items-center gap-1">
                <div
                  className={` relative  ${
                    symbol?.symbol?.length > 17 ? "group" : ""
                  } inline-block cursor-pointer`}
                >
                  <h1
                    className={`max-w-[15ch] overflow-hidden truncate text-ellipsis text-[0.75rem] `}
                  >
                    {symbol?.symbol}
                  </h1>
                  <span
                    className={` absolute -left-[-8rem] top-6 z-[1001] ml-1 min-w-[15ch] -translate-x-full -translate-y-1/2 transform rounded bg-gray-800 px-1 text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100
                      `}
                  >
                    {symbol?.symbol}
                  </span>
                </div>

                <DisplayIncreDecrease
                  value={data && symbol && netchange[symbol.identifier]}
                />
              </div>
              <div className="flex flex-row ">
                <p
                  className={`w-[3.6rem] whitespace-nowrap rounded-2xl  text-[0.8rem] text-black `}
                >
                  {data && symbs && webSocketDataRead[symbol.identifier]
                    ? formatNumber(webSocketDataRead[symbol.identifier])
                    : ""}
                </p>
              </div>
            </span>
            <div className="flex flex-col items-center justify-center gap-1">
              <h1
                className={`w-[3.5rem] whitespace-nowrap  px-1 text-center text-[0.75rem]  ${
                  (data && symbol && netchange[symbol?.identifier]) < 0
                    ? " rounded-2xl border border-red-500 text-black"
                    : (data && symbol && netchange[symbol?.identifier]) > 0
                      ? "rounded-2xl border border-z-green-500 text-black"
                      : (data && symbol && netchange[symbol?.identifier]) == 0
                        ? "rounded-2xl border border-gray-300 text-gray-500"
                        : "font-label border-none text-gray-500"
                }`}
              >
                {data &&
                symbol &&
                typeof netchange[symbol?.identifier] === "number"
                  ? `${netchange[symbol?.identifier]?.toFixed(2)}`
                  : "--"}
              </h1>
              <p
                className={`flex w-[2.8rem] justify-center  text-[0.7rem]  ${
                  (data && symbol && netchange[symbol?.identifier]) < 0
                    ? "text-red-500 "
                    : (data && symbol && netchange[symbol?.identifier]) > 0
                      ? "text-z-green-500"
                      : Object.is(netchange[symbol?.identifier], -0)
                        ? "text-gray-500"
                        : "text-gray-500"
                } `}
              >
                <span>
                  {data &&
                  symbol &&
                  typeof netpercentage[symbol?.identifier] === "number"
                    ? `${netpercentage[symbol?.identifier]?.toFixed(2)}%`
                    : "--"}
                </span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
export default StocksCard;
