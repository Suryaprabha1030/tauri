"use client";
import { useRef } from "react";
import ChatKitStream from "../NimaAI/ChatKit";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import config from "@/lib/config";
import TabNavigation from "../StockInfo/TabNavigation";

const TradingViewScreener = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const userEmail = useSelector((state: RootState) => state.common.userInfo);
  const isPrivilegedUser = config.userEmail.includes(userEmail?.email);
  return (
    <div className="flex h-full w-full flex-col gap-1">
      {!isPrivilegedUser && (
        <>
          <div className="shadow-sm">
            <TabNavigation />
          </div>
          <div
            className="flex h-[90%] w-full  items-center justify-center bg-white "
            ref={containerRef}
          >
            <img src="/svg/comingSoon.svg" width={300} height={300} alt="" />
          </div>
        </>
      )}
      {isPrivilegedUser && (
        <>
          <div
            className="flex h-[100%]  w-full  items-center justify-center bg-white "
            ref={containerRef}
          >
            <ChatKitStream />
          </div>
        </>
      )}
    </div>
  );
};

export default TradingViewScreener;
