import { formatNumber } from "@/lib/util/DraftUtil";
import React from "react";

const Cards = ({ name, value }: any) => {
  return (
    <div className="flex h-11 w-[8.5rem]  flex-col items-center justify-center gap-[0.05rem] rounded-2xl bg-z-green-300">
      <div className="text-[0.75rem] font-semibold  text-zinc-900 max-sm:pt-2">
        {name}
      </div>
      <div
        className={`text-[0.7rem] font-semibold ${
          value >= 0 ? "text-green-500" : "text-green-500"
        }`}
      >
        {formatNumber(value)}
      </div>
    </div>
  );
};

export default Cards;
