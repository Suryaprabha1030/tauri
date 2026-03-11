"use client";

import { buildTargetList } from "@/lib/util/configUtil";

const TargetSelect = (props: {
  updateTarget: (input: number) => void;
  disabled?: boolean;
}) => {
  const updateTarget = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value) props.updateTarget(parseInt(event.target.value));
  };

  return (
    <div>
      <div className="flex flex-col justify-center gap-[0.5px] font-medium  max-sm:text-[0.62rem] sm:text-[0.8rem] md:text-[0.9rem]  xl:flex-row xl:gap-2  xl:text-[0.75rem] 2xl:text-sm">
        <select
          className="focus:border-tertiary rounded-lg border border-gray-300 p-[0.5px] py-2 outline-none xl:p-2 xl:py-2"
          onChange={updateTarget}
          disabled={props.disabled || false}
        >
          {buildTargetList().map((c: any, idx) => (
            <option className="p-3 text-cyan-400" key={c.name} value={c.value}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TargetSelect;
