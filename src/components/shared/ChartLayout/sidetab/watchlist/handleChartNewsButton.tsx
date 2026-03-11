import { RootState } from "@/lib/redux/Store";
import React, { useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
interface ChartNewsProps {
  clickTvChart: boolean;
  setClickTvChart: Dispatch<SetStateAction<boolean>>;
  aeroToggle: boolean;
  setAeroToggle: Dispatch<SetStateAction<boolean>>;
  toggleState: string;
}
const ChartNewsButton: React.FC<ChartNewsProps> = ({
  clickTvChart,
  setClickTvChart,
  aeroToggle,
  setAeroToggle,
  toggleState,
}) => {
  const TvChartInitiateIndex: any = useSelector(
    (state: RootState) => state.Position.initiateTvChart
  );
  useEffect(() => {
    if (TvChartInitiateIndex != null) {
      if (clickTvChart == true) setClickTvChart(false);

      if (aeroToggle == true) {
        setAeroToggle(false);
      }
    }
  }, [TvChartInitiateIndex]);

  const handleTvChart = (e: any) => {
    e.stopPropagation();
    setClickTvChart(!clickTvChart);
    if (aeroToggle == true) {
      setAeroToggle(false);
    }
  };
  return (
    <div
      className={`flex h-5 items-center justify-center gap-0.5 rounded-full border-[0.05rem] border-solid border-z-green-500 px-2 py-1 text-[0.75rem] font-medium text-white text-z-green-500 sm:max-xl:h-6 sm:max-md:px-2 sm:max-md:py-[0.25rem] md:max-xl:px-4 lg:max-xl:py-0.5 xl:hidden`}
      onClick={handleTvChart}
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      {clickTvChart
        ? "chart"
        : `${toggleState == "Technicals" ? "Tech" : toggleState}`}
    </div>
  );
};

export default ChartNewsButton;
