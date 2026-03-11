import React, { useState } from "react";

interface RefreshButtonProps {
  onClick: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onClick }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const handleClick = () => {
    if (isDisabled) return;
    setIsSpinning(true);
    setIsDisabled(true);
    onClick();
    setTimeout(() => setIsSpinning(false), 500);
    setTimeout(() => setIsDisabled(false), 10000); //disable refresh for 10 sec
  };

  return (
    <button
      className="group relative flex h-5 w-[2rem] cursor-pointer flex-col items-center justify-center gap-1  text-[0.8rem] backdrop-blur-3xl max-sm:p-1 sm:max-md:px-1 sm:max-md:pb-1.5 sm:max-md:pt-1"
      onClick={handleClick}
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      <img
        src="/svg/reset.svg"
        height={16}
        width={16}
        alt="refresh"
        className={`md:max-xl:h-[1.1rem] md:max-xl:w-[1.1rem] ${isSpinning ? "animate-spin" : ""} `}
      />
      <span className="pointer-events-none absolute top-[1.15rem] z-[1001] mt-1 rounded bg-gray-800 px-2  text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden">
        Refresh
      </span>
    </button>
  );
};

export default RefreshButton;
