import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { minimizeStatus } from "@/lib/redux/slices/OptionChainSlice";
import { useDispatch } from "react-redux";
interface ToggleChartAndOptButtonProps {
  toggleOpt: boolean;
  setToggleOpt: Dispatch<SetStateAction<boolean>>;
}
const ToggleChartAndOptButton: React.FC<ToggleChartAndOptButtonProps> = ({
  toggleOpt,
  setToggleOpt,
}) => {
  const toggleChartOpt = () => {
    setToggleOpt(!toggleOpt);
  };
  return (
    <button
      onClick={toggleChartOpt}
      className={`flex h-[1rem] w-[3rem] cursor-pointer items-center justify-center gap-0.5 rounded-xl border-[1px] border-solid border-z-green-500 text-[0.6rem] sm:max-xl:h-[1.5rem] sm:max-xl:pr-[0.35rem] sm:max-xl:text-[0.75rem] sm:max-md:w-[4rem] md:max-xl:w-[5rem] md:max-xl:rounded-2xl xl:hidden`}
    >
      <img
        src="/svg/plusSymbol.svg"
        className=" relative cursor-pointer max-sm:h-[0.7rem] max-sm:w-[0.7rem] sm:max-xl:h-[1rem] sm:max-xl:w-[1rem] sm:max-xl:pt-[0.1rem]"
        width="20"
        height="20"
        alt="plus"
      />
      <span>{toggleOpt ? "Chart" : "Chain"}</span>
    </button>
  );
};
export default ToggleChartAndOptButton;
