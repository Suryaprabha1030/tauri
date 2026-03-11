import React, { useState } from "react";
import Back from "../../PositionSharing/back";
import PositionHistory from "../../PositionSharing/PositionsHistory";
import PositionsSharing from "../../PositionSharing/PositionsSharing";
import RefreshButton from "../refresh";
import RemoveButton from "../sharedContent/RemoveButton";
import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  addSymbol,
  setFundsData,
  setHoldingsData,
  setPositions,
  updateSymbolData,
} from "@/lib/redux/slices/StrategySlice";
import { useDispatch, useSelector } from "react-redux";
import { WidthAdjusterDoubleClick } from "@/lib/util/sideToolBar/sidetoolbarCommon";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";
import { RootState } from "@/lib/redux/Store";
import Image from "next/image";
import {
  setIdentifiersSet,
  updateSymbolPnl,
} from "@/lib/redux/slices/PositionSlicer";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import {
  setCurrentSection,
  setScreenerOpen,
} from "@/lib/redux/slices/CommonSlice";
import {
  setLastUpdatedHoldings,
  setLastUpdatedPositions,
  setNimaGpt,
  setScreenerQuery,
} from "@/lib/redux/slices/screenerSlice";
import Nimabutton from "@/components/NimaAI/Nimabutton";
import config from "@/lib/config";
import Select from "@/components/shared/SelectDropdown";
import {
  setHoldingsTypes,
  setPositionTypes,
  setStrategiesPnlRefresh,
} from "@/lib/redux/slices/SimulationSlice";

interface PositionsHeaderProps {
  HistoryClicked: boolean;
  handleBack: () => void;
  handleHistoryClick: () => void;
  brokerCode: number | null;
  leftWidth: number;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
  setShowModal: React.Dispatch<React.SetStateAction<any>>;
  setHasFetchedCalenderData: React.Dispatch<React.SetStateAction<any>>;
}

