import { getImageUrl } from "@/lib/util/brokersUtil/BrokersImage";

import React from "react";
import BuySellDisplay from "./ChartLayout/sidetoolbar/Strategies Analyzer/StrategyAnalyzerTableBody/BuySellDisplay";
import { formatNumber } from "@/lib/util/DraftUtil";
import Logo from "./logo/logo";

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "p-4",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-b border-gray-100 ${className}`}>{children}</div>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold text-gray-900">{children}</h2>;
}

export function CardContent({
  children,
  className = "p-4",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function Button({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "outline";
  className?: string;
}) {
  const baseStyle =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline:
      "border border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500",
  };
  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function ScrollArea({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-y-auto scrollbar scrollbar-thin ${className}`}>
      {children}
    </div>
  );
}

export function HeaderBar({
  currentBrokerName,
  userName,
}: {
  currentBrokerName: string;
  userName: string;
}) {
  return (
    <div className="fixed sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white  shadow-sm">
      <span className="flex flex-row items-center  max-sm:min-w-[11rem] max-sm:justify-start max-sm:px-2 xl:min-w-[13rem] xl:justify-center">
        <Logo height={48} width={160} />
        <span className="flex items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-blue-500 font-semibold uppercase text-white hover:from-pink-500 hover:to-yellow-500 max-xl:absolute max-md:top-[0.6rem] max-md:px-[0.1rem] max-md:text-[0.4rem] max-sm:left-[8.1rem] max-sm:h-[0.5rem] max-sm:px-1 sm:max-lg:px-1 sm:max-md:left-[8.6rem] sm:max-md:py-[0.1rem] md:max-xl:top-[0.4rem] md:max-xl:text-[0.5rem] md:max-lg:left-[10rem] lg:max-xl:left-[9.7rem] lg:max-xl:px-1 xl:px-1 xl:py-1 xl:max-2xl:text-[0.65rem] 2xl:text-xs">
          <div className="flex  grid-cols-2 items-center justify-center  max-sm:gap-[0.1rem] sm:gap-1 xl:gap-0">
            <div className="col-span-1 sm:max-md:pt-[0.1rem]">Beta</div>
            <div className="xl:col-span-1">
              <svg
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="max-sm:h-2 max-sm:w-2 sm:max-xl:h-3 sm:max-xl:w-3 sm:max-xl:pt-[0.1rem] xl:h-4 xl:w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                />
              </svg>
            </div>
          </div>
        </span>
      </span>

      <div className="flex w-[20rem] flex-col items-center pt-3 ">
        <div className="flex flex-row items-center gap-1">
          <img src="/svg/shield.svg" height={20} width={20} alt="" />
          <span className="text-lg font-medium italic text-gray-500">
            Verified by Zoonest
          </span>
        </div>
      </div>
    </div>
  );
}

export function PLTable({
  pl,
  date,
  historyData,
  isNoTradeDay,
}: {
  pl: any;
  date: string;
  historyData: any;
  isNoTradeDay: boolean;
}) {
  return (
    <Card className="mt-4 min-h-[13rem] shadow-strong-top">
      <CardHeader className="flex  flex-row items-center justify-between px-4 py-2">
        <div className="flex flex-col items-start gap-2 text-zinc-600">
          <span className="text-sm">
            {isNoTradeDay
              ? "#No Trade Day verified by Zoonest"
              : "P&L verified by Zoonest"}
          </span>
          <div className="m text-sm text-gray-600">
            Taken @ <span className="font-medium text-gray-900">{date}</span>
          </div>
        </div>
        {!isNoTradeDay && (
          <div className="text-center text-sm text-gray-700">
            <div className="font-medium">Total P&amp;L</div>
            <div
              className={`text-2xl font-semibold ${pl > 0 ? "text-z-green-500" : pl < 0 ? "text-red-400" : "text-gray-500"}`}
            >
              {pl > 0 ? `+${pl}` : pl}
            </div>
          </div>
        )}
      </CardHeader>
      <div className="p-4">
        <div className="">
          {!isNoTradeDay ? (
            <div className="overflow-x-auto  p-0">
              <table className="w-full table-auto overflow-y-auto scrollbar scrollbar-thin">
                <thead>
                  <tr className="h-7  text-left text-[0.75rem] uppercase text-black">
                    <th className="px-1 py-2 font-tableHead">Symbol</th>
                    <th className="px-1 py-2 text-center font-tableHead">
                      Qty
                    </th>
                    <th className="px-1 py-2 text-center font-tableHead max-sm:hidden">
                      Avg
                    </th>
                    <th className="px-1 py-2 text-center font-tableHead max-sm:hidden">
                      LTP
                    </th>
                    <th className="px-1 py-2 text-center font-tableHead">
                      P&l
                    </th>
                    <th className="px-1 py-2 text-center font-tableHead">
                      B/S
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historyData &&
                    historyData?.data?.map((item: any, index: number) => (
                      <tr
                        key={index}
                        className={`h-7 border-b text-[0.68rem] font-table md:max-2xl:text-standard 2xl:text-global ${
                          item?.transaction_type.toUpperCase() === "EXITED"
                            ? "text-gray-500"
                            : ""
                        }`}
                      >
                        <td className="px-1 py-2">
                          {item?.display_symbol_name}
                        </td>
                        <td className="px-1 py-2 text-center">
                          {item?.quantity}
                        </td>
                        <td className="px-1 py-2 text-center max-sm:hidden">
                          {formatNumber(item?.avg_net_price)}
                        </td>
                        <td className="px-1 py-2 text-center max-sm:hidden">
                          {formatNumber(item?.ltp)}
                        </td>
                        <td
                          className={`px-1 py-2 text-center ${
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
                        <td className="px-1 py-2 text-center">
                          {["SELL", "SHORT", "BUY", "LONG"].includes(
                            item?.transaction_type,
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
            </div>
          ) : (
            <div className="flex items-center justify-center text-xl font-semibold">
              No Trade Day
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
