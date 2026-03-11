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

import { useEffect, useState } from "react";
import { baseConfig } from "@/lib/api/baseConfiguration";
import ReadyMadeStrategyTable from "../readyMadeStrategyTable";
import Builder from "../builder/BuilderPage";
import Simulation from "../simulation/SimulationPage";
import BackTesting from "../backtesting/BackTestingPage";
import LoadingComponent from "@/components/shared/loading/Loading";
const StrategyBuilder = ({ params }: { params: { id: number } }) => {
  const [values, setValues] = useState<strategiesValues>({
    strategies: [] as UserStrategy[],
    strategyList: {} as StrategyList,
    loading: true,
  });

  const [selectedInfo, setSelectedInfo] = useState<SelectedStrategyInfo>({
    strategyType: undefined,
    strategyName: null,
    strategyId: params.id,
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
      return values.strategies.find((strategy) => strategy.id == params.id)
        ?.name;
    }
    if (selectedInfo.strategyName) return selectedInfo.strategyName;
    return "Long Call";
  };

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
          })
          .catch((error) => {
            console.error("Error when fetching strategies data ", error);
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
    <AppLayout>
      {values.loading && <LoadingComponent />}
      {!values.loading && (
        <div className="flex h-[calc(100vh-8rem)] w-full flex-row gap-2 ">
          {/* User Straegies Table */}
          <div className="gap 2 flex w-1/4 flex-col">
            <ReadyMadeStrategyTable
              strategyList={values.strategyList}
              handleStrategyClick={updateSelectedStrategy}
              selectedInfo={selectedInfo}
              name={getStrategyName()}
              strategies={values.strategies}
            />
          </div>
          <div className="flex max-h-[calc(100vh-8rem)] w-full flex-col rounded-lg border border-gray-200 bg-white shadow ">
            <TabLayout tabNames={config.strategyBuilder.tabNames}>
              <Builder name={getStrategyName()} id={selectedInfo.strategyId} />
              <Simulation
                name={getStrategyName()}
                id={selectedInfo.strategyId}
              />
              <BackTesting
                name={getStrategyName()}
                id={selectedInfo.strategyId}
              />
            </TabLayout>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default StrategyBuilder;
