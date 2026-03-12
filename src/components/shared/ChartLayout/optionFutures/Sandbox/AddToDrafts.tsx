import { StrategiesSandboxRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  getFutTargetltpData,
  getFutureData,
  getOptionData,
  getOptTargetltpData,
  optionChainPayload,
  setExpandSelectedSandbox,
  setSelectedStrategy,
  setShowSelectedSandboxName,
  showAllSandboxNames,
  showDraftPositions,
} from "@/lib/redux/slices/AnalyzerSlice";
import React, { Dispatch, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { constructRequestBody } from "@/lib/util/DraftUtil";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";

import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useNavigate } from "react-router-dom";
import {
  getMultiOiLoad,
  getPayOffChartPayLoad,
  getStrangleOiLoad,
} from "@/lib/redux/slices/StrategyChartSlice";
import { ChartToggleButtonType } from "@/lib/util/oi/oiUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface AddToDraftsProps {
  draftData: any;
  DraftName: any;
  setCheckedOptionData: Dispatch<React.SetStateAction<any>>;
  enableButtons: boolean;
  setActive: Dispatch<React.SetStateAction<any>>;
}

const AddToDrafts: React.FC<AddToDraftsProps> = ({
  draftData,
  DraftName,
  setCheckedOptionData,
  enableButtons,
  setActive,
}) => {
  const dispatch = useDispatch();
  const [hoverImage, setHoverImage] = useState(true);
  const indexname = useSelector((state: RootState) => state.strategy.indexName);
  const optionDatas = useSelector(
    (state: RootState) => state.analyzer.optionDataList,
  );
  const futureDatas = useSelector(
    (state: RootState) => state.analyzer.futureDataList,
  );
  const positionDatas = useSelector(
    (state: RootState) => state.analyzer.PositionDataList,
  );
  const handleAddToDraft = async () => {
    setActive(ChartToggleButtonType.Chart);
    dispatch(setSelectedStrategy({ setselectedStrategy: null }));
    dispatch(showAllSandboxNames(true));
  };
  const router = useNavigate();
  const clearStreategyTable = () => {
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
          dispatch(getOptionData({ optionData: {} }));
          dispatch(getFutureData({ futureData: {} }));
          dispatch(getOptTargetltpData({ OptTargetLtpData: {} }));
          dispatch(getFutTargetltpData({ FutTargetLtpData: {} }));
          dispatch(
            optionChainPayload({
              optionChainPayloadData: { ClickedRow: {}, response: {} },
            }),
          );

          setCheckedOptionData({});
        }, 100);
      }
      setTimeout(() => {
        dispatch(getOptionData({ optionData: {} }));
        dispatch(getFutureData({ futureData: {} }));
        dispatch(getOptTargetltpData({ OptTargetLtpData: {} }));
        dispatch(getFutTargetltpData({ FutTargetLtpData: {} }));
        dispatch(
          optionChainPayload({
            optionChainPayloadData: { ClickedRow: {}, response: {} },
          }),
        );

        setCheckedOptionData({});
      }, 100);
    }
  };
  const fetchData = () => {
    const payloadrequest = constructRequestBody(
      draftData,
      DraftName,
      false,
      indexname,
    );

    const DraftPositions = new StrategiesSandboxRouterApi(baseConfig());
    DraftPositions.createSandboxV1UsersMeSandboxesPost(payloadrequest)
      .then((res) => {
        //positions added to the Draft Positions
        dispatch(setSelectedStrategy({ setselectedStrategy: res?.data }));
        dispatch(setExpandSelectedSandbox(true));
        dispatch(showDraftPositions(true));
        clearStreategyTable();
        dispatch(
          setShowSelectedSandboxName({
            setSelectedSandboxName: res?.data?.name,
            setSelectedSandboxId: res?.data?.id,
          }),
        );
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

  useEffect(() => {
    if (
      draftData &&
      Object.entries(draftData).length > 0 &&
      DraftName &&
      DraftName.length > 0
    ) {
      fetchData();
    }
  }, [DraftName]);

  return (
    <button
      id="Draft_Positions"
      className={`flex items-center justify-center gap-1 rounded-3xl border text-[0.75rem] font-medium leading-none max-sm:w-[4.5rem] max-sm:p-1 max-sm:text-[0.65rem] sm:max-xl:pr-1 sm:max-lg:py-1.5 sm:max-md:w-[5.5rem] md:h-7 md:max-2xl:w-[5.8rem] xl:w-[6rem] xl:p-2 xl:max-2xl:pr-3 ${
        enableButtons
          ? "border-z-green-500 text-z-green-500 hover:bg-z-green-500 hover:text-white"
          : "pointer-events-none border-z-green-500 text-z-green-500 opacity-50"
      }`}
      onClick={enableButtons ? handleAddToDraft : undefined}
      onTouchStart={enableButtons ? handleAddToDraft : undefined}
      onMouseEnter={() => setHoverImage(false)}
      onMouseLeave={() => setHoverImage(true)}
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      <img
        src={hoverImage ? "/svg/plusSymbol.svg" : "/svg/whiteAdd.svg"}
        width={15}
        height={15}
        alt=""
        className="max-sm:h-[0.6rem] max-sm:w-[0.6rem] sm:max-md:h-[0.8rem] sm:max-md:w-[0.8rem] md:max-xl:mb-0.5 md:max-xl:h-[0.9rem] md:max-xl:w-[0.9rem]"
      />
      Sandbox
    </button>
  );
};

export default AddToDrafts;
