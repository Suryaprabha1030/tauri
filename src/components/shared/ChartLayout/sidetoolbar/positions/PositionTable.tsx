import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";

import { useRouter } from "next/navigation";
import { handleTVChart } from "@/lib/util/sideToolBar/sidetoolbarCommon";
import { formatNumber } from "@/lib/util/DraftUtil";
import CandleIcon from "../../optionFutures/CandleIcon";
import { getBrokerCode } from "@/components/helpers";
import { setChartIconClicked } from "@/lib/redux/slices/ChartsSlice";

interface PositionTableProps {
  positionsData: any[];
  leftWidth: number;
  showAvgprice: boolean;
  setPositionsData: React.Dispatch<React.SetStateAction<any>>;
  setcheckedData: React.Dispatch<React.SetStateAction<any>>;
  setAnyChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectAll: React.Dispatch<React.SetStateAction<boolean>>;
}

const PositionTable: React.FC<PositionTableProps> = ({
  positionsData,
  leftWidth,
  showAvgprice,
  setPositionsData,
  setcheckedData,
  setAnyChecked,
  setSelectAll,
}) => {
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const positionsdata = useSelector(
    (state: RootState) => state.strategy.positions,
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
  const path = window.location.pathname;
  const router = useRouter();
  const brokerCode = getBrokerCode();
  const dispatch = useDispatch();
  const handleCheckboxChange = (index: number) => {
    const newPositionsData = sortedPositionsData
      // .filter((position) => position.transaction_type !== "EXITED") // Exclude rows with transaction_type "EXITED"
      .map((position, i) => {
        if (i === index) {
          return { ...position, checked: !position.checked };
        }
        return position;
      });

    setPositionsData(newPositionsData);

    const checkedItems = newPositionsData.filter(
      (position) => position.checked,
    );
    setcheckedData(checkedItems);
    setAnyChecked(checkedItems.length > 0);

    // Update "Select All" checkbox state
    const allChecked = newPositionsData
      .filter((position) => position.transaction_type !== "EXITED") // Exclude "EXITED" rows
      .every((position) => position.checked); // Check only non-"EXITED" rows

    setSelectAll(allChecked);
  };

  const handleChart = (index: any, identifier: any, filter: any) => {
    dispatch(setChartIconClicked(false));
    handleTVChart(
      index,
      filter,
      path,
      router,
      dispatch,
      brokerCode,
      identifier,
    );
  };

  return (
    <tbody className="divide-y divide-gray-200 overflow-y-auto bg-white font-table scrollbar-none">
      {positionsData &&
        sortedPositionsData.map((position, index) => (
          <tr
            key={index}
            className={` group h-7 text-center hover:bg-gray-100 md:max-2xl:text-standard xl:text-right 2xl:text-global ${
              position.transaction_type == "EXITED" ? "bg-gray-100" : "bg-white"
            }`}
          >
            <td className="whitespace-nowrap text-black max-md:w-[2rem] max-md:px-0.5 max-md:text-[0.65rem] sm:max-xl:pt-1 md:w-[3rem] md:max-xl:py-[2rem] xl:w-[2.5rem] xl:px-5 2xl:pt-1  ">
              <input
                type="checkbox"
                checked={position?.checked}
                onChange={() => handleCheckboxChange(index)}
                className={`max-md:h-3 max-md:w-3  ${
                  position.transaction_type == "EXITED"
                    ? "invisible"
                    : "visible"
                }`}
              />
            </td>

            <td
              className={`relative flex flex-row whitespace-nowrap py-3 max-xl:items-center max-md:w-[11rem] max-md:gap-1 max-md:px-0.5 max-md:text-[0.65rem] md:gap-2 md:max-xl:py-[2rem] xl:max-2xl:flex-col xl:max-2xl:justify-start xl:max-2xl:pl-2 2xl:items-center  ${
                position?.transaction_type === "EXITED"
                  ? "text-gray-500"
                  : "text-black"
              }`}
            >
              <span className="  flex flex-row   ">
                {position?.display_symbol_name}
              </span>
              <div className="flex flex-row gap-1">
                <span
                  className={`flex h-3  items-center justify-center whitespace-nowrap rounded-sm border-gray-200 px-[0.3rem] text-center text-[0.5rem] max-md:px-[1px] md:max-xl:py-1 ${position.transaction_type === "EXITED" ? "bg-gray-200 text-gray-500" : "bg-blue-100 text-indigo-600"}`}
                >
                  {position?.exchange}
                </span>
                <span
                  className={`flex h-3  items-center justify-center whitespace-nowrap rounded-sm border-gray-200 px-[0.3rem] text-center text-[0.5rem] max-md:px-[1px] md:max-xl:py-1 ${position.transaction_type === "EXITED" ? "bg-gray-200 text-gray-500" : "bg-blue-100 text-indigo-600"}`}
                >
                  {position?.product}
                </span>
              </div>

              <CandleIcon
                className=" absolute right-0 flex  cursor-pointer items-center justify-center rounded border bg-gray-100 opacity-0 group-hover:opacity-100 max-sm:h-5 max-sm:w-5 md:h-[1.4rem] md:w-6"
                onClick={() =>
                  handleChart(index, position.identifier, "positions")
                }
              />
            </td>

            <td
              className={`whitespace-nowrap  py-3  text-black max-md:px-1.5 max-md:text-[0.65rem] md:px-2 md:max-xl:py-[2rem]  ${
                position.transaction_type.toUpperCase() === "LONG"
                  ? "text-z-green-500"
                  : position.transaction_type.toUpperCase() === "SHORT"
                    ? "text-red-400"
                    : "text-gray-500"
              }`}
            >
              {position?.quantity}
            </td>
            <>
              {leftWidth >= 40 && (
                <td
                  className={`whitespace-nowrap px-2 py-3 text-black max-sm:hidden sm:max-md:text-[0.65rem] md:max-xl:py-[2rem] ${position.transaction_type === "EXITED" ? "text-gray-500" : "text-black"}`}
                >
                  {formatNumber(position?.avg_net_price)}
                </td>
              )}
            </>
            <td
              className={`whitespace-nowrap py-3 max-md:px-1.5 max-md:text-[0.65rem] md:px-2 md:max-xl:py-[2rem] ${position.transaction_type === "EXITED" ? "text-gray-500" : "text-black"}
         `}
            >
              {position.transaction_type === "EXITED"
                ? formatNumber(position.ltp)
                : formatNumber(webSocketDataRead[position?.identifier])}
            </td>

            <td
              className={`whitespace-nowrap  py-3 max-md:flex max-md:text-[0.65rem] max-sm:justify-end max-sm:pr-3 sm:max-md:px-3 md:pr-2 md:max-xl:py-[2rem] 

          ${
            position.transaction_type === "EXITED"
              ? "text-gray-500"
              : position.pnl > 0
                ? "text-green-500"
                : position.pnl < 0
                  ? "text-red-400"
                  : "text-gray-500"
          }`}
            >
              {position.pnl !== undefined &&
                (() => {
                  const pnl = Number(position.pnl);
                  const formatted =
                    leftWidth >= 80 ? pnl?.toFixed(2) : formatNumber(pnl);
                  return pnl > 0 ? `+${formatted}` : formatted;
                })()}
            </td>
          </tr>
        ))}
    </tbody>
  );
};

export default PositionTable;
