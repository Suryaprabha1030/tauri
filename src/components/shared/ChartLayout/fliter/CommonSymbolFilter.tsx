import React from "react";

interface SymbolFilterProps {
  index: any;
  filter: any;
  selectedFilter: string;
  actionselectedFilter: any;
  fliterName: any;
  exchange?: boolean;
  selected: any;
}

const CommonSymbolFilter: React.FC<SymbolFilterProps> = ({
  index,
  filter,
  selectedFilter,
  actionselectedFilter,
  fliterName,
  exchange,
  selected,
}) => {
  return (
    <button
      key={index}
      className={`border ${exchange ? "px-2" : ""}   border-gray-200 px-1 py-1 text-[0.65rem] font-medium max-sm:text-[0.5rem] md:max-lg:px-3 lg:max-xl:px-4 ${
        index === 0
          ? "rounded-l-3xl"
          : index === filter.length - 1
            ? "rounded-r-3xl"
            : ""
      }
       ${
         selected != "No Group"
           ? "cursor-not-allowed bg-gray-100 text-gray-500"
           : selectedFilter === fliterName
             ? "bg-z-green-500 text-white"
             : "bg-white text-black hover:bg-gray-200"
       }
                       
                        `}
      onClick={actionselectedFilter}
    >
      {fliterName}
    </button>
  );
};

export default CommonSymbolFilter;
