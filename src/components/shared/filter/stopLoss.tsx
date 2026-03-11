"use client";

import { StopLossInput } from "@/lib/types";
import { buildTargetList } from "@/lib/util/configUtil";
import { ChangeEvent, useEffect, useState } from "react";

const StopLoss = (props: {
  updateStopLoss: (input: StopLossInput) => void;
}) => {
  const [state, setState] = useState<StopLossInput>({
    type: "stopLoss",
    value: -1,
  });

  const updateSelection = (event: ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value === "stopLoss") {
      // reset targetStopLoss
      props.updateStopLoss({
        type: "trailingStopLoss",
        value: -1,
      });
    } else {
      // reset stopLoss
      props.updateStopLoss({
        type: "stopLoss",
        value: -1,
      });
    }

    setState({
      ...state,
      type: event.target.value as "stopLoss" | "trailingStopLoss",
    });
  };

  useEffect(() => {
    props.updateStopLoss(state);
  }, [state]);

  return (
    <div className="flex flex-row justify-center gap-1  gap-2 font-medium max-sm:text-[0.62rem] sm:text-[0.8rem]  md:text-[0.9rem] xl:gap-2  xl:text-[0.75rem] 2xl:text-sm">
      <select
        id="states"
        className="rounded-lg border p-[0.5px] py-2 font-medium max-sm:text-[0.62rem]  sm:text-[0.8rem] md:text-[0.9rem]  xl:p-2 xl:py-2  xl:text-[0.75rem] 2xl:text-sm"
        defaultValue={"stopLoss"}
        onChange={updateSelection}
      >
        <option
          value="stopLoss"
          selected
          className="max-sm:text-[0.62rem] sm:text-[0.8rem]  md:text-[0.9rem] xl:text-[0.75rem] 2xl:text-sm"
        >
          SL(%) / leg
        </option>
        <option value="trailingStopLoss">TSL(%) / leg</option>
      </select>

      <select
        className="focus:border-tertiary rounded-lg border border-gray-300 p-[0.5px] py-2  outline-none max-sm:text-[0.62rem]  sm:text-[0.8rem] md:text-[0.9rem] xl:p-2 xl:py-2 xl:text-[0.75rem]  2xl:text-sm"
        onChange={(e) => {
          setState({
            ...state,
            value: parseInt(e.target.value),
          });
        }}
      >
        {buildTargetList().map((c: any, idx) => (
          <option className="p-3 text-cyan-400" key={c.name} value={c.value}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
};
export default StopLoss;
