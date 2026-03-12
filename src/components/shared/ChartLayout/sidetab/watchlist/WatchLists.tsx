import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { tvWidget } from "@/components/tradingView/chartSetup";
import {
  addCartSuccess,
  setprimaryRefresh,
  setStock,
  spotPriceData,
} from "@/lib/redux/slices/StrategySlice";
import { symbolAddedToWatchlist } from "@/lib/redux/slices/ChartsSlice";
import {
  getFutureData,
  getOptionData,
  optionChainPayload,
} from "@/lib/redux/slices/AnalyzerSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import WatchListHeader from "./watchListTable/WatchListHeader";
import WatchListTableRow from "./watchListTable/WatchListTableRow";
import { removeSymbolarray } from "@/lib/util/watchlist/handlingServerData";
import { setInitiateTvChart } from "@/lib/redux/slices/PositionSlicer";
import {
  handleTransaction,
  handleUnpin,
  loadMoreSymbols,
} from "@/lib/util/watchlist/WatchlistUtil";
import config from "@/lib/config";

interface WatchListProps {
  setSymbols: Dispatch<SetStateAction<any>>;
  setSortConfig: Dispatch<SetStateAction<any>>;
  sortConfig: any;
  symbols: any;
  // data: any;
  clickedRow: any;
  fnoIdentifiers: any;
  filteredSymbols: any;
  activePositionFilter: any;
  selectedGroup: any;
  positionsData: any;
  brokerCode: number | null;
  selectedWatchlistId: number | null;
  setClickedSymbolData: Dispatch<SetStateAction<any>>;
  clickedrowdata: any;
  apikey: string;
  setclickedrowdata: Dispatch<SetStateAction<any>>;
  setSelectedSymbol: Dispatch<SetStateAction<any>>;
  setClickedRow: Dispatch<SetStateAction<any>>;

  pinnedSymbolslimit: any;
  setPinnedSymbolslimit: Dispatch<SetStateAction<any>>;
  setActivePositionFilter: Dispatch<SetStateAction<any>>;

  setAllIdentifiers: Dispatch<SetStateAction<any>>;
  setVisibleSymbols: Dispatch<SetStateAction<any>>;
  visibleSymbols: any;
  setShowTechnicals: Dispatch<SetStateAction<boolean>>;
  setShowNewsPivots: Dispatch<SetStateAction<boolean>>;
  leftWidth: any;
}

