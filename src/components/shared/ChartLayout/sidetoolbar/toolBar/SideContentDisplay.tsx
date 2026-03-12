import React, { useEffect, useState } from "react";
import Positions from "../positions/positions";
import Holdings from "../holdings/holdings";
import Orders from "../order/orders";
import FundsDetailPage from "../funds/funds";
import AllNote from "../notes/AllNote";
import Settings from "../settings/settings";
import News from "../news/News";
import { IconKey } from "@/lib/util/sideToolBar/RightToolBarIcons";
import StrategiesAnalyzer from "../Strategies Analyzer/strategiesAnalyzer";
import { usePathname } from "next/navigation";

import UserProfile from "../userProfile/UserProfile";
import FiiDiiData from "../../oiComponent/FiiDiiData/FiiDiiData";
import FiiDiiAnalysis from "../../oiComponent/FiiDiiData/FiiDiiAnalysis";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import Portfolio from "../portfolio/Portfolio";

interface SideContentDisplayProps {
  brokerCode: number | null;
  apiKey: string | null;
  fnoIdentifiers: string;

  handleInstallClick: (() => void) | null;
}

const SideContentDisplay: React.FC<SideContentDisplayProps> = ({
  brokerCode,
  apiKey,
  fnoIdentifiers,

  handleInstallClick,
}) => {
  const [leftWidth, setLeftWidth] = useState(40);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const location = useLocation();
  const pathname = location.pathname;
  const [FiiDiiActiveButton, setFiiDiiActiveButton] = useState("summary");
  const currentSection = useSelector(
    (state: RootState) => state.common.currentSection,
  );
  const handleToggleWidth = () => {
    if (leftWidth === 40) {
      setLeftWidth(80);
      setIsExpanded(true);
    } else {
      setLeftWidth(40);
      setIsExpanded(false);
    }
  };

  const handleMouseDownX = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDragStartX(e.clientX);
  };

  const MIN_WIDTH = 30; // Minimum width percentage
  const MAX_WIDTH = 90; // Maximum width percentage

  const handleMouseMoveX = (e: MouseEvent) => {
    if (dragStartX !== null) {
      const deltaX = e.clientX - dragStartX!;
      const newLeftWidth = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, leftWidth - (deltaX / window.innerWidth) * 100),
      );
      setLeftWidth(newLeftWidth);
      setDragStartX(e.clientX);
    }
  };

  const handleMouseUpX = () => {
    setDragStartX(null);
  };

  // Effect to add/remove event listeners based on dragStartX state
  useEffect(() => {
    if (dragStartX !== null && typeof window !== "undefined") {
      window.addEventListener("mousemove", handleMouseMoveX);
      window.addEventListener("mouseup", handleMouseUpX);
    } else {
      window.removeEventListener("mousemove", handleMouseMoveX);
      window.removeEventListener("mouseup", handleMouseUpX);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMoveX);
      window.removeEventListener("mouseup", handleMouseUpX);
    };
  }, [dragStartX]);

  const renderContent = () => {
    switch (currentSection) {
      case IconKey.Positions:
        return (
          <Positions
            brokerCode={brokerCode}
            apiKey={apiKey}
            leftWidth={leftWidth}
            setLeftWidth={setLeftWidth}
          />
        );
      case IconKey.Holdings:
        return (
          <Holdings
            brokerCode={brokerCode}
            leftWidth={leftWidth}
            setLeftWidth={setLeftWidth}
          />
        );
      case IconKey.Orders:
        return (
          <Orders
            brokerCode={brokerCode}
            leftWidth={leftWidth}
            setLeftWidth={setLeftWidth}
          />
        );
      case IconKey.Funds:
        return (
          <FundsDetailPage
            brokerCode={brokerCode}
            leftWidth={leftWidth}
            setLeftWidth={setLeftWidth}
          />
        );
      case IconKey.Strategies:
        return (
          <StrategiesAnalyzer
            brokerCode={brokerCode}
            fnoIdentifiers={fnoIdentifiers}
            apiKey={apiKey}
            leftWidth={leftWidth}
            setLeftWidth={setLeftWidth}
          />
        );
      case IconKey.News:
        return (
          <News
            brokerCode={brokerCode}
            leftWidth={leftWidth}
            setLeftWidth={setLeftWidth}
          />
        );
      case IconKey.Notes:
        return (
          <AllNote
            brokerCode={brokerCode}
            leftWidth={leftWidth}
            setLeftWidth={setLeftWidth}
          />
        );
      case IconKey.Settings:
        return (
          <Settings
            brokerCode={brokerCode}
            leftWidth={leftWidth}
            setLeftWidth={setLeftWidth}
            handleInstallClick={handleInstallClick}
          />
        );
      case "Profile":
        return (
          <UserProfile leftWidth={leftWidth} setLeftWidth={setLeftWidth} />
        );
      case IconKey.FiiDii:
        return (
          <FiiDiiAnalysis leftWidth={leftWidth} setLeftWidth={setLeftWidth} />
        );
      case IconKey.Portfolio:
        return (
          <Portfolio
            brokerCode={brokerCode}
            leftWidth={leftWidth}
            setLeftWidth={setLeftWidth}
            apiKey={apiKey}
          />
        );
      case null:
        // resetState();
        return null;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && currentSection != null) {
      const slideWidth: any = document.getElementById("slide-Width");
      // Define the media queries for different screen sizes
      const smToLg = window.matchMedia(
        "(min-width: 300px) and (max-width: 1199px)",
      );
      const xlTo2xl = window.matchMedia(
        "(min-width: 1200px) and (max-width: 1536px)",
      );
      // Function to remove all inline styles
      const removeAllInlineStyles = () => {
        if (typeof window !== "undefined") {
          slideWidth?.removeAttribute("style");
        }
      };
      // Function to apply specific styles
      const applySpecificStyles = () => {
        if (typeof window !== "undefined") {
          slideWidth.style.width = `${leftWidth}%`;
        }
      };
      // Function to handle screen size changes
      const handleScreenChange = () => {
        if (smToLg.matches) {
          // If the screen size is between 640px and 1024px, remove inline styles
          removeAllInlineStyles();
          // console.log("Removed all inline styles for sm to lg range.");
        } else if (xlTo2xl.matches) {
          // If the screen size is between 1024px and 1536px, apply specific styles
          applySpecificStyles();
          // console.log("Applied specific styles for xl to 2xl range.");
        }
      };
      // Add listeners for media query changes
      smToLg.addEventListener("change", handleScreenChange);
      xlTo2xl.addEventListener("change", handleScreenChange);
      // Initial check
      handleScreenChange();
      // Cleanup function to remove the event listeners
      return () => {
        smToLg.removeEventListener("change", handleScreenChange);
        xlTo2xl.removeEventListener("change", handleScreenChange);
      };
    }
  }, []);

  const SetPositionWithRoute = () => {
    if (/^\/live\/\d+\/psv$/.test(pathName)) {
      return "max-sm:bottom-[10.5%] sm:max-md:bottom-[11.5%] md:max-lg:bottom-[12.5%] lg:max-xl:bottom-[12%]";
    }
    if (/^\/live\/\d+\/psb$/.test(pathName)) {
      return "max-sm:bottom-[5.2%] sm:max-lg:bottom-[6.3%] lg:max-xl:bottom-[6%]";
    }
    if (/^\/live\/\d+\/oi$/.test(pathName)) {
      return "max-sm:bottom-[5.2%] sm:max-lg:bottom-[6.3%] lg:max-xl:bottom-[6%]";
    }
  };

  return (
    <div
      id="slide-Width"
      className={`fixed z-50 m-0 select-none bg-white shadow-lg max-xl:border-t-[0.25rem] max-xl:border-gray-200 max-xl:shadow-strong-card xl:bottom-0 xl:top-[3.5rem] ${SetPositionWithRoute()} max-xl:left-0 max-xl:h-[65%] max-xl:w-full xl:right-[3.4rem] xl:top-16 xl:h-full`}
      style={{ width: `${leftWidth}%` }}
    >
      <div
        onMouseDown={handleMouseDownX}
        className="absolute left-0  top-0 h-full w-1 cursor-col-resize bg-z-br-gray text-black max-xl:hidden"
      ></div>
      <div
        className=" absolute left-0 top-1/2 z-[9999] h-10 w-6 -translate-y-1/2 cursor-pointer max-xl:hidden"
        onClick={handleToggleWidth}
      >
        <button className=" transform  rounded-full bg-gray-100 p-2 text-black max-xl:hidden">
          {isExpanded ? <>&#10095;</> : <> &#10094;</>}
        </button>
      </div>
      <div className="h-full w-full max-xl:overflow-hidden 2xl:overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default SideContentDisplay;
