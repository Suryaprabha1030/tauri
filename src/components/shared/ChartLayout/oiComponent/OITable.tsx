"use client";

import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { RootState } from "@/lib/redux/Store";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  determineMarketAction,
  enrichFutures,
  enrichOptionChain,
  getCloseValue,
  getCloseValuePercentage,
  getIdentifierFromQuery,
  LivegetOptionChainForOptionType,
  oiChangePercFromData,
  oiData,
  OiFormatPayload,
} from "../optionFutures/optionFuturesUtil/strategyUtil";
import { OIAlldata } from "@/lib/redux/slices/OISlice";
import { getOIHashKey, getOIRadioHashKey } from "./OIUtil";
import { toast } from "react-toastify";
import {
  oiGetCEClass,
  oiGetPEClass,
  oiGetSymbolClass,
  straddleTransformData,
  updateMarginPayload,
} from "@/lib/util/oi/oiUtil";
import LtpWithPerc from "../optionFutures/liveOptionChain/LtpWithPerc";
import OptionChainKey from "../optionFutures/liveOptionChain/OptionChainKey";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useNavigate } from "react-router-dom";
import OITrend from "../optionFutures/liveOptionChain/OITrend";
import OiWithPercentage from "../optionFutures/liveOptionChain/OiWithPercentage";
import config from "@/lib/config";

import { setIndexFirstFutData } from "@/lib/redux/slices/ChartsSlice";
import {
  addSymbol,
  setIndexRawApiResponse,
} from "@/lib/redux/slices/StrategySlice";
import { ATMCalculation } from "../optionFutures/optionFuturesUtil/legUtil";
import { getMaxPainStrikeValue } from "@/lib/redux/slices/StrategyChartSlice";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { getHighestOIStrikes } from "@/lib/util/analyzer/optUtil";

interface OITableProps {
  groupName: string;
  setOiLoad: Dispatch<SetStateAction<{}>>;
  query: string;
  brokerCode: number | null;
  setOiExpiry: Dispatch<SetStateAction<string>>;
  setCheckedOIRows: Dispatch<SetStateAction<{}>>;
  checkedOIRows: any;
  spotPriceRoundOff: number;
  setSpotPriceRoundOff: Dispatch<SetStateAction<string>>;
  setOiIncrementor: Dispatch<SetStateAction<any>>;
  activeStraddleButton: any;
  setStraddlePayload: Dispatch<SetStateAction<any>>;
  setCheckedCustomRows: Dispatch<SetStateAction<any>>;
  checkedCustomRows: any;
  checkedStrangleRows: any;
  setCheckedStrangleRows: Dispatch<SetStateAction<any>>;
  showMultiStraddle: boolean;
  showMultiOi: boolean;
  oiExpiry: string;
  manuallyCheckedStraddle: any;
  setManuallyCheckedStraddle: Dispatch<SetStateAction<any>>;
  setCheckedOiradios: Dispatch<SetStateAction<any>>;
  checkedOIRadios: any;
  showOiTable: boolean;
  setMarginPayload: Dispatch<SetStateAction<any>>;
  expandOiTable: boolean;
  calculateMargin: boolean;
  setCalculateMargin: React.Dispatch<React.SetStateAction<boolean>>;
  OIData: any;
  setOIData: Dispatch<SetStateAction<any>>;
  oiDataPercent: any;
  setOiDataPercent: Dispatch<SetStateAction<any>>;
  setOiValue: Dispatch<SetStateAction<any>>;
  oiValue: any;
  setProcessedIndexes: Dispatch<SetStateAction<any>>;
  WebsocketDataLtp: any;
  querySpotPrice: any;
  setQuerySpotPrice: Dispatch<SetStateAction<any>>;
}

