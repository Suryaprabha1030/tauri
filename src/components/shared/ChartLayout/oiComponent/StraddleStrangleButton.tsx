import React, { Dispatch, useState } from "react";

interface StraddleStrangleButtonProps {
  activeStraddleButton: any;
  setActiveStraddleButton: Dispatch<React.SetStateAction<any>>;
  setShowMultiStraddle: Dispatch<React.SetStateAction<any>>;
  setManuallyCheckedStraddle: Dispatch<React.SetStateAction<any>>;
}

const StraddleStrangleButton: React.FC<StraddleStrangleButtonProps> = ({
  activeStraddleButton,
  setActiveStraddleButton,
  setShowMultiStraddle,
  setManuallyCheckedStraddle,
}) => {
  const multiStarddleOPtions = [
    { value: "straddle", label: "Straddle" },
    { value: "strangle", label: "Strangle" },
    { value: "custom", label: "Custom" },
  ];

  const handleStraddleClick = (buttonValue: any) => {
    setShowMultiStraddle(true);

    setManuallyCheckedStraddle(false);
    setActiveStraddleButton(buttonValue);
  };
  return (
    <div className="flex flex-col  pl-20 ">
      <div className="tri-state-toggle ease flex w-[16rem] flex-row items-center justify-center overflow-hidden rounded-3xl border-2 border-z-green-500 bg-white bg-opacity-50 py-[0.05rem] text-[0.8rem] shadow-inner shadow-lg transition-all duration-500">
        {multiStarddleOPtions.map((button) => (
          <button
            key={button.value}
            className={` m-1 flex cursor-pointer items-center justify-center rounded-full px-3 py-1 ${
              activeStraddleButton === button.value
                ? "border border-gray-300 bg-z-green-500 font-medium text-white shadow-lg"
                : "bg-transparent text-black"
            } transition-all duration-500 ease-in`}
            onClick={() => handleStraddleClick(button.value)}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StraddleStrangleButton;
