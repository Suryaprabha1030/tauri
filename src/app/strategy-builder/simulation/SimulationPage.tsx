"use client";
import {
  SelectedStrategyData,
  SimulationInput,
  StrategyBuilderInput,
} from "@/lib/types";
import { getChartData } from "@/lib/util/chartUtil";
import Chart from "@/components/shared/chart";
import OptionsLegData from "./optionsLegData";
import TransaparentLoadingComponent from "@/components/shared/loading/transparentLoading";
import { use, useEffect, useState } from "react";

import {
  StrategyPayOffData,
  OptionsStrategyBuilderApi,
  OptionsSimulatorHistoricalApi,
} from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import SimulationDatePicker from "@/components/shared/filter/simulationDatePicker";
import SimulationSkeleton from "./simulationSkeleton";
import CongratsModal from "./congratsModal";
import SorryModal from "./sorryModal";
const Simulation = (props: { name: string | undefined; id: number | null }) => {
  const { name, id } = props;
  console.log(id)
  const [values, setValues] = useState({
    loading: false,
    inputSelected: false,
    showCongratsModal: false,
    showSorryModal: false,
  });
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);

  const [selectedData, setSelectedData] = useState<SelectedStrategyData>({
    strategyData: {} as StrategyPayOffData,
    strategyBluePrint: undefined,
  });

  const getMyStrategy = async (id: number, input: StrategyBuilderInput) => {
    const strategyApi = new OptionsStrategyBuilderApi(baseConfig());
    setValues((prevData) => ({ ...prevData, loading: true }));
    // setShowSkeleton(true);
    const strategyData =
      await strategyApi.getDataForCustomMadeStrategyV1StrategiesByIdStrategyIdExampleGet(
        id,
        input.indexName,
        `${input.date}T${input.time}`,
        input.expiry
      );

    // set data
    setSelectedData((prevData) => ({
      ...prevData,
      strategyData: strategyData.data,
      strategyBluePrint: undefined,
    }));

    // set loading
    setValues((prevData) => ({
      ...prevData,
      loading: false,
    }));
    setShowSkeleton(false);
  };

  const getReadyMade = async (name: string, input: StrategyBuilderInput) => {
    const strategyApi = new OptionsStrategyBuilderApi(baseConfig());
    setValues((prevData) => ({ ...prevData, loading: true }));
    // setShowSkeleton(true);

    await strategyApi
      .getReadyMadeStrategyByNameV1StrategiesByNameStrategyNameGet(name)
      .then(async (strategyBluePrint) => {
        await strategyApi
          .getDataForReadyMadeStrategyV1StrategiesByNameStrategyNameExampleGet(
            name,
            input.indexName,
            `${input.date}T${input.time}`,
            input.expiry
          )
          .then((strategyExampleResponse) => {
            // Set Data
            setSelectedData((prevData) => ({
              ...prevData,
              strategyBluePrint: strategyBluePrint.data,
              strategyData: strategyExampleResponse.data,
            }));

            // set loading
            setValues((prevData) => ({
              ...prevData,
              loading: false,
            }));

            setShowSkeleton(false);
          });
      });
  };

  useEffect(() => {
    setValues((prevData) => ({
      ...prevData,
      inputSelected: false,
      showCongratsModal: false,
      showSorryModal: false,
    }));
    setShowSkeleton(true);
  }, [name, id]);

  const getSimulationPayOffData = async (input: SimulationInput) => {
    setShowSkeleton(false);

    setValues({ ...values, inputSelected: true, loading: true });
    const simulationApi = new OptionsSimulatorHistoricalApi(baseConfig());
    const simulaitonInput = {
      strategy_data: selectedData.strategyData.strategy_data,
      spot_price: selectedData.strategyData.spot_price,
      index_name: input.indexName,
      expiry_date: input.expiry,
      time: selectedData.strategyData.entry_time
        ? selectedData.strategyData.time
        : `${input.date}T${input.time}:00`,
      premiums: selectedData.strategyData.premiums,
      strategy_journey: selectedData.strategyData.strategy_journey,
      profit_and_loss: selectedData.strategyData.profit_and_loss,
      time_travel: input.timeTravel,
      spot_price_entered: selectedData.strategyData.spot_price_entered,
      entry_time: selectedData.strategyData.entry_time
        ? selectedData.strategyData.entry_time
        : `${input.date}T${input.time}:00`,
      expiry_date_end_time: selectedData.strategyData.expiry_date_end_time,
    };

    simulationApi
      .getPayOffV1SimulatorPayoffPost(simulaitonInput)
      .then((res) => {
        setSelectedData((prevData) => ({
          ...prevData,
          strategyData: res.data,
        }));

        // set loading
        setValues((prevData) => ({
          ...prevData,
          loading: false,
        }));
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          window.location.href = "/logout";
        }
      });
  };

  const getExampleData = async (input: SimulationInput) => {
    setValues((prevData) => ({ ...prevData, inputSelected: true }));
    if (id) {
      getMyStrategy(id, input);
    } else if (name) {
      getReadyMade(name, input);
    }
  };

  const showModal = () => {
    if (
      selectedData.strategyData.total_value &&
      selectedData.strategyData.total_value > 0
    ) {
      setValues({ ...values, showCongratsModal: true });
    } else {
      setValues({ ...values, showSorryModal: true });
    }
  };

  return (
    <div className="flex lg:h-full w-full flex-col gap-4 px-2 py-4  ">

      <div className="flex w-full flex-col justify-between gap-8 bg-z-green-200 p-2  ">
        <div className="flex justify-center">
          <SimulationDatePicker
            updateTimeTravel={getSimulationPayOffData}
            initalSubmit={getExampleData}
            currentTime={selectedData.strategyData.time}
            inputSelected={values.inputSelected}
            reset={() => {
              setValues({ ...values, inputSelected: false });
              setShowSkeleton(true);
            }}
          />
        </div>
      </div>

      {values.loading && <TransaparentLoadingComponent />}
      {showSkeleton && <SimulationSkeleton />}
      {!showSkeleton && (
        <div className="flex max-h-screen w-full flex-col gap-4  px-2 py-4   ">
          <div className="flex xl:h-1/2 lg:h-[35rem] w-full xl:flex-row justify-between flex-col xl:gap-8">
         
            <div className="flex max-sm:h-[20rem] sm:h-[20rem] md:h-[22rem] lg:h-[22rem]    xl:h-[19rem] xl:w-1/2 w-full flex-col">
              {name && (
                <h1 className="text-center max-sm:text-[0.8rem] sm:text-[0.8rem] xl:text-xl font-bold">{name}</h1>
              )}
              <Chart
                data={getChartData(selectedData.strategyData.plot_results)}
                spotPrice={selectedData.strategyData.spot_price}
              />
            </div>

            <div className="flex h-full lg:h-1/2 xl:h-full max-sm:w-full sm:w-full xl:w-1/2 flex-col max-sm:jusify-center   ">

              <div className="flex flex-row  max-sm:justify-center sm:justify-center max-sm:items-center sm:items-center xl:justify-end max-sm:gap-4 gap-4 md:gap-10 xl:gap-4  p-4">
                
                <div className="flex sm:h-28 max-sm:h-20 sm:w-48 md:w-50 max-sm:w-40 lg:w-60 xl:w-45 2xl:w-52  flex-col gap-[0.2rem] sm:gap-[0.5rem] xl:gap-4 rounded-2xl bg-z-green-300 p-5 max-sm:justify-center items-center">

                  <div className="max-sm:text-[0.65rem] lg:text-[1rem] xl:text-sm font-semibold leading-tight text-zinc-900 max-sm:pt-2">
                    Total Profit
                  </div>

                  <div
                    className={`max-sm:text-[0.55rem] lg:text-[0.8rem] xl:text-xl font-semibold leading-9
                    ${
                      selectedData.strategyData.total_value >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    }
                  `}
                  >
                    {selectedData.strategyData.total_value}
                  </div>

                </div>


                <div className="flex sm:h-28 max-sm:h-20 sm:w-48 md:w-50   max-sm:w-40   lg:w-60 xl:w-45  2xl:w-52 flex-col max-sm:gap-[0.2rem] sm:gap-[0.5rem]  2xl:gap-4 rounded-2xl bg-z-green-300 p-5 max-sm:justify-center items-center">
                  <div className="max-sm:text-[0.65rem] lg:text-[1rem] xl:text-sm font-semibold leading-tight text-zinc-900 max-sm:pt-2">
                    Breakeven Points
                  </div>
                  <div className="max-sm:text-[0.55rem] lg:text-[0.8rem] xl:text-sm  font-semibold leading-9 text-zinc-900">
                    {selectedData.strategyData.profit_and_loss.breakeven_points
                      .length > 1
                      ? `${selectedData.strategyData.profit_and_loss.breakeven_points[0]}-${selectedData.strategyData.profit_and_loss.breakeven_points[1]}`
                      : selectedData.strategyData.profit_and_loss
                          .breakeven_points[0]}
                  </div>
                </div>

              </div>

              <div className="flex flex-row  max-sm:justify-center sm:justify-center max-sm:items-center sm:items-center xl:justify-end gap-4 md:gap-10 xl:gap-4  p-4">
                <div className="flex sm:h-28 max-sm:h-20 sm:w-48 md:w-50 max-sm:w-40 lg:w-60 xl:w-45 2xl:w-52  flex-col gap-[0.2rem] sm:gap-[0.5rem]    2xl:gap-4 rounded-2xl bg-z-green-300 p-5 max-sm:justify-center items-center">
                  <div className="max-sm:text-[0.65rem] lg:text-[1rem] xl:text-sm font-semibold leading-tight text-zinc-900 max-sm:pt-2">
                    Max Profit
                  </div>
                  <div className="max-sm:text-[0.55rem] lg:text-[0.8rem] xl:text-sm font-semibold leading-9 text-zinc-900">
                    {selectedData.strategyData.profit_and_loss.max_profit}
                  </div>
                </div>
                <div className="flex sm:h-28 max-sm:h-20 sm:w-48 md:w-50 max-sm:w-40 lg:w-60 xl:w-45 2xl:w-52  flex-col gap-[0.2rem] sm:gap-[0.5rem]    2xl:gap-4 rounded-2xl bg-z-green-300 p-5 max-sm:justify-center items-center">
                  <div className="max-sm:text-[0.65rem] lg:text-[1rem] xl:text-sm font-semibold leading-tight text-zinc-900 max-sm:pt-2">
                    Max Loss
                  </div>
                  <div className="max-sm:text-[0.55rem] lg:text-[0.8rem] xl:text-sm font-semibold leading-9 text-zinc-900">
                    {selectedData.strategyData.profit_and_loss.max_loss}
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 mt-2 lg:mt-0   xl:mt-10 ">
            {selectedData.strategyData && (
              <OptionsLegData
                strategyPayOff={selectedData.strategyData}
                showModal={showModal}
                entryTime={selectedData.strategyData.entry_time}
              />
            )}
          </div>

        </div>
      )}
      {!showSkeleton && values.showCongratsModal && (
        <CongratsModal
          totalValue={selectedData.strategyData.total_value}
          hideModal={() => {
            setValues({
              ...values,
              inputSelected: false,
              showCongratsModal: false,
            });
            setShowSkeleton(true);
          }}
        />
      )}
      {!showSkeleton && values.showSorryModal && (
        <SorryModal
          totalValue={selectedData.strategyData.total_value}
          hideModal={() => {
            setValues({
              ...values,
              inputSelected: false,
              showSorryModal: false,
            });
            setShowSkeleton(true);
          }}
        />
      )}
    </div>
  );
};

export default Simulation;
