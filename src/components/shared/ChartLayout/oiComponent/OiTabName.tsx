import { OIAlldata } from "@/lib/redux/slices/OISlice";
import { RootState } from "@/lib/redux/Store";
import { OiTab } from "@/lib/util/toggleButtonName/toggleButtonNames";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface OiTabNameProps {
  setShowMultiOi: Dispatch<React.SetStateAction<any>>;
  setShowMultiStraddle: Dispatch<React.SetStateAction<any>>;
  showMultiStraddle: boolean;
  showOiChange: boolean;
  setShowOiChange: Dispatch<React.SetStateAction<any>>;
  setSelected: Dispatch<React.SetStateAction<any>>;
  setSpotPriceRoundOff: Dispatch<SetStateAction<number | null>>;
  showCombinedOi: boolean;
  setShowCombinedOi: Dispatch<React.SetStateAction<any>>;
  straddlePayload: {};
  setCheckedOIRows: Dispatch<React.SetStateAction<any>>;
  setManuallyCheckedStraddle: Dispatch<React.SetStateAction<any>>;
  setStraddlePayload: Dispatch<React.SetStateAction<any>>;
  query: any;
  showMultiOi: boolean;
  setCombinedOiExpiry: Dispatch<React.SetStateAction<any>>;
  setExpandOiTable: Dispatch<React.SetStateAction<boolean>>;
  setMarginPayload: Dispatch<React.SetStateAction<[]>>;
  setShowMargin: React.Dispatch<React.SetStateAction<any>>;
  setCalculateMargin: React.Dispatch<React.SetStateAction<boolean>>;
  showFiiDiiData: boolean;
  setShowFiiDiiData: React.Dispatch<React.SetStateAction<boolean>>;
  setShowOiMatrix: React.Dispatch<React.SetStateAction<boolean>>;
  showOiMatrix: boolean;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setTempValue: Dispatch<React.SetStateAction<any>>;

  setSelectedIndexName: Dispatch<React.SetStateAction<any>>;
}
const OiTabName: React.FC<OiTabNameProps> = ({
  setShowMultiOi,
  setShowMultiStraddle,
  showMultiStraddle,
  showOiChange,
  setShowOiChange,
  showCombinedOi,
  setShowCombinedOi,
  setManuallyCheckedStraddle,
  setStraddlePayload,
  query,
  showMultiOi,
  setCombinedOiExpiry,
  setExpandOiTable,
  setMarginPayload,
  setShowMargin,
  setCalculateMargin,
  setShowFiiDiiData,
  showFiiDiiData,
  setShowOiMatrix,
  showOiMatrix,
  setQuery,
  setTempValue,

  setSelectedIndexName,
}) => {
  const [tabSwitching, setTabSwitching] = useState<number>(0);
  const [selectedValue, setSelectedValue] = useState<string>(
    OiTab[tabSwitching].label
  );
  const dynamicWidth = OiTab.find((tab) => tab.label === selectedValue);
  const [dropDownWidth, setDropDownWidth] = useState<any>(dynamicWidth?.width);
  const expiries: any = useSelector(
    (state: RootState) => state.OI.OIIndexExpiryDate
  );
  const multiOi = () => {
    setShowMargin(null);
    setMarginPayload([]);
    setShowMultiOi(true);
    setShowMultiStraddle(false);
    setShowOiChange(false);
    setShowCombinedOi(false);
    setShowFiiDiiData(false);
    setShowOiMatrix(false);
    setCalculateMargin(false);
    setCombinedOiExpiry("");
    setSelectedIndexName(query);
    setSelectedValue("Multi Strike");
  };

  const multiStraddle = () => {
    setShowMargin(null);

    setMarginPayload([]);
    setStraddlePayload([]);
    setManuallyCheckedStraddle(false);
    setShowMultiStraddle(true);
    setShowMultiOi(false);
    setShowOiChange(false);
    setShowCombinedOi(false);
    setShowFiiDiiData(false);
    setShowOiMatrix(false);
    setCalculateMargin(false);
    setCombinedOiExpiry("");
    setSelectedValue("Multi Straddle");
  };

  const oiChange = () => {
    if (!expiries[query]?.length) {
      return;
    }
    setExpandOiTable(false);
    setShowCombinedOi(false);
    setShowOiChange(true);
    setShowMultiOi(false);
    setShowFiiDiiData(false);
    setShowMultiStraddle(false);
    setShowOiMatrix(false);
    setCombinedOiExpiry("");
    setCalculateMargin(false);
    setMarginPayload([]);
    setSelectedValue("OI Change");
  };
  const combinedOi = () => {
    if (!expiries[query]?.length) {
      return;
    }

    setExpandOiTable(false);
    setShowFiiDiiData(false);
    setShowCombinedOi(true);
    setShowOiChange(false);
    setShowMultiOi(false);
    setShowMultiStraddle(false);
    setShowOiMatrix(false);
    setCalculateMargin(false);
    setMarginPayload([]);
    setSelectedValue("Combined OI");
  };

  const FiiDiiData = () => {
    setShowMargin(null);
    setQuery(query);
    setSelectedIndexName(query);
    setTempValue(query);
    setExpandOiTable(false);
    setMarginPayload([]);
    setStraddlePayload([]);
    setManuallyCheckedStraddle(false);

    setShowMultiStraddle(false);
    setShowMultiOi(false);
    setShowOiChange(false);
    setShowCombinedOi(false);
    setShowOiMatrix(false);
    setShowFiiDiiData(true);
    setCalculateMargin(false);
    setCombinedOiExpiry("");
  };

  const oiMatrix = () => {
    setShowOiMatrix(true);
    setExpandOiTable(false);
    setShowCombinedOi(false);
    setShowOiChange(false);
    setShowMultiOi(false);
    setCombinedOiExpiry("");
    setShowFiiDiiData(false);
    setShowMultiStraddle(false);

    setCalculateMargin(false);
    setMarginPayload([]);
    setSelectedValue("Matrix View");
  };

  useEffect(() => {
    if (
      !showMultiStraddle &&
      !showOiChange &&
      !showCombinedOi &&
      !showFiiDiiData &&
      !showOiMatrix
    ) {
      setShowMultiOi(true);
    }
  }, [
    showMultiStraddle,
    showOiChange,
    showCombinedOi,
    showFiiDiiData,
    showOiMatrix,
  ]);

  const functionsMap: any = {
    multiOi,
    multiStraddle,
    oiChange,
    combinedOi,
    FiiDiiData,
    oiMatrix,
  };
  const handleSwitchDropdown = (event: any) => {
    const selectedOption = OiTab.find(
      (tab) => tab.label === event.target.value
    );
    if (selectedOption && selectedOption.onClick) {
      functionsMap[selectedOption.onClick]();
    }
    setDropDownWidth(
      OiTab.find((tab) => tab.label === event.target.value)?.width
    );
    setSelectedValue(event.target.value);
  };
  const conditionMap: Record<string, boolean> = {
    showMultiOi, // Boolean state or value
    showMultiStraddle,
    showCombinedOi,
    showOiChange,
    showFiiDiiData,
    showOiMatrix,
  };

  return (
    <>
      {/* Only for large Screen */}
      <div className="flex w-full  max-md:hidden md:max-xl:mt-[4rem] md:max-xl:h-[2.5rem] xl:max-2xl:pl-12 2xl:pl-10">
        {OiTab.map((tab, index) => {
          return (
            <span
              key={index}
              className={`flex h-[2.4rem] w-[8rem] cursor-pointer items-center  justify-center gap-2 border-gray-300 text-[0.8rem] font-medium shadow-lg md:max-xl:pt-[0.22rem] xl:max-2xl:w-[7rem] ${
                tab.border
              } ${
                tab.activeConditionKey && conditionMap[tab.activeConditionKey]
                  ? "bg-white text-black"
                  : "text-gray-400"
              }`}
              onClick={functionsMap[tab.onClick]}
            >
              {tab.label}
            </span>
          );
        })}
      </div>
      {/* Only for large Screen */}

      {/* Only for Small Screen */}
      <span className="flex h-[2rem] items-center justify-center rounded-lg border border-solid border-gray-300 px-1 md:hidden">
        <select
          className={`h-[0.9rem] bg-white text-[0.75rem] font-tableHead outline-none  ${dropDownWidth}`}
          value={selectedValue}
          onChange={(event) => {
            handleSwitchDropdown(event);
          }}
        >
          {OiTab.map((tab, index) => (
            <option
              key={index}
              value={tab.label}
              onClick={functionsMap[tab.onClick]}
            >
              {tab.label}
            </option>
          ))}
        </select>
      </span>
      {/* Only for Small Screen */}
    </>
  );
};

export default OiTabName;
