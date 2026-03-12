import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import React, { useEffect, useRef, useState } from "react";
import { formatNumber } from "@/lib/util/DraftUtil";
import CompareOi from "./CompareOi";
import MatrixDropDown from "./matrixDropDown";
import DisplayHandleSellButton from "../../buySellButton/DisplayHandleSellButton";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useNavigate } from "react-router-dom";
import config from "@/lib/config";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import {
  setStockData,
  togglePlaceOrderVisibility,
} from "@/lib/redux/slices/PlaceOrder";
import { addSymbol, updateSymbolData } from "@/lib/redux/slices/StrategySlice";
import { getColorClass } from "./colorGrade";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface OiMatrixProps {
  brokerCode: number | null;
  queryIdentifier: string;
  selected: number;
  combinedOiExpiry: string;
  query: string;
  requireData: string;
  showChgPerc: boolean;
  showClassic: boolean;
  setTableData: React.Dispatch<React.SetStateAction<any>>;
  tableData: any;
}

const OiMatrix: React.FC<OiMatrixProps> = ({
  brokerCode,
  queryIdentifier,
  selected,
  combinedOiExpiry,
  query,
  requireData,
  showChgPerc,
  showClassic,
  tableData,
  setTableData,
}) => {
  const [spotPriceData, setSpotPriceData] = useState<any>({});

  const router = useNavigate();
  const getISTTime = (utcTime: any) => {
    const date = new Date(utcTime);
    date.setMinutes(date.getMinutes() + 330); // 330 mins = 5hr 30min

    return date.toTimeString().slice(0, 5); // "HH:MM"
  };
  const [activeMatrixTypeButton, setActiveMatrixTypeButton] = useState<
    string | null
  >("");
  const oiMatrixRef = useRef<any>(null);
  const [matrixBasketData, setMatrixBasketData] = useState({});
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const dispatch = useDispatch();
  const lotSizeData: any = useSelector(
    (state: RootState) => state.OI.lotSizeData,
  );
  const isMarketHoliday = useSelector(
    (state: RootState) => state.MarketBasis.isMarketHoliday,
  );
  const fetchSymbolPriceData = async (payload: any) => {
    if (!payload) return;
    if (Array.isArray(payload) && payload?.length > 0) {
      payload?.forEach((id: any) => {
        dispatch(addSymbol({ symbol: id }));
      });
    }
  };

  useEffect(() => {
    if (Object.entries(matrixBasketData).length > 0) {
      fetchSymbolPriceData(
        Object.values(matrixBasketData).map((data: any) => data.identifier),
      );
    }
  }, [matrixBasketData]);

  useEffect(() => {
    const fetchData = async () => {
      if (queryIdentifier?.length === 0 || combinedOiExpiry?.length == 0) {
        return;
      }

      const intradayOiApi = new UserBrokerRouterApi(baseConfig());
      const data: any = {}; // fresh empty object
      const spotData: any = {};
      let identifierData: any = {};

      try {
        const res =
          await intradayOiApi.fetchOiMatrixV1UsersMeBrokersBrokerCodeFetchOiMatrixPost(
            brokerCode,
            queryIdentifier,
            combinedOiExpiry,
            requireData,
            selected,
          );

        const strikeGroups = res?.data?.strike_price_groups;
        const spotPrice = res?.data?.spot_price_data;

        if (!Array.isArray(strikeGroups) || strikeGroups.length === 0) {
          return;
        }

        if (
          Array.isArray(res?.data?.spot_price_data) &&
          res?.data?.spot_price_data?.length > 0
        ) {
          spotPrice.forEach((item: any) => {
            const key = getISTTime(item?.time);
            spotData[key] = {
              oi: item?.spot_price,
              chg_percent: item?.change_percent,
            };
            // item?.spot_price;
          });
        }
        setSpotPriceData(spotData);

        strikeGroups.forEach((item: any) => {
          const key = item?.strike_price_option;
          data[key] = {};

          const sortedData = item?.data.sort(
            (a: any, b: any) =>
              new Date(b?.created_at).getTime() -
              new Date(a?.created_at).getTime(),
          );

          sortedData.forEach((inner: any) => {
            identifierData[key] = {
              identifier: inner?.index_identifier,
              symbol: inner?.symbol,
              option_type: inner?.option_type,
              strike_price: inner?.strike_price,
              expiry: inner?.expiry,
              index_name: inner?.index_name,
              ltp: inner?.oi,
              chgPerc: inner?.change_percent,
              chg: inner?.change,
            };
          });

          sortedData.forEach((inner: any) => {
            data[key][getISTTime(inner.created_at)] = {
              oi: inner?.oi,
              chg_percent: inner?.change_percent,
              identifier: inner?.index_identifier,
            };
          });
        });
        setMatrixBasketData(identifierData);

        setTableData(data);
      } catch (error: any) {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      }
    };

    fetchData();
    const fetchIfTradingTimeOiMatrixData = () => {
      if (config.isTradingTime() && brokerCode != null && !isMarketHoliday) {
        fetchData();
      }
    };
    oiMatrixRef.current = setInterval(fetchIfTradingTimeOiMatrixData, 180000);
    return () => {
      if (oiMatrixRef.current) {
        clearInterval(oiMatrixRef.current);
      }
    };
  }, [queryIdentifier, selected, combinedOiExpiry, requireData]);

  const getSortedStrikesByHighestOi = (tableData = {}) => {
    const allTimes = Object.values(tableData)?.flatMap((strikeData: any) =>
      Object.keys(strikeData),
    );

    const uniqueTimes = Array.from(new Set(allTimes));
    const highestTime = uniqueTimes?.sort()?.reverse()[0];

    const sortedByOi = Object.entries(tableData)
      .map(([strike, strikeData]: any) => ({
        strike,
        oi: strikeData[highestTime]?.oi || 0,
      }))
      .sort((a, b) => b?.oi - a?.oi);

    return { highestTime, sortedByOi };
  };

  const handleBasketOrder = (data: any, transactionType: any) => {
    const stock: any = [
      {
        lots: 1,
        lot_size: lotSizeData[query],
        transaction_type: transactionType,
        ltp: webSocketDataRead[data?.identifier],
        index_name: data?.index_name,
        identifier: data?.identifier,
        symbol: data?.symbol,
        exchange: "NFO",
        expiry: data?.expiry,
        strike_price: data?.strike_price,
        option_type: data?.option_type,
      },
    ];
    dispatch(togglePlaceOrderVisibility(true)); // draggable component redux
    dispatch(setStockData(stock));
  };

  return (
    <div className="flex h-full w-[100%] max-w-[92vw] justify-start max-2xl:w-[100%]">
      {(tableData && Object.entries(tableData)?.length == 0) ||
      (spotPriceData && Object.keys(spotPriceData)?.length == 0) ? (
        <div className="flex min-h-[60vh] w-full  items-center justify-center">
          No Data Available
        </div>
      ) : (
        <div className=" flex h-full w-full justify-start ">
          <div className="flex   overflow-x-auto  overflow-y-auto rounded-lg border-2 border-z-blue-200  scrollbar-none">
            <table className="relative    rounded-lg border border-blue-200 bg-white">
              <thead className="sticky top-0 z-[11] bg-white sm:max-md:top-[-1px] ">
                <tr className="h-[3rem] w-[7rem] min-w-[7rem] border-b-2 border-gray-200 text-[0.75rem] text-z-gray-300">
                  {/* Sticky Toggle Button */}
                  <th className=" sticky left-0 top-0 bg-white px-4  text-center font-tableHead  ">
                    <MatrixDropDown
                      setActiveMatrixTypeButton={setActiveMatrixTypeButton}
                      activeMatrixTypeButton={activeMatrixTypeButton}
                    />
                  </th>

                  {Object.keys(spotPriceData)
                    .reverse()
                    ?.map((key, index) => (
                      <th
                        key={index}
                        className="min-w-[5rem] px-2 text-center font-tableHead"
                      >
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>

              <tbody className="text-[0.75rem]">
                <tr className="h-10 border-b border-gray-200">
                  {/* First column with query label */}
                  <td className="sticky -left-1 top-0 z-[10] w-[4.5rem] min-w-[4.5rem] bg-white px-2 text-center font-tableHead">
                    {query}
                  </td>

                  {Object.keys(spotPriceData)
                    .reverse()
                    ?.map((key, idx, keyArray) => {
                      const isLast = idx === keyArray.length - 1;
                      const oi = spotPriceData[key].oi ?? "-";
                      const prevOi = !isLast
                        ? (spotPriceData[keyArray[idx + 1]].oi ?? "-")
                        : oi;

                      return (
                        <td
                          key={key}
                          className={`min-w-[5rem] px-2 text-center ${showClassic ? getColorClass(spotPriceData[key]?.chg_percent) : "bg-white"}`}
                        >
                          <div className="flex flex-col items-center justify-center gap-[0.15rem]">
                            <div className="flex flex-row items-center justify-center gap-1">
                              <span>
                                {" "}
                                {spotPriceData[key]?.oi
                                  ? spotPriceData[key]?.oi
                                  : "-"}
                              </span>
                              {!isLast &&
                                !showClassic &&
                                spotPriceData[key]?.chg_percent != 0 && (
                                  <span className="">
                                    <CompareOi value1={oi} value2={prevOi} />
                                  </span>
                                )}
                            </div>
                            {/* prevOi == "-" */}
                            {!isLast && !showClassic && (
                              <span
                                className={`
                                  inline-block overflow-hidden transition-opacity duration-300 ease-in-out
                                  ${!isLast && showChgPerc && oi != "-" ? "max-h-10 opacity-100" : "max-h-0 opacity-0 "}
                                  ${
                                    spotPriceData[key]?.chg_percent == 0
                                      ? "text-gray-500"
                                      : spotPriceData[key]?.chg_percent > 0
                                        ? "text-z-green-500"
                                        : "text-red-400"
                                  }
                                `}
                              >
                                ({spotPriceData[key]?.chg_percent}%)
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
                </tr>

                {getSortedStrikesByHighestOi(tableData)
                  ?.sortedByOi?.filter(({ strike }) => {
                    if (!activeMatrixTypeButton) return true;
                    return strike.endsWith(activeMatrixTypeButton);
                  })

                  .map(({ strike, index }: any) => {
                    const strikeData = tableData[strike] || [];

                    return (
                      <>
                        <tr
                          key={strike}
                          className="h-10 border-b border-gray-200"
                        >
                          <td className="group relative sticky -left-1 top-0 z-[10] w-[4.5rem] min-w-[4.5rem] bg-white px-2 text-center font-semibold">
                            {/* Strike Price (always visible) */}
                            <div>{strike.replace("#", " ")}</div>

                            {/* Buy/Sell buttons (only visible on hover) */}
                            <div className="absolute left-4 top-2 flex flex-row items-center justify-center gap-1 bg-white text-[0.7rem] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                              <DisplayHandleSellButton
                                type="LONG"
                                id="buy-button"
                                handleChange={() =>
                                  handleBasketOrder(
                                    matrixBasketData[strike],
                                    "LONG",
                                  )
                                }
                              />
                              <DisplayHandleSellButton
                                type="SHORT"
                                id="sell-button"
                                handleChange={() =>
                                  handleBasketOrder(
                                    matrixBasketData[strike],
                                    "SHORT",
                                  )
                                }
                              />
                            </div>
                          </td>

                          {/* OI Data */}

                          {Object.keys(spotPriceData)
                            .reverse()
                            ?.map((time, idx, keyArray) => {
                              const isLast = idx === keyArray?.length - 1;

                              const oi = strikeData[time] ?? "-";
                              const prevOi = !isLast
                                ? (strikeData[keyArray[idx + 1]] ?? "-")
                                : oi;

                              return (
                                <td
                                  key={time}
                                  className={`min-w-[5rem] px-2 text-center text-black  ${showClassic ? getColorClass(strikeData[time]?.chg_percent) : "bg-white"}`}
                                >
                                  <div className="flex flex-col items-center justify-center gap-[0.15rem] ">
                                    <div className="flex flex-row items-center justify-center gap-1 ">
                                      <span>
                                        {strikeData[time]
                                          ? formatNumber(strikeData[time].oi)
                                          : "-"}
                                      </span>
                                      {!isLast &&
                                        !showClassic &&
                                        strikeData[time]?.chg_percent != 0 && (
                                          <span className="">
                                            <CompareOi
                                              value1={oi.oi}
                                              value2={prevOi.oi}
                                            />
                                          </span>
                                        )}
                                    </div>
                                    {!isLast && !showClassic && (
                                      <span
                                        className={`
                                  inline-block overflow-hidden  transition-opacity duration-300 ease-in-out
                                  ${!isLast && showChgPerc && strikeData[time]?.chg_percent != null && oi != "-" ? "max-h-10 opacity-100" : "max-h-0 opacity-0 "}
                                   ${
                                     strikeData[time]?.chg_percent == 0
                                       ? "text-gray-500"
                                       : strikeData[time]?.chg_percent > 0
                                         ? "text-z-green-500"
                                         : strikeData[time]?.chg_percent < 0
                                           ? "text-red-400"
                                           : ""
                                   }
                                `}
                                      >
                                        ({strikeData[time]?.chg_percent}%)
                                      </span>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OiMatrix;
