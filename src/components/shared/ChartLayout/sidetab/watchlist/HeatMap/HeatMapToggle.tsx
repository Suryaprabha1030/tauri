import { getToggleState } from "@/lib/redux/slices/AnalyzerSlice";
import React from "react";
import { useDispatch } from "react-redux";

interface HeatMapToggleProps {
  toggleState: any;
}
const HeatMapToggle: React.FC<HeatMapToggleProps> = ({ toggleState }) => {
  const dispatch = useDispatch();
  const handleToggle = (state: any) => {
    dispatch(getToggleState({ toggleState: state }));
  };
  return (
    <div className="flex w-[5rem] justify-end text-[0.6rem] font-semibold max-md:my-2 max-md:p-0.5 md:max-xl:px-1 md:max-xl:py-2 xl:p-1 ">
      <div className="flex w-[4.5rem] cursor-pointer gap-1 rounded-full border-2 border-z-green-500 p-1 transition-all duration-300 ease-in-out md:max-xl:w-[6rem]">
        <div
          className={`flex-1 rounded-full px-[0.4rem] py-[0.1rem] text-center transition-all duration-300 ease-in-out md:max-xl:px-[0.6rem] ${
            toggleState === "LTP" ? "bg-z-green-500 text-white" : "text-black"
          }`}
          onClick={(e: any) => handleToggle("LTP")}
          onDoubleClick={(event: any) => {
            event.stopPropagation();
          }}
        >
          LTP
        </div>
        <div
          className={`flex-1 rounded-full px-[0.4rem] py-[0.1rem] text-center transition-all duration-300 ease-in-out md:max-xl:px-[0.6rem] ${
            toggleState === "OI" ? "bg-z-green-500 text-white" : "text-black"
          }`}
          onClick={(e: any) => handleToggle("OI")}
          onDoubleClick={(event: any) => {
            event.stopPropagation();
          }}
        >
          OI
        </div>
      </div>
    </div>
  );
};

export default HeatMapToggle;
