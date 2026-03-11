import Image from "next/image";
import React, {
  SetStateAction,
  Dispatch,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { UserWatchlistRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { useDispatch, useSelector } from "react-redux";
import { setShouldRefresh } from "@/lib/redux/slices/StrategySlice";
import _debounce from "lodash/debounce";
import { RootState } from "@/lib/redux/Store";
import ListOfWatchList from "../../flotingComponent/listOfWatchlist/ListOfWatchList";

import { tvWidget } from "@/components/tradingView/chartSetup";
import {
  setDefaultWatchlistData,
  showHeatmap,
} from "@/lib/redux/slices/ChartsSlice";
import SymbolFilter from "./SymbolFilter";
import HeatMap from "./HeatMap/Heatmap";

import PositionsHoldingFilter from "./PositionsHoldingFilter";
import SwitchWatchList from "./SwitchWatchList";
import EmptyWatchlist from "./EmptyWatchlist";

import HeatMapButton from "./HeatMap/HeatMapButton";
import {
  addWatchListForNewUser,
  CreateWatchlistForNewUser,
  handleStarClick,
} from "../../../../../lib/util/watchlist/DefaultWatchlist";

import ChartNewsButton from "./handleChartNewsButton";
import MiniMaxButton from "./MiniMaxButton";
import WatchLists from "./WatchLists";
import {
  combineSymbolData,
  filterSymbols,
  handlePinSymbol,
} from "@/lib/util/watchlist/heatMapHandle";
import {
  fetchSymbolPriceData,
  fetchWatchlistData,
  getCachedIndices,
} from "@/lib/util/watchlist/handlingServerData";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";
import {
  setIdentifiersSet,
  updateSymbolPnl,
} from "@/lib/redux/slices/PositionSlicer";
import { calculateHoldingsPnL } from "@/lib/util/sideToolBar/holdingsUtil";
import { get } from "react-hook-form";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { handleToggle } from "@/components/tradingView/CustomCheckBoxButton";
import { ViewType } from "@/lib/util/toggleButtonName/toggleButtonNames";
import CandleIcon from "../../optionFutures/CandleIcon";

interface StocksTableProps {
  setParentVisible: (visibility: boolean) => void;
  setShow: Dispatch<SetStateAction<boolean>>;
  setShowCreateWatchlist: Dispatch<SetStateAction<boolean>>;
  selectedWatchlistId: number | null;
  setSelectedWatchlistId: Dispatch<SetStateAction<number | null>>;
  symbols: any;
  setSymbols: Dispatch<SetStateAction<any>>;

  setClickedSymbolData: Dispatch<SetStateAction<any>>;
  brokerCode: number | null;
  apikey: string;
  fnoIdentifiers: any;
  setFnoIdentifiers: Dispatch<SetStateAction<any[]>>;
  clickTvChart: boolean;
  setClickTvChart: Dispatch<SetStateAction<boolean>>;
  aeroToggle: boolean;
  setAeroToggle: Dispatch<SetStateAction<boolean>>;
  setTopHeight: Dispatch<SetStateAction<any>>;
  topHeight: any;
  toggleState: string;
  setShowTechnicals: Dispatch<SetStateAction<boolean>>;
  setShowNewsPivots: Dispatch<SetStateAction<boolean>>;
  setDisplayedName: Dispatch<SetStateAction<any>>;
  setHeatMapData: Dispatch<SetStateAction<any>>;
  leftWidth: any;
}

const StocksTable: React.FC<StocksTableProps> = ({
  apikey,
  selectedWatchlistId,
  brokerCode,
  symbols,
  setSymbols,
  setSelectedWatchlistId,
  setShow,
  setShowCreateWatchlist,
  setClickedSymbolData,
  setFnoIdentifiers,
  fnoIdentifiers,
  clickTvChart,
  setClickTvChart,
  aeroToggle,
  setAeroToggle,
  setTopHeight,
  topHeight,
  toggleState,
  setShowNewsPivots,
  setShowTechnicals,
  setHeatMapData,
  setDisplayedName,
  leftWidth,
}) => {
  type SymbolType = "index" | "equity" | "options" | "futures" | null;
  type PositionType = "positions" | "holdings" | null;

  const dispatch = useDispatch();
  const [name, setName] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [identifiers, setIdentifiers] = useState<any[]>([]);
  const [clickedRow, setClickedRow] = useState("");
  const [showList, setShowList] = useState(false);
  const watchlistRef = useRef(null);
  const [defaultWatchlist, setDefaultWatchlist] = useState<any>(null);
  const [filteredSymbols, setFilteredSymbols] = useState<Array<any>>([]);
  const [activeSymbolFilter, setActiveSymbolFilter] =
    useState<SymbolType>(null);
  const [activePositionFilter, setActivePositionFilter] =
    useState<PositionType>(null);
  const [positionsData, setPositionsData] = useState<any>([]);
  const [clickedrowdata, setclickedrowdata] = useState("");
  const [pinnedSymbolslimit, setPinnedSymbolslimit] = useState(false);
  const [filterClick, setFilterClick] = useState(false);
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  const pinUnpinRedux = useSelector(
    (state: RootState) => state.strategy.pinUnpinstate
  ); //state to check changes in pin or unpin symbols
  const netchange: any = useSelector(
    (state: RootState) => state.strategy.netChange
  );
  const netpercentage = useSelector(
    (state: RootState) => state.strategy.netChangepercent
  );

  const [selectedSymbol, setSelectedSymbol] = useState("");
  const shouldRefreshRedux = useSelector(
    (state: RootState) => state.strategy.shouldRefresh
  );
  const holdingsdata: any = useSelector(
    (state: RootState) => state.strategy.holdingsData
  );
  const positionsdata = useSelector(
    (state: RootState) => state.strategy.positions
  );
  const pinnedSymbols = useSelector(
    (state: RootState) => state.strategy.pinnedsymbols
  );
  const CurrentToggle: any = useSelector(
    (state: RootState) => state.common.CandleAreaToggle
  );
  const prevFirstSymbolRef = useRef(null);
  const [responseSymboldata, setResponseSymboldata] = useState<any[]>([]);
  const [activePositionsHoldings, setActivePositionsHoldings] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [selectedGroupData, setSelectedGroupData] = useState<any>();
  const showHeatMap = useSelector(
    (state: RootState) => state.charts.setShowHeatmap
  );

  const SymbolAdded = useSelector(
    (state: RootState) => state.charts.setAddSymbols
  );

  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [createNewUserWatchlist, setCreateNewUserWatchlist] = useState(false);
  const defaultWatchlistPinnedSymbol = useSelector(
    (state: RootState) => state.charts.setDefaultWatchlist
  );
  const SymbolIdentifier = useSelector(
    (state: RootState) => state.charts.SymbolIdentifier
  );
  const router = useRouter();
  const identifiersSet = useSelector(
    (state: RootState) => state.Position.identifiersSet
  );
  const getAllindices = useSelector(
    (state: RootState) => state.charts.getAllIndicesData
  );

  const [allIdentifiers, setAllIdentifiers] = useState<string[]>([]);
  const ITEMS_PER_PAGE = 50;
  const [visibleSymbols, setVisibleSymbols] = useState(
    filteredSymbols.slice(0, ITEMS_PER_PAGE)
  );
  const [showheatMapIcon, setShowheatMapIcon] = useState(true);
  const TvChartInitiateIndex: any = useSelector(
    (state: RootState) => state.Position.initiateTvChart
  );
  // selected watchlist id
  const handleSelectWatchlist = (watchlistId: number) => {
    setSelectedWatchlistId(watchlistId);
  };

  useEffect(() => {
    if (brokerCode != null) getCachedIndices(brokerCode, dispatch, router);
  }, [brokerCode]);
  // selected watchlist showing
  useEffect(() => {
    fetchWatchlistData(
      selectedWatchlistId,
      setName,
      setIdentifiers,
      setResponseSymboldata,
      setSymbols,
      dispatch,
      setShow,
      setDefaultWatchlist,
      router,
      pinUnpinRedux,
      defaultWatchlistPinnedSymbol
    );
  }, [shouldRefreshRedux, selectedWatchlistId]);

  // set default watchlist

  const fetchDefaultWatchlist = async () => {
    if (!selectedWatchlistId && selectedGroup == null) {
      try {
        const api = new UserWatchlistRouterApi(baseConfig());

        const res = await api.fetchWatchlistsV1UsersMeWatchlistsGet();

        if (res?.data?.length == 0) {
          setCreateNewUserWatchlist(true);
        }

        const defaultList = res.data.find(
          (watchlist: any) => watchlist.primary === true
        );
        // for new user
        const allPrimaryFalse = res.data.every(
          (watchlist: any) => watchlist.primary === false
        );
        if (defaultList) {
          setSelectedWatchlistId(defaultList.id);
          setDefaultWatchlist(defaultList);
          dispatch(setDefaultWatchlistData(defaultList));
        }
        if (res?.data?.length > 0 && allPrimaryFalse) {
          const firstWLId = res?.data[0]?.id;

          // Ensure asynchronous actions are awaited
          await handleStarClick(firstWLId, router);
          await addWatchListForNewUser(firstWLId, "NSE:NIFTY50", router);
          await dispatch(setShouldRefresh(!shouldRefreshRedux)); // No need for `async` here
          setSelectedWatchlistId(firstWLId);
        }
      } catch (err: any) {
        if (err?.response && err?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (err?.response && err?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      }
    }
  };

  // for new user
  useEffect(() => {
    if (createNewUserWatchlist) {
      const handleWatchlistCreation = async () => {
        try {
          await CreateWatchlistForNewUser(router);

          await fetchDefaultWatchlist();
        } catch (error: any) {
          if (error?.response && error?.response?.status == 401) {
            autoLogoutTokenRemove(router);
          }
          if (error?.response && error?.response?.status == 456) {
            brokerLogoutTokenRemove(router);
          }
        }
      };

      handleWatchlistCreation();
    }
  }, [createNewUserWatchlist]);

  useEffect(() => {
    fetchDefaultWatchlist();
  }, [selectedWatchlistId]);
  // group wised watchlist
  useEffect(() => {
    if (selectedGroup != null) {
      setIdentifiers(selectedGroupData.identifiers);
      setSymbols(selectedGroupData.symbols);
      setResponseSymboldata(selectedGroupData.symbols);
    }
  }, [selectedGroup]);

  useEffect(() => {
    // Select the first symbol by default
    if (
      symbols.length > 0 &&
      !SymbolAdded &&
      SymbolIdentifier == null &&
      TvChartInitiateIndex == null
    ) {
      const firstSymbol = symbols[0];
      setClickedRow(firstSymbol.identifier);
      setSelectedSymbol(firstSymbol.symbol);
      setClickedSymbolData(firstSymbol);
      setclickedrowdata(firstSymbol);

      if (
        firstSymbol &&
        prevFirstSymbolRef.current !== firstSymbol.symbol &&
        !SymbolAdded &&
        SymbolIdentifier == null
      ) {
        tvWidget?.onChartReady(async () => {
          const resolution = tvWidget?.activeChart().resolution();
          tvWidget?.activeChart().setSymbol(firstSymbol.identifier);
          tvWidget?.activeChart().setResolution(resolution);
        });
        prevFirstSymbolRef.current = firstSymbol.symbol;
      }
    }
  }, [symbols, brokerCode]);

  useEffect(() => {
    if (identifiers.length > 0 && selectedGroup == null) {
      const payload = identifiers;
      fetchSymbolPriceData(
        payload,
        brokerCode,
        // setData,
        setFnoIdentifiers,
        selectedWatchlistId,
        dispatch,
        shouldRefreshRedux,
        getAllindices,
        router
      );
    }
  }, [identifiers, brokerCode]);
  useEffect(() => {
    if (allIdentifiers.length > 0 && selectedGroup != null) {
      const payload = allIdentifiers;
      fetchSymbolPriceData(
        payload,
        brokerCode,
        // setData,
        setFnoIdentifiers,
        selectedWatchlistId,
        dispatch,
        shouldRefreshRedux,
        getAllindices,
        router
      );
    }
  }, [allIdentifiers]);

  const addsymbol = (e: any) => {
    e.stopPropagation();
    setShow(true);
  };

  useEffect(() => {
    const sortedPositionsData =
      positionsdata &&
      [...positionsdata].sort((a, b) => {
        if (a.transaction_type === "EXITED" && b.transaction_type !== "EXITED")
          return 1;
        if (a.transaction_type !== "EXITED" && b.transaction_type === "EXITED")
          return -1;
        return 0;
      });
    setPositionsData(sortedPositionsData);
  }, [positionsdata]);
  // filter wise symbol sorting
  useEffect(() => {
    filterSymbols(
      responseSymboldata,
      activeSymbolFilter,
      activePositionFilter,
      setActivePositionsHoldings,
      holdingsdata,
      positionsData,
      sortConfig,
      setFilteredSymbols,
      setSymbols,
      webSocketDataRead,
      netchange,
      netpercentage,
      dispatch
    );
  }, [
    activeSymbolFilter,
    activePositionFilter,
    responseSymboldata,
    sortConfig,
    activePositionsHoldings,
  ]);
  //Update holdings positions in watchlist data
  useEffect(() => {
    if (activePositionFilter != null)
      filterSymbols(
        responseSymboldata,
        activeSymbolFilter,
        activePositionFilter,
        setActivePositionsHoldings,
        holdingsdata,
        positionsData,
        sortConfig,
        setFilteredSymbols,
        setSymbols,
        webSocketDataRead,
        netchange,
        netpercentage,
        dispatch
      );
  }, [holdingsdata, positionsData]);

  useEffect(() => {
    if (symbols?.length === 0 && responseSymboldata?.length > 0) {
      setSymbols([...responseSymboldata]);
    }
  }, [responseSymboldata]);
  // pin symbol function play

  const combinedSymbolData = useMemo(() => {
    const data = combineSymbolData(
      filteredSymbols,
      webSocketDataRead,
      netpercentage
    );
    return data;
  }, [filteredSymbols, showHeatMap, webSocketDataRead]);

  const handleHeatMap = (e: any) => {
    e.stopPropagation();

    if (
      selectedGroup == null ||
      visibleSymbols.length == filteredSymbols.length ||
      activePositionFilter != null
    ) {
      dispatch(showHeatmap(true));

      setHeatMapData((prevData: any) => {
        const limitedData = combinedSymbolData.slice(0, 150); // Enforce limit
        if (JSON.stringify(prevData) !== JSON.stringify(limitedData)) {
          return limitedData;
        }
        return prevData;
      });

      setAeroToggle(false);
    }
  };

  useEffect(() => {
    if (
      selectedGroup != null &&
      activePositionFilter == null &&
      visibleSymbols.length != filteredSymbols.length
    ) {
      setShowheatMapIcon(false);
    } else {
      setShowheatMapIcon(true);
    }
  }, [allIdentifiers, selectedGroup, activePositionFilter]);

  useEffect(() => {
    const calculatedName = activePositionFilter
      ? activePositionFilter === "holdings"
        ? "Holdings"
        : "Positions"
      : selectedGroup
        ? selectedGroup
        : name;
    setDisplayedName(calculatedName);
  }, [activePositionFilter, selectedGroup, name]);

  useEffect(() => {
    const lastSymbol = responseSymboldata[symbols.length - 1];

    if (lastSymbol && SymbolAdded && SymbolIdentifier == null) {
      setClickedRow(lastSymbol?.identifier);
      setSelectedSymbol(lastSymbol?.symbol);
      setClickedSymbolData(lastSymbol);
      setclickedrowdata(lastSymbol);
      tvWidget?.onChartReady(async () => {
        const resolution = tvWidget?.activeChart().resolution();
        tvWidget
          ?.activeChart()
          .setSymbol(responseSymboldata[symbols.length - 1].identifier);
        tvWidget?.activeChart().setResolution(resolution);
      });
    }
  }, [responseSymboldata, symbols, brokerCode]);

  const handleDoubleClick = () => {
    topHeight == 93.5 ? setTopHeight(45) : setTopHeight(93.5);
    const top_height2: any = document.getElementById("top-height2");
    if (top_height2) {
      if (topHeight == 93.5) top_height2.style.height = `${90 - 45}%`;
      else top_height2.style.height = `${100 - 93.5}%`;
    }
  };
  useEffect(() => {
    if (
      !identifiersSet &&
      (positionsdata?.length > 0 || holdingsdata?.holdings?.length > 0)
    ) {
      const holdingIdentifiers =
        holdingsdata?.holdings?.length > 0
          ? holdingsdata.holdings.map((h: any) => h.identifier)
          : [];
      const positionIdentifiers =
        positionsdata?.length > 0
          ? positionsdata.map((p: any) => p.identifier)
          : [];

      setIdentifiers([...holdingIdentifiers, ...positionIdentifiers]);
      dispatch(setIdentifiersSet(true));
    }
  }, [positionsdata, holdingsdata]);

  return (
    <div className="flex h-full w-full flex-col max-xl:bg-white max-sm:justify-start sm:max-xl:justify-center ">
      <div className="flex flex-col">
        <div
          onClick={() => {
            if (window.innerWidth < 1200) {
              setAeroToggle(!aeroToggle);
            }
          }}
          onDoubleClick={handleDoubleClick}
          id="watchlistHeader"
          className="flex w-full flex-row items-center justify-between max-xl:border-b-[0.05rem] max-xl:border-solid max-xl:border-z-br-gray max-md:h-[2.5rem] sm:max-md:px-2 md:max-xl:h-[3rem] md:max-xl:px-4 xl:h-[1.9rem] xl:rounded-2xl xl:pt-[0.2rem] xl:shadow-2xl "
        >
          <div className="max-w-2/6 flex flex-row items-center sm:max-md:px-1 ">
            <SwitchWatchList
              selectedGroup={selectedGroup}
              name={name}
              activePositionFilter={activePositionFilter}
              showList={showList}
              setShowList={setShowList}
              watchlistRef={watchlistRef}
              setActivePositionFilter={setActivePositionFilter}
            />
          </div>

          {/* <div className=" max-w-3/6 flex hidden flex-row  items-center gap-3">

            <PositionsHoldingFilter
              setActivePositionFilter={setActivePositionFilter}
              activePositionFilter={activePositionFilter}
            />

            {activePositionFilter === null && selectedGroup == null && (
              <SymbolFilter
                filterClick={filterClick}
                activeSymbolFilter={activeSymbolFilter}
                setActiveSymbolFilter={setActiveSymbolFilter}
              />
            )}
          </div> */}

          <div className="flex flex-row items-center justify-between gap-1 max-sm:h-full max-sm:w-[15rem]  max-sm:px-2 sm:max-xl:w-[16rem] xl:max-w-96 xl:gap-3 xl:px-3">
            <span
              onDoubleClick={(event: any) => {
                event.stopPropagation();
              }}
              className="w-[3.3rem] lg:w-[3.8rem] xl:hidden"
            >
              <ChartNewsButton
                clickTvChart={clickTvChart}
                setClickTvChart={setClickTvChart}
                aeroToggle={aeroToggle}
                setAeroToggle={setAeroToggle}
                toggleState={toggleState}
              />
            </span>
            {CurrentToggle == ViewType.CANDLESTICK ? (
              <div
                className="group relative inline-block cursor-pointer "
                onDoubleClick={(event: any) => {
                  event.stopPropagation();
                }}
              >
                <Image
                  src="/svg/view.svg"
                  className="h-[1.2rem] w-[1.2rem] max-sm:h-[1.55rem] max-sm:w-[1.5rem] sm:max-md:h-[1.5rem] sm:max-md:w-[1.5rem] md:max-lg:h-[1.4rem] md:max-lg:w-[1.4rem] lg:max-xl:h-[1.5rem] lg:max-xl:w-[1.5rem] xl:mb-[0.2rem] xl:h-[1.25rem] xl:w-[1.25rem] "
                  width="18"
                  height="18"
                  alt="view"
                  onClick={(e) => {
                    handleToggle(ViewType.STOCK_INFO, dispatch);
                    e.stopPropagation();
                  }}
                  onDoubleClick={(event: any) => {
                    event.stopPropagation();
                  }}
                />

                <span className="pointer-events-none absolute z-[1001] ml-1 mt-2 w-[4rem] -translate-x-1/2 -translate-y-1/2 transform rounded bg-gray-800  px-1  text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden xl:max-2xl:left-[3rem] xl:max-2xl:top-[2rem]">
                  Stock Info
                </span>
              </div>
            ) : (
              <div
                className="group relative inline-block cursor-pointer "
                onDoubleClick={(event: any) => {
                  event.stopPropagation();
                }}
              >
                <CandleIcon
                  className="flex cursor-pointer items-center justify-center rounded max-sm:h-[1.5rem] max-sm:w-[1.5rem]  sm:max-xl:h-[1rem] sm:max-xl:w-[1rem] xl:h-[1.35rem] xl:w-[1.35rem]"
                  onClick={(e) => {
                    handleToggle(ViewType.CANDLESTICK, dispatch);
                    e.stopPropagation();
                  }}
                />
                <span className="pointer-events-none absolute z-[1001] ml-1 mt-2 w-[4rem] -translate-x-1/2 -translate-y-1/2 transform rounded bg-gray-800  px-1  text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden xl:max-2xl:left-[3rem] xl:max-2xl:top-[2rem]">
                  Charts
                </span>
              </div>
            )}
            {activePositionFilter === null && selectedGroup == null && (
              <div
                className="group relative inline-block cursor-pointer "
                onDoubleClick={(event: any) => {
                  event.stopPropagation();
                }}
              >
                <Image
                  src="/svg/searchIcon.svg"
                  className="h-[1.2rem] w-[1.2rem] max-sm:h-[1.55rem] max-sm:w-[1.5rem] sm:max-md:h-[1.5rem] sm:max-md:w-[1.5rem] md:max-lg:h-[1.4rem] md:max-lg:w-[1.4rem] lg:max-xl:h-[1.5rem] lg:max-xl:w-[1.5rem] xl:mb-[0.2rem] xl:h-[1.25rem] xl:w-[1.25rem] "
                  width="18"
                  height="18"
                  alt="plus"
                  onClick={addsymbol}
                  onDoubleClick={(event: any) => {
                    event.stopPropagation();
                  }}
                />

                <span className="pointer-events-none absolute z-[1001] ml-1 w-[5.5rem] -translate-x-full -translate-y-1/2 transform rounded bg-gray-800  px-1  text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden xl:max-2xl:left-[3rem] xl:max-2xl:top-[2rem]">
                  Add Symbols
                </span>
              </div>
            )}
            <div className="group relative inline-block cursor-pointer">
              <Image
                src="/svg/filter.svg"
                className="max-sm:h-[1.35rem] max-sm:w-[1.2rem] sm:max-md:h-[1.3rem] sm:max-md:w-[1.3rem] md:max-xl:h-[1.4rem] md:max-xl:w-[1.1rem] xl:mb-[0.3rem] xl:h-[1.15rem] xl:w-[1rem]"
                width="18"
                height="18"
                alt=""
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.innerWidth < 1200) {
                    if (aeroToggle) {
                      setFilterClick(!filterClick);
                    }
                  }
                  if (window.innerWidth >= 1200) {
                    setFilterClick(!filterClick);
                  }
                }}
                onDoubleClick={(event: any) => {
                  event.stopPropagation();
                }}
              />

              <span className="pointer-events-none absolute left-[1.5rem] top-[2rem] z-[1001] ml-1 w-[3rem] -translate-x-full -translate-y-1/2 transform rounded bg-gray-800 px-1 text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden">
                Filter
              </span>
            </div>

            <div
              className="group relative inline-block cursor-pointer  max-xl:flex max-xl:items-center max-xl:justify-center "
              onDoubleClick={(event: any) => {
                event.stopPropagation();
              }}
            >
              {showheatMapIcon && (
                <HeatMapButton handleHeatMap={handleHeatMap} />
              )}
            </div>

            <div
              className="max-sm:h-full xl:hidden"
              onDoubleClick={(event: any) => {
                event.stopPropagation();
              }}
            >
              <MiniMaxButton
                aeroToggle={aeroToggle}
                setAeroToggle={setAeroToggle}
                setFilterClick={setFilterClick}
              />
              <div></div>
            </div>
          </div>
        </div>
        {/* Only for Small Screen */}
        {(window.innerWidth < 1200
          ? aeroToggle && filterClick
          : filterClick) && (
          <div
            className="flex items-center justify-center bg-white max-2xl:w-full max-md:py-[0.5rem] max-sm:h-[2rem] max-sm:gap-[1rem] sm:max-md:h-[3rem] sm:max-md:gap-[3rem] md:max-xl:h-[4rem] md:max-xl:gap-[4rem] xl:h-[1.8rem] xl:gap-[1rem] xl:max-2xl:pl-3"
            onDoubleClick={(event: any) => {
              event.stopPropagation();
            }}
          >
            <PositionsHoldingFilter
              setActivePositionFilter={setActivePositionFilter}
              activePositionFilter={activePositionFilter}
            />
            {activePositionFilter === null && (
              <SymbolFilter
                filterClick={filterClick}
                activeSymbolFilter={activeSymbolFilter}
                setActiveSymbolFilter={setActiveSymbolFilter}
              />
            )}
          </div>
        )}
        {/* Only for Small Screen */}
      </div>

      {/* list of watchlist table */}
      {showList ? (
        <div
          ref={watchlistRef}
          className={`${aeroToggle ? "" : "max-xl:hidden"}`}
        >
          <ListOfWatchList
            aeroToggle={aeroToggle}
            setShowCreateWatchlist={setShowCreateWatchlist}
            setShowList={setShowList}
            onSelectWatchlist={handleSelectWatchlist}
            setSelectedWatchlistId={setSelectedWatchlistId}
            setSelectedGroup={setSelectedGroup}
            setSelectedGroupData={setSelectedGroupData}
          />
        </div>
      ) : (
        ""
      )}

      {/* {watchlist table} */}

      <div
        className={`h-full w-full overflow-x-hidden overflow-x-hidden overflow-y-scroll text-black scrollbar-none ${
          aeroToggle ? "" : "max-xl:hidden"
        }`}
      >
        <>
          {/*empty watchlist filter display  */}
          <EmptyWatchlist
            filteredSymbols={filteredSymbols}
            selectedGroup={selectedGroup}
            activeSymbolFilter={activeSymbolFilter}
            activePositionFilter={activePositionFilter}
            activePositionsHoldings={activePositionsHoldings}
          />
          {Array.isArray(filteredSymbols) && filteredSymbols.length > 0 && (
            <WatchLists
              sortConfig={sortConfig}
              setSymbols={setSymbols}
              setSortConfig={setSortConfig}
              symbols={symbols}
              // data={data}
              activePositionFilter={activePositionFilter}
              fnoIdentifiers={fnoIdentifiers}
              filteredSymbols={filteredSymbols}
              clickedRow={clickedRow}
              selectedGroup={selectedGroup}
              positionsData={positionsData}
              clickedrowdata={clickedrowdata}
              selectedWatchlistId={selectedWatchlistId}
              brokerCode={brokerCode}
              setClickedSymbolData={setClickedSymbolData}
              apikey={apikey}
              setclickedrowdata={setclickedrowdata}
              setSelectedSymbol={setSelectedSymbol}
              setClickedRow={setClickedRow}
              pinnedSymbolslimit={pinnedSymbolslimit}
              setPinnedSymbolslimit={setPinnedSymbolslimit}
              setActivePositionFilter={setActivePositionFilter}
              setAllIdentifiers={setAllIdentifiers}
              visibleSymbols={visibleSymbols}
              setVisibleSymbols={setVisibleSymbols}
              setShowTechnicals={setShowTechnicals}
              setShowNewsPivots={setShowNewsPivots}
              leftWidth={leftWidth}
            />
          )}
        </>
      </div>
    </div>
  );
};

export default StocksTable;
