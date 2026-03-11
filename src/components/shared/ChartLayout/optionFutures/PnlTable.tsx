import { formatExpiryDate } from "@/lib/util/DateUtil";
import React, { useEffect } from "react";
import DisplayHandleSellButton from "../buySellButton/DisplayHandleSellButton";
import TabEmptyInfo from "./emptyInfo/TabEmptyInfo";

interface OptionData {
  identifier: string;
  target_pnl: number;
  transaction_type: string;
  option_type: string;
  target_premium: number;
  ltp: number;
  target_entry_price: number;
  lots: number;
  lot_size: number;
  expiry: string;
  strike_price: number;
}

interface PnlTableProps {
  targetPayoffdata: OptionData[]; // Pass the data as props
  showlot: boolean;
}

const PnlTable: React.FC<PnlTableProps> = ({ targetPayoffdata, showlot }) => {
  const calculateTotals = (field: keyof OptionData) => {
    const longSum = targetPayoffdata
      .filter((item: any) => item.transaction_type === "LONG")
      .reduce(
        (acc: any, item: any) =>
          acc + (showlot ? item[field] * item.lot_size : item[field]),
        0
      );

    const shortSum = targetPayoffdata
      .filter((item: any) => item.transaction_type === "SHORT")
      .reduce(
        (acc: any, item: any) =>
          acc + (showlot ? item[field] * item.lot_size : item[field]),
        0
      );

    const result = longSum > shortSum ? longSum - shortSum : shortSum - longSum;
    return longSum >= shortSum ? result.toFixed(2) : `-${result.toFixed(2)}`;
  };

  const totalTargetPnl: any = targetPayoffdata.reduce(
    (acc, item) => acc + item.target_pnl,
    0
  );
  const totalTargetPremium: any = calculateTotals("target_premium");
  const totalEntryPrice: any = calculateTotals("target_entry_price");
  const totalLtp: any = calculateTotals("ltp");

  return (
    <div className="flex h-[95%] w-full flex-col items-center justify-start gap-2 ">
      {targetPayoffdata && Object.entries(targetPayoffdata).length > 0 ? (
        <div
          className={`max-h-[90%] w-full overflow-y-scroll   max-xl:scrollbar-none max-sm:max-h-[11rem] sm:max-xl:max-h-[23rem] xl:scrollbar-thin xl:scrollbar-track-gray-100 xl:scrollbar-thumb-z-br-gray`}
        >
          <table className="w-full overflow-y-auto border-2 border-z-blue-100 text-center text-[0.5rem] xl:shadow-lg">
            <thead className="sticky -top-1 z-[11] bg-gray-50 text-[0.68rem] uppercase max-sm:w-full max-sm:text-[0.58rem]">
              <tr className="h-7 border-b text-[0.68rem] text-z-gray-300 max-sm:w-full max-sm:px-1 max-sm:text-[0.58rem]">
                <th
                  scope="col"
                  className="font-tableHead max-sm:w-[35%] max-sm:py-[0.35rem] sm:max-md:py-[0.45rem] md:max-xl:py-[0.6rem] xl:px-1 xl:py-[0.1rem] xl:max-2xl:my-[0.6rem] xl:max-2xl:w-[30%] "
                >
                  Expiry
                </th>
                <th
                  scope="col"
                  className="font-tableHead max-sm:w-[12rem] max-sm:px-0.5 max-sm:py-[0.35rem] sm:max-md:py-[0.45rem] md:max-xl:py-[0.6rem] xl:px-1 xl:py-[0.1rem] xl:max-2xl:my-[0.6rem] "
                >
                  Strike Price
                </th>
                <th
                  scope="col"
                  className="font-tableHead max-sm:w-[12rem] max-sm:px-0.5 max-sm:py-[0.35rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:px-1 xl:py-[0.1rem] "
                >
                  Target P&L
                </th>
                <th
                  scope="col"
                  className="font-tableHead max-sm:w-[12rem] max-sm:px-0.5 max-sm:py-[0.35rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:px-1 xl:py-[0.1rem]"
                >
                  Target Price
                </th>
                <th
                  scope="col"
                  className="px-1 py-[0.1rem] font-tableHead max-md:hidden md:max-2xl:py-[0.6rem] "
                >
                  Entry Price
                </th>
                <th
                  scope="col"
                  className="px-1 py-[0.1rem] font-tableHead max-md:hidden md:max-2xl:py-[0.6rem] "
                >
                  LTP
                </th>
                <th
                  scope="col"
                  className="font-tableHead max-sm:w-[3rem] max-sm:px-0.5 max-sm:py-[0.35rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:px-1 xl:py-[0.1rem] "
                >
                  B/S
                </th>
              </tr>
            </thead>
            <tbody>
              {targetPayoffdata.map((item, index) => {
                // Calculate the values based on showlot
                const targetPremium = showlot
                  ? item.target_premium * item.lot_size
                  : item.target_premium;
                const targetEntryPrice = showlot
                  ? item.target_entry_price * item.lot_size
                  : item.target_entry_price;
                const ltp = showlot ? item.ltp * item.lot_size : item.ltp;

                return (
                  <tr
                    key={index}
                    className="h-7 border-b text-[0.78rem] font-table max-sm:w-full max-sm:px-1 max-sm:text-[0.58rem]"
                  >
                    <td className="flex flex-row items-center justify-center  max-sm:w-full max-sm:gap-1 max-sm:py-[0.35rem] sm:max-xl:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:px-1 2xl:gap-2 2xl:py-[0.1rem]">
                      <div className="">{item.lots}x</div>
                      <div className="">{formatExpiryDate(item.expiry)}</div>
                      <div className="inline-flex h-5 w-7 items-center justify-center rounded-xl border border-2 ">
                        <div className="flex h-5 w-5 items-center justify-center text-center  text-black">
                          {item.option_type}
                        </div>
                      </div>
                    </td>
                    <td className=" max-sm:w-[12rem] max-sm:px-0.5 max-sm:py-[0.35rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:py-[0.1rem] xl:max-2xl:w-[10%] xl:max-2xl:w-[10%] 2xl:px-1">
                      {item.strike_price}
                    </td>
                    <td
                      className={`text-center max-sm:w-[12rem] max-sm:px-0.5 max-sm:py-[0.35rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:py-[0.1rem] 2xl:px-1 ${
                        item.target_pnl > 0
                          ? "text-z-green-500"
                          : item.target_pnl < 0
                            ? "text-red-400"
                            : "text-gray-500"
                      }`}
                    >
                      {item.target_pnl?.toFixed(2)}
                    </td>
                    <td className="text-center max-sm:w-[12rem] max-sm:px-0.5 max-sm:py-[0.35rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:px-1 xl:py-[0.1rem]">
                      {targetPremium?.toFixed(2)}
                    </td>
                    <td className="text-center px-1 py-[0.1rem] max-md:hidden xl:max-2xl:py-[0.6rem]">
                      {targetEntryPrice?.toFixed(2)}
                    </td>
                    <td className="text-center px-1 py-[0.1rem] max-md:hidden xl:max-2xl:py-[0.6rem]">
                      {ltp?.toFixed(2)}
                    </td>
                    <td className="whitespace-nowrap max-sm:w-[2rem] max-sm:px-0.5 max-sm:py-[0.35rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:px-1 xl:py-[0.1rem]">
                      <DisplayHandleSellButton type={item.transaction_type} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="h-7 border-t text-[0.78rem] font-table max-sm:text-[0.58rem] sm:max-md:h-[2.5rem] md:max-xl:h-[3rem]">
                <td className="px-1 py-[0.1rem] "></td>
                <td className="font-medium max-sm:px-0.5 max-sm:py-[0.25rem] xl:px-1 xl:max-2xl:py-[0.6rem] 2xl:py-[0.1rem]">
                  Total (Projected)
                </td>
                <td
                  className={`max-sm:px-0.5 max-sm:py-[0.25rem] xl:px-1 xl:max-2xl:py-[0.6rem] 2xl:py-[0.1rem] ${
                    totalTargetPnl > 0
                      ? "text-z-green-500"
                      : totalTargetPnl < 0
                        ? "text-red-400"
                        : "text-gray-500"
                  }`}
                >
                  {totalTargetPnl.toFixed(2)}
                </td>
                <td className="max-sm:px-0.5 max-sm:py-[0.25rem] xl:px-1 xl:max-2xl:py-[0.6rem] 2xl:py-[0.1rem]">
                  {totalTargetPremium}
                </td>
                <td className="px-1 py-[0.1rem] max-md:hidden xl:max-2xl:py-[0.6rem]">
                  {totalEntryPrice}
                </td>
                <td className="px-1 py-[0.1rem] max-md:hidden xl:max-2xl:py-[0.6rem] ">
                  {totalLtp}
                </td>
                <td className="max-sm:px-0.5 max-sm:py-[0.25rem] xl:px-1 xl:max-2xl:py-[0.6rem] 2xl:py-[0.1rem]"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      ) : (
        <TabEmptyInfo name="No P&L  Available" />
      )}
    </div>
  );
};

export default PnlTable;
