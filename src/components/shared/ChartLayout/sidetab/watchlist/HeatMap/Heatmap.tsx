import React, {
  useEffect,
  useState,
  useRef,
  Dispatch,
  SetStateAction,
  useCallback,
} from "react";
import { useDispatch, useSelector } from "react-redux";

import { showHeatmap } from "@/lib/redux/slices/ChartsSlice";
import HeatMapChart from "./HeatmapChart";
import { formatExpiryDate } from "@/lib/util/DateUtil";
import HeatMapHeader from "./SpotPriceDisplay";
import HeatMapToggle from "./HeatMapToggle";
import { getToggleState } from "@/lib/redux/slices/AnalyzerSlice";
import { usePathname } from "next/navigation";
import { debounce } from "lodash";
import { WidthAdjusterDoubleClick } from "@/lib/util/sideToolBar/sidetoolbarCommon";
import { RootState } from "@/lib/redux/Store";

interface HeatMapProps {
  HeatMapData: [];
  displayedName: string;
  expiryValue?: any;
  setClickedHeatmapData?: Dispatch<SetStateAction<{}>>;
}

const HeatMap: React.FC<HeatMapProps> = React.memo(
  ({ HeatMapData, displayedName, expiryValue, setClickedHeatmapData }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const [leftWidth, setLeftWidth] = useState(40);
    const [dragStartX, setDragStartX] = useState<number | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const dispatch = useDispatch();
    const pathName = usePathname();
    const [NoOiData, setNoOiData] = useState(true);
    const toggleState = useSelector(
      (state: RootState) => state.analyzer.toggleState,
    );
    const [callData, setCallData] = useState<any[]>([]);
    const [putData, setPutData] = useState<any[]>([]);
    // Mouse down event to start dragging
    const handleMouseDownX = (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      setDragStartX(e.clientX);
    };

    // Constants for minimum and maximum width
    const MIN_WIDTH = 20; // Minimum width percentage
    const MAX_WIDTH = 100; // Maximum width percentage

    // Mouse move event to resize the left panel
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

    // Mouse up event to stop dragging
    const handleMouseUpX = () => {
      setDragStartX(null);
    };

    // Effect to add/remove event listeners based on dragStartX state
    useEffect(() => {
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

    const handleClickOutside = useCallback((event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        dispatch(showHeatmap(false));
      }
    }, []);

    // Debounced function inside useEffect
    useEffect(() => {
      const debouncedHandleClickOutside = debounce(handleClickOutside, 300);
      const listener = (event: MouseEvent) => {
        if (
          wrapperRef.current &&
          !wrapperRef.current.contains(event.target as Node)
        ) {
          debouncedHandleClickOutside(event);
        }
      };

      document.addEventListener("mousedown", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        debouncedHandleClickOutside.cancel(); // Cleanup debounce
      };
    }, [handleClickOutside]);

    const handleToggleWidth = () => {
      if (leftWidth === 40) {
        setLeftWidth(80);
        setIsExpanded(true);
      } else {
        setLeftWidth(40);
        setIsExpanded(false);
      }
    };

    const getChangeCounts = (symbols: any[], n: number) => {
      const counts = {
        positive: 0,
        negative: 0,
        zero: 0,
      };

      symbols &&
        symbols?.forEach((symbol) => {
          if (symbol.chgPercent > n) {
            counts.positive++;
          } else if (symbol.chgPercent < -n) {
            counts.negative++;
          } else {
            counts.zero++;
          }
        });

      return counts;
    };
    const changeCounts = getChangeCounts(HeatMapData, 0);
    const changeCountsfortwo = expiryValue
      ? getChangeCounts(HeatMapData, 10)
      : getChangeCounts(HeatMapData, 2);
    const netBreadth = changeCounts.positive - changeCounts.negative;
    const netBreadthfortwo =
      changeCountsfortwo.positive - changeCountsfortwo.negative;

    const [tooltip, setTooltip] = useState({
      visible: false,
      message: "",
      parentId: null,
    });

    const handleMouseEnter = (message: any, parentId: any) => {
      setTooltip({ visible: true, message, parentId });
    };

    const handleMouseLeave = () => {
      setTooltip({ visible: false, message: "", parentId: null });
    };
    useEffect(() => {
      if (!expiryValue || !HeatMapData) return;

      const ceData = [...HeatMapData]
        .filter((item: any) => item.option_type === "CE")
        .sort((a: any, b: any) => b.oiPercent - a.oiPercent);

      const peData = [...HeatMapData]
        .filter((item: any) => item.option_type === "PE")
        .sort((a: any, b: any) => b.oiPercent - a.oiPercent);

      const celtpData = [...HeatMapData]
        .filter((item: any) => item.option_type === "CE")
        .sort((a: any, b: any) => b.chgPercent - a.chgPercent);

      const peltpData = [...HeatMapData]
        .filter((item: any) => item.option_type === "PE")
        .sort((a: any, b: any) => b.chgPercent - a.chgPercent);

      setCallData(toggleState === "OI" ? ceData : celtpData);
      setPutData(toggleState === "OI" ? peData : peltpData);
    }, [expiryValue, HeatMapData, toggleState]);
    // useEffect(() => {
    //   if (toggleState === "OI") {
    //     const hasNullOi = HeatMapData.some((item: any) => item?.oi !== null);
    //     if (!hasNullOi) {
    //       setNoOiData(false);
    //     }
    //   } else {
    //     setNoOiData(true);
    //   }

    // }, [HeatMapData, toggleState]);

    useEffect(() => {
      // Ensure the code runs only in the browser
      if (typeof window !== "undefined") {
        const left_width1: any = document.getElementById("left-width1");
        // Define the media queries for different screen sizes
        const smToLg = window.matchMedia(
          "(min-width: 300px) and (max-width: 1199px)",
        );
        const xlTo2xl = window.matchMedia(
          "(min-width: 1200px) and (max-width: 1536px)",
        );
        // Function to remove all inline styles
        const removeAllInlineStyles = () => {
          left_width1?.removeAttribute("style");
        };
        // Function to apply specific styles
        const applySpecificStyles = () => {
          left_width1.style.width = `${leftWidth}%`;
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
    const SetPositionWithRoute = () => {
      if (/^\/live\/\d+\/psv$/.test(pathName)) {
        return "max-sm:bottom-[10.5%] sm:max-md:bottom-[11.5%] md:max-lg:bottom-[12.5%] lg:max-xl:bottom-[12%]";
      }
      if (/^\/live\/\d+\/psb$/.test(pathName)) {
        return "max-sm:bottom-[5%] sm:max-lg:bottom-[6.3%] lg:max-xl:bottom-[6%]";
      }
      if (/^\/live\/\d+\/oi$/.test(pathName)) {
        return "max-sm:bottom-[5%] sm:max-lg:bottom-[6.3%] lg:max-xl:bottom-[6%]";
      }
    };

    return (
      <div
        id="left-width1"
        ref={wrapperRef}
        className={`fixed z-50 w-full border bg-white shadow-lg max-xl:left-0 max-xl:h-[65%] max-xl:overflow-hidden max-xl:border-t-[0.25rem] max-xl:border-gray-200 max-xl:shadow-strong-card xl:right-14 xl:top-[3.5rem] xl:h-full xl:overflow-y-auto ${SetPositionWithRoute()}`}
        style={{ width: `${leftWidth}%` }}
      >
        <div
          className="flex flex-row justify-between xl:items-center"
          onDoubleClick={() =>
            WidthAdjusterDoubleClick(leftWidth, setLeftWidth)
          }
        >
          <h1 className=" flex py-2 font-bold max-sm:flex-col max-sm:items-start max-sm:justify-between max-sm:pl-2 sm:flex-row sm:max-md:gap-1 sm:max-md:pl-4 md:max-xl:gap-5 md:max-xl:pl-6 xl:items-center xl:gap-2 xl:px-4 xl:max-2xl:flex-col xl:max-2xl:items-start ">
            <span
              className="max-md:text-[1rem] md:text-xl "
              onDoubleClick={(event: any) => {
                event.stopPropagation();
              }}
            >
              Premium Map
            </span>
            <span className="flex flex-row items-center font-semibold text-gray-500 max-md:pl-1.5 max-md:text-[0.75rem] max-sm:gap-2 sm:max-md:ml-2.5 sm:max-md:items-start sm:max-md:gap-4 sm:max-md:py-1.5 md:text-[0.8rem] md:max-xl:gap-6 md:max-xl:pt-1 xl:gap-5">
              <span
                onDoubleClick={(event: any) => {
                  event.stopPropagation();
                }}
              >
                {displayedName}
              </span>
              <span className="max-md:text-[0.7rem]">
                {" "}
                {expiryValue && formatExpiryDate(expiryValue)}
              </span>
              {expiryValue && (
                <span className="">
                  <HeatMapHeader indexName={displayedName} />
                </span>
              )}{" "}
            </span>
          </h1>
          <div
            className="flex w-[7rem] flex-row justify-between max-md:items-start sm:max-xl:mr-[0.8rem] sm:max-md:my-[0.05rem] xl:items-center xl:max-2xl:h-[3.8rem] xl:max-2xl:w-[8rem] xl:max-2xl:items-start "
            onDoubleClick={(event: any) => {
              event.stopPropagation();
            }}
          >
            {expiryValue && <HeatMapToggle toggleState={toggleState} />}
            <button
              className="absolute right-0 p-2 text-xl max-md:top-1 md:top-0"
              onClick={(event: any) => {
                dispatch(showHeatmap(false));
                event.stopPropagation();
              }}
              onDoubleClick={(event: any) => {
                event.stopPropagation();
              }}
            >
              <img
                src="/svg/removeSymbol.svg"
                className="relative h-[1.5rem] w-[1.5rem]"
                width="20"
                height="20"
                alt="plus"
              />
            </button>
          </div>
        </div>

        <div
          onMouseDown={handleMouseDownX}
          className="absolute left-0 top-0 cursor-col-resize bg-z-br-gray text-black max-xl:hidden xl:h-full xl:w-1"
        ></div>
        <button
          onClick={handleToggleWidth}
          className="absolute left-0 top-1/2 -translate-y-1/2 transform rounded-full  bg-gray-100 p-2 text-black max-xl:hidden"
        >
          {isExpanded ? <>&#10095;</> : <> &#10094;</>}
        </button>
        <div className="ml-4 flex w-[96%] flex-col items-center justify-center max-md:h-[83%] max-md:px-8 md:h-[90%] md:max-xl:overflow-y-auto md:max-xl:scrollbar-none xl:px-4 ">
          {HeatMapData && HeatMapData.length > 0 ? (
            <div className={`flex h-full  w-full flex-col md:items-center`}>
              {toggleState == "LTP" && (
                <div
                  className={` flex w-full max-md:pr-4 ${
                    leftWidth <= 40
                      ? "flex-col items-center "
                      : "flex-row items-center justify-evenly  xl:max-2xl:flex-col"
                  }`}
                >
                  <div className="flex flex-row p-1 font-semibold max-md:gap-3 max-md:text-[0.7rem] md:text-[0.75rem] md:max-xl:gap-10 md:max-xl:pt-4 xl:gap-5 ">
                    <div
                      className="relative text-z-green-500"
                      onMouseEnter={() => handleMouseEnter("> 0", "advances")}
                      onMouseLeave={handleMouseLeave}
                    >
                      Advances: {changeCounts.positive}
                      {tooltip.visible && tooltip.parentId === "advances" && (
                        <div className="absolute top-full z-10 w-[2rem] rounded-lg bg-gray-800 p-[0.2rem] text-center text-[0.7rem] text-white shadow-lg max-xl:hidden max-md:text-[0.65rem] xl:max-2xl:text-[0.6rem] ">
                          {tooltip.message}
                        </div>
                      )}
                    </div>
                    <div
                      className="relative text-red-400"
                      onMouseEnter={() => handleMouseEnter("< 0", "declines")}
                      onMouseLeave={handleMouseLeave}
                    >
                      Declines: {changeCounts.negative}
                      {tooltip.visible && tooltip.parentId === "declines" && (
                        <div className="absolute top-full z-10 w-[2rem] rounded-lg bg-gray-800 p-[0.2rem] text-center text-[0.7rem] text-white shadow-lg max-xl:hidden max-md:text-[0.65rem] xl:max-2xl:text-[0.6rem]">
                          {tooltip.message}
                        </div>
                      )}
                    </div>
                    <div
                      className="relative text-gray-500"
                      onMouseEnter={() =>
                        handleMouseEnter(
                          "NetBreadth=Advances-Declines",
                          "netbreadth",
                        )
                      }
                      onMouseLeave={handleMouseLeave}
                    >
                      NetBreadth: {netBreadth}
                      {tooltip.visible && tooltip.parentId === "netbreadth" && (
                        <div className="absolute top-full z-10 w-[10rem] rounded-lg bg-gray-800 p-[0.2rem] text-center text-[0.7rem] text-white shadow-lg max-xl:hidden max-md:text-[0.65rem] xl:max-2xl:text-[0.6rem] ">
                          {tooltip.message}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              {expiryValue ? (
                <div className="flex h-full w-full flex-row items-center justify-center gap-2">
                  {/* {NoOiData ? (
                    <> */}
                  <span className="flex h-full w-1/2 flex-col text-center">
                    <h1 className="text-[0.75rem] font-semibold">Call</h1>
                    {callData && (
                      <HeatMapChart
                        HeatMapData={callData}
                        setClickedHeatmapData={setClickedHeatmapData}
                        xlScreenHeight="xl:max-2xl:h-[86%]"
                        // toggleState={toggleState}
                      />
                    )}
                  </span>
                  <span className="h-full w-1/2 text-center">
                    <h1 className="text-[0.75rem] font-semibold">Put</h1>
                    {putData && (
                      <HeatMapChart
                        HeatMapData={putData}
                        setClickedHeatmapData={setClickedHeatmapData}
                        xlScreenHeight="xl:max-2xl:h-[86%]"
                        // toggleState={toggleState}
                      />
                    )}
                  </span>
                  {/* </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      No Data Available For Premium map
                    </div>
                  )} */}
                </div>
              ) : (
                <>
                  {HeatMapData != null &&
                    HeatMapData.length > 0 &&
                    window != undefined && (
                      <HeatMapChart
                        HeatMapData={HeatMapData}
                        setClickedHeatmapData={setClickedHeatmapData}
                      />
                    )}
                </>
              )}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {" "}
              No Data Available For Premium map
            </div>
          )}
        </div>
      </div>
    );
  },
);
HeatMap.displayName = "HeatMap";
export default HeatMap;
