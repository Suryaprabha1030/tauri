"use client";

import TransaparentLoadingComponent from "@/components/shared/loading/transparentLoading";
import {
  OptionsStrategyBuilderApi,
  StrategyList,
  StrategyPayOffData,
  UserApi,
} from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  StrategyBuilderInput,
  UserStrategy,
  strategiesValues,
} from "@/lib/types";
import { useEffect, useState } from "react";

const ImportStrategyModal = (props: {
  hideModal: () => void;
  importBluePrint: (
    exampleData: StrategyPayOffData,
    strategyName: string
  ) => void;
  strategyBuilderInput: StrategyBuilderInput;
}) => {
  const [values, setValues] = useState<strategiesValues>({
    strategies: [] as UserStrategy[],
    strategyList: {} as StrategyList,
    loading: true,
  });

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
            console.error(
              "Error when fetching ReadyMade strategies data ",
              error
            );
            if (error.response.status === 401) {
              window.location.href = "/logout";
            }
          });
      })
      .catch((error) => {
        console.error("Error when fetching User strategies data ", error);
        if (error.response.status === 401) {
          window.location.href = "/logout";
        }
      });
  }, []);

  const getMyStrategy = async (id: number) => {
    const strategyApi = new OptionsStrategyBuilderApi(baseConfig());
    setValues((prevData) => ({ ...prevData, loading: true }));

    const strategyData =
      await strategyApi.getDataForCustomMadeStrategyV1StrategiesByIdStrategyIdExampleGet(
        id,
        props.strategyBuilderInput.indexName,
        `${props.strategyBuilderInput.date}T${props.strategyBuilderInput.time}`,
        props.strategyBuilderInput.expiry
      );

    // set loading
    setValues((prevData) => ({
      ...prevData,
      loading: false,
    }));

    // call parent function
    props.importBluePrint(strategyData.data, strategyData.data.strategy_name);
  };

  const getReadyMade = async (name: string) => {
    const strategyApi = new OptionsStrategyBuilderApi(baseConfig());
    setValues((prevData) => ({ ...prevData, loading: true }));

    await strategyApi
      .getDataForReadyMadeStrategyV1StrategiesByNameStrategyNameExampleGet(
        name,
        props.strategyBuilderInput.indexName,
        `${props.strategyBuilderInput.date}T${props.strategyBuilderInput.time}`,
        props.strategyBuilderInput.expiry
      )
      .then((response) => {
        // set loading
        setValues((prevData) => ({
          ...prevData,
          loading: false,
        }));

        // call parent function
        console.log(response.data);
        props.importBluePrint(response.data, name);
      });
  };

  return (
    <div
      id="import-strategy-modal"
      className="fixed left-0 right-0 top-0 z-50 flex max-h-full items-center justify-center overflow-x-hidden bg-gray-500 bg-opacity-60 p-4 md:inset-0"
    >
      {values.loading && <TransaparentLoadingComponent />}
      {!values.loading && (
        <div className="relative max-h-full w-full max-w-5xl">
          <div className="relative rounded-lg bg-white shadow dark:bg-gray-700">
            <button
              type="button"
              className="absolute right-2.5 top-3 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-transparent text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={props.hideModal}
            >
              <svg
                className="h-3 w-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <h2 className="p-4 text-left font-semibold text-black">
              {" "}
              Import Strategy{" "}
            </h2>
            <div className="flex flex-row gap-10 p-6 text-left ">
              {Object.keys(values.strategyList).map((key, idx) => (
                <div className="flex flex-col p-2 text-left" key={idx}>
                  <h2 className="px-5 py-2 font-medium text-black">{key} </h2>
                  <ul className="text-black-500 text-sm">
                    {values.strategyList[key as keyof StrategyList].map(
                      (item: string) => (
                        <li
                          key={item}
                          className="cursor-pointer bg-white px-5 py-2 hover:bg-z-green-300"
                          onClick={() => getReadyMade(item)}
                        >
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              ))}

              <div className="flex  flex-col gap-2  p-2 text-left">
                <h2 className="sticky px-5 py-2 font-medium text-black">
                  {" "}
                  My Strategies
                </h2>
                <ul className="text-black-500 max-h-[calc(60vh-10rem)] overflow-y-scroll rounded-lg text-left text-sm">
                  {values.strategies.map((item: UserStrategy) => (
                    <li
                      key={item.id}
                      onClick={() => getMyStrategy(item.id)}
                      className="cursor-pointer bg-white px-5 py-2 text-center hover:bg-z-green-300"
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportStrategyModal;
