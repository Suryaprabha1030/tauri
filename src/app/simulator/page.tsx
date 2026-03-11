"use client";
import AppLayout from "@/components/layout/AppLayout";
import TransaparentLoadingComponent from "@/components/shared/loading/transparentLoading";
import { SelectedStrategyData, SimulationInput } from "@/lib/types";
import { useEffect, useState } from "react";
import SimulationSkeleton from "../strategy-builder/simulation/simulationSkeleton";
import DatePicker from "./datePicker";
import {
  OptionChainParsedResult,
  OptionsSimulatorHistoricalApi,
  StrategyPayOffData,
} from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import config from "@/lib/config";
import OptionChain from "./optionChain";
import {
  buildAddLegsFromOptionChain,
  buildStrategyDataFromOptionChain,
} from "./simulatorUtil";
import OptionsLegData from "../strategy-builder/simulation/optionsLegData";
import Chart from "@/components/shared/chart";
import { getChartData } from "@/lib/util/chartUtil";
import CongratsModal from "../strategy-builder/simulation/congratsModal";
import SorryModal from "../strategy-builder/simulation/sorryModal";
import ImportStrategyModal from "./importStrategyModal";
import AlertToast from "@/components/shared/alertToast";
import { get } from "http";

const Simulator = () => {
  const simulatorApi = new OptionsSimulatorHistoricalApi(baseConfig());

  const [state, setState] = useState({
    loading: false, // used to show loading
    showSkeleton: true, // used to keep track of the journey
    optionChainStateChanged: false, // used to keep track of the option chain state
    journeyStarted: false, // used to keep track of the journey
    showCongratsModal: false, // used to show congrats modal
    showSorryModal: false, // used to show sorry modal
    showImportStrategyModal: false, // used to show import strategy modal
    showGlobalAlert: false, // used to show global alert
    showResetOptionChain: false, // used to show reset option chain button
  });

  const [data, setData] = useState<{
    optionChain: OptionChainParsedResult;
    selectedOptionChain: Record<string, any>;
    simulationInput: SimulationInput;
    strategyName: string;
  }>({
    optionChain: {} as OptionChainParsedResult,
    selectedOptionChain: {},
    simulationInput: config.defaultInput,
    strategyName: "",
  });

  const [selectedData, setSelectedData] = useState<SelectedStrategyData>({
    strategyData: {} as StrategyPayOffData,
    strategyBluePrint: undefined,
  });

  // By default populate the option chain with the default input
  useEffect(() => {
    getOptionChain(config.defaultInput);
  }, []);

  useEffect(() => {
    if (data.optionChain.index_name) {
      if (
        data.optionChain.index_name !== data.simulationInput.indexName ||
        data.optionChain.expiry_date !== data.simulationInput.expiry ||
        data.optionChain.time !==
          `${data.simulationInput.date}T${data.simulationInput.time}:00`
      ) {
        // show reset option chain warning
        setState({ ...state, showResetOptionChain: true });
      } else
        setState({
          ...state,
          showResetOptionChain: false,
        });
    }
  }, [data.simulationInput]);

  const getOptionChain = (input: SimulationInput) => {
    setState({ ...state, loading: true });
    simulatorApi
      .getParsedOptionChainV1SimulatorParsedOptionChainGet(
        input.expiry,
        `${input.date}T${input.time}`,
        input.indexName
      )
      .then((response) => {
        console.log(response,"fromOptionChain")
        setData({ ...data, optionChain: response.data });
        setState({ ...state, loading: false, showResetOptionChain: false });
      })
      .catch((error) => {
        console.log("getOptionChain", error);
        handleGlobalError(error);
      });
  };

  const updateOptionChainSelection = (input: any) => {
    const tempOptionStateChange = input && Object.keys(input).length > 0;
    setState({ ...state, optionChainStateChanged: tempOptionStateChange });
    if (tempOptionStateChange) setData({ ...data, selectedOptionChain: input });
  };

  // Start the simulation first time // import Strategy
  const startSimulationFirstTime = (
    strategyExampleData?: StrategyPayOffData,
    strategyName: string = ""
  ) => {
    setState({
      ...state,
      loading: true,
      journeyStarted: true,
      showImportStrategyModal: false,
    });

    const strategy_data_input = strategyExampleData?.strategy_data
      ? strategyExampleData?.strategy_data
      : buildStrategyDataFromOptionChain(data.selectedOptionChain);

    const simulationApi = new OptionsSimulatorHistoricalApi(baseConfig());

    const apiInput = {
      strategy_data: strategy_data_input,
      spot_price: strategyExampleData?.spot_price
        ? strategyExampleData?.spot_price
        : data.optionChain.spot_price,
      index_name: data.simulationInput.indexName,
      expiry_date: data.simulationInput.expiry,
      time: selectedData.strategyData.entry_time
        ? selectedData.strategyData.time
        : `${data.simulationInput.date}T${data.simulationInput.time}:00`,
      time_travel: "",
      entry_time: selectedData.strategyData.entry_time
        ? selectedData.strategyData.entry_time
        : `${data.simulationInput.date}T${data.simulationInput.time}:00`,
      load_option_chain: true,
    };

    simulationApi
      .getPayOffV1SimulatorPayoffPost(apiInput)
      .then((res) => {
        // UI data
        console.log(res,"simulatorChart....")
        setSelectedData((prevData) => ({
          ...prevData,
          strategyData: res.data,
        }));

        // OPtion CHain Data
        setData((prevData) => ({
          ...prevData,
          optionChain: res.data.preloaded_option_chain,
          selectedOptionChain: {},
          strategyName: strategyName,
        }));

        // set state loading
        setState((prevData) => ({
          ...prevData,
          loading: false,
          showSkeleton: false,
          journeyStarted: true,
          optionChainStateChanged: false,
          showImportStrategyModal: false,
        }));
      })
      .catch((err) => {
        console.log(err);
        handleGlobalError(err);
      });
  };

  const updateSimulation = (input: SimulationInput) => {
    setState({
      ...state,
      journeyStarted: true,
      loading: true,
    });

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
      add_legs: buildAddLegsFromOptionChain(data.selectedOptionChain),
      strategy_exit_journey: selectedData.strategyData.strategy_exit_journey,
      load_option_chain: true,
    };
    

    simulatorApi
      .getPayOffV1SimulatorPayoffPost(simulaitonInput)
      .then((res) => {
       console.log(res,"payoff:")
        setSelectedData((prevData) => ({
          ...prevData,
          strategyData: res.data,
        }));

        // set loading
        setState((prevData) => ({
          ...prevData,
          loading: false,
          optionChainStateChanged: false,
        }));

        // SET OPTION CHAIN DATA
        setData((prevData) => ({
          ...prevData,
          optionChain: res.data.preloaded_option_chain,
          selectedOptionChain: {},
        }));

        setState({ ...state, loading: false });
      })
      .catch((err) => {
        console.log(err);
        handleGlobalError(err);
      });
  };

  const showModal = () => {
    if (
      selectedData.strategyData.total_value &&
      selectedData.strategyData.total_value > 0
    ) {
      setState({ ...state, showCongratsModal: true });
    } else {
      setState({ ...state, showSorryModal: true });
    }
  };

  const handleGlobalError = (error: any) => {
    if (error.response.status === 401) {
      window.location.href = "/logout";
    } else {
      setState({ ...state, loading: false, showGlobalAlert: true });
    }
  };

  const resetStateAndData = () => {
    // trigger the default option chain
    const input = config.defaultInput;
    setState({
      ...state,
      loading: true,
      showCongratsModal: false,
      showSorryModal: false,
    });
    simulatorApi
      .getParsedOptionChainV1SimulatorParsedOptionChainGet(
        input.expiry,
        `${input.date}T${input.time}`,
        input.indexName
      )
      .then((response) => {
        setData({
          optionChain: response.data,
          selectedOptionChain: {},
          simulationInput: config.defaultInput,
          strategyName: "",
        });

        setSelectedData({
          strategyData: {} as StrategyPayOffData,
          strategyBluePrint: undefined,
        });

        setState({
          loading: false,
          showSkeleton: true,
          optionChainStateChanged: false,
          journeyStarted: false,
          showCongratsModal: false,
          showSorryModal: false,
          showImportStrategyModal: false,
          showGlobalAlert: false,
          showResetOptionChain: false,
        });
      })
      .catch((error) => {
        console.log("getOptionChain", error);
        handleGlobalError(error);
      });
  };
  // slider
  const [isSliding, setIsSliding] = useState(false);
  const handleSlideToggle = () => {
    setIsSliding(!isSliding);
  };
  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-8rem)] w-full flex-row gap-2  ">
        <div className="flex h-full w-full flex-col gap-4 mt-2 ">
          <div className="flex flex-row  justify-center gap-4 bg-z-green-200 py-4 ">
            <div className="flex h-18 w-full flex-row items-center ">
              <DatePicker
                journeyTime={selectedData.strategyData.time}
                getOptionChain={getOptionChain}
                updateSelectionToParent={(input) => {
                  setData({ ...data, simulationInput: input });
                }}
                journeyStarted={state.journeyStarted}
                onTimeTravelUpdated={updateSimulation}
                resetState={resetStateAndData}
                showImportStrategyModal={() => {
                  setState({ ...state, showImportStrategyModal: true });
               
                }}
               
              />
            </div>
          </div>
          <div className="flex  h-[calc(100vh-8rem)] flex-row gap-4">
            <div className={`flex w-2/6 flex-col gap-8 ${isSliding ? 'w-2/6' : 'w-7'}`}>
              {state.showResetOptionChain && (
                <div className="flex h-10 w-full items-center text-center text-black">
                  <p> ⚠️ Please Reload Option Chain </p>
                </div>
              )}
              <div className="flex max-h-[calc(100vh-20rem)]  flex-col gap-4 border-2 border-z-blue-100 text-center">
                {data.optionChain && (
                  <OptionChain
                    optionChain={data.optionChain}
                    updateSelectionToParent={updateOptionChainSelection}
                    isSliding={isSliding}
                    handleSlideToggle={handleSlideToggle}
                  />
                )}
              </div>
              {state.optionChainStateChanged && (
                <div className="h-10 w-[19.5rem]  flex items-center justify-end">
                <button
                  type="submit"
                  className={`flex h-full w-1/2 px-2 items-center justify-center rounded-3xl bg-z-green-500 text-base font-medium leading-none text-white ${isSliding ? '' : 'hidden'}`}
                  onClick={() => {
                    if (state.showSkeleton) startSimulationFirstTime();
                    else
                      updateSimulation({
                        ...data.simulationInput,
                        timeTravel: "",
                      });
                  }}
                >
                  {state.showSkeleton ? "Start Simulator" : "Update Simulator"}
                </button>
                </div>
              )}
            </div>
             {/* isSliding ? 'w-[50rem] h-[25rem]' : 'w-[50rem] h-[25rem]' */}
            <div className={`flex max-h-[calc(100vh-15rem)] w-4/6 flex-col border-2 border-z-blue-100 p-2 ${isSliding ? 'w-4/6' : 'w-full'}`}>
              {state.loading && <TransaparentLoadingComponent />}
              {state.showSkeleton && <SimulationSkeleton />}
              {!state.showSkeleton && selectedData.strategyData && (
                <div className="flex h-full w-full flex-col gap-4 overflow-y-scroll px-2 py-4">
                  <div className={`flex  w-full flex-row   ${isSliding ? 'justify-center gap-4  h-[20rem]' : 'justify-center   h-[25rem] gap-4'}`}>
                    <div className={`flex   flex-col w-[49rem] h-[25rem]
                    }`
                     }>
                      {data.strategyName && (
                        <h1 className="text-center text-xl font-bold">
                          {data.strategyName}
                        </h1>
                      )}
                      {selectedData.strategyData && (
                        <Chart
                          data={getChartData(
                            selectedData.strategyData.plot_results
                          )}
                          spotPrice={selectedData.strategyData.spot_price}
                        />
                      )}
                    </div>
                    {/* h-28 w-52 flex-col gap-4 rounded-2xl bg-z-green-300 p-5 */}
                    <div className={`flex h-full  flex-col  ${isSliding ? 'w-1/3' : 'w-1/3'}` }>
                      <div className={`flex  justify-end  ${isSliding ? 'flex-col gap-2 p-2' : 'flex-row gap-4 p-4'}`}>
                        <div className={`flex  flex-col rounded-2xl bg-z-green-300  items-center ${isSliding ? 'h-15 w-40 p-2 gap-2' : 'h-28 w-52 p-5 gap-4'}`}>
                          <div className="text-sm font-semibold leading-tight text-zinc-900">
                            Total Profit
                            {/* { selectedData.strategyData.profit_and_loss.strategy_direction === 'Bullish' ? (
                                <Image src="/svg/bull-icon.svg" height={24} width={24} alt={""} />
                                ) : selectedData.strategyData.profit_and_loss.strategy_direction === 'Neutral' ?
                                (<Image src="/svg/target-icon.svg"  height={24} width={24} alt={""} />) : 
                                <Image  src="/svg/bear-icon.svg" height={24} width={24} alt={""} />
                                } */}
                          </div>
                          <div
                            className={`text-xl font-semibold leading-9
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
                        <div className={`flex flex-col rounded-2xl bg-z-green-300  items-center ${isSliding ? 'h-15 w-40 p-2 gap-2' : 'h-28 w-52 p-5 gap-4'}`}>
                          <div className="text-sm font-semibold leading-tight text-zinc-900">
                            Breakeven Points
                          </div>
                          <div className="ext-xl font-semibold leading-9 text-zinc-900">
                            {selectedData.strategyData.profit_and_loss
                              .breakeven_points.length > 1
                              ? `${selectedData.strategyData.profit_and_loss.breakeven_points[0]}-${selectedData.strategyData.profit_and_loss.breakeven_points[1]}`
                              : selectedData.strategyData.profit_and_loss
                                  .breakeven_points[0]}
                          </div>
                        </div>
                      </div>
                      <div className={`flex  justify-end  ${isSliding ? 'flex-col gap-2 p-2' : 'flex-row gap-4 p-4'}`}>
                        <div className={`flex  flex-col rounded-2xl bg-z-green-300  items-center ${isSliding ? 'h-15 w-40 p-2 gap-2' : 'h-28 w-52 p-5 gap-4'}`}>
                          <div className="text-sm font-semibold leading-tight text-zinc-900">
                            Max Profit
                          </div>
                          <div className="ext-xl font-semibold leading-9 text-zinc-900">
                            {
                              selectedData.strategyData.profit_and_loss
                                .max_profit
                            }
                          </div>
                        </div>
                        <div className={`flex flex-col rounded-2xl bg-z-green-300  items-center ${isSliding ? 'h-15 w-40 p-2 gap-2' : 'h-28 w-52 p-5 gap-4'}`}>
                          <div className="text-sm font-semibold leading-tight text-zinc-900">
                            Max Loss
                          </div>
                          <div className="ext-xl font-semibold leading-9 text-zinc-900">
                            {selectedData.strategyData.profit_and_loss.max_loss}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`flex h-1/2 w-full flex-col gap-4  ${isSliding ? 'mt-[3.5rem]' : ''}`}>
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
              {!state.showSkeleton && state.showCongratsModal && (
                <CongratsModal
                  totalValue={selectedData.strategyData.total_value}
                  hideModal={resetStateAndData}
                />
              )}
              {!state.showSkeleton && state.showSorryModal && (
                <SorryModal
                  totalValue={selectedData.strategyData.total_value}
                  hideModal={resetStateAndData}
                />
              )}
              {state.showImportStrategyModal && (
                <ImportStrategyModal
                  hideModal={() => {
                    setState({ ...state, showImportStrategyModal: false });
                  }}
                  importBluePrint={(
                    exampleData: StrategyPayOffData,
                    strategyName: string
                  ) => {
                    console.log(exampleData, strategyName,"need input.....  ")
                    startSimulationFirstTime(exampleData, strategyName);
                  }}
                  strategyBuilderInput={data.simulationInput}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {state.showGlobalAlert && (
        <AlertToast
          errorMessage="Sorry! Something went wrong, please try again"
          toggleComponent={() => {
            setState({ ...state, showGlobalAlert: false });
          }}
        />
      )}
    </AppLayout>
  );
};

export default Simulator;
