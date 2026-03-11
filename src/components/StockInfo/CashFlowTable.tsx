import { formatNumber, tableHighLowComparison } from "@/lib/util/DraftUtil";
import React, { useState } from "react";
import NoData from "./NoData";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

interface CashFlowTableProps {
  data: any;
  section: string;
  fields: string[]
}

const CashFlowTable = ({ data, section, fields }: CashFlowTableProps) => {
  const [sortCol, setSortCol] = useState({
    col: 0,
    order: 1
  })
  const dates = Object.keys(data)?.slice(0, 4);
  const tableRows = fields?.map(field => {
    return dates?.map(date => data[date]?.[field] ?? null);
  });

  let tableFormatData = fields?.map(field => {
    return {
      [field]: dates?.map(date => data[date]?.[field] ?? null)
    };
  });

  const colCount = tableRows[0]?.length || 0;

  // Create array filled with 0 → reduce through rows
  const columnTotals = Array(colCount).fill(0);

  tableFormatData.forEach(row => {
    const values = Object.values(row)[0]
    values.forEach((value, index) => {
      columnTotals[index] += (value || 0)
    })
  })

  // Step 1: Extract column values with their original object references
  const columnData = tableFormatData.map((row, index) => ({
    originalIndex: index,
    row: row,
    value: row[Object.keys(row)[0]][sortCol.col]  // 1, 2, 3
  }));

  // Step 2: Sort JUST the column values (ASC)
  columnData.sort((a, b) => (a.value - b.value) * sortCol.order);

  // Step 3: Reorder original data using sorted column order
  tableFormatData = columnData.map(item => item.row);

  return (
    <div className="max-h-full w-full py-2 md:max-xl:h-[98%] min-w-0 overflow-x-hidden">
      <div className="w-full bg-white p-1 text-lg font-semibold max-md:text-sm">
        {section}
      </div>
      {data && Object.entries(data)?.length > 0 ? (
        <div className="max-h-[95%] overflow-auto  scrollbar-thin">
          <table className="min-w-full table-fixed border-collapse text-[0.85rem] max-sm:text-[0.65rem]">
            {/* Table Header */}
            <thead className="z-9 sticky left-0 top-0">
              <tr className="border-b-2">
                <th className=" sticky left-0 bg-white p-2 text-left"></th>
                {dates?.map((date, index) => (
                  <th key={index} className="px-1 py-2 text-left text-z-gray-300 bg-white text-nowrap">

                    <button className={`text-nowrap`}
                      onClick={() => {
                        setSortCol((prev) => {
                          if (prev.order === 1) {
                            return { col: index, order: -1 }
                          } else {
                            return { col: index, order: 1 }
                          }
                        }
                        )
                      }
                      }>
                      {formatDate(date)}
                      {sortCol.col === index && <span className={`px-0.5 ${sortCol.order === 1 ? 'text-green-500' : 'text-red-400'}`}>
                        {sortCol.order === 1 ? '↑' : '↓'}
                      </span>}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-gray-800">
              {tableFormatData && tableFormatData.map((item, rowIndex) => {
                const field = Object.keys(item)[0]
                const values = Object.values(item)[0]
                
                return (
                  <tr key={rowIndex} className={` ${rowIndex % 2 == 0 ? "bg-white" : "bg-gray-100"}`}>
                    <td className={` ${rowIndex % 2 == 0 ? "max-sm:bg-white" : "max-sm:bg-gray-100"} text-left sticky left-0 z-1 p-2 font-medium max-xl:z-[1] max-xl:my-2 max-xl:h-[1rem]`}>
                      {field}
                    </td>
                    {values?.map((rowValue, valueIndex) => {

                      const currentValue = values[valueIndex]
                      const prevValue = valueIndex < values.length -1 ? values[valueIndex + 1] : null
                      const status = tableHighLowComparison(currentValue, prevValue)

                      if (rowValue == null || rowValue == undefined) {
                        return <td key={valueIndex} className="p-2 text-left max-sm:text-center">-</td>
                      }

                      return (
                        <td key={valueIndex}>
                          <span className="flex flex-row">
                            {formatNumber(rowValue)}
                            {
                              valueIndex !== (values.length - 1) && status !== null &&
                              <span className={`px-0.5 flex ${status ? 'text-green-500' : 'text-red-400'}`}>
                                {status ? '↑' : '↓'}
                              </span>
                            }
                          </span>
                        </td>)
                      }
                    )}
                  </tr>
                )
              }
              )}

              <tr className="bg-gray-100 font-semibold text-z-gray-300">
                <td className="sticky left-0 bg-gray-100 p-2 ">
                  Net Income
                </td>

                {columnTotals?.map((value, i) => {

                  const currentValue = columnTotals[i]
                  const prevValue = i < columnTotals.length - 1 ? columnTotals[i + 1] : null
                  const status = tableHighLowComparison(currentValue, prevValue)
                  
                  return (
                    <td key={i} className="p-2 text-left">
                      <span className="flex flex-row items-center">
                        {formatNumber(value)}
                        {
                              i !== (columnTotals.length - 1) &&
                              <span className={`px-0.5 max-sm:hidden flex ${status ? 'text-green-500' : 'text-red-400'}`}>
                                {status ? '↑' : '↓'}
                              </span>
                            }
                      </span>
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <NoData data={section} />
      )}
    </div>
  );
};

CashFlowTable.displayName = "CashFlowTable";
export default React.memo(CashFlowTable);