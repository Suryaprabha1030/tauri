import React, { useEffect, useState } from "react";
import { formatExpiryDate } from "@/lib/util/DateUtil";
import {
  formatNumber,
  transformedSandBoxObject,
  transformToDesiredStructure,
} from "@/lib/util/DraftUtil";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { useDispatch } from "react-redux";
import {
  setSandboxDataObj,
  setSandboxExited,
  setSelectedStrategy,
  setShowpayoffChart,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";

import { StrategiesSandboxRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { toast } from "react-toastify";
import DisplayHandleSellButton from "../../buySellButton/DisplayHandleSellButton";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";
import { getMinimumExpiryDate } from "../optionFuturesUtil/newStrategyUtil";
import {
  getMultiOiLoad,
  getPayOffChartPayLoad,
  getStrangleOiLoad,
} from "@/lib/redux/slices/StrategyChartSlice";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface StrategyDetailsTableProps {
  strategyData: any;
  strategyName: string;
  strategyExited: boolean;
  onMinExpiryDateChange: (minDate: Date) => void;
  pnlMap: any;
}

const StrategyDetailsTable: React.FC<StrategyDetailsTableProps> = ({
  strategyData,
  strategyName,
  onMinExpiryDateChange,
  strategyExited,
  pnlMap,
}) => {
  const DraftPositions = useSelector(
    (state: RootState) => state.analyzer.setShowDraftPositions,
  );

  const LiveLtpData = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const sandboxId = useSelector(
    (state: RootState) => state.analyzer.setSelectedSandboxId,
  );
  const indexname = useSelector((state: RootState) => state.strategy.indexName);
  const [exitedRows, setExitedRows] = useState<{ [key: string]: boolean }>({});
  const [editingRow, setEditingRow] = useState<string | null>(null); // Tracks the row being edited
  const [editedData, setEditedData] = useState<{ [key: string]: any }>({}); // Tracks edits
  const dispatch = useDispatch();
  const [hoverStrategy, setHoverStrategy] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Filter legs where is_expired and is_exited are false
    const activeLegs: any = Object.values(strategyData).filter(
      (leg: any) => !(leg.is_exited || leg.is_expired),
    );
    const allExpired = Object.values(strategyData).every(
      (leg: any) => leg.is_expired,
    ); //check all expired
    const allExited = Object.values(strategyData).every(
      (leg: any) => leg.is_exited,
    ); //check all exited

    const Payoffpayload = transformToDesiredStructure(activeLegs, indexname);
    if (
      DraftPositions == true &&
      strategyExited != true &&
      !allExpired &&
      !allExited
    ) {
      const minExpiryDate = getMinimumExpiryDate(Object.values(activeLegs));

      if (minExpiryDate) {
        onMinExpiryDateChange(minExpiryDate);
        setTimeout(() => {
          dispatch(getPayOffChartPayLoad(Payoffpayload));
        }, 100);
      }
    } else if (
      (DraftPositions == true && strategyExited == true) ||
      allExpired
    ) {
      dispatch(setShowpayoffChart(false));

      if (allExpired && !allExited) {
        dispatch(setSandboxExited("Expired"));
      } else if (allExited) {
        dispatch(setSandboxExited("Exited"));
      }
    }
  }, [strategyData]);

  const handleExit = (identifier: string) => {
    setEditingRow(null);
    const DraftPositions = new StrategiesSandboxRouterApi(baseConfig());
    // Create updated data and remove 'lots' if 'is_exited' is true for the identifier
    const updatedData = {
      [identifier]: {
        ...strategyData[identifier], // Existing data for the identifier
        is_exited: true, // Update the `is_exited` field to true
        ltp:
          LiveLtpData[identifier] != null &&
          LiveLtpData[identifier] != undefined
            ? LiveLtpData[identifier]
            : strategyData[identifier]?.ltp,
      },
    };

    const payload = {
      name: strategyName,
      data: updatedData,
      is_all_exited: false,
    };

    DraftPositions.modifySandboxV1UsersMeSandboxesModifyIdPut(
      sandboxId,
      payload,
    )
      .then((res) => {
        dispatch(setSelectedStrategy({ setselectedStrategy: res.data }));
        setExitedRows((prev) => ({ ...prev, [identifier]: true }));
      })
      .catch((error) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  };

  const handleExitAll = () => {
    const DraftPositions = new StrategiesSandboxRouterApi(baseConfig());
    setEditingRow(null);
    // Check if there are any rows that are not already exited
    const selectedRows = Object.keys(strategyData).filter(
      (key) => !strategyData[key]?.is_exited,
    );

    if (selectedRows.length === 0) {
      console.error("All rows are already exited.");
      return;
    }

    // Mark all rows as exited by modifying the strategy data
    const updatedData = { ...strategyData };
    selectedRows.forEach((key) => {
      const liveLtp = LiveLtpData[key];
      updatedData[key] = {
        ...updatedData[key],
        is_exited: true, // Mark each row as exited
        ltp:
          liveLtp != null && liveLtp != undefined
            ? liveLtp
            : updatedData[key]?.ltp,
      };
    });

    // Payload to be sent to the API
    const payload = {
      name: strategyName,
      data: updatedData,
      is_all_exited: true, // Set is_all_exited to true to indicate all have been exited
    };

    // Call the API to modify the sandbox data
    DraftPositions.modifySandboxV1UsersMeSandboxesModifyIdPut(
      sandboxId,
      payload,
    )
      .then((res) => {
        // Update exitedRows state to reflect that all rows are exited
        const allExitedRows = Object.keys(updatedData).reduce(
          (acc: any, key) => {
            acc[key] = true; // Mark all rows as exited
            return acc;
          },
          {},
        );
        toast("Strategy Exited", {
          icon: false, // Removes the default icon (tick mark)
        });
        setExitedRows(allExitedRows); // Update exitedRows state
        dispatch(setSelectedStrategy({ setselectedStrategy: res.data }));
      })
      .catch((error) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  };

  const handleEdit = (identifier: string) => {
    setEditingRow(identifier); // Set the row being edited
    setEditedData({
      ...editedData,
      [identifier]: {
        lots: strategyData[identifier]?.lots || 1,
        transaction_type: strategyData[identifier]?.transaction_type || "LONG",
      },
    });
  };

  const handleSave = (identifier: string) => {
    const updatedRow = editedData[identifier];
    if (updatedRow) {
      // Update strategyData locally
      const updatedStrategyData = {
        [identifier]: {
          ...strategyData[identifier],
          ...updatedRow, // Apply edited values
          ltp:
            LiveLtpData[identifier] != null &&
            LiveLtpData[identifier] != undefined
              ? LiveLtpData[identifier]
              : strategyData[identifier]?.ltp,
        },
      };
      // Pass updated data to the API
      const DraftPositions = new StrategiesSandboxRouterApi(baseConfig());
      const payload = {
        name: strategyName,
        data: updatedStrategyData,
        is_all_exited: strategyExited,
      };
      DraftPositions.modifySandboxV1UsersMeSandboxesModifyIdPut(
        sandboxId,
        payload,
      )
        .then((res) => {
          dispatch(setSelectedStrategy({ setselectedStrategy: res.data }));
          setEditingRow(null); // Exit editing mode
        })
        .catch((error) => {
          if (error?.response && error?.response?.status == 401) {
            autoLogoutTokenRemove(router);
          }
          if (error?.response && error?.response?.status == 456) {
            brokerLogoutTokenRemove(router);
          }
        });
    }
  };

  const handleValueChange = (
    identifier: string,
    field: "lots" | "transaction_type",
    value: any,
  ) => {
    setEditedData((prev) => ({
      ...prev,
      [identifier]: {
        ...prev[identifier],
        [field]: value,
      },
    }));
  };

  const handleToggleTransactionType = (identifier: string) => {
    const currentType = editedData[identifier]?.transaction_type || "LONG";
    handleValueChange(
      identifier,
      "transaction_type",
      currentType === "LONG" ? "SHORT" : "LONG",
    );
  };
  const AddToStrategy = () => {
    const filteredData = Object.values(strategyData).filter(
      (item: any) => !item.is_exited && !item.is_expired,
    );
    const sandBoxdata = transformedSandBoxObject(filteredData);
    dispatch(setSandboxDataObj({ setSandboxData: sandBoxdata }));

    dispatch(getPayOffChartPayLoad({}));
    dispatch(getMultiOiLoad([]));
    dispatch(getStrangleOiLoad({}));
    dispatch(showPositionTable(false));
    dispatch(showStrategyTable(true));
    dispatch(showPnlTable(false));
    dispatch(showDraftPositions(false));
    dispatch(setSelectedStrategy({ setselectedStrategy: null }));
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center gap-2 overflow-y-auto overflow-x-hidden scrollbar-none scrollbar-track-gray-100 scrollbar-thumb-z-br-gray ">
        <table className="w-full overflow-y-auto  text-center text-[0.5rem] shadow-lg">
          <thead className="sticky -top-1 z-[11] bg-gray-50 text-[0.68rem] uppercase md:max-xl:h-[0.8rem] ">
            <tr className="h-7 text-[0.68rem] text-z-gray-300 max-sm:w-full max-sm:text-[0.6rem] md:max-xl:h-[0.8rem] xl:w-[1rem]">
              <th
                scope="col"
                className="w-[10rem]  px-1 py-[0.1rem] font-tableHead max-md:hidden md:max-2xl:py-[0.6rem] xl:max-2xl:w-[7rem]"
              >
                Expiry
              </th>
              <th
                scope="col"
                className="px-1 py-[0.1rem] font-tableHead max-md:hidden md:max-2xl:py-[0.6rem] xl:max-2xl:w-[4rem]"
              >
                Strike Price
              </th>
              {/* Only for Small Screen */}
              <th
                scope="col"
                className={`w-[7rem] px-0.5 py-[0.1rem] font-tableHead sm:max-md:py-[0.45rem] md:hidden ${strategyExited == true ? "max-sm:w-[44%] sm:max-md:w-[40%]" : ""}`}
              >
                Symbol
              </th>
              {/* Only for Small Screen */}
              <th
                scope="col"
                className={`py-[0.1rem] font-tableHead max-sm:px-0.5 sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:px-1 ${strategyExited == true ? "max-sm:w-[20%] sm:max-xl:w-[18%]" : ""}`}
              >
                Lots
              </th>
              <th
                scope="col"
                className={`py-[0.1rem] font-tableHead max-sm:px-0.5 sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:px-1 ${strategyExited == true ? "max-sm:w-[20%] sm:max-xl:w-[18%]" : ""}`}
              >
                AVG
              </th>
              <th
                scope="col"
                className={`py-[0.1rem] font-tableHead max-sm:px-0.5 sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:px-1 ${strategyExited == true ? "max-sm:w-[20%] sm:max-xl:w-[18%]" : ""}`}
              >
                LTP
              </th>
              <th
                scope="col"
                className="py-[0.1rem] font-tableHead max-md:hidden max-sm:px-0.5 md:max-2xl:py-[0.6rem] xl:px-1"
              >
                P&L
              </th>
              <th
                scope="col"
                className={`py-[0.1rem] font-tableHead max-sm:px-0.5 sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:px-1 ${strategyExited == true ? "max-xl:hidden" : ""}`}
              >
                {!strategyExited && "B/S"}
              </th>
              <th
                className={`${
                  strategyExited == true
                    ? "max-xl:hidden"
                    : "max-sm:px-0.5 max-sm:py-[0.1rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem]"
                }`}
              ></th>
              <th
                className={`${
                  strategyExited == true
                    ? "max-xl:hidden"
                    : "max-sm:px-0.5 max-sm:py-[0.1rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem]"
                }`}
              ></th>
            </tr>
          </thead>
          <tbody>
            {strategyData &&
              Object.values(strategyData).map((item: any) => (
                <React.Fragment key={`${item.identifier}-${item.is_exited}`}>
                  <tr
                    key={`${item.identifier}-${item.is_exited}`}
                    className={`h-7 max-sm:w-full ${
                      editingRow === item.identifier ? "" : "border-b"
                    } ${
                      item.is_exited == true || item.is_expired == true
                        ? "text-gray-500"
                        : "text-black"
                    } text-[0.78rem] font-table max-sm:text-[0.58rem] md:max-xl:h-[0.8rem]`}
                  >
                    <td className="flex w-[10rem] flex-row items-center justify-center gap-1 px-1 py-[0.1rem] max-md:hidden md:max-2xl:py-[0.6rem] xl:max-2xl:w-[7rem] xl:max-2xl:flex-col">
                      <span>{formatExpiryDate(item.expiry_date)}</span>
                      <div className="inline-flex h-5 w-7 items-center justify-center rounded-xl border border-2">
                        <div className="flex h-5 w-5 items-center justify-center text-center  ">
                          {item.option_type}
                        </div>
                      </div>
                    </td>
                    <td className="px-1 py-[0.1rem] max-md:hidden md:max-2xl:py-[0.6rem]">
                      {item.strike_price}
                    </td>
                    {/* Only for Small Screen */}
                    <td className="flex flex-col items-center justify-center px-[0.5rem] sm:max-md:py-[0.45rem] md:hidden  ">
                      <span>{item.display_symbol_name}</span>
                      <span
                        className={` ${
                          item.is_exited == true || item.is_expired == true
                            ? "text-gray-500"
                            : pnlMap[item.identifier]
                              ? pnlMap[item.identifier] > 0
                                ? "text-z-green-500"
                                : pnlMap[item.identifier] < 0
                                  ? "text-red-400"
                                  : "text-gray-500"
                              : item.pnl > 0
                                ? "text-z-green-500"
                                : item.pnl < 0
                                  ? "text-red-400"
                                  : "text-gray-500"
                        }`}
                      >
                        {pnlMap[item.identifier] &&
                        strategyData[item.identifier]?.is_exited !== true
                          ? pnlMap[item.identifier] > 0
                            ? `+${formatNumber(pnlMap[item.identifier]?.toFixed(2))}` // Add "+" for positive pnl
                            : formatNumber(pnlMap[item.identifier]?.toFixed(2))
                          : item.pnl > 0
                            ? `+${formatNumber(item.pnl.toFixed(2))}` // Add "+" for positive pnl
                            : formatNumber(item.pnl.toFixed(2))}
                      </span>
                    </td>
                    {/* Only for Small Screen */}
                    <td className="py-[0.1rem] max-sm:px-0.5 sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:px-1">
                      {editingRow === item.identifier ? (
                        <select
                          value={editedData[item.identifier]?.lots || item.lots}
                          onChange={(e) =>
                            handleValueChange(
                              item.identifier,
                              "lots",
                              parseInt(e.target.value),
                            )
                          }
                          onDoubleClick={(event: any) => {
                            event.stopPropagation();
                          }}
                          className="w-[3rem] rounded-lg border border-gray-300 bg-gray-50 text-center text-[0.65rem] scrollbar-none max-sm:px-0.5 xl:px-1 "
                        >
                          {Array.from({ length: 20 }, (_, i) => i + 1).map(
                            (lot) => (
                              <option key={lot} value={lot}>
                                {lot}
                              </option>
                            ),
                          )}
                        </select>
                      ) : (
                        item.lots
                      )}
                    </td>

                    <td className="py-[0.1rem] max-sm:px-0.5 sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:px-1">
                      {item.avg_price.toFixed(2)}
                    </td>
                    <td className="px-1 py-[0.1rem] md:max-xl:py-[0.6rem]">
                      {LiveLtpData[item.identifier] &&
                      strategyData[item.identifier]?.is_exited != true &&
                      strategyData[item.identifier]?.is_expired != true
                        ? LiveLtpData[item.identifier]
                        : item.ltp.toFixed(2)}
                    </td>
                    <td
                      className={`px-1 py-[0.1rem] max-md:hidden md:max-2xl:py-[0.6rem] ${
                        item.is_exited == true || item.is_expired == true
                          ? "text-gray-500"
                          : pnlMap[item.identifier]
                            ? pnlMap[item.identifier] > 0
                              ? "text-z-green-500"
                              : pnlMap[item.identifier] < 0
                                ? "text-red-400"
                                : "text-gray-500"
                            : item.pnl > 0
                              ? "text-z-green-500"
                              : item.pnl < 0
                                ? "text-red-400"
                                : "text-gray-500"
                      }`}
                    >
                      {pnlMap[item.identifier] &&
                      strategyData[item.identifier]?.is_exited !== true
                        ? pnlMap[item.identifier] > 0
                          ? `+${formatNumber(pnlMap[item.identifier]?.toFixed(2))}` // Add "+" for positive pnl
                          : formatNumber(pnlMap[item.identifier]?.toFixed(2))
                        : item.pnl > 0
                          ? `+${formatNumber(item.pnl.toFixed(2))}` // Add "+" for positive pnl
                          : formatNumber(item.pnl.toFixed(2))}
                    </td>

                    <td
                      className={`whitespace-nowrap py-[0.1rem] max-sm:px-0.5 sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] xl:px-1  ${strategyExited == true ? "max-xl:hidden" : ""}`}
                    >
                      {/* hide transaction type if the leg is exited or all exited */}
                      {!(
                        strategyData[item.identifier]?.is_exited ||
                        strategyData[item.identifier]?.is_expired ||
                        exitedRows[item.identifier] ||
                        strategyExited
                      ) && (
                        <div>
                          {editingRow === item.identifier ? (
                            <DisplayHandleSellButton
                              type={
                                editedData[item.identifier]?.transaction_type
                              }
                              handleChange={() =>
                                handleToggleTransactionType(item.identifier)
                              }
                              handleDoubleClick={(event: any) => {
                                event.stopPropagation();
                              }}
                            />
                          ) : (
                            <DisplayHandleSellButton
                              type={item.transaction_type}
                            />
                          )}
                        </div>
                      )}
                    </td>

                    <td
                      className={`flex justify-center sm:max-md:py-[0.45rem] md:max-2xl:py-[0.66rem] ${strategyExited == true ? "max-xl:hidden" : ""}`}
                    >
                      {editingRow === item.identifier ? null : (
                        <img
                          src="/svg/editNote.svg"
                          width={20}
                          height={20}
                          alt="EDIT"
                          className={` max-md:pt-[0.8rem] xl:max-2xl:mt-[1.5rem] ${
                            strategyData[item.identifier]?.is_exited ||
                            strategyData[item.identifier]?.is_expired ||
                            exitedRows[item.identifier] ||
                            strategyExited == true
                              ? "hidden"
                              : "cursor-pointer"
                          }`}
                          onClick={() => {
                            if (!strategyExited) handleEdit(item.identifier);
                          }}
                          onDoubleClick={(event: any) => {
                            event.stopPropagation();
                          }}
                        />
                      )}
                    </td>

                    <td
                      className={`max-sm:text-[0.7rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] ${strategyExited == true ? "max-xl:hidden" : ""}`}
                    >
                      {strategyExited === false &&
                        (strategyData[item.identifier]?.is_expired &&
                        !strategyData[item.identifier]?.is_exited ? (
                          <span className="text-gray-500">Expired</span>
                        ) : strategyData[item.identifier]?.is_exited ||
                          exitedRows[item.identifier] ? (
                          <span className="text-gray-500">Exited</span>
                        ) : (
                          <button
                            className="w-[2rem] rounded-lg text-center text-red-500"
                            onClick={() => handleExit(item.identifier)}
                            onDoubleClick={(event: any) => {
                              event.stopPropagation();
                            }}
                            disabled={false} // Button should only be shown when actionable
                          >
                            Exit
                          </button>
                        ))}
                    </td>
                  </tr>
                  {editingRow === item.identifier && (
                    <tr className="h-7 border-b text-[0.68rem]  font-semibold md:max-xl:h-[2.5rem]">
                      <td
                        colSpan={10}
                        className="  px-1 py-[0.2rem] text-right md:max-xl:py-[0.3rem]"
                      >
                        <button
                          onClick={() => handleSave(item.identifier)}
                          onDoubleClick={(event: any) => {
                            event.stopPropagation();
                          }}
                          className="mr-2  rounded-3xl  border border-z-green-500 px-2 py-0.5 font-medium   leading-none text-z-green-500 text-z-green-500 hover:bg-z-green-500 hover:text-white"
                        >
                          Save
                        </button>

                        <button
                          onClick={() => setEditingRow(null)}
                          onDoubleClick={(event: any) => {
                            event.stopPropagation();
                          }}
                          className=" rounded-3xl rounded-3xl  border border-gray-400 px-2 py-0.5 font-medium   leading-none text-gray-500  hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
        <div className="flex flex-row gap-4 sm:max-md:py-[0.45rem] md:max-xl:py-[0.6rem]">
          {/*Add to strategy is hidden*/}
          {/* <span
            className={`flex flex  w-[5.5rem] cursor-pointer items-center justify-center justify-center gap-1 rounded-3xl border border-z-green-500 p-1 text-[0.75rem] font-medium leading-none text-z-green-500 hover:bg-z-green-500  hover:text-white md:max-xl:w-[7rem] md:max-xl:gap-2 md:max-xl:py-[0.5rem] md:max-xl:pr-[0.4rem] ${
              Object.keys(exitedRows).length ===
                Object.keys(strategyData).length || strategyExited == true
                ? "hidden"
                : ""
            }`}
            onClick={() => AddToStrategy()}
            onDoubleClick={(event: any) => {
              event.stopPropagation();
            }}
            onMouseEnter={() => setHoverStrategy(false)}
            onMouseLeave={() => setHoverStrategy(true)}
          >
            <img
              src={hoverStrategy ? "/svg/plusSymbol.svg" : "/svg/whiteAdd.svg"}
              width={15}
              height={15}
              alt="add to strategy"
            />
            strategy
          </span> */}

          <button
            id="Exit_All_sandbox"
            className={`flex w-[5rem] cursor-pointer items-center justify-center rounded-3xl md:max-xl:w-[6.5rem] ${
              Object.keys(exitedRows).length ===
                Object.keys(strategyData).length || strategyExited == true
                ? "hidden"
                : " border border-red-500 leading-none text-red-500 hover:bg-red-500 hover:text-white "
            } p-1 text-[0.75rem] font-medium leading-none`}
            onClick={handleExitAll}
            onDoubleClick={(event: any) => {
              event.stopPropagation();
            }}
            disabled={
              Object.keys(exitedRows).length ===
              Object.keys(strategyData).length
            }
          >
            Exit All
          </button>
        </div>
      </div>
    </div>
  );
};

export default StrategyDetailsTable;
