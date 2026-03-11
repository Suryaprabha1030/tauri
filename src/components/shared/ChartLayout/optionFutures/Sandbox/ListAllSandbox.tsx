import PaginationLoading from "@/components/shared/commonUtil/PaginationLoading";
import { StrategiesSandboxRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  getFutTargetltpData,
  getFutureData,
  getOptionData,
  getOptTargetltpData,
  optionChainPayload,
  setDataUpdated,
  setExpandSelectedSandbox,
  setSelectedStrategy,
  setShowSelectedSandboxName,
  showAllSandboxNames,
  showDraftNamePopUp,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";
import { RootState } from "@/lib/redux/Store";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { modifiedconstructRequestBody } from "@/lib/util/DraftUtil";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
interface ListAllSandboxNamesProps {
  draftData: any;
}

const ListAllSandboxNames: React.FC<ListAllSandboxNamesProps> = ({
  draftData,
}) => {
  const dispatch = useDispatch();
  const [List, setList] = useState<any[]>([]);
  const [ApiResponse, setApiResponse] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pageNum, setPageNum] = useState(1);
  const sandBoxRef = useRef(null);
  const [isEnd, setIsEnd] = useState(false);
  const [callEnd, setCallEnd] = useState(true);
  const indexname = useSelector((state: RootState) => state.strategy.indexName);

  const sandboxId = useSelector(
    (state: RootState) => state.analyzer.setSelectedSandboxId
  );
  const SelectedsandboxName = useSelector(
    (state: RootState) => state.analyzer.setSelectedSandboxName
  );
  const updatedData = useSelector(
    (state: RootState) => state.analyzer.setUpdateData
  );
  const optionDatas = useSelector(
    (state: RootState) => state.analyzer.optionDataList
  );
  const futureDatas = useSelector(
    (state: RootState) => state.analyzer.futureDataList
  );
  const positionDatas = useSelector(
    (state: RootState) => state.analyzer.PositionDataList
  );
  const router = useRouter();
  const handleSelectionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedId(event.target.value);
    setTimeout(() => {
      dispatch(showAllSandboxNames(false));
      dispatch(showStrategyTable(false));
      dispatch(showPositionTable(false));
      dispatch(showPnlTable(false));
      dispatch(showDraftPositions(true));
      dispatch(setExpandSelectedSandbox(true));
    }, 300);
    dispatch(setSelectedStrategy({ setselectedStrategy: selectedId }));
  };
  const removeSymbol = () => {
    dispatch(showAllSandboxNames(false));
  };

  const handleNew = () => {
    dispatch(showAllSandboxNames(false));
    dispatch(showDraftNamePopUp(true));
  };
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
          dispatch(getOptionData({ optionData: {} }));
          dispatch(getFutureData({ futureData: {} }));
          dispatch(getOptTargetltpData({ OptTargetLtpData: {} }));
          dispatch(getFutTargetltpData({ FutTargetLtpData: {} }));
          dispatch(
            optionChainPayload({
              optionChainPayloadData: { ClickedRow: {}, response: {} },
            })
          );
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
          })
        );
      }, 100);
    }
  };

  const getAllSandbox = (indexname: string, pageNum: number) => {
    const DraftPositions = new StrategiesSandboxRouterApi(baseConfig());
    DraftPositions.getAllSandboxesByIndexnameV1UsersMeSandboxesByIndexNameIndexNameGet(
      indexname,
      pageNum
    )
      .then((res) => {
        const names = res.data;

        setApiResponse(res.data); //to get the length
        // setList((prevNames) => [...prevNames, ...names]);
        const allStrategies = res.data;
        if (res.status == 204) {
          setCallEnd(false);
          setIsEnd(false);
        }
        // Filter non-exited strategies
        const nonExitedStrategies = allStrategies.filter(
          (item: any) => !item.is_all_exited
        );
        // Add unique non-exited strategies to the list
        setList((prevList) => {
          const existingIds = new Set(prevList.map((item) => item.id));
          const uniqueStrategies = nonExitedStrategies.filter(
            (item: any) => !existingIds.has(item.id)
          );
          return [...prevList, ...uniqueStrategies];
        });

        // If we still have space for more items, increase page number
        const displayedNonExitedCount =
          List.length + nonExitedStrategies.length;
        if (displayedNonExitedCount < 10) {
          setPageNum((prevPage) => prevPage + 1);
        }
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

  useEffect(() => {
    getAllSandbox(indexname, pageNum);
  }, [pageNum]);

  useEffect(() => {
    const DraftPositions = new StrategiesSandboxRouterApi(baseConfig());

    if (selectedId != null && Object.entries(draftData).length != 0) {
      const payload = modifiedconstructRequestBody(
        draftData,
        SelectedsandboxName,
        false,
        indexname
      );
      DraftPositions.modifySandboxV1UsersMeSandboxesModifyIdPut(
        sandboxId,
        payload
      )
        .then((res: any) => {
          dispatch(setSelectedStrategy({ setselectedStrategy: res?.data }));
          dispatch(setDataUpdated(!updatedData));
          clearStreategyTable();
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
  }, [selectedId, draftData]);

  useEffect(() => {
    const DraftPositions = new StrategiesSandboxRouterApi(baseConfig());
    DraftPositions.getSandboxByIdV1UsersMeSandboxesIdGet(sandboxId)
      .then((res: any) => {
        dispatch(setSelectedStrategy({ setselectedStrategy: res?.data }));
      })
      .catch((err: any) => {
        if (err?.response && err?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (err?.response && err?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  }, [updatedData]);

  const checkIfAtEnd = () => {
    const container: any = sandBoxRef.current;

    if (container) {
      if (
        container?.scrollHeight - container.scrollTop <=
          container?.clientHeight &&
        ApiResponse?.length % 10 === 0 &&
        callEnd
      ) {
        setPageNum((prevPage) => prevPage + 1);

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
  }, [ApiResponse]);

  useEffect(() => {
    if (isEnd) {
      getAllSandbox(indexname, pageNum);
    }
  }, [isEnd]);

  const sortedList = List.filter((item) => !item.is_all_exited);
  return (
    <div className="shadow-t-2xl relative h-[17rem] overflow-y-auto rounded-lg bg-white shadow-2xl max-sm:w-[18rem] sm:max-md:h-[19rem] sm:max-md:w-[22rem] md:w-[25rem]">
      <div className="bg-shadow flex h-[3rem] w-full flex-row items-center  justify-between border-b-[0.05rem] border-z-br-gray p-2 px-4">
        <h1 className="font-semibold max-md:text-[1rem] md:text-[1.2rem]">
          Strategy Sandbox
        </h1>
        <div className="flex flex-row items-center gap-5">
          <button
            id="Create New"
            className=" flex w-[3rem] items-center  justify-center rounded-3xl border border-z-green-500 font-medium leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white max-md:text-sm md:px-2 md:text-base"
            onClick={handleNew}
          >
            New
          </button>
          <Image
            src="/svg/removeSymbol.svg"
            className="relative h-[1.5rem] w-[1.5rem]"
            width="20"
            height="20"
            alt="plus"
            onClick={removeSymbol}
          />
        </div>
      </div>
      <div className="h-[13rem] p-2 ">
        <div
          className="h-[13rem] overflow-y-auto overflow-x-hidden scrollbar-thin"
          ref={sandBoxRef}
        >
          {sortedList && sortedList.length > 0 ? (
            sortedList.map((item, index) => (
              <div key={index}>
                <label className=" flex flex-row items-center gap-2 p-2">
                  {/* If is_all_exited is true, show 'Exited' instead of the radio button */}
                  {item.is_all_exited ? (
                    <span className="mx-2 flex flex flex-row items-center gap-2 text-[1rem] capitalize  text-gray-500 ">
                      {item.name}
                      <span className="rounded border bg-blue-100 px-1 text-[0.68rem] text-gray-500">
                        Exited
                      </span>
                    </span>
                  ) : (
                    <>
                      <input
                        type="radio"
                        name="name"
                        value={item.id}
                        checked={selectedId == item.id}
                        onChange={(e) => {
                          dispatch(
                            setShowSelectedSandboxName({
                              setSelectedSandboxName: item.name,
                              setSelectedSandboxId: item.id,
                            })
                          );
                          handleSelectionChange(e);
                        }}
                      />
                      <span className="capitalize max-md:text-sm md:text-[1rem]">
                        {item.name}
                      </span>
                    </>
                  )}
                </label>
              </div>
            ))
          ) : (
            <div className="flex h-full w-full items-center justify-center font-medium capitalize text-gray-300">
              Create New Strategy Sandbox
            </div>
          )}

          {sortedList && sortedList.length > 0 && (
            <div className="flex h-10 w-full items-center justify-center">
              {isEnd ? <PaginationLoading /> : ""}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListAllSandboxNames;
