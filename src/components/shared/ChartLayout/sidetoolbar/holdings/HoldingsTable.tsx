import { RootState } from "@/lib/redux/Store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatNumber } from "@/lib/util/DraftUtil";
import { useRouter } from "next/navigation";
import { handleTVChart } from "@/lib/util/sideToolBar/sidetoolbarCommon";
import Image from "next/image";
import CandleIcon from "../../optionFutures/CandleIcon";
import { getBrokerCode } from "@/components/helpers";
import {
  setChartIconClicked,
  setChartPanel,
} from "@/lib/redux/slices/ChartsSlice";
interface HoldingsTableProps {
  dataholding: any[];
  leftWidth: number;
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({
  dataholding,
  leftWidth,
}) => {
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  const netchange: any = useSelector(
    (state: RootState) => state.strategy.netChange
  );
  const netpercentage: any = useSelector(
    (state: RootState) => state.strategy.netChangepercent
  );
  const path = window.location.pathname;
  const router = useRouter();
  const brokerCode = getBrokerCode();
  const dispatch = useDispatch();
  const handleChart = (index: any, identifier: any, filter: any) => {
    dispatch(setChartIconClicked(false));
    handleTVChart(
      index,
      filter,
      path,
      router,
      dispatch,
      brokerCode,
      identifier
    );
  };
  return (
    <tbody className="divide-y divide-gray-200 max-md:overflow-y-auto max-md:scrollbar-none ">
      {dataholding.map((holding, index) => (
        <tr
          key={holding?.identifier}
          className={`group  text-center  font-table hover:bg-gray-100 md:text-global xl:max-2xl:text-standard`}
        >
          <td className="whitespace-nowrap  text-left text-black max-xl:w-[10rem] max-xl:px-1 max-md:py-1 max-md:text-[0.65rem] md:max-xl:py-4 xl:w-[12rem] xl:px-5 xl:py-2">
            <div className=" relative flex flex-row gap-2 md:max-2xl:items-center xl:w-[12rem]">
              <span> {holding.symbol}</span>
              <span className="flex h-3 items-center justify-center whitespace-nowrap rounded-sm border-gray-200 bg-blue-100 px-[0.3rem] text-center text-[0.5rem] text-indigo-600 max-sm:px-[1px]">
                {holding.exchange}
              </span>

              <CandleIcon
                className="absolute right-0 flex    cursor-pointer items-center justify-center rounded border bg-gray-100  opacity-0 group-hover:opacity-100 max-sm:h-5 max-sm:w-5 md:h-[1.4rem] md:w-6"
                onClick={() =>
                  handleChart(index, holding?.identifier, "holdings")
                }
              />
            </div>
          </td>
          <td
            className={`h-full w-full whitespace-nowrap  text-right text-black max-md:py-1 max-md:text-[0.65rem] md:max-xl:py-4 xl:w-[4rem] xl:px-2 xl:max-2xl:py-4 2xl:w-[6rem] 2xl:py-2`}
          >
            <div className="flex w-full items-center justify-end gap-1 md:max-xl:mt-2">
              {holding.collateral_quantity ? (
                <div className="flex h-4 w-10 items-center justify-center rounded-sm border border-gray-200 bg-gray-200 px-[0.2rem] text-[0.6rem]">
                  {holding.collateral_type === "pledge" ? "P:" : ""}
                  {holding.collateral_quantity}
                </div>
              ) : null}

              {holding.t1quantity != null && holding.t1quantity > 0 ? (
                <div className="flex h-4 min-w-10 items-center justify-center rounded-sm border border-gray-200 bg-gray-200 px-[0.2rem] text-[0.6rem]">
                  T1:{holding.t1quantity}
                </div>
              ) : null}

              <div className="w-[3rem] py-2 text-right max-sm:py-5 sm:max-md:py-6">
                {holding.quantity}
              </div>
            </div>
          </td>

          <td
            className={`w-[5rem] whitespace-nowrap text-right text-right text-black max-xl:px-0.5 max-md:py-1 max-md:text-[0.65rem] md:max-xl:py-4 xl:px-2 xl:py-2 xl:max-2xl:w-[4rem] ${leftWidth < 40 ? "xl:max-2xl:hidden" : ""}`}
          >
            {formatNumber(holding.average_price)}
          </td>
          <td
            className={`w-[7rem] whitespace-nowrap text-right text-black max-xl:px-0.5 max-md:py-1 ${leftWidth < 40 ? "xl:max-2xl:hidden" : ""} max-md:text-[0.65rem] md:max-xl:py-4 xl:px-2 xl:py-2 xl:max-2xl:w-[4rem] 2xl:w-[5rem] `}
          >
            {formatNumber(webSocketDataRead[holding.identifier])}
          </td>
          <td
            className={`w-[7rem] whitespace-nowrap  px-0 text-right text-black max-md:text-[0.65rem] max-sm:py-2  ${leftWidth > 45 ? "flex-row gap-2 pr-2 max-xl:items-center max-xl:justify-center" : "flex w-full flex-col items-end justify-end text-right"} sm:max-md:mb-[0.8rem] sm:max-md:h-full md:max-xl:py-4  xl:py-3  xl:max-2xl:w-[4rem] 2xl:w-[5rem]
    ${
      holding.profit_and_loss > 0
        ? "text-z-green-500"
        : holding.profit_and_loss < 0
          ? "text-red-400"
          : "text-gray-500"
    }`}
          >
            {holding.profit_and_loss !== undefined &&
              (() => {
                const pnl = Number(holding?.profit_and_loss);
                const formatted =
                  leftWidth >= 80 ? pnl?.toFixed(2) : formatNumber(pnl);
                return pnl > 0 ? `+${formatted}` : formatted;
              })()}

            <span className="pl-1 text-[0.65rem]">
              ({formatNumber(holding.profit_and_loss_percent)}%)
            </span>
          </td>

          {leftWidth >= 80 && (
            <td className=" w-[7rem] gap-1 whitespace-nowrap  px-3  py-2 text-right text-black  2xl:w-[5rem]">
              <span
                className={` ${
                  netchange[holding.identifier] > 0
                    ? "text-z-green-500"
                    : netchange[holding.identifier] < 0
                      ? "text-red-400"
                      : "text-gray-500"
                }`}
              >
                {netchange[holding.identifier] > 0
                  ? `+${formatNumber(netchange[holding.identifier])}`
                  : formatNumber(netchange[holding.identifier] || 0)}
              </span>
              <span
                className={`text-[0.65rem] ${
                  netpercentage[holding.identifier] > 0
                    ? "text-z-green-500"
                    : netpercentage[holding.identifier] < 0
                      ? "text-red-400"
                      : "text-gray-500"
                }`}
              >
                {" "}
                (
                {netpercentage[holding.identifier]
                  ? netpercentage[holding.identifier].toFixed(2)
                  : "0.00"}
                %)
              </span>
            </td>
          )}
        </tr>
      ))}
    </tbody>
  );
};

export default HoldingsTable;
