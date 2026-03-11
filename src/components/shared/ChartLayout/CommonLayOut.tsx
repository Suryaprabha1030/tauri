import { AuthContext } from "@/context/authContextProvider";
import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import EnforceAuth from "@/components/layout/EnforceAuth";
import CreateWatchlist from "./flotingComponent/createWatchlist/CreateWatchlist";
import Addsymbol from "./flotingComponent/addsymbol/Addsymbol";
import ChartHeader from "./header/ChartHeader";
import { useRouter } from "next/navigation";
import {
  addSymbol,
  setFundsData,
  setHoldingsData,
  setPositions,
  setSettingsData,
  updateSymbolData,
} from "@/lib/redux/slices/StrategySlice";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import DraftNamePopup from "./optionFutures/Sandbox/CreateNewSandbox";
import ListAllSandboxNames from "./optionFutures/Sandbox/ListAllSandbox";
import { toast } from "react-toastify";
import PlaceOrder from "@/components/PlaceOrder/PlaceOrder";
import RightToolBar from "./sidetoolbar/toolBar/RightToolBar";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import WarningBox from "../Warning alert/WarningBox";
import TradingViewPopup from "@/components/tradingView/TradingviewPopup";
import { showCustomToast } from "../customToast";
import {
  setInitiateOrderToast,
  setOpenOiSettings,
} from "@/lib/redux/slices/CommonSlice";
import {
  setOrderPlaced,
  updateSymbolPnl,
} from "@/lib/redux/slices/PositionSlicer";
import RiskDisclosureModal from "../RiskDisclosure";
import OIProfileSettingsModal from "@/components/tradingView/OiSettings";
import config from "@/lib/config";
import TradingViewScreener from "@/components/tradingView/Screener";
import StockInfoSideDisplay from "./sidetoolbar/StockinfoSideDisplay/stockinfoSideDisplay";
import SymbolNews from "@/components/StockInfo/StockChart/SymbolNews";
import { setGlobalSymbolNewsData } from "@/lib/OItoggleExpiry";
import OiAlertBox from "./oiAlert/OiAlert";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { tvWidget } from "@/components/tradingView/chartSetup";
import { cleanupExitLine } from "@/components/tradingView/AnnotationDisplay";
import { getAllIndicesWithExpiryDetails } from "@/components/NimaAI/AIChat";
import {
  setLastUpdatedHoldings,
  setLastUpdatedPositions,
} from "@/lib/redux/slices/screenerSlice";
import { useSimulatedHoldings } from "@/components/Simulation/SimulatedHoldings/useSimulatedholdings";
import { useSimulatedPositions } from "@/components/Simulation/SimulatedPositions/useSimulatedPositions";
import { fetchStrategiesPnlApi } from "@/components/Simulation/SimulatedPositions/StrategiesApiCall";
import { setStrategiesPnlRefresh } from "@/lib/redux/slices/SimulationSlice";

interface CommonLayoutProps {
  isAuthenticated: boolean;
  status: "idle" | "loading" | "success" | "error";
  errorMessage: string;
  children: React.ReactNode;
  show: boolean;
  showCreateWatchlist: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  setShowCreateWatchlist: Dispatch<SetStateAction<boolean>>;
  selectedWatchlistId: number;
  symbols: string;
  apiKey: any;
  fnoIdentifiers: any;
  setFnoIdentifiers: Dispatch<SetStateAction<any[]>>;
  clickedSymbolData: string;
  setEntryPriceData: Dispatch<React.SetStateAction<any>>;
  setCheckedOptionData: Dispatch<React.SetStateAction<any>>;
  setExpiryPayload: Dispatch<React.SetStateAction<any>>;
  setDraftName: Dispatch<React.SetStateAction<any>>;
  draftData: {};
  setSelectedWatchlistId: Dispatch<React.SetStateAction<any>>;
  brokerCode: any;
  setBrokerCode: Dispatch<React.SetStateAction<any>>;
  setToggleOpt?: Dispatch<SetStateAction<boolean>>;
  userId: any;
}

