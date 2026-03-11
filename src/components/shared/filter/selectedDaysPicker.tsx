import config from "@/lib/config";
import { use, useState } from "react";
const SelectDays = (props: {
  updateSelectedDays: (input: number) => void;
  disabled?: boolean;
}) => {
  const daysConfig = config.globalBackTestingConfig.selectedDays;

  const selectedDaysOnClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value)
      props.updateSelectedDays(parseInt(event.target.value));
  };

  return (
    <div>
      <div className="text-green flex justify-end">
        <select
          className="focus:border-tertiary rounded-lg border border-gray-300 p-[0.5px] py-2 xl:p-2 xl:py-2  outline-none"
          defaultValue={"NIFTY"}
          onChange={selectedDaysOnClick}
          disabled={props.disabled || false}
        >
          {daysConfig.map((c, idx) => (
            <option className="p-3 text-cyan-400" key={idx} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectDays;
