import React from "react";
interface FuturesOptionsLegendProps {
  CallName: string;
  leftWidth: number
}
const FuturesOptionsLegend: React.FC<FuturesOptionsLegendProps> = ({
  CallName,
  leftWidth
}) => {
  return (
    <div className={`flex h-[5%] flex-wrap justify-center ${leftWidth < 35 ? "gap-[1rem]" : "gap-[2.5rem]"}`}>
      <div className="flex items-center gap-1">
        <span className="h-3 w-3 rounded-sm bg-[#000000]"></span>
        <span className={`font-label ${leftWidth < 35 ? "text-[12px]" : "text-sm"} max-sm:text-[10px]`}>Ltp</span>
      </div>
      <div className="flex items-center gap-1">
        <span className={`h-3 w-3 rounded-sm bg-[#0118D8]`}></span>
        <span className={`font-label ${leftWidth < 35 ? "text-[12px]" : "text-sm"} max-sm:text-[10px]`}>{CallName}</span>
      </div>
    </div>
  );
};

export default FuturesOptionsLegend;
