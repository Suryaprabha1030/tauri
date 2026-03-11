"use client";
import dynamic from "next/dynamic";

const AIScreener = dynamic(() => import("@/components/NimaAI/ChatKit"), {
  ssr: false,
});

import Logo from "@/components/shared/logo/logo";
import { useRef } from "react";

const TradingViewScreener = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex h-full w-full flex-col">
      {/*  Fixed Header */}
      <div className="sticky top-0 z-50 flex-none border-b bg-white shadow-sm">
        <div className="flex h-[4rem] flex-col items-start p-2 max-sm:items-center sm:max-xl:items-center">
          <Logo height={100} width={250} />
        </div>
      </div>

      {/*  Scrollable Screener */}
      <div ref={containerRef} className="flex-1 overflow-y-auto bg-white">
        <AIScreener />
      </div>
    </div>
  );
};

export default TradingViewScreener;
