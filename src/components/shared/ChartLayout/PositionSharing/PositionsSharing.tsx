import { PositionsRouterApi, UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  setTotalPositionsPnl,
  updateSymbolPnl,
} from "@/lib/redux/slices/PositionSlicer";
import { setLastUpdatedPositions } from "@/lib/redux/slices/screenerSlice";
import {
  addSymbol,
  setPositions,
  updateSymbolData,
} from "@/lib/redux/slices/StrategySlice";
import { RootState } from "@/lib/redux/Store";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import {
  getLastClickDate,
  saveLastClickDate,
} from "@/lib/util/storageUtil/indexdbStorage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

interface PositionsSharingProps {
  brokerCode: number | null;
  setHistoryClicked: () => void;
  setHasFetchedCalenderData: React.Dispatch<React.SetStateAction<any>>;
}

const PositionsSharing: React.FC<PositionsSharingProps> = ({
  brokerCode,
  setHistoryClicked,
  setHasFetchedCalenderData,
}) => {
  const currentBrokerName = useSelector(
    (state: RootState) => state.Position.BrokerName
  );
  const currentBrokerClientCode = useSelector(
    (state: RootState) => state.Position.ClientCode
  );

  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [tooltipText, setTooltipText] = useState<string>("");
  const router: any = useRouter();
  // Track the last click date from IndexedDB
  const [lastClickDate, setLastClickDate] = useState<string | null>(null);
  const userId = sessionStorage.getItem("userDetails"); // User ID is fetched from sessionStorage
  const dispatch = useDispatch();
  useEffect(() => {
    // Ensure both brokerCode and userId are valid before checking IndexedDB
    if (brokerCode && userId) {
      const key = `${userId}#${brokerCode}`; // Combine userId and brokerCode as the key
      // Fetch the last clicked date from IndexedDB for the given userId and brokerCode
      getLastClickDate(userId, brokerCode).then((storedDate) => {
        if (storedDate) {
          setLastClickDate(storedDate);
        }
      });
    }
  }, [brokerCode, userId]);

  const updPositions = async () => {
    if (!brokerCode) return;

    const fetchApi = new UserBrokerRouterApi(baseConfig());
    try {
      const response: any =
        await fetchApi.fetchMyBrokerPositionsV1UsersMeBrokersBrokerCodePositionsGet(
          brokerCode
        );
      const Positions = response?.data?.positions;
      dispatch(
        setPositions({
          positions: Positions,
          positionPnl: response?.data?.total_pnl,
          positionpnlpercent: response?.data?.total_pnl_percent,
        })
      );
      dispatch(
        setLastUpdatedPositions({
          data: response?.data?.positions,
          time: Date.now(),
        })
      );

      dispatch(setTotalPositionsPnl(response?.data?.total_pnl));

      Positions?.forEach((item: any) => {
        dispatch(
          addSymbol({
            symbol: item?.identifier,
            //  token: item?.token
          })
        );

        dispatch(updateSymbolPnl({ symbol: item?.identifier, pnl: item?.pnl }));
      });

      return true; // Indicate success
    } catch (error: any) {
      if (error?.response && error?.response.status === 401) {
        autoLogoutTokenRemove(router);
      }
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
      return false; // Indicate failure
    }
  };

  const handleSharePositions = async () => {
    if (!brokerCode) return;

    const PositionSharing = new PositionsRouterApi(baseConfig());
    try {
      const response =
        await PositionSharing.createPositionsV1UsersMeSharedPositionsPost(
          brokerCode,
          "twitter",
          currentBrokerClientCode,
          currentBrokerName
        );
      const Positions = response?.data?.data;
      dispatch(
        setPositions({
          positions: Positions,
          positionPnl: response?.data?.total_pnl,
          positionpnlpercent: null,
        })
      );
      dispatch(setTotalPositionsPnl(response?.data?.total_pnl));

      Positions?.forEach((item: any) => {
        dispatch(addSymbol({ symbol: item?.identifier }));

        dispatch(updateSymbolPnl({ symbol: item?.identifier, pnl: item?.pnl }));
      });

      const today = new Date().toISOString().split("T")[0];
      setLastClickDate(today);
      setHistoryClicked(); // Only called after updPositions and share API succeed
      setIsDisabled(true);
      setTooltipText("Positions of today are already shared");
      setHasFetchedCalenderData(false);
    } catch (error: any) {
      if (error?.response && error?.response?.status === 401) {
        autoLogoutTokenRemove(router);
      }
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
      const errorMessage = error?.response?.data || "";
      const today = new Date().toISOString().split("T")[0];
      setLastClickDate(today);

      if (errorMessage?.includes("You can only persist one entry per day.")) {
        const success = await updPositions(); // Wait for positions to update first
        if (!success) return;
        setTooltipText("Positions of today are already shared");
        setHistoryClicked();
      } else if (errorMessage?.includes("We Can't Persist")) {
        setTooltipText("Positions Can be Shared After Market Hours");
      } else {
        setTooltipText("Positions can't be shared");
      }
    }
  };

  return (
    <div
      className="group relative inline-block flex w-[2rem] cursor-pointer items-center justify-center"
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      <Image
        src="/svg/share.svg"
        height={15}
        width={15}
        alt="share position"
        onClick={handleSharePositions}
        className={`md:max-xl:h-[1.2rem] md:max-xl:w-[1.2rem] ${isDisabled ? "pointer-events-none opacity-50" : ""}`}
      />
      <span
        className={`pointer-events-none absolute top-5 z-[1001] mt-1 w-[7rem] rounded bg-gray-800 px-2 py-1 text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 max-xl:max-w-[6rem] ${
          isDisabled ? "group-hover:opacity-100" : "group-hover:opacity-100"
        }`}
      >
        {tooltipText || "Share Positions"}
      </span>
    </div>
  );
};

export default PositionsSharing;
