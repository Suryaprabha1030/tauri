import React from "react";
import LiveChart from "../chartTool/LiveChart";
import ChartCards from "./ChartCards";

export default function PayoffScreenshot({
  captureRef,
  calcData,
  item,
  spotPriceInfo,
  projectedPnl,
  targetSpotPrice,
  oiData,
  payoffExpiryDate,
}) {
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center gap-1"
      ref={captureRef}
      style={{ display: "block", height: "700px", width: "600px" }}
    >
      <div className="h-[2.5rem] ">
        <ChartCards />
      </div>
      <LiveChart
        data={calcData}
        spotPrice={
          typeof item?.spot_price === "number"
            ? Number(item?.spot_price)?.toFixed(0)
            : spotPriceInfo
        }
        projectedPnl={projectedPnl}
        targetSpotPrice={targetSpotPrice}
        oiData={oiData}
        payoffExpiryDate={payoffExpiryDate}
        defaultChartToolTip={true}
      />
    </div>
  );
}