const OITable: React.FC<OITableProps> = ({
  groupName,
  setOiLoad,
  query,
  brokerCode,
  setOiExpiry,
  setCheckedOIRows,
  checkedOIRows,
  setSpotPriceRoundOff,
  spotPriceRoundOff,
  setOiIncrementor,
  activeStraddleButton,
  setStraddlePayload,
  checkedStrangleRows,
  setCheckedStrangleRows,
  checkedCustomRows,
  setCheckedCustomRows,
  showMultiStraddle,
  showMultiOi,
  oiExpiry,
  manuallyCheckedStraddle,
  setManuallyCheckedStraddle,
  setCheckedOiradios,
  checkedOIRadios,
  showOiTable,
  setMarginPayload,
  expandOiTable,
  calculateMargin,
  setCalculateMargin,
  setOIData,
  OIData,
  oiDataPercent,
  setOiDataPercent,
  oiValue,
  setOiValue,
  setProcessedIndexes,
  WebsocketDataLtp,
  querySpotPrice,
  setQuerySpotPrice,
}) => {
  const dispatch = useDispatch();
  const ltp = useSelector((state: RootState) => state.OI.OILtpData);
  const indexAddtionalData: any = useSelector(
    (state: RootState) => state.OI.OIAddtionalData,
  );
  const expiry: any = useSelector(
    (state: RootState) => state.OI.OIIndexExpiryDate,
  );
  const [OIAllData, setOIAllData] = useState<any>({});
  const expiryDateRef = useRef<any>(null);

  const indexData: any = useSelector(
    (state: RootState) => state.OI.OiIndexData,
  );
  const [indicesApiBoolean, setIndicesApiBoolean] = useState(true);
  const [oiChangePerct, setOiChangePerct] = useState<any>({});
  const router = useNavigate();
  const intervalRef = useRef<any>(null);
  const [oiDataEmpty, setOiDataEmpty] = useState(false);
  const indicesData: any = useSelector(
    (state: RootState) => state.common.allIndicesOptionsList,
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const netpercentage: any = useSelector(
    (state: RootState) => state.strategy.netChangepercent,
  );
  const rawApiResponse = useSelector(
    (state: RootState) => state.strategy.rawIndexAPIresponse,
  );
  const [oiSupportResistance, setOiSupportResistance] = useState<any>({});
  const isMarketHoliday = useSelector(
    (state: RootState) => state.MarketBasis.isMarketHoliday,
  );

  const oiPercentData = async (unibrokerCode: any, index: any, expiry: any) => {
    const oiBarApi = new UserBrokerRouterApi(baseConfig());
    await oiBarApi
      .fetchLatestOiWithPercentageV1UsersMeBrokersBrokerCodeFetchLatestOiWithPercentagePost(
        unibrokerCode,
        index,
        expiry,
      )
      .then((res) => {
        if (res?.status == 204 || res?.status == 400) {
          setOiDataEmpty(true);
          return;
        }
        setOiDataEmpty(false);
        if (res?.data?.strike_prices?.length > 0) {
          setOiChangePerct(oiChangePercFromData(res?.data?.strike_prices));

          setOiDataPercent(OiFormatPayload(res?.data?.strike_prices));
          setOiValue(oiData(res?.data?.strike_prices));
          setOiSupportResistance(getHighestOIStrikes(res?.data?.strike_prices));
        }
        dispatch(getMaxPainStrikeValue(res?.data?.max_pain?.max_pain_strike));
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
    const fetchData = () => {
      if (
        expiry[query]?.length > 0 &&
        indexData[query] &&
        Object.entries(indexData[query]).length > 0
      ) {
        oiPercentData(brokerCode, query, expiryDateRef.current.value);
      }
    };
    fetchData();
    const fetchIfTradingTimeOiData = () => {
      if (config.isTradingTime() && brokerCode != null && !isMarketHoliday) {
        fetchData();
      }
    };
    intervalRef.current = setInterval(fetchIfTradingTimeOiData, 60000); // 30 seconds

    // Cleanup function to clear the interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [indexData, brokerCode, expiry, query]);

  useEffect(() => {
    if (ltp[query]) {
      setOIAllData(ltp[query]);
      setOiExpiry(expiryDateRef.current.value);
    }
  }, [ltp, query]);

  useEffect(() => {
    if (OIData && WebsocketDataLtp && query && indexData[query]) {
      const currentIndexData = indexData[query];
      const calculateATMStrike = () => {
        const atmStrike: any = ATMCalculation(
          OIData,
          WebsocketDataLtp,
          currentIndexData,
        );
        setSpotPriceRoundOff(atmStrike);
        // dispatch(getSpotPriceRoundOff(atmStrike));
      };

      calculateATMStrike();

      const interval = setInterval(calculateATMStrike, 30000);

      // Cleanup interval on unmount or dependency change
      return () => clearInterval(interval);
    }
  }, [OIAllData, OIData]);

  // when query change need to set initial expiry
  useEffect(() => {
    if (ltp[query]) {
      expiryDateRef.current.value = expiry[query][0];
    }
  }, [query]);

  // checked update from table
  useEffect(() => {
    if (!expiryDateRef.current || !OIAllData) return;

    const expiry = expiryDateRef.current.value;
    const expiryData = OIAllData[expiry];
    if (!expiryData) return;

    // Sort and set OI data
    const sorted: any = Object.fromEntries(
      Object.entries(expiryData).sort(([a], [b]) => a.localeCompare(b)),
    );
    setOIData(sorted);

    const spotPriceData = indexAddtionalData[query]?.[expiry];
    if (!spotPriceData) return;

    const defaultSelector = spotPriceData.spot_price_round_off;
    const defaultLoad = [
      `${defaultSelector}.0#CE#${expiry}#${groupName}`,
      `${defaultSelector}.0#PE#${expiry}#${groupName}`,
    ];
    const initialOiLoad = Object.fromEntries(
      defaultLoad.map((key) => [
        key,
        `${key.split(".0")[0]}#${key.split("#")[1]}`,
      ]),
    );

    const initialRadioLoad = Object.fromEntries(
      [`${defaultSelector}.0#${expiry}#${groupName}`].map((key) => [
        key,
        [`${key.split(".0")[0]}CE`, `${key.split(".0")[0]}PE`],
      ]),
    );

    const updateCheckedRows = (setter: any, condition: any) => {
      if (condition) {
        setter({}); // Reset the state before updating
        setter((prev:any) => ({
          ...prev,
          [`${defaultSelector}.0#CE#${expiry}#${groupName}`]: true,
          [`${defaultSelector}.0#PE#${expiry}#${groupName}`]: true,
        }));
        setOiLoad(initialOiLoad);
      }
    };
    const updateMultiStraddleRows = (setter: any, condition: any) => {
      if (condition) {
        setter({}); // Reset the state before updating
        setter((prev:any) => ({
          ...prev,
          [`${defaultSelector}.0#CE#${expiry}#${groupName}`]: true,
          [`${defaultSelector}.0#PE#${expiry}#${groupName}`]: true,
        }));
        setOiLoad(initialOiLoad);
      }
    };

    const updateCheckedRadios = (setter: any, condition: any) => {
      if (condition) {
        setManuallyCheckedStraddle(false);
        setter({});
        setter((prev:any) => ({
          ...Object.keys(prev).reduce((acc:any, key) => {
            if (key === `${defaultSelector}.0#${expiry}#${groupName}`)
              acc[key] = true;
            return acc;
          }, {}),
          [`${defaultSelector}.0#${expiry}#${groupName}`]: true,
        }));
        setOiLoad(initialOiLoad);
      }
    };
    // initial checked
    updateCheckedRows(
      setCheckedOIRows,
      showMultiOi &&
        !showMultiStraddle &&
        Object?.entries(checkedOIRows).length == 0,
    );
    // all unchecked when tab switch and again click multi oi tab
    updateCheckedRows(
      setCheckedOIRows,
      !showMultiOi &&
        showMultiStraddle &&
        (Object?.entries(checkedOIRows).length == 0 ||
          Object?.values(checkedOIRows)?.every((value) => !value)),
    );
    // all unchecked when tab switch and again click multi starddle -custom tab
    updateMultiStraddleRows(
      setCheckedCustomRows,
      !showMultiStraddle &&
        showMultiOi &&
        (Object?.entries(checkedCustomRows).length == 0 ||
          Object?.values(checkedCustomRows)?.every((value) => !value)),
    );
    // all unchecked when tab switch and again click multi starddle-strangle tab
    updateMultiStraddleRows(
      setCheckedStrangleRows,
      showMultiOi &&
        !showMultiStraddle &&
        (Object?.entries(checkedStrangleRows).length == 0 ||
          Object?.values(checkedStrangleRows)?.every((value) => !value)),
    );

    // when stay that tab,change index name =>radio -stranggle
    updateMultiStraddleRows(
      setCheckedStrangleRows,

      showMultiStraddle && Object?.entries(checkedStrangleRows).length == 0,
    );
    // when stay that tab,change index name =>radio -custom
    updateMultiStraddleRows(
      setCheckedCustomRows,
      showMultiStraddle &&
        !showMultiOi &&
        Object?.entries(checkedCustomRows).length == 0,
    );
    // all unchecked when tab switch and again click multi starddle-strangle tab
    updateCheckedRadios(
      setCheckedOiradios,
      showMultiOi &&
        !showMultiStraddle &&
        (Object?.entries(checkedOIRadios).length == 0 ||
          Object?.values(checkedOIRadios)?.every((value) => !value)),
    );
    // when stay that tab,change index name =>radio -straddle
    updateCheckedRadios(
      setCheckedOiradios,
      showMultiStraddle &&
        !showMultiOi &&
        Object?.entries(checkedOIRadios).length == 0,
    );

    const spotPriceRoundOffz = expiry && indexAddtionalData[query][expiry];

    const atmStrike: any = ATMCalculation(
      OIData,
      WebsocketDataLtp,
      indexData[query],
    );
    setSpotPriceRoundOff(atmStrike);
    setOiIncrementor(spotPriceRoundOffz && spotPriceRoundOffz?.incrementer);
  }, [OIAllData, oiExpiry, showMultiOi, showMultiStraddle]);

  useEffect(() => {
    const scrollToMiddle = () => {
      if (spotPriceRoundOff) {
        const elementId: string = `#result_${spotPriceRoundOff}`;

        const section = document.querySelector(elementId);

        setTimeout(() => {
          if (section) {
            section.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "center",
            });
          }
        }, 300);
      }
    };
    scrollToMiddle();
  }, [
    spotPriceRoundOff,
    OIAllData,
    showMultiStraddle,
    showMultiOi,
    activeStraddleButton,
    query,
  ]);

  const handleExpiryChange = (event: any) => {
    const expiry = event.target.value;

    setCheckedOiradios({});
    setCheckedStrangleRows({});
    setCheckedOIRows({});
    setCheckedCustomRows({});
    setStraddlePayload([]);
    setOiExpiry(expiry);
    setCalculateMargin(false);

    const asend = OIAllData[expiry];
    oiPercentData(brokerCode, query, expiry);
    if (asend === undefined) {
      const getAllDataApi = new UserBrokerRouterApi(baseConfig());
      const identifier = getIdentifierFromQuery(query);
      const querySpotPrice =
        webSocketDataRead && identifier != null && WebsocketDataLtp[identifier];
      if (querySpotPrice != null)
        getAllDataApi
          .getIndicesFullDataFromDbV1UsersMeBrokersBrokerCodeGetIndicesFullDataFromDbIndexNameGet(
            brokerCode,
            query,
            querySpotPrice,
            false,
          )
          .then((res: any) => {
            dispatch(setIndexRawApiResponse(res?.data));
            setQuerySpotPrice(null);
            setProcessedIndexes(false);
            setIndicesApiBoolean(false);
            // setOiExpiry(expiry);
            dispatch(
              addSymbol({
                symbol: res?.data?.index_obj?.identifier,
                // token: res?.data?.index_obj?.token,
              }),
            );
            Object.keys(res?.data?.option_chain || {}).forEach((expiry) => {
              const strikes = res?.data?.option_chain[expiry];

              Object.keys(strikes).forEach((strike) => {
                const options = strikes[strike]; // array of CE & PE objects

                options.forEach((opt:any) => {
                  dispatch(
                    addSymbol({
                      symbol: opt?.identifier, // pick identifier
                      // token: opt.token, // pick token
                    }),
                  );
                });
              });
            });
            res?.data?.futures_data.forEach((future: any) => {
              dispatch(
                addSymbol({
                  symbol: future?.identifier,
                  // token: future.token,
                }),
              );
            });
          })
          .catch((error: any) => {
            if (error?.response && error?.response?.status == 401) {
              autoLogoutTokenRemove(router);
            }
            if (error?.response && error?.response?.status == 456) {
              brokerLogoutTokenRemove(router);
            }
          });
    }
  };

  // when expiry changes need to be checked
  useEffect(() => {
    if (expiryDateRef.current && OIAllData) {
      if (OIAllData && OIAllData[expiryDateRef.current.value]) {
        const expiry = expiryDateRef.current.value;
        const defaultSelector: any =
          indexAddtionalData[query][expiry].spot_price_round_off;

        const defaultLoad = [
          `${defaultSelector}.0#CE#${expiry}#${groupName}`,
          `${defaultSelector}.0#PE#${expiry}#${groupName}`,
        ];
        const initialOiLoad: any = {};
        defaultLoad.forEach((key) => {
          const segments = key.split("#");
          initialOiLoad[key] = `${segments[0].split(".0")[0]}#${segments[1]}`;
        });
        const updateMultiStraddleRows = (setter: any, condition: any) => {
          if (condition) {
            setManuallyCheckedStraddle(false);
            setter({}); // Reset the state before updating
            setter((prev:any) => ({
              ...prev,
              [`${defaultSelector}.0#CE#${expiry}#${groupName}`]: true,
              [`${defaultSelector}.0#PE#${expiry}#${groupName}`]: true,
            }));
            setOiLoad(initialOiLoad);
          }
        };

        const updateCheckedRadios = (setter: any, condition: any) => {
          if (condition) {
            setManuallyCheckedStraddle(false);
            setter({});
            setter((prev:any) => ({
              ...Object.keys(prev).reduce((acc:any, key) => {
                if (key === `${defaultSelector}.0#${expiry}#${groupName}`)
                  acc[key] = true;
                return acc;
              }, {}),
              [`${defaultSelector}.0#${expiry}#${groupName}`]: true,
            }));
            setOiLoad(initialOiLoad);
          }
        };
        updateMultiStraddleRows(
          setCheckedCustomRows,
          showMultiStraddle &&
            !showMultiOi &&
            Object?.entries(checkedCustomRows).length == 0,
        );
        updateMultiStraddleRows(
          setCheckedStrangleRows,
          showMultiStraddle &&
            !showMultiOi &&
            Object?.entries(checkedStrangleRows).length == 0,
        );
        updateCheckedRadios(
          setCheckedOiradios,
          showMultiStraddle &&
            !showMultiOi &&
            Object?.entries(checkedOIRadios).length == 0,
        );
      }
    }
  }, [oiExpiry, indicesApiBoolean]);

  const handleStraddle = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: any,
    hashKey: any,
  ) => {
    const isChecked = event.target.checked;
    const keys = hashKey;
    setCalculateMargin(false);
    setCheckedOiradios((prevCheckedOIRows: any) => {
      const updatedCheckedOIRows = { ...prevCheckedOIRows };

      Object.keys(updatedCheckedOIRows).forEach((k) => {
        if (k !== hashKey) {
          delete updatedCheckedOIRows[k]; // Remove the previous entry
        }
      });

      // If the checkbox is checked, set the new hashKey
      if (isChecked) {
        updatedCheckedOIRows[hashKey] = isChecked;
      }
      setManuallyCheckedStraddle(true);
      setStraddlePayload((prevStraddlePayload: any) => {
        const updatedOiLoad: any = { ...prevStraddlePayload };

        if (isChecked) {
          // If checked, add or update the key-value pair in oiLoad
          updatedOiLoad[keys] = [`${key}PE`, `${key}CE`];
        } else {
          // If unchecked, remove the key from oiLoad
          delete updatedOiLoad[keys];
        }
        Object.keys(updatedOiLoad).forEach((key) => {
          if (!updatedCheckedOIRows[key]) {
            delete updatedOiLoad[key];
          }
        });

        return updatedOiLoad;
      });

      return updatedCheckedOIRows;
    });
  };

  const handleStrangle = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: any,
    value: any,
    hashKey: any,
  ) => {
    const isChecked = event.target.checked;
    const keys = hashKey;
    setCalculateMargin(false);
    const optionType = value?.option_type; // 'PE' or 'CE'
    const strikePrice = value?.strike_price;

    setCheckedStrangleRows((prevCheckedStrangleRows: any) => {
      const updatedCheckedStrangleRows = { ...prevCheckedStrangleRows };

      // Iterate over the keys of the previously checked rows
      Object.keys(updatedCheckedStrangleRows).forEach((k) => {
        const [price, type] = k.split("#"); // Split the key to get price and type

        if (type === optionType && strikePrice !== price) {
          delete updatedCheckedStrangleRows[k]; // Remove it entirely
        }
      });

      if (isChecked) {
        updatedCheckedStrangleRows[hashKey] = true;
      } else {
        updatedCheckedStrangleRows[hashKey] = false;
      }

      setManuallyCheckedStraddle(true);
      setStraddlePayload((prevStraddlePayload: any) => {
        const updatedOiLoad = { ...prevStraddlePayload };

        if (isChecked) {
          updatedOiLoad[keys] = `${value?.strike_price}${value?.option_type}`;
        } else {
          delete updatedOiLoad[keys];
        }
        Object.keys(updatedOiLoad).forEach((key) => {
          if (!updatedCheckedStrangleRows[key]) {
            delete updatedOiLoad[key];
          }
        });

        return updatedOiLoad;
      });

      return updatedCheckedStrangleRows;
    });
  };

  const addPEData = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: any,
    value: any,
    hashKey: any,
  ) => {
    const isChecked = event.target.checked;
    const keys = hashKey;

    const currentCheckedCount =
      Object.values(checkedOIRows).filter(Boolean).length;
    const currentCheckedCustomCount =
      Object.values(checkedCustomRows).filter(Boolean).length;

    if (isChecked) {
      if (isChecked && currentCheckedCount >= 8 && showMultiOi) {
        toast("Maximum limit reached!.you have checked 8 strike prices");
        return;
      }

      if (
        isChecked &&
        currentCheckedCustomCount >= 8 &&
        activeStraddleButton == "custom" &&
        showMultiStraddle
      ) {
        toast("Maximum limit reached!.you have checked 8 strike prices");
        return;
      }
    }
    setCalculateMargin(false);
    if (activeStraddleButton == "custom") {
      setCheckedCustomRows((prevCheckedCustomRows: any) => {
        const updatedCheckedCustomRows = {
          ...prevCheckedCustomRows,
          [hashKey]: isChecked,
        };

        setManuallyCheckedStraddle(true);
        setStraddlePayload((prevStraddlePayload: any) => {
          const updatedOiLoad: any = { ...prevStraddlePayload };

          if (isChecked) {
            updatedOiLoad[keys] = `${value?.strike_price}${value?.option_type}`;
          } else {
            delete updatedOiLoad[keys];
          }

          return updatedOiLoad;
        });

        return updatedCheckedCustomRows;
      });
    } else {
      setCheckedOIRows((prevCheckedOIRows) => {
        const updatedCheckedOIRows = {
          ...prevCheckedOIRows,
          [hashKey]: isChecked,
        };

        setOiLoad((prevOiLoad) => {
          const updatedOiLoad: any = { ...prevOiLoad };

          if (isChecked) {
            updatedOiLoad[keys] =
              `${value?.strike_price}#${value?.option_type}`;
          } else {
            delete updatedOiLoad[keys];
          }

          return updatedOiLoad;
        });

        return updatedCheckedOIRows;
      });
    }
  };

  // send payload for starddle-strangle

  useEffect(() => {
    if (expiryDateRef.current && OIAllData) {
      if (
        OIAllData &&
        OIAllData[expiryDateRef.current.value] &&
        showMultiStraddle
      ) {
        switch (true) {
          case activeStraddleButton == "strangle" && !manuallyCheckedStraddle:
            setStraddlePayload([]);
            setStraddlePayload(checkedStrangleRows);
            break;

          case activeStraddleButton == "straddle" && !manuallyCheckedStraddle:
            setStraddlePayload([]);
            setStraddlePayload(checkedOIRadios);
            break;

          case activeStraddleButton == "custom" && !manuallyCheckedStraddle:
            setStraddlePayload([]);
            setStraddlePayload(checkedCustomRows);

            break;

          default:
          // console.log("No active button");
        }
      }
    }
  }, [
    showMultiStraddle,
    activeStraddleButton,
    checkedOIRadios,
    checkedStrangleRows,
    checkedCustomRows,
  ]);
  //  for margin display
  useEffect(() => {
    let checkedRows: any = null;

    if (
      !showMultiOi &&
      !showMultiStraddle &&
      activeStraddleButton == "" &&
      activeStraddleButton?.length == 0 &&
      !calculateMargin
    ) {
      return;
    }
    if (showMultiOi && activeStraddleButton?.length == 0 && calculateMargin) {
      setMarginPayload([]);
      checkedRows = checkedOIRows;
    } else if (showMultiStraddle && calculateMargin) {
      if (activeStraddleButton === "straddle" && calculateMargin) {
        checkedRows = straddleTransformData(checkedOIRadios);
      } else if (activeStraddleButton === "custom" && calculateMargin) {
        checkedRows = checkedCustomRows;
      } else if (activeStraddleButton === "strangle" && calculateMargin) {
        checkedRows = checkedStrangleRows;
      }
    }

    updateMarginPayload(checkedRows, ltp, query, setMarginPayload);
  }, [calculateMargin]);

  return (
    <div
      className={`flex flex-col  items-center max-xl:w-full ${expandOiTable ? "xl:w-[90%] 2xl:w-[83%]" : "w-full "} overflow-y-auto rounded-lg border border-z-blue-200 scrollbar-none max-xl:h-[80%] max-sm:mt-[0.7rem] sm:max-md:mt-[1rem] md:max-xl:mt-[1.5rem] xl:h-[95%] ${
        showOiTable ? "" : "max-xl:hidden"
      }`}
    >
      <table className="h-full w-full  border-2 border-blue-200 text-center text-sm text-black duration-500">
        <thead className="sticky -top-1 z-10 border-b bg-white ">
          <tr className="flex flex-row items-center justify-evenly border-b-2 border-gray-200 text-[0.7rem] text-z-gray-300">
            {!oiDataEmpty ? (
              <th
                className={` 
                  ${!expandOiTable ? "2xl:w-1/6" : "2xl:w-1/6"} 
                 py-2 font-tableHead max-sm:hidden sm:max-md:w-[17.5%] md:max-xl:w-[18%] xl:max-2xl:w-[23%]
                  `}
              >
                Call OI
              </th>
            ) : (
              ""
            )}
            {expandOiTable && !oiDataEmpty ? (
              <th
                className={` ${
                  !expandOiTable
                    ? "hidden"
                    : "max-xl:hidden xl:max-2xl:w-[20%] 2xl:w-1/6 "
                }  py-2 font-tableHead max-xl:hidden `}
              >
                {" "}
                OI Trend{" "}
              </th>
            ) : (
              ""
            )}
            <th
              className={`   ${
                !expandOiTable
                  ? "flex w-1/5 justify-center xl:max-2xl:w-[21%]"
                  : "w-1/5 xl:max-2xl:w-[22.5%]"
              }  py-2 font-tableHead max-lg:px-6 2xl:px-6 ${
                oiDataEmpty && expandOiTable
                  ? "basis-1/2 xl:max-2xl:pr-9"
                  : oiDataEmpty
                    ? "basis-1/2"
                    : ""
              } max-sm:w-[30%] sm:max-md:w-[17.5%] md:max-xl:w-[18%] md:max-xl:py-[0.6rem]`}
            >
              {" "}
              Call{" "}
            </th>

            <th
              className={`py-2 font-tableHead max-sm:w-[2rem] sm:max-md:w-[3rem] md:max-lg:w-[3rem] lg:max-xl:w-[6rem] xl:max-2xl:w-[0.8rem] ${oiDataEmpty && !expandOiTable ? "xl:max-2xl:w-[10%]" : ""} ${expandOiTable || oiDataEmpty ? "2xl:w-[2rem]" : ""}  `}
            >
              {" "}
            </th>
            <th
              className={`${expandOiTable || oiDataEmpty ? "2xl:px-6" : ""} font-tableHead max-sm:w-[30%] sm:max-md:w-[17.5%] md:max-xl:w-[18%]  xl:max-2xl:w-[28%] `}
            >
              <select
                className={`h-[1.5rem] rounded-lg bg-white px-2 text-[0.7rem] outline-none ${
                  config.BSESupportIndices.includes(query)
                    ? "pointer-events-none appearance-none"
                    : "focus:border-tertiary"
                }`}
                ref={expiryDateRef}
                onChange={handleExpiryChange}
                value={oiExpiry}
              >
                {expiry &&
                  expiry[query] && //Display only 1st expiry for BSE
                  (config.BSESupportIndices.includes(query) ? (
                    <option className="bg-white p-2" value={expiry[query][0]}>
                      {expiry[query][0]}
                    </option>
                  ) : (
                    expiry[query]?.slice(0, 3)?.map((c: any, idx: any) => (
                      <option className="bg-white p-2" key={idx} value={c}>
                        {c}
                      </option>
                    ))
                  ))}
              </select>
            </th>

            <th
              className={`py-2 font-tableHead max-sm:w-[2rem] sm:max-md:w-[3rem] md:max-lg:w-[3rem] lg:max-xl:w-[6rem] xl:max-2xl:w-[1.5rem] ${oiDataEmpty ? "xl:max-2xl:w-[2rem]" : ""} ${expandOiTable || oiDataEmpty ? "2xl:w-[2rem]" : ""}  `}
            >
              {" "}
            </th>
            <th
              className={`${
                !expandOiTable ? "w-1/5 " : "w-1/5 xl:max-2xl:w-[21%]"
              }  2x:px-6 py-2 font-tableHead ${
                oiDataEmpty && expandOiTable
                  ? "basis-1/2 xl:max-2xl:pl-9"
                  : oiDataEmpty
                    ? "basis-1/2"
                    : ""
              } max-sm:w-[30%] sm:max-md:w-[17.5%] md:max-xl:w-[18%] md:max-xl:py-[0.6rem]`}
            >
              {" "}
              Put{" "}
            </th>
            {expandOiTable && !oiDataEmpty ? (
              <th
                className={` ${
                  !expandOiTable
                    ? "hidden"
                    : "max-xl:hidden xl:max-2xl:w-[21%] 2xl:w-1/6"
                } py-2 font-tableHead max-xl:hidden`}
              >
                {" "}
                OI Trend{" "}
              </th>
            ) : (
              ""
            )}
            {!oiDataEmpty ? (
              <th
                className={`${!expandOiTable ? "2xl:w-1/6" : "2xl:w-1/6"} 
               py-2 font-tableHead max-sm:hidden sm:max-md:w-[17.5%] md:max-xl:w-[18%] xl:max-2xl:w-[23%]`}
              >
                Put OI
              </th>
            ) : (
              ""
            )}
          </tr>
        </thead>
        <tbody
          className="flex flex-col rounded-lg text-center text-[0.75rem]"
          id={`result_${spotPriceRoundOff}`}
        >
          {OIData && Object.entries(OIData).length > 0
            ? Object.entries(OIData).map(([key, value]: [string, any]) => {
                const keys = key;

                const closeCE = getCloseValue(value, "CE", webSocketDataRead);
                const closeCEPercentage = getCloseValuePercentage(
                  value,
                  "CE",
                  netpercentage,
                );
                const closePEPercentage = getCloseValuePercentage(
                  value,
                  "PE",
                  netpercentage,
                );
                const closePE = getCloseValue(value, "PE", webSocketDataRead);
                const hashCE = getOIHashKey(
                  key,
                  "CE",
                  expiryDateRef.current?.value,
                  groupName,
                );
                const hashPE = getOIHashKey(
                  key,
                  "PE",
                  expiryDateRef.current?.value,
                  groupName,
                );
                const hashKey = getOIRadioHashKey(
                  key,
                  expiryDateRef.current?.value,
                  groupName,
                );
                const icon = determineMarketAction(
                  oiChangePerct[`${key}#CE`],
                  parseFloat(closeCEPercentage),
                  "CE",
                  expandOiTable,
                );
                const iconPE = determineMarketAction(
                  oiChangePerct[`${key}#PE`],
                  parseFloat(closePEPercentage),
                  "PE",
                  expandOiTable,
                );
                return (
                  <tr
                    id={"result_" + key}
                    key={key}
                    className="font-label flex flex-row border-b-2 border-gray-200 text-[0.7rem] max-xl:justify-evenly xl:max-2xl:justify-between"
                  >
                    {!oiDataEmpty && (
                      <td
                        className={`
                         flex items-center justify-center max-sm:hidden sm:max-md:w-[17.5%] md:max-xl:w-[18%]
                         ${
                           !expandOiTable
                             ? "xl:max-2xl:w-[25%] 2xl:w-[24%]"
                             : "xl:w-[24%] "
                         }`}
                      >
                        <OiWithPercentage
                          optionType="CE"
                          oi={oiValue}
                          oiChangePerc={oiChangePerct}
                          rowKey={key}
                        />
                      </td>
                    )}

                    {expandOiTable && !oiDataEmpty && (
                      <td
                        className={`max-xl:hidden ${
                          expandOiTable
                            ? "max-xl:hidden xl:max-2xl:w-[20%] 2xl:w-[24%]"
                            : "hidden"
                        } flex  items-center justify-center   `}
                      >
                        <OITrend
                          expandTable={expandOiTable}
                          icon={icon}
                          rowKey={key}
                          closeCEPEPercentage={closeCEPercentage}
                          oiChangePerc={oiChangePerct}
                          optionType="CE"
                        />
                      </td>
                    )}
                    <td
                      className={`relative flex items-center justify-center py-[0.8rem] max-sm:w-[30%] sm:max-md:w-[17.5%] md:max-xl:w-[18%] xl:max-2xl:w-[22%] ${
                        expandOiTable && oiDataEmpty ? "basis-1/2" : ""
                      } xl:max-2xl:py-[0.5rem]
                      ${oiDataEmpty ? "max-2xl:basis-1/2" : ""} ${
                        expandOiTable && oiDataEmpty
                          ? " max-2xl:basis-1/2 2xl:w-[24%] "
                          : ""
                      }  ${oiGetCEClass(
                        spotPriceRoundOff,
                        key,
                        indexData[query]?.net_change_percent,
                        expandOiTable,
                      )}`}
                    >
                      <LtpWithPerc
                        closePECE={closeCE}
                        closePECEPercentage={closeCEPercentage}
                      />
                      {!oiDataEmpty && (
                        <div
                          className={`text-center text-[0.6rem] font-semibold uppercase max-sm:block max-sm:w-full max-sm:text-[0.5rem] sm:max-md:text-[0.5rem] xl:text-[0.5rem] 2xl:text-[0.6rem] ${
                            `${oiSupportResistance?.peStrike}.0` === key
                              ? "text-transparent"
                              : ""
                          }`}
                        >
                          {`${oiSupportResistance?.ceStrike}.0` === key
                            ? "OI-Resistance"
                            : `${oiSupportResistance?.peStrike}.0` === key
                              ? "OI-Resistance"
                              : ""}
                        </div>
                      )}
                      {!oiDataEmpty && (
                        <div
                          className={`absolute right-0   ${
                            key == `${spotPriceRoundOff}.0`
                              ? "top-[0.9rem]"
                              : `top-[0.75rem]`
                          } h-[1.2rem] rounded-l-full bg-z-orange-oi opacity-30`}
                          style={{ width: `${oiDataPercent[`${key}#CE`]}%` }}
                        ></div>
                      )}
                    </td>
                    <td
                      className={`flex w-[2rem] items-center justify-center sm:max-lg:w-[3rem] lg:max-xl:w-[6rem]  ${
                        parseInt(key) === spotPriceRoundOff
                          ? indexData[query]?.net_change_percent > 0
                            ? "bg-green-50"
                            : "bg-red-100"
                          : "bg-white"
                      }`}
                    >
                      {activeStraddleButton === "straddle" ? (
                        <input
                          type="radio"
                          name={key} // Unique to the group or option type (e.g., 'group')
                          checked={checkedOIRadios[hashKey] || false}
                          onChange={(event) =>
                            handleStraddle(event, key, hashKey)
                          }
                          key={hashKey}
                        />
                      ) : (
                        ""
                      )}
                      {activeStraddleButton === "strangle" ? (
                        <input
                          type="checkbox"
                          checked={!!checkedStrangleRows[hashCE]}
                          onChange={(event) =>
                            handleStrangle(
                              event,
                              key,
                              LivegetOptionChainForOptionType(value, "CE"),
                              getOIHashKey(
                                key,
                                "CE",
                                expiryDateRef.current?.value,
                                groupName,
                              ),
                            )
                          }
                          className=" flex  h-4 w-4 flex-col border-2 border-gray-200"
                        />
                      ) : (
                        ""
                      )}

                      {activeStraddleButton !== "strangle" &&
                      activeStraddleButton !== "straddle" ? (
                        <input
                          type="checkbox"
                          checked={
                            activeStraddleButton === "custom"
                              ? !!checkedCustomRows[hashCE]
                              : !!checkedOIRows[hashCE]
                          }
                          onChange={(event) =>
                            addPEData(
                              event,
                              key,
                              LivegetOptionChainForOptionType(value, "CE"),
                              getOIHashKey(
                                key,
                                "CE",
                                expiryDateRef.current?.value,
                                groupName,
                              ),
                            )
                          }
                          className=" flex  h-4 w-4 flex-col border-2 border-gray-200"
                        />
                      ) : (
                        ""
                      )}
                    </td>
                    <td
                      className={`max-sm:w-[30%] sm:max-md:w-[17.5%] md:max-xl:w-[18%] xl:max-2xl:w-[20%] ${oiGetSymbolClass(
                        spotPriceRoundOff,
                        key,
                        indexData[query]?.net_change_percent,
                      )} ${oiDataEmpty ? "xl:max-2xl:w-[30%] xl:max-2xl:pr-4 " : ""}`}
                    >
                      <OptionChainKey
                        optKey={key}
                        spotPriceRoundOff={spotPriceRoundOff}
                        spotPriceInfo={
                          WebsocketDataLtp[indexData[query]?.identifier]
                        }
                        noOiData={oiDataEmpty}
                      />
                    </td>
                    <td
                      className={`flex w-[2rem] items-center justify-center sm:max-lg:w-[3rem] lg:max-xl:w-[6rem] ${
                        parseInt(key) === spotPriceRoundOff
                          ? indexData[query]?.net_change_percent > 0
                            ? "bg-green-50"
                            : "bg-red-100"
                          : "bg-white"
                      }`}
                    >
                      {activeStraddleButton === "straddle" ? (
                        ""
                      ) : activeStraddleButton === "strangle" ? (
                        <input
                          type="checkbox"
                          checked={!!checkedStrangleRows[hashPE]}
                          onChange={(event) =>
                            handleStrangle(
                              event,
                              key,
                              LivegetOptionChainForOptionType(value, "PE"),
                              getOIHashKey(
                                key,
                                "PE",
                                expiryDateRef.current?.value,
                                groupName,
                              ),
                            )
                          }
                          className=" flex  h-4 w-4 flex-col border-2 border-gray-200"
                        />
                      ) : (
                        <input
                          type="checkbox"
                          checked={
                            activeStraddleButton === "custom"
                              ? !!checkedCustomRows[hashPE]
                              : !!checkedOIRows[hashPE]
                          }
                          onChange={(event) =>
                            addPEData(
                              event,
                              key,
                              LivegetOptionChainForOptionType(value, "PE"),
                              getOIHashKey(
                                key,
                                "PE",
                                expiryDateRef.current?.value,
                                groupName,
                              ),
                            )
                          }
                          className=" flex  h-4 w-4 flex-col border-2 border-gray-200"
                        />
                      )}
                    </td>

                    <td
                      className={`relative py-[0.8rem] max-sm:w-[30%] sm:max-md:w-[17.5%] md:max-xl:w-[18%] xl:max-2xl:w-[22%] ${
                        expandOiTable && oiDataEmpty
                          ? "basis-1/2 text-center"
                          : ""
                      } xl:max-2xl:py-[0.5rem] ${oiDataEmpty ? "max-2xl:basis-1/2" : ""} ${
                        expandOiTable && oiDataEmpty
                          ? "max-2xl:basis-1/2 xl:w-[24%]"
                          : " "
                      }  ${oiGetPEClass(
                        spotPriceRoundOff,
                        key,
                        indexData[query]?.net_change_percent,
                        expandOiTable,
                      )}`}
                    >
                      <LtpWithPerc
                        closePECE={closePE}
                        closePECEPercentage={closePEPercentage}
                      />
                      {!oiDataEmpty && (
                        <span
                          className={`block  text-center text-[0.6rem] font-semibold uppercase max-sm:text-[0.5rem] max-sm:text-[0.5rem] sm:max-md:text-[0.5rem] xl:text-[0.5rem] 2xl:text-[0.6rem] ${
                            `${oiSupportResistance?.ceStrike}.0` === key
                              ? "text-transparent"
                              : ""
                          }`}
                        >
                          {`${oiSupportResistance?.peStrike}.0` == key
                            ? "OI-Support"
                            : `${oiSupportResistance?.ceStrike}.0` == key
                              ? "--"
                              : ""}
                        </span>
                      )}
                      {!oiDataEmpty && (
                        <div
                          className={`absolute left-0   ${
                            key == `${spotPriceRoundOff}.0`
                              ? "top-[0.9rem]"
                              : `top-[0.75rem]`
                          }  h-[1.2rem] rounded-r-full bg-z-green-500 opacity-30`}
                          style={{ width: `${oiDataPercent[`${key}#PE`]}%` }}
                        ></div>
                      )}
                    </td>
                    {expandOiTable && !oiDataEmpty && (
                      <td
                        className={`flex justify-center   max-xl:hidden ${
                          expandOiTable
                            ? "max-xl:hidden xl:max-2xl:w-[20%] 2xl:w-[24%]"
                            : "hidden"
                        } `}
                      >
                        <OITrend
                          expandTable={expandOiTable}
                          icon={iconPE}
                          rowKey={key}
                          closeCEPEPercentage={closePEPercentage}
                          oiChangePerc={oiChangePerct}
                          optionType="PE"
                        />
                      </td>
                    )}
                    {!oiDataEmpty && (
                      <td
                        className={`
                         flex items-center justify-center max-sm:hidden sm:max-md:w-[17.5%] md:max-xl:w-[18%] 
                         ${
                           !expandOiTable
                             ? "xl:max-2xl:w-[25%] 2xl:w-[24%]"
                             : "xl:w-[24%]"
                         }  
                        
                        `}
                      >
                        <OiWithPercentage
                          optionType="PE"
                          oi={oiValue}
                          oiChangePerc={oiChangePerct}
                          rowKey={key}
                        />
                      </td>
                    )}
                  </tr>
                );
              })
            : ""}
        </tbody>
      </table>
    </div>
  );
};

export default OITable;
