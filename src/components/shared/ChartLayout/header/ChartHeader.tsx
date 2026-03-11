import Image from "next/image";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import Logo from "../../logo/logo";
import { subscribeToSymbol } from "@/lib/websocket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import {
  addCartSuccess,
  getIndexName,
  setStock,
  settoggleholdings,
  settogglepositions,
} from "@/lib/redux/slices/StrategySlice";

import { useRouter } from "next/navigation";
import {
  checkPosition,
  getCheckedPositionData,
  getFutTargetltpData,
  getFutureData,
  getOptionData,
  getOptTargetltpData,
  getSelectPositionData,
  getToggleState,
  optionChainPayload,
  setSelectedStrategy,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";
import StocksCard from "./StocksCard";
import HoldingsPositionsCard from "./HoldingsPositionsCard";
import SwitchBroker from "./SwitchBroker";
import {
  setAnalyzeOrderStocks,
  setStockData,
} from "@/lib/redux/slices/PlaceOrder";
import {
  setChartPanel,
  showHeatmap,
  ShowStrategiesPopup,
} from "@/lib/redux/slices/ChartsSlice";
import { useWebSocketContext } from "@/context/websocketContextProvider";
import MenuDropDown from "./MenuDropDown";
import usePWAInstallPrompt from "@/components/ProgressiveWebApp/usePWAInstallPromt";
import { setShowPWAicon } from "@/lib/redux/slices/CommonSlice";
import { tvWidget } from "@/components/tradingView/chartSetup";
import holdings from "../sidetoolbar/holdings/holdings";
import useCachedImage from "@/hooks/useCachedImage";
import {
  getInputValue,
  getMaxPainStrikeValue,
  getMinExpiryDate,
  getMultiOiLoad,
  getPayOffChartPayLoad,
  getStrangleOiLoad,
} from "@/lib/redux/slices/StrategyChartSlice";
import {
  getTempInputValues,
  setSelectedIndexName,
} from "@/lib/redux/slices/OptionChainSlice";
import config from "@/lib/config";
import { setGlobalSymbolNewsData } from "@/lib/OItoggleExpiry";

interface DashboardHeaderProps {
  brokerCode: number | null;
  setBrokerCode: Dispatch<React.SetStateAction<any>>;
  selectedWatchlistId: any | null;
  setEntryPriceData: Dispatch<React.SetStateAction<any>>;
  setCheckedOptionData: Dispatch<React.SetStateAction<any>>;
  setExpiryPayload: Dispatch<React.SetStateAction<any>>;
  setHandleInstallClick: Dispatch<SetStateAction<(() => void) | null>>;
}

const ChartHeader: React.FC<DashboardHeaderProps> = ({
  brokerCode,
  selectedWatchlistId,
  setEntryPriceData,
  setCheckedOptionData,
  setExpiryPayload,
  setBrokerCode,
  setHandleInstallClick,
}) => {
  const [showHistory, setShowHistory] = useState(true);

  const dispatch = useDispatch();
  const router = useRouter();
  const { connectionStatus } = useWebSocketContext();
  const addsymbolsread: any = useSelector(
    (state: RootState) => state.strategy.symbols,
  );
  const holdingsdata: any = useSelector(
    (state: RootState) => state.strategy.holdingsData,
  );
  const positionsdata = useSelector(
    (state: RootState) => state.strategy.positions,
  );
  const websocketOpen = useSelector(
    (state: RootState) => state.charts.websocketOpen,
  );
  const chartPanel = useSelector((state: RootState) => state.charts.chartPanel);
  const [activeButton, setActiveButton] = useState("");

  const [subscribedTokens, setSubscribedTokens] = useState<string[]>([]);
  const [switchNavbar, setSwitchNavbar] = useState(false);

  const { isInstallPromptVisible, handleInstallClick } = usePWAInstallPrompt();
  useEffect(() => {
    if (isInstallPromptVisible == true) {
      dispatch(setShowPWAicon(true));
      setHandleInstallClick(() => handleInstallClick);
    } else dispatch(setShowPWAicon(false));
  }, [isInstallPromptVisible]);

  useEffect(() => {
    if (connectionStatus && websocketOpen) {
      // Filter identifiers that are not yet subscribed
      const unsubscribedIdentifiers = addsymbolsread.filter(
        (identifier) => !subscribedTokens.includes(identifier),
      );

      if (unsubscribedIdentifiers.length > 0) {
        subscribeToSymbol(unsubscribedIdentifiers);
        setSubscribedTokens((prev) => [...prev, ...unsubscribedIdentifiers]);
      }
    }
  }, [addsymbolsread, subscribedTokens, connectionStatus, websocketOpen]);

  useEffect(() => {
    if (!connectionStatus) {
      setSubscribedTokens([]);
    }
  }, [connectionStatus]);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === `${config.brokersListUrl}/${brokerCode}/psv`) {
      setActiveButton("A");
    }
    if (path === `${config.brokersListUrl}/${brokerCode}/psb`) {
      setActiveButton("B");
    }
    if (path === `${config.brokersListUrl}/${brokerCode}/oi`) {
      setActiveButton("C");
    }
  }, [brokerCode]);

  //click outside menu

  const buttons = [
    {
      label: "PSV",
      value: "A",
      width: "w-[2rem]",
      route: `${config.brokersListUrl}/${brokerCode}/psv`,
    },
    {
      label: "PSB",
      value: "B",
      width: "w-[2rem]",
      route: `${config.brokersListUrl}/${brokerCode}/psb`,
    },
    {
      label: "OI",
      value: "C",
      width: "w-[1.5rem]",
      route: `${config.brokersListUrl}/${brokerCode}/oi`,
    },
    { label: "Logout", value: "D", width: "w-[3.5rem]", route: `/logout` },
  ];

  const handleClick = (buttonValue: any, route: any) => {
    if (chartPanel) dispatch(setChartPanel(false));
    dispatch(setSelectedIndexName(""));
    dispatch(showPositionTable(false));
    dispatch(showStrategyTable(true));
    dispatch(showPnlTable(false));
    dispatch(showDraftPositions(false));
    dispatch(setSelectedStrategy({ setselectedStrategy: null }));
    dispatch(setStockData([]));
    setActiveButton(buttonValue);
    setSwitchNavbar(false);
    dispatch(settogglepositions(false));
    dispatch(settoggleholdings(false));
    dispatch(getMaxPainStrikeValue(null));
    const path = window.location.pathname;
    // Check the path and update the state accordingly
    if (
      path === `${config.brokersListUrl}/${brokerCode}/psv` ||
      path === `${config.brokersListUrl}/${brokerCode}/oi`
    ) {
      dispatch(
        addCartSuccess({
          items: {
            exchange: "",
            index_name: "",
            spot_price: null,
            expiryDate: "",
          },
        }),
      );

      dispatch(getFutureData({ futureData: {} }));
      dispatch(getOptionData({ optionData: {} }));
      dispatch(
        optionChainPayload({
          optionChainPayloadData: { ClickedRow: {}, response: {} },
        }),
      );
      // setActiveButton("A");
    }
    if (path === `${config.brokersListUrl}/${brokerCode}/psb`) {
      dispatch(getFutureData({ futureData: {} }));
      dispatch(getOptionData({ optionData: {} }));
      dispatch(setAnalyzeOrderStocks({}));
      dispatch(getOptTargetltpData({ OptTargetLtpData: {} }));
      dispatch(getFutTargetltpData({ FutTargetLtpData: {} }));
      dispatch(getCheckedPositionData({ PositionData: {} }));
      dispatch(getSelectPositionData({ selectPositionData: {} }));
      dispatch(checkPosition(false));
      dispatch(getTempInputValues({}));
      setEntryPriceData({});
      setCheckedOptionData({});
      dispatch(getPayOffChartPayLoad({}));
      dispatch(getStrangleOiLoad({}));
      dispatch(getMultiOiLoad([]));
      dispatch(getMinExpiryDate(null));
      setExpiryPayload(null);
      dispatch(getInputValue(null));
    }
    setShowHistory(!showHistory);
    dispatch(
      setStock({
        stock: {
          exchange: "",
          index_name: "",
          spot_price: "",
        },
      }),
    );
    router.push(route);
    dispatch(ShowStrategiesPopup(false));
    dispatch(
      getIndexName({
        indexName: "",
        expiryDate: "",
      }),
    );
    dispatch(getToggleState({ toggleState: "LTP" }));
    dispatch(showHeatmap(false));
    setGlobalSymbolNewsData({}); //News empty on navigation
  };

  const cachedSrc: any = useCachedImage("/svg/network.svg");

  return (
    <>
      {!connectionStatus && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50 max-xl:z-[10009] ">
          <div className="flex flex-col items-center justify-center rounded  bg-white p-4 text-center shadow-lg ">
            <p className="row  flex flex items-center justify-center gap-2 text-center font-semibold">
              <img src={cachedSrc} width={20} height={20} alt="wifi" /> Oops!
              Network Disconnected
            </p>
            <p>Please check your network connection.</p>
          </div>
        </div>
      )}

      <header className="flex w-full flex-row items-center justify-between gap-4 bg-white p-1 text-black shadow max-xl:fixed max-xl:left-0 max-xl:right-0 max-xl:top-0 max-xl:z-[10002] max-xl:h-[8%] xl:relative xl:h-[100%]">
        <div className="flex flex-row items-center justify-center max-md:justify-start max-md:gap-1 md:max-xl:mr-[2rem] xl:gap-2 ">
          <span className="flex flex-row items-center max-sm:min-w-[11rem] max-sm:justify-start max-sm:px-2 xl:min-w-[13rem] xl:justify-start">
            <Logo height={48} width={160} />
          </span>
        </div>

        <div className="flex gap-2 text-black max-md:hidden">
          <StocksCard
            brokerCode={brokerCode}
            selectedWatchlistId={selectedWatchlistId}
          />
          <div className=" xl:border-l-2 xl:border-gray-300 "></div>
          <HoldingsPositionsCard
            holdingsdata={holdingsdata}
            positionsdata={positionsdata}
          />
        </div>

        <div className=" flex flex-row items-center max-2xl:justify-between max-xl:w-[14rem] max-sm:pr-2 sm:max-md:h-[4rem] sm:max-md:px-2 md:max-xl:h-full md:max-xl:pr-6 xl:gap-1 xl:max-2xl:w-[19rem] xl:max-2xl:pr-3 2xl:justify-center ">
          <SwitchBroker
            brokerCode={brokerCode}
            setBrokerCode={setBrokerCode}
            setEntryPriceData={setEntryPriceData}
            setCheckedOptionData={setCheckedOptionData}
            setExpiryPayload={setExpiryPayload}
          />
          {/* Only for Small Screen */}
          <MenuDropDown
            buttons={buttons}
            handleClick={handleClick}
            activeButton={activeButton}
            switchNavbar={switchNavbar}
            setSwitchNavbar={setSwitchNavbar}
          />

          <div className="tri-state-toggle ease inline-flex flex-row overflow-hidden rounded-3xl border-2 border-z-green-500 bg-white bg-opacity-50 text-[0.7rem] shadow-inner shadow-lg transition-all duration-500 max-xl:hidden">
            {buttons.map((button) => (
              <button
                key={button.value}
                className={`m-1 flex h-5 w-10 cursor-pointer items-center justify-center rounded-full px-2 ${
                  activeButton === button.value
                    ? "border border-gray-300 bg-z-green-500 font-medium text-white shadow-lg"
                    : "bg-transparent text-black"
                } ${
                  button.label == "Logout" ? "hidden" : ""
                } transition-all duration-500 ease-in`}
                onClick={() => handleClick(button.value, button.route)}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </header>
    </>
  );
};

export default React.memo(ChartHeader);
