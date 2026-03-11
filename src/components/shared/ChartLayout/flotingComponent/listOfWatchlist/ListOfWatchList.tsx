import { UserWatchlistRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { RootState } from "@/lib/redux/Store";

import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ListOfGroups from "../groups/listOfGroups";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
interface ListOfWatchListProps {
  setShowCreateWatchlist: Dispatch<SetStateAction<boolean>>;
  setSelectedWatchlistId: Dispatch<SetStateAction<number | null>>;
  onSelectWatchlist: (watchlistId: number) => void;
  setShowList: Dispatch<SetStateAction<boolean>>;
  setSelectedGroup: Dispatch<SetStateAction<any>>;
  setSelectedGroupData: Dispatch<SetStateAction<any>>;
  aeroToggle: boolean;
}

const ListOfWatchList: React.FC<ListOfWatchListProps> = ({
  setShowCreateWatchlist,
  setSelectedWatchlistId,
  setShowList,
  onSelectWatchlist,
  setSelectedGroup,
  setSelectedGroupData,
  aeroToggle,
}) => {
  const [list, setList] = useState([]);
  const [activeWatchlistId, setActiveWatchlistId] = useState<number | null>(
    null,
  );
  const [starredWatchlistId, setStarredWatchlistId] = useState<number | null>(
    null,
  );
  const getPrimaryRefreshData = useSelector(
    (state: RootState) => state.strategy.primaryRefresh,
  );
  const [GroupsOpen, setGroupsOpen] = useState<boolean>(false);
  const router = useRouter();
  const createWatchlist = () => {
    if (list.length < 5) {
      setShowCreateWatchlist(true);
      setShowList(false);
    } else {
      toast("You can create a maximum of 5 watchlists");
    }
  };

  useEffect(() => {
    const fetchWatchlists = async () => {
      try {
        const CreatewatchlistApi = new UserWatchlistRouterApi(baseConfig());
        const res =
          await CreatewatchlistApi.fetchWatchlistsBaseV1UsersMeWatchlistsBaseGet();

        setList(res.data);

        const primaryWatchlist = res.data
          .map((watchlist: any) => watchlist)
          .filter((watchlist: any) => watchlist.primary === true);

        // Get the ID of the primary watchlist
        if (primaryWatchlist.length > 0) {
          const primaryWatchlistId = primaryWatchlist[0].id;
          setStarredWatchlistId(primaryWatchlistId);
        }
      } catch (error: any) {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      }
    };

    fetchWatchlists();
  }, []);

  const handleWatchlistClick = (watchlistId: number) => {
    onSelectWatchlist(watchlistId); // Pass selected watchlist ID to parent
    setSelectedGroup(null);
    setShowList(false);
  };

  // make primary watchlist
  const handleStarClick = (watchlistId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the watchlist click

    setActiveWatchlistId(watchlistId);
    setStarredWatchlistId((prev) =>
      prev === watchlistId ? null : watchlistId,
    );

    const primaryApi = new UserWatchlistRouterApi(baseConfig());
    primaryApi
      .makePrimaryWatchlistV1UsersMeWatchlistsIdMakePrimaryPost(watchlistId)
      .then((res) => {
        setSelectedWatchlistId(null);

        setShowList(false);
      })
      .catch((error: any) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  };

  return (
    <div
      className={`shadow-t-3xl absolute left-[1rem] z-[10000] flex flex-col items-start justify-start overflow-y-auto rounded-lg bg-white shadow-2xl max-xl:scrollbar-none max-sm:top-[2.5rem] max-sm:w-[8rem] sm:max-md:top-[3rem] sm:max-md:w-[11rem] md:max-xl:top-[3.5rem] md:max-lg:w-[12rem] lg:max-xl:w-[13rem] xl:top-[3rem] xl:scrollbar-thin xl:scrollbar-track-gray-100 xl:scrollbar-thumb-gray-200 xl:max-2xl:w-[12rem] 2xl:w-[14rem] ${
        aeroToggle ? "" : "max-xl:hidden"
      }`}
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      <span
        className={`selected  flex w-full cursor-pointer flex-row  items-center justify-between gap-[0.5rem] border-b-[0.1rem] border-z-gray-100  px-5 max-sm:py-1 md:max-xl:py-3 xl:py-2 ${
          !GroupsOpen
            ? "bg-z-green-500 text-white "
            : "bg-white font-semibold text-z-green-500"
        }`}
      >
        <div className="flex flex-row items-center gap-2">
          <h1 className="max-sm:text-[0.75rem] sm:max-md:py-[0.3rem] sm:max-md:text-[0.8rem] md:text-[0.75rem]">
            Watchlist
          </h1>
          <img
            src="/svg/arrowFall.svg"
            className="max-sm:h-[0.8rem] max-sm:w-[0.8rem] md:h-[1.2rem] md:w-[1.2rem] "
            width="20"
            height="20"
            alt="plus"
            onClick={() => setGroupsOpen(false)}
            onDoubleClick={(event: any) => {
              event.stopPropagation();
            }}
          />
        </div>
        {!GroupsOpen && (
          <span
            className="group relative inline-block"
            onClick={createWatchlist}
          >
            <img
              src="/svg/whiteAdd.svg"
              className="mt-[rem] h-[1rem] w-[1rem]"
              width="20"
              height="20"
              alt="plus"
            />
            <span className="pointer-events-none absolute top-6 z-[100] ml-1 w-[8rem] -translate-x-full -translate-y-1/2 transform rounded bg-gray-800 px-1  text-xs  font-light   text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden xl:max-2xl:left-[2rem] xl:max-2xl:w-[6.5rem]">
              Create Watchlist
            </span>
          </span>
        )}
      </span>
      {!GroupsOpen && (
        <>
          {list &&
            list.map((item: any) => (
              <div
                key={item.id}
                className="flex w-full cursor-pointer flex-row  items-center justify-between border-b-[0.1rem] border-z-gray-100 px-5 hover:bg-z-gray-100 max-sm:gap-[0.1rem] max-sm:py-[0.1rem] max-sm:text-[0.75rem] sm:max-md:py-[0.3rem] sm:max-md:text-[0.8rem] md:text-[0.85rem] md:max-xl:py-[0.45rem] xl:gap-[0.5rem] xl:py-2"
                onClick={() => handleWatchlistClick(item.id)}
                onMouseEnter={() => setActiveWatchlistId(item.id)}
                onMouseLeave={() => setActiveWatchlistId(null)}
              >
                <span>{item.name}</span>
                <div>
                  {(activeWatchlistId === item.id ||
                    starredWatchlistId === item.id) && (
                    <img
                      src={
                        starredWatchlistId === item.id
                          ? "/svg/starfill.svg"
                          : "/svg/star.svg"
                      }
                      className="max-xl:hidden xl:h-[1rem] xl:w-[1rem]"
                      width="20"
                      height="20"
                      alt="star"
                      onClick={(e) => handleStarClick(item.id, e)}
                    />
                  )}
                </div>
              </div>
            ))}
        </>
      )}
      <ListOfGroups
        GroupsOpen={GroupsOpen}
        setGroupsOpen={setGroupsOpen}
        setShowList={setShowList}
        onSelectWatchlist={onSelectWatchlist}
        setSelectedGroup={setSelectedGroup}
        setSelectedGroupData={setSelectedGroupData}
      />
    </div>
  );
};

export default ListOfWatchList;