const WatchLists: React.FC<WatchListProps> = ({
  symbols,
  sortConfig,
  // data,
  clickedRow,
  fnoIdentifiers,
  filteredSymbols,
  activePositionFilter,
  selectedGroup,
  positionsData,
  clickedrowdata,
  selectedWatchlistId,
  brokerCode,
  setClickedSymbolData,
  apikey,
  setclickedrowdata,
  setSelectedSymbol,
  setClickedRow,
  setSymbols,
  pinnedSymbolslimit,
  setPinnedSymbolslimit,
  setSortConfig,
  setActivePositionFilter,
  setAllIdentifiers,
  setVisibleSymbols,
  visibleSymbols,
  setShowNewsPivots,
  setShowTechnicals,
  leftWidth,
}) => {
  const initialColumns = [
    { id: "symbol", title: "Symbol" },
    { id: "price", title: "ltp" },
    { id: "chg", title: "chg" },
    { id: "chgPercent", title: "chg%" },
  ];

  const [columns, setColumns] = useState(initialColumns);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const rowRefs = useRef<any>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [addToWatchlist, setAddTowatchlist] = useState(false);
  const [buy, setBuy] = useState(false);
  const [sell, setSell] = useState(false);
  const [buttonId, setbuttonID] = useState("");
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  const [pinnedSymbolsCount, setPinnedSymbolsCount] = useState<number>(3);
  const router = useNavigate();
  const dispatch = useDispatch();
  const shouldRefreshRedux = useSelector(
    (state: RootState) => state.strategy.shouldRefresh,
  );

  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const pinUnpinRedux = useSelector(
    (state: RootState) => state.strategy.pinUnpinstate,
  ); //state to check changes in pin or unpin symbols
  const netchange: any = useSelector(
    (state: RootState) => state.strategy.netChange,
  );
  const netpercentage = useSelector(
    (state: RootState) => state.strategy.netChangepercent,
  );
  const holdingsdata: any = useSelector(
    (state: RootState) => state.strategy.holdingsData,
  );

  const pinnedSymbols = useSelector(
    (state: RootState) => state.strategy.pinnedsymbols,
  );
  const defaultWatchlistPinnedSymbol = useSelector(
    (state: RootState) => state.charts.setDefaultWatchlist,
  );
  const TvChartInitiateIndex: any = useSelector(
    (state: RootState) => state.Position.initiateTvChart,
  );
  const SymbolIdentifier = useSelector(
    (state: RootState) => state.charts.SymbolIdentifier,
  );
  const posHoldFilterChanged: any = useSelector(
    (state: RootState) => state.Position.activePosHoldFilter,
  );
  const toggleState: any = useSelector(
    (state: RootState) => state.common.CandleAreaToggle,
  );
  const ITEMS_PER_PAGE = 50;
  const [currentPage, setCurrentPage] = useState(1);

  const lastRowRef = useRef<HTMLTableRowElement>(null);

  const [dragging, setDragging] = useState(false);
  const handleDragStart = () => {
    setDragging(true); // When dragging starts, set dragging state to true
  };
  const handleDragEnd = (result: any) => {
    setDragging(false);
    if (!result.destination) return;

    const updatedColumns = Array.from(columns);
    const [movedColumn] = updatedColumns.splice(result.source.index, 1);
    updatedColumns.splice(result.destination.index, 0, movedColumn);
    // console.log(updatedColumns, "fills");
    setColumns(updatedColumns);
  };

  useEffect(() => {
    const clickedRowIndex = filteredSymbols.findIndex(
      (row: any) => row.identifier === clickedRow,
    );
    if (clickedRowIndex !== -1 && rowRefs.current[clickedRowIndex]) {
      rowRefs.current[clickedRowIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [selectedRowIndex, clickedRow]);

  useEffect(() => {
    if (selectedRowIndex !== null) {
      handleRowClick(selectedRowIndex);
    }
  }, [selectedRowIndex, toggleState]);

  const selectNextRow = () => {
    if (
      selectedRowIndex != null &&
      selectedRowIndex < filteredSymbols.length - 1
    ) {
      setSelectedRowIndex(selectedRowIndex + 1);
    } else if (selectedRowIndex == filteredSymbols?.length - 1) {
      setSelectedRowIndex(0);
    }
  };
  const selectPrevRow = () => {
    if (
      selectedRowIndex != null &&
      selectedRowIndex <= filteredSymbols?.length - 1 &&
      selectedRowIndex != 0
    ) {
      setSelectedRowIndex(selectedRowIndex - 1);
    }
  };

  useEffect(() => {
    if (filteredSymbols.length > 0 && TvChartInitiateIndex == null) {
      setSelectedRowIndex(0);
    }
  }, [filteredSymbols]);

  const initialstocks: any = {
    exchange: clickedrowdata?.exchange,
    tradingsymbol: activePositionFilter //tradingsymbol
      ? clickedrowdata?.broker_symbol
      : clickedrowdata?.symbol,
    quantity: 1,
    ordertype: "MARKET",
    transactiontype: sell ? "SELL" : "BUY",
    producttype: "INTRADAY",
  };

  const handleRowClick = (index: any) => {
    const selectedRow = filteredSymbols[index];
    if (!selectedRow) return;

    const rowData = selectedRow.identifier;
    setShowNewsPivots(false);
    setShowTechnicals(false);
    setClickedRow(rowData);
    if (SymbolIdentifier == null) {
      tvWidget?.onChartReady(async () => {
        const resolution = tvWidget.activeChart().resolution();
        tvWidget.activeChart().setSymbol(rowData);
        tvWidget.activeChart().setResolution(resolution);
      });
    }
    setSelectedSymbol(rowData);
    const clickedSymbol = symbols.find(
      (symb: any) => symb.identifier === rowData,
    );
    setclickedrowdata(clickedSymbol);
    const price = webSocketDataRead[clickedSymbol?.identifier];
    dispatch(spotPriceData({ spotPrice: price }));

    if (clickedSymbol) {
      setClickedSymbolData(clickedSymbol);
      const row = clickedSymbol;

      const isFnoIdentifier = fnoIdentifiers.some(
        (identifierObj: any) =>
          identifierObj.identifier === clickedSymbol.identifier,
      );

      if (isFnoIdentifier) {
        dispatch(setprimaryRefresh(true));
      } else {
        dispatch(setprimaryRefresh(false));
      }
    }

    dispatch(symbolAddedToWatchlist(false));
  };

  const setFutureOption = (
    symb: any,
    cell: HTMLTableCellElement,
    type: any,
  ) => {
    dispatch(getFutureData({ futureData: {} }));
    dispatch(getOptionData({ optionData: {} }));

    dispatch(
      addCartSuccess({
        items: {
          exchange: "",
          index_name: "",
          spot_price: null,
          expiryDate: "",
        },
      }),
    );
    dispatch(
      setStock({
        stock: {
          exchange: symb.exchange,
          index_name: symb.symbol_name,
          spot_price: webSocketDataRead[symb.identifier],
        },
      }),
    );
    dispatch(
      optionChainPayload({
        optionChainPayloadData: { ClickedRow: {}, response: {} },
      }),
    );
    router(`${config.brokersListUrl}/${brokerCode}/psb`);
  };

  const handleBuy = (index: any) => {
    handleTransaction(
      index,
      "LONG",
      "buy-button",
      setSell,
      setBuy,
      filteredSymbols,
      setbuttonID,
      setClickedRow,
      setSelectedSymbol,
      symbols,
      webSocketDataRead,
      dispatch,
    );
  };

  const handleSell = (index) => {
    handleTransaction(
      index,
      "SHORT",
      "sell-button",
      setSell,
      setBuy,
      filteredSymbols,
      setbuttonID,
      setClickedRow,
      setSelectedSymbol,
      symbols,
      webSocketDataRead,
      dispatch,
    );
  };

  const handleRemove = (payload: string) => {
    removeSymbolarray(
      [payload],
      selectedWatchlistId,
      dispatch,
      shouldRefreshRedux,
      router,
    );
    dispatch(symbolAddedToWatchlist(false));
    if (pinnedSymbols.includes(payload)) {
      // If pinned, unpin the symbol first
      handleUnpin(
        selectedWatchlistId,
        payload,
        pinUnpinRedux,
        defaultWatchlistPinnedSymbol,
        pinnedSymbols,
        setPinnedSymbolslimit,
        dispatch,
        router,
      );
    }
  };
  const handleUnpinFunc = (selectedWatchlistId: any, payload: any) => {
    handleUnpin(
      selectedWatchlistId,
      payload,
      pinUnpinRedux,
      defaultWatchlistPinnedSymbol,
      pinnedSymbols,
      setPinnedSymbolslimit,
      dispatch,
      router,
    );
  };

  const handlePinnedSymbolState = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth;

      if (width >= 768 && width <= 991) {
        setPinnedSymbolsCount(1);
      } else if (width >= 992 && width <= 1199) {
        setPinnedSymbolsCount(2);
      } else {
        setPinnedSymbolsCount(3);
      }
    }
  };
  useEffect(() => {
    handlePinnedSymbolState();
    window.addEventListener("resize", handlePinnedSymbolState);

    return () => {
      window.removeEventListener("resize", handlePinnedSymbolState);
    };
  }, [window.innerWidth]);

  const handleMouseEnter = () => {
    if (pinnedSymbols.length >= pinnedSymbolsCount) {
      setPinnedSymbolslimit(true);
    } else {
      setPinnedSymbolslimit(false);
    }
  };

  const handleAddSymbolClick = (symbol: any) => {
    setClickedRow(symbol);
    setAddTowatchlist(true);

    // setClickedSymbolData(symbol)
  };

  useEffect(() => {
    if (TvChartInitiateIndex != null) {
      setActivePositionFilter(TvChartInitiateIndex.filter);
      if (
        posHoldFilterChanged == true ||
        activePositionFilter == TvChartInitiateIndex.filter
      ) {
        const matchedIndex = filteredSymbols.findIndex(
          (item) => item.identifier === TvChartInitiateIndex.identifier,
        );
        // Only update if item is found
        if (matchedIndex !== -1) {
          setSelectedRowIndex(matchedIndex);
          handleRowClick(matchedIndex);
        }
        dispatch(setInitiateTvChart(null));
      }
    }
  }, [TvChartInitiateIndex, posHoldFilterChanged]);

  useEffect(() => {
    const initialSymbols = filteredSymbols.slice(0, ITEMS_PER_PAGE);
    setVisibleSymbols(initialSymbols);
    if (selectedGroup != null && activePositionFilter == null) {
      //only group active
      setAllIdentifiers(initialSymbols?.map((s: any) => s.identifier)); // Set initial 50 identifiers
    }
    setCurrentPage(1);
  }, [filteredSymbols]);

  useEffect(() => {
    if (
      !lastRowRef.current ||
      visibleSymbols?.length >= filteredSymbols?.length
    )
      return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreSymbols(
            visibleSymbols,
            filteredSymbols,
            setCurrentPage,
            ITEMS_PER_PAGE,
            setVisibleSymbols,
            setAllIdentifiers,
            selectedGroup,
            activePositionFilter,
          );
        }
      },
      { threshold: 1.0 },
    );

    const target = lastRowRef.current;
    observer.observe(target);

    return () => observer.unobserve(target);
  }, [currentPage, visibleSymbols?.length, filteredSymbols]);

  return (
    <table
      className={`w-full ${dragging ? "" : "table-fixed"}  border-2 border-z-blue-100 text-center text-[0.75rem]  text-black text-gray-500`}
    >
      <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
        <Droppable droppableId="droppable" direction="horizontal">
          {(provided) => (
            <WatchListHeader
              columns={columns}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              symbols={symbols}
              provided={provided}
              setSymbols={setSymbols}
              leftWidth={leftWidth}
            />
          )}
        </Droppable>

        <tbody className="w-full ">
          {Array.isArray(visibleSymbols) && visibleSymbols.length > 0
            ? visibleSymbols.map((symb: any, index: any) => {
                const isFNO =
                  fnoIdentifiers &&
                  fnoIdentifiers?.some(
                    (index: any) => index.identifier === symb.identifier,
                  );
                const isLastRow =
                  visibleSymbols?.length !== 1 &&
                  index === visibleSymbols?.length - 1;
                return (
                  <WatchListTableRow
                    key={symb?.identifier}
                    symb={symb}
                    // data={data}
                    netchange={netchange}
                    netpercentage={netpercentage}
                    clickedRow={clickedRow}
                    handleRowClick={handleRowClick}
                    setSelectedRowIndex={setSelectedRowIndex}
                    setHoveredRow={setHoveredRow}
                    hoveredRow={hoveredRow}
                    selectedWatchlistId={selectedWatchlistId}
                    pinnedSymbols={pinnedSymbols}
                    handleUnpin={handleUnpinFunc}
                    addToWatchlist={addToWatchlist}
                    handleBuy={handleBuy}
                    handleSell={handleSell}
                    setFutureOption={setFutureOption}
                    holdingsdata={holdingsdata}
                    positionsData={positionsData}
                    selectedGroup={selectedGroup}
                    columns={columns}
                    index={index}
                    activePositionFilter={activePositionFilter}
                    handleAddSymbolClick={handleAddSymbolClick}
                    isFNO={isFNO}
                    pinnedSymbolslimit={pinnedSymbolslimit}
                    handleMouseEnter={handleMouseEnter}
                    isLastRow={isLastRow}
                    setAddTowatchlist={setAddTowatchlist}
                    handleRemove={handleRemove}
                    setPinnedSymbolslimit={setPinnedSymbolslimit}
                    setSymbols={setSymbols}
                    selectPrevRow={selectPrevRow}
                    selectNextRow={selectNextRow}
                    rowRefs={rowRefs}
                    lastRowRef={lastRowRef}
                    pinnedSymbolsCount={pinnedSymbolsCount}
                    leftWidth={leftWidth}
                  />
                );
              })
            : ""}
        </tbody>
      </DragDropContext>
    </table>
  );
};

export default WatchLists;
