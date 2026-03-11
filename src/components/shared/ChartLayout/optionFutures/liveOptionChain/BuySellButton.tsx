import {
  getOptionData,
  setSelectedStrategy,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";
import { RootState } from "@/lib/redux/Store";
import { handleSelect } from "@/lib/util/analyzer/handleSelect";
import React, { Dispatch } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

interface BuysellButtonProps {
  combinedBuyClassNamesPECE: string;
  buyPECEButtonKey: string;
  hashPECE: string;
  updatedOptionChainForPECE: any;
  combinedSellClassNamesPECE: string;
  sellPECEButtonKey: string;
  optionDatas: any;
  optionType: any;
  setActive: Dispatch<React.SetStateAction<any>>;
  active: any;
}

const BuysellButton: React.FC<BuysellButtonProps> = ({
  combinedBuyClassNamesPECE,
  buyPECEButtonKey,
  hashPECE,
  updatedOptionChainForPECE,
  combinedSellClassNamesPECE,
  sellPECEButtonKey,
  optionDatas,
  optionType,
  setActive,
  active,
}) => {
  const dispatch = useDispatch();
  const selectedStrategy = useSelector(
    (state: RootState) => state.analyzer.setselectedStrategy
  );
  const positionDatas = useSelector(
    (state: RootState) => state.analyzer.PositionDataList
  );
  const futureDatas = useSelector(
    (state: RootState) => state.analyzer.futureDataList
  );
  return (
    <>
      <button
        className={combinedBuyClassNamesPECE}
        key={buyPECEButtonKey}
        id={buyPECEButtonKey}
        onClick={handleSelect(
          hashPECE,
          updatedOptionChainForPECE,
          "LONG",
          "BUY",
          dispatch,
          optionDatas,
          showStrategyTable,
          showPositionTable,
          showPnlTable,
          getOptionData,
          toast,
          setSelectedStrategy,
          showDraftPositions,
          futureDatas,
          positionDatas,
          selectedStrategy,
          setActive,
          active
        )}
      >
        B
      </button>
      <button
        className={combinedSellClassNamesPECE}
        key={sellPECEButtonKey}
        id={sellPECEButtonKey}
        onClick={handleSelect(
          hashPECE,
          updatedOptionChainForPECE,
          "SHORT",
          "SELL",
          dispatch,
          optionDatas,
          showStrategyTable,
          showPositionTable,
          showPnlTable,
          getOptionData,
          toast,
          setSelectedStrategy,
          showDraftPositions,
          futureDatas,
          positionDatas,
          selectedStrategy,
          setActive,
          active
        )}
      >
        S
      </button>
    </>
  );
};

export default BuysellButton;
