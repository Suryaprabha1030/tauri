import React, { Dispatch, SetStateAction } from "react";

interface PositionsHoldingFilterProps {
  activePositionFilter: string | null;
  setActivePositionFilter: Dispatch<SetStateAction<any>>; //(value: string | null) => void;
}

const PositionsHoldingFilter: React.FC<PositionsHoldingFilterProps> = ({
  activePositionFilter,
  setActivePositionFilter,
}) => {
  return (
    <div
      className="inline-flex w-[6rem] justify-center sm:max-md:ml-[0.9rem] "
      role="group"
    >
      <button
        className={`rounded-l-3xl border border-gray-200 px-1 py-1 text-[0.65rem] font-medium text-gray-400 sm:max-md:px-2 sm:max-md:text-[0.7rem] md:max-lg:px-3 lg:max-xl:px-4
          ${
            activePositionFilter === "positions"
              ? "bg-z-green-500 text-white"
              : activePositionFilter === null
                ? "bg-white xl:hover:bg-gray-200 xl:hover:text-black"
                : ""
          }`}
        onClick={() =>
          setActivePositionFilter(
            activePositionFilter === "positions" ? null : "positions"
          )
        }
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        Positions
      </button>
      <button
        className={`rounded-r-3xl border border-gray-200 px-1 py-1 text-[0.65rem] font-medium text-gray-400 sm:max-md:px-2 sm:max-md:text-[0.7rem] md:max-lg:px-3 lg:max-xl:px-4
          ${
            activePositionFilter === "holdings"
              ? "bg-z-green-500 text-white"
              : "bg-white xl:hover:bg-gray-200 xl:hover:text-black"
          }`}
        onClick={() =>
          setActivePositionFilter(
            activePositionFilter === "holdings" ? null : "holdings"
          )
        }
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        Holdings
      </button>
    </div>
  );
};

export default PositionsHoldingFilter;
