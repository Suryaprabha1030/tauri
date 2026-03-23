import { UserBrokerRouterApi } from "@/lib/api/base";
import { getBrokerCode } from "../helpers";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { formatNumber } from "@/lib/util/DraftUtil";
import { togglePlaceOrderVisibility, setStockData } from "@/lib/redux/slices/PlaceOrder";

let lastDrawnPnl: number | null = null;
let activeExitShape: any = null;
const symbolDataCache: Record<string, { lot_size: number }> = {};

let activeExitLabelOverlay: HTMLDivElement | null = null;
let activeExitButtonOverlay: HTMLDivElement | null = null;
let exitDrawRetryTimeout: ReturnType<typeof setTimeout> | null = null;
let isDrawingExitLine = false;
let isDrawing = false;
let lastUpdateTime = 0;
const MIN_UPDATE_INTERVAL = 300; // ms

let activeLines: any[] = [];
let activeOverlays: HTMLElement[] = [];

// Map of normalizedSymbol -> { button, label, shape }
const exitOverlaysMap: Record<
  string,
  {
    button?: HTMLElement;
    label?: HTMLElement;
    shape?: any; // TradingView shape entity
  }
> = {};
export function cleanupExitOverlays(symbol: string, chart: any) {
  const key = symbol;
  const overlays = exitOverlaysMap[key];
  if (!overlays) return;
  try {
    overlays.button?.remove();
    overlays.label?.remove();
    if (overlays?.shape) {
      chart.removeEntity(overlays?.shape);
    }
  } catch (err) {
    console.warn(`Failed to cleanup overlays for ${key}`, err);
  }

  delete exitOverlaysMap[key];
}

export function cleanupExitLine(chart: any) {
  if (activeExitLabelOverlay) {
    activeExitLabelOverlay.remove();
    activeExitLabelOverlay = null;
  }
  if (activeExitButtonOverlay) {
    activeExitButtonOverlay.remove();
    activeExitButtonOverlay = null;
  }
  if (activeExitShape) {
    chart.removeEntity(activeExitShape);
    activeExitShape = null;
  }
}
const formatLabelText = (
  price: number,
  quantity: number,
  pnl: number,
  pledge?: number,
  t1qty?: number
) => {
  let label = `Avg: ${price?.toFixed(2)} | Qty: ${quantity}`;

  // Place P and T1 right after Qty
  if (pledge !== undefined) {
    label += ` (P:${pledge}`;
    if (t1qty !== undefined) {
      label += `, T1:${t1qty})`;
    } else {
      label += `)`;
    }
  } else if (t1qty !== undefined) {
    label += ` (T1:${t1qty})`;
  }

  label += ` | P&L: ${formatNumber(pnl)}`;
  return label;
};

