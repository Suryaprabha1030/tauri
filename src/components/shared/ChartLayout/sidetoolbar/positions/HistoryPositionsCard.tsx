import { formatNumber } from "@/lib/util/DraftUtil";
import React from "react";
interface TotalPositionsProps {
  positionPnl: any;
}
const HistoryPositionsCard: React.FC<TotalPositionsProps> = ({
  positionPnl,
}) => {
  return (
    <div className="mb-2 flex h-7 flex-row justify-center ">
      <p
        className={`flex flex-row items-center justify-center gap-1 text-lg  font-semibold max-md:w-[14rem] md:w-[16rem] ${
          positionPnl > 0
            ? "text-z-green-500"
            : positionPnl < 0
              ? "text-red-500"
              : "text-gray-500"
        }`}
      >
        <span className="text-[0.75rem] font-medium text-gray-500">
          Total P&L:{" "}
        </span>

        <span className="flex items-baseline font-semibold max-md:min-w-[4.25rem] max-md:max-w-[5.5rem] max-md:text-[0.85rem] max-md:text-[1.1rem] md:max-w-[6.5rem] md:text-[1.3rem] xl:text-left">
          {positionPnl > 0 ? "+" : ""}
          {(() => {
            const formatted = formatNumber(positionPnl);
            const [integerPart, decimalPart] = formatted.split(".");
            return (
              <>
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
      </p>
    </div>
  );
};

export default HistoryPositionsCard;
