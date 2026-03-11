import React from "react";
interface HoldingsTableHeaderProps {
  leftWidth: number;
}
const HoldingsTableHeader: React.FC<HoldingsTableHeaderProps> = ({
  leftWidth,
}) => {
  return (
    <thead>
      <tr className="sticky z-10 bg-gray-50  uppercase text-gray-400 max-xl:top-[-2px] xl:top-0">
        <th className=" py-3 text-left font-tableHead tracking-wider max-xl:px-1 max-md:w-[6.5rem] max-md:text-[0.65rem] md:text-xs lg:w-[12rem] xl:px-5">
          Symbol
        </th>
        <th
          className={`h-full py-3 text-right font-tableHead tracking-wider
    ${
      leftWidth >= 80
        ? "xl:max-2xl:w-[2.1rem] xl:max-2xl:px-0 xl:max-2xl:text-center 2xl:text-right"
        : "xl:max-2xl:w-[4rem]"
    }
    max-md:w-[5rem] max-md:text-[0.65rem]
    md:text-xs md:max-lg:w-[7.5rem] lg:max-xl:w-[6rem]
    xl:px-2 2xl:w-[5.5rem]`}
        >
          <div className="flex flex-row items-center justify-end gap-1">
            <div className="w-[2.5rem]"></div>
            <div className="w-[3rem] text-right">Qty</div>
          </div>
        </th>

        <th
          className={`w-[5rem] py-3 text-right font-tableHead tracking-wider max-md:w-[3rem] max-md:px-0.5 max-md:text-[0.65rem] md:text-xs md:max-lg:w-[6.5rem] lg:max-xl:w-[5rem] xl:px-2 xl:max-2xl:w-[4rem] ${leftWidth < 40 ? "xl:max-2xl:hidden" : ""}`}
        >
          Avg
        </th>
        <th
          className={`w-[7rem] py-3 text-right font-tableHead tracking-wider max-md:w-[3rem] max-md:px-0.5 max-md:text-[0.65rem] md:text-xs md:max-lg:w-[6.5rem] lg:max-xl:w-[5rem] xl:px-2 xl:max-2xl:w-[4rem] 2xl:w-[5rem] ${leftWidth < 40 ? "xl:max-2xl:hidden" : ""} `}
        >
          LTP
        </th>
        <th className="w-[7rem]  py-3 text-right font-tableHead tracking-wider max-md:w-[3rem] max-md:px-0.5 max-md:text-[0.65rem] md:text-xs md:max-lg:w-[6.5rem] lg:max-xl:w-[5rem] xl:px-2 xl:max-2xl:w-[4rem] 2xl:w-[5rem] 2xl:pr-3 ">
          P&L
        </th>

        {leftWidth >= 80 && (
          <>
            <th className=" w-[7rem] px-3 py-3 text-right font-tableHead tracking-wider max-md:text-[0.65rem] md:text-xs 2xl:w-[5rem] ">
              Chg
            </th>
          </>
        )}
      </tr>
    </thead>
  );
};

export default HoldingsTableHeader;
