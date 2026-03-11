import React, { Dispatch, SetStateAction } from "react";

interface SymbolFilterProps {
  filterClick: any;
  activeSymbolFilter: string | null;
  setActiveSymbolFilter: Dispatch<SetStateAction<any>>; //(value: string | null) => void;
}

const SymbolFilter: React.FC<SymbolFilterProps> = ({
  filterClick,
  activeSymbolFilter,
  setActiveSymbolFilter,
}) => {
  return (
    <div
      className={`inline-flex items-center justify-center ${
        filterClick ? "" : "max-xl:hidden"
      }`}
      role="group"
    >
      <button
        className={`rounded-l-3xl border border-gray-200 py-1 text-[0.65rem] font-medium text-gray-400 max-md:px-3 md:max-lg:px-3 lg:max-xl:px-4 xl:px-2
          ${
            activeSymbolFilter === "index"
              ? "bg-z-green-500 text-white"
              : "bg-white xl:hover:bg-gray-200 xl:hover:text-black"
          }`}
        onClick={() =>
          setActiveSymbolFilter(activeSymbolFilter === "index" ? null : "index")
        }
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
        title="Index"
      >
        IDX
      </button>
      <button
        className={`border border-gray-200 py-1 text-[0.65rem] font-medium text-gray-400 max-md:px-3 md:max-lg:px-3 lg:max-xl:px-4 xl:px-1
          ${
            activeSymbolFilter === "equity"
              ? "bg-z-green-500 text-white"
              : "bg-white xl:hover:bg-gray-200 xl:hover:text-black"
          }`}
        onClick={() =>
          setActiveSymbolFilter(
            activeSymbolFilter === "equity" ? null : "equity"
          )
        }
        title="Equities"
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        EQT
      </button>
      <button
        className={`border border-gray-200 py-1 text-[0.65rem] font-medium text-gray-400 max-md:px-3 md:max-lg:px-3 lg:max-xl:px-4 xl:px-1
          ${
            activeSymbolFilter === "options"
              ? "bg-z-green-500 text-white"
              : "bg-white xl:hover:bg-gray-200 xl:hover:text-black"
          }`}
        onClick={() =>
          setActiveSymbolFilter(
            activeSymbolFilter === "options" ? null : "options"
          )
        }
        title="Options"
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        OPT
      </button>
      <button
        className={`rounded-r-3xl border border-gray-200 py-1 text-[0.65rem] font-medium text-gray-400 max-md:px-3 md:max-lg:px-3 lg:max-xl:px-4 xl:px-1
          ${
            activeSymbolFilter === "futures"
              ? "bg-z-green-500 text-white"
              : "bg-white xl:hover:bg-gray-200 xl:hover:text-black"
          }`}
        onClick={() =>
          setActiveSymbolFilter(
            activeSymbolFilter === "futures" ? null : "futures"
          )
        }
        title="Futures"
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        FUT
      </button>
    </div>
  );
};

export default SymbolFilter;