const PositionsHeader: React.FC<PositionsHeaderProps> = ({
  HistoryClicked,
  handleBack,
  handleHistoryClick,
  brokerCode,
  leftWidth,
  setLeftWidth,
  setShowModal,
  setHasFetchedCalenderData,
}) => {
  const positionsdata = useSelector(
    (state: RootState) => state.strategy.positions
  );
  const openPositionsLength =
    positionsdata &&
    positionsdata?.length > 0 &&
    positionsdata?.filter(
      (position) =>
        position?.transaction_type === "SHORT" ||
        position?.transaction_type === "LONG"
    )?.length;

  const userEmail = useSelector((state: RootState) => state.common.userInfo);
  const isPrivilegedUser = config.userEmail.includes(userEmail?.email);
  const StrategiesPnl = useSelector(
    (state: RootState) => state.SimulationDemo.strategiesPnlDemo
  );
  const dispatch = useDispatch();
  const router = useRouter();

  const strategyOptions = [
    { label: "Intraday", value: "INTRADAY" },
    { label: "Swing", value: "SWING" },
    { label: "Scalper", value: "SCALPER" },
    { label: "Arbitrage", value: "ARBITRAGE" },
  ];
  const selectedPositionType = useSelector(
    (state: RootState) => state.SimulationDemo.positionType
  );

  const handlerefresh = () => {
    const fetchApi = new UserBrokerRouterApi(baseConfig());
    fetchApi
      .getAllDataV1UsersMeBrokersBrokerCodeGetAllDataGet(brokerCode)
      .then((response) => {
        dispatch(setPositionTypes(""));
        dispatch(setHoldingsTypes(""));
        dispatch(setStrategiesPnlRefresh(true));
        dispatch(
          setPositions({
            positions: response?.data?.positions?.positions,
            positionPnl: response?.data?.positions?.total_pnl,
            positionpnlpercent: response?.data?.positions?.total_pnl_percent,
          })
        );
        dispatch(
          setLastUpdatedPositions({
            data: response?.data?.positions,
            time: Date.now(),
          })
        );
        dispatch(
          setLastUpdatedHoldings({
            data: response?.data?.holdings,
            time: Date.now(),
          })
        );
        const Positions = response?.data?.positions?.positions;
        Positions?.forEach((item: any) => {
          // Dispatch updateSymbolData action with LTP and other details for websocket Live data

          // Dispatch addSymbol action with the symbol and token
          dispatch(
            addSymbol({
              symbol: item?.identifier,
              // token: item?.token,
            })
          );
          dispatch(
            updateSymbolPnl({
              symbol: item?.identifier,
              pnl: item?.pnl,
            })
          );
        });
        dispatch(setFundsData({ fundsData: response?.data?.funds }));
        dispatch(setHoldingsData({ holdingsData: response?.data?.holdings }));
        dispatch(setIdentifiersSet(false));
      })
      .catch((error: any) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  };
  const NimaClick = () => {
    dispatch(setScreenerQuery("Analyze my portfolio"));
    dispatch(setNimaGpt("portfolio"));
    dispatch(setScreenerOpen(true));
    dispatch(setCurrentSection(null));
  };

  return (
    <div
      className="flex flex-row justify-between max-xl:sticky max-xl:top-0 max-xl:z-[50]"
      onDoubleClick={() => WidthAdjusterDoubleClick(leftWidth, setLeftWidth)}
    >
      <h1 className="px-4 py-2 font-heading max-md:text-[1rem] md:text-xl md:max-xl:px-6 md:max-xl:py-3">
        {HistoryClicked ? (
          <>
            <span>History</span>
            <Back onclick={handleBack} />
          </>
        ) : (
          `Positions ${positionsdata && positionsdata?.length !== 0 && positionsdata?.length != null && openPositionsLength != 0 ? ` (${openPositionsLength})` : ""}`
        )}
      </h1>

      <div
        className={`flex ${isPrivilegedUser && leftWidth >= 40 && StrategiesPnl != null ? " h-10 w-[13rem] 2xl:w-[19rem] " : "h-10 w-[13rem]"}  flex-row items-center justify-between  max-sm:justify-end  md:max-xl:w-[15rem] `}
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        <div
          className={` pt-1 md:max-xl:w-[10.5rem] md:max-xl:pt-3 ${
            HistoryClicked == true
              ? "invisible"
              : "flex  flex-row items-center justify-between gap-1 max-sm:justify-end"
          } ${isPrivilegedUser && leftWidth >= 40 && StrategiesPnl != null ? " h-10 w-[9.5rem] gap-1 2xl:w-[17rem]" : "h-10 w-[9.5rem]"} `}
        >
          {isPrivilegedUser && leftWidth >= 40 && StrategiesPnl != null && (
            <div className="max-2xl:hidden 2xl:flex">
              {" "}
              <Select
                options={strategyOptions}
                value={selectedPositionType}
                onChange={(value) => dispatch(setPositionTypes(value))}
                placeholder={"Demo"}
                className="h-6 cursor-pointer rounded-lg border border-2 text-[0.75rem] max-md:text-[0.6rem] sm:max-md:rounded-full sm:max-md:px-[0.14rem] sm:max-md:py-[0.3rem] md:max-xl:px-[0.6rem] md:max-xl:py-[0.6rem]"
              />
            </div>
          )}
          <Nimabutton onClick={NimaClick} />
          <PositionHistory setHistoryClicked={handleHistoryClick} />
          <PositionsSharing
            brokerCode={brokerCode}
            setHistoryClicked={() => setShowModal(true)}
            setHasFetchedCalenderData={setHasFetchedCalenderData}
          />{" "}
        </div>

        <div
          className="flex h-10 flex-row items-center  sm:w-[4rem] sm:justify-between md:max-2xl:w-[4.5rem]  md:max-xl:pt-2.5 2xl:w-[5rem] "
          onDoubleClick={(event: any) => {
            event.stopPropagation();
          }}
        >
          {!HistoryClicked && <RefreshButton onClick={handlerefresh} />}

          <RemoveButton hideInMobile="max-sm:hidden" />
        </div>
      </div>
    </div>
  );
};

export default PositionsHeader;
