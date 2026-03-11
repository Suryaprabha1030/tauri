import { formatShortDate } from "@/lib/util/DateUtil";
import { formatNumber } from "@/lib/util/DraftUtil";
import React, { useMemo } from "react";

type TradeData = {
  id: number;
  total_pnl: number;
  created_at: string;
};

interface Props {
  data: TradeData[];
  leftWidth: any;
  selectedDate: any;
  onDateSelect?: (dateKey: string) => void;
}

const PnlCalendar: React.FC<Props> = ({
  data,
  leftWidth,
  selectedDate,
  onDateSelect,
}) => {
  const today = new Date();

  const months = useMemo(() => {
    let result: { year: number; month: number }[] = [];
    const noOfmonth = leftWidth < 40 ? 1 : 2; //display only 3months
    //  leftWidth >= 80 ? 5 :
    for (let i = noOfmonth; i >= 0; i--) {
      const d = new Date(today?.getFullYear(), today.getMonth() - i, 1);
      result.push({ year: d?.getFullYear(), month: d.getMonth() });
    }
    return result;
  }, [today, leftWidth]);

  // map of dateKey → pnl
  const pnlMap = useMemo(() => {
    const map: Record<string, number> = {};
    data?.forEach((d) => {
      const dateKey = d?.created_at?.split("T")[0];
      map[dateKey] = (map[dateKey] || 0) + d?.total_pnl;
    });
    return map;
  }, [data]);

  // map of dateKey → time (take first record)
  const timeMap = useMemo(() => {
    const map: Record<string, string> = {};

    data?.forEach((d) => {
      const createdAt = d?.created_at;
      if (!createdAt) return;

      const dateKey = createdAt.split("T")[0];
      if (!map[dateKey]) {
        const utcDate = new Date(createdAt + "Z");
        // Convert to IST
        map[dateKey] = utcDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          timeZone: "Asia/Kolkata",
        });
      }
    });

    return map;
  }, [data]);

  const getBoxColor = (dateKey: string) => {
    if (!(dateKey in pnlMap)) return "bg-gray-200";
    if (pnlMap[dateKey] > 0) return "bg-z-green-500";
    if (pnlMap[dateKey] < 0) return "bg-red-400";
    return "bg-gray-400";
  };
  const getBorderColor = (bgClass: string) => {
    switch (bgClass) {
      case "bg-z-green-500":
        return "#008236"; // Tailwind green-500
      case "bg-red-400":
        return "#e7000b"; // Tailwind red-400
      case "bg-gray-400":
        return "#6a7282"; // Tailwind gray-400
      default:
        return "#d1d5db"; // Tailwind gray-200
    }
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const todayKey = `${today?.getFullYear()}-${String(today?.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  return (
    <div
      className={`flex ${leftWidth < 40 ? "w-full" : "w-[90%] "} justify-center gap-8 max-sm:gap-4`}
    >
      {months.map(({ year, month }, monthIdx) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const monthName = firstDay?.toLocaleString("default", {
          month: "long",
        });

        return (
          <div key={`${year}-${month}`} className="flex flex-col items-center">
            <h3 className="mb-2 text-[0.8rem] font-medium max-sm:text-[0.8rem]">
              {monthName?.slice(0, 3).toUpperCase()}
            </h3>

            {/* Calendar container with 7 rows (weekdays) */}
            <div className="grid grid-rows-7 gap-1 text-center">
              {weekdays.map((day, rowIdx) => (
                <div key={day} className="flex items-center gap-1">
                  {/* ✅ Weekday label only for the first month */}
                  {monthIdx === 0 && (
                    <div className="h-4 w-4 text-[0.6rem] font-medium text-gray-600 max-sm:h-3 max-sm:w-3">
                      {day[0]}
                    </div>
                  )}

                  {/* Weeks for this weekday */}
                  <div className="flex gap-1">
                    {Array.from({ length: 6 }, (_, weekIdx) => {
                      const date = new Date(year, month, 1);
                      date.setDate(date.getDate() - date.getDay());
                      date.setDate(date.getDate() + weekIdx * 7 + rowIdx);

                      if (date.getMonth() !== month) {
                        return (
                          <div
                            key={`empty-${weekIdx}-${rowIdx}`}
                            className="h-4 w-4 bg-transparent max-sm:h-3 max-sm:w-3"
                          />
                        );
                      }

                      const dateKey = `${date.getFullYear()}-${String(
                        date.getMonth() + 1
                      ).padStart(
                        2,
                        "0"
                      )}-${String(date.getDate()).padStart(2, "0")}`;

                      const pnl = pnlMap[dateKey];
                      const time = timeMap[dateKey];
                      const boxColor = getBoxColor(dateKey);

                      return (
                        <div key={dateKey} className="group relative">
                          <div
                            data-date-key={dateKey}
                            className={`h-4 w-4 max-sm:h-3 max-sm:w-3 ${boxColor} rounded-sm
                        ${dateKey === todayKey ? "border-2 border-black" : ""}
                        ${
                          dateKey in pnlMap
                            ? "cursor-pointer"
                            : "cursor-not-allowed opacity-50"
                        }`}
                            onClick={
                              dateKey in pnlMap
                                ? () => onDateSelect?.(dateKey)
                                : undefined
                            }
                            style={
                              selectedDate === dateKey && dateKey in pnlMap
                                ? {
                                    border: `2px solid ${getBorderColor(boxColor)}`,
                                    background: `${getBorderColor(boxColor)}`,
                                  }
                                : undefined
                            }
                          />

                          {/* Tooltip */}
                          <div
                            className="absolute top-10 z-10 hidden w-max -translate-y-1/2 rounded-md bg-black px-2 py-1 text-[0.65rem] text-white shadow-md group-hover:block"
                            style={{
                              left: (() => {
                                const box = document.querySelector(
                                  `[data-date-key="${dateKey}"]`
                                );
                                if (box) {
                                  const rect = box.getBoundingClientRect();
                                  const screenWidth = window.innerWidth;
                                  // Check if tooltip overflows to the right
                                  if (rect.right + 200 > screenWidth) {
                                    return "-100px"; // Move tooltip to the left
                                  }
                                }
                                return "0"; // Default: show to the right
                              })(),
                            }}
                          >
                            {dateKey in pnlMap ? (
                              pnl === 0 ? (
                                <div>No Trade Day</div>
                              ) : (
                                <div>
                                  Total PnL: {pnl > 0 ? "+" : ""}
                                  {formatNumber(pnl)}
                                </div>
                              )
                            ) : (
                              <div>No Positions Shared</div>
                            )}
                            <div>{formatShortDate(dateKey)}</div>
                            <div>{time != undefined && time}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PnlCalendar;
