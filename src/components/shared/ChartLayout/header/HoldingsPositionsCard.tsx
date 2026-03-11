import {
  setCurrentHoldingsvalue,
  setCurrentSection,
} from "@/lib/redux/slices/CommonSlice";

import { tvWidget } from "@/components/tradingView/chartSetup";
import {
  setTotalPnl,
  updateSymbolPnl,
} from "@/lib/redux/slices/PositionSlicer";
import { addSymbol, updateSymbolData } from "@/lib/redux/slices/StrategySlice";
import { RootState } from "@/lib/redux/Store";
import { formatNumber } from "@/lib/util/DraftUtil";

import { calculateHoldingsPnL } from "@/lib/util/sideToolBar/holdingsUtil";
import { updatePositionsWithPnL } from "@/lib/util/sideToolBar/positions/managePositionsData";
import { IconKey } from "@/lib/util/sideToolBar/RightToolBarIcons";
import { useRouter } from "next/navigation";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

interface HoldingsPositionsCardProps {
  holdingsdata: any;
  positionsdata: any;
}
const HoldingsPositionsCard: React.FC<HoldingsPositionsCardProps> = ({
  holdingsdata,
  positionsdata,
}) => {
  const [totalProfitAndLoss, setTotalProfitAndLoss] = useState<
    number | undefined
  >(undefined);
  const [totalProfitAndLossPercent, setTotalProfitAndLossPercent] = useState<
    number | undefined
  >();
  const [positionsData, setPositionsData] = useState([]);

  const [positionpnlpercent, setpositionpnlpercent] = useState<
    number | undefined
  >();
  const [positionPnl, setpositionPnl] = useState<number | undefined>();
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  const TotpositionPnl = useSelector(
    (state: RootState) => state.strategy.positionPnl
  );
  const Totpositionpnlpercent = useSelector(
    (state: RootState) => state.strategy.positionpnlpercent
  );
  const HoldingscurrentValue: any = useSelector(
    (state: RootState) => state.common.currentHoldingsValue
  );
  const currentSection = useSelector(
    (state: RootState) => state.common.currentSection
  );
  const currentBrokerName = useSelector(
    (state: RootState) => state.Position.BrokerName
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const openPositionsLength =
    positionsdata &&
    positionsdata?.length > 0 &&
    positionsdata?.filter(
      (position) =>
        position?.transaction_type === "SHORT" ||
        position?.transaction_type === "LONG"
    )?.length;

  const toggleholdings = () => {
    if (currentSection == IconKey.Holdings) {
      dispatch(setCurrentSection(null));
    } else {
      dispatch(setCurrentSection(IconKey.Holdings));
    }
  };
  const togglepositions = () => {
    if (currentSection == IconKey.Positions) {
      dispatch(setCurrentSection(null));
    } else {
      dispatch(setCurrentSection(IconKey.Positions));
    }
  };

  //positions data setted for state
  useEffect(() => {
    if (positionsdata && positionsdata?.length > 0) {
      setPositionsData(positionsdata);
      setpositionPnl(TotpositionPnl);
      setpositionpnlpercent(Totpositionpnlpercent);
    } else if (positionsdata?.length == 0 || positionsdata == null) {
      setPositionsData([]);
      setpositionPnl(undefined);
      setpositionpnlpercent(undefined);
    }
  }, [positionsdata]);

  // holding data setted for state
  useEffect(() => {
    if (
      holdingsdata &&
      holdingsdata?.holdings &&
      holdingsdata?.holdings.length > 0
    ) {
      setTotalProfitAndLoss(holdingsdata?.total_profit_and_loss);
      setTotalProfitAndLossPercent(holdingsdata?.total_profit_and_loss_percent);
    } else if (holdingsdata && holdingsdata?.holdings == undefined) {
      setTotalProfitAndLoss(undefined);
      setTotalProfitAndLossPercent(undefined);
    }
  }, [holdingsdata]);

  useEffect(() => {
    {
      holdingsdata &&
        holdingsdata.holdings &&
        holdingsdata.holdings.map((holding: any) => {
          dispatch(
            addSymbol({
              symbol: holding?.identifier,
              // token: holding.token
            })
          );
        });
    }
  }, [holdingsdata]);
  useEffect(() => {
    {
      positionsData &&
        positionsData.map((position: any) =>
          dispatch(
            addSymbol({
              symbol: position?.identifier,
              // token: (position as any).token,
            })
          )
        );
    }
  }, [positionsData]);

  useEffect(() => {
    if (
      holdingsdata &&
      holdingsdata?.holdings &&
      holdingsdata?.holdings.length > 0
    ) {
      const { totalPnL, totalPnLPercent, currentValue, updatedHoldings } =
        calculateHoldingsPnL(
          holdingsdata?.holdings,
          webSocketDataRead,
          holdingsdata?.total_invested_value
        );
      setTotalProfitAndLoss(totalPnL);
      setTotalProfitAndLossPercent(totalPnLPercent);
      dispatch(setCurrentHoldingsvalue(currentValue));
      //For updating Live Pnl
      updatedHoldings?.forEach((stock) => {
        dispatch(
          updateSymbolPnl({
            symbol: stock?.identifier,
            pnl: stock?.profit_and_loss,
          })
        );
      });
    }
  }, [webSocketDataRead, holdingsdata]);

  useEffect(() => {
    if (!positionsdata || !webSocketDataRead) return;
    const allPositionsExited = positionsdata.every(
      (position: any) =>
        position.quantity === 0 && position.transaction_type === "EXITED"
    );
    if (allPositionsExited) return;
    else {
      const { updatedTotalPnl, updatedPositions } = updatePositionsWithPnL(
        positionsdata,
        webSocketDataRead,
        currentBrokerName
      );
      setpositionPnl(updatedTotalPnl);
      //For updating Live Pnl
      updatedPositions?.forEach((stock) => {
        dispatch(
          updateSymbolPnl({
            symbol: stock?.identifier,
            pnl: stock?.pnl,
          })
        );
      });
    }
  }, [webSocketDataRead, positionsdata]);

  useEffect(() => {
    dispatch(
      setTotalPnl({
        totHoldingsPnl: totalProfitAndLoss,
        totPositionsPnl: positionPnl,
      })
    );
  }, [totalProfitAndLoss, positionPnl]);

  return (
    <div className="wrapper flex flex-row gap-[0.5rem] text-black max-xl:hidden">
      <div className="h-full w-[16.5rem] items-center justify-between rounded-xl border-2 border-z-br-gray px-2 ">
        <div className="flex h-full flex-row  justify-between gap-1 py-1">
          <div
            className="flex h-full w-1/2 cursor-pointer flex-col gap-1"
            onClick={togglepositions}
          >
            <p className="flex flex-row items-center justify-center gap-1 text-center text-[0.8rem]">
              Positions
              {positionsdata != null &&
                positionsData &&
                positionsData?.length > 0 &&
                openPositionsLength != 0 &&
                openPositionsLength > 0 && (
                  <span className=" min-w-5 rounded-full bg-gray-500 px-1.5 text-center text-[0.7rem] font-medium text-white">
                    {openPositionsLength}
                  </span>
                )}
            </p>
            {positionsData && positionsData?.length > 0 ? (
              <div className="flex h-[0.8rem] w-[7rem] flex-row  justify-center gap-1 ">
                <React.Fragment>
                  <p
                    className={`w-[4rem] ${positionPnl == 0 ? "text-gray-500" : "text-black"}  whitespace-nowrap rounded-2xl text-center text-[0.8rem] `}
                  >
                    {positionsdata && positionPnl !== undefined
                      ? positionPnl > 0
                        ? `+${formatNumber(positionPnl)}`
                        : formatNumber(positionPnl)
                      : ""}
                  </p>
                  {positionsdata && positionpnlpercent != null && (
                    <p
                      className={`text-center text-[0.7rem] ${
                        positionsdata &&
                        positionpnlpercent &&
                        positionpnlpercent < 0
                          ? "text-red-400"
                          : positionsdata &&
                              positionpnlpercent &&
                              positionpnlpercent > 0
                            ? "text-z-green-500"
                            : "text-gray-500"
                      }`}
                    ></p>
                  )}
                </React.Fragment>
              </div>
            ) : (
              <p className="h-[0.8rem] text-center text-[0.8rem]">--</p>
            )}
          </div>
          <div className="h-10 border-l-2 border-gray-200"> </div>
          <div
            className="wrapper flex h-full w-1/2 cursor-pointer flex-col gap-1 "
            onClick={toggleholdings}
          >
            <p className="flex flex-row items-center justify-center gap-1 text-center text-[0.8rem]">
              Holdings{" "}
              {holdingsdata &&
                holdingsdata?.holdings &&
                holdingsdata?.holdings?.length > 0 && (
                  <span className=" min-w-5 rounded-full bg-gray-500 px-1.5 text-center text-[0.7rem] font-medium text-white">
                    {holdingsdata?.holdings?.length}
                  </span>
                )}
            </p>
            {holdingsdata &&
            holdingsdata?.holdings &&
            holdingsdata?.holdings?.length > 0 ? (
              <div className="flex  w-[7rem] flex-row items-center justify-center gap-1  text-center">
                <p
                  className={` w-[4rem] whitespace-nowrap rounded-2xl text-right text-[0.8rem] text-black`}
                >
                  {HoldingscurrentValue !== undefined &&
                  HoldingscurrentValue !== null
                    ? formatNumber(HoldingscurrentValue)
                    : ""}
                </p>
                <p
                  className={`w-[3rem] text-left text-[0.7rem] ${
                    totalProfitAndLoss && totalProfitAndLoss < 0
                      ? "text-red-400"
                      : totalProfitAndLoss && totalProfitAndLoss > 0
                        ? "text-z-green-500"
                        : "text-gray-500"
                  }`}
                >
                  <span>({totalProfitAndLossPercent?.toFixed(2)}%)</span>
                </p>
              </div>
            ) : (
              <p className="h-[0.8rem] text-center text-[0.8rem]">-- </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingsPositionsCard;
