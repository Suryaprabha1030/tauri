"use client";
import { SelectedStrategyData, StrategyBuilderInput } from "@/lib/types";
import { getChartData } from "@/lib/util/chartUtil";
import Chart from "@/components/shared/chart";
import OptionsLegData from "./optionsLegData";
import LoadingComponent from "@/components/shared/loading/Loading";
import OptionsLegBlueprint from "./optionsLegBlueprint";
import { use, useEffect, useState } from "react";
import StrategyBuilder from "@/components/shared/strategyBuilder/page";
import BuilerDatePicker from "@/components/shared/filter/builderDatePicker";
import { StrategyPayOffData, OptionsStrategyBuilderApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { set } from "react-hook-form";
import TransaparentLoadingComponent from "@/components/shared/loading/transparentLoading";

const Builder = (props: { name: string | undefined; id: number | null; }) => {
  const { name, id } = props;
  const [values, setValues] = useState({
    showCreateStrategy: false,
    showUpdateStrategy: false,
    loading: true,
   
  });
  

  const [selectedData, setSelectedData] = useState<SelectedStrategyData>({
    strategyData: {} as StrategyPayOffData,
    strategyBluePrint: undefined,
  });

  const defaultInput: StrategyBuilderInput = {
    indexName: "NIFTY",
    date: "2023-07-14",
    time: "09:15",
    expiry: "20JUL23",
  };

  const [builderInput, setBuilderInput] = useState<StrategyBuilderInput>({
    ...defaultInput,
  });

  const getMyStrategy = async (id: number, input: StrategyBuilderInput) => {
    const strategyApi = new OptionsStrategyBuilderApi(baseConfig());
    setValues((prevData) => ({ ...prevData, loading: true }));

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
  };

  const getReadyMade = async (name: string, input: StrategyBuilderInput) => {
    const strategyApi = new OptionsStrategyBuilderApi(baseConfig());
    setValues((prevData) => ({ ...prevData, loading: true }));

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
          });
      });
  };

  useEffect(() => {
    setValues((prevData) => ({
      ...prevData,
      showCreateStrategy: false,
      showUpdateStrategy: false,
    }));

    if (id) {
      
      getMyStrategy(id, builderInput);
    } else if (name) {
      getReadyMade(name, builderInput);
    }
  }, [name, id, builderInput]);

  const refreshData = (input: StrategyBuilderInput) => {
    setBuilderInput(input);
  };
  
  return (
    <div className="flex max-h-full w-full flex-col  2xl:gap-4  md:gap-[5rem] max-sm:gap-[3rem] sm:gap-[5rem] px-2 py-4 ">
      {!(values.showCreateStrategy || values.showUpdateStrategy) && (
        <div className="flex h-12  md:h-16 lg:h-14 w-full flex-col xl:flex-row items-center justify-center xl:justify-between gap-[3rem]  lg:gap-[1rem]  2xl:gap-20 max-sm:mb-3  bg-z-green-200 xl:py-[1.8rem]  ">

          <div className="flex w-full  sm:w-full  md:w-full lg:justify-center justify-center  ">
            <BuilerDatePicker submit={refreshData} />
          </div>
      
          <button
        className="flex  h-10  max-sm:hidden sm:hidden  md:flex  max-sm:w-[8rem] sm:w-[10rem] md:w-[10rem]   max-sm:py-2 sm:py-2 md:py-2 xl:py-0 lg:w-1/5 2xl:w-[15rem] items-center justify-center rounded-3xl bg-z-green-500 max-sm:text-[0.6rem] md:text[0.7rem] lg:text-[0.78rem] 2xl:text-base font-medium leading-none text-white md:-mt-[0.7rem] lg:mt-0"
            onClick={() => 
              setValues((prevData) => ({
                ...prevData,
                showCreateStrategy: true
              }))
            }
            title="Create Strategy"
          >
            Create Strategy
          </button>
          {id && (
            <button
              className="   flex lg:h-10 2xl:h-10 md:h-10 max-sm:w-[8rem] sm:w-[10rem] md:w-[10rem] max-sm:py-2 sm:py-2 md:py-2  xl:py-0 lg:px-2 lg:w-1/5 2xl:w-1/3 items-center justify-center rounded-3xl bg-z-green-500 max-sm:text-[0.78rem] md:text[1rem] lg:text-[0.78rem] 2xl:text-base font-medium leading-none text-white"
              onClick={() =>
                setValues((prevData) => ({
                  ...prevData,
                  showUpdateStrategy: true,
                }))
              }
            >
              Update Strategy
            </button>
           )} 
           </div>
       
      )}
       

      {values.loading && <TransaparentLoadingComponent/>}
      {!values.loading &&
        !(values.showCreateStrategy || values.showUpdateStrategy) && (
          <div className="flex h-full w-full flex-col  gap-3 px-2 py-4 sm:py-2 max-sm:-mt-16 sm:-mt-20 md:-mt-0 lg:-mt-8 xl:-mt-16 2xl:-mt-0 ">

            <div className="flex lg:h-1/2 w-full lg:flex-row flex-col lg:gap-8 ">
            <div className="flex max-sm:h-[18rem] md:h-[22rem]  lg:h-[19rem] lg:w-1/2 w-full flex-col">
                {name && (
                  
                  <h1 className="text-center max-sm:text-[0.9rem] md:text-[1.2rem] lg:text-[1rem] 2xl:text-lg font-bold mb-1 ">{name}</h1>
                )}
                <Chart
                  data={getChartData(selectedData.strategyData.plot_results)}
                  spotPrice={selectedData.strategyData.spot_price}
                />
              </div>
              <div className="flex lg:w-1/2 w-full flex-col overflow-y-auto sm:-mt-2 lg:mt-8 max-sm:-mt-[0.6rem] ">
                {selectedData.strategyBluePrint && (
                  <OptionsLegBlueprint
                    strategy={selectedData.strategyBluePrint.result}
                  />
                )}
                {!selectedData.strategyBluePrint && (
                  <OptionsLegBlueprint
                    strategy={selectedData.strategyData?.strategy_data}
                  />
                )}
              </div>
              
            </div>
            <div className="flex h-1/2 w-full flex-col gap-4 mt-5 lg:-mt-8 xl:-mt-6 2xl:-mt-8 ">
              {selectedData.strategyData && (
                <OptionsLegData strategyPayOff={selectedData.strategyData} />
              )}
            </div>
          </div>
        )}
        

      {/* // Create code */}
       {!values.loading && values.showCreateStrategy && (
        <div className="flex h-full w-full flex-col gap-4 p-2">
          <StrategyBuilder id={null} />
        </div>
      )}

      {/* // Update code */}
      {!values.loading && values.showUpdateStrategy && (
        <div className="flex h-full w-full flex-col gap-4  p-2">
          <StrategyBuilder
            strategy={selectedData.strategyData.strategy_data}
            id={id}
            name={name}
          />
        </div>
      )} 

     
    </div>
  );
};

export default Builder;
