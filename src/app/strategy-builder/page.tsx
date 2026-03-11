"use client";
import AppLayout from "@/components/layout/AppLayout";
import TabLayout from "@/components/shared/tablayout";
import config from "@/lib/config";
import {
  SelectedStrategyData,
  SelectedStrategyInfo,
  UserStrategy,
  strategiesValues,
} from "@/lib/types";
import {
  OptionsStrategyBuilderApi,
  StrategyList,
  StrategyPayOffData,
  UserApi,
} from "@/lib/api/base";
import MyStrategyTable from "./myStrategyTable";
import { useEffect, useState } from "react";
import { baseConfig } from "@/lib/api/baseConfiguration";
import ReadyMadeStrategyTable from "./readyMadeStrategyTable";
import Builder from "./builder/BuilderPage";
import Simulation from "./simulation/SimulationPage";
import BackTesting from "./backtesting/BackTestingPage";
import LoadingComponent from "@/components/shared/loading/Loading";
import ToggleContent from "./ToggleContent";
import { updateStrategy } from "@/lib/redux/slices/StrategySlice";
import { useDispatch } from "react-redux";
const StrategyBuilder = () => {
  const dispatch=useDispatch()
  const [values, setValues] = useState<strategiesValues>({
    strategies: [] as UserStrategy[],
    strategyList: {} as StrategyList,
    loading: true,
  });
  
  const [selectedInfo, setSelectedInfo] = useState<SelectedStrategyInfo>({
    strategyType: undefined,
    strategyName: null,
    strategyId: null,
  });
  

  const getStrategyType = (strategyName: string) => {
    for (const category in values.strategyList) {
      if (
        values.strategyList[category as keyof StrategyList].includes(
          strategyName
        )
      ) {
        return category as keyof StrategyList;
      }
    }
  };

  const getStrategyName = () => {
    if (selectedInfo.strategyId) {
      return values.strategies.find(
        (strategy) => strategy.id === selectedInfo.strategyId
      )?.name;
    }
    if (selectedInfo.strategyName) return selectedInfo.strategyName;
    return "Long Call";
  };
  // dispatch(updateStrategy({ strategyName:getStrategyName(), strategyId:selectedInfo.strategyId }));
  const updateSelectedStrategy = async (
    name?: string | undefined,
    id?: number | undefined
  ) => {
    if (name) {
      setSelectedInfo((prevData) => ({
        ...prevData,
        strategyName: name,
        strategyId: null,
        strategyType: getStrategyType(name),
      }));
    } else if (id) {
      setSelectedInfo((prevData) => ({
        ...prevData,
        strategyId: id,
        strategyName: null,
        strategyType: undefined,
      }));
    }
  };

  useEffect(() => {
    const userApi = new UserApi(baseConfig());
    const strategyApi = new OptionsStrategyBuilderApi(baseConfig());

    userApi
      .readMyStrategiesV1UsersMeStrategiesGet()
      .then((readyMadeStrategyResponse) => {
        strategyApi
          .listAllReadyMadeStrategiesV1StrategiesGet()
          .then((response) => {
            setValues((prevData: any) => ({
              ...prevData,
              strategies: readyMadeStrategyResponse.data,
              strategyList: response.data,
              loading: false,
            }));

            setSelectedInfo((prevData) => ({
              ...prevData,
              strategyType: "Bullish" as keyof StrategyList,
              strategyName: "Long Call",
              strategyId: null,
            }));
          })
          .catch((error) => {
            console.error("Error when fetching strategies data ", error);
            if (error.response.status === 401) {
              window.location.href = "/logout";
            }
          });
      })
      .catch((error) => {
        console.error("Error when fetching strategies data ", error);
        if (error.response.status === 401) {
          window.location.href = "/logout";
        }
      });
  }, []);
  

  return (
   

   
    <AppLayout className="max-sm:hidden sm:hidden md:hidden lg:flex">
    {values.loading && <LoadingComponent/>}
    {!values.loading && (
      <div className=" max-h-[calc(100vh-8rem)]  w-full   flex-col lg:flex-row gap-2 max-sm:hidden hidden lg:flex  " >
        
        {/* User Straegies Table */}
        <div className=" gap 2 flex lg:w-1/5 2xl:w-1/4  flex-col max-sm:hidden sm:hidden md:hidden lg:flex">
        
          <ReadyMadeStrategyTable
            strategyList={values.strategyList}
            handleStrategyClick={updateSelectedStrategy}
            selectedInfo={selectedInfo}
            name={getStrategyName()}
            strategies={values.strategies}
            // replaceClick={replaceClick}
          />
        </div>
        <div className=" flex max-h-[calc(100vh-7rem)] lg:w-3/4 2xl:w-full  w-full  flex-col  rounded-lg border border-gray-200 bg-white shadow  max-sm:hidden sm:hidden md:hidden lg:block">
        <ToggleContent name={getStrategyName()} id={selectedInfo.strategyId} />
        </div>
        
      </div>
    )}

    

  </AppLayout>
  
    
    
  );
};

export default StrategyBuilder;