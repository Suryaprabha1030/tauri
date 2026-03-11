import React from "react";

interface StrategyAnalyzerTableHeaderProps {
  leftWidth: any;
}

const StrategyAnalyzerTableHeader: React.FC<
  StrategyAnalyzerTableHeaderProps
> = ({ leftWidth }) => {
  return (
    <thead className="sticky z-[10] max-xl:top-[-1px] xl:top-0">
      <tr className="bg-gray-100 text-left text-[0.75rem] uppercase text-z-gray-300 max-md:font-normal">
        <th className="py-2 text-left font-tableHead max-xl:w-[5.7rem] max-md:px-2 xl:w-[7.5rem] xl:px-2">
          Name
        </th>
        <th className="py-2 text-left font-tableHead max-md:w-[3rem] max-md:px-1 md:max-xl:w-[6rem] xl:w-[5rem] xl:px-4">
          Funds Needed
        </th>
        <th
          className={`py-2 text-left font-tableHead max-md:w-[3.1rem] ${leftWidth < 40 ? "xl:hidden" : ""} max-md:px-2 md:max-xl:w-[6rem] xl:w-[5.1rem] xl:px-4`}
        >
          Max Profit
        </th>
        <th
          className={`py-2 text-left font-tableHead max-md:w-[3rem] ${leftWidth < 40 ? "xl:hidden" : ""} max-md:px-2 md:max-xl:w-[6rem] xl:w-[5rem] xl:px-4`}
        >
          Max Loss
        </th>
      </tr>
    </thead>
  );
};

export default StrategyAnalyzerTableHeader;
