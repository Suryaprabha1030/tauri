import React, { useEffect, useRef, useState } from "react";
import {
  initializeTradingViewWidget,
  removeTradingViewWidget,
  tvWidget,
} from "./chartSetup";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { tvWidgetId } from "@/lib/util/toggleButtonName/toggleButtonNames";
import { stopPolling } from "./OiProfile";
import {
  cleanupExitLine,
  cleanupExitOverlays,
  drawExitLineAndOverlay,
  drawOrUpdateAnnotationWithOverlay,
} from "./AnnotationDisplay";
import { useNavigate } from "react-router-dom";
import { setPositionsData } from "@/lib/OItoggleExpiry";

interface TradingViewChartProps {
  brokerCode: any;
  userId: any;
  chartId: any;
}

export function InjectOIOverlay(containerId: string) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Container with id=${containerId} not found`);
    return;
  }

  // Cast iframe as HTMLIFrameElement for TS
  const iframe = container.querySelector(
    'iframe[src^="blob:"]',
  ) as HTMLIFrameElement | null;
  if (!iframe) {
    console.warn("TradingView iframe not found");
    return;
  }

  function addOverlay() {
    try {
      const iframeDoc = iframe?.contentDocument;
      if (!iframeDoc) {
        console.warn("Iframe contentDocument not accessible yet");
        return;
      }
      const iframeBody = iframeDoc.body;
      if (!iframeBody) {
        console.warn("Iframe body not accessible");
        return;
      }

      // Check if overlay already exists
      let overlayDiv = iframeDoc.getElementById("oi-bars-overlay");
      if (!overlayDiv) {
        overlayDiv = iframeDoc.createElement("div");
        overlayDiv.id = "oi-bars-overlay";

        Object.assign(overlayDiv.style, {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: "9999",
        });

        // Make sure iframe body is positioned relative for absolute overlay
        if (getComputedStyle(iframeBody).position === "static") {
          iframeBody.style.position = "relative";
        }

        iframeBody.appendChild(overlayDiv);
      }

      // console.log("OI Overlay injected");
    } catch (err) {
      console.error("Error injecting overlay into iframe:", err);
    }
  }

  iframe.addEventListener("load", addOverlay);

  if (iframe.contentDocument?.readyState === "complete") {
    addOverlay();
  }

  return () => {
    iframe.removeEventListener("load", addOverlay);
  };
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({
  brokerCode,
  userId,
  chartId,
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const toggleState: any = useSelector(
    (state: RootState) => state.common.CandleAreaToggle,
  );
  const isOpen = useSelector((state: RootState) => state.common.showTVpopup);
  const chartforPsb = useSelector(
    (state: RootState) => state.charts.chartPanel,
  );
  const isSidetabCollapsed: any = useSelector(
    (state: RootState) => state.common.isSidetabCollapsed,
  );
  const resolution = useSelector(
    (state: RootState) => state.charts.setTvResolution,
  );
  const firstFut = useSelector(
    (state: RootState) => state.charts.IndexFirstFutData,
  );
  const FutIndexName = useSelector(
    (state: RootState) => state.charts.FutIndexName,
  );
  const ChartIconClicked = useSelector(
    (state: RootState) => state.charts.ChartIconClicked,
  );

  const TvAddSymbolPopup = useSelector(
    (state: RootState) => state.charts.TvAddSymbolPopup,
  );
  const UpdatedSymbolPnl = useSelector(
    (state: RootState) => state.Position.SymbolPnl,
  );
  const holdingsdata: any = useSelector(
    (state: RootState) => state.strategy.holdingsData,
  );
  const positionsdata = useSelector(
    (state: RootState) => state.strategy.positions,
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );

  const lastExitRef = useRef<{ price: number; symbol: string } | null>(null);
  const symbolChangeSubscribed = useRef(false);
  const router = useNavigate();
  const updatedPnlRef = useRef(UpdatedSymbolPnl);
  const WebsocketLtpRef = useRef(webSocketDataRead);
  const positionsDataRef = useRef(positionsdata);
  const isMarketHoliday = useSelector(
    (state: RootState) => state.MarketBasis.isMarketHoliday,
  );

  useEffect(() => {
    if (chartContainerRef.current) {
      removeTradingViewWidget(chartId); // Cleanup existing widget
      stopPolling();
      const tv = initializeTradingViewWidget(
        chartContainerRef,
        dispatch,
        userId,
        toggleState,
        isOpen,
        isSidetabCollapsed,
        resolution,
        firstFut,
        ChartIconClicked,
        FutIndexName,
        TvAddSymbolPopup,
        router,
        chartforPsb,
        isMarketHoliday,
      ); // Reinitialize with new brokerCode
      InjectOIOverlay("trading-view-chart");
    }

    return () => {
      removeTradingViewWidget(chartId); // Cleanup on unmount
      stopPolling();
    };
  }, [brokerCode, dispatch, userId]);

  useEffect(() => {
    if ((!isOpen && chartforPsb) || !isOpen) {
      removeTradingViewWidget(tvWidgetId.POPUPCHART);
      stopPolling();
    }
  }, [isOpen, chartforPsb]);

  // To display the pnl line in the trading view chart and updating the pnl value
  // Update the annotation label live on every WebSocket update

  useEffect(() => {
    if (updatedPnlRef) {
      updatedPnlRef.current = UpdatedSymbolPnl;
    }
    if (WebsocketLtpRef) {
      WebsocketLtpRef.current = webSocketDataRead;
    }
  }, [UpdatedSymbolPnl, webSocketDataRead]);
  useEffect(() => {
    if (positionsDataRef) {
      positionsDataRef.current = positionsdata;
    }
    setPositionsData(positionsdata);
  }, [positionsdata]);

  useEffect(() => {
    if (!tvWidget) return;
    let drawToken = 0; // Increment each time symbol changes
    tvWidget.onChartReady(() => {
      const chart = tvWidget?.activeChart?.();
      if (!chart) {
        console.warn("Chart not ready");
        return;
      }
      chart.onSymbolChanged().subscribe(null, async (symbolInfo: any) => {
        drawToken++; // This will invalidate any ongoing draw for old symbols
        const currentToken = drawToken;

        const selectedSymbol = symbolInfo?.full_name || symbolInfo?.symbol;
        const holding = holdingsdata?.holdings?.find(
          (hold: any) => hold?.identifier === selectedSymbol,
        );
        if (holding) {
          const avgPrice = Number(holding?.average_price);
          const quantity = Number(holding?.quantity);
          const pnl = Number(updatedPnlRef.current[holding?.identifier]);

          // Only set pledge and t1qty if valid
          let pledge: number | undefined;
          let t1qty: number | undefined;
          if (holding?.collateral_type === "pledge") {
            pledge = Number(holding?.collateral_quantity) || 0;
          } else if (Number(holding?.t1quantity) > 0) {
            t1qty = Number(holding?.t1quantity);
          }
          if (quantity === 0 && !pledge && !t1qty) {
            return;
          }

          // Before drawing, check if we're still on the same symbol
          if (currentToken !== drawToken) return; // outdated draw → skip
          await drawOrUpdateAnnotationWithOverlay(
            chart,
            avgPrice,
            quantity,
            pnl,
            holding,
            pledge,
            t1qty,
            true,
          );
          // Check again after async work
          if (currentToken !== drawToken) {
            return;
          }
        }
      });
    });
  }, [tvWidget, holdingsdata]);

  useEffect(() => {
    if (!tvWidget) return;

    requestAnimationFrame(() => {
      setTimeout(() => {
        try {
          tvWidget.onChartReady(() => {
            const chart = tvWidget?.activeChart?.();
            if (!chart) return;

            const selectedSymbol = chart?.symbol?.();
            if (!selectedSymbol) return;

            const position =
              positionsDataRef?.current &&
              positionsDataRef?.current?.length > 0 &&
              positionsDataRef.current?.find(
                (pos: any) =>
                  pos?.identifier === selectedSymbol &&
                  pos?.transaction_type !== "EXITED", //  filter out exited
              );

            const holding = holdingsdata?.holdings?.find(
              (hold: any) => hold?.identifier === selectedSymbol,
            );

            if (holding) {
              const avgPrice = Number(holding?.average_price);
              const quantity = Number(holding?.quantity);
              const pnl = Number(updatedPnlRef.current[holding?.identifier]);
              let pledge: number | undefined;
              let t1qty: number | undefined;
              if (holding?.collateral_type === "pledge") {
                pledge = Number(holding?.collateral_quantity) || 0;
              } else if (Number(holding?.t1quantity) > 0) {
                t1qty = Number(holding?.t1quantity);
              }
              if (quantity === 0 && !pledge && !t1qty) {
                return;
              }

              drawOrUpdateAnnotationWithOverlay(
                chart,
                avgPrice,
                quantity,
                pnl,
                holding,
                pledge,
                t1qty,
                false,
              );
            }

            if (position) {
              const ltp = Number(WebsocketLtpRef.current[position?.identifier]);
              const pnl = Number(updatedPnlRef.current[position?.identifier]);

              //  Only draw if price or symbol changed
              if (
                !lastExitRef.current ||
                lastExitRef.current.symbol !== selectedSymbol ||
                lastExitRef.current.price !== ltp
              ) {
                cleanupExitLine(chart);
                drawExitLineAndOverlay(
                  chart,
                  position,
                  ltp,
                  pnl,
                  dispatch,
                  router,
                );
                lastExitRef.current = { price: ltp, symbol: selectedSymbol };
              }
            } else {
              cleanupExitLine(chart);
              lastExitRef.current = null;
            }
          });
        } catch (err) {
          console.error("Error in chart initialization (effect 1):", err);
        }
      }, 100);
    });
  }, [UpdatedSymbolPnl]);

  useEffect(() => {
    if (!tvWidget || symbolChangeSubscribed.current) return;

    tvWidget.onChartReady(() => {
      const chart = tvWidget.activeChart?.();
      if (!chart) return;

      chart.onSymbolChanged().subscribe(null, async (symbolInfo: any) => {
        const selectedSymbol = symbolInfo?.full_name || symbolInfo?.symbol;

        cleanupExitLine(chart); //  Ensure old exit overlays are removed
        cleanupExitOverlays(selectedSymbol, chart);

        if (positionsDataRef.current && positionsDataRef.current?.length > 0) {
          const position = positionsDataRef.current?.find(
            (pos: any) =>
              pos?.identifier === selectedSymbol &&
              pos?.transaction_type !== "EXITED", //  filter out exited
          );

          if (position) {
            const ltp = Number(WebsocketLtpRef.current[position?.identifier]);
            const pnl = Number(updatedPnlRef.current[position?.identifier]);
            cleanupExitLine(chart);
            cleanupExitOverlays(selectedSymbol, chart);
            await drawExitLineAndOverlay(
              chart,
              position,
              ltp,
              pnl,
              dispatch,
              router,
            );
            symbolChangeSubscribed.current = true;
          }
        } else {
          cleanupExitLine(chart);
          cleanupExitOverlays(selectedSymbol, chart);
        }
      });
    });
  }, [tvWidget, positionsDataRef]);

  return (
    <div
      ref={chartContainerRef}
      className="h-full w-full"
      id="trading-view-chart"
      style={{ position: "relative" }}
    >
      {/* TradingView iframe renders here */}

      {/* OI Bar Overlay (Independent of chart time axis) */}
      <div
        id="oi-bars-overlay"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "80px", // fixed width for OI bars
          height: "100%",
          pointerEvents: "none", // don't block mouse
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      />
    </div>
  );
};

export default TradingViewChart;
