import {
  setCurrentSection,
  setScreenerOpen,
  setStockInfoOpen,
} from "@/lib/redux/slices/CommonSlice";
import { RootState } from "@/lib/redux/Store";
import Image from "next/image";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const UserIconButton = () => {
  const currentSection = useSelector(
    (state: RootState) => state.common.currentSection,
  );
  const dispatch = useDispatch();
  const handleProfileInfo = () => {
    dispatch(setCurrentSection("Profile"));
    dispatch(setScreenerOpen(false));
    dispatch(setStockInfoOpen(false));
  };
  return (
    <div
      className={`wrapper relative flex h-[2.7rem] w-[2.5rem] items-center justify-center rounded-lg py-1 max-md:hidden md:max-xl:mr-[2.5rem]`}
    >
      <span className="group flex h-full w-full flex-col items-center justify-center gap-1">
        <img
          src={
            currentSection === "Profile"
              ? "/svg/greenUser.svg"
              : "/svg/BlackUser.svg"
          }
          alt=""
          width="40"
          height="40"
          className={` wrapper group relative w-[1.3rem] cursor-pointer`}
          onClick={handleProfileInfo}
        />
        <div className="flex items-center justify-center text-center text-[0.55rem] text-gray-700 max-xl:hidden xl:flex">
          Profile
        </div>
      </span>
    </div>
  );
};

export default UserIconButton;
