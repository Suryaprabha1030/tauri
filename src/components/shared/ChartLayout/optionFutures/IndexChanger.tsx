import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  getCheckedPositionData,
  getFutTargetltpData,
  getFutureData,
  getOptionData,
  getOptTargetltpData,
  optionChainPayload,
  setSelectedStrategy,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";

import {
  addCartSuccess,
  addSymbol,
  getIndexLotSize,
  indicesAlldata,
  setStock,
} from "@/lib/redux/slices/StrategySlice";
import { RootState } from "@/lib/redux/Store";
import { Dispatch, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import DisplayIndexChanger from "../displayIndexChanger/DisplayIndexChanger";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";
import { ChartToggleButtonType, fetchOiStoredData } from "@/lib/util/oi/oiUtil";
import config from "@/lib/config";
import {
  getCachedApiData,
  getLastApiCallTime,
  getQuery,
  getSpotPriceRoundOff,
  setDefaultDD,
  setIndexData,
  setSelectedIndexName,
} from "@/lib/redux/slices/OptionChainSlice";
import {
  getDaysToExpiry,
  getInputValue,
  getMaxPainStrikeValue,
  getMinExpiryDate,
  getMultiOiLoad,
  getPayOffChartPayLoad,
  getStrangleOiLoad,
} from "@/lib/redux/slices/StrategyChartSlice";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import {
  setSymbolIdentifier,
  setChartPanel,
  setChartIconClicked,
} from "@/lib/redux/slices/ChartsSlice";

interface IndexChangerProps {
  brokerCode: number | null;
  setExpiryPayload: Dispatch<React.SetStateAction<any>>;
  setActive: Dispatch<React.SetStateAction<any>>;
  avoidRepeatCall: boolean;
}

const IndexChanger: React.FC<IndexChangerProps> = ({
  brokerCode,
  setExpiryPayload,
  setActive,
  avoidRepeatCall,
}) => {
  const stocks = useSelector((state: RootState) => state.strategy.stock);
  const [defaultQuery, setDefaultQuery] = useState("NIFTY");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [showDropDown, setShowDropDown] = useState(false);
  const screenWidth: number = window.innerWidth;
  const dispatch = useDispatch();
  const indexObjData: any = useSelector(
    (state: RootState) => state.strategy.indexObj
  );
  const router = useRouter();
  const query = useSelector((state: RootState) => state.optionChain.query);
  const tempValue = useSelector(
    (state: RootState) => state.optionChain.tempValue
  );
  const defaultDD = useSelector(
    (state: RootState) => state.optionChain.defaultDD
  );
  const selectedIndexName = useSelector(
    (state: RootState) => state.optionChain.selectedIndexName
  );
  const indexData = useSelector(
    (state: RootState) => state.optionChain.indexData
  );

  const defaultDDRef = useRef(defaultDD);

  // keep ref updated whenever indexData changes
  useEffect(() => {
    defaultDDRef.current = defaultDD;
  }, [defaultDD]);

  useEffect(() => {
    const fetchAndSetData = async () => {
      if (stocks && stocks?.index_name?.length > 0) {
        dispatch(setSelectedIndexName(stocks.index_name));
        dispatch(getQuery(stocks.index_name));
        setDefaultQuery("");

        setShowDropDown(false);
      }
    };

    fetchAndSetData();
  }, [stocks]);

  useEffect(() => {
    const fetchData = () => {
      const apiInstance = new UserBrokerRouterApi(baseConfig());
      Promise.all([
        apiInstance.getAllIndicesV1UsersMeBrokersBrokerCodeGetAllIndicesPost(
          brokerCode,
          "NSE",
          "index_options"
        ),
        apiInstance.getAllIndicesV1UsersMeBrokersBrokerCodeGetAllIndicesPost(
          brokerCode,
          "BSE",
          "index_options"
        ),
      ])
        .then(([indicesResponse, BSEResponse]) => {
          const consolidatedData: any = [
            ...indicesResponse?.data,
            // ...stocksResponse.data,
            ...BSEResponse?.data,
          ];

          consolidatedData?.forEach((opt) => {
            dispatch(
              addSymbol({
                symbol: opt?.identifier, // add identifier as symbol
                // token: opt.token,
              })
            );
          });
          const filterData = () => {
            // const queryLower = "NIFTY".trim().toLowerCase();

            return consolidatedData.filter(
              (item: any) =>
                config.supportIndices.includes(item?.index_name) &&
                Object.values(item).some(
                  (value) => typeof value === "string" && value.toLowerCase()
                )
            );
          };

          dispatch(setDefaultDD(filterData()));

          if (stocks && stocks.index_name.length == 0) {
            dispatch(setSelectedIndexName(defaultQuery));
          }
          dispatch(setIndexData(consolidatedData));
          dispatch(getIndexLotSize({ indicesLotsize: consolidatedData }));
        })
        .catch((error: any) => {
          if (error?.response && error?.response?.status == 401) {
            autoLogoutTokenRemove(router);
          }
          if (error?.response && error?.response?.status == 456) {
            brokerLogoutTokenRemove(router);
          }
        });
    };

    if (brokerCode) {
      if (avoidRepeatCall) {
        fetchData();

        fetchOiStoredData(dispatch, router);
      }
    }
  }, [brokerCode]);

  const handleSelectIndex = async (item: any, e: any) => {
    if (query == item?.index_name) {
      setShowDropDown(false);
      return;
    }
    if (screenWidth >= 1200) dispatch(setChartPanel(true));
    dispatch(setSymbolIdentifier(item.identifier));
    dispatch(setChartIconClicked(true));
    dispatch(getCachedApiData([]));
    dispatch(getLastApiCallTime(0));
    dispatch(setSelectedStrategy({ setselectedStrategy: null }));
    dispatch(getMinExpiryDate(null));
    dispatch(
      addCartSuccess({
        items: {
          exchange: "",
          index_name: "",
          spot_price: null,
          expiryDate: "",
        },
      })
    );
    dispatch(
      setStock({
        stock: {
          exchange: "",
          index_name: "",
          spot_price: "",
        },
      })
    );
    dispatch(
      indicesAlldata({
        symbol: "",
        tokenLtpData: "",
        expiryDate: [],
        addonData: "",
        futureData: [],
        spotPrice: null,
        indexData: "",
        lotSize: null,
      })
    );
    dispatch(getSpotPriceRoundOff(null));
    dispatch(getQuery(item?.index_name));
    setExpiryPayload(null);
    dispatch(getPayOffChartPayLoad({}));
    dispatch(getStrangleOiLoad({}));
    dispatch(getMultiOiLoad([]));
    dispatch(getInputValue(null));
    dispatch(getDaysToExpiry(null));

    dispatch(setSelectedIndexName(item.index_name));
    dispatch(showStrategyTable(true));
    dispatch(showPnlTable(false));
    dispatch(showPositionTable(false));
    dispatch(showDraftPositions(false));
    const updated = defaultDDRef.current.includes(item)
      ? defaultDD // don’t add duplicate
      : [...defaultDD.slice(0, 4), item]; // add new item, keep max 5

    dispatch(setDefaultDD(updated));

    setTimeout(() => {
      setShowDropDown(false);
    }, 50);

    dispatch(getOptionData({ optionData: {} }));
    dispatch(getFutureData({ futureData: {} }));
    dispatch(getOptTargetltpData({ OptTargetLtpData: {} }));
    dispatch(getFutTargetltpData({ FutTargetLtpData: {} }));
    setActive(ChartToggleButtonType.Chart);
    dispatch(
      getCheckedPositionData({
        PositionData: {}, // Pass empty object to clear the state
      })
    );
    dispatch(
      optionChainPayload({
        optionChainPayloadData: { ClickedRow: {}, response: {} },
      })
    );
    dispatch(getMaxPainStrikeValue(null));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!document.querySelector(".dropdown-container")?.contains(target)) {
        setShowDropDown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <DisplayIndexChanger
      setShowDropDown={setShowDropDown}
      ObjData={indexObjData}
      showDropDown={showDropDown}
      filteredData={defaultDD}
      selectedIndexName={selectedIndexName}
      handleSelectIndex={handleSelectIndex}
      dropDownClassName={`  border rounded-lg`}
    />
  );
};

export default IndexChanger;
