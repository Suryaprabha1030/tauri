import React, { Dispatch, SetStateAction } from "react";
import FilterButton from "./StrategyAnalyzerTableBody/StrategiesFilterButton";
interface StrategiesFilterProps {
  activeIndicatorFilter: any;
  setActiveIndicatorFilter: Dispatch<SetStateAction<any>>;
}
const StrategiesAnalyzerFilter: React.FC<StrategiesFilterProps> = ({
  activeIndicatorFilter,
  setActiveIndicatorFilter,
}) => {
  const filterOptions = [
    { label: "Bullish", value: "Bullish" },
    { label: "Neutral", value: "Neutral" },
    { label: "Bearish", value: "Bearish" },
  ];
  return (
    <div className="flex">
      {filterOptions.map((option) => (
        <FilterButton
          key={option.value}
          label={option.label}
          value={option.value}
          activeIndicatorFilter={activeIndicatorFilter}
          setActiveIndicatorFilter={setActiveIndicatorFilter}
        />
      ))}
    </div>
  );
};

export default StrategiesAnalyzerFilter;
