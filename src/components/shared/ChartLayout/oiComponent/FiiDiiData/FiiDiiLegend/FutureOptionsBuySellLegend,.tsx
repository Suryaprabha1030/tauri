import React from "react";
interface FuturesOptionsBuySellLegendProps {
  CallName: string;
  putName: string;
  callColor: string;
  putColor: string;
  leftWidth: number
}
const FuturesOptionsBuySellLegend: React.FC<
  FuturesOptionsBuySellLegendProps
> = ({ CallName, putName, callColor, putColor, leftWidth }) => {
  const newClasses = "text-[9px]"
  return (
    <div className={`flex h-[5%] flex-wrap justify-center ${leftWidth < 35 ? "gap-[1rem]": "gap-[2.5rem]"}`}>
      <div className="flex items-center gap-1">
        <span className="h-3 w-3 rounded-sm bg-[#000000]"></span>
        <span className={`font-label ${leftWidth < 35 ? "text-[12px]" : "text-sm"} max-sm:text-[10px]`}>Ltp</span>
      </div>
      <div className="flex items-center gap-1">
        <span
          className={`h-3 w-3 rounded-sm `}
          style={{ backgroundColor: callColor }}
        ></span>
        <span className={`font-label ${leftWidth < 35 ? "text-[12px]" : "text-sm"} max-sm:text-[10px]`}>{CallName}</span>
      </div>
      <div className="flex items-center gap-1">
        <span
          className={`h-3 w-3 rounded-sm `}
          style={{ backgroundColor: putColor }}
        ></span>
        <span className={`font-label ${leftWidth < 35 ? "text-[12px]" : "text-sm"} max-sm:text-[10px]`}>{putName}</span>
      </div>
    </div>
  );
};

export default FuturesOptionsBuySellLegend;