const CommonLayout: React.FC<CommonLayoutProps> = ({
  children,
  show,
  showCreateWatchlist,
  setShow,
  setShowCreateWatchlist,
  selectedWatchlistId,
  symbols,
  apiKey,
  fnoIdentifiers,
  setEntryPriceData,
  setCheckedOptionData,
  setExpiryPayload,
  setDraftName,
  draftData,
  setSelectedWatchlistId,
  brokerCode,
  setBrokerCode,
  setToggleOpt,
  userId,
}) => {
  const { isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const router: any = useRouter();

  const showDraftNamePopup = useSelector(
    (state: RootState) => state.analyzer.setShowDraftNamePopUp
  );
  const showListAllSandboxes = useSelector(
    (state: RootState) => state.analyzer.setListAllSandbox
  );
  const showPlaceOrder = useSelector(
    (state: RootState) => state.placeOrder.isVisible
  );
  const stockData = useSelector(
    (state: RootState) => state.placeOrder.stockData
  );
  const PlaceOrderInitiated = useSelector(
    (state: RootState) => state.Position.orderPlaced
  );
  const isOpen = useSelector((state: RootState) => state.common.showTVpopup);
  const initiateOrderToaster: any = useSelector(
    (state: RootState) => state.common.initiateOrderToast
  );
  const currentBrokerClientCode = useSelector(
    (state: RootState) => state.Position.ClientCode
  );
  const openOISettings = useSelector(
    (state: RootState) => state.common.openOiSettings
  );
  const screenerOpen = useSelector(
    (state: RootState) => state.common.ScreenerOpen
  );
  const stockInfoOpen: any = useSelector(
    (state: RootState) => state.common.StockInfoOpen
  );
  const OpenNewsModal: any = useSelector(
    (state: RootState) => state.common.OpenSymbolNewsPopup
  );
  const symbolNewsData = useSelector(
    (state: RootState) => state.common.SymbolNewsData
  );
  const toasterIdentifiers = useSelector(
    (state: RootState) => state.common.toasterIdentifiers
  );

  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );

  const [handleInstallClick, setHandleInstallClick] = useState<
    (() => void) | null
  >(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showWarningOiAlert, setShowWarningOiAlert] = useState(false);
  const selectedPositionType = useSelector(
    (state: RootState) => state.SimulationDemo.positionType
  );
  const selectedHoldingsType = useSelector(
    (state: RootState) => state.SimulationDemo.holdingsType
  );
  const Simulatedholdings: any = useSimulatedHoldings(
    webSocketDataRead,
    selectedHoldingsType
  );
  const currentBrokerName = useSelector(
    (state: RootState) => state.Position.BrokerName
  );
  const StrategiesPnl = useSelector(
    (state: RootState) => state.SimulationDemo.strategiesPnlDemo
  );
  const Simulatedpositions: any = useSimulatedPositions(
    StrategiesPnl,
    webSocketDataRead,
    currentBrokerName,
    selectedPositionType
  );
  const userEmail = useSelector((state: RootState) => state.common.userInfo);
  const isPrivilegedUser = config.userEmail.includes(userEmail?.email);
  const [allIndicesData, setAllindicesData] = useState<any[]>([]);
  const hasFetchedRef = useRef(false);
  const RefreshStrategiesPnl = useSelector(
    (state: RootState) => state.SimulationDemo.refreshStrategiesPnl
  );
  const isFetchingRef = useRef(false);
  const fetchData = () => {
    const fetchApi = new UserBrokerRouterApi(baseConfig());
    if (brokerCode) {
      fetchApi
        .getAllDataV1UsersMeBrokersBrokerCodeGetAllDataGet(brokerCode)
        .then((response: any) => {
          // if (response && response.status == 204) {
          //   router.push("/live/brokers");
          //   toast("Broker doesn't Exist!");
          // }

          dispatch(setSettingsData({ settingsData: response?.data?.profile }));
          dispatch(setFundsData({ fundsData: response?.data?.funds }));
          dispatch(setHoldingsData({ holdingsData: response?.data?.holdings }));
          dispatch(
            setPositions({
              positions: response?.data?.positions?.positions,
              positionPnl: response?.data?.positions?.total_pnl,
              positionpnlpercent: response?.data?.positions?.total_pnl_percent,
            })
          );
          dispatch(
            setLastUpdatedPositions({
              data: response?.data?.positions,
              time: Date.now(),
            })
          );
          dispatch(
            setLastUpdatedHoldings({
              data: response?.data?.holdings,
              time: Date.now(),
            })
          );
          const Holdings = response?.data?.holdings?.holdings;
          const Positions = response?.data?.positions?.positions;
          const combinedData = [...Holdings, ...Positions];
          combinedData?.forEach((item: any) => {
            // Dispatch updateSymbolData action with LTP and other details for websocket Live data

            // Dispatch addSymbol action with the symbol and token
            dispatch(
              addSymbol({
                symbol: item?.identifier,
                // token: item?.token,
              })
            );
            dispatch(
              updateSymbolPnl({
                symbol: item?.identifier,
                pnl: item?.pnl || item?.profit_and_loss,
              })
            );
          });
        })

        .catch((error) => {
          if (error?.response && error?.response.status == 401) {
            autoLogoutTokenRemove(router);
          }
          if (error?.response && error?.response.status == 400) {
            router.push(config.brokersListUrl);
            toast("Broker doesn't Exist!");
          }
          if (error?.response && error?.response?.status == 456) {
            brokerLogoutTokenRemove(router);
          }
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, [brokerCode]);

  //To update positions when Order executed and completed
  const updPositions = () => {
    const fetchApi = new UserBrokerRouterApi(baseConfig());
    if (brokerCode) {
      fetchApi
        .fetchMyBrokerPositionsV1UsersMeBrokersBrokerCodePositionsGet(
          brokerCode
        )
        .then((response: any) => {
          dispatch(
            setPositions({
              positions: response?.data?.positions,
              positionPnl: response?.data?.total_pnl,
              positionpnlpercent: response?.data?.total_pnl_percent,
            })
          );
          dispatch(
            setLastUpdatedPositions({
              data: response?.data?.positions,
              time: Date.now(),
            })
          );
          const Positions = response?.data?.positions;

          Positions?.forEach((item: any) => {
            // Dispatch addSymbol action with the symbol and token
            dispatch(
              addSymbol({
                symbol: item?.identifier,
                // token: item?.token,
              })
            );
            dispatch(
              updateSymbolPnl({
                symbol: item?.identifier,
                pnl: item?.pnl,
              })
            );
          });
          dispatch(setOrderPlaced(false));
        })

        .catch((error) => {
          if (error?.response && error?.response.status == 401) {
            autoLogoutTokenRemove(router);
          }
          if (error?.response && error?.response?.status == 456) {
            brokerLogoutTokenRemove(router);
          }
        });
    }
  };
  useEffect(() => {
    if (PlaceOrderInitiated) {
      const timer = setTimeout(() => {
        tvWidget.onChartReady(() => {
          const chart = tvWidget?.activeChart?.();
          const symbolInfo = tvWidget?.activeChart()?.symbolExt();

          if (!chart) return;
          const symbol = symbolInfo?.ticker;
          if (toasterIdentifiers.includes(symbol)) {
            cleanupExitLine(chart);
          }
        });
        updPositions();
      }, 1000); // 1 sec

      return () => clearTimeout(timer); // Cleanup in case the component unmounts or `PlaceOrderInitiated` changes
    }
  }, [PlaceOrderInitiated]);

  useEffect(() => {
    const payload: any = initiateOrderToaster?.payload;

    if (
      payload &&
      Object.entries(payload).length > 0 &&
      currentBrokerClientCode &&
      currentBrokerClientCode === payload?.client_code
    ) {
      showCustomToast(payload?.title, payload?.message, payload?.details);
      if (payload?.title?.toUpperCase() === "COMPLETED") {
        dispatch(setOrderPlaced(true)); //To track and Trigger positions API when Order is completed
      }
      dispatch(setInitiateOrderToast({}));
    }
  }, [initiateOrderToaster]);

  useEffect(() => {
    if (openOISettings && openOISettings.length > 0) {
      setShowModal(true);
    } else setShowModal(false);
  }, [openOISettings]);

  useEffect(() => {
    const path = window.location.pathname;
    if (
      symbolNewsData != undefined &&
      symbolNewsData != null &&
      path === `${config.brokersListUrl}/${brokerCode}/psv`
    ) {
      setGlobalSymbolNewsData(symbolNewsData);
    }
  }, [symbolNewsData]);

  useEffect(() => {
    if (!brokerCode) return;
    const loadIndices = async () => {
      const allIndicesDetails = await getAllIndicesWithExpiryDetails(
        brokerCode,
        dispatch
      ); //This is for Nima AI displaying strategy chart
      setAllindicesData(allIndicesDetails);
    };
    loadIndices();
  }, [brokerCode]);

  useEffect(() => {
    if (!RefreshStrategiesPnl) return;
    if (StrategiesPnl != null) return;
    if (StrategiesPnl && Object.keys(StrategiesPnl)?.length > 0) return;
    hasFetchedRef.current = false;
  }, [RefreshStrategiesPnl]);

  useEffect(() => {
    if (!allIndicesData?.length) return;

    const symbol = config.NimaFnoSymbol;
    const indexData = allIndicesData.find((i) => i.index_name === symbol);
    if (!indexData) return;

    const price = webSocketDataRead?.[indexData?.identifier];
    if (!price) return;

    if (hasFetchedRef.current) return;
    if (isFetchingRef.current) return;

    hasFetchedRef.current = true;
    isFetchingRef.current = true;

    const lotSize = indexData?.lot_size;
    const expiry = indexData?.expiries?.[0];
    if (isPrivilegedUser) {
      fetchStrategiesPnlApi(
        brokerCode,
        symbol,
        price,
        lotSize,
        expiry,
        dispatch,
        router
      ).finally(() => {
        isFetchingRef.current = false;
        dispatch(setStrategiesPnlRefresh(false)); // reset refresh
      });
    }
  }, [allIndicesData, webSocketDataRead]);

  //Simulation of Positions with its type
  useEffect(() => {
    if (selectedPositionType && selectedPositionType?.length > 0) {
      dispatch(
        setPositions({
          positions: Simulatedpositions?.positions,
          positionPnl: Simulatedpositions?.total_pnl,
          positionpnlpercent: Simulatedpositions?.total_pnl_percent,
        })
      );
      const Positions = Simulatedpositions?.positions;
      Positions?.forEach((item: any) => {
        dispatch(
          addSymbol({
            symbol: item?.identifier,
            // token: item?.token,
          })
        );
        dispatch(
          updateSymbolPnl({
            symbol: item?.identifier,
            pnl: item?.pnl || item?.profit_and_loss,
          })
        );
      });
    }
  }, [selectedPositionType]);

  //Simulation of Holdings with its type
  useEffect(() => {
    if (selectedHoldingsType && selectedHoldingsType?.length > 0) {
      dispatch(setHoldingsData({ holdingsData: Simulatedholdings }));
      const Holdings = Simulatedholdings?.holdings;
      Holdings?.forEach((item: any) => {
        dispatch(
          addSymbol({
            symbol: item?.identifier,
            // token: item?.token,
          })
        );
        dispatch(
          updateSymbolPnl({
            symbol: item?.identifier,
            pnl: item?.pnl || item?.profit_and_loss,
          })
        );
      });
    }
  }, [selectedHoldingsType]);

  return isAuthenticated ? (
    <div className=" relative flex h-screen w-screen flex-col overflow-hidden max-xl:fixed max-xl:h-[100%]  max-sm:no-highlight  max-sm:no-active">
      {showPlaceOrder && (
        <PlaceOrder
          brokerCode={brokerCode}
          stocks={stockData}
          // Pass necessary props for PlaceOrder
        />
      )}
      {isOpen && <TradingViewPopup brokerCode={brokerCode} userId={userId} />}
      {OpenNewsModal && <SymbolNews />}
      <div className="fixed left-1/2 top-0 z-[100002] flex -translate-x-1/2 transform  items-center justify-center  max-sm:w-full sm:min-w-[40%] xl:min-w-[56%] 2xl:min-w-[40%]">
        <WarningBox showWarning={showWarning} setShowWarning={setShowWarning} />
      </div>

      <div className=" fixed left-1/2 top-0 z-[100006] flex -translate-x-1/2  transform items-center  justify-center max-sm:w-full sm:min-w-[60%] xl:min-w-[64%] 2xl:min-w-[55%]">
        <OiAlertBox
          showWarningOiAlert={showWarningOiAlert}
          setShowWarningOiAlert={setShowWarningOiAlert}
        />
      </div>

      <RiskDisclosureModal />

      <div className="flex h-[8%] w-full flex-row items-center justify-between bg-white bg-opacity-80 text-black shadow max-sm:h-[8%] md:max-xl:h-[8%]">
        <ChartHeader
          brokerCode={brokerCode}
          setBrokerCode={setBrokerCode}
          selectedWatchlistId={selectedWatchlistId}
          setEntryPriceData={setEntryPriceData}
          setCheckedOptionData={setCheckedOptionData}
          setExpiryPayload={setExpiryPayload}
          setHandleInstallClick={setHandleInstallClick}
        />
      </div>

      {show && (
        <div className="absolute z-[9998] flex h-full w-full items-center justify-center bg-white bg-opacity-50">
          <div className="bg-white bg-opacity-80 text-black shadow-lg max-sm:h-[24rem] max-sm:w-[20rem] max-sm:rounded-2xl sm:max-md:h-[30rem] sm:max-md:w-[24rem] md:max-lg:h-[28rem] md:max-lg:w-[28rem] lg:max-xl:h-[30rem] lg:max-xl:w-[36rem] xl:max-2xl:h-[32rem] xl:max-2xl:w-[40rem] 2xl:h-[35rem] 2xl:w-[45rem]">
            <Addsymbol
              setShow={setShow}
              symbols={symbols}
              selectedWatchlistId={selectedWatchlistId}
              brokerCode={brokerCode}
            />
          </div>
        </div>
      )}

      {showCreateWatchlist && (
        <div className="absolute z-[10000] flex h-full w-full items-center justify-center bg-white bg-opacity-40">
          <CreateWatchlist
            setShowCreateWatchlist={setShowCreateWatchlist}
            setSelectedWatchlistId={setSelectedWatchlistId}
          />
        </div>
      )}
      {showDraftNamePopup == true && (
        <div className="absolute z-[10000] flex h-full w-full items-center justify-center bg-white bg-opacity-40 max-xl:z-[10002]">
          <DraftNamePopup
            setDraftName={setDraftName}
            setToggleOpt={setToggleOpt}
          />
        </div>
      )}
      {showListAllSandboxes == true && (
        <div className="absolute z-[10000] flex h-full w-full items-center justify-center bg-white bg-opacity-40 max-xl:z-[10002]">
          <ListAllSandboxNames draftData={draftData} />
        </div>
      )}
      {showModal && (
        <div className="absolute z-[10000] flex h-full w-full items-center justify-center bg-white bg-opacity-40 max-xl:z-[10002]">
          <OIProfileSettingsModal
            onClose={() => dispatch(setOpenOiSettings([]))}
            expiries={openOISettings}
          />
        </div>
      )}
      <div className="flex h-[calc(100vh-8%)] w-full items-center overflow-x-hidden overflow-y-hidden bg-white max-xl:flex-col-reverse xl:flex-row-reverse">
        <RightToolBar
          brokerCode={brokerCode}
          apiKey={apiKey}
          fnoIdentifiers={fnoIdentifiers}
          handleInstallClick={handleInstallClick}
        />
        <div className="relative flex h-full w-full max-w-full overflow-hidden">
          {children}

          {screenerOpen && (
            <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/40">
              <div className="h-full w-full bg-white shadow-xl">
                <TradingViewScreener />
              </div>
            </div>
          )}
          {stockInfoOpen && (
            <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/40">
              <div className="h-full w-full bg-white shadow-xl">
                <StockInfoSideDisplay
                  brokerCode={brokerCode}
                  scopeId={"popup"}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default EnforceAuth(CommonLayout);
