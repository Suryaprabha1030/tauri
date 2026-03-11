import { RootState } from "@/lib/redux/Store";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MultiSymbolNews from "../../sidetab/News/MultiSymbolNews";
import ImageBox from "../sharedContent/ImageBox";
import HoldingsHeader from "./HoldingsHeader";
import HoldingsPnlPerc from "./HoldingsPnlPerc";
import HoldingsTableHeader from "./HoldingsTableHeader";
import HoldingsTable from "./HoldingsTable";
import { calculateHoldingsPnL } from "@/lib/util/sideToolBar/holdingsUtil";
import { setCurrentHoldingsvalue } from "@/lib/redux/slices/CommonSlice";
import { updateSymbolPnl } from "@/lib/redux/slices/PositionSlicer";

interface HoldingsProps {
  brokerCode: number | null;

  leftWidth: number;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
}

const Holdings: React.FC<HoldingsProps> = ({
  brokerCode,

  leftWidth,
  setLeftWidth,
}) => {
  const [totalProfitAndLoss, setTotalProfitAndLoss] = useState<number | null>(
    null
  );
  const [totalProfitAndLossPercent, setTotalProfitAndLossPercent] =
    useState<any>("");
  const [dataholding, setHoldings] = useState<any[]>([]);
  const holdingsdata: any = useSelector(
    (state: RootState) => state.strategy.holdingsData
  );
  const [symbolsPerPage, setSymbolsPerpage] = useState(2);
  const [symbols, setsymbols] = useState<any[]>([]);
  const [totinvestedvalue, setinvestedvalue] = useState<number>(0);

  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (leftWidth >= 80) {
      setSymbolsPerpage(4);
    } else setSymbolsPerpage(2);
  }, [leftWidth]);

  useEffect(() => {
    setTotalProfitAndLoss(holdingsdata && holdingsdata?.total_profit_and_loss);
    setTotalProfitAndLossPercent(
      holdingsdata && holdingsdata?.total_profit_and_loss_percent
    );
    setinvestedvalue(holdingsdata && holdingsdata?.total_invested_value);

    setHoldings(holdingsdata && holdingsdata?.holdings);
    holdingsdata &&
      holdingsdata?.holdings?.forEach((stock) => {
        dispatch(
          updateSymbolPnl({
            symbol: stock?.identifier,
            pnl: stock?.profit_and_loss,
          })
        );
      });
    const symbolsArray =
      holdingsdata &&
      holdingsdata?.holdings &&
      holdingsdata?.holdings.map((holding: any) => holding.identifier);

    setsymbols(symbolsArray);
  }, [holdingsdata]);

  useEffect(() => {
    if (!holdingsdata || !holdingsdata.holdings) return;
    const investValue = holdingsdata?.total_invested_value;
    const { updatedHoldings, totalPnL, totalPnLPercent, currentValue } =
      calculateHoldingsPnL(
        holdingsdata.holdings,
        webSocketDataRead,
        investValue
      );
    setHoldings(updatedHoldings); // Assuming there's a local state for holdings
    updatedHoldings?.forEach((stock) => {
      dispatch(
        updateSymbolPnl({
          symbol: stock?.identifier,
          pnl: stock?.profit_and_loss,
        })
      );
    });
    setTotalProfitAndLoss(totalPnL);
    setTotalProfitAndLossPercent(totalPnLPercent);
    dispatch(setCurrentHoldingsvalue(currentValue));
  }, [webSocketDataRead, holdingsdata]);
  // Mouse down event to start dragging

  return (
    <>
      <HoldingsHeader
        brokerCode={brokerCode}
        dataholding={dataholding}
        leftWidth={leftWidth}
        setLeftWidth={setLeftWidth}
      />
      {dataholding && dataholding.length > 0 ? (
        <>
          <HoldingsPnlPerc
            totalProfitAndLossPercent={totalProfitAndLossPercent}
            totalProfitAndLoss={totalProfitAndLoss}
            totinvestedvalue={totinvestedvalue}
            leftWidth={leftWidth}
          />
          <div className="w-full overflow-x-hidden bg-white  max-xl:justify-center max-xl:scrollbar-none max-md:flex max-sm:max-h-[65%] sm:max-xl:max-h-[85%] xl:h-[78%] xl:overflow-y-auto xl:scrollbar-thin ">
            <table className="table-fixed divide-y divide-gray-200 bg-white max-xl:mx-[2%] max-xl:w-[96%] xl:mx-1 xl:w-full">
              <HoldingsTableHeader leftWidth={leftWidth} />
              <HoldingsTable leftWidth={leftWidth} dataholding={dataholding} />
            </table>
          </div>
        </>
      ) : (
        <ImageBox
          imagePath="/svg/holdings.svg"
          display="No Holdings Available"
          width={250}
          height={250}
        />
      )}
    </>
  );
};

export default React.memo(Holdings);
