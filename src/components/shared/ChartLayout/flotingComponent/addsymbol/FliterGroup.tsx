import React from "react";
import CommonSymbolFilter from "../../fliter/CommonSymbolFilter";
import {
  exchangeFilter,
  filter1,
  filter2,
} from "@/lib/util/analyzer/generalUtil/generalUtil";

interface FliterGroupProps {
  setSelectedFilter1: React.Dispatch<React.SetStateAction<any>>;
  setSelectedFilter2: React.Dispatch<React.SetStateAction<any>>;
  setSelectedExchange: React.Dispatch<React.SetStateAction<any>>;
  selectedFilter2: any;
  selectedExchange: any;
  selectedFilter1: any;
  selected: any;
}
const FliterGroup: React.FC<FliterGroupProps> = ({
  setSelectedFilter1,
  setSelectedFilter2,
  setSelectedExchange,
  selectedExchange,
  selectedFilter2,
  selectedFilter1,
  selected,
}) => {
  const handleTypeDoubleClick = (type: string) => {
    setSelectedFilter1(type);
  };

  const handleOptFut = (type: string) => {
    // Update state for filter2 and localStorage
    setSelectedFilter2(selectedFilter2 === type ? "none" : type);
  };
  const handleExchangeClick = (type: any) => {
    setSelectedExchange(type);
  };
  return (
    <div className="bg-shadow inline-flex justify-between px-2 max-xl:w-full max-md:py-1 max-md:pt-2.5 md:max-xl:mt-[0.4rem] md:max-lg:py-[0.5rem] lg:max-xl:mt-[0.5rem] lg:max-xl:py-[0.7rem] xl:w-[25rem] ">
      <div
        className="inline-flex justify-center max-md:w-[4.5rem] xl:w-[5rem]  "
        role="group"
      >
        {exchangeFilter.map((button, index) => (
          <CommonSymbolFilter
            key={button.title || index}
            index={index}
            fliterName={button.title}
            filter={exchangeFilter}
            selectedFilter={selectedExchange}
            actionselectedFilter={() => handleExchangeClick(button.title)}
            exchange={true}
            selected={selected}
          />
        ))}
      </div>
      {/* First Group of Filters */}
      <div className="inline-flex" role="group">
        {filter1.map((button, index) => (
          <CommonSymbolFilter
            key={button.title || index}
            index={index}
            fliterName={button.title}
            filter={filter1}
            selectedFilter={selectedFilter1}
            actionselectedFilter={() => handleTypeDoubleClick(button.title)}
            selected={selected}
          />
        ))}
      </div>

      {/* Second Group of Filters */}
      <div className="inline-flex max-sm:w-[5rem]" role="group">
        {filter2.map((button: any, index: any) => (
          <CommonSymbolFilter
            key={button.title || index}
            index={index}
            fliterName={button.title}
            filter={filter2}
            selectedFilter={selectedFilter2}
            actionselectedFilter={() => handleOptFut(button.title)}
            selected={selected}
          />
        ))}
      </div>
    </div>
  );
};

export default FliterGroup;
