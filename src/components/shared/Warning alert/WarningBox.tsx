import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface WarningBoxProps {
  showWarning: boolean;
  setShowWarning: React.Dispatch<React.SetStateAction<boolean>>;
}

const WarningBox: React.FC<WarningBoxProps> = React.memo(
  ({ showWarning, setShowWarning }) => {
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      const checkMarketHours = () => {
        const now = new Date();
        const hours = now.getHours();
        const day = now.getDay();

        const isMarketDay = day >= 1 && day <= 5;
        const isPreMarketTime = hours >= 21 || hours < 9;

        const dismissed = sessionStorage.getItem("warningDismissed") === "true";

        if (isMarketDay && isPreMarketTime && !dismissed) {
          setShowWarning(true);
        } else {
          setShowWarning(false);
        }
      };

      checkMarketHours();
      intervalRef.current = setInterval(checkMarketHours, 60000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }, [setShowWarning]);

    const handleClose = () => {
      setShowWarning(false);
      sessionStorage.setItem("warningDismissed", "true");
    };

    if (!showWarning) return null;

    return (
      <div
        className="relative flex w-full animate-slideDown items-center justify-center gap-2 rounded-md border
        border-yellow-400 bg-yellow-50 px-2 py-2 text-black shadow-lg
        backdrop-blur-xl transition-transform ease-in-out"
      >
        <div className="flex flex-col items-center  xl:flex-row xl:gap-2">
          <span className="flex flex-row gap-1 text-sm font-semibold">
            <Image
              src="/svg/Warning.svg"
              width={15}
              height={15}
              alt="Warning"
            />{" "}
            Warning !
          </span>
          <p className="text-center text-sm xl:text-xs 2xl:text-sm">
            Displaying price values may be incorrect during post-market hours /
            holidays
          </p>
        </div>
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 text-gray-500 hover:opacity-80 xl:relative xl:right-auto xl:top-auto "
        >
          <Image
            src="/svg/removeSymbol.svg"
            width={15}
            height={15}
            alt="Close"
          />
        </button>
      </div>
    );
  }
);

WarningBox.displayName = "WarningBox";
export default WarningBox;
