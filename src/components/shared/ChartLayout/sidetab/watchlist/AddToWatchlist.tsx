import { UserWatchlistRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { addSymbol, setShouldRefresh } from "@/lib/redux/slices/StrategySlice";
import { RootState } from "@/lib/redux/Store";
import { useState, useEffect, SetStateAction, Dispatch } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface AddToWatchlistProps {
  setAddToWatchlist: Dispatch<SetStateAction<boolean>>;
  symbol: any; // Adjust type if you have a defined symbol type
}

const AddToWatchlist: React.FC<AddToWatchlistProps> = ({
  setAddToWatchlist,
  symbol,
}) => {
  const [watchlists, setWatchlists] = useState<any>([]);
  const [selectedWatchlist, setSelectedWatchlist] = useState<any>(null);
  const limitSetAddSymbol = useSelector(
    (state: RootState) => state.strategy.limitAddSymbol
  );
  const dispatch = useDispatch();
  const shouldRefreshRedux = useSelector(
    (state: RootState) => state.strategy.shouldRefresh
  );

  useEffect(() => {
    const fetchWatchlists = async () => {
      try {
        const CreatewatchlistApi = new UserWatchlistRouterApi(baseConfig());
        const response =
          await CreatewatchlistApi.fetchWatchlistsBaseV1UsersMeWatchlistsBaseGet();
        setWatchlists(response.data);
      } catch (error) {
        console.error("Error fetching watchlists:", error);
      }
    };

    fetchWatchlists();
  }, []);

  const addWatchList = async (symbol: any) => {
    try {
      if (limitSetAddSymbol === true) {
        toast("You can add up to 50 stocks!");
        return;
      }

      const addwatchlistApi = new UserWatchlistRouterApi(baseConfig());
      const res =
        await addwatchlistApi.addSymbolsInWatchlistsV1UsersMeWatchlistsWatchlistIdAddSymbolsPost(
          selectedWatchlist?.id,
          [symbol]
        );
      toast(`Added symbol to the ${selectedWatchlist?.name} watchlist.`);
      dispatch(setShouldRefresh(!shouldRefreshRedux));
      dispatch(
        addSymbol({
          symbol: symbol?.identifier,
          // token: symbol.token
        })
      ); // Store the symbols and token in redux
    } catch (error) {
      toast("Invalid input!");
      console.error("Error adding to watchlist:", error);
    }
  };

  const handleCheckboxChange = async (watchlistId: any) => {
    setSelectedWatchlist(watchlistId);

    setTimeout(() => {
      setAddToWatchlist(false);
    }, 2000);
  };
  useEffect(() => {
    if (selectedWatchlist != null) {
      addWatchList(symbol.identifier);
    }
  }, [selectedWatchlist]);

  return (
    <div className="shadow-t-3xl z-[1000] flex h-[9rem] w-[10rem] flex-col items-start justify-start overflow-y-auto rounded-lg bg-white shadow-2xl scrollbar-none">
      {watchlists.map((watchlist: any) => (
        <div
          key={watchlist.id}
          className="flex w-full cursor-pointer flex-row items-center gap-2 border-b border-z-gray-100 px-5 py-2 text-[0.75rem] text-black hover:bg-gray-100"
          onClick={() => handleCheckboxChange(watchlist)}
        >
          <div>{watchlist.name}</div>
        </div>
      ))}
    </div>
  );
};

export default AddToWatchlist;