export const drawOrUpdateAnnotationWithOverlay = async (
  chart: any,
  price: number,
  quantity: number,
  pnl: number,
  holding: any,
  pledge?: number,
  t1qty?: number,
  symbolChange?: boolean
) => {
  if (!chart.dataReady() && symbolChange === true) {
    setTimeout(() => {
      drawOrUpdateAnnotationWithOverlay(
        chart,
        price,
        quantity,
        pnl,
        holding,
        pledge,
        t1qty,
        true
      );
    }, 1000);
    return;
  }

  if (holding?.identifier !== chart.symbol()) return;
  if (Date.now() - lastUpdateTime < MIN_UPDATE_INTERVAL) return;
  lastUpdateTime = Date.now();

  if (isDrawing) return;
  if (lastDrawnPnl?.toFixed(2) === pnl?.toFixed(2) && !symbolChange) return;
  lastDrawnPnl = pnl;
  isDrawing = true;

  try {
    const iframe = document.querySelector(
      "iframe[src^='blob']"
    ) as HTMLIFrameElement;

    // better root than .chart-container
    const chartLayout = iframe?.contentDocument?.querySelector(
      ".chart-container"
    ) as HTMLElement;
    const paneContents = Array.from(
      chartLayout.querySelectorAll(".chart-markup-table.pane")
    ) as HTMLElement[];
    const chartRoot = paneContents[0];
    if (!chartRoot) return;

    // ensure relative positioning
    chartRoot.style.position = "relative";

    // --- Cleanup old
    activeLines.forEach((line) => {
      try {
        chart.removeEntity(line);
      } catch {}
    });
    activeLines = [];

    activeOverlays.forEach((el) => {
      try {
        el.remove();
      } catch {}
    });
    activeOverlays = [];

    // --- Create line
    const visibleRange = chart.getVisibleRange();
    if (!visibleRange) return;

    const { from, to } = visibleRange;
    const midTime = from + (to - from) / 2;
    const color = pnl < 0 ? "#F44336" : "#4CAF50";
    const labelText = formatLabelText(price, quantity, pnl, pledge, t1qty);

    const line = await chart.createMultipointShape([{ time: midTime, price }], {
      shape: "horizontal_line",
      lock: true,
      disableSelection: true,
      disableSave: true,
      overrides: {
        linecolor: color,
        linewidth: 2,
        showLabel: true,
      },
    });
    activeLines.push(line);

    // --- Overlay
    const overlay = document.createElement("div");
    overlay.className = "pnl-overlay";
    overlay.style.position = "absolute";
    overlay.style.padding = "12px 6px";
    overlay.style.background = "#fff";
    overlay.style.color = color;
    overlay.style.border = `1px solid ${color}`;
    overlay.style.borderRadius = "6px";
    overlay.style.fontSize = "12px";
    overlay.style.fontWeight = "500";
    overlay.style.boxShadow = "0 2px 6px rgba(0,0,0,0.15)";
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "1000";
    overlay.innerText = labelText;

    chartRoot.appendChild(overlay);
    activeOverlays.push(overlay);

    // --- Position updater
    const updateOverlayPosition = () => {
      const series = chart.getSeries()._series;
      const priceScale = series?.priceScale?.();
      if (priceScale && typeof priceScale.priceToCoordinate === "function") {
        const y = priceScale.priceToCoordinate(price);
        if (y != null && !isNaN(y)) {
          overlay.style.top = `${y - overlay.offsetHeight / 2}px`;
          const isSmallScreen = window.innerWidth <= 576;
          if (isSmallScreen) {
            overlay.style.left = "30px";
          } else {
            overlay.style.left = "50px"; // or compute from chart width
          }
        }
      }
    };

    updateOverlayPosition();

    // --- React to changes
    chart.onIntervalChanged().subscribe(null, updateOverlayPosition);
    chart.onVisibleRangeChanged().subscribe(null, updateOverlayPosition);

    const series = chart.getSeries()._series;
    const priceScale = series?.priceScale?.();
    if (priceScale?.onMarksChanged) {
      priceScale.onMarksChanged().subscribe(null, updateOverlayPosition);
    }
    if (priceScale?.onPriceRangeChanged) {
      priceScale.onPriceRangeChanged().subscribe(null, updateOverlayPosition);
    }

    // --- Cleanup on symbol change
    if (!chart._drawAnnotationCleanupAttached) {
      chart.onSymbolChanged().subscribe(null, () => {
        activeLines.forEach((line) => {
          try {
            chart.removeEntity(line);
          } catch {}
        });
        activeLines = [];
        activeOverlays.forEach((el) => el.remove());
        activeOverlays = [];
      });
      chart._drawAnnotationCleanupAttached = true;
    }
  } finally {
    isDrawing = false;
  }
};

