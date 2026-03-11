"use client";
import BackTestingDatePicker from "@/components/shared/filter/backTestingDatePicker";
import { useContext, useEffect, useState } from "react";
import BoxDisplayItem from "./box";
import { AuthContext } from "@/context/authContextProvider";
import zApi from "@/lib/api/zApi";
import { useRouter } from "next/navigation";
import { BackTestingInput } from "@/lib/types";
import BackTestingSkeleton from "./backtestingSkeleton";
import { OptionsBacktestingHistoricalApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import TransaparentLoadingComponent from "@/components/shared/loading/transparentLoading";

const BackTesting = (props: {
  name: string | undefined;
  id: number | null;
}) => {
  const [data, setData] = useState<any>();
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const myApiClient = new zApi(useRouter(), useContext(AuthContext));
  const backTestingApi = new OptionsBacktestingHistoricalApi(baseConfig());

  const getCustomBackTestingData = (id: number, input: BackTestingInput) => {
    setLoading(true);

    const selectDays: number[] = [];
    if (input.selectedDays) selectDays.push(input.selectedDays);

    const params = [
      id,
      input.indexName,
      input.startDate,
      input.endDate,
      input.entryTime,
      input.exitTime,
      input.target,
      input.stopLoss,
      input.trailingStopLoss,
      selectDays,
    ] as const;
    myApiClient.request(
      () =>
        backTestingApi.backtestingByStrategyIdV1BacktestingByIdStrategyIdPost(
          ...params
        ),
      (res) => {
        setData(res.data);
        setLoading(false);
        setShowSkeleton(false);
      },
      (err) => {}
    );
  };

  const getReadyMadeBackTestingData = (
    strategyName: string,
    input: BackTestingInput
  ) => {
    setLoading(true);

    const selectDays: number[] = [];
    if (input.selectedDays) selectDays.push(input.selectedDays);

    if (input.exitTime.split(":")[1] == "0") {
      input.exitTime = input.exitTime.split(":")[0] + ":00";
    }
    if (input.entryTime.split(":")[1] == "0") {
      input.entryTime = input.entryTime.split(":")[0] + ":00";
    }
    if (input.entryTime.split(":")[0] == "9") {
      input.entryTime = "09:" + input.entryTime.split(":")[1];
    }
    if (input.exitTime.split(":")[0] == "9") {
      input.exitTime = "09:" + input.exitTime.split(":")[1];
    }
    if (
      input.entryTime.split(":")[0] == "09" &&
      input.entryTime.split(":")[1] < "15"
    ) {
      input.entryTime = "09:15";
    }
    if (
      input.exitTime.split(":")[0] == "09" &&
      input.exitTime.split(":")[1] < "15"
    ) {
      input.exitTime = "09:20";
    }

    const params = [
      strategyName,
      input.indexName,
      input.startDate,
      input.endDate,
      input.entryTime,
      input.exitTime,
      input.target,
      input.stopLoss,
      input.trailingStopLoss,
      selectDays,
    ] as const;

    backTestingApi
      .backtestingByStrategyNameV1BacktestingByNameStrategyNamePost(...params)
      .then((res) => {
        setData(res.data);
        setLoading(false);
        setShowSkeleton(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          window.location.href = "/logout";
        }
      });
  };

  const startBackTesting = (input: BackTestingInput) => {
    if (props.id) {
      getCustomBackTestingData(props.id, input);
    } else if (props.name) {
      getReadyMadeBackTestingData(props.name, input);
    }
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex flex-col gap-4">
        <div className="mt-2 flex w-full flex-row items-center bg-z-green-200 p-4">
          <BackTestingDatePicker submit={startBackTesting} />
        </div>
        {loading && <TransaparentLoadingComponent />}
        {showSkeleton && <BackTestingSkeleton />}
        {!showSkeleton && (
          <div className="flex  flex-col-reverse xl:flex-row  gap-4  pb-5 ">
            <div className="flex xl:w-1/2 w-full max-sm:items-center  sm:items-center md:items-center sm:justify-center  flex-col gap-4 ">
              <div className="flex flex-row  gap-4  md:gap-[2rem] xl:gap-4 text-center sm:pt-5  xl:pt-0 ">
                <BoxDisplayItem
                  label="Total Expiries"
                  value={data.total_expiries}
                />
                <BoxDisplayItem
                  label="Total Trading Days"
                  value={data.total_trading_days}
                />
              </div>
              <div className="flex flex-row  gap-4 md:gap-[2rem]  xl:gap-4 text-center">
                <BoxDisplayItem label="Profit Days" value={data.profit_days} />
                <BoxDisplayItem label="Loss Days" value={data.loss_days} />
              </div>
              <div className="flex flex-row  gap-4 md:gap-[2rem]  xl:gap-4 text-center">
                <BoxDisplayItem label="Max Profit" value={data.max_profit} />
                <BoxDisplayItem label="Max Loss" value={data.max_loss} />
              </div>
              <div className="flex flex-row gap-4 md:gap-[2rem]  xl:gap-4 text-center">
                <BoxDisplayItem
                  label="Max Profit Days"
                  value={data.max_profit_days}
                />
                <BoxDisplayItem
                  label="Max Loss Days"
                  value={data.max_loss_days}
                />
              </div>
              <div className="flex flex-row gap-4 md:gap-[2rem]  xl:gap-4 text-center">
                <BoxDisplayItem
                  label="Average Winning Trade"
                  value={data.average_winning_trade}
                />
                <BoxDisplayItem
                  label="Average Losing Trade"
                  value={data.average_losing_trade}
                />
              </div>
              <div className="flex flex-row gap-4 md:gap-[2rem]  xl:gap-4 text-center">
                <BoxDisplayItem
                  label="Continous Profit Days"
                  value={data.continuous_profit_days}
                />

                <BoxDisplayItem
                  label="Continuous Loss Days"
                  value={data.continuous_loss_days}
                />
              </div>
            </div>
            
            <div className="flex xl:w-2/3 w-full sm:justify-center xl:justify-start flex-col gap-4 ">
              <div className="flex flex-row sm:justify-center xl:justify-start gap-4">
                <div className="flex xl:h-28 xl:w-1/3 max-sm:w-[20rem] sm:w-[10rem] md:w-[14rem] max-sm:h-[6rem] sm:h-[6rem] flex-col max-sm:gap-1 sm:gap-1 md:gap-2 xl:gap-4 rounded-2xl bg-z-green-300 xl:p-5 max-sm:justify-center sm:justify-center text-center">
                  <div className="max-sm:text-[0.7rem] sm:text-[0.8rem]  md:text-[0.9rem] xl:text-[0.75rem]  2xl:text-sm font-semibold leading-tight text-zinc-900">
                    Total Profit
                  </div>
                  <div
                    className={`max-sm:text-[0.62rem] sm:text-[0.8rem]  md:text-[0.9rem] xl:text-[0.75rem] 2xl:text-xl font-semibold leading-9
                    ${
                      data.total_profit_and_loss >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  `}
                  >
                    {data.total_profit_and_loss}
                  </div>
                </div>
                <div className="flex xl:h-28 xl:w-1/3 max-sm:w-[20rem] sm:w-[10rem] md:w-[14rem] max-sm:h-[6rem] sm:h-[6rem] flex-col max-sm:gap-1 sm:gap-1 md:gap-2 xl:gap-4 xl:gap-4 rounded-2xl bg-z-green-300 xl:p-5 max-sm:justify-center sm:justify-center text-center">
                  <div className="max-sm:text-[0.7rem] sm:text-[0.8rem]  md:text-[0.9rem] xl:text-[0.75rem] 2xl:text-sm font-semibold leading-tight text-zinc-900">
                    R:RR
                  </div>
                  <div className="max-sm:text-[0.62rem] sm:text-[0.8rem]  md:text-[0.9rem] xl:text-[0.75rem] 2xl:text-xl font-semibold leading-9">
                    {data.risk_reward_ratio}
                  </div>
                </div>
                <div className="flex xl:h-28 xl:w-1/3 max-sm:w-[20rem] sm:w-[10rem] md:w-[14rem] max-sm:h-[6rem] sm:h-[6rem] flex-col max-sm:gap-1 sm:gap-1 md:gap-2 xl:gap-4 xl:gap-4 rounded-2xl bg-z-green-300 xl:p-5 max-sm:justify-center sm:justify-center text-center">
                  <div className="max-sm:text-[0.7rem] sm:text-[0.8rem]  md:text-[0.9rem] xl:text-[0.75rem]  2xl:text-sm  font-semibold leading-tight text-zinc-900">
                    Expectancy
                  </div>
                  <div
                    className={`max-sm:text-[0.62rem] sm:text-[0.8rem]  md:text-[0.9rem] xl:text-[0.75rem] 2xl:text-xl font-semibold leading-9
                    ${data.expectancy >= 0 ? "text-green-500" : "text-red-500"}
                  `}
                  >
                    {data.expectancy}
                  </div>
                </div>
              </div>
             
           
              <div className="xl:flex max-h-[calc(100vh-30rem)]  flex-col gap-4 overflow-y-auto max-sm:hidden sm:hidden ">
                <table className="h-1/4 border-2 border-z-blue-100 text-center max-sm:text-[0.62rem] sm:text-[0.8rem]  md:text-[0.9rem] xl:text-[0.75rem] 2xl:text-sm text-gray-500 ">
                  <thead className="bg-gray-50 max-sm:text-[0.62rem] sm:text-[0.8rem]  md:text-[0.9rem] xl:text-[0.75rem] 2xl:text-xs uppercase text-gray-700 ">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Month-Year
                      </th>
                      <th scope="col" className="px-6 py-3">
                        P&L
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(data.month_wise_data).map(
                      ([key, value]: [string, any]) => {
                        return (
                          <tr key={key} className="h-4/5 w-1/2">
                            <td className="whitespace-nowrap px-6 py-4 text-black">
                              {key}
                            </td>
                            <td
                              className={`whitespace-nowrap px-6 py-4 font-bold 
              ${
                value >= 0
                  ? "bg-lime-50 text-green-500"
                  : "bg-red-100 text-red-500"
              }
            `}
                            >
                              {value}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>

           
            </div>

{/* ----------------------------------------------------------------------------------------------- */}

          


          </div>



        )}
      </div>
    </div>
  );
};

export default BackTesting;
