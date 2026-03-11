import { RootState } from "@/lib/redux/Store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { handleToggle } from "../tradingView/CustomCheckBoxButton";
import { setIsSidetabCollapsed } from "@/lib/redux/slices/CommonSlice";
import { ViewType } from "@/lib/util/toggleButtonName/toggleButtonNames";
import Image from "next/image";

const TabNavigation: React.FC = () => {
  const toggleState: any = useSelector(
    (state: RootState) => state.common.CandleAreaToggle,
  );
  const isSidetabCollapsed: any = useSelector(
    (state: RootState) => state.common.isSidetabCollapsed,
  );
  const [check, setChecked] = useState(false);
  const dispatch = useDispatch();
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(!check);
    dispatch(setIsSidetabCollapsed(!check));
  };
  useEffect(() => {
    setChecked(isSidetabCollapsed);
  }, [isSidetabCollapsed]);

  return (
    <div
      className={`flex items-center justify-between bg-white p-1 px-4 ${toggleState == "stockInfo" ? "max-lg:absolute max-sm:left-0.5 max-sm:top-1.5 max-sm:w-[1.5rem] max-sm:px-1 sm:max-lg:left-[1rem] sm:max-lg:px-0 sm:max-md:top-[0.2rem] md:max-lg:top-[0.4rem] xl:max-2xl:absolute xl:max-2xl:right-[1rem] xl:max-2xl:top-1.5 " : "h-[3.5rem] "}`}
    >
      <h2 className="px-1 text-lg font-semibold capitalize max-md:text-sm">
        {toggleState == "stockInfo" ? " " : toggleState}
      </h2>
      <div
        className={`flex items-center gap-2 xl:flex-row 2xl:flex-col ${toggleState == "stockInfo" ? "max-lg:hidden" : ""}`}
      >
        <div className="flex flex-row items-center gap-2 text-[0.85rem] max-xl:hidden">
          <input
            type="checkbox"
            checked={!check}
            onChange={handleCheckboxChange}
            className="max-md:h-4 max-md:w-4"
          />
          Watchlists
        </div>
      </div>
      {/* Only used within max-lg */}
      <img
        src="/svg/ArrowRightBlack.svg"
        height="15"
        width="15"
        alt=""
        className={`rotate-180 lg:hidden ${toggleState == "stockInfo" ? "rounded-full hover:bg-gray-200 max-sm:w-[1.5rem] sm:max-lg:h-[1.5rem] sm:max-lg:w-[1.5rem]" : "hidden"} `}
        onClick={() => handleToggle(ViewType.CANDLESTICK, dispatch)}
      />
      {/* Only used within max-lg */}
    </div>
  );
};

export default TabNavigation;
