import React from "react";
import Headings from "../sharedContent/headings";
import RefreshButton from "../refresh";
import RemoveButton from "../sharedContent/RemoveButton";
import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  setFundsData,
  setHoldingsData,
  setPositions,
} from "@/lib/redux/slices/StrategySlice";
import { useDispatch } from "react-redux";
import { WidthAdjusterDoubleClick } from "@/lib/util/sideToolBar/sidetoolbarCommon";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";
import { setIdentifiersSet } from "@/lib/redux/slices/PositionSlicer";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import {
  setLastUpdatedHoldings,
  setLastUpdatedPositions,
} from "@/lib/redux/slices/screenerSlice";

interface FundsHeaderProps {
  fundsData: any[];
  brokerCode: number | null;
  leftWidth: number;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
}
const FundsHeaders: React.FC<FundsHeaderProps> = ({
  fundsData,
  brokerCode,
  leftWidth,
  setLeftWidth,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const handlerefresh = () => {
    const fetchApi = new UserBrokerRouterApi(baseConfig());
    fetchApi
      .getAllDataV1UsersMeBrokersBrokerCodeGetAllDataGet(brokerCode)
      .then((response) => {
        dispatch(setFundsData({ fundsData: response.data.funds }));
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

  return (
    <div
      className="flex flex-row justify-between sm:max-xl:sticky sm:max-xl:top-0 md:max-xl:py-1"
      onDoubleClick={() => WidthAdjusterDoubleClick(leftWidth, setLeftWidth)}
    >
      <Headings name="Funds" />
      <div
        className="flex w-[4.5rem] flex-row items-center justify-between max-md:w-[4rem] md:max-xl:pb-0.5"
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        {fundsData && <RefreshButton onClick={handlerefresh} />}
        <RemoveButton />
      </div>
    </div>
  );
};

export default FundsHeaders;
