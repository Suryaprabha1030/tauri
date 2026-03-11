import { RootState } from "@/lib/redux/Store";
import { formatNumber } from "@/lib/util/DraftUtil";
import React from "react";
import { useSelector } from "react-redux";

interface HoldingsPnlPercProps {
  totalProfitAndLoss: number | null;
  totalProfitAndLossPercent: number | null;
  totinvestedvalue: number | null;
  leftWidth: number;
}
const HoldingsPnlPerc: React.FC<HoldingsPnlPercProps> = ({
  totalProfitAndLoss,
  totalProfitAndLossPercent,
  totinvestedvalue,
  leftWidth,
}) => {
  const currentValue: any = useSelector(
    (state: RootState) => state.common.currentHoldingsValue
  );

  return (
    <div className="flex w-full items-center justify-center">
      <div
        className={`flex w-[95%]  flex-row    sm:max-lg:items-center   ${leftWidth < 40 ? "  items-center justify-center" : "w-[95%] justify-between"} `}
      >
        <div
          className={` text-[0.75rem] font-table text-gray-500   ${leftWidth < 40 ? "hidden" : "flex flex-col items-center justify-center gap-2 max-sm:gap-3"}`}
        >
          Invested
          <span className="w-[3rem]   text-center text-[0.8rem] text-black">
            {totinvestedvalue !== undefined &&
              totinvestedvalue !== null &&
              (() => {
                const formatted = formatNumber(totinvestedvalue); // Format number
                const [integerPart, decimalPart] = formatted.split("."); // Split integer & decimal
                return (
                  <>
                    <span>{integerPart}</span>
                    {decimalPart && (
                      <span className="align-baseline text-[0.65rem]">
                        .{decimalPart}
                      </span>
                    )}
                  </>
                );
              })()}
          </span>
        </div>
        <div className=" flex flex-row items-center  justify-between  max-sm:justify-center xl:max-2xl:justify-center ">
          <p
            className={`flex w-[10rem] flex-col  items-center justify-center  text-lg font-semibold ${
              totalProfitAndLoss !== null && totalProfitAndLoss > 0
                ? "text-z-green-500"
                : totalProfitAndLoss !== null && totalProfitAndLoss < 0
                  ? "text-red-500"
                  : "text-gray-500"
            }`}
          >
            <span className="text-[0.75rem] font-table text-gray-500">
              Total P&L
            </span>
            <div className="flex flex-row items-center gap-1">
              <span className="flex items-baseline font-semibold max-md:max-w-[5.5rem] max-md:text-[1.2rem] md:max-w-[6.5rem] md:text-[1.3rem]">
                {totalProfitAndLoss !== undefined &&
                  totalProfitAndLoss !== null &&
                  (() => {
                    const formatted = formatNumber(totalProfitAndLoss); // Format number
                    const [integerPart, decimalPart] = formatted.split("."); // Split integer & decimal
                    return (
                      <>
                        {totalProfitAndLoss > 0 ? "+" : ""}
                        <span>{integerPart}</span>
                        {decimalPart && (
                          <span className="align-baseline max-md:text-[0.8rem] md:text-[0.85rem]">
                            .{decimalPart}
                          </span>
                        )}
                      </>
                    );
                  })()}
              </span>

              <span className="flex items-baseline text-[0.75rem] sm:w-[4rem] md:w-[4rem]">
                ({totalProfitAndLossPercent?.toFixed(2)}
                <span className="align-baseline text-[0.8rem]">%)</span>
              </span>
            </div>
          </p>
        </div>
        <div
          className={` text-[0.75rem] font-table text-gray-500 max-sm:justify-center ${leftWidth < 40 ? "hidden" : "max-sm:3 flex flex-col items-center  justify-center gap-2"}`}
        >
          Current
          <span className=" w-[3rem]  text-center text-[0.8rem] text-black">
            {currentValue !== undefined &&
              currentValue !== null &&
              (() => {
                const formatted = formatNumber(currentValue); // Format number
                const [integerPart, decimalPart] = formatted.split("."); // Split integer & decimal
                return (
                  <>
                    <span>{integerPart}</span>
                    {decimalPart && (
                      <span className="align-baseline text-[0.65rem]">
                        .{decimalPart}
                      </span>
                    )}
                  </>
                );
              })()}
          </span>
        </div>
        {/*For displaying in mobile view and xl view  */}
        {/* <div className="flex flex-row items-center justify-between max-sm:justify-between max-sm:gap-4 sm:hidden xl:max-2xl:flex 2xl:hidden">
          <div className="py-2 text-[0.75rem] font-table text-gray-500">
            Invested Value:{" "}
            <span className="text-[0.8rem] text-black">
              {formatNumber(totinvestedvalue)}
            </span>
          </div>
          <div className="py-2 text-[0.75rem] font-table text-gray-500">
            Current Value:{" "}
            <span className="text-[0.8rem] text-black">
              {formatNumber(currentValue)}
            </span>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default HoldingsPnlPerc;
