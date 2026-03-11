import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect } from "react";

interface SwitchWatchListProps {
  activePositionFilter: string | null;
  name: string;
  selectedGroup: string;
  watchlistRef: any;
  setShowList: Dispatch<SetStateAction<boolean>>;
  showList: boolean;
  setActivePositionFilter: Dispatch<SetStateAction<any>>;
}

const SwitchWatchList: React.FC<SwitchWatchListProps> = ({
  activePositionFilter,
  name,
  selectedGroup,
  watchlistRef,
  setShowList,
  showList,
  setActivePositionFilter,
}) => {
  const showWatchlist = (e: any) => {
    e.stopPropagation();
    setShowList(!showList);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        watchlistRef.current &&
        !watchlistRef.current.contains(event.target)
      ) {
        setShowList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex  flex-row items-center justify-between gap-[0.1rem] max-sm:pl-2 xl:pl-2">
      <div className="group relative max-w-[90%] ">
        <h1 className="   flex  w-full flex-row gap-2  font-table max-md:text-[0.8rem] md:max-lg:text-[0.85rem] lg:text-[0.92rem]">
          {activePositionFilter !== null && (
            <Image
              src="/svg/ArrowRightBlack.svg"
              height="15"
              width="15"
              alt=""
              className={`rotate-180 cursor-pointer hover:rounded-lg hover:bg-gray-100 `}
              onClick={() => setActivePositionFilter(null)}
            />
          )}
          {activePositionFilter != null
            ? activePositionFilter === "holdings"
              ? "Holdings"
              : "Positions"
            : selectedGroup
              ? selectedGroup?.length > 15
                ? `${selectedGroup?.slice(0, 12)}...`
                : selectedGroup
              : name}
        </h1>

        {selectedGroup && selectedGroup?.length > 15 && (
          <span className="absolute left-0 top-6 z-[100] w-[9rem] rounded bg-gray-700 bg-gray-800 px-2  text-center text-[0.65rem] text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 md:max-lg:text-[0.85rem] lg:max-xl:text-[0.92rem]">
            {selectedGroup}
          </span>
        )}
      </div>
      {activePositionFilter === null && (
        <div className="group relative inline-block  ">
          <Image
            src="/svg/arrowFall.svg"
            width="25"
            height="25"
            alt="plus"
            onClick={showWatchlist}
            onDoubleClick={(event: any) => {
              event.stopPropagation();
            }}
            className="h-[1.35rem] w-[1.3rem] p-0"
          />
          <span className="pointer-events-none absolute left-32 top-8 z-[9999] ml-1 w-[9rem] -translate-x-full  -translate-y-1/2 transform rounded bg-gray-800   px-1 text-[0.65rem] capitalize text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden">
            show watchlists & Groups
          </span>
        </div>
      )}
    </div>
  );
};

export default SwitchWatchList;
