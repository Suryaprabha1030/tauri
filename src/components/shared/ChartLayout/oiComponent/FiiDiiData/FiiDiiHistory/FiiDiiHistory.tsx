import { RootState } from "@/lib/redux/Store";
import { formatNumber } from "@/lib/util/DraftUtil";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
interface FiiDiiHistoryProps {
  leftWidth: number;
}
const FiiDiiHistory: React.FC<FiiDiiHistoryProps> = ({ leftWidth }) => {
  const fiiDiiHistoryData = useSelector(
    (state: RootState) => state.FiiDiiData.fiiDiiHistoryList
  );

  const FiiDiiLtpData = useSelector(
    (state: RootState) => state.FiiDiiData.FiiDiiLtpList
  );
  const [tableData, setTableData] = useState({});
  const [LtpData, setLtpData] = useState<any[]>([]);
  const [LtpChgData, setLtpChgData] = useState<any[]>([]);
  const fiiDiiLtpChgData = useSelector(
    (state: RootState) => state.FiiDiiData.fiiDiiLtpChgList
  );
  useEffect(() => {
    setTableData(fiiDiiHistoryData);
    setLtpData(FiiDiiLtpData);
    setLtpChgData(fiiDiiLtpChgData);
  }, [fiiDiiHistoryData]);

  return (
    <div className=" flex h-full w-[100%] flex-col items-center  gap-2 ">
      <h1 className="max-sm:mt-4 max-sm:pl-1 mt-5 max-2xl:w-[90%] 2xl:w-[95%] max-sm:w-[95%] text-start text-[1rem] font-[440]">
        FII/DII History
      </h1>

      <div className="flex max-h-[75%] max-sm:w-[95%] max-2xl:w-[90%] 2xl:w-[95%] justify-center overflow-y-scroll rounded-lg border-2 border-z-blue-200 scrollbar-none ">
        <table className="relative h-[100%] w-full table-fixed rounded-lg border border-blue-200 bg-white">
          <thead className="sticky -top-1 z-10  bg-white">
            <tr className=" sticky  left-0 top-0 z-20 h-[3rem] w-full  border-b-2 border-gray-200 bg-white text-[0.75rem] text-z-gray-300 ">
              <th className="px-2 text-center font-tableHead"></th>
              {leftWidth >= 80 && (
                <th className="px-2 text-center font-tableHead"></th>
              )}

              {leftWidth >= 40 &&
              (<th colSpan={2} className=" px-2 text-center font-tableHead">
                Options
              </th>)}

              {leftWidth >= 40 && (
                <th
                  colSpan={leftWidth >= 50 ? 2 : 1}
                  className=" px-2 text-center font-tableHead"
                >
                  Futures
                </th>
              )}

              <th colSpan={2} className=" px-2 text-center font-tableHead">
                Cash
              </th>
            </tr>

            <tr className="sticky left-0 top-[3rem] z-20 h-[3rem]  w-full border-b-2 border-gray-200 bg-white text-[0.75rem] text-z-gray-300 ">
              <th className=" px-2 max-sm:px-1 text-center font-tableHead">Date</th>
              {leftWidth >= 80 && (
                <th className=" px-2 max-sm:px-1 text-center font-tableHead">NIFTY</th>
              )}
              {leftWidth >= 40 && (
                <>
                <th className=" px-2 max-sm:px-1 text-center font-tableHead">Call OI Chg</th>
                <th className=" px-2 max-sm:px-1 text-center font-tableHead">Put OI Chg</th>
                </>
              )
              }

              {leftWidth >= 40 && (
                <th className=" px-2 text-center font-tableHead">
                  OI Change (Qty)
                </th>
              )}
              {/* <th className=" px-2 text-center font-tableHead">View</th> */}
              {leftWidth >= 50 && (
                <th className=" px-2 text-center font-tableHead">OI</th>
              )}

              <th className=" px-2 text-center font-tableHead">FII Cash</th>
              <th className=" px-2 text-center font-tableHead">DII Cash</th>
            </tr>
          </thead>
          <tbody className="text-[0.75rem]">
            {Object.entries(tableData)?.length > 0 &&
              LtpData.length > 0 &&
              LtpChgData.length > 0 &&
              Object.entries(tableData)
                ?.reverse()
                .map(([key, value]: any[], rowIndex) => {
                  const ltpIndex = LtpData.length - 1 - rowIndex;
                  const ltpChgIndex = LtpChgData.length - 1 - rowIndex;
                  return (
                    <tr
                      className={`h-10 w-full border-b border-gray-200 bg-white text-[0.8rem] max-sm:text-[0.65rem]   text-black `}
                      key={rowIndex}
                    >
                      <td className="   text-center ">
                        {value?.date?.replace(/-/g, " ")}
                      </td>
                      {leftWidth >= 80 && (
                        <td className="px-2 text-center">
                          <div className="flex xl:max-2xl:flex-col  items-center justify-center 2xl:gap-1  ">
                            <span>{formatNumber(LtpData[ltpIndex])}</span>
                            <span
                              className={
                                LtpChgData[ltpIndex] >= 0
                                  ? "text-green-500"
                                  : "text-red-400"
                              }
                            >
                              ({LtpChgData[ltpChgIndex]?.toFixed(2)}%)
                            </span>
                          </div>
                        </td>
                      )}

                      {leftWidth >= 40 && (
                        <>
                        <td className=" px-2 text-center ">
                        <div className="flex xl:max-2xl:flex-col  h-full flex-row items-center justify-center  2xl:gap-1 ">
                          <span>
                            {formatNumber(
                              value?.optionsfutures?.options_call_oi_chg
                            )}
                          </span>
                          {leftWidth >= 80 && (
                            <span className="font-[500] text-gray-400">
                              (
                              <span
                                className={`${
                                  value?.optionsfutures?.options_call_oi_chg > 0
                                    ? "text-z-green-500"
                                    : "text-red-400"
                                }`}
                              >
                                {value?.optionsfutures?.options_call_oi_chg > 0
                                  ? "Bullish"
                                  : "Bearish"}
                              </span>
                              )
                            </span>
                          )}
                        </div>
                      </td>
                      <td className=" px-2 text-center">
                        <div className="flex xl:max-2xl:flex-col h-full flex-row items-center justify-center  2xl:gap-1">
                          <span>
                            {formatNumber(
                              value?.optionsfutures?.options_put_oi_chg
                            )}
                          </span>
                          {leftWidth >= 80 && (
                            <span className="font-[500] text-gray-400">
                              (
                              <span
                                className={`  ${
                                  value?.optionsfutures?.options_put_oi_chg < 0
                                    ? "text-z-green-500"
                                    : "text-red-400"
                                }`}
                              >
                                {value?.optionsfutures?.options_put_oi_chg < 0
                                  ? "Bullish"
                                  : "Bearish"}
                              </span>
                              )
                            </span>
                          )}
                        </div>
                      </td>
                    </>
                  )}

                      {leftWidth >= 40 && (
                        <td className={` px-2 text-center `}>
                          {formatNumber(
                            value?.optionsfutures?.futures_oi_change_qty
                          )}
                        </td>
                      )}

                      {/* <td
                        className={`px-2 text-center font-[500] ${value?.optionsfutures?.futures_view == "Bearish" ? "text-red-400" : "text-z-green-500"}`}
                      >
                        {value?.optionsfutures?.futures_view}
                      </td> */}

                      {leftWidth >= 50 && (
                        <td className="  px-2 text-center">
                          {formatNumber(value?.optionsfutures?.futures_oi)}
                        </td>
                      )}

                      <td className=" px-2 text-center ">
                        <div className="flex xl:max-2xl:flex-col h-full flex-row items-center justify-center 2xl:gap-1">
                          <span>{formatNumber(value?.cash?.fii_cash)}</span>
                          {leftWidth >= 80 && (
                            <span className="font-[500] text-gray-400">
                              (
                              <span
                                className={`${
                                  value?.cash?.fii_cash > 0
                                    ? "text-z-green-500"
                                    : "text-red-400"
                                }`}
                              >
                                {value?.cash?.fii_cash > 0
                                  ? "Bullish"
                                  : "Bearish"}
                              </span>
                              )
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="  px-2 text-center">
                        {formatNumber(value?.cash?.dii_cash)}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FiiDiiHistory;
