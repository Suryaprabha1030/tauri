import {
  showDraftNamePopUp,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
interface DraftNamePopupProps {
  setDraftName: Dispatch<SetStateAction<any>>;
  setToggleOpt?: Dispatch<SetStateAction<boolean>>;
}

const DraftNamePopup: React.FC<DraftNamePopupProps> = ({
  setDraftName,
  setToggleOpt,
}) => {
  const nameRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  // hide this floating component
  const removeSymbol = () => {
    dispatch(showDraftNamePopUp(false));
  };
  const DraftNamePopup = () => {
    if (nameRef.current) {
      setDraftName(nameRef.current.value);
      dispatch(showDraftNamePopUp(false));
      dispatch(showStrategyTable(false));
      dispatch(showPositionTable(false));
      dispatch(showPnlTable(false));
    }
    if (window.innerWidth < 1200) {
      setToggleOpt?.(false);
    }
  };
  useEffect(() => {
    if (nameRef.current) {
      nameRef.current.focus(); // Focus the input field
    }
  }, []);
  return (
    <div className="shadow-t-2xl relative h-[17rem] overflow-y-auto rounded-lg bg-white shadow-2xl max-sm:h-[11.55rem] max-sm:w-[18rem] sm:max-md:h-[15rem] sm:max-md:w-[28rem] md:max-xl:h-[18rem] md:max-lg:w-[40rem] lg:max-xl:w-[46rem] xl:w-[35rem] ">
      {" "}
      <div className="bg-shadow flex w-full flex-row items-center  justify-between border-b-[0.05rem] border-z-br-gray px-4 py-2  ">
        <h1 className="font-semibold max-md:text-base md:text-[1.2rem]">
          Create Strategy Sandbox
        </h1>
        <img
          src="/svg/removeSymbol.svg"
          className="relative h-[1.5rem] w-[1.5rem]"
          width="20"
          height="20"
          alt="plus"
          onClick={removeSymbol}
        />
      </div>
      <span className=" flex h-[14rem] w-full flex-col items-center justify-center gap-[2rem] px-4 py-2 max-sm:h-[9rem] sm:max-md:h-[12rem] ">
        <input
          id="name"
          name="name"
          type="email"
          placeholder="Enter Name"
          required
          className="focus flex items-center gap-3 rounded-md border border-neutral-200 px-5 py-2 max-sm:w-[14rem] sm:max-md:w-[22rem] md:max-lg:w-[30rem] lg:max-xl:w-[34rem] xl:w-[28rem]"
          ref={nameRef}
          maxLength={50}
        />

        <button
          className="  rounded-3xl border border-z-green-500 py-1  font-medium text-z-green-500 hover:bg-z-green-500  hover:text-white max-md:w-[7rem] max-md:text-sm  md:w-[8rem] md:text-[1rem] "
          title="create"
          onClick={DraftNamePopup}
        >
          Create
        </button>
      </span>
    </div>
  );
};

export default DraftNamePopup;
