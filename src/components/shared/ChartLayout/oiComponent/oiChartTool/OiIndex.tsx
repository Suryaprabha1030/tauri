import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { addSymbol, getIndexLotSize } from "@/lib/redux/slices/StrategySlice";
import { RootState } from "@/lib/redux/Store";
import { SetStateAction, Dispatch, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import DisplayIndexChanger from "../../displayIndexChanger/DisplayIndexChanger";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useNavigate } from "react-router-dom";
import { fetchOiStoredData } from "@/lib/util/oi/oiUtil";
import config from "@/lib/config";
import { getMaxPainStrikeValue } from "@/lib/redux/slices/StrategyChartSlice";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface IndexChangerProps {
  setQuery: Dispatch<SetStateAction<string>>;
  brokerCode: number | null;
  setOiLoad: Dispatch<SetStateAction<{}>>;
  setCheckedOIRows: Dispatch<SetStateAction<{}>>;
  query: string;
  setQueryIdentifier: Dispatch<SetStateAction<any>>;
  setCheckedOiradios: Dispatch<SetStateAction<any>>;
  setCheckedStrangleRows: Dispatch<SetStateAction<any>>;
  setCheckedCustomRows: Dispatch<SetStateAction<any>>;
  setStraddlePayload: Dispatch<SetStateAction<any>>;
  setOiChangeExpiry: Dispatch<SetStateAction<any>>;
  setStrikeRange: Dispatch<SetStateAction<any>>;
  setCombinedOiExpiry: Dispatch<SetStateAction<any>>;
  StyleForSmallScreen?: String;
  IconPadding?: any;
  setMarginPayload?: Dispatch<SetStateAction<[]>>;
  setManuallyMinMax?: Dispatch<SetStateAction<boolean>>;
  setSpinningAnimation?: Dispatch<SetStateAction<boolean>>;
  setCalculateMargin?: Dispatch<SetStateAction<boolean>>;
  setOiExpiry: Dispatch<SetStateAction<any>>;
  setTempValue: Dispatch<SetStateAction<any>>;
  tempValue: any;
  selectedIndexName: any;
  setSelectedIndexName: Dispatch<SetStateAction<any>>;
  dropDownClassName: any;
}

const OiIndex: React.FC<IndexChangerProps> = ({
  setQuery,
  brokerCode,
  setCheckedOIRows,
  setOiLoad,
  query,
  setQueryIdentifier,
  setCheckedOiradios,
  setCheckedStrangleRows,
  setCheckedCustomRows,
  setStraddlePayload,
  setOiChangeExpiry,
  setStrikeRange,
  setCombinedOiExpiry,
  StyleForSmallScreen,
  IconPadding,
  setMarginPayload,
  setManuallyMinMax,
  setCalculateMargin,
  setOiExpiry,
  tempValue,
  setTempValue,
  selectedIndexName,
  setSelectedIndexName,
  dropDownClassName,
}) => {
  const [indexData, setIndexData] = useState<any[]>([]);
  // const [defaultQuery, setDefaultQuery] = useState("NIFTY");
  // const [filteredData, setFilteredData] = useState<any[]>([]);
  const [showDropDown, setShowDropDown] = useState(false);

  const [defaultDD, setDefaultDD] = useState<any>([]);
  const oiIndexData: any = useSelector(
    (state: RootState) => state.OI.OiIndexData,
  );
  const dispatch = useDispatch();
  const router = useNavigate();
  useEffect(() => {
    const fetchData = () => {
      const apiInstance = new UserBrokerRouterApi(baseConfig());
      Promise.all([
        apiInstance.getAllIndicesV1UsersMeBrokersBrokerCodeGetAllIndicesPost(
          brokerCode,
          "NSE",
          "index_options",
        ),
        apiInstance.getAllIndicesV1UsersMeBrokersBrokerCodeGetAllIndicesPost(
          brokerCode,
          "BSE",
          "index_options",
        ),
      ])
        .then(([indicesResponse, BSEResponse]) => {
          const consolidatedData: any = [
            ...indicesResponse?.data,
            ...BSEResponse?.data,
          ];
          consolidatedData?.forEach((opt) => {
            dispatch(
              addSymbol({
                symbol: opt?.identifier, // add identifier as symbol
                // token: opt.token,
              }),
            );
          });
          const filterData = () => {
            // const queryLower = "NIFTY".trim().toLowerCase();
            return consolidatedData.filter(
              (item: any) =>
                config.supportIndices.includes(item?.index_name) &&
                Object.values(item).some(
                  (value) => typeof value === "string" && value.toLowerCase(),
                ),
            );
          };
          setDefaultDD(filterData);

          setIndexData(consolidatedData);
          dispatch(getIndexLotSize({ indicesLotsize: consolidatedData }));
        })
        .catch((error) => {
          if (error?.response && error?.response?.status == 401) {
            autoLogoutTokenRemove(router);
          }
          if (error?.response && error?.response?.status == 456) {
            brokerLogoutTokenRemove(router);
          }
        });
    };

    if (brokerCode) {
      fetchData();
      fetchOiStoredData(dispatch, router);
    }
  }, [brokerCode]);

  const handleSelectIndex = async (item: any, e: any) => {
    if (query == item?.index_name) {
      setShowDropDown(false);
      return;
    }
    setCombinedOiExpiry("");
    setMarginPayload?.([]);

    setCalculateMargin?.(false);
    setManuallyMinMax?.(false);
    setQuery(item.index_name);
    setOiExpiry("");
    setTempValue(item.index_name);
    setSelectedIndexName(item.index_name);
    setOiLoad({});
    setCheckedOIRows({});
    setCheckedOiradios({});
    setCheckedCustomRows({});
    setCheckedStrangleRows({});
    setStraddlePayload({});

    setQueryIdentifier(item.identifier);
    setOiChangeExpiry("");
    setStrikeRange({});

    setDefaultDD((prev: any) => {
      if (!prev.includes(item)) {
        return [...prev.slice(0, 4), item];
      }
      return prev; // No update if item is already in the array
    });
    setTimeout(() => {
      setShowDropDown(false);
    }, 50);
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

  useEffect(() => {
    const exists = indexData.some((item) => item?.index_name === tempValue);

    if (tempValue.length === 0 && !showDropDown) {
      setTempValue(selectedIndexName);
    }
    if (
      indexData.length != 0 &&
      tempValue.length != 0 &&
      !exists &&
      !showDropDown
    ) {
      setTempValue(selectedIndexName);
    }
  }, [showDropDown]);

  return (
    <DisplayIndexChanger
      setShowDropDown={setShowDropDown}
      ObjData={oiIndexData[query]}
      showDropDown={showDropDown}
      filteredData={defaultDD}
      selectedIndexName={selectedIndexName}
      handleSelectIndex={handleSelectIndex}
      StyleForSmallScreen={StyleForSmallScreen}
      dropDownClassName={dropDownClassName}
    />
  );
};

export default OiIndex;
