import { Dispatch, SetStateAction, useState } from "react";

interface OiChangeButtonsProps {
  setActiveButton: Dispatch<SetStateAction<any>>;
  activeButton: any;
}

const OiChangeButtons: React.FC<OiChangeButtonsProps> = ({
  setActiveButton,
  activeButton,
}) => {
  const handleClick = (buttonValue: any) => {
    setActiveButton(buttonValue);
  };

  const radioOptions = [
    { value: "oi", label: "Oi" },
    { value: "oichange", label: "Oi Change" },
    { value: "Both", label: "Both" },
  ];

  return (
    <div className="flex flex-col  ">
      <div className="tri-state-toggle ease flex w-[14rem] flex-row items-center justify-center overflow-hidden rounded-3xl border-2 border-z-green-500 bg-white bg-opacity-50 py-[0.05rem] text-[0.8rem] shadow-inner shadow-lg transition-all duration-500 ">
        {radioOptions.map((button) => (
          <button
            key={button.value}
            className={` m-1 flex cursor-pointer items-center justify-center rounded-full px-3 py-1 ${
              activeButton === button.value
                ? "border border-gray-300 bg-z-green-500 font-medium text-white shadow-lg"
                : "bg-transparent text-black"
            } transition-all duration-500 ease-in`}
            onClick={() => handleClick(button.value)}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OiChangeButtons;
