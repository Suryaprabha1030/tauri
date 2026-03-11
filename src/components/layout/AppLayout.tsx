
"use client";
import Header from "@/components/shared/Header";
import { AuthContext } from "@/context/authContextProvider";
import { use, useContext, useEffect, useState } from "react";
import EnforceAuth from "./EnforceAuth";
import ReadyMadeStrategyTable from "@/app/strategy-builder/readyMadeStrategyTable";

import LoadingComponent from "@/components/shared/loading/Loading";
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

import { baseConfig } from "@/lib/api/baseConfiguration";

import ToggleContent from "@/app/strategy-builder/ToggleContent";


interface AppLayoutProps {
  children: React.ReactNode; 
  strategyList: StrategyList;
  handleStrategyClick: (name?: string, id?: number) => void;
  selectedInfo: SelectedStrategyInfo;
  strategies: UserStrategy[];
  name: string | undefined;
                                                                                                                                                                                                                                                                                                                                                                     
 }




 const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  
 
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
 
  const { isAuthenticated } = useContext(AuthContext);
  const [showChild, setShowChild] = useState(false); // State to control the visibility of the child component
  const [showAppLayout, setShowAppLayout] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Set the state to true after the timeout
      setShowAppLayout(true);
    }, 1000); // Set timeout to 1000 milliseconds (adjust as needed)

    // Clean up the timeout when the component unmounts or when the dependency array changes
    return () => clearTimeout(timeoutId);
   
  }, []); 
  const toggleChild = () => {
    setShowChild(!showChild); 
   
  };
  
  return (
    isAuthenticated && (
      <div className="h-full bg-white text-black">
      <div className="flex flex-col">
        <div className="sticky top-0 z-10 bg-white">
          <Header toggleChild={toggleChild} />
        </div>
        <main className="flex w-full px-2 py-4 overflow-y-hidden">
      
        <div className={`absolute left-0  top-20  z-[999]    flex flex-col 
       max-sm:h-[calc(100vh-5.2rem)] sm:h-[calc(100vh-5rem)]  md:h-[calc(100vh-5rem)] lg:hidden   max-sm:gap-4  max-sm:shadow md:shadow bg-white md:shadow  durtion-500  ease-linear 
           ${
             showChild
               ? " translate-x-0"
               : "-translate-y-full    "
           }`} >   
          {/* Conditionally render the ReadyMadeStrategyTable based on showStrategyTable state */}
          {showChild && <ReadyMadeStrategyTable
            strategyList={values.strategyList}
            handleStrategyClick={updateSelectedStrategy}
            selectedInfo={selectedInfo}
            name={getStrategyName()}
            strategies={values.strategies}
          />}
        </div>
        <div className="flex max-h-[calc(100vh-7rem)] max-sm:w-full  sm:w-screen sm:h-screen md:h-screen md:w-screen md:h-screen lg:hidden flex-col rounded-lg border border-gray-200 bg-white shadow-xl ">
          
        <ToggleContent name={getStrategyName()} id={selectedInfo.strategyId} />
        </div>
          
          {children}</main>
      </div>
    </div>
    )
  );
};

export default EnforceAuth(AppLayout);