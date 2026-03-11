import React, { useState } from "react";
import FiiDiiTab from "./FiiDiiTab";
import FiiDiiData from "./FiiDiiData";
import { WidthAdjusterDoubleClick } from "@/lib/util/sideToolBar/sidetoolbarCommon";
import RemoveButton from "../../sidetoolbar/sharedContent/RemoveButton";

import { ShowStrategiesPopup } from "@/lib/redux/slices/ChartsSlice";
import { useDispatch } from "react-redux";
import MonthSelector from "./MonthSelector";
import { getMonthsFromMay2025 } from "@/lib/util/FiiDiiUtil/FiiDiiUtil";
import FiiDiiTabDropDown from "./FiiDiiTabDropDown";
import Headings from "../../sidetoolbar/sharedContent/headings";

interface FiiDiiAnalysisProps {
  leftWidth: number;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
}

const FiiDiiAnalysis: React.FC<FiiDiiAnalysisProps> = ({
  leftWidth,
  setLeftWidth,
}) => {
  const [FiiDiiActiveButton, setFiiDiiActiveButton] = useState("summary");
  const dispatch = useDispatch();
  const months = getMonthsFromMay2025();
  const [payLoadDate, setPayLoadDate] = useState<any>(
    months[months.length - 1],
  );
  return (
    <div className="flex h-full w-full flex-col ">
      <span
        className={` flex  w-full bg-white ${leftWidth < 40 ? "h-[12%] flex-col " : " h-[12%] flex-row items-center justify-between max-sm:h-[15%] 2xl:h-[7%] 2xl:gap-5 "}  2xl:pl-5 `}
        onDoubleClick={() => WidthAdjusterDoubleClick(leftWidth, setLeftWidth)}
      >
        <div
          className={` flex w-full justify-between max-sm:flex-col sm:flex-row sm:max-xl:items-center xl:flex-col 2xl:flex-row 2xl:items-center 2xl:gap-5 `}
        >
          <h1
            className={`px-2 py-2 font-heading max-md:px-4 max-md:text-[1rem] md:text-xl md:max-xl:px-6 xl:max-2xl:ml-2`}
          >
            FII/DII
          </h1>
          <div className="flex flex-row max-sm:gap-5 max-sm:px-3 sm:max-xl:gap-10 md:max-lg:p-2  2xl:gap-10 ">
            {leftWidth >= 40 && (
              <div className=" flex  flex-row  items-center gap-2 md:max-xl:pt-0.5 xl:w-[90%]  xl:max-2xl:mx-auto xl:max-2xl:justify-between  2xl:w-full">
                <MonthSelector
                  payLoadDate={payLoadDate}
                  setPayLoadDate={setPayLoadDate}
                />
                <FiiDiiTab
                  setFiiDiiActiveButton={setFiiDiiActiveButton}
                  FiiDiiActiveButton={FiiDiiActiveButton}
                  leftWidth={leftWidth}
                />
              </div>
            )}
            <div
              className=" flex h-full flex-row items-center bg-red-200"
              onDoubleClick={(event: any) => {
                event.stopPropagation();
              }}
            >
              <RemoveButton
              // additionStyle="p-3"
              />
            </div>
          </div>
        </div>
        {leftWidth < 40 && (
          <div className=" flex  flex-row items-center gap-2 bg-white md:max-xl:w-[6rem] md:max-xl:pt-0.5 xl:ml-5 2xl:m-0">
            <MonthSelector
              payLoadDate={payLoadDate}
              setPayLoadDate={setPayLoadDate}
            />
            <FiiDiiTab
              setFiiDiiActiveButton={setFiiDiiActiveButton}
              FiiDiiActiveButton={FiiDiiActiveButton}
              leftWidth={leftWidth}
            />
          </div>
        )}
      </span>
      <span
        className={` ${leftWidth < 40 ? "h-[82%]" : "h-[86%] 2xl:h-[91%]"} w-full max-sm:h-[83%]`}
      >
        <FiiDiiData
          FiiDiiActiveButton={FiiDiiActiveButton}
          leftWidth={leftWidth}
          payLoadDate={payLoadDate}
          setPayLoadDate={setPayLoadDate}
        />
      </span>
    </div>
  );
};

export default FiiDiiAnalysis;
