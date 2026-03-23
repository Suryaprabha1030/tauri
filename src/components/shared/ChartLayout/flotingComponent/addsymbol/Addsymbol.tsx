import { UserBrokerRouterApi, UserWatchlistRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { RootState } from "@/lib/redux/Store";
import { symbolAddedToWatchlist } from "@/lib/redux/slices/ChartsSlice";
import { addSymbol, setShouldRefresh } from "@/lib/redux/slices/StrategySlice";
import { removeSymbolarray } from "@/lib/util/watchlist/handlingServerData";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AddSymbolHeader from "./AddSymbolHeader";
import SearchSymbol from "./SearchSymbol";

import FliterGroup from "./FliterGroup";
import AddSymbolTable from "./AddSymbolTable";
import { searchTypeMap } from "@/lib/util/analyzer/generalUtil/generalUtil";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useNavigate } from "react-router-dom";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface addSymbolProps {
  setShow: Dispatch<SetStateAction<boolean>>;
  selectedWatchlistId: number | null;
  symbols: any;
  brokerCode: any;
}

const Addsymbol: React.FC<addSymbolProps> = (props) => {
  const { setShow, selectedWatchlistId, symbols, brokerCode } = props;
  const [displaySymb, setDisplaySymb] = useState([]);

  const dispatch = useDispatch();
  const [searchSymbol, setSearchSymbol] = useState("Nifty");

  const limitSetAddSymbol = useSelector(
    (state: RootState) => state.strategy.limitAddSymbol,
  );
  const shouldRefreshRedux = useSelector(
    (state: RootState) => state.strategy.shouldRefresh,
  );
  const [grpSymbols, setGrpSymbols] = useState([]);
  const [selectedFilter1, setSelectedFilter1] = useState(() => {
    const savedFilter1 = localStorage.getItem("selectedFilter1");
    return savedFilter1 ? savedFilter1 : "Indices"; // Default to 'Indices' if no value is found
  });

  const [selectedFilter2, setSelectedFilter2] = useState(() => {
    const savedFilter2 = localStorage.getItem("selectedFilter2");
    return savedFilter2 ? savedFilter2 : "none"; // Default to 'none' if no value is found
  });
  const [selectedExchange, setSelectedExchange] = useState<"NSE" | "BSE">(
    "NSE",
  );
  const router = useNavigate();
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [selected, setSelected] = useState("No Group");

  // index_options, indices, index_futures, stock_futures, index_options

  // useEffect(() => {
  const fetchSymbols = async (searchSymbol: string) => {
    try {
      if (searchSymbol.length < 2) return;
      const addSymbolApi = new UserBrokerRouterApi(baseConfig());

      const searchType = searchTypeMap[selectedFilter1]?.[selectedFilter2];
      if (!searchType) {
        console.error("Invalid filter combination");
        return;
      }

      const res =
        await addSymbolApi.searchMyBrokerSymbolV1UsersMeBrokersBrokerCodeSearchSymbolPost(
          brokerCode,
          {
            exchange: selectedExchange,
            search_symbol: searchSymbol,
            search_symbol_type: searchType,
          },
        );
      setDisplaySymb(res.data);
    } catch (err: any) {
      if (err?.response && err?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      }
      if (err?.response && err?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
    }
  };

  const searchInstruments = (text: string) => {
    const result = grpSymbols.filter((item: any) =>
      item.symbol.toUpperCase().includes(text.toUpperCase()),
    );

    setDisplaySymb(result);
  };

  useEffect(() => {
    if (brokerCode !== null && selected == "No Group") {
      fetchSymbols(searchSymbol);
    } // Fetch symbols based on default value
  }, [
    searchSymbol,
    selectedFilter1,
    selectedFilter2,
    selectedExchange,
    brokerCode,
  ]);

  const addWatchList = async (symbol: string) => {
    try {
      if (limitSetAddSymbol === true) {
        toast("You can add up to 50 stocks!");
        return;
      }
      const addwatchlistApi = new UserWatchlistRouterApi(baseConfig());

      const res =
        await addwatchlistApi.addSymbolsInWatchlistsV1UsersMeWatchlistsWatchlistIdAddSymbolsPost(
          selectedWatchlistId,
          [symbol],
        );
      dispatch(setShouldRefresh(!shouldRefreshRedux));

      symbols?.forEach((symbol:any) =>
        dispatch(
          addSymbol({
            symbol: symbol?.identifier,
            // token: symbol.token
          }),
        ),
      ); //store the symbols and token in redux
    } catch (err: any) {
      if (err?.response && err?.response?.status == 401) {
        autoLogoutTokenRemove(router);
      } else if (err?.response && err?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      } else {
        toast("invalid input!");
      }
    }
  };

  const handleImageClickEvent = (
    symbol: string,
    e: React.MouseEvent<HTMLImageElement>,
  ) => {
    e.currentTarget.blur();
    if (symbols.some((item: any) => item.identifier === symbol)) {
      removeSymbolarray(
        [symbol],
        selectedWatchlistId,
        dispatch,
        shouldRefreshRedux,
        router,
      );
    } else {
      addWatchList(symbol);
    }
    dispatch(symbolAddedToWatchlist(true));
  };

  useEffect(() => {
    localStorage.setItem("selectedFilter1", selectedFilter1);
    localStorage.setItem("selectedFilter2", selectedFilter2);
  }, [selectedFilter1, selectedFilter2]);

  useEffect(() => {
    if (selected != "No Group") {
      searchInstruments(searchSymbol);
    }
  }, [searchSymbol, selected]);

  return (
    <div className="relative h-full w-full rounded-2xl border-2 border-white bg-white shadow-2xl">
      <div className="bg-shadow flex flex-col items-center justify-between rounded-t-2xl border-b-[0.05rem] border-z-br-gray bg-white  max-xl:w-full xl:max-2xl:w-[40rem] 2xl:w-[45rem] ">
        <AddSymbolHeader
          setShow={setShow}
          setSelected={setSelected}
          selected={selected}
          setGrpSymbols={setGrpSymbols}
          setSearchSymbol={setSearchSymbol}
        />

        <div className="flex w-full items-center justify-between max-xl:flex-col max-xl:px-1 max-lg:py-1.5 lg:max-xl:py-2 xl:flex-row xl:max-2xl:px-3 2xl:px-10 ">
          <SearchSymbol
            searchSymbol={searchSymbol}
            setSearchSymbol={setSearchSymbol}
          />
          <FliterGroup
            setSelectedFilter1={setSelectedFilter1}
            setSelectedFilter2={setSelectedFilter2}
            setSelectedExchange={setSelectedExchange}
            selectedExchange={selectedExchange}
            selectedFilter2={selectedFilter2}
            selectedFilter1={selectedFilter1}
            selected={selected}
          />
        </div>
      </div>

      <div className="overflow-y-scroll scrollbar-none max-sm:h-[16rem] sm:max-md:h-[21.5rem] md:max-xl:h-[17rem] xl:h-[25rem] xl:max-2xl:w-[40rem] 2xl:w-[45rem]">
        <table className=" w-full border-2 border-z-blue-100  text-center text-black text-gray-500 max-sm:text-[0.65rem] sm:text-[0.7rem] lg:max-xl:text-[0.85rem] xl:text-sm">
          <AddSymbolTable
            displaySymb={displaySymb}
            selectedExchange={selectedExchange}
            symbols={symbols}
            handleImageClickEvent={handleImageClickEvent}
          />
        </table>
      </div>
    </div>
  );
};

export default React.memo(Addsymbol);
