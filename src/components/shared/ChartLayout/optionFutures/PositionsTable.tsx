import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RootState } from "@/lib/redux/Store";
import { useSelector } from "react-redux";
import {
  calculateTotalPnl,
  extractKeywords,
  findValuesByCategory,
  groupByCategory,
  PositiontransformData,
  transformData,
} from "./optionFuturesUtil/legUtil";
import {
  checkPosition,
  getCheckedPositionData,
} from "@/lib/redux/slices/AnalyzerSlice";
import { useDispatch } from "react-redux";
import {
  setStockData,
  togglePlaceOrderVisibility,
} from "@/lib/redux/slices/PlaceOrder";
import TabEmptyInfo from "./emptyInfo/TabEmptyInfo";
import { updatePositionsWithPnL } from "@/lib/util/sideToolBar/positions/managePositionsData";
import { formatExpiryDate } from "@/lib/util/DateUtil";
import { formatNumber } from "@/lib/util/DraftUtil";
import { setCheckedTotalPnl } from "@/lib/redux/slices/PositionSlicer";
import { setPositions } from "@/lib/redux/slices/StrategySlice";

interface OptionData {
  symbol: string;
  strike_price: string;
  expiry: string;
  lots: number;
  ltp: number;
  transaction_type?: string;
}

interface PositionTableProps {
  setpositionTableData: React.Dispatch<React.SetStateAction<{}>>;
  positionTableData: {};
  query: string;
  setIndexWiseTable: Dispatch<SetStateAction<{}>>;
  indexWiseTable: any;
  setPnlValue: Dispatch<SetStateAction<any>>;
  setCheckedPositionRows: Dispatch<SetStateAction<any>>;
  checkedPositionRows: any;
}

