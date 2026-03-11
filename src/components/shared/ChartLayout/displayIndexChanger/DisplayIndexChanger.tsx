import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import DisplayIncreDecrease from "../DisplayIncreDecrease/DisplayIncreDecrease";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { formatNumber } from "@/lib/util/DraftUtil";
import { updateSymbolData } from "@/lib/redux/slices/StrategySlice";

interface DisplayIndexChangerProps {
  setShowDropDown: Dispatch<SetStateAction<boolean>>;
  ObjData: any;
  showDropDown: boolean;
  filteredData: any[];
  selectedIndexName: string;
  handleSelectIndex: (data: any, event: any) => void;
  StyleForSmallScreen?: String;
  dropDownClassName: any;
}

const DisplayIndexChanger: React.FC<DisplayIndexChangerProps> = ({
  setShowDropDown,
  ObjData,
  showDropDown,
  filteredData,
  selectedIndexName,
  handleSelectIndex,
  StyleForSmallScreen,
  dropDownClassName,
}) => {
  const dispatch = useDispatch();
  const LiveLtpData = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  const LiveChangePercentData = useSelector(
    (state: RootState) => state.strategy.netChangepercent
  );

  return (
    <div
      className={`dropdown-container  relative flex h-[2rem] w-[15rem] items-center justify-start gap-3 border-gray-300  text-center text-[0.7rem] text-black outline-none max-sm:h-[100%] sm:py-2  ${StyleForSmallScreen}`}
    >
      <div
        className={`flex w-[7rem]  flex-row items-center bg-white max-sm:justify-center sm:max-xl:gap-[1rem] sm:max-md:w-[8rem] md:max-xl:w-[8rem] xl:max-2xl:w-[7rem] ${StyleForSmallScreen} xl:max-2xl:shadow-none 2xl:shadow-none`}
        onClick={() => {
          setShowDropDown(true);
        }}
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        <div
          className={`flex w-full  cursor-pointer flex-row justify-between  ${dropDownClassName}  border-gray-200 px-2 py-[0.25rem] text-[0.8rem] font-medium`}
        >
          {selectedIndexName}
          <Image
            src="/svg/arrowFall.svg"
            width="25"
            height="25"
            alt="plus"
            onDoubleClick={(event: any) => {
              event.stopPropagation();
            }}
            className="h-[1.35rem] w-[1.3rem] p-0"
          />
        </div>
      </div>
      {showDropDown ? (
        <div className=" absolute left-0 top-11 z-[9999] flex h-[8rem] w-[8rem] flex-col items-start justify-start overflow-y-auto rounded-lg  bg-white text-[0.6rem] text-black shadow-lg max-xl:scrollbar-none xl:scrollbar-thin xl:scrollbar-track-gray-100 xl:scrollbar-thumb-z-br-gray">
          {filteredData.map((item: any, index: any) => (
            <div
              key={index}
              className={`flex w-full cursor-pointer justify-start px-2 py-1 text-[0.7rem] sm:max-xl:py-2 sm:max-md:text-[0.75rem] ${
                selectedIndexName?.toLowerCase() ===
                item?.index_name?.toLowerCase()
                  ? "bg-blue-500 text-white"
                  : "text-black hover:bg-gray-100"
              } hover:bg-blue-500  `}
              onMouseDown={(e) => handleSelectIndex(item, e)}
              onDoubleClick={(event: any) => {
                event.stopPropagation();
              }}
            >
              {item?.index_name}
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
      <div
        className={`flex flex-row items-center gap-1 text-[0.75rem] font-medium ${
          Number(LiveChangePercentData[ObjData?.identifier]) < 0
            ? "text-red-400"
            : Number(LiveChangePercentData[ObjData?.identifier]) > 0
              ? "text-z-green-500"
              : "text-gray-500"
        }`}
      >
        <span>{ObjData?.identifier && LiveLtpData[ObjData?.identifier]}</span>
        <span className=" text-[0.65rem]">
          (
          {ObjData?.identifier &&
            formatNumber(LiveChangePercentData[ObjData?.identifier])}
          %)
        </span>
        <DisplayIncreDecrease
          value={LiveChangePercentData[ObjData?.identifier]}
        />
      </div>
    </div>
  );
};

export default DisplayIndexChanger;
