import {
  setCurrentSection,
  setScreenerOpen,
  setToggleChart,
} from "@/lib/redux/slices/CommonSlice";
import { RootState } from "@/lib/redux/Store";
import { ViewType } from "@/lib/util/toggleButtonName/toggleButtonNames";

import React from "react";
import { useDispatch, useSelector } from "react-redux";

const ScreenerButton = () => {
  const screenerOpen: any = useSelector(
    (state: RootState) => state.common.ScreenerOpen,
  );
  const dispatch = useDispatch();
  const handleScreenerInfo = () => {
    // dispatch(setToggleChart(ViewType.SCREENER));
    dispatch(setCurrentSection(null));
    dispatch(setScreenerOpen(true));
  };
  return (
    <div
      className={`wrapper relative flex h-[3.5rem] w-[2.5rem] items-center justify-center rounded-lg py-2 max-xl:h-[3rem]  max-sm:h-[2rem] md:max-xl:mr-[2.5rem]`}
    >
      <span className="group flex h-full w-full flex-col items-center justify-center gap-1">
        <img
          src={screenerOpen ? "/svg/greenScreener.svg" : "/svg/screener.svg"}
          alt=""
          width="100"
          height="100"
          className={` wrapper group relative w-[2rem] cursor-pointer`}
          onClick={handleScreenerInfo}
        />
        <div className="flex items-center justify-center text-center text-[0.55rem] text-gray-700 max-xl:hidden xl:flex">
          NIMA AI
        </div>
      </span>
    </div>
  );
};

export default ScreenerButton;
