import { formatNumber } from "@/lib/util/DraftUtil";
import React, { useState } from "react";
import NoData from "./NoData";
import { tableHighLowComparison } from "@/lib/util/DraftUtil";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
};

interface ResultTableProps {
  data: any;
  section: string;
  fields: string[];
  Insidechat: any;
}

const ResultsTable = ({
  data,
  section,
  fields,
  Insidechat,
}: ResultTableProps) => {
  const [sortCol, setSortCol] = useState({ col: 0, order: 1 });
  const dates = Object.keys(data)?.slice(0, 4);
  let tableFormatData = fields?.map((field) => {
    return {
      [field]: dates?.map((date) => data[date]?.[field] ?? null),
    };
  });

  const columnData = tableFormatData?.map((row, index) => ({
    originalIndex: index,
    row: row,
    value: row[Object.keys(row)[0]][sortCol.col],
  }));

  columnData.sort((a, b) => (a.value - b.value) * sortCol.order);

  tableFormatData = columnData.map((item) => item.row);

  return (
    <div className="max-h-full w-full min-w-0 overflow-x-hidden py-2 md:max-xl:h-[98%]">
      <div className="w-full bg-white p-1 text-lg font-semibold max-md:text-sm">
        {section}
      </div>
      {data && Object.entries(data)?.length > 0 ? (
        <div className=" overflow-auto scrollbar-thin">
          <table className="min-w-full table-fixed border-collapse text-[0.85rem] max-sm:text-[0.65rem]">
            {/* Table Header */}
            <thead className="z-9 sticky left-0 top-0 ">
              <tr className="border-b-2">
                <th className=" sticky left-0 bg-white p-2 text-left"></th>
                {dates?.map((date, index) => (
                  <th
                    key={date}
                    className=" bg-white px-1 py-2 text-left text-z-gray-300"
                  >
                    <button
                      className={`text-nowrap`}
                      onClick={() => {
                        setSortCol((prev) => {
                          if (prev.order === 1) {
                            return { col: index, order: -1 };
                          } else {
                            return { col: index, order: 1 };
                          }
                        });
                      }}
                    >
                      {formatDate(date)}
                      {sortCol.col === index && (
                        <span
                          className={`px-0.5 ${sortCol.order === 1 ? "text-green-500" : "text-red-400"}`}
                        >
                          {sortCol.order === 1 ? "↑" : "↓"}
                        </span>
                      )}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="text-gray-800">
              {tableFormatData &&
                tableFormatData.map((item, rowIndex) => {
                  const field = Object.keys(item)[0];
                  const values = Object.values(item)[0];
                  return (
                    <tr
                      key={rowIndex}
                      className={` ${rowIndex % 2 == 0 ? "bg-white" : "bg-gray-100"}`}
                    >
                      <td
                        className={` ${rowIndex % 2 == 0 ? `${Insidechat ? "max-lg:bg-white" : "max-sm:bg-white"}` : `${Insidechat ? "max-lg:bg-gray-100" : "max-sm:bg-gray-100"}`} z-1 sticky left-0 p-2 text-left font-medium max-xl:z-[1] max-xl:my-2 max-xl:h-[1rem]`}
                      >
                        {field}
                      </td>
                      {values?.map((rowValue, valueIndex) => {
                        const currentValue = values[valueIndex];
                        const prevValue =
                          valueIndex < values.length - 1
                            ? values[valueIndex + 1]
                            : null;
                        const status = tableHighLowComparison(
                          currentValue,
                          prevValue
                        );

                        if (rowValue == null || rowValue == undefined) {
                          return (
                            <td
                              key={valueIndex}
                              className="p-2 text-left max-sm:text-center"
                            >
                              -
                            </td>
                          );
                        }

                        return (
                          <td key={valueIndex} className="">
                            <span className="flex flex-row items-center">
                              {formatNumber(rowValue)}
                              {valueIndex !== values.length - 1 &&
                                status !== null && (
                                  <span
                                    className={`flex px-0.5 ${status ? "text-green-500" : "text-red-400"}`}
                                  >
                                    {status ? "↑" : "↓"}
                                  </span>
                                )}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ) : (
        <NoData data={section} />
      )}
    </div>
  );
};
ResultsTable.displayName = "ResultsTable";
export default React.memo(ResultsTable);