const PositionTable: React.FC<PositionTableProps> = ({
  setpositionTableData,
  positionTableData,
  query,
  setIndexWiseTable,
  indexWiseTable,
  setPnlValue,
  checkedPositionRows,
  setCheckedPositionRows,
}) => {
  const frompositionsdata = useSelector(
    (state: RootState) => state.strategy.positions
  );
  const positionGroup = groupByCategory(positionTableData);

  const keywords = extractKeywords(positionGroup);
  const [checkIndex, setCheckIndex] = useState(false);

  const dispatch = useDispatch();
  const positionDatas = useSelector(
    (state: RootState) => state.analyzer.PositionDataList
  ); //checked position data
  const checkPositionDatas = useSelector(
    (state: RootState) => state.analyzer.checkPositionData
  );
  const currentBrokerName = useSelector(
    (state: RootState) => state.Position.BrokerName
  );
  const [isAllCheckedPositionsRows, setIsAllCheckedPositionsRows] =
    useState(false);
  const [smartApi, setSmartApi] = useState(false);
  const [buttonId, setButtonId] = useState("");
  const lotSize: any = useSelector(
    (state: RootState) => state.strategy.lotSizeData
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  const [updatedPositionsMap, setUpdatedPositionsMap] = useState<
    Record<string, any>
  >({});
  const hideButton = document.getElementById("showHidebutton");
  const [enableButtons, setEnableButtons] = useState(false);
  const [checkedDatas, setCheckedDatas] = useState({});

  // when datas checked and exited did by user update the data for checkedrows and its helps payoff chart payload
  useEffect(() => {
    if (Object.entries(checkedDatas).length > 0) {
      const nonExited: Record<string, any> = {};
      for (const key in checkedDatas) {
        if (checkedDatas[key]?.transaction_type !== "EXITED") {
          nonExited[key] = checkedDatas[key];
        }
      }
      setCheckedPositionRows(nonExited);
    }
  }, [positionTableData]);
  // here asend sorting  according to transaction_type !== "EXITED" and that key checkbox chacked
  useEffect(() => {
    const sortedPositionsData =
      frompositionsdata &&
      [...frompositionsdata].sort((a, b) => {
        if (a.transaction_type === "EXITED" && b.transaction_type !== "EXITED")
          return 1;
        if (a.transaction_type !== "EXITED" && b.transaction_type === "EXITED")
          return -1;
        return 0;
      });
    if (!webSocketDataRead) return;
    const data = transformData(sortedPositionsData, webSocketDataRead);

    setpositionTableData(data);
  }, [frompositionsdata, query]);

  useEffect(() => {
    if (!webSocketDataRead) return;

    setpositionTableData((prev) => {
      if (!prev) return prev;

      let updated = false;
      const next = { ...prev };

      Object.keys(next).forEach((key) => {
        const row = next[key];
        const ltpFromWs = webSocketDataRead[row?.identifier];

        if ((row.ltp == null || row.ltp === 0) && ltpFromWs != null) {
          next[key] = {
            ...row,
            ltp: ltpFromWs,
          };
          updated = true;
        }
      });

      return updated ? next : prev;
    });
  }, [webSocketDataRead]);

  // here function is get checkdata
  const getCheckedData: any = () => {
    return Object.entries(positionTableData)
      .filter(([key]) => checkedPositionRows[key] || false)
      .reduce(
        (acc, [key, value]: any) => {
          acc[key] = {
            ...value,
            checked: checkedPositionRows[key] || false, // Add checked property
            ltp: webSocketDataRead && webSocketDataRead[value?.identifier],
          };
          return acc;
        },
        {} as { [key: string]: OptionData }
      );
  };

  // here only payload pass for ns table=>ns table sent payload to payoffchart
  useEffect(() => {
    if (lotSize[query] != undefined) {
      const data = getCheckedData();

      if (Object.entries(data).length == 0) {
        dispatch(
          getCheckedPositionData({
            PositionData: {}, // Pass empty object to clear the state
          })
        );
        return;
      } else {
        const checkedDatas = PositiontransformData(
          getCheckedData(),
          lotSize[query]
        );
        dispatch(
          getCheckedPositionData({
            PositionData: checkedDatas,
          })
        );
      }
    }
  }, [checkedPositionRows]);

  // here check/uncheck each position
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const isChecked = event.target.checked;
    setCheckIndex(!checkIndex);

    // setIsAllCheckedPositionsRows(isChecked);
    setCheckedPositionRows((prev: any) => ({
      ...prev,
      [key]: isChecked,
    }));
    dispatch(checkPosition(!checkPositionDatas));
  };
  // here set index wise table
  useEffect(() => {
    if (
      Object.entries(positionTableData).length > 0 &&
      query &&
      keywords.includes(query)
    ) {
      const read = findValuesByCategory(query, positionGroup);
      if (read != null && keywords.includes(query)) {
        setIndexWiseTable(read);

        const totalPnl = calculateTotalPnl(read);
        setPnlValue(totalPnl);
      }
    }
  }, [positionTableData, query, positionDatas]);

  // when index change =>check index exixt or not
  useEffect(() => {
    setIsAllCheckedPositionsRows(false);
    setCheckedPositionRows({});
    if (keywords && !keywords.includes(query)) {
      setIndexWiseTable({});
      setCheckedPositionRows({});
      dispatch(getCheckedPositionData({ PositionData: {} }));
    }
  }, [query]);

  // over all check box=>manual handling
  const handleHeaderPositionsCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked;
    setCheckedPositionRows(
      Object.keys(indexWiseTable).reduce((acc: any, key) => {
        acc[key] = isChecked;
        return acc;
      }, {})
    );
    setIsAllCheckedPositionsRows(isChecked);
    dispatch(checkPosition(!checkPositionDatas));
  };

  //  over all check box=>if all check its check,if all uncheck its uncheck,if one uncheck its uncheck
  useEffect(() => {
    if (Object.entries(checkedPositionRows)?.length > 0) {
      const allChecked = Object.keys(indexWiseTable)
        .filter((key) => indexWiseTable[key]?.transaction_type !== "EXITED")
        .every((key) => checkedPositionRows[key]);

      setIsAllCheckedPositionsRows(allChecked);
    }
  }, [checkedPositionRows]);

  //   exit function
  const handleExit = () => {
    setSmartApi(true);
    setButtonId("ExitAll");
    dispatch(togglePlaceOrderVisibility(true));
    const updatedCheckedData = Object.values(checkedDatas)
      .filter((item: any) => item?.transaction_type !== "EXITED")
      .map((item: any) => ({
        ...item,
        transaction_type: item.transaction_type === "SHORT" ? "LONG" : "SHORT",
      }));
    dispatch(setStockData(updatedCheckedData));
  };

  useEffect(() => {
    const checked = getCheckedData();
    setCheckedDatas(checked);
  }, [checkedPositionRows, positionTableData]);

  const stocks =
    indexWiseTable &&
    Object.entries(checkedDatas).map(([key, position]: any) => ({
      exchange: position.exchange, // Destructure the 'exchange' from the position object
      tradingsymbol: position.symbol, // Use the key as tradingsymbol
      quantity: position.quantity,
      transactiontype: position.transaction_type === "SHORT" ? "BUY" : "SELL",
      ordertype: "MARKET",
      producttype: position.product,
    }));

  useEffect(() => {
    if (
      !indexWiseTable ||
      typeof indexWiseTable !== "object" ||
      !webSocketDataRead
    )
      return;
    const positionsArray = Object.values(indexWiseTable);
    const activePositions = positionsArray.filter(
      (position: any) =>
        !(position.quantity === 0 && position.transaction_type === "EXITED")
    );
    if (activePositions.length === 0) return; // No need to update if all positions are exited
    // Update positions with WebSocket data
    const { updatedPositions } = updatePositionsWithPnL(
      activePositions,
      webSocketDataRead,
      currentBrokerName
    );
    const updatedPositionsMap = updatedPositions.reduce(
      (acc: Record<string, any>, position: any) => {
        acc[position.identifier] = position;
        return acc;
      },
      {}
    ); //Store it as key pair value with key as identifier for retrival

    setUpdatedPositionsMap(updatedPositionsMap);
  }, [webSocketDataRead, indexWiseTable]);

  useEffect(() => {
    // Step 1: Get checkedData that are NOT exited
    const activeCheckedDatas =
      checkedDatas &&
      Object.values(checkedDatas).filter(
        (checked: any) =>
          !Object.values(indexWiseTable).some(
            (entry: any) =>
              entry.identifier === checked.identifier &&
              entry.transaction_type === "EXITED"
          )
      );
    // Step 2: Get exited transactions from indexWiseTable
    const exitedEntries =
      indexWiseTable &&
      Object.values(indexWiseTable).filter(
        (entry: any) => entry.transaction_type === "EXITED"
      );

    // Step 3: Calculate total PnL for active checkedDatas
    const activeCheckedPnl: any = activeCheckedDatas?.reduce(
      (total, data: any) => {
        const identifier = data.identifier;
        const updatedPnl =
          updatedPositionsMap[identifier]?.pnl || data?.pnl || 0;
        return total + updatedPnl;
      },
      0
    );
    // Step 4: Calculate total PnL for exited entries
    const exitedPnl = exitedEntries?.reduce((sum, entry: any) => {
      const updatedPnl =
        updatedPositionsMap[entry.identifier]?.pnl || entry.pnl || 0;
      return sum + updatedPnl;
    }, 0);
    // Step 5: Combine both PnL values
    const finalTotalPnl = activeCheckedPnl + exitedPnl;

    // Dispatch the final PnL value
    dispatch(setCheckedTotalPnl({ totalCheckedPnl: finalTotalPnl }));
  }, [checkedDatas, indexWiseTable, webSocketDataRead]);

  useEffect(() => {
    if (Object.keys(positionDatas).length === 0) {
      setCheckedPositionRows((prev) => {
        if (Object.keys(prev).length !== 0) {
          return {};
        }
        return prev;
      });
      setIsAllCheckedPositionsRows(false);
    }
  }, [positionDatas]);
  useEffect(() => {
    if (checkedDatas && Object.entries(checkedDatas).length > 0) {
      setEnableButtons(true);
    } else {
      setEnableButtons(false);
    }
  }, [checkedDatas]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-2">
      {indexWiseTable && Object.keys(indexWiseTable).length > 0 ? (
        <div className="h-full w-full max-xl:inline-flex max-xl:flex-col">
          <div
            className={`max-h-[80%] w-full overflow-y-auto   overflow-x-hidden max-xl:scrollbar-none max-sm:max-h-[11rem] sm:max-xl:max-h-[23rem] xl:scrollbar-thin xl:scrollbar-track-gray-100 xl:scrollbar-thumb-z-br-gray`}
          >
            <table className="w-full table-fixed overflow-y-auto border-2 border-z-blue-100 text-center  text-[0.5rem] xl:shadow-lg">
              <thead className="sticky -top-1 z-[11] bg-gray-50 text-[0.68rem] uppercase   ">
                <tr className="h-7 border-b text-[0.68rem] text-z-gray-300">
                  <th className="bg-gray-50 py-2 text-xs font-tableHead uppercase tracking-wider text-gray-700 max-sm:w-[1rem] md:max-2xl:py-[0.6rem] xl:max-2xl:w-[2rem] 2xl:w-[1.5rem]">
                    {Object.values(indexWiseTable).some(
                      (position: any) => position?.transaction_type !== "EXITED"
                    ) && (
                      <input
                        type="checkbox"
                        checked={isAllCheckedPositionsRows}
                        onChange={handleHeaderPositionsCheckboxChange}
                        className="max-md:h-2.5 max-md:w-2.5 md:max-2xl:h-3 md:max-2xl:w-3"
                        onDoubleClick={(event: any) => {
                          event.stopPropagation();
                        }}
                      />
                    )}
                  </th>

                  <th
                    scope="col"
                    className=" px-1 py-[0.1rem] font-tableHead max-md:w-[7rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] md:max-xl:w-[9rem] xl:w-[30%] 2xl:w-[25%]"
                  >
                    Symbol
                  </th>
                  {/* <th
                    scope="col"
                    className=" px-1 py-[0.1rem] font-tableHead max-sm:hidden sm:max-md:w-[6.5rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] md:max-xl:w-[8rem]  xl:w-[15%]"
                  >
                    Strike Price
                  </th> */}
                  <th
                    scope="col"
                    className=" px-1 py-[0.1rem] font-tableHead sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem]  xl:w-[7%]"
                  >
                    Qty
                  </th>
                  <th
                    scope="col"
                    className="  px-1 py-[0.1rem] font-tableHead  sm:max-md:py-[0.45rem]  md:max-2xl:py-[0.6rem] "
                  >
                    Avg
                  </th>
                  <th
                    scope="col"
                    className=" px-1 py-[0.1rem] font-tableHead sm:max-md:py-[0.45rem]  md:max-2xl:py-[0.6rem]"
                  >
                    LTP
                  </th>
                  <th
                    scope="col"
                    className=" px-1 py-[0.1rem] font-tableHead sm:max-md:py-[0.45rem]  md:max-2xl:py-[0.6rem]"
                  >
                    P&L
                  </th>
                </tr>
              </thead>
              <tbody>
                {indexWiseTable &&
                  Object.entries(indexWiseTable).map(([key, option]: any) => (
                    <tr
                      key={key}
                      className={`h-7 w-full border-b text-center text-[0.75rem] font-table max-sm:text-[0.68rem]  2xl:text-global ${
                        option?.transaction_type !== "EXITED"
                          ? "text-black"
                          : "text-gray-500"
                      }`}
                    >
                      <td className="whitespace-nowrap py-[0.1rem] max-sm:w-[1rem] sm:max-md:py-[0.45rem] md:max-xl:py-[0.6rem] ">
                        {option?.transaction_type !== "EXITED" ? (
                          <input
                            type="checkbox"
                            checked={checkedPositionRows[key] || false}
                            onChange={(event) => handleChange(event, key)}
                            onDoubleClick={(event: any) => {
                              event.stopPropagation();
                            }}
                            className="form-checkbox rounded border-gray-50 text-blue-600 max-md:h-2.5 max-md:w-2.5 md:h-3 md:w-3 md:max-2xl:py-[0.6rem]"
                          />
                        ) : (
                          ""
                        )}
                      </td>

                      <td className="whitespace-nowrap px-1 py-[0.1rem] max-sm:w-[7rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem]">
                        {/* {formatExpiryDate(option.expiry) ||
                          formatExpiryDate(option.expiry_date)} */}
                        {option.display_symbol_name
                          .split(" ")
                          .slice(1, 3)
                          .join(" ")}
                        {(option.option_type === "CE" ||
                          option.option_type === "PE" ||
                          option.option_type == "FUT") && (
                          <span className="whitespace-nowrap px-1 py-[0.1rem] sm:max-md:py-[0.45rem]  ">
                            <div className="inline-flex h-5 w-7 items-center justify-center rounded-xl border border-2">
                              <div className="flex h-5 w-5 items-center justify-center text-center max-sm:text-[0.68rem]   ">
                                {option.option_type}
                              </div>
                            </div>
                          </span>
                        )}
                      </td>
                      {/* <td
                        className={`whitespace-wrap px-1 py-[0.1rem] max-sm:hidden sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem]`}
                      >
                        {option.strike_price}
                      </td> */}
                      <td
                        className={`${
                          option.transaction_type.toUpperCase() === "LONG"
                            ? "text-z-green-500"
                            : option.transaction_type.toUpperCase() === "SHORT"
                              ? "text-red-400"
                              : "text-gray-500"
                        } whitespace-nowrap px-1 py-[0.1rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem]`}
                      >
                        {option.quantity}
                      </td>
                      <td
                        className={`whitespace-wrap px-1 py-[0.1rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] `}
                      >
                        {formatNumber(option.avg_net_price)}
                      </td>
                      <td className="whitespace-nowrap px-1 py-[0.1rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem]">
                        {/* {option.transaction_type === "EXITED"
                          ? formatNumber(option.ltp) // Display the `option.ltp` for "EXITED"
                          : webSocketDataRead[option.identifier]
                            ? formatNumber(webSocketDataRead[option.identifier])
                            : formatNumber(option.ltp)} */}
                        {option?.identifier &&
                          webSocketDataRead[option.identifier]}
                      </td>
                      <td
                        className={`whitespace-wrap px-1 py-[0.1rem] sm:max-md:py-[0.45rem] md:max-2xl:py-[0.6rem] ${
                          option.transaction_type === "EXITED"
                            ? "text-gray-500"
                            : updatedPositionsMap[option.identifier]?.pnl !==
                                undefined
                              ? updatedPositionsMap[option.identifier]?.pnl < 0
                                ? "text-red-400"
                                : "text-z-green-500"
                              : option.pnl < 0
                                ? "text-red-400"
                                : "text-z-green-500"
                        }`}
                      >
                        {option.transaction_type === "EXITED"
                          ? formatNumber(option.pnl) // Display the `option.pnl` for "EXITED"
                          : updatedPositionsMap[option.identifier]?.pnl
                            ? formatNumber(
                                updatedPositionsMap[option.identifier]?.pnl
                              )
                            : formatNumber(option.pnl)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <>
            {Object.values(indexWiseTable).some(
              (position: any) => position.transaction_type !== "EXITED"
            ) && (
              <div className="px-6 text-center max-xl:h-[3rem] max-sm:py-2.5 sm:max-md:py-[0.45rem] md:max-xl:py-[0.6rem] xl:max-2xl:pt-2 2xl:py-4">
                <button
                  id="ExitAll"
                  className={`rounded-3xl border border-red-500 text-[0.75rem]  font-table leading-none text-red-500  hover:bg-red-500 hover:text-white max-sm:px-3 max-sm:py-0.5 max-sm:text-sm sm:px-4 sm:max-md:py-[0.3rem] md:max-xl:py-[0.4rem] xl:py-1 ${enableButtons ? "" : "pointer-events-none opacity-50"}`}
                  onClick={() => handleExit()}
                  onDoubleClick={(event: any) => {
                    event.stopPropagation();
                  }}
                >
                  Exit All
                </button>
              </div>
            )}
          </>
        </div>
      ) : (
        <TabEmptyInfo name={` No ${query} Positions Available`} />
      )}
    </div>
  );
};

export default React.memo(PositionTable);
