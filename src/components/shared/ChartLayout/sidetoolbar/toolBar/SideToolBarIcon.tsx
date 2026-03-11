import config from "@/lib/config";
import {
  setCurrentSection,
  setScreenerOpen,
  setStockInfoOpen,
} from "@/lib/redux/slices/CommonSlice";
import { setScreenerQuery } from "@/lib/redux/slices/screenerSlice";
import { RootState } from "@/lib/redux/Store";
import { IconKey, icons } from "@/lib/util/sideToolBar/RightToolBarIcons";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScreenerButton from "../Screener/SideScreener";

interface SideToolBarIcon {
  brokerCode: number | null;
}

const SideToolBarIcon: React.FC<SideToolBarIcon> = ({ brokerCode }) => {
  const currentSection = useSelector(
    (state: RootState) => state.common.currentSection,
  );
  const iconRef = useRef<HTMLDivElement | null>(null);
  const userEmail = useSelector((state: RootState) => state.common.userInfo);
  const isPrivilegedUser = config.userEmail.includes(userEmail?.email);
  const dispatch = useDispatch();
  const handleClick = (key: any) => {
    dispatch(
      setCurrentSection(
        String(key).trim() === String(currentSection).trim() ? null : key,
      ),
    );
    dispatch(setScreenerOpen(false));
    dispatch(setStockInfoOpen(false));
    dispatch(setScreenerQuery(null));
  };
  const showStrategiesPopup = useSelector(
    (state: RootState) => state.charts.setShowStrategiesPopup,
  );
  useEffect(() => {
    if (showStrategiesPopup === true) {
      handleClick("strategies");
    }
  }, [showStrategiesPopup]);
  return (
    <>
      <div className="flex items-center bg-white max-md:flex-row max-md:justify-between max-sm:px-2 sm:max-md:px-5 md:max-xl:w-[84%] md:max-xl:justify-between md:max-xl:pl-[2.8rem] lg:max-xl:w-[86%] xl:flex-col xl:gap-[1rem]">
        {Object.entries(icons).map(([key, icon]) => {
          const iconKey = key; // TypeScript assertion
          const { clickSrc, src, label, width, height, design } = icon;

          const isHiddenOnMobile =
            iconKey === IconKey.News ||
            iconKey === IconKey.Notes ||
            iconKey === IconKey.Positions ||
            iconKey === IconKey.Holdings
              ? "max-sm:hidden"
              : iconKey === IconKey.Portfolio
                ? "sm:hidden"
                : "";

          return (
            <div
              key={iconKey}
              className={` wrapper group relative inline-block  bg-white ${isHiddenOnMobile}`}
            >
              <div
                className={`wrapper flex items-center justify-center rounded-lg py-1 text-z-green-500 max-md:h-[2.2rem] max-md:w-[2rem] md:h-[2.7rem]  md:w-[2.5rem] xl:flex-col xl:gap-1  `}
                onClick={() => handleClick(iconKey)}
              >
                <img
                  src={currentSection === iconKey ? clickSrc : src}
                  alt={label}
                  width={width}
                  height={height}
                  className={` ${design} wrapper cursor-pointer `}
                />
                <div className="flex items-center justify-center text-center text-[0.55rem] text-gray-700 max-xl:hidden xl:flex">
                  {label}
                </div>
              </div>
            </div>
          );
        })}
        {isPrivilegedUser && (
          <span ref={iconRef} className="">
            <ScreenerButton />
          </span>
        )}
      </div>
    </>
  );
};

export default SideToolBarIcon;
