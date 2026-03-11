import { RootState } from "@/lib/redux/Store";
import React from "react";
import { useSelector } from "react-redux";

const MaxPainStrike = () => {
  const MaxPainStrike = useSelector(
    (state: RootState) => state.StrategyChart.maxPainStrikeValue
  );
  return (
    <div>
      <div className=" flex xl:w-[6.5rem] w-[7.5rem] flex-row items-center justify-center gap-2   bg-white max-sm:hidden sm:max-lg:hidden ">
        {MaxPainStrike &&
          MaxPainStrike != null &&
          MaxPainStrike != undefined && (
            <>
              {" "}
              <div className="text-[0.75rem] text-z-gray-300   ">Max Pain:</div>
              <div className="text-[0.75rem] font-medium text-zinc-900">
                {MaxPainStrike}
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default MaxPainStrike;
