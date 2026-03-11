import { sideTabButtonName } from "@/lib/util/toggleButtonName/toggleButtonNames";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useState } from "react";

interface SymbolNameSectionProps {
  toggleState: string;
  randomNews: boolean;
  techIndicator: string;
  SAvalue: string;
  dispsymbolname: string;
  TechTableOpen: boolean;
  handleback: any;
  sentimentAnalyze: any;
  setShowCreateNotes: Dispatch<SetStateAction<boolean>>;
  setNoteToEdit: Dispatch<SetStateAction<any>>;
  techValue: string;
  topHeight: any;
  setTopHeight: Dispatch<SetStateAction<any>>;
}

const SymbolNameSection: React.FC<SymbolNameSectionProps> = ({
  toggleState,
  randomNews,
  techIndicator,
  SAvalue,
  dispsymbolname,
  TechTableOpen,
  handleback,
  sentimentAnalyze,
  setShowCreateNotes,
  setNoteToEdit,
  techValue,
  topHeight,
  setTopHeight,
}) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };
  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const tooltipMessage: any =
    randomNews === true && toggleState == sideTabButtonName.NEWS
      ? ""
      : SAvalue != null &&
          isTooltipVisible &&
          SAvalue.length > 0 &&
          toggleState == sideTabButtonName.NEWS
        ? `Sentiment Analysis is ${SAvalue} with value ${
            sentimentAnalyze[SAvalue.toLowerCase()]
          } out of 25 News`
        : toggleState == sideTabButtonName.NEWS &&
            SAvalue == null &&
            isTooltipVisible
          ? "No Sentiment Analysis To Display"
          : toggleState == sideTabButtonName.TECHNICALS
            ? `Technical Analysis is ${techIndicator} with value ${techValue}`
            : "";

  const handleDoubleClick = () => {
    if (window.innerWidth >= 1200) {
      topHeight == 0 ? setTopHeight(45) : setTopHeight(0);
    }
  };

  return (
    <div className="max-2xl:w-full 2xl:w-3/4" onDoubleClick={handleDoubleClick}>
      <div className="relative mx-2 flex flex-row items-center justify-start md:max-xl:mx-4 md:max-xl:gap-0">
        <h1
          className={`ml-2 flex-row truncate text-ellipsis py-2 font-medium max-md:text-[0.9rem] md:text-[0.95rem]  ${
            toggleState == sideTabButtonName.NEWS
              ? randomNews === false
                ? "xl:max-w-[10ch]"
                : "max-sm:max-w-[18ch] xl:max-w-[8ch]"
              : "max-sm:max-w-[25ch] xl:max-w-[12ch]"
          } ${
            ((toggleState == sideTabButtonName.NEWS && SAvalue) ||
              (toggleState == sideTabButtonName.TECHNICALS && techIndicator)) &&
            ((toggleState == sideTabButtonName.NEWS && SAvalue == "Positive") ||
            (toggleState == sideTabButtonName.TECHNICALS &&
              techIndicator == "Bullish")
              ? "cursor-pointer text-z-green-500"
              : (toggleState == sideTabButtonName.NEWS &&
                    SAvalue == "Negative") ||
                  (toggleState == sideTabButtonName.TECHNICALS &&
                    techIndicator == "Bearish")
                ? "cursor-pointer text-red-400"
                : " cursor-pointer")
          }`}
        >
          <span
            className=" "
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {dispsymbolname}
          </span>
        </h1>
        {!TechTableOpen && (
          <span
            className={`mx-2 gap-2 text-[0.75rem] font-medium text-gray-500 max-md:pt-[0.3rem] md:max-xl:pt-[0.2rem]`}
          >
            {toggleState == sideTabButtonName.NEWS
              ? randomNews === false
                ? ""
                : "Related News"
              : ""}
          </span>
        )}
        {isTooltipVisible && (
          <span className="pointer-events-none absolute left-[14rem] top-12 z-[1000] ml-1 flex min-w-[11.5rem] -translate-x-full -translate-y-1/2 transform items-center justify-center rounded bg-gray-800 px-1 text-[0.65rem] text-white opacity-100 transition-opacity duration-200 max-xl:hidden ">
            {tooltipMessage}
          </span>
        )}
        {TechTableOpen && toggleState == sideTabButtonName.TECHNICALS && (
          <span
            className={`mx-2 w-[3.5rem] cursor-pointer gap-2 text-[0.75rem] font-medium text-gray-500 max-md:pt-[0.3rem] md:max-xl:pt-[0.2rem]`}
            onClick={() => (TechTableOpen ? handleback() : "")}
          >
            {" "}
            &lt;&lt; Back
          </span>
        )}
        {toggleState == sideTabButtonName.NOTES && (
          <span
            className={`group relative mx-2 inline-block cursor-pointer md:max-2xl:mx-0`}
            onClick={() => {
              setShowCreateNotes(true), setNoteToEdit(null);
            }}
          >
            <Image
              src="/svg/notes.svg"
              className="cursor-pointer"
              height={15}
              width={15}
              alt=""
            />
            <span className=" pointer-events-none absolute left-12 top-10 z-[1001] ml-1 w-[4.5rem] -translate-x-full -translate-y-1/2 transform rounded  bg-gray-800 px-2  py-1 text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden">
              add Notes
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

export default SymbolNameSection;
