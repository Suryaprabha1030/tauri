import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import SideToolBarIcon from "./SideToolBarIcon";
import SideContentDisplay from "./SideContentDisplay";
import UserIconButton from "./UserIconButton";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentSection } from "@/lib/redux/slices/CommonSlice";
import { RootState } from "@/lib/redux/Store";
import ScreenerButton from "../Screener/SideScreener";
import config from "@/lib/config";

interface RightToolBarProps {
  brokerCode: number | null;
  apiKey: string | null;
  fnoIdentifiers: any;

  handleInstallClick: (() => void) | null;
}

const RightToolBar: React.FC<RightToolBarProps> = ({
  brokerCode,
  apiKey,
  fnoIdentifiers,

  handleInstallClick,
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const currentSection = useSelector(
    (state: RootState) => state.common.currentSection
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !document.querySelector(".wrapper")?.contains(target) &&
        !contentRef.current?.contains(target) &&
        !iconRef.current?.contains(target)
      ) {
        // dispatch(setCurrentSection(null));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="content-container flex flex-col gap-[1rem] bg-white  shadow-xl max-xl:fixed max-xl:z-50 max-xl:w-full max-xl:border-t-[0.05rem] max-xl:border-solid max-xl:border-gray-200 max-sm:bottom-0 max-sm:min-h-[5%] sm:max-lg:h-[6.5%] md:max-xl:bottom-0 xl:h-full xl:w-[3.5rem] xl:items-center xl:border-l-4 xl:py-3">
      {/* Sidebar for Icons */}
      <span
        ref={contentRef}
        className="flex h-[100%]  flex-col  max-md:justify-center md:items-center md:justify-between md:max-xl:flex-row md:max-lg:gap-[1.5rem] lg:max-xl:gap-[2rem]"
      >
        <SideToolBarIcon brokerCode={brokerCode} />
        {/* for profile icon set bottom */}

        <span ref={iconRef} className="">
          <UserIconButton />
        </span>
      </span>
      {/* Content Display */}
      {currentSection !== null && (
        <span ref={iconRef} className="absolute top-0 w-full xl:top-20">
          <SideContentDisplay
            brokerCode={brokerCode}
            apiKey={apiKey}
            fnoIdentifiers={fnoIdentifiers}
            handleInstallClick={handleInstallClick}
          />
        </span>
      )}
    </div>
  );
};

export default RightToolBar;
