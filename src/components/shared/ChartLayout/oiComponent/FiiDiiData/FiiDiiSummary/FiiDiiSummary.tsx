import { RootState } from "@/lib/redux/Store";

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { formatNumber } from "@/lib/util/DraftUtil";

interface FiiDiiSummaryProps {
  leftwidth: number;
}

const FiiDiiSummary: React.FC<FiiDiiSummaryProps> = ({ leftwidth }) => {
  const fiiDiiHistoryData = useSelector(
    (state: RootState) => state.FiiDiiData.datewiseSummaryList,
  );
  const [tableData, setTableData] = useState<any>({});

  const [date, setDate] = useState(() => {
    const keys = Object.keys(tableData);
    return keys.length && keys[keys.length - 1];
  });

  const [expandedSegments, setExpandedSegments] = useState<
    Record<string, boolean>
  >({});
  const [openKey, setOpenKey] = useState(null);

  useEffect(() => {
    if (fiiDiiHistoryData != null) {
      setTableData(fiiDiiHistoryData);
      setDate(() => {
        const keys = Object.keys(fiiDiiHistoryData);
        return keys.length && keys[keys.length - 1];
      });
    }
  }, [fiiDiiHistoryData]);

  function getSentimentLabel(netOi:any, percentChange:any) {
    if (Math.abs(netOi) < 5000 || Math.abs(percentChange) < 1) {
      return "Neutral";
    }

    if (netOi > 0) {
      if (percentChange > 20) {
        return "Strong Bullish";
      } else if (percentChange > 10) {
        return "Medium Bullish";
      } else {
        return "Mild Bullish";
      }
    } else {
      if (percentChange > 20) {
        return "Strong Bearish";
      } else if (percentChange > 10) {
        return "Medium Bearish";
      } else {
        return "Mild Bearish";
      }
    }
  }

  const toggleOpen = (key:any) => {
    setOpenKey((prev) => (prev === key ? null : key));
  };
  const getSentiment = (netOi: number, change: number) => {
    if (netOi > 50000 && change > 50000)
      return { label: "Strong Bullish", color: "bg-green-600" };
    if (netOi > 0 && change > 20000)
      return { label: "Medium Bullish", color: "bg-green-500" };
    if (netOi < 0 && change < -50000)
      return { label: "Medium Bearish", color: "bg-red-500" };
    if (netOi < 0 && change < -20000)
      return { label: "Mild Bearish", color: "bg-red-300" };
    return { label: "Indecisive", color: "bg-gray-300" };
  };

  const toggleSegment = (participant: string, segment: string) => {
    const key = `${participant}-${segment}`;
    setExpandedSegments((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const getRowSpan = (segments: any, participant: string) => {
    let rowCount = 0;

    Object.entries(segments).forEach(([segmentKey, data]: any) => {
      rowCount += 1;
      if (
        segmentKey === "index_options" &&
        expandedSegments[`${participant}-${segmentKey}`]
      ) {
        if (data?.call_options) rowCount += 1;
        if (data?.put_options) rowCount += 1;
      }
    });

    return rowCount;
  };
  const formatTitle = (str: string) => {
    return str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const handleDropdownChange = (selectedKey: string) => {
    setDate(selectedKey);
    setIsOpen(false);
  };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mt-5 flex h-[100%] w-full flex-col items-start justify-start gap-2 2xl:pl-10">
      <div
        ref={dropdownRef}
        className="relative max-sm:w-[95%] max-2xl:w-[90%] 2xl:w-[95%]  max-2xl:mx-auto"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className=" flex flex-row gap-2 rounded-md border border-gray-300 bg-white px-1 py-1 text-left text-[0.75rem]   shadow-sm"
        >
          {date?.toString()?.replace(/-/g, " ")}
          <img src={"/svg/downChevron.svg"} alt="" width={16} height={16} />
        </button>

        {isOpen && (
          <ul className="absolute z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white  text-[0.75rem]   shadow-lg shadow-md scrollbar-none">
            {Object.keys(tableData)
              .reverse()
              .map((option) => (
                <li
                  key={option}
                  onClick={(e) => handleDropdownChange(option)}
                  className={`cursor-pointer px-4 py-1  ${
                    date === option
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                >
                  {option?.toString()?.replace(/-/g, " ")}
                </li>
              ))}
          </ul>
        )}
      </div>
      <div className="relative flex max-h-[75%] max-sm:w-[95%] max-2xl:w-[90%] 2xl:w-[95%] flex-1 justify-center overflow-y-scroll rounded-lg border-2 border-z-blue-200 scrollbar-none  max-2xl:mx-auto ">
        <table className=" w-full table-fixed rounded-lg border border-blue-200 bg-white">
          <thead className="sticky -top-1 z-10 bg-white">
            <tr className="  h-[2rem] w-full  border-2 border-gray-200 bg-white text-[0.75rem] text-z-gray-300 ">
              <th className="px-2 text-center font-tableHead">Participant</th>
              <th className="px-2 text-center font-tableHead">Segment</th>
              <th className=" px-2 text-center font-tableHead">Net OI</th>
              {leftwidth >= 40 && (
                <th className=" px-2 text-center font-tableHead">Change</th>
              )}
            </tr>
          </thead>
          <tbody className="text-[0.8rem] max-sm:text-[0.65rem] border-2">
            {tableData &&
              tableData[date] &&
              Object.entries(tableData).length > 0 &&
              Object.entries(tableData[date])?.map(
                ([participant, segments]: any) => {
                  const rowSpan = getRowSpan(segments, participant);
                  let isFirstSegmentRow = true;

                  return Object.entries(segments).map(
                    ([segmentKey, data]: any) => {
                      const isIndexOptions = segmentKey === "index_options";
                      const key = `${participant}-${segmentKey}`;
                      const sentiment = getSentiment(
                        data?.net_oi,
                        data?.change,
                      );

                      return (
                        <React.Fragment key={key}>
                          <tr className="h-10 border">
                            {isFirstSegmentRow && (
                              <td
                                className=" border-r border-gray-200 px-2 text-center font-semibold capitalize "
                                rowSpan={rowSpan}
                              >
                                {participant}
                              </td>
                            )}
                            <td
                              className="flex h-10 cursor-pointer flex-row items-center justify-center max-md:text-left border-r border-gray-200  px-2 text-center"
                              onClick={() =>
                                isIndexOptions &&
                                toggleSegment(participant, segmentKey)
                              }
                            >
                              <div className="flex w-[7rem] items-center justify-start gap-2  ">
                                {formatTitle(segmentKey)}
                                {isIndexOptions && (
                                  <span className="inline text-xs text-gray-500">
                                    <img
                                      src={
                                        expandedSegments[key]
                                          ? "/svg/upChevron.svg"
                                          : "/svg/downChevron.svg"
                                      }
                                      alt=""
                                      width={16}
                                      height={16}
                                    />
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="border-r border-gray-200  px-2 text-center">
                              {formatNumber(data?.net_oi)}
                            </td>
                            {leftwidth >= 40 && (
                              <td className="border-r border-gray-200 px-2 text-center">
                                {formatNumber(data?.change)}
                              </td>
                            )}
                          </tr>

                          {isIndexOptions &&
                            expandedSegments[key] &&
                            ["call_options", "put_options"].map((opt) => {
                              const optionData = data?.[opt];
                              if (!optionData) return null;

                              const optionSentiment = getSentiment(
                                optionData.net_oi,
                                optionData.change,
                              );

                              return (
                                <tr
                                  key={`${key}-${opt}`}
                                  className="border-t bg-gray-50"
                                >
                                  <td className="border-r border-gray-200  text-center capitalize">
                                    {formatTitle(opt)}
                                  </td>

                                  <td className="border-r border-gray-200  p-2 text-center">
                                    {formatNumber(optionData.net_oi)}
                                  </td>
                                  {leftwidth >= 40 && (
                                    <td className="p-2 text-center">
                                      {formatNumber(optionData.change)}
                                    </td>
                                  )}
                                </tr>
                              );
                            })}

                          {/* Set flag false so it doesn't render Participant name again */}
                          {(isFirstSegmentRow = false)}
                        </React.Fragment>
                      );
                    },
                  );
                },
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FiiDiiSummary;
