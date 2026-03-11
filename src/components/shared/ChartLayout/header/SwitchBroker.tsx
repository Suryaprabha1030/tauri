"use client";

import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import config from "@/lib/config";
import {
  checkPosition,
  getCheckedPositionData,
  getFutTargetltpData,
  getFutureData,
  getOptionData,
  getOptTargetltpData,
  getSelectPositionData,
  getUpdatedTargetltpData,
  optionChainPayload,
  setSelectedStrategy,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";
import {
  setScreenerOpen,
  setShowSwitchbroker,
  setStockInfoOpen,
  setUserInfo,
} from "@/lib/redux/slices/CommonSlice";
import {
  getCalcData,
  getQuery,
  getTempInputValues,
} from "@/lib/redux/slices/OptionChainSlice";
import { setStockData } from "@/lib/redux/slices/PlaceOrder";
import { getProfileDetail, setUserId } from "@/lib/redux/slices/PositionSlicer";
import {
  setHoldingsTypes,
  setOrdersDemoEnabled,
  setPositionTypes,
} from "@/lib/redux/slices/SimulationSlice";
import {
  getInputValue,
  getMaxPainStrikeValue,
  getMinExpiryDate,
  getMultiOiLoad,
  getPayOffChartPayLoad,
  getStrangleOiLoad,
} from "@/lib/redux/slices/StrategyChartSlice";
import {
  addCartSuccess,
  getIndexName,
  indicesAlldata,
  setHoldingsData,
  setPositions,
  setSettingsData,
} from "@/lib/redux/slices/StrategySlice";

import { RootState } from "@/lib/redux/Store";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { Dispatch, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

interface SwitchBrokerProps {
  brokerCode: number | null;
  setBrokerCode: Dispatch<React.SetStateAction<any>>;
  setEntryPriceData: Dispatch<React.SetStateAction<any>>;
  setCheckedOptionData: Dispatch<React.SetStateAction<any>>;
  setExpiryPayload: Dispatch<React.SetStateAction<any>>;
}

const SwitchBroker: React.FC<SwitchBrokerProps> = ({
  brokerCode,
  setEntryPriceData,
  setCheckedOptionData,
  setExpiryPayload,
  setBrokerCode,
}) => {
  const [brokerClientInfos, setBrokerClientInfos] = useState<any[]>([]);
  const [brokerFloating, setBrokerFloating] = useState(false);
  const currentBrokerName = useSelector(
    (state: RootState) => state.Position.BrokerName,
  );
  const currentBrokerClientCode = useSelector(
    (state: RootState) => state.Position.ClientCode,
  );
  const showSwitchbroker = useSelector(
    (state: RootState) => state.common.showSwitchbroker,
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const addbrokerRef = useRef<HTMLDivElement>(null);

  const fetchBrokers = async (fetchAllProfiles = false) => {
    const brokerapi = new UserBrokerRouterApi(baseConfig());

    try {
      const res = await brokerapi.fetchMyBrokersV1UsersMeBrokersGet();
      const brokersMeta = res?.data?.brokers_meta;
      const userMappings = res?.data?.user_broker_mapping;
      const userEmail = res?.data?.email;
      dispatch(setUserInfo(res?.data));
      dispatch(setShowSwitchbroker(config.userEmail.includes(userEmail)));
      dispatch(setUserId(res?.data?.id));

      // On initial call: fetch profile only for current brokerCode
      if (!fetchAllProfiles) {
        const currentMapping = userMappings.find(
          (m: any) => m.broker_code === brokerCode,
        );

        if (currentMapping) {
          try {
            const profileRes =
              await brokerapi.fetchMyBrokerProfileV1UsersMeBrokersBrokerCodeProfileGet(
                brokerCode,
              );

            if (profileRes?.data?.client_code) {
              const brokerMeta = brokersMeta.find(
                (b: any) => b.id === currentMapping.broker_id,
              );

              const brokerInfo = {
                brokerCode: currentMapping.broker_code,
                brokerId: currentMapping.broker_id,
                brokerName: brokerMeta?.name || "Unknown Broker",
                clientCode: profileRes.data.client_code,
              };

              setBrokerClientInfos([brokerInfo]); // only current broker

              dispatch(
                getProfileDetail({
                  ClientCode: brokerInfo.clientCode,
                  BrokerName: brokerInfo.brokerName,
                }),
              );
              dispatch(setSettingsData({ settingsData: profileRes?.data }));
            }
          } catch (profileErr: any) {
            if (profileErr?.response?.status === 401) {
              autoLogoutTokenRemove(router);
            }
            if (profileErr?.response && profileErr?.response?.status == 456) {
              brokerLogoutTokenRemove(router);
            }
          }
        }
      }

      // When explicitly asked, fetch profile for all brokers
      if (fetchAllProfiles) {
        const brokerClientDataPromises = userMappings.map(
          async (mapping: any) => {
            try {
              const profileRes =
                await brokerapi.fetchMyBrokerProfileV1UsersMeBrokersBrokerCodeProfileGet(
                  mapping.broker_code,
                );

              if (profileRes?.data?.client_code) {
                const brokerMeta = brokersMeta.find(
                  (b: any) => b.id === mapping.broker_id,
                );
                return {
                  brokerCode: mapping.broker_code,
                  brokerId: mapping.broker_id,
                  brokerName: brokerMeta?.name || "Unknown Broker",
                  clientCode: profileRes.data.client_code,
                };
              }
            } catch (profileErr: any) {
              if (profileErr?.response?.status === 401) {
                autoLogoutTokenRemove(router);
              }
              if (profileErr?.response && profileErr?.response?.status == 456) {
                brokerLogoutTokenRemove(router);
              }
              return null;
            }
          },
        );

        const brokerClientData = (
          await Promise.all(brokerClientDataPromises)
        ).filter(Boolean);
        const isPrivilegedUser = config.userEmail.includes(userEmail);
        const hostname = window.location.hostname.toLowerCase();
        const brokerFromHost = hostname?.split(".")[0];

        let filteredBrokerClientData: any[] = [];

        // If privileged user, set all data
        if (isPrivilegedUser) {
          filteredBrokerClientData = brokerClientData;
        } else {
          // Match brokerFromHost with brokerName (case insensitive match)
          filteredBrokerClientData = brokerClientData?.filter((broker) =>
            broker?.brokerName?.toLowerCase()?.includes(brokerFromHost),
          );
          if (filteredBrokerClientData.length === 0) {
            // Check if brokerFromHost matches any brokerName at all
            const hasMatch = brokerClientData?.some((broker) =>
              broker?.brokerName?.toLowerCase()?.includes(brokerFromHost),
            );

            if (!hasMatch) {
              // No matching broker found → include all brokers
              filteredBrokerClientData = brokerClientData;
            } else {
              const brokerinHost = brokerClientData?.find(
                (broker) =>
                  broker?.brokerName?.toLowerCase() === brokerFromHost,
              );
              if (brokerinHost) {
                filteredBrokerClientData = [brokerinHost];
              }
            }
          }
        }

        setBrokerClientInfos(filteredBrokerClientData);
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        autoLogoutTokenRemove(router);
      }
      if (err?.response && err?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
    }
  };

  const shownLoginComponent = async () => {
    setBrokerFloating(!brokerFloating);
    await fetchBrokers(true);
  };

  const addbroker = () => {
    dispatch(setStockData([]));
    const path = window.location.pathname;
    if (path === `${config.brokersListUrl}/${brokerCode}/psb`) {
      setTimeout(() => {
        dispatch(getOptionData({ optionData: {} }));
        dispatch(getFutureData({ futureData: {} }));
        dispatch(getOptTargetltpData({ OptTargetLtpData: {} }));
        dispatch(getFutTargetltpData({ FutTargetLtpData: {} }));
        dispatch(getCheckedPositionData({ PositionData: {} }));
        dispatch(getSelectPositionData({ selectPositionData: {} }));
        dispatch(checkPosition(false));
        dispatch(
          optionChainPayload({
            optionChainPayloadData: { ClickedRow: {}, response: {} },
          }),
        );
        dispatch(getTempInputValues({}));
        setEntryPriceData({});
        setCheckedOptionData({});
        dispatch(getPayOffChartPayLoad({}));
        dispatch(getStrangleOiLoad({}));
        dispatch(getMultiOiLoad([]));
        dispatch(getMinExpiryDate(null));
        setExpiryPayload(null);
        dispatch(getInputValue(null));
        dispatch(getMaxPainStrikeValue(null));
      }, 100);
    }
    router.push(config.brokersListUrl);
    dispatch(
      getIndexName({
        indexName: "",
        expiryDate: "",
      }),
    );
    dispatch(
      getProfileDetail({
        ClientCode: "",
        BrokerName: "",
      }),
    );
    dispatch(setStockInfoOpen(false));
  };
  const handleBrokerClick = (code: number) => {
    dispatch(setPositionTypes(""));
    dispatch(setHoldingsTypes(""));
    dispatch(setOrdersDemoEnabled(false)); //simulations states false on broker change
    dispatch(setStockInfoOpen(false));
    dispatch(getQuery(""));
    dispatch(setStockData([]));
    const path = window.location.pathname;
    dispatch(setHoldingsData({ holdingsData: [] }));
    dispatch(
      setPositions({
        positions: [],
        positionPnl: undefined,
        positionpnlpercent: undefined,
      }),
    );
    dispatch(setScreenerOpen(false));
    if (path === `${config.brokersListUrl}/${brokerCode}/psb`) {
      sessionStorage.setItem("brokerCode", "");
      sessionStorage.setItem("brokerCode", String(code));

      router.push(`${config.brokersListUrl}/${code}/psb`);

      setTimeout(() => {
        dispatch(getOptionData({ optionData: {} }));
        dispatch(getFutureData({ futureData: {} }));
        dispatch(getOptTargetltpData({ OptTargetLtpData: {} }));
        dispatch(getFutTargetltpData({ FutTargetLtpData: {} }));
        dispatch(getCheckedPositionData({ PositionData: {} }));
        dispatch(getSelectPositionData({ selectPositionData: {} }));
        dispatch(checkPosition(false));
        dispatch(
          optionChainPayload({
            optionChainPayloadData: { ClickedRow: {}, response: {} },
          }),
        );
        dispatch(getTempInputValues({}));
        setEntryPriceData({});
        setCheckedOptionData({});
        dispatch(getPayOffChartPayLoad({}));
        dispatch(getMultiOiLoad([]));
        dispatch(getStrangleOiLoad({}));
        dispatch(getMinExpiryDate(null));
        setExpiryPayload(null);
        dispatch(getInputValue(null));
        dispatch(
          getIndexName({
            indexName: "",
            expiryDate: "",
          }),
        );
      }, 100);
      dispatch(setSelectedStrategy({ setselectedStrategy: null }));
      dispatch(showDraftPositions(false));
      dispatch(showStrategyTable(true));
      dispatch(showPositionTable(false));
      dispatch(showPnlTable(false));
      dispatch(getCalcData([]));
      dispatch(getMaxPainStrikeValue(null));
    } else if (path === `${config.brokersListUrl}/${brokerCode}/psv`) {
      router.push(`${config.brokersListUrl}/${code}/psv`);
      sessionStorage.setItem("brokerCode", "");
      sessionStorage.setItem("brokerCode", String(code));
    } else if (path === `${config.brokersListUrl}/${brokerCode}/oi`) {
      router.push(`${config.brokersListUrl}/${code}/oi`);
      dispatch(getMaxPainStrikeValue(null));
    }
  };

  useEffect(() => {
    if (brokerCode != null) fetchBrokers(false);
  }, [brokerCode]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        addbrokerRef.current &&
        !addbrokerRef.current.contains(event.target)
      ) {
        setBrokerFloating(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="group relative inline-block flex h-[3rem] w-[6rem] flex-col justify-center rounded-xl bg-white max-md:w-[5rem] xl:px-2">
      <span className="flex flex-row items-center gap-0.5 font-semibold max-xl:text-[0.9rem] xl:text-[0.85rem]">
        {currentBrokerName}
        {/* {showSwitchbroker && ( */}
        <img
          src={"/svg/arrowFall.svg"}
          className="w-[1.3rem] cursor-pointer max-xl:pt-[0.1rem]"
          height={20}
          width={20}
          alt={""}
          onClick={shownLoginComponent}
        />
        {/* )} */}
      </span>

      <span className="flex text-[0.75rem] max-xl:hidden">
        {currentBrokerClientCode}
      </span>

      {brokerFloating && brokerClientInfos.length > 0 && (
        <div
          ref={addbrokerRef}
          className="absolute bottom-0 z-[10002] flex flex-col items-center overflow-y-scroll rounded-lg border-2 border-z-br-gray bg-white bg-opacity-100 shadow-2xl scrollbar-none max-xl:right-[-3rem] max-xl:top-[3.4rem] max-md:h-[5rem] max-md:w-[9rem] md:max-xl:h-[6rem] md:max-lg:w-[9.5rem] lg:h-[7rem] lg:max-xl:w-[9.5rem] xl:left-5 xl:w-[12rem] xl:max-2xl:top-[2.7rem] 2xl:top-9"
        >
          <div
            className="sticky top-0 flex w-full cursor-pointer flex-row items-center bg-z-green-500 text-center max-xl:justify-start max-md:gap-[0.2rem] max-md:px-1 max-md:py-1 md:max-xl:px-2 md:max-xl:py-2 md:max-lg:gap-[0.4rem] lg:max-xl:gap-[0.5rem] xl:justify-between xl:px-6 xl:py-2"
            onClick={addbroker}
          >
            <img
              src="/svg/whiteAdd.svg"
              className="max-sm:h-[0.7rem] max-sm:w-[0.7rem] sm:max-md:h-[0.85rem] sm:max-md:w-[0.85rem] md:max-lg:h-[0.9rem] md:max-lg:w-[0.9rem] lg:max-xl:h-[0.95rem] lg:max-xl:w-[0.95rem] xl:h-[1rem] xl:w-[1rem]"
              width="20"
              height="20"
              alt="plus"
            />
            <h1 className="text-white max-md:text-[0.7rem] md:max-lg:text-[0.75rem] lg:max-xl:text-[0.75rem] xl:text-[0.85rem] ">
              Connect Accounts
            </h1>
          </div>
          <div className="h-[1.5rem] w-full text-center">
            {brokerClientInfos
              .filter((info) => info.brokerCode !== brokerCode)
              .map((info, index) => (
                <h1
                  key={info.brokerCode}
                  className={`w-full cursor-pointer py-2 hover:bg-z-gray-100 ${
                    brokerClientInfos.length > 2 &&
                    index !== brokerClientInfos.length - 2
                      ? "border-b-[0.1rem] border-z-gray-100"
                      : "border-0"
                  } max-md:px-2 max-md:text-[0.7rem] md:max-lg:px-3 md:max-lg:text-[0.7rem] lg:max-xl:text-[0.8rem]  xl:px-5 xl:text-[0.85rem]`}
                  onClick={() => handleBrokerClick(info.brokerCode)}
                >
                  {info.brokerName} -{" "}
                  <span className="text-[0.65rem]">{info.clientCode}</span>
                </h1>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SwitchBroker;
