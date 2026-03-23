import { RootState } from "@/lib/redux/Store";

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CardSlidder from "./CardSlidder";
import { formatNumber } from "@/lib/util/DraftUtil";

interface ChartCardProps {}

interface cards {
  label: string;
  profitPoints: number | string;
  fontColor: string;
  lossPercent?: any;
  profitPercent?: any;
}
const ChartCards: React.FC<ChartCardProps> = ({}) => {
  const FundsDataRedux: any = useSelector(
    (state: RootState) => state.strategy.fundsData
  );

  const cardRef = useRef(null);
  const [profitPercent, setProfitPercent] = useState<number | null>();
  const [lossPercent, setlossPercent] = useState<number | null>();

  const margin = useSelector((state: RootState) => state.PayoffChart.margin);
  const PAndL: any = useSelector(
    (state: RootState) => state.PayoffChart.cardResultData
  );
  const Payoffstrategy = useSelector(
    (state: RootState) => state.Screener.PayoffStrategyName
  );
  const formatValue = (value: any) => {
    return typeof value === "number" ? formatNumber(value) : value;
  };

  const cardsSwipe: cards[] = [
    {
      label: "Max Profit",
      profitPoints: formatValue(PAndL?.max_profit),
      profitPercent:
        profitPercent != null && isFinite(profitPercent)
          ? formatNumber(profitPercent)
          : null,

      fontColor:
        typeof PAndL?.max_profit == "string"
          ? "text-gray-500"
          : PAndL?.max_profit == 0
            ? "text-gray-500"
            : PAndL?.max_profit > 0
              ? "text-green-500"
              : "text-red-500",
    },
    {
      label: "Max Loss",
      profitPoints: formatValue(PAndL?.max_loss),
      lossPercent:
        lossPercent != null && isFinite(lossPercent)
          ? formatNumber(lossPercent)
          : null,

      fontColor:
        PAndL?.max_loss == "string"
          ? "text-gray-500"
          : PAndL?.max_loss == 0
            ? "text-gray-500"
            : PAndL?.max_loss > 0
              ? " text-green-500"
              : " text-red-500",
    },
    {
      label: "Breakeven Points",
      profitPoints:
        PAndL?.breakeven_points?.length > 1
          ? `${PAndL?.breakeven_points[0]}-${PAndL?.breakeven_points[1]}`
          : PAndL?.breakeven_points[0],
      fontColor: "text-zinc-900",
    },
    {
      label: "Funds Needed",
      profitPoints: formatNumber(margin),
      fontColor: "text-zinc-900",
    },

    {
      label: "Available Margin",
      profitPoints:
        FundsDataRedux &&
        FundsDataRedux?.net_amount &&
        formatNumber(FundsDataRedux.net_amount),
      fontColor: " text-zinc-900",
    },
  ];
  // Number of cards to show at once

  useEffect(() => {
    setProfitPercent(null);
    setlossPercent(null);
    const calculatePercentge = (profit:any, funds:any) => {
      if (isNaN(profit) || funds == 0) {
        return null;
      } else {
        if (funds != 0) {
          const profitspercent = (profit / funds) * 100;
          return profitspercent;
        }
      }
      return;
    };

    const profitPercent = calculatePercentge(PAndL?.max_profit, margin);
    const lossPercent = calculatePercentge(PAndL?.max_loss, margin);
    setProfitPercent(profitPercent);
    setlossPercent(lossPercent);
  }, [PAndL, margin]);

  return (
    <div
      className={`flex w-full items-center ${Payoffstrategy ? "justify-center" : "justify-between  xl:border-r-[0.01rem]"} px-2 max-xl:flex-col-reverse max-sm:mb-4 max-sm:mt-4 sm:max-md:gap-[1rem] sm:max-md:pt-[1rem] md:max-xl:gap-[1rem] md:max-xl:pt-[2.5rem] xl:flex-row xl:border-b-[0.01rem] xl:border-z-gray-200 xl:max-2xl:gap-[0.2rem] 2xl:gap-[0.5rem]`}
      ref={cardRef}
    >
      <div className=" mr-2 flex w-[100%] flex-row items-center justify-center  gap-2 pt-1 max-xl:hidden xl:max-2xl:w-[100%]">
        <div className="flex h-11 w-[8.5rem]  flex-col items-center justify-center gap-[0.05rem] rounded-2xl bg-white ">
          <div className="text-[0.65rem]  text-z-gray-300  ">
            Breakeven Points
          </div>
          <div className="text-[0.8rem] font-semibold  text-zinc-900">
            {PAndL?.breakeven_points?.length > 1
              ? `${PAndL?.breakeven_points[0]}-${PAndL?.breakeven_points[1]}`
              : PAndL?.breakeven_points[0] == 0
                ? "-"
                : PAndL?.breakeven_points[0]}
          </div>
        </div>
        <div className="flex h-11 w-[8.5rem]  flex-col items-center justify-center gap-[0.05rem] rounded-2xl bg-white">
          <div className="text-[0.65rem]  text-z-gray-300 max-sm:pt-2">
            Max Profit
          </div>
          <div
            className={`flex flex-row items-center gap-1 text-[0.8rem] font-semibold ${
              typeof PAndL?.max_profit == "string"
                ? "text-gray-500"
                : PAndL?.max_profit == 0
                  ? "text-gray-500"
                  : PAndL?.max_profit > 0
                    ? "text-green-500"
                    : "text-red-500"
            }`}
          >
            {formatValue(PAndL?.max_profit)}
            {profitPercent != null && isFinite(profitPercent) && (
              <div className="text-[0.68rem]">
                ({formatNumber(profitPercent)}%)
              </div>
            )}
          </div>
        </div>
        <div className="flex h-11 w-[8.5rem]  flex-col items-center justify-center gap-[0.05rem] rounded-2xl bg-white">
          <div className="text-[0.65rem] font-medium  text-z-gray-300 max-sm:pt-2">
            Max Loss
          </div>
          <div
            className={`flex flex-row items-center gap-1 text-[0.8rem] font-semibold ${
              typeof PAndL?.max_loss == "string"
                ? "text-gray-500"
                : PAndL?.max_loss == 0
                  ? "text-gray-500"
                  : PAndL?.max_loss > 0
                    ? " text-green-500"
                    : " text-red-500"
            }`}
          >
            {formatValue(PAndL?.max_loss)}
            {lossPercent != null && isFinite(lossPercent) && (
              <div className="text-[0.68rem]">
                ({formatNumber(lossPercent)}%)
              </div>
            )}
          </div>
        </div>
        <div
          className={`flex h-11 w-[8.5rem] flex-col items-center justify-center gap-[0.05rem] rounded-2xl bg-white ${Payoffstrategy ? "hidden" : "flex"}`}
        >
          <div className="text-[0.65rem]   text-z-gray-300 max-sm:pt-2">
            Funds Needed
          </div>
          <div className="text-[0.8rem] font-semibold  text-zinc-900">
            {formatNumber(margin)}
          </div>
        </div>

        <div
          className={`flex h-11 w-[8.5rem] flex-col items-center justify-center gap-[0.05rem] rounded-2xl bg-white ${Payoffstrategy ? "hidden" : "flex"}`}
        >
          <div className="text-[0.65rem]   text-z-gray-300 max-sm:pt-2">
            Available Margin
          </div>
          <div className="text-[0.8rem] font-semibold text-zinc-900">
            {FundsDataRedux &&
              FundsDataRedux?.net_amount &&
              formatNumber(FundsDataRedux?.net_amount)}
          </div>
        </div>
      </div>
      {/* Only for Small Screen */}
      <div className="xl:hidden xl:max-2xl:flex xl:max-2xl:w-full xl:max-2xl:justify-center">
        <CardSlidder cardsSwipe={cardsSwipe} />
      </div>

      {/* Only for Small Screen  */}
    </div>
  );
};
export default ChartCards;
