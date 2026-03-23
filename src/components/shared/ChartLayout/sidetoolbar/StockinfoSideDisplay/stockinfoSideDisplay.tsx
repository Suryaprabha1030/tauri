import React, { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import Headings from "../sharedContent/headings";
import RemoveButton from "../sharedContent/RemoveButton";
import Stockinfo from "@/components/StockInfo/Stockinfo";
import { setStockInfoOpen } from "@/lib/redux/slices/CommonSlice";
import { fetchSymbolPrices } from "@/components/NimaAI/AIChat";

interface StockInfoSideDisplayProps {
  brokerCode: number | null;
  scopeId: any;
  InsideChat?: boolean;
  symbolName?: string;
  Identifier?: string;
}

const StockInfoSideDisplay: React.FC<StockInfoSideDisplayProps> = ({
  brokerCode,
  scopeId,
  InsideChat,
  symbolName,
  Identifier,
}) => {
  const [stockinfoDisplayData, setStockInfoSideDisplayData] = useState<
    any | null
  >(null);
  const StockinfoData: any = useSelector(
    (state: RootState) => state.common.SelectedAiStock
  );
  const netpercentage = useSelector(
    (state: RootState) => state.strategy.netChangepercent
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  const [showTechnicals, setShowTechnicals] = useState(false);
  const [showNewsPivots, setShowNewsPivots] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (StockinfoData && !InsideChat) {
      setStockInfoSideDisplayData({
        ...StockinfoData,
        identifier: StockinfoData?.identifier?.replace("-", ":") || "",
        symbol_type: "equity",
      });
    }
  }, [StockinfoData]);
  useEffect(() => {
    if (Identifier && symbolName && InsideChat) {
      setStockInfoSideDisplayData({
        identifier: Identifier.replace("-", ":") || "",
        symbol: symbolName,
        symbol_type: "equity",
      });
    }
  }, [Identifier, symbolName]);

  const handleStockRemove = () => {
    dispatch(setStockInfoOpen(false));
  };

  useEffect(() => {
    if (!stockinfoDisplayData) return;
    const identifiers = [stockinfoDisplayData?.identifier];
    fetchSymbolPrices( identifiers, dispatch);
  }, [stockinfoDisplayData, brokerCode]);

  return (
    <>
      <div className="flex flex-row justify-between  max-xl:sticky max-xl:left-0  max-xl:top-0 md:max-xl:py-1 ">
        {!InsideChat && (
          <>
            {" "}
            <Headings name="Stock Info" />
            <div className="flex w-[4rem] flex-row items-center gap-3 sm:max-md:w-[3.5rem] sm:max-md:gap-1 md:max-xl:w-[4.2rem] md:max-xl:pb-0.5">
              <RemoveButton onClick={handleStockRemove} />
            </div>
          </>
        )}
      </div>

      <div
        className={`h-[95%] w-full scrollbar-none max-xl:py-2  max-md:h-[90%] sm:max-xl:px-5 sm:max-md:pb-[1.5rem] md:max-xl:h-[85%] xl:h-[95%] xl:max-2xl:p-5 2xl:px-10 ${InsideChat ? "2xl:pb-1" : " 2xl:pb-10"} 2xl:pt-3`}
      >
        {stockinfoDisplayData != null && (
          <Stockinfo
            symbol={stockinfoDisplayData?.identifier}
            symbolName={stockinfoDisplayData?.symbol}
            brokerCode={brokerCode}
            scopeId={scopeId}
            clickedSymbolData={stockinfoDisplayData}
            showTechnicals={showTechnicals}
            setShowTechnicals={setShowTechnicals}
            showNewsPivots={showNewsPivots}
            setShowNewsPivots={setShowNewsPivots}
            webSocketDataRead={webSocketDataRead}
            netpercentage={netpercentage}
            InsideChat={InsideChat}
          />
        )}

        {stockinfoDisplayData == null && (
          <div className="px-6 py-4 text-center text-xs text-gray-500">
            No Stock Data available
          </div>
        )}
      </div>
    </>
  );
};

export default StockInfoSideDisplay;
