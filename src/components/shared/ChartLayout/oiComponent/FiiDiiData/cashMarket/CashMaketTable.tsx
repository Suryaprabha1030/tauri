import { RootState } from "@/lib/redux/Store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatValue } from "../../OIUtil";
import { parseDate, sortKey } from "@/lib/util/FiiDiiUtil/FiiDiiUtil";
interface CashMaketTableProps {
  leftWidth: number;
}
const CashMaketTable: React.FC<CashMaketTableProps> = ({ leftWidth }) => {
  const [tableData, setTableData] = useState({});
  const cashFlowData = useSelector(
    (state: RootState) => state.FiiDiiData.cashFlowList
  );

  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });

  const handleSort = (columnPath: string) => {
    let direction = "asc";

    if (sortConfig.key === columnPath && sortConfig.direction === "asc") {
      direction = "desc";
    }
    // for path find in obj
    const getNestedValue = (obj: {}, path: string) => {
      return path.split(".").reduce((acc, key) => acc?.[key], obj);
    };
    // change obj to array
    const arr = Object.values(tableData);
    const sortedData = [...arr].sort((a: any, b: any) => {
      const aVal = getNestedValue(a, columnPath);
      const bVal = getNestedValue(b, columnPath);
      console.log(aVal, columnPath);
      if (columnPath === "fii.date" || columnPath === "dii.date") {
        return direction === "asc"
          ? parseDate(aVal) - parseDate(bVal)
          : parseDate(bVal) - parseDate(aVal);
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });

    setTableData(sortedData);
    setSortConfig({ key: columnPath, direction });
  };

  useEffect(() => {
    setTableData(cashFlowData);
  }, [cashFlowData]);

  return (
    <div className="mt-2 max-h-[100%] w-full overflow-y-scroll rounded-lg border border-z-blue-200  scrollbar-none">
      <table className="relative h-[100%] w-full table-fixed border border-blue-200">
        <thead className=" sticky left-0 top-0">
          <tr className="h-10 w-full border-b-2 border-gray-200  bg-white text-[0.75rem] text-gray-400">
            {sortKey?.map((col: any) => {
              const isNetColumn = col.label.includes("Net");
              const isSellColumn = col.label.includes("Sell");

              // Control visibility based on width
              if (
                (leftWidth < 80 && isNetColumn) ||
                (leftWidth < 40 && isSellColumn)
              ) {
                return null; // don't render
              }

              return (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className=" cursor-pointer px-2 text-center font-tableHead"
                >
                  <div className="flex w-full items-center justify-center gap-1 ">
                    {col.label}
                    <span
                      className={`${
                        sortConfig.direction === "asc"
                          ? "text-green-500"
                          : "text-red-400"
                      }`}
                    >
                      {sortConfig.key === col.key &&
                        (sortConfig.direction === "asc" ? "↑" : "↓")}
                    </span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="">
          {Object.entries(tableData)?.length > 0 &&
            Object.entries(tableData)
              ?.reverse()
              .map(([key, value]: any[], rowIndex) => {
                return (
                  <tr
                    className={`h-10 w-full border-b border-gray-200 bg-white text-[0.8rem] max-sm:text-[0.65rem] text-black`}
                    key={rowIndex}
                  >
                    <td className="px-2 text-center">
                      {value?.fii?.date?.replace(/-/g, " ")}
                    </td>
                    <td className="px-2 text-center">
                      {formatValue(value?.fii?.buy_value)}
                    </td>
                    {leftWidth >= 40 && (
                      <td className="px-2 text-center">
                        {formatValue(value?.fii?.sell_value)}
                      </td>
                    )}
                    {leftWidth >= 80 && (
                      <td className="px-2 text-center">
                        {formatValue(value?.fii?.net_value)}
                      </td>
                    )}
                    <td className="px-2 text-center">
                      {formatValue(value?.dii?.buy_value)}
                    </td>
                    {leftWidth >= 40 && (
                      <td className="px-2 text-center">
                        {formatValue(value.dii?.sell_value)}
                      </td>
                    )}
                    {leftWidth >= 80 && (
                      <td className="px-2 text-center">
                        {formatValue(value?.dii?.net_value)}
                      </td>
                    )}
                  </tr>
                );
              })}
        </tbody>
      </table>
    </div>
  );
};

export default CashMaketTable;
