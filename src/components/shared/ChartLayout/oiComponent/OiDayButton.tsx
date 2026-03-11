import React from "react";

interface OiDayButtonProps {
  buttonName: string;
  toggleButtonName: () => void;
}

const OiDayButton: React.FC<OiDayButtonProps> = ({
  buttonName,
  toggleButtonName,
}) => {
  return (
    <button
      onClick={toggleButtonName}
      className=" rounded-lg border bg-z-green-500 px-4 py-2 text-[0.75rem] text-sm text-white active:bg-white active:text-green-200"
    >
      {buttonName}
    </button>
  );
};

export default OiDayButton;
