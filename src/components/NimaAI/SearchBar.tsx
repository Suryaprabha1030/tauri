"use client";
import { setNimaGpt } from "@/lib/redux/slices/screenerSlice";
import { RootState } from "@/lib/redux/Store";
import { consolidatedPositions } from "@/lib/util/Screenerutil/ScreenerUtil";
import { useDispatch, useSelector } from "react-redux";

export default function InlineSuggestionSearch({
  isChatMode,
  authSuccess,
  chatlimit,
  setShowLoginPopup,
  handleGenerate,
  STORAGE_KEY,
  setMessages,
  setChatLimit,
  setLoading,
  setQuery,
  setPreviousChats,
  brokerCode,
  loading,
  query,
  inputRef,
  setShowSuggestions,
  streamingAssistantRef,
}:any) {
  const dispatch = useDispatch();
  const NimaGptType: any = useSelector(
    (state: RootState) => state.Screener.NimaGptType
  );
  const lastUpdatedPositions: any = useSelector(
    (state: RootState) => state.Screener.lastUpdatedpositions
  );
  const lastUpdatedHoldings: any = useSelector(
    (state: RootState) => state.Screener.lastUpdatedholdings
  );
  const selectedPositionType = useSelector(
    (state: RootState) => state.SimulationDemo.positionType
  );
  const selectedHoldingsType = useSelector(
    (state: RootState) => state.SimulationDemo.holdingsType
  );
  const positionsdata = useSelector(
    (state: RootState) => state.strategy.positions
  );
  const positionPnl = useSelector(
    (state: RootState) => state.strategy.positionPnl
  );
  const positionpnlpercent = useSelector(
    (state: RootState) => state.strategy.positionpnlpercent
  );
  const holdingsdata: any = useSelector(
    (state: RootState) => state.strategy.holdingsData
  );
  const OrdersDemoEnabled = useSelector(
    (state: RootState) => state.SimulationDemo.ordersDemo
  );
  const simulatedOrders: any = useSelector(
    (state: RootState) => state.SimulationDemo.simulatedOrders
  );
  const PositionsData = consolidatedPositions(
    positionsdata,
    positionPnl,
    positionpnlpercent
  );
  return (
    <div className="relative w-full">
      <div className="flex flex-wrap items-center gap-2 rounded-lg bg-white p-1">
        <textarea
          ref={inputRef}
          placeholder={
            isChatMode
              ? "Ask more about your stocks..."
              : "e.g., Tech stocks with strong fundamentals..."
          }
          className="max-h-[2rem] flex-1 resize-none overflow-y-auto bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 max-sm:max-h-[3rem] max-sm:text-[0.8rem]"
          value={query}
          onChange={(e) => {
            if (query?.length === 0) {
              dispatch(setNimaGpt(""));
            }
            setQuery(e.target.value);
          }}
          rows={3} // initial visible height (3 lines)
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (!authSuccess && chatlimit >= 3) {
                setShowLoginPopup(true);
                return;
              }
              handleGenerate(
                query,
                authSuccess,
                STORAGE_KEY,
                setMessages,
                setChatLimit,
                setLoading,
                setQuery,
                setPreviousChats,
                dispatch,
                streamingAssistantRef,
                NimaGptType,
                lastUpdatedPositions,
                lastUpdatedHoldings,
                selectedPositionType,
                selectedHoldingsType,
                PositionsData,
                holdingsdata,
                OrdersDemoEnabled,
                simulatedOrders,
                brokerCode
              );
              setShowSuggestions(false);
            }
          }}
          disabled={loading}
        />
      </div>
    </div>
  );
}
