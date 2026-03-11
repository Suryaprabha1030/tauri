import { getImageSrc } from "@/lib/util/analyzer/iconUtil";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface FilterButtonProps {
  label: string;
  value: string;
  activeIndicatorFilter: string | null;
  setActiveIndicatorFilter: Dispatch<SetStateAction<string | null>>;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  label,
  value,
  activeIndicatorFilter,
  setActiveIndicatorFilter,
}) => {
  const isActive = activeIndicatorFilter === value;

  return (
    <button
      className={`max-md:text-[0.55rem] max-sm:px-[0.5rem] max-sm:py-[0.2rem] sm:max-md:px-[1rem] sm:max-md:py-[0.45rem] md:text-[0.6rem] md:max-xl:px-[1.2rem] md:max-xl:py-[0.5rem] xl:px-[0.3rem] xl:py-[0.1rem]  ${
        isActive
          ? "bg-gray-300 text-white"
          : "bg-white xl:hover:bg-gray-300 xl:hover:text-white"
      } border border-gray-200 text-gray-400  ${
        value === "Bullish"
          ? "rounded-l-xl   "
          : value === "Bearish"
            ? "rounded-r-xl"
            : ""
      }`}
      onClick={() => setActiveIndicatorFilter(isActive ? null : value)}
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
      title={label}
    >
      {/* {label} */}
      <img
        src={getImageSrc(label)}
        width={15}
        height={15}
        alt=""
        className="max-sm:h-[0.85rem] max-sm:w-[0.85rem] "
      />
    </button>
  );
};

export default FilterButton;
