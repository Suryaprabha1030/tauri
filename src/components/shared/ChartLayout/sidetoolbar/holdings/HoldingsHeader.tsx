import React from "react";
import Headings from "../sharedContent/headings";
import RefreshButton from "../refresh";
import RemoveButton from "../sharedContent/RemoveButton";
import {
  setFundsData,
  setHoldingsData,
  setPositions,
} from "@/lib/redux/slices/StrategySlice";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { UserBrokerRouterApi } from "@/lib/api/base";
import { useDispatch, useSelector } from "react-redux";
import { WidthAdjusterDoubleClick } from "@/lib/util/sideToolBar/sidetoolbarCommon";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";
import { setIdentifiersSet } from "@/lib/redux/slices/PositionSlicer";
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
import { RootState } from "@/lib/redux/Store";
import config from "@/lib/config";
import Select from "@/components/shared/SelectDropdown";
import {
  setHoldingsTypes,
  setPositionTypes,
} from "@/lib/redux/slices/SimulationSlice";

interface HoldingsHeaderProps {
  dataholding: any[];
  brokerCode: number | null;
  leftWidth: number;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
}
const HoldingsHeader: React.FC<HoldingsHeaderProps> = ({
  dataholding,
  brokerCode,
  leftWidth,
  setLeftWidth,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userEmail = useSelector((state: RootState) => state.common.userInfo);
  const isPrivilegedUser = config.userEmail.includes(userEmail?.email);
  const strategyOptions = [
    { label: "Short Term", value: "shortTermInvestor" },
    { label: "Long Term", value: "longTermInvestor" },
    { label: "ETF Focused", value: "etfInvestor" },
    { label: "HNI", value: "hniInvestor" },
    { label: "Hybrid", value: "hybridInvestor" },
  ];
  const selectedHoldingsType = useSelector(
    (state: RootState) => state.SimulationDemo.holdingsType
  );

  const handlerefresh = () => {
    const fetchApi = new UserBrokerRouterApi(baseConfig());
    fetchApi
      .getAllDataV1UsersMeBrokersBrokerCodeGetAllDataGet(brokerCode)
      .then((response) => {
        dispatch(setHoldingsTypes(""));
        dispatch(setPositionTypes(""));
        dispatch(setHoldingsData({ holdingsData: response.data.holdings }));
        dispatch(
          setPositions({
            positions: response.data.positions.positions,
            positionPnl: response.data.positions.total_pnl,
            positionpnlpercent: response.data.positions.total_pnl_percent,
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
        dispatch(setFundsData({ fundsData: response.data.funds }));
        dispatch(setIdentifiersSet(false));
      })
      .catch((err: any) => {
        if (err?.response && err?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (err?.response && err?.response?.status == 456) {
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
      className="flex w-full flex-row justify-between sm:max-xl:sticky sm:max-xl:top-0 md:max-xl:py-1"
      onDoubleClick={() => WidthAdjusterDoubleClick(leftWidth, setLeftWidth)}
    >
      <Headings
        name={`Holdings ${dataholding && dataholding?.length !== 0 ? ` (${dataholding?.length})` : ""}`}
      />
      <div
        className={`flex  ${isPrivilegedUser && leftWidth >= 40 ? "sm:w-[8rem] 2xl:w-[15rem] " : "sm:w-[8rem]"} flex-row items-center gap-2  md:max-xl:w-[8.5rem] md:max-xl:pt-0.5`}
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        {isPrivilegedUser && leftWidth >= 40 && (
          <div className="max-2xl:hidden 2xl:flex">
            {" "}
            <Select
              options={strategyOptions}
              value={selectedHoldingsType}
              onChange={(value) => dispatch(setHoldingsTypes(value))}
              placeholder={"Demo"}
              className="h-6 cursor-pointer rounded-lg border border-2 text-[0.75rem] max-md:text-[0.6rem] sm:max-md:rounded-full sm:max-md:px-[0.14rem] sm:max-md:py-[0.3rem] md:max-xl:px-[0.6rem] md:max-xl:py-[0.6rem]"
            />
          </div>
        )}
        <Nimabutton onClick={NimaClick} />
        {/* {dataholding && dataholding.length > 0 && ( */}
        <RefreshButton onClick={handlerefresh} />
        {/* )} */}

        <RemoveButton hideInMobile="max-sm:hidden" />
      </div>
    </div>
  );
};

export default HoldingsHeader;
