import React, { useEffect, useState, useRef, useMemo } from "react";
import LoadingComponent from "../../../loading/Loading";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { useDispatch } from "react-redux";
import { getIndexName } from "@/lib/redux/slices/StrategySlice";
import { useNavigate } from "react-router-dom";
import { ShowStrategies } from "@/lib/redux/slices/ChartsSlice";
import StrategiesAnalyzerHeader from "./StrategyAnalyzerHeader";
import StrategyAnalyzerTableHeader from "./StrategiesAnalyzerTableHeader";
import StrategyTableBody from "./StrategyAnalyzerTableBody/StrategyTableBody";
import {
  AllStrategyUtil,
  fetchLiveExpiry,
  fetchStrategiesPnl,
  fetchSymbolData,
  filterStrategiesUtil,
  strategyApiDataDetails,
  strategyDirection,
} from "@/lib/util/StrategyAnalyzerUtil/StrategyAnalyerUtil";
import config from "@/lib/config";
import { setOiChartCall } from "@/lib/redux/slices/PayoffChartSlice";
import { OptionsStrategyBuilderApi, UserApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { setPayoffStrategyName } from "@/lib/redux/slices/screenerSlice";

interface StrategiesProps {
  brokerCode: number | null;
  fnoIdentifiers: any;
  apiKey: string | null;

  leftWidth: any;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
}

const StrategiesAnalyzer: React.FC<StrategiesProps> = ({
  brokerCode,
  fnoIdentifiers,
  apiKey,

  leftWidth,
  setLeftWidth,
}) => {
  type SymbolType = "Bullish" | "Neutral" | "Bearish" | null;

  const [refresh, setRefresh] = useState(false);

  const indexname = useSelector((state: RootState) => state.strategy.indexName);
  const expiryDate = useSelector(
    (state: RootState) => state.strategy.expiryDate,
  );
  const sportpricevalue = useSelector(
    (state: RootState) => state.strategy.spotPrice,
  );
  const item = useSelector((state: RootState) => state.strategy.items);
  const [response, setResponse] = useState();
  const [lotsize, setLotsize] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState("NIFTY");
  const [showStrategyIcon, setshowStrategyIcon] = useState(false);

  const [spotvalue, setSpotvalue] = useState<any>();

  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const indices = useSelector(
    (state: RootState) => state.strategy.indicesLotsize,
  );
  const indicesLotSize = useMemo(() => {
    return indices?.filter((item: any) =>
      config.supportIndices.includes(item?.index_name),
    );
  }, [indices]);
  const [showData, setShowData] = useState(false);
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "initial"
  >("initial");
  const router = useNavigate();
  const indexRef = useRef<HTMLSelectElement>(null);
  const dispatch = useDispatch();
  const [liveExpiryList, setLiveExpiryList] = useState<string[]>([]);
  const expiryDateRef = useRef<HTMLSelectElement>(null);
  const [expiry, setExpiry] = useState("");
  // const [buttonId, setButtonId] = useState("");
  const [smartApi, setSmartApi] = useState(false);
  const [sortedresponse, setSortedResponse] = useState({});
  // const [Stocks, setStocks] = useState([]);
  const [strategyLots, setStrategyLots] = useState<{ [key: string]: number }>(
    {},
  );
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [hedgeddata, sethedgedData] = useState(true);
  const [activeIndicatorFilter, setActiveIndicatorFilter] =
    useState<SymbolType>(null);
  const [filteredStrategies, setFilteredStrategies] = useState({});

  const showStrategiesPopup = useSelector(
    (state: RootState) => state.charts.setShowStrategiesPopup,
  );
  const path = window.location.pathname;
  const fetchTriggered = useRef(false);

  const [allStrategyData, setAllStrategyData] = useState([]);
  const positionDatas = useSelector(
    (state: RootState) => state.analyzer.PositionDataList,
  );
  const futureDatas = useSelector(
    (state: RootState) => state.analyzer.futureDataList,
  );
  const optionDatas = useSelector(
    (state: RootState) => state.analyzer.optionDataList,
  );

  useEffect(() => {
    if (path === `${config.brokersListUrl}/${brokerCode}/psv`) {
      const identifiers = fnoIdentifiers.map((item: any) => item.identifier);
      fetchSymbolData(identifiers, brokerCode, dispatch, router);
    } else if (path === `${config.brokersListUrl}/${brokerCode}/oi`) {
      const identifiers = indicesLotSize.map((item: any) => item.identifier);
      fetchSymbolData(identifiers, brokerCode, dispatch, router);
    }
  }, [brokerCode]);

  useEffect(() => {
    if (path === `${config.brokersListUrl}/${brokerCode}/psb`) {
      const item: any = indicesLotSize.find(
        (index: any) => index.index_name === indexname,
      );
      setLotsize(item?.lot_size);
    }
  }, [brokerCode, indexname, sportpricevalue, indicesLotSize]);

  useEffect(() => {
    if (path === `${config.brokersListUrl}/${brokerCode}/psv`) {
      {
        fnoIdentifiers.map(
          (item: any) =>
            item.index_name == indexname &&
            (setSpotvalue(webSocketDataRead[item.identifier]),
            setLotsize(item.lot_size)),
        );
      }
    } else if (path === `${config.brokersListUrl}/${brokerCode}/oi`) {
      {
        indicesLotSize.map(
          (item: any) =>
            item.index_name == indexname &&
            (setSpotvalue(webSocketDataRead[item.identifier]),
            setLotsize(item.lot_size)),
        );
      }
    }
  }, [indexname, selectedIndex, fnoIdentifiers]);

  useEffect(() => {
    if (
      path === `${config.brokersListUrl}/${brokerCode}/psb` &&
      brokerCode &&
      indexname &&
      item.spot_price != null &&
      item.index_name == indexname &&
      lotsize != null &&
      expiryDate
    ) {
      if (!fetchTriggered.current) {
        // Only call fetch when all dependencies are ready for the first time
        fetchTriggered.current = true;
        setStatus("loading");
        fetchStrategiesPnl(
          brokerCode,
          indexname,
          item.spot_price,
          lotsize,
          expiryDate,
          setResponse,
          setShowData,
          setStatus,
          dispatch,
          router,
          setExpiry,
        );
      }
    }
  }, [
    lotsize,
    expiryDate,
    brokerCode,
    indexname,
    item?.spot_price,
    path,
    refresh,
  ]);

  // Reset the fetch trigger when critical dependencies change
  useEffect(() => {
    fetchTriggered.current = false; // Allow fetching again when brokerCode or indexname changes
  }, [brokerCode, indexname, expiryDate, path, refresh]);

  useEffect(() => {
    if (
      path !== `${config.brokersListUrl}/${brokerCode}/psb` &&
      brokerCode &&
      indexname &&
      spotvalue &&
      lotsize &&
      expiry
    ) {
      setStatus("loading");
      fetchStrategiesPnl(
        brokerCode,
        indexname,
        spotvalue,
        lotsize,
        expiry,
        setResponse,
        setShowData,
        setStatus,
        dispatch,
        router,
      );
    }
  }, [lotsize, brokerCode, refresh, expiry]);

  useEffect(() => {
    if (
      showStrategiesPopup == true &&
      path == `${config.brokersListUrl}/${brokerCode}/psb` &&
      brokerCode &&
      indexname &&
      item.spot_price != null &&
      lotsize != null &&
      expiryDate
    ) {
      dispatch(ShowStrategies(true));
    }
  }, [showStrategiesPopup, indexname, item, lotsize, expiryDate]);

  const handlerefresh = () => {
    setRefresh(!refresh);
    fetchTriggered.current = false;
    dispatch(setPayoffStrategyName(null));
  };

  useEffect(() => {
    if (path === `${config.brokersListUrl}/${brokerCode}/psb`) {
      setshowStrategyIcon(false);
    } else {
      setshowStrategyIcon(true);
      if (path != `${config.brokersListUrl}/${brokerCode}/psb`) {
        dispatch(getIndexName({ indexName: "NIFTY", expiryDate: "" }));
      }
    }
  }, [path]);

  useEffect(() => {
    if (path != `${config.brokersListUrl}/${brokerCode}/psb`) {
      fetchLiveExpiry(
        selectedIndex,
        brokerCode,
        expiryDateRef,
        setLiveExpiryList,
        setExpiry,
        router,
      );
      setExpiry("");
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (smartApi == true) {
      setSmartApi(false);
    }
  }, [smartApi]);

  useEffect(() => {
    if (response != null) {
      strategyDirection(response, setSortedResponse);
    }
  }, [response]);

  useEffect(() => {
    const filtered = filterStrategiesUtil(
      activeIndicatorFilter,
      sortedresponse,
      hedgeddata,
    );
    setFilteredStrategies(filtered);
  }, [activeIndicatorFilter, sortedresponse, hedgeddata]);

  useEffect(() => {
    AllStrategyUtil(setAllStrategyData, router);
  }, []);

  const strategyApiData = (strategy: string) => {
    dispatch(getIndexName({ indexName: indexname, expiryDate: expiry }));
    if (Object.keys(optionDatas)?.length == 0) {
      dispatch(setOiChartCall(true));
    }
    strategyApiDataDetails(
      strategy,
      brokerCode,
      path,
      strategyLots,
      item,
      dispatch,
      router,
      positionDatas,
      futureDatas,
      allStrategyData,
    );
  };

  return (
    <>
      {status == "initial" && <LoadingComponent />}
      <StrategiesAnalyzerHeader
        showStrategyIcon={showStrategyIcon}
        selectedIndex={selectedIndex}
        indexRef={indexRef}
        setSelectedIndex={setSelectedIndex}
        fnoIdentifiers={fnoIdentifiers}
        indicesLotSize={indicesLotSize}
        indexname={indexname}
        expiry={expiry}
        expiryDateRef={expiryDateRef}
        setExpiry={setExpiry}
        liveExpiryList={liveExpiryList}
        status={status}
        response={response}
        showData={showData}
        sethedgedData={sethedgedData}
        hedgeddata={hedgeddata}
        activeIndicatorFilter={activeIndicatorFilter}
        setActiveIndicatorFilter={setActiveIndicatorFilter}
        handlerefresh={handlerefresh}
        leftWidth={leftWidth}
        setLeftWidth={setLeftWidth}
      />

      <div
        className={`relative h-[90%] max-xl:w-[98%] max-md:mx-1 xl:w-[96%] 2xl:mx-5 ${leftWidth >= 80 ? "xl:max-2xl:mx-5" : "xl:max-2xl:mx-3 "}`}
      >
        {status == "loading" && <LoadingComponent />}
        {status == "success" && response ? (
          <>
            {showData == true && (
              <div className="h-[90%] overflow-x-hidden overflow-y-scroll max-2xl:scrollbar-none max-xl:pb-2 md:max-lg:h-[78%] xl:max-2xl:h-[85%] 2xl:scrollbar-thin">
                <table className="w-full md:max-xl:mx-[2%] md:max-xl:w-[98%] ">
                  <StrategyAnalyzerTableHeader leftWidth={leftWidth} />
                  <StrategyTableBody
                    response={response}
                    filteredStrategies={filteredStrategies}
                    setSelectedStrategy={setSelectedStrategy}
                    strategyApiData={strategyApiData}
                    setStrategyLots={setStrategyLots}
                    strategyLots={strategyLots}
                    expandedRow={expandedRow}
                    setExpandedRow={setExpandedRow}
                    expiry={expiry}
                    brokerCode={brokerCode}
                    allStrategyData={allStrategyData}
                    leftWidth={leftWidth}
                  />
                </table>
              </div>
            )}
          </>
        ) : (
          <>
            {status == "error" && (
              <div className=" flex-center flex h-[500px] w-full items-center justify-center">
                No startegy Available
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default StrategiesAnalyzer;
