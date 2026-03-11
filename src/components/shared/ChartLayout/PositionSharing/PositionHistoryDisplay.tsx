// import { formatShortDate } from "@/lib/util/DateUtil";
import React, { useEffect, useState, useRef } from "react";
import { formatNumber } from "@/lib/util/DraftUtil";
import BuySellDisplay from "../sidetoolbar/Strategies Analyzer/StrategyAnalyzerTableBody/BuySellDisplay";
import PnlCalendar from "./CalenderView";
import { formatShortDate } from "@/lib/util/DateUtil";
import HistoryPositionsCard from "../sidetoolbar/positions/HistoryPositionsCard";

interface PositionHistoryDisplayProps {
  leftWidth: number;
  calenderData: any;
}

const PositionHistoryDisplay: React.FC<PositionHistoryDisplayProps> = ({
  leftWidth,
  calenderData,
}) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  });

  // find the entry for selected date
  const selectedDay = calenderData?.find(
    (d) => d.created_at.split("T")[0] === selectedDate
  );
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <div className="h-full max-xl:overflow-y-auto max-xl:scrollbar">
      <div
        className={`flex  flex-col  items-center gap-4  p-4 ${
          selectedDate && selectedDay && selectedDay?.data?.length > 0
            ? "max-xl:min-h-full"
            : "max-xl:h-full"
        } xl:h-full`}
        ref={containerRef}
      >
        {" "}
        <PnlCalendar
          data={calenderData}
          leftWidth={leftWidth}
          selectedDate={selectedDate}
          onDateSelect={(dateKey) => setSelectedDate(dateKey)}
        />
        {/* Bottom Half: Table for Expanded Row */}
        <div className="flex h-3/4  w-[100%] flex-col items-center justify-center sm:ml-5 xl:py-4 ">
          {selectedDate &&
            selectedDay &&
            selectedDay?.data?.length > 0 &&
            selectedDay?.total_pnl != undefined &&
            selectedDay?.total_pnl != null && (
              <HistoryPositionsCard positionPnl={selectedDay?.total_pnl} />
            )}
          <div className="h-[90%] w-full overflow-y-auto scrollbar-thin max-xl:h-[30%]  max-sm:max-h-[68%] ">
            {selectedDate &&
              (selectedDay && selectedDay?.data?.length > 0 ? (
                <table className=" w-full table-fixed">
                  <thead>
                    <tr className="sticky top-0 h-7 bg-gray-50 text-left text-[0.75rem] uppercase text-gray-400">
                      <th className="px-1 py-2  font-tableHead max-sm:w-[12rem] sm:w-[13rem] md:w-[13rem] 2xl:w-[14.5rem]">
                        Symbol
                      </th>
                      <th className="px-1 py-2 text-right font-tableHead">
                        Qty
                      </th>
                      {leftWidth >= 40 && (
                        <th className="px-1 py-2 text-right font-tableHead max-sm:hidden">
                          Avg
                        </th>
                      )}
                      {leftWidth >= 40 && (
                        <th className="px-1 py-2 text-right font-tableHead max-sm:hidden">
                          LTP
                        </th>
                      )}
                      <th className="px-1 py-2 text-right font-tableHead">
                        P&l
                      </th>

                      <th
                        className={`px-1 py-2 text-right font-tableHead ${leftWidth <= 40 ? "xl:w-[3.5rem]" : ""}`}
                      >
                        B/S
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDay.data.map((item: any, index: number) => (
                      <tr
                        key={index}
                        className={`h-7 border-b text-right text-[0.68rem] font-table md:max-2xl:text-standard 2xl:text-global ${
                          item?.transaction_type.toUpperCase() === "EXITED"
                            ? "text-gray-500"
                            : ""
                        }`}
                      >
                        <td className="px-1 py-2 text-left">
                          {item?.display_symbol_name}
                        </td>
                        <td className="px-1 py-2 ">{item?.quantity}</td>
                        {leftWidth >= 40 && (
                          <td className="px-1 py-2  max-sm:hidden">
                            {formatNumber(item?.avg_net_price)}
                          </td>
                        )}
                        {leftWidth >= 40 && (
                          <td className="px-1 py-2  max-sm:hidden">
                            {formatNumber(item?.ltp)}
                          </td>
                        )}
                        <td
                          className={`px-1 py-2  ${
                            item?.transaction_type === "EXITED"
                              ? "text-gray-500"
                              : item?.pnl > 0
                                ? "text-z-green-500"
                                : item?.pnl < 0
                                  ? "text-red-500"
                                  : "text-gray-500"
                          }`}
                        >
                          {item?.pnl > 0
                            ? `+${formatNumber(item.pnl)}`
                            : formatNumber(item.pnl)}
                        </td>

                        <td className="px-1 py-2 ">
                          {["SELL", "SHORT", "BUY", "LONG"].includes(
                            item?.transaction_type
                          ) ? (
                            <BuySellDisplay
                              transactionType={item?.transaction_type}
                            />
                          ) : (
                            <div className="h-5">Exited</div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-center text-[0.8rem] text-gray-500 max-sm:text-[0.8rem]">
                  No Positions Available on {formatShortDate(selectedDate)}.
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionHistoryDisplay;
