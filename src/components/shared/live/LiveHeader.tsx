import Link from "next/link";
import React from "react";
import Logo from "../logo/logo";
import Image from "next/image";
import config from "@/lib/config";

const LiveHeader = ({ userMail }) => {
  return (
    <header className="flex w-full flex-row justify-between overflow-hidden  bg-white shadow max-xl:fixed max-xl:left-0 max-xl:top-0 max-xl:z-10 max-xl:h-20 max-md:p-2 lg:items-center lg:p-4">
      <div className=" flex flex-row items-center  max-md:w-[60%]">
        <a href={config.brokersListUrl}>
          <Logo height={48} width={160} />
        </a>
      </div>

      <div className="flex flex-col items-center justify-center  gap-1  max-md:w-[30%]">
        {!userMail.includes("@dummy.com") && (
          <span className="text-black max-md:text-[0.75rem]">{userMail}</span>
        )}

        <a href="/logout">
          <span className="flex flex-row items-center justify-center gap-1 text-black max-md:text-[0.75rem]">
            Logout
            <img src={"/svg/logout.svg"} width={20} height={20} alt="logout" />
          </span>
        </a>
      </div>
    </header>
  );
};

export default LiveHeader;
