import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import StocksTable from "./watchlist/StocksTable";
import SideTabInfo from "./sideTabInfo/SideTabInfo";
import { sideTabButtonName } from "@/lib/util/toggleButtonName/toggleButtonNames";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import HeatMap from "./watchlist/HeatMap/Heatmap";

interface SidetabProps {
  setParentVisible: Dispatch<SetStateAction<boolean>>;
  setShow: Dispatch<SetStateAction<boolean>>;
  setShowCreateWatchlist: Dispatch<SetStateAction<boolean>>;
  selectedWatchlistId: number | null;
  setSelectedWatchlistId: Dispatch<SetStateAction<number | null>>;
  symbols: any;
  setSymbols: Dispatch<SetStateAction<any>>;
  clickedSymbolData: any;
  apiKey: string;
  brokerCode: number | null;
  fnoIdentifiers: any;
  setFnoIdentifiers: Dispatch<SetStateAction<any[]>>;
  setClickedSymbolData: Dispatch<SetStateAction<any>>;
  clickTvChart: boolean;
  setClickTvChart: Dispatch<SetStateAction<boolean>>;
  setShowTechnicals: Dispatch<SetStateAction<boolean>>;
  setShowNewsPivots: Dispatch<SetStateAction<boolean>>;
}
const Sidetab: React.FC<SidetabProps> = ({
  setParentVisible,
  brokerCode,
  symbols,
  setSymbols,
  selectedWatchlistId,
  setSelectedWatchlistId,
  setShow,
  setShowCreateWatchlist,
  apiKey,
  setFnoIdentifiers,
  fnoIdentifiers,
  clickedSymbolData,
  setClickedSymbolData,
  clickTvChart,
  setClickTvChart,
  setShowNewsPivots,
  setShowTechnicals,
}) => {
  const [topHeight, setTopHeight] = useState(45); // Initial percentage height of the top component
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [leftWidth, setLeftWidth] = useState(45); // Initial percentage width of the left component
  const [dragStartX, setDragStartX] = useState<number | null>(null);
  const [isHidden, setIsHidden] = useState(false);
  const [dispsymbolname, setDispSymbolname] = useState<any>("");
  const [aeroToggle, setAeroToggle] = useState(false);
  const AeroToggleRef = useRef<any>(null);
  const [toggleState, setToggleState] = useState(sideTabButtonName?.NEWS);
  const isSidetabCollapsed: any = useSelector(
    (state: RootState) => state.common.isSidetabCollapsed
  );
  const [HeatMapData, setHeatMapData] = useState<any>({});
  const [displayedName, setDisplayedName] = useState("");
  const showHeatMap = useSelector(
    (state: RootState) => state.charts.setShowHeatmap
  );
  const memoizedHeatMapData = useMemo(() => HeatMapData, [HeatMapData]);
  const memoizedDisplayedName = useMemo(() => displayedName, [displayedName]);
  // Y-axis dragging handlers
  const handleMouseDownY = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragStartY(e.clientY);
  };
  const handleMouseMoveY = (e: MouseEvent) => {
    if (dragStartY !== null) {
      const deltaY = e.clientY - dragStartY;
      const newTopHeight = Math.min(
        95,
        Math.max(4.5, topHeight + (deltaY / window.innerHeight) * 100)
      );
      if (newTopHeight < topHeight && !isHidden) {
        setIsHidden(true); // Set the state to hide the component
      } else if (newTopHeight > topHeight && isHidden) {
        setIsHidden(false); // Set the state to show the component
      }
      setTopHeight(newTopHeight)
      setDragStartY(e.clientY);
    }
  };
  const handleMouseUpY = () => {
    setDragStartY(null);
  };
  React.useEffect(() => {
    if (dragStartY !== null) {
      window.addEventListener("mousemove", handleMouseMoveY);
      window.addEventListener("mouseup", handleMouseUpY);
    } else {
      window.removeEventListener("mousemove", handleMouseMoveY);
      window.removeEventListener("mouseup", handleMouseUpY);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMoveY);
      window.removeEventListener("mouseup", handleMouseUpY);
    };
  }, [dragStartY]);

  // X-axis dragging handlers
  const handleMouseDownX = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDragStartX(e.clientX);
  };
  const MIN_WIDTH = 30; // Minimum width percentage
  const MAX_WIDTH = 70; // Maximum width percentage
  const handleMouseMoveX = (e: MouseEvent) => {
    if (dragStartX !== null) {
      const deltaX = e.clientX - dragStartX!;
      const newLeftWidth = Math.min(
        MAX_WIDTH,
        Math.max(MIN_WIDTH, leftWidth - (deltaX / window.innerWidth) * 100)
      );
      setLeftWidth(newLeftWidth);
      setDragStartX(e.clientX);
    }
  };
  const handleMouseUpX = () => {
    setDragStartX(null);
  };
  React.useEffect(() => {
    if (dragStartX !== null) {
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

  // symbol name
  useEffect(() => {
    setDispSymbolname(
      clickedSymbolData?.display_symbol_name
        ? clickedSymbolData?.display_symbol_name
        : clickedSymbolData?.symbol
    );
  }, [clickedSymbolData]);

  //remove dragger
  useEffect(() => {
    // Ensure the code runs only in the browser
    if (typeof window !== "undefined") {
      const left_width: any = document.getElementById("left-width");
      const top_height1: any = document.getElementById("top-height1");
      const top_height2: any = document.getElementById("top-height2");

      const tv = document.getElementById("tvChart");
      // Define the media queries for different screen sizes
      const smToLg = window.matchMedia(
        "(min-width: 300px) and (max-width: 1199px)"
      );
      const xlTo2xl = window.matchMedia(
        "(min-width: 1200px) and (max-width: 1536px)"
      );
      // Function to remove all inline styles
      const removeAllInlineStyles = () => {
        left_width?.removeAttribute("style");
        top_height1?.removeAttribute("style");
        top_height2?.removeAttribute("style");
      };
      // Function to apply specific styles
      const applySpecificStyles = () => {
        left_width.style.width = `${leftWidth}%`;
        top_height1.style.height = `${topHeight}%`;
        top_height2.style.height = `${90 - topHeight}%`;
      };
      // Function to handle screen size changes
      const handleScreenChange = () => {
        if (smToLg.matches) {
          // If the screen size is between 640px and 1024px, remove inline styles
          removeAllInlineStyles();
        } else if (xlTo2xl.matches) {
          // If the screen size is between 1024px and 1536px, apply specific styles
          applySpecificStyles();
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

  // Function to close the popup if clicked outside
  const handleClickOutside = (event: any) => {
    if (
      AeroToggleRef.current &&
      !AeroToggleRef.current.contains(event.target)
    ) {
      setAeroToggle(false);
    }
  };
  useEffect(() => {
    if (aeroToggle) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [aeroToggle]);

  useEffect(() => {
    if (isSidetabCollapsed == true) {
      setLeftWidth(0);
    } else {
      setLeftWidth(45);
    }
  }, [isSidetabCollapsed]);

  return (
    <div
      id="left-width"
      className={`border-z-bg-gray relative flex select-none flex-col overflow-hidden bg-white shadow-xl max-xl:w-[100%] max-xl:flex-col-reverse xl:h-full xl:border-l-4 ${
        clickTvChart
          ? "max-xl:h-full"
          : aeroToggle
            ? "max-xl:h-[70%] "
            : aeroToggle == false
              ? "max-xl:h-[1%] max-xl:shadow-strong-card "
              : ""
      } `}
      style={{ width: `${leftWidth}%` }}
    >
      <div
        ref={AeroToggleRef}
        id="top-height1"
        className={`border-t-[0.25rem] border-gray-200 max-xl:fixed max-xl:w-full max-md:z-[1] max-sm:bottom-[2rem] sm:max-lg:bottom-[6.5%] md:max-xl:z-[40] lg:max-xl:bottom-[6%] ${
          clickTvChart && aeroToggle
            ? "max-xl:h-[70%] max-xl:shadow-strong-card"
            : aeroToggle
              ? "max-xl:h-[70%] max-xl:shadow-strong-card"
              : "max-sm:h-[6.35%] sm:max-md:h-[5.5%] md:max-xl:h-[3rem]"
        }`}
        style={{ height: `${topHeight}%` }}
      >
        <StocksTable
          clickTvChart={clickTvChart}
          setClickTvChart={setClickTvChart}
          aeroToggle={aeroToggle}
          setAeroToggle={setAeroToggle}
          apikey={apiKey}
          symbols={symbols}
          setSymbols={setSymbols}
          brokerCode={brokerCode}
          selectedWatchlistId={selectedWatchlistId}
          setSelectedWatchlistId={setSelectedWatchlistId}
          setShow={setShow}
          setShowCreateWatchlist={setShowCreateWatchlist}
          setParentVisible={setParentVisible}
          setClickedSymbolData={setClickedSymbolData}
          fnoIdentifiers={fnoIdentifiers}
          setFnoIdentifiers={setFnoIdentifiers}
          setTopHeight={setTopHeight}
          topHeight={topHeight}
          toggleState={toggleState}
          setShowTechnicals={setShowTechnicals}
          setShowNewsPivots={setShowNewsPivots}
          setHeatMapData={setHeatMapData}
          setDisplayedName={setDisplayedName}
          leftWidth={leftWidth}
        />
      </div>
      <div
        onMouseDown={handleMouseDownY}
        className="cursor-row-resize bg-z-gray-200 text-black max-xl:hidden xl:h-1 "
        style={{
          position: "absolute", // Ensure absolute positioning
          top: `${topHeight}%`, // Position it based on topHeight
          left: 0,
          width: "100%",
          zIndex: 10, // Keep it above SideTabInfo
        }}
      ></div>
      <SideTabInfo
        dispsymbolname={dispsymbolname}
        brokerCode={brokerCode}
        clickedSymbolData={clickedSymbolData}
        clickTvChart={clickTvChart}
        topHeight={topHeight}
        setTopHeight={setTopHeight}
        toggleState={toggleState}
        setToggleState={setToggleState}
      />
      <div
        onMouseDown={handleMouseDownX}
        className="absolute left-0 top-0 w-1 cursor-col-resize bg-z-gray-200 text-black max-xl:hidden xl:h-full"
      ></div>
      {showHeatMap && memoizedHeatMapData && memoizedHeatMapData.length > 0 && (
        <HeatMap
          HeatMapData={memoizedHeatMapData}
          displayedName={memoizedDisplayedName}
        />
      )}
    </div>
  );
};
export default Sidetab;
