"use client";
import AppLayout from "@/components/layout/AppLayout";
import Builder from "@/components/shared/strategyBuilder/builder";
import { OptionsBacktestingHistoricalApi, Strategy } from "@/lib/api/base";
import { BackTestingInput, StrategyBuilderData } from "@/lib/types";
import { BodyGetBacktestingResultsV1BacktestingGlobalBacktestingPost } from "@/lib/api/base/";
import {
  consolidateStrategyBuilderData,
  defaultStrategyBuilderData,
  getCreateStrategyData,
} from "@/lib/util/createStrategyUtil";
import { use, useEffect, useState } from "react";
import BackTestingSkeleton from "../strategy-builder/backtesting/backtestingSkeleton";
import { baseConfig } from "@/lib/api/baseConfiguration";
import BackTestingContent from "./content";
import TransaparentLoadingComponent from "@/components/shared/loading/transparentLoading";
import DatePicker from "./datePicker";
import ImportStrategyModal from "./importStrategyModal";
import config from "@/lib/config";
import AlertToast from "@/components/shared/alertToast";

const BackTesting = () => {
  const backTestingApi = new OptionsBacktestingHistoricalApi(baseConfig());
  const [data, setData] = useState<StrategyBuilderData[]>([
    defaultStrategyBuilderData,
  ]);

  const [backTestingData, setBackTestingData] = useState<any>();
  const [backTestingInput, setBackTestingInput] = useState<BackTestingInput>(
    {} as BackTestingInput
  );

  const [state, setState] = useState({
    showSkeleton: true,
    loading: false,
    builderStateChanged: true,
    showImportStrategyModal: false,
    showGlobalAlert: false,
  });

  const strategyResult = consolidateStrategyBuilderData(data);

  const [backtestingBody, setBacktestingBody] =
    useState<BodyGetBacktestingResultsV1BacktestingGlobalBacktestingPost>({
      strategy_result: strategyResult,
      select_days: backTestingInput.selectedDays
        ? [backTestingInput.selectedDays]
        : [],
    });

  // update backtesting body when datepicker updates selected days
  useEffect(() => {
    setBacktestingBody({
      ...backtestingBody,
      select_days: backTestingInput.selectedDays
        ? [backTestingInput.selectedDays]
        : [],
    });
  }, [backTestingInput.selectedDays]);

  const handleGlobalError = (error: any) => {
    if (error.response.status === 401) {
      window.location.href = "/logout";
    } else {
      setState({ ...state, loading: false, showGlobalAlert: true });
    }
  };

  const startBackTesting = () => {
    setState({ ...state, loading: true, builderStateChanged: false });

    if (backTestingInput.exitTime.split(":")[1] == "0") {
      backTestingInput.exitTime =
        backTestingInput.exitTime.split(":")[0] + ":00";
    }
    if (backTestingInput.entryTime.split(":")[1] == "0") {
      backTestingInput.entryTime =
        backTestingInput.entryTime.split(":")[0] + ":00";
    }
    if (backTestingInput.entryTime.split(":")[0] == "9") {
      backTestingInput.entryTime =
        "09:" + backTestingInput.entryTime.split(":")[1];
    }
    if (
      backTestingInput.entryTime.split(":")[0] == "09" &&
      backTestingInput.entryTime.split(":")[1] < "15"
    ) {
      backTestingInput.entryTime = "09:15";
    }
    if (
      backTestingInput.exitTime.split(":")[0] == "09" &&
      backTestingInput.exitTime.split(":")[1] < "15"
    ) {
      backTestingInput.exitTime = "09:20";
    }

    const params = [
      backTestingInput.indexName,
      backTestingInput.startDate,
      backTestingInput.endDate,
      backTestingInput.entryTime,
      backTestingInput.exitTime,
      backTestingInput.target,
      backTestingInput.stopLoss,
      backTestingInput.trailingStopLoss,
      {
        strategy_result: consolidateStrategyBuilderData(data),
        select_days: backTestingInput.selectedDays
          ? [backTestingInput.selectedDays]
          : [],
      },
    ] as const;

    backTestingApi
      .getBacktestingResultsV1BacktestingGlobalBacktestingPost(...params)
      .then((res) => {
        setBackTestingData(res.data);
        setState({
          ...state,
          loading: false,
          showSkeleton: false,
        });
      })
      .catch((err) => {
        console.log(err);
        handleGlobalError(err);
      });
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-8rem)] w-full flex-row gap-2">
        <div className="flex  w-full flex-col gap-4">
          <div className="flex flex-row justify-center gap-4">
            <div className="flex w-full flex-row items-center bg-z-green-200 p-4">
              <DatePicker
                updateData={(input: BackTestingInput) =>
                  setBackTestingInput(input)
                }
                journeyStarted={!state.showSkeleton}
                resetState={() => {
                  setBackTestingData({});
                  setData([defaultStrategyBuilderData]);
                  setState({
                    ...state,
                    showSkeleton: true,
                    builderStateChanged: true,
                  });
                }}
                showImportStrategyModal={() => {
                  setState({ ...state, showImportStrategyModal: true });
                }}
              />
            </div>
          </div>
          <div className="flex max-h-[calc(100vh-16rem)] flex-row gap-4">
            <div className="flex  w-2/6 flex-col gap-4 border-2 border-z-blue-100 p-6">
              <p className="font-bold uppercase">Add legs</p>
              <div className="max-h-[calc(100vh-20rem)] overflow-y-auto">
                <Builder
                  data={data}
                  newStrategy={true}
                  updateData={(data: StrategyBuilderData[]) => {
                    setData(data);
                    setState({ ...state, builderStateChanged: true });
                  }}
                />
              </div>
              {state.builderStateChanged && (
                <button
                  type="submit"
                  className="w-half flex h-10 max-h-[calc(100vh-18rem)] items-center justify-center rounded-3xl bg-z-green-500 text-base font-medium leading-none text-white"
                  onClick={startBackTesting}
                >
                  {state.showSkeleton
                    ? "Start BackTesting"
                    : "Restart BackTesting"}
                </button>
              )}
            </div>
            <div className="flex w-4/6 flex-col border-2 border-z-blue-100 p-2 overflow-y-auto">
              {state.loading && <TransaparentLoadingComponent />}
              {state.showSkeleton && <BackTestingSkeleton />}
              {!state.showSkeleton && (
                <BackTestingContent data={backTestingData} />
              )}
              {state.showImportStrategyModal && (
                <ImportStrategyModal
                  hideModal={() => {
                    setState({ ...state, showImportStrategyModal: false });
                  }}
                  importBluePrint={(
                    strategy_data: any,
                    strategyName: string
                  ) => {
                    console.log(strategy_data);
                    setState({
                      ...state,
                      showImportStrategyModal: false,
                    });
                    const tempData = getCreateStrategyData(strategy_data);
                    setData(tempData);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {state.showGlobalAlert && (
        <AlertToast
          errorMessage="Sorry! Something wentWrong, please try Again"
          toggleComponent={() => {
            setState({ ...state, showGlobalAlert: false });
          }}
        />
      )}
    </AppLayout>
  );
};

export default BackTesting;
