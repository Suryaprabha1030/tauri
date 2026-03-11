import React, { Dispatch, SetStateAction, useState } from "react";

interface TimeFilterProps {
  setSelected: Dispatch<SetStateAction<number>>;
  selected: number;
  showMultiOi: boolean;
  showOiChange: boolean;
}

export const TimeFilter: React.FC<TimeFilterProps> = ({
  setSelected,
  selected,
  showMultiOi,
  showOiChange,
}) => {
  const timeFrames = [
    { label: "5m", value: 5 },
    // { label: "10m", value: 10 },
    { label: "15m", value: 15 },
    { label: "30m", value: 30 },
    { label: "1h", value: 60 },
  ];

  const [buttonName, setButtonName] = useState("Intraday");

  // Function to toggle the name
  const toggleButtonName = () => {
    if (buttonName === "Intraday") {
      setButtonName("Custom"); // Change to "Day" if it was "5 min"
    } else {
      setButtonName("Intraday"); // Change to "5 min" if it was "Day"
    }
  };
  return (
    <div
      className={`max-sm:h-[2rem] xl:gap-5 ${showOiChange ? "hidden" : "flex "} `}
    >
      <div className="inline-flex rounded-lg rounded-lg border border-gray-300 bg-white shadow-xl">
        {timeFrames.map((timeFrame) => (
          <button
            key={timeFrame.value}
            onClick={() => setSelected(timeFrame.value)}
            className={`font-label rounded-lg px-2 py-2 text-[0.75rem] max-sm:px-2.5 max-sm:py-1 max-sm:text-[0.7rem] md:max-lg:px-[0.5rem] md:max-lg:py-1.5 lg:max-xl:px-3
          ${
            selected === timeFrame.value
              ? "bg-z-green-500 text-white"
              : "text-black"
          }
         `}
          >
            {timeFrame.label}
          </button>
        ))}
      </div>
    </div>
  );
};
