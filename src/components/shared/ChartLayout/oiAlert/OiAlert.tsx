import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { ManualTriggerScheduledAPIApi } from "@/lib/api/base";
import config from "@/lib/config";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";

interface OiAlertBoxProps {
  showWarningOiAlert: boolean;
  setShowWarningOiAlert: React.Dispatch<React.SetStateAction<boolean>>;
}

const OiAlertBox: React.FC<OiAlertBoxProps> = React.memo(
  ({ showWarningOiAlert, setShowWarningOiAlert }) => {
    const router = useRouter();
    const isMarketHoliday = useSelector(
      (state: RootState) => state.MarketBasis.isMarketHoliday,
    );
    // ✅ Function: GET API (runs every 5 minutes)
    const getbanner = async () => {
      try {
        const oiAlertInfo = new ManualTriggerScheduledAPIApi(baseConfig());
        const res =
          await oiAlertInfo.getOiWorkingKeySchedulerEnableOiNotWorkingFlagGet();

        const dismissed =
          sessionStorage.getItem("OiAlertwarningDismissed") === "true";
        if (!dismissed) {
          setShowWarningOiAlert(res?.data?.is_oi_working);
        }
      } catch (error: any) {
        if (error?.response?.status === 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      }
    };

    // ✅ First useEffect — call POST API once

    useEffect(() => {
      const fetchBanner = async () => {
        if (config.isTradingTime() && !showWarningOiAlert && !isMarketHoliday) {
          await getbanner();
        }
      };

      fetchBanner();

      const interval = setInterval(
        () => {
          fetchBanner();
        },
        60 * 60 * 1000,
      );

      return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      const dismissed =
        sessionStorage.getItem("OiAlertwarningDismissed") === "true";

      if (dismissed) {
        setShowWarningOiAlert(!dismissed);
      }
    }, []);

    const handleClose = () => {
      setShowWarningOiAlert(false);
      sessionStorage.setItem("OiAlertwarningDismissed", "true");
    };

    if (!showWarningOiAlert) return null;

    return (
      <div
        className="relative flex w-full animate-slideDown items-start justify-between 
             rounded-md border border-yellow-400 bg-yellow-50 px-3 py-2 text-black 
             shadow-lg backdrop-blur-xl transition-transform ease-in-out"
      >
        {/* Left: Icon + Text */}
        <p className="flex  text-[0.85rem] leading-snug xl:text-xs">
          <span className="mr-2 flex-shrink-0">
            <img
              src="/svg/Warning.svg"
              width={16}
              height={16}
              alt="Warning"
              className=""
            />
          </span>
          <span className="flex-1 sm:max-xl:ml-3">
            Discrepancy Alert: Today&apos;s Open Interest (OI) data shows
            inconsistencies, which may affect the accuracy of the analysis.
          </span>
        </p>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-2 top-2 text-gray-500 hover:opacity-80 sm:static sm:ml-3  sm:max-xl:w-[2rem]"
        >
          <img src="/svg/removeSymbol.svg" width={20} height={20} alt="Close" />
        </button>
      </div>
    );
  },
);

OiAlertBox.displayName = "OiAlertBox";
export default OiAlertBox;
