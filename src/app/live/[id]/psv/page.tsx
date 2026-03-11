"use client";
import { getBrokerName } from "@/components/helpers";
import CommonLayOut from "@/components/shared/ChartLayout/CommonLayOut";
import Sidetab from "@/components/shared/ChartLayout/sidetab/Sidetab";
import StockInfo from "@/components/StockInfo/Stockinfo";
import TradingViewScreener from "@/components/tradingView/Screener";
import TradingViewChart from "@/components/tradingView/TradingViewChart";
import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { setShowTvResolution } from "@/lib/redux/slices/ChartsSlice";
import { RootState } from "@/lib/redux/Store";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { validateBrokerCode } from "@/lib/util/brokerIdCheck/brokersExist";
import { fetchMarketDays } from "@/lib/util/generalUtil";
import {
  tvWidgetId,
  ViewType,
} from "@/lib/util/toggleButtonName/toggleButtonNames";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Charts = () => {
  const [symbols, setSymbols] = useState<any[]>([]);

  const [show, setShow] = useState<boolean>(false);
  const [showCreateWatchlist, setShowCreateWatchlist] =
    useState<boolean>(false);
  const [selectedWatchlistId, setSelectedWatchlistId] = useState<number | null>(
    null
  );
  const toggleState: any = useSelector(
    (state: RootState) => state.common.CandleAreaToggle
  );
  const netpercentage = useSelector(
    (state: RootState) => state.strategy.netChangepercent
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  const resolution = useSelector(
    (state: RootState) => state.charts.setTvResolution
  );
  const isMarketHoliday = useSelector(
    (state: RootState) => state.MarketBasis.isMarketHoliday
  );

  const [parentVisible, setParentVisible] = useState<boolean>(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [brokerCode, setBrokerCode] = useState<number | null>(null);
  const [fnoIdentifiers, setFnoIdentifiers] = useState<any[]>([]);
  const [clickedSymbolData, setClickedSymbolData] = useState<any>(null);
  const [clickTvChart, setClickTvChart] = useState(false);

  const router = useRouter();
  const code: any = useParams();
  const [isValid, setIsValid] = useState(false);
  const brokerData: any = sessionStorage.getItem("ExistbrokerCode");
  const [userId, setUserId] = useState("");
  const [showTechnicals, setShowTechnicals] = useState(false);
  const [showNewsPivots, setShowNewsPivots] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    validateBrokerCode(code, brokerData, router, setBrokerCode, setIsValid);
  }, [code, router]);

  const fetchData = () => {
    const fetchApi = new UserBrokerRouterApi(baseConfig());
    fetchApi
      .fetchMyBrokerV1UsersMeBrokersBrokerCodeGet(brokerCode)
      .then((response) => {
        const brokername = response?.data?.broker_meta?.name;
        sessionStorage.setItem("brokerName", brokername);
        setUserId(response?.data?.user_broker_mapping.user_id.toString());
        const apiKey = response?.data?.broker_meta?.api_key;

        setApiKey(apiKey);
      })
      .catch((err: any) => {
        if (err?.response && err?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (err?.response && err?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  };

  useEffect(() => {
    if (brokerCode != null) {
      fetchData();
    }
  }, [brokerCode]);

  //  If isMarketHoliday is true, do not get data from this API; otherwise, make the API call.
  useEffect(() => {
    if (isMarketHoliday == null) {
      fetchMarketDays(dispatch, router);
    }
  }, []);

  if (!isValid) {
    return null; // Prevent further rendering if invalid
  }
  const RenderContent = () => {
    switch (toggleState) {
      case ViewType.CANDLESTICK:
        return (
          <TradingViewChart
            brokerCode={brokerCode}
            userId={userId}
            chartId={tvWidgetId.MAINCHART}
          />
        );
      case ViewType.SCREENER:
        return <TradingViewScreener />;
      case ViewType.STOCK_INFO:
        return (
          <StockInfo
            symbol={clickedSymbolData?.identifier}
            symbolName={
              clickedSymbolData?.display_symbol_name ||
              clickedSymbolData?.symbol
            }
            brokerCode={brokerCode}
            scopeId={"main"}
            clickedSymbolData={clickedSymbolData}
            showTechnicals={showTechnicals}
            setShowTechnicals={setShowTechnicals}
            showNewsPivots={showNewsPivots}
            setShowNewsPivots={setShowNewsPivots}
            webSocketDataRead={webSocketDataRead}
            netpercentage={netpercentage}
          />
        );
      default:
        return null;
    }
  };

  return (
    <CommonLayOut
      show={show}
      showCreateWatchlist={showCreateWatchlist}
      setShow={setShow}
      setShowCreateWatchlist={setShowCreateWatchlist}
      selectedWatchlistId={selectedWatchlistId}
      symbols={symbols}
      apiKey={apiKey}
      fnoIdentifiers={fnoIdentifiers}
      setFnoIdentifiers={setFnoIdentifiers}
      clickedSymbolData={clickedSymbolData}
      setSelectedWatchlistId={setSelectedWatchlistId}
      brokerCode={brokerCode}
      setBrokerCode={setBrokerCode}
      userId={userId}
    >
      <div className=" flex h-[calc(100dvh-(8%))]  w-full bg-white max-xl:flex-col max-xl:overflow-hidden   max-xl:scrollbar-none xl:flex-row">
        <div
          className={` xl:h-full xl:w-full ${
            clickTvChart
              ? "max-xl:hidden"
              : "  flex h-[calc(100dvh-(8%+9.8%))] max-xl:w-[100%] max-md:overflow-y-auto max-md:scrollbar-none max-sm:h-[calc(100dvh-(8%+11.6%))] sm:max-md:h-[calc(100dvh-(8%+13.7%))]  md:max-xl:h-[calc(100dvh-(8%+15.5%))]"
          }`}
        >
          {RenderContent()}
        </div>

        {/* {!isSidetabCollapsed && ( */}
        <Sidetab
          clickTvChart={clickTvChart}
          setClickTvChart={setClickTvChart}
          setShow={setShow}
          symbols={symbols}
          setSymbols={setSymbols}
          selectedWatchlistId={selectedWatchlistId}
          setSelectedWatchlistId={setSelectedWatchlistId}
          setShowCreateWatchlist={setShowCreateWatchlist}
          setParentVisible={setParentVisible}
          apiKey={apiKey}
          brokerCode={brokerCode}
          fnoIdentifiers={fnoIdentifiers}
          setFnoIdentifiers={setFnoIdentifiers}
          clickedSymbolData={clickedSymbolData}
          setClickedSymbolData={setClickedSymbolData}
          setShowTechnicals={setShowTechnicals}
          setShowNewsPivots={setShowNewsPivots}
        />
        {/* )} */}
      </div>
    </CommonLayOut>
  );
};

export default React.memo(Charts);
