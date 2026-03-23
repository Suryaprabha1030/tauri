import { RootState } from "@/lib/redux/Store";
import React from "react";
import { useSelector } from "react-redux";

interface PositionsTableHeaderProps {
  positionsData: any[];
  selectAll: boolean;
  leftWidth: number;
  setPositionsData: React.Dispatch<React.SetStateAction<any>>;
  setcheckedData: React.Dispatch<React.SetStateAction<any>>;
  setAnyChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
}

const PositionsTableHeader: React.FC<PositionsTableHeaderProps> = ({
  positionsData,
  selectAll,
  leftWidth,
  setPositionsData,
  setcheckedData,
  setAnyChecked,
  setSelectAll,
}) => {
  const positionsdata = useSelector(
    (state: RootState) => state.strategy.positions
  );
  const sortedPositionsData =
    positionsdata &&
    [...positionsData].sort((a, b) => {
      if (a.transaction_type === "EXITED" && b.transaction_type !== "EXITED")
        return 1;
      if (a.transaction_type !== "EXITED" && b.transaction_type === "EXITED")
        return -1;
      return 0;
    });
  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    const newPositionsData = positionsData.map(
      (position) =>
        position.transaction_type !== "EXITED"
          ? { ...position, checked: newSelectAll }
          : position // Keep "EXITED" rows unchanged
    );
    setPositionsData(newPositionsData);
    setcheckedData(newPositionsData.filter((position) => position.checked));
    setAnyChecked(newSelectAll);
    setSelectAll(newSelectAll);
  };

  return (
    <thead>
      <tr className="sticky z-10 text-center text-gray-400 max-xl:top-[-2px] xl:top-0 xl:text-right">
        <th className="bg-gray-50 py-3  pt-4 font-tableHead uppercase tracking-wider  max-md:w-[2rem] max-md:px-1 max-md:text-[0.55rem] sm:max-xl:pt-4 md:w-[3rem] md:text-xs xl:w-[2.5rem] xl:px-5">
          {positionsData &&
            sortedPositionsData.some(
              (position) => position.transaction_type !== "EXITED"
            ) && (
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAllChange}
                className="max-md:h-3 max-md:w-3"
              />
            )}
        </th>

        <th className="bg-gray-50 py-3 text-left font-tableHead uppercase tracking-wider  max-md:px-1 max-md:text-[0.65rem] max-sm:w-[11.5rem] sm:max-md:w-[13rem] md:px-2 md:text-xs md:max-xl:w-[20rem] xl:max-2xl:w-[40%] xl:max-2xl:text-left 2xl:w-[16rem]">
          Symbol
        </th>
        <th className=" bg-gray-50 py-3 font-tableHead   uppercase tracking-wider max-md:px-1 max-md:text-[0.65rem] md:px-2 md:text-xs">
          Qty
        </th>

        <>
          {leftWidth >= 40 && (
            <th className="bg-gray-50 px-2 py-3 text-xs font-tableHead uppercase tracking-wider max-md:px-1 max-md:text-[0.65rem] max-sm:hidden max-sm:w-[2rem] sm:max-md:w-[4rem]">
              Avg
            </th>
          )}
        </>

        <th className="bg-gray-50  py-3 font-tableHead uppercase  tracking-wider max-md:px-1 max-md:text-[0.65rem] max-sm:w-[3rem] md:px-2 md:text-xs">
          LTP
        </th>
        <th className="bg-gray-50 py-3 font-tableHead uppercase tracking-wider  max-md:px-1 max-md:text-[0.65rem] max-sm:pr-4 max-sm:text-right sm:max-md:pr-8 md:px-2 md:text-xs">
          P&L
        </th>
      </tr>
    </thead>
  );
};

export default PositionsTableHeader;
