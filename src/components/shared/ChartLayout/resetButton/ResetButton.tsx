import React, { Dispatch, SetStateAction, useState } from "react";
interface ResetButtonProps {
  handleReset: () => void;
  spinningAnimation: boolean;
}
const ResetButton: React.FC<ResetButtonProps> = ({
  spinningAnimation,
  handleReset,
}) => {
  return (
    <button
      onClick={handleReset}
      className="flex h-6 w-[2.5rem] cursor-pointer gap-1  px-1 py-1 md:max-xl:w-[1.8rem] "
    >
      <img
        src="/svg/reset.svg"
        alt=""
        width={24}
        height={24}
        className={`md:max-xl:h-[1.1rem] md:max-xl:w-[1.1rem]  ${spinningAnimation ? "animate-spin" : ""}`}
      />
    </button>
  );
};

export default ResetButton;