export async function drawExitLineAndOverlay(
  chart: any,
  position: any,
  ltp: number,
  pnl: any,
  dispatch: any,
  router?: any
) {
  if (isDrawingExitLine) return;
  isDrawingExitLine = true;

  if (exitDrawRetryTimeout) {
    clearTimeout(exitDrawRetryTimeout);
    exitDrawRetryTimeout = null;
  }

  cleanupExitLine(chart);

  if (!chart || !position || !isFinite(ltp)) {
    isDrawingExitLine = false;
    return;
  }

  if (!chart.dataReady()) {
    exitDrawRetryTimeout = setTimeout(() => {
      isDrawingExitLine = false;
      drawExitLineAndOverlay(chart, position, ltp, pnl, dispatch, router);
    }, 1000);
    return;
  }
  exitDrawRetryTimeout = null;

  try {
    const iframe = document.querySelector(
      "iframe[src^='blob']"
    ) as HTMLIFrameElement;
    const chartLayout = iframe?.contentDocument?.querySelector(
      ".chart-container"
    ) as HTMLElement;
    const paneContents = Array.from(
      chartLayout.querySelectorAll(".chart-markup-table.pane")
    ) as HTMLElement[];
    const chartRoot = paneContents[0];
    if (!chartRoot) return;

    chartRoot.style.position = "relative";

    const lineColor = `${pnl <= 0 ? "#EF4444" : "#4CA858"}`
    const visibleRange = chart.getVisibleRange();
    if (!visibleRange) return;

    const { from, to } = visibleRange;
    const midTime = from + (to - from) / 2;

    const labelText = `Avg: ${formatNumber(position?.avg_net_price)} | Qty: ${position?.quantity} | P&L: ${formatNumber(pnl)}`;

    // --- Horizontal line
    activeExitShape = await chart.createMultipointShape(
      [{ time: midTime, price: ltp }],
      {
        shape: "horizontal_line",
        lock: true,
        disableSelection: true,
        disableSave: true,
        overrides: {
          linecolor: lineColor,
          linewidth: 2,
          linestyle: 0,
          showLabel: false,
        },
      }
    );

    // --- Label overlay
    const labelOverlay = document.createElement("div");
    labelOverlay.id = "exit-label-overlay";
    Object.assign(labelOverlay.style, {
      position: "absolute",
      padding: "12px 6px",
      background: "#fff",
      border: `1px solid ${lineColor}`,
      borderRadius: "6px",
      fontSize: "12px",
      fontWeight: "500",
      color: lineColor,
      whiteSpace: "nowrap",
      zIndex: "1000",
      pointerEvents: "none",
    });
    labelOverlay.innerText = labelText;
    chartRoot.appendChild(labelOverlay);
    activeExitLabelOverlay = labelOverlay;

    // --- Button overlay
    const buttonOverlay = document.createElement("div");
    buttonOverlay.id = "exit-button-overlay";
    buttonOverlay.style.position = "absolute";

    const exitBtn = document.createElement("button");
    exitBtn.innerText = "Exit";
    Object.assign(exitBtn.style, {
      background: "#EF4444",
      color: "#fff",
      border: "none",
      padding: "12px 6px",
      borderRadius: "3px",
      cursor: "pointer",
      fontSize: "12px",
    });

    buttonOverlay.appendChild(exitBtn);
    chartRoot.appendChild(buttonOverlay);
    activeExitButtonOverlay = buttonOverlay;

    // --- Overlay position updater
    const updateOverlayPosition = () => {
      const series = chart.getSeries()._series;
      const priceScale = series?.priceScale?.();

      if (priceScale && typeof priceScale.priceToCoordinate === "function") {
        const y = priceScale.priceToCoordinate(ltp);
        if (y != null && !isNaN(y)) {
          // Responsiveness logic
          const isSmallScreen = window.innerWidth <= 576;

          // Apply different styles based on screen size
          if (isSmallScreen) {
            labelOverlay.style.fontSize = "10px";
            labelOverlay.style.maxWidth = "200px";
            buttonOverlay.querySelectorAll("button").forEach((btn) => {
              (btn as HTMLElement).style.fontSize = "10px";
              (btn as HTMLElement).style.padding = "12px 4px";
            });
          }

          // Position overlays
          labelOverlay.style.top = `${y - labelOverlay.offsetHeight / 2}px`;
          labelOverlay.style.left = isSmallScreen ? "60px" : "130px";

          buttonOverlay.style.top = `${y - buttonOverlay.offsetHeight / 2}px`;
          buttonOverlay.style.left = isSmallScreen ? "20px" : "80px";
        }
      }
    };

    updateOverlayPosition();

    // subscribe to chart changes
    chart.onIntervalChanged().subscribe(null, updateOverlayPosition);
    chart.onVisibleRangeChanged().subscribe(null, updateOverlayPosition);

    const series = chart.getSeries()._series;
    const priceScale = series?.priceScale?.();
    if (priceScale?.onMarksChanged) {
      priceScale.onMarksChanged().subscribe(null, updateOverlayPosition);
    }
    if (priceScale?.onPriceRangeChanged) {
      priceScale.onPriceRangeChanged().subscribe(null, updateOverlayPosition);
    }

    // --- Exit click
    const identifier = chart.symbol();
    const brokerCode = getBrokerCode();
    let lot_size: number;
    try {
      if (symbolDataCache[identifier]) {
        //  Use cached data
        lot_size = symbolDataCache[identifier]?.lot_size;
      } else {
        // Fetch from API
        const getSymbol = new UserBrokerRouterApi(baseConfig());
        const brokerCode = getBrokerCode();

        const response =
          await getSymbol.getSymbolV1UsersMeBrokersBrokerCodeGetSymbolGet(
            brokerCode,
            identifier
          );

        if (response?.data?.lot_size) {
          lot_size = response?.data?.lot_size;
          symbolDataCache[identifier] = { lot_size };
        }
      }
    } catch (err) {
      console.error("Failed to fetch symbol lot size:", err);
      lot_size = 1; // fallback to safe default
    }
    exitBtn.onclick = () => {
      const transaction =
        position.transaction_type === "LONG" ? "SHORT" : "LONG";
      const lots = position?.lots;
      const orderDetails: any = [
        {
          index_name: position?.index_name,
          symbol: position?.symbol,
          exchange: position?.exchange,
          expiry: position?.expiry,
          strike_price: position?.strike_price,
          option_type: position?.option_type,
          ltp: ltp.toFixed(2),
          identifier,
          transaction_type: transaction,
          order_type: "LIMIT",
          lots: position?.quantity/lot_size||1 ,
          lot_size: lot_size,
          quantity: position?.quantity || lots * lot_size,
          product: position?.product || position?.product_type || "MIS",
        }
      ];
      dispatch(togglePlaceOrderVisibility(true));
      dispatch(setStockData(orderDetails))
    };

    // --- Cleanup on symbol change
    if (!chart._exitSymbolCleanupAttached) {
      chart.onSymbolChanged().subscribe(null, () => {
        cleanupExitLine(chart);
      });
      chart._exitSymbolCleanupAttached = true;
    }
  } finally {
    isDrawingExitLine = false;
  }
}
