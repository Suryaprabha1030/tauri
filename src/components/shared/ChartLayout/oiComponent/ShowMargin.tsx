import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { formatNumber } from "@/lib/util/DraftUtil";
import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import ResetButton from "../resetButton/ResetButton";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface ShowMarginprops {
  marginPayload: any[];
  showOiChange: boolean;
  showCombinedOi: boolean;
  checkedStrangleRows: {};
  checkedCustomRows: {};
  checkedOIRows: {};
  checkedOIRadios: {};
  showMultiOi: boolean;
  showMultiStraddle: boolean;
  brokerCode: number | null;
  setShowMargin: React.Dispatch<React.SetStateAction<any>>;
  showMargin: any;
  calculateMargin: any;
  setCalculateMargin: React.Dispatch<React.SetStateAction<boolean>>;
  spinningAnimation: boolean;
  setSpinningAnimation: React.Dispatch<React.SetStateAction<boolean>>;
}
const ShowMargin: React.FC<ShowMarginprops> = ({
  marginPayload,
  showOiChange,
  showCombinedOi,
  checkedStrangleRows,
  checkedCustomRows,
  checkedOIRows,
  checkedOIRadios,
  showMultiOi,
  showMultiStraddle,
  brokerCode,
  showMargin,
  setShowMargin,
  calculateMargin,
  setCalculateMargin,
  setSpinningAnimation,
  spinningAnimation,
}) => {
  const router = useNavigate();
  useEffect(() => {
    if (
      (!marginPayload ||
        marginPayload?.length === 0 ||
        showOiChange ||
        showCombinedOi) &&
      !calculateMargin
    ) {
      return; // Prevent unnecessary API calls
    }
    const MarginApi = new UserBrokerRouterApi(baseConfig());

    const fetchMargin = async () => {
      try {
        const res =
          await MarginApi.calculateMarginV1UsersMeBrokersBrokerCodeCalculateMarginPost(
            brokerCode,
            marginPayload,
          );
        setShowMargin(null);
        setShowMargin(res?.data?.total_margin_required);
      } catch (error: any) {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      }
    };

    fetchMargin();
  }, [marginPayload]);
  useEffect(() => {
    if (calculateMargin == false) {
      return;
    }
    let marginValue = null;

    switch (true) {
      case showMultiOi === true &&
        Object.values(checkedOIRows).every((value) => value === false):
      case showMultiStraddle === true &&
        Object.values(checkedCustomRows).every((value) => value === false):
      case showMultiStraddle === true &&
        Object.values(checkedStrangleRows).every((value) => value === false):
      case showMultiStraddle === true &&
        Object.values(checkedOIRadios).every((value) => value === false):
        marginValue = null;
        break;

      default:
        marginValue = showMargin;
    }
    setShowMargin(null);
    setShowMargin(marginValue);
  }, [calculateMargin]);

  const calculateRequiredMargin = () => {
    setSpinningAnimation(true);
    if (calculateMargin == false) {
      setShowMargin(null);
    }
    setCalculateMargin(true);
    setTimeout(() => {
      setSpinningAnimation(false);
    }, 300);
  };

  return (
    <div className="relative flex items-center justify-center gap-2 text-[0.85rem]">
      {/* Wrap just the Margin part in a hover group */}
      <div className="group relative flex  items-center">
        <span className="cursor-pointer">
          Margin :
          <span className="inline-flex w-[3rem] justify-center">
            {showMargin !== null && showMargin > 0 && calculateMargin
              ? formatNumber(showMargin)
              : "NA"}
          </span>
        </span>

        {showMargin !== null && showMargin > 0 && calculateMargin && (
          <div className="absolute left-1/2 top-[1.5rem] z-50 flex max-h-[7rem] w-[7rem] -translate-x-1/2 scale-0 transform flex-col items-center gap-2 overflow-y-auto rounded bg-white px-2 py-2 text-xs text-black opacity-0 shadow-strong-top transition-all duration-200 scrollbar-none group-hover:scale-100 group-hover:opacity-100">
            {marginPayload.map((data, index) => (
              <span
                key={index}
                className="flex items-center gap-x-1 whitespace-nowrap"
              >
                <span>1x</span>
                <span>{data.strike_price}</span>
                <span>{data.option_type}</span>

                <span>SELL</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Reset button is now outside the hover group, so it won't trigger tooltip */}
      <ResetButton
        handleReset={calculateRequiredMargin}
        spinningAnimation={spinningAnimation}
      />
    </div>
  );
};

export default ShowMargin;
