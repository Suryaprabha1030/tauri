import React from "react";
interface AddSymbolHeaderProps {
  name: any;
  selectSymbolFunction: any;

  selectedExchange: any;
}

const SymbolSelectFilter: React.FC<AddSymbolHeaderProps> = ({
  name,
  selectSymbolFunction,
  selectedExchange,
}) => {
  return (
    <button
      className={`${name == "BSE" ? "rounded-r-3xl" : "rounded-l-3xl"} border border-gray-200 py-1 font-medium  max-sm:px-1.5 max-sm:text-[0.5rem] xl:px-2 xl:text-[0.65rem]
        ${
          selectedExchange === name
            ? "bg-z-green-500 text-white"
            : "bg-white hover:bg-z-green-500 hover:text-white"
        }`}
      onClick={selectSymbolFunction}
      title={name}
    >
      {name}
    </button>
  );
};

export default SymbolSelectFilter;
