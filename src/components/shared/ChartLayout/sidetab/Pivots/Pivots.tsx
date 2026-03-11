import { TechnicalAnalysisRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import React, { useEffect, useState } from "react";
import PivotTable from "./PivotsTable";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import InfoNotes from "../InfoNotes";
import TimeframeSelector from "../TimeFrameSelector/TimeFrameSelector";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

interface PivotsProps {
  clickedSymbolData: any;
  brokerCode: any;
  stockInfo?: boolean;
}
const Pivots: React.FC<PivotsProps> = ({
  brokerCode,
  clickedSymbolData,
  stockInfo,
}) => {
  const resolution = useSelector(
    (state: RootState) => state.charts.setTvResolution
  );

  const [pivots, setPivots] = useState<any>({});

  const timeframes = ["5", "15", "30", "60", "1D"];
  const [selectedTimeframe, setSelectedTimeframe] = useState(
    timeframes.includes(resolution) ? resolution : "1D"
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  const netpercentage = useSelector(
    (state: RootState) => state.strategy.netChangepercent
  );
  const [ltp, setLtp] = useState<number | null>(null);
  const [chg, setChg] = useState<number | null>(null);

  const handleTimeframeClick = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
  };
  const router = useRouter();
  useEffect(() => {
    const Technicals = new TechnicalAnalysisRouterApi(baseConfig());
    Technicals.calculatePivotsPointV1TaPivotsPost(
      brokerCode,
      clickedSymbolData?.identifier,
      selectedTimeframe
    )
      .then((res) => {
        setPivots(res.data);
      })
      .catch((error: any) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
        if (error?.response) {
          setPivots({});
        }
      });
  }, [clickedSymbolData, brokerCode, selectedTimeframe]);

  useEffect(() => {
    const price =
      clickedSymbolData &&
      Number(webSocketDataRead[clickedSymbolData.identifier]);
    const chg =
      clickedSymbolData && Number(netpercentage[clickedSymbolData.identifier]);
    if ((price && chg) != null) setChg(chg);
    setLtp(price);
  }, [clickedSymbolData, webSocketDataRead, netpercentage]);

  useEffect(() => {
    if (timeframes.includes(resolution)) {
      setSelectedTimeframe(resolution);
    }
  }, [resolution]);
  return (
    <div
      className={`h-full w-full ${pivots && pivots.pivot_points ? "sm:max-md:mb-[7rem] md:max-xl:mb-[12rem]" : "max-xl:min-h-max"} `}
    >
      <TimeframeSelector
        selectedTimeframe={selectedTimeframe}
        onSelectTimeframe={setSelectedTimeframe}
      />

      {pivots && pivots.pivot_points ? (
        <div
          className={`ml-4 mr-3 mt-1 flex h-[95%] flex-col justify-between gap-2 overflow-y-auto rounded-lg border bg-white shadow-md scrollbar-thin 2xl:h-[91%] ${stockInfo ? "max-sm:mx-0 max-sm:h-[85%] max-sm:w-[100%] sm:max-md:h-[86%] md:max-lg:h-[85%] lg:max-xl:h-[83%] xl:max-2xl:h-[92%] 2xl:h-[97%]" : "max-sm:h-[75%] sm:max-lg:h-[100%] lg:max-xl:h-[97%] xl:max-2xl:h-[80%]"} `}
        >
          <PivotTable pivots={pivots} ltp={ltp} chg={chg} />
        </div>
      ) : (
        <InfoNotes name=" No Pivots" stockInfo={stockInfo} />
      )}
    </div>
  );
};
Pivots.displayName = "Pivots";
export default React.memo(Pivots);
