import React, { Dispatch, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setExpandSelectedSandbox,
  setSelectedStrategy,
  setShowSelectedSandboxName,
} from "@/lib/redux/slices/AnalyzerSlice";
import { RootState } from "@/lib/redux/Store";
import { StrategiesSandboxRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import StrategyDetailsTable from "./StrategyDetailTable";
import Image from "next/image";
import { CalculatePnl, formatNumber } from "@/lib/util/DraftUtil";
import PaginationLoading from "@/components/shared/commonUtil/PaginationLoading";
import { toast } from "react-toastify";
import TabEmptyInfo from "../emptyInfo/TabEmptyInfo";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface DraftPositionsTableProps {
  DraftName: string;
  onMinExpiryDateChange: (minDate: Date) => void;
  setDraftName: Dispatch<React.SetStateAction<any>>;
  setToggleOpt: Dispatch<React.SetStateAction<boolean>>;
}

const DraftPositionsTable: React.FC<DraftPositionsTableProps> = ({
  DraftName,
  onMinExpiryDateChange,
  setDraftName,

  setToggleOpt,
}) => {
  const [List, setList] = useState<any[]>([]);
  const [deleteState, setDeleteState] = useState<boolean>(false);
  const selectedStrategy = useSelector(
    (state: RootState) => state.analyzer.setselectedStrategy,
  );
  const ExpandSelectedId = useSelector(
    (state: RootState) => state.analyzer.ExpandSelectedSandbox,
  );
  const indexname = useSelector((state: RootState) => state.strategy.indexName);
  const DraftPositions = useSelector(
    (state: RootState) => state.analyzer.setShowDraftPositions,
  );
  const [totalPnlMap, setTotalPnlMap] = useState<{ [key: string]: number }>({});
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const sandBoxRef = useRef<HTMLDivElement>(null);
  const [isEnd, setIsEnd] = useState(false);
  const [callEnd, setCallEnd] = useState(true);
  const [ApiResponse, setApiResponse] = useState<any[]>([]);
  const [pnlMap, setPnlMap] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const dispatch = useDispatch();

  const LiveLtpData = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const router = useRouter();

  const getAllSandbox = (indexname: string, pageNum: number) => {
    if (DraftPositions) {
      const DraftPositions = new StrategiesSandboxRouterApi(baseConfig());

      DraftPositions.getAllSandboxesByIndexnameV1UsersMeSandboxesByIndexNameIndexNameGet(
        indexname,
        pageNum,
      )
        .then((res) => {
          const data = res.data;
          setApiResponse(data);

          if (data && data.length > 0) {
            setList((prevList) => {
              let updatedList;

              // For the first page, replace the list with the API response
              if (pageNum === 1) {
                const newItems = data; // All the new items for page 1
                const existingIds = new Set(prevList.map((item) => item.id));

                // Filter out new items that already exist in the prevList
                const newItemsOnly = newItems.filter(
                  (item: any) => !existingIds.has(item.id),
                );

                // Concatenate new items at the top and existing items after
                updatedList = [...newItemsOnly, ...prevList];
              } else {
                // For subsequent pages, concatenate the new data while ensuring no duplicates
                const existingIds = new Set(prevList.map((item) => item.id));
                const newItems = data.filter(
                  (newItem: any) => !existingIds.has(newItem.id),
                );

                // Concatenate previous list with new items in the order of the API response
                updatedList = [...prevList, ...newItems];
              }

              // Ensure the list is sorted by updated_at (or any other logic you want)
              updatedList = updatedList.sort((a, b) => {
                return (
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
                );
              });

              return [...updatedList];
            });
          }

          if (res.status === 204 || data.length === 0) {
            setCallEnd(false);
            setHasMoreData(false);
          }
          setIsEnd(false);
          setDraftName(null);
          setIsLoading(false);
        })
        .catch((error: any) => {
          if (error?.response && error?.response?.status == 401) {
            autoLogoutTokenRemove(router);
          }
          if (error?.response && error?.response?.status == 456) {
            brokerLogoutTokenRemove(router);
          }
          setIsLoading(false);
        });
    }
  };
  const checkContainerFill = () => {
    const container = sandBoxRef.current;
    if (!container || isLoading || !hasMoreData) return;

    // Check if container has scrollbar (is overflowing)
    const hasVerticalScrollbar =
      container?.scrollHeight > container?.clientHeight;

    // If no scrollbar and we have more data, load next page
    if (!hasVerticalScrollbar && hasMoreData) {
      setPageNum((prev) => {
        const nextPage = prev + 1;
        getAllSandbox(indexname, nextPage);
        return nextPage;
      });
    }
  };
  useEffect(() => {
    setPageNum(1);
    setHasMoreData(true);
    if (
      indexname &&
      indexname?.length > 0 &&
      indexname != null &&
      indexname != undefined
    )
      getAllSandbox(indexname, pageNum);
  }, [DraftPositions, deleteState]);

  useEffect(() => {
    setList([]);
    setPageNum(1);
    setHasMoreData(true);
    setCallEnd(true);
    if (
      indexname &&
      indexname?.length > 0 &&
      indexname != null &&
      indexname != undefined
    )
      getAllSandbox(indexname, pageNum);
  }, [indexname]);

  useEffect(() => {
    if (DraftName != null) {
      setPageNum(1);
      setHasMoreData(true);
      if (
        indexname &&
        indexname?.length > 0 &&
        indexname != null &&
        indexname != undefined
      )
        getAllSandbox(indexname, pageNum);
    }
  }, [DraftName]);

  // Check if container needs to be filled after data loads
  useEffect(() => {
    if (List?.length > 0 && !isLoading) {
      // Use setTimeout to allow DOM to update before checking container
      setTimeout(checkContainerFill, 0);
    }
  }, [List, isLoading]);

  const handleDeleteStrategy = (sandboxId: any) => {
    const DraftPositions = new StrategiesSandboxRouterApi(baseConfig());
    DraftPositions.deleteSandboxV1UsersMeSandboxesIdDelete(sandboxId)
      .then(() => {
        setList((prevList) => prevList.filter((item) => item.id !== sandboxId));
        setDeleteState(!deleteState);
        toast("Strategy Deleted", {
          icon: false, // Removes the default icon (tick mark)
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
  };

  const calculateTotalPnlForAll = (strategies: any[]) => {
    const totalPnlMap: { [key: string]: number } = {};
    strategies.forEach((strategy) => {
      const totalPnL = calculateTotalPnL(strategy.data); // Pass strategy's data to calculate PNL
      totalPnlMap[strategy.id] = totalPnL; // Store total PNL for the strategy
    });
    setTotalPnlMap(totalPnlMap);
  };

  const calculateTotalPnL = (strategyData: any) => {
    let totalPnL = 0;
    Object.values(strategyData).forEach((item: any) => {
      const ltp =
        LiveLtpData[item?.identifier] != null &&
        LiveLtpData[item?.identifier] != undefined &&
        strategyData[item.identifier]?.is_exited != true
          ? LiveLtpData[item?.identifier]
          : item?.ltp?.toFixed(2);
      const pnl =
        CalculatePnl(ltp, item.avg_price, item.transaction_type) *
        item.lots *
        item.lot_size;

      totalPnL += pnl;
    });
    return totalPnL;
  };

  useEffect(() => {
    calculateTotalPnlForAll(List);
  }, [List, LiveLtpData]);

  const calculateItemPnl = (item: any) => {
    const ltp =
      LiveLtpData[item?.identifier] &&
      LiveLtpData[item?.identifier] != null &&
      LiveLtpData[item?.identifier] != undefined &&
      selectedStrategy?.data[item?.identifier]?.is_exited != true
        ? LiveLtpData[item?.identifier]
        : item?.ltp?.toFixed(2);
    return (
      CalculatePnl(ltp, item.avg_price, item.transaction_type) *
      item.lots *
      item.lot_size
    );
  };

  const calculatePnlForStrategyData = (strategyData: any) => {
    const pnlMap: { [key: string]: number } = {};
    Object.entries(strategyData).forEach(([identifier, item]: any) => {
      pnlMap[identifier] = calculateItemPnl(item);
    });
    setPnlMap(pnlMap);
  };

  useEffect(() => {
    if (selectedStrategy?.data) {
      calculatePnlForStrategyData(selectedStrategy.data);
    }
  }, [selectedStrategy, LiveLtpData]);

  const toggleRowExpansion = (strategyId: string) => {
    setExpandedRow((prev) => (prev === strategyId ? null : strategyId));
    const strategy = List.find((item) => item.id === strategyId);
    dispatch(setExpandSelectedSandbox(false));
    if (strategy) {
      dispatch(setSelectedStrategy({ setselectedStrategy: strategy }));
      dispatch(
        setShowSelectedSandboxName({
          setSelectedSandboxName: strategy.name,
          setSelectedSandboxId: strategy.id,
        }),
      );
    }
  };
  useEffect(() => {
    if (selectedStrategy) {
      // Update the corresponding strategy in the List with the new details
      setList((prevList) =>
        prevList.map((strategy) =>
          strategy.id === selectedStrategy.id
            ? { ...strategy, ...selectedStrategy } // Merge updated data
            : strategy,
        ),
      );
    }
  }, [selectedStrategy]);

  useEffect(() => {
    setExpandedRow(null);
  }, [DraftPositions]);

  const checkIfAtEnd = () => {
    const container: any = sandBoxRef.current;

    if (container) {
      if (
        Math.ceil(container?.scrollHeight) - Math.ceil(container?.scrollTop) <=
          Math.floor(container?.clientHeight) &&
        ApiResponse?.length % 10 === 0 &&
        callEnd &&
        hasMoreData
      ) {
        setPageNum((prevPage) => {
          const nextPage = prevPage + 1;
          getAllSandbox(indexname, nextPage);
          return nextPage;
        });
        setIsEnd(true);
      }
    } else {
      setIsEnd(false);
    }
  };

  useEffect(() => {
    const container: any = sandBoxRef.current;

    if (container) {
      container.addEventListener("scroll", checkIfAtEnd);
    }
    return () => {
      const container: any = sandBoxRef.current;
      if (container) {
        container.removeEventListener("scroll", checkIfAtEnd);
      }
    };
  }, [ApiResponse, isLoading, hasMoreData]);

  const handleExitStrategy = (strategyId: number) => {
    const strategy = List.find((item) => item.id === strategyId);
    const strategyData = strategy.data;
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
      const liveltp = LiveLtpData[key];
      updatedData[key] = {
        ...updatedData[key],
        is_exited: true, // Mark each row as exited
        ltp:
          liveltp != undefined && liveltp != null
            ? liveltp
            : updatedData[key]?.ltp,
      };
    });
    const DraftPositions = new StrategiesSandboxRouterApi(baseConfig());
    const payload = {
      name: strategy.name,
      data: updatedData,
      is_all_exited: true, // Set is_all_exited to true to indicate all have been exited
    };
    // Call the API to modify the sandbox data
    DraftPositions.modifySandboxV1UsersMeSandboxesModifyIdPut(
      strategy.id,
      payload,
    )
      .then((res) => {
        toast("Strategy Exited", {
          icon: false, // Removes the default icon (tick mark)
        });
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
  useEffect(() => {
    if (selectedStrategy != null && ExpandSelectedId == true) {
      toggleRowExpansion(selectedStrategy?.id);
    }
  }, [ExpandSelectedId, selectedStrategy]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-start gap-4">
      {List && List.length > 0 ? (
        <div
          className={`h-[90%] w-full overflow-y-scroll  max-xl:scrollbar-none max-sm:max-h-[11rem] sm:max-xl:max-h-[23rem] xl:scrollbar-none`}
          ref={sandBoxRef}
        >
          <ul className="list-none divide-y divide-gray-300 text-[0.75rem] font-medium capitalize ">
            {List &&
              List.sort((a: any, b: any) => {
                return (
                  new Date(b.updated_at).getTime() -
                  new Date(a.updated_at).getTime()
                );
              }).map((strategy: any) => {
                const isExpanded = expandedRow === strategy.id;

                return (
                  <li
                    key={strategy.id}
                    className={`max-sm:py-2 sm:p-2 ${
                      isExpanded ? "" : "hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className="flex w-full cursor-pointer items-center justify-between"
                      onClick={() => {
                        if (window.innerWidth >= 576) {
                          toggleRowExpansion(strategy.id);
                          if (!(isExpanded && selectedStrategy)) {
                            setToggleOpt(false);
                          }
                        }
                      }}
                    >
                      <div
                        className="flex flex-row items-center gap-4 "
                        onClick={() => {
                          if (window.innerWidth < 576) {
                            toggleRowExpansion(strategy.id);
                            if (!(isExpanded && selectedStrategy)) {
                              setToggleOpt(false);
                            }
                          }
                        }}
                        onDoubleClick={(event: any) => {
                          event.stopPropagation();
                        }}
                      >
                        <img
                          src="/svg/expand-icon.svg"
                          alt="Expand"
                          width={10}
                          height={10}
                          className={`transform transition-transform md:max-xl:h-[0.8rem] md:max-xl:w-[0.8rem] ${
                            isExpanded && selectedStrategy
                              ? "rotate-180"
                              : "rotate-90"
                          }`}
                        />
                        <span className="max-sm:w-[8rem]">{strategy.name}</span>
                      </div>
                      <div className="flex w-[10rem] flex-row items-center gap-4 ">
                        <span
                          className={`w-[4rem] text-left text-[0.8rem] font-medium ${
                            (strategy.is_all_exited
                              ? strategy.total_pnl
                              : totalPnlMap[strategy.id] !== undefined
                                ? totalPnlMap[strategy.id]
                                : strategy.total_pnl) > 0
                              ? " text-z-green-500"
                              : (strategy.is_all_exited
                                    ? strategy.total_pnl
                                    : totalPnlMap[strategy.id] !== undefined
                                      ? totalPnlMap[strategy.id]
                                      : strategy.total_pnl) < 0
                                ? "text-red-500"
                                : " pl-[0.4rem] text-gray-500"
                          }`}
                        >
                          {" "}
                          {strategy.is_all_exited && totalPnlMap[strategy.id]
                            ? strategy.total_pnl > 0
                              ? `+${formatNumber(strategy.total_pnl.toFixed(2))}` // Add "+" for positive pnl
                              : formatNumber(strategy.total_pnl.toFixed(2))
                            : totalPnlMap[strategy.id]
                              ? totalPnlMap[strategy.id] > 0
                                ? `+${formatNumber(totalPnlMap[strategy.id].toFixed(2))}` // Add "+" for positive pnl
                                : formatNumber(
                                    totalPnlMap[strategy.id].toFixed(2),
                                  )
                              : strategy.total_pnl > 0
                                ? `+${formatNumber(strategy.total_pnl.toFixed(2))}` // Add "+" for positive pnl
                                : formatNumber(strategy.total_pnl.toFixed(2))}
                        </span>

                        <div className="group relative inline-block flex w-[2rem] cursor-pointer items-center justify-center ">
                          {strategy.is_all_exited && (
                            <span className="rounded border bg-gray-100 px-1 text-[0.68rem] text-gray-400">
                              Exited
                            </span>
                          )}
                          {!strategy.is_all_exited && (
                            <>
                              <img
                                src="/svg/exitAll.svg"
                                width="15"
                                height="15"
                                alt="ExitAll"
                                className=" md:max-xl:h-[1.1rem] md:max-xl:w-[1.1rem]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleExitStrategy(strategy.id);
                                }}
                                onDoubleClick={(event: any) => {
                                  event.stopPropagation();
                                }}
                              />
                              <span className="pointer-events-none absolute left-full top-7 z-[1001] ml-1 w-[5rem] -translate-x-full -translate-y-1/2 transform rounded  bg-gray-800  px-1   text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden">
                                Exit Strategy
                              </span>
                            </>
                          )}
                        </div>

                        <div className="group relative inline-block cursor-pointer ">
                          <img
                            src="/svg/deleteNotes.svg"
                            height={15}
                            width={15}
                            alt="Delete"
                            className=" md:max-xl:h-[1.1rem] md:max-xl:w-[1.1rem]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStrategy(strategy.id);
                            }}
                            onDoubleClick={(event: any) => {
                              event.stopPropagation();
                            }}
                          />
                          <span className="pointer-events-none absolute left-full top-7 z-[1001] ml-1 w-[3rem] -translate-x-full -translate-y-1/2 transform rounded  bg-gray-800  px-1   text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden">
                            Delete
                          </span>
                        </div>
                      </div>
                    </div>
                    {isExpanded && selectedStrategy?.data && (
                      <div className="pt-2 2xl:pl-4">
                        <StrategyDetailsTable
                          strategyData={selectedStrategy.data}
                          pnlMap={pnlMap}
                          strategyName={selectedStrategy.name}
                          strategyExited={selectedStrategy.is_all_exited}
                          onMinExpiryDateChange={onMinExpiryDateChange}
                        />
                      </div>
                    )}
                  </li>
                );
              })}
            {List && List.length > 0 && isEnd ? (
              <div className="flex h-10 w-full items-center justify-center  ">
                <PaginationLoading />
              </div>
            ) : (
              ""
            )}
          </ul>
        </div>
      ) : (
        <TabEmptyInfo name={`No ${indexname} Sandbox Available`} />
      )}
    </div>
  );
};

export default DraftPositionsTable;
