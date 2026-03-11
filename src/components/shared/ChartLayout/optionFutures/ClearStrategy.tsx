import {
  getFutTargetltpData,
  getFutureData,
  getOptionData,
  getOptTargetltpData,
  optionChainPayload,
  setSandboxDataObj,
  setSelectedStrategy,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";
import {
  getCachedApiData,
  getCalcData,
  getLastApiCallTime,
  getTempInputValues,
  minimizeStatus,
} from "@/lib/redux/slices/OptionChainSlice";
import {
  cardResult,
  marginRequired,
} from "@/lib/redux/slices/PayoffChartSlice";
import { setAnalyzeOrderStocks } from "@/lib/redux/slices/PlaceOrder";
import {
  getInputValue,
  getMinExpiryDate,
  getMultiOiLoad,
  getPayOffChartPayLoad,
  getStraddleChartData,
  getStrangleOiLoad,
} from "@/lib/redux/slices/StrategyChartSlice";
import { RootState } from "@/lib/redux/Store";

import React, { Dispatch } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

interface ClearStrategyProps {
  setEntryPriceData: Dispatch<React.SetStateAction<any>>;
  setCheckedOptionData: Dispatch<React.SetStateAction<any>>;
  setExpiryPayload: Dispatch<React.SetStateAction<any>>;
  pnlTable: boolean;
}
const ClearStrategy: React.FC<ClearStrategyProps> = ({
  setEntryPriceData,
  setCheckedOptionData,
  setExpiryPayload,
  pnlTable,
}) => {
  const dispatch = useDispatch();
  const optionDatas = useSelector(
    (state: RootState) => state.analyzer.optionDataList
  );
  const futureDatas = useSelector(
    (state: RootState) => state.analyzer.futureDataList
  );
  const positionDatas = useSelector(
    (state: RootState) => state.analyzer.PositionDataList
  );
  const handleclearStrategy = () => {
    dispatch(minimizeStatus(false));
    dispatch(setSandboxDataObj({ setSandboxData: {} }));
    dispatch(setAnalyzeOrderStocks({}));
    if (
      Object.entries(optionDatas)?.length == 0 &&
      Object.entries(futureDatas)?.length == 0 &&
      Object.entries(positionDatas)?.length > 0
    ) {
      dispatch(showPositionTable(true));
      dispatch(showStrategyTable(false));
      dispatch(showPnlTable(false));
      dispatch(showDraftPositions(false));
    }

    if (
      Object.entries(optionDatas)?.length > 0 ||
      Object.entries(futureDatas)?.length > 0
    ) {
      if (
        (Object.entries(optionDatas)?.length > 0 ||
          Object.entries(futureDatas)?.length > 0) &&
        Object.entries(positionDatas)?.length == 0
      ) {
        setTimeout(() => {
          dispatch(getPayOffChartPayLoad({}));
          dispatch(getMultiOiLoad([]));
          dispatch(getStrangleOiLoad({}));
          dispatch(getMinExpiryDate(null));
          setExpiryPayload(null);
          dispatch(getInputValue(null));

          dispatch(setSelectedStrategy({ setselectedStrategy: null }));
          dispatch(getOptionData({ optionData: {} }));
          dispatch(getFutureData({ futureData: {} }));
          dispatch(getCalcData([]));
          dispatch(getStraddleChartData({}));
          dispatch(getOptTargetltpData({ OptTargetLtpData: {} }));
          dispatch(getFutTargetltpData({ FutTargetLtpData: {} }));
          dispatch(
            optionChainPayload({
              optionChainPayloadData: { ClickedRow: {}, response: {} },
            })
          );
          dispatch(getTempInputValues({}));
          setEntryPriceData({});
          setCheckedOptionData({});
          dispatch(cardResult({}));
          dispatch(marginRequired(null));
          dispatch(getCachedApiData([]));
          dispatch(getLastApiCallTime(0));
        }, 100);
      }
      setTimeout(() => {
        dispatch(getOptionData({ optionData: {} }));
        dispatch(getFutureData({ futureData: {} }));
        dispatch(getOptTargetltpData({ OptTargetLtpData: {} }));
        dispatch(getFutTargetltpData({ FutTargetLtpData: {} }));
        if (Object.entries(positionDatas)?.length > 0) {
          dispatch(showPositionTable(true));
          dispatch(showStrategyTable(false));
          dispatch(showPnlTable(false));
          dispatch(showDraftPositions(false));
        }

        dispatch(
          optionChainPayload({
            optionChainPayloadData: { ClickedRow: {}, response: {} },
          })
        );

        dispatch(getTempInputValues({}));
        setEntryPriceData({});

        setCheckedOptionData({});
      }, 100);
    }
  };
  return (
    <div
      className={`relative  flex cursor-pointer items-center justify-center rounded-2xl bg-gray-100 py-[0.2rem] text-[0.75rem] font-medium backdrop-blur-3xl max-sm:w-[3rem]  max-sm:text-[0.65rem] sm:max-lg:w-[4rem] lg:max-xl:px-4 xl:max-2xl:w-[3.5rem] 2xl:px-3 ${
        pnlTable ? "max-sm:hidden" : ""
      }`}
      onClick={handleclearStrategy}
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      Clear
    </div>
  );
};

export default ClearStrategy;
