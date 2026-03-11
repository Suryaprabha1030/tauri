import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { formatNumber } from "@/lib/util/DraftUtil";
import { toast } from "react-toastify";
import config from "@/lib/config";
import {
  setOpenOiSettings,
  setTvOiExpiry,
} from "@/lib/redux/slices/CommonSlice";
import { getOIColors, setOIState } from "@/lib/OItoggleExpiry";
import { tvWidget } from "./chartSetup";
import { getOrdinalSuffix } from "@/lib/util/DateUtil";
import { getBrokerCode } from "../helpers";

interface OIRow {
  strike_price: number;
  ce_oi: number;
  pe_oi: number;
  pe_ltp: number;
  ce_ltp: number;
  expiry: string;
}

interface TransformedOI {
  strike_price: number;
  ce_oi: number;
  pe_oi: number;
  expiry: string;
  ce_ltp?: number;
  pe_ltp?: number;
}
type Mode = "oi" | "chg" | "ltp" | "ltpChg";

/* ════════════════════════════════════════════════════════════════════════════
   OI PROFILE 
   ════════════════════════════════════════════════════════════════════════════ */
const oiPercentCache = new Map<string, any[]>();
let pollingInterval: NodeJS.Timeout | null = null;
export let expiryCache: Record<string, string> = {};
let expiryListCache: Record<string, any[]> = {};
const fetchTimestamps: Map<string, number> = new Map(); // key = `${symbol}-${mode}`
let currentMode: "oi" | "chg" | "ltp" | "ltpChg" = "oi";
let currentOverlay: HTMLDivElement | null = null;
let tvChart: any = null;
let toggleContainer: HTMLDivElement | null = null;

export let toggleButtonRefs: Record<string, HTMLDivElement> = {};
export let settingsButtonRefs: Record<string, HTMLDivElement> = {};
function rgbaToFullOpacity(color: string) {
  return color.replace(
    /rgba?\(([^,]+),([^,]+),([^,]+),[^)]+\)/,
    "rgba($1,$2,$3,1)"
  );
}
export const formatDate = (expiryDate: string): string => {
  const day: any = expiryDate && parseInt(expiryDate.slice(0, 2), 10);
  const month = expiryDate && expiryDate.slice(2, 5).toUpperCase();
  const year = expiryDate && expiryDate.slice(-2);

  return `${day}<sup>${getOrdinalSuffix(day)}</sup> ${month} ${year}`;
};

function drawOIBars(
  chart: any,
  rows: OIRow[],
  overlayContainer: HTMLElement,
  currentMode: "oi" | "chg" | "ltp" | "ltpChg"
) {
  const { ceBarColor, peBarColor } = getOIColors();

  if (!rows || rows.length === 0 || !chart?.getSeries) return;

  const priceseries = chart.getSeries()._series;
  if (!priceseries) return;

  const priceScale = priceseries.priceScale?.();

  if (!priceScale || typeof priceScale.priceToCoordinate !== "function") return;

  overlayContainer.innerHTML = "";

  // Tooltip setup
  let tooltipEl = document.getElementById("oi-tooltip") as HTMLDivElement;
  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.id = "oi-tooltip";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.background = "#ffffff";
    tooltipEl.style.color = "#000";
    tooltipEl.style.border = "1px solid #ccc";
    tooltipEl.style.borderRadius = "8px";
    tooltipEl.style.padding = "10px 12px";
    tooltipEl.style.fontSize = "13px";
    tooltipEl.style.fontFamily = "system-ui, sans-serif";
    tooltipEl.style.zIndex = "999999";
    tooltipEl.style.display = "none";
    tooltipEl.style.whiteSpace = "nowrap";
    tooltipEl.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.25)";
    tooltipEl.style.transition = "opacity 0.15s ease-out";
    tooltipEl.style.width = "180px";
    document.body.appendChild(tooltipEl);
  }
  const fullCeColor = rgbaToFullOpacity(ceBarColor);
  const fullPeColor = rgbaToFullOpacity(peBarColor);

  const showTooltip = (e: MouseEvent | Touch | any, row: OIRow) => {
    const modeLabels: Record<typeof currentMode, string> = {
      oi: "OI",
      chg: "OI Chg",
      ltp: "LTP",
      ltpChg: "LTP Chg",
    };

    const oiLabel = modeLabels[currentMode];

    tooltipEl.innerHTML = `
    <div style="font-family: system-ui, sans-serif; font-size: 13px; color: #111;">
      <div style="font-weight: 600; margin-bottom: 4px;">
        Strike: ${row.strike_price}
      </div>
      <div style="font-weight: 600; margin-bottom: 8px;">
        Expiry: ${formatDate(row.expiry)}
      </div>

      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
        <div style="width: 10px; height: 10px; background:${fullCeColor}; border-radius: 2px;"></div>
        <span><span style="min-width:55px; display: inline-block;">Call ${oiLabel} </span>  : <strong>${formatNumber(row.ce_oi)}</strong></span>
      </div>

     

      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
        <div style="width: 10px; height: 10px; background:${fullPeColor}; border-radius: 2px;"></div>
        <span><span style="min-width:55px; display: inline-block;">Put ${oiLabel}</span>    : <strong>${formatNumber(row.pe_oi)}</strong></span>
      </div>
 ${
   currentMode === "oi"
     ? `
      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
        <div style="width: 10px; height: 10px; background:white;"></div>
        <span><span style="min-width:55px; display: inline-block;">Call LTP </span> : <strong>${formatNumber(row.ce_ltp)}</strong></span>
      </div>

      <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
        <div style="width: 10px; height: 10px; background:white"></div>
        <span><span style="min-width:55px; display: inline-block;">Put LTP</span> : <strong>${formatNumber(row.pe_ltp)}</strong></span>
      </div>
      `
     : ""
 }
      
  `;

    tooltipEl.style.display = "block";
    tooltipEl.style.opacity = "1";

    const tooltipWidth = 180;
    const tooltipHeight = tooltipEl.offsetHeight || 130; // dynamic height fallback
    const pageWidth = window.innerWidth;
    const pageHeight = window.innerHeight;

    const clientX = "clientX" in e ? e.clientX : e.touches[0].clientX;
    const clientY = "clientY" in e ? e.clientY : e.touches[0].clientY;

    const left = Math.max(10, clientX - tooltipWidth - 10);

    // Clamp top position so tooltip stays within viewport
    let top = clientY + 10; // default below pointer
    const maxTop = pageHeight - tooltipHeight - 10;

    if (top > maxTop) {
      top = maxTop;
    } else if (top < 10) {
      top = 10;
    }

    tooltipEl.style.left = `${left}px`;
    tooltipEl.style.top = `${top}px`;
  };

  const hideTooltip = () => {
    tooltipEl.style.display = "none";
    tooltipEl.style.opacity = "0";
  };
  let hideTimeout: ReturnType<typeof setTimeout>;

  const scheduleHideTooltip = () => {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      hideTooltip();
    }, 2000); // auto-hide after 3 seconds
  };

  const maxOI = Math.max(
    ...rows.map((row) => Math.max(Math.abs(row.ce_oi), Math.abs(row.pe_oi)))
  );

  const maxBarWidth = 200;
  const hasNegative = rows.some((row) => row.ce_oi < 0 || row.pe_oi < 0);

  // Axis logic
  const baseRightOffset = 75;
  const maxNegative = Math.max(
    ...rows.map((row) =>
      Math.max(-Math.min(row.ce_oi, 0), -Math.min(row.pe_oi, 0))
    ),
    0
  );
  const maxPositive = Math.max(
    ...rows.map((row) => Math.max(row.ce_oi, row.pe_oi)),
    0
  );

  const totalRange = maxPositive + maxNegative || 1;
  const negativeWidth = (maxNegative / totalRange) * maxBarWidth;
  const axisOffset = hasNegative ? negativeWidth : 0;
  const adjustedRight = hasNegative
    ? baseRightOffset + negativeWidth
    : baseRightOffset;
  const getZoomLevel = (priceScale: any, centerPrice = 100): number => {
    const y1 = priceScale.priceToCoordinate(centerPrice);
    const y2 = priceScale.priceToCoordinate(centerPrice + 1);
    if (y1 == null || y2 == null) return 12; // fallback
    return Math.abs(y2 - y1); // pixels per price unit
  };

  for (const row of rows) {
    const y = priceScale.priceToCoordinate(row.strike_price);
    if (y == null) continue;

    const nextRow = rows[rows.indexOf(row) + 1];
    let nextY = null;

    if (nextRow) {
      nextY = priceScale.priceToCoordinate(nextRow.strike_price);
    }

    const availableSpace = nextY != null ? Math.abs(y - nextY) : 999;

    // Dynamic height: fit within available space, leave 1px gap
    const maxHeight = Math.max(6, availableSpace - 1);
    const zoomLevel = getZoomLevel(priceScale, row.strike_price);
    const desiredHeight = zoomLevel * 100;
    const barHeight = Math.min(36, Math.min(maxHeight, desiredHeight));

    const ceHeight = barHeight / 2;
    const peHeight = barHeight / 2;

    const ceWidth = (Math.abs(row.ce_oi) / maxOI) * maxBarWidth;
    const peWidth = (Math.abs(row.pe_oi) / maxOI) * maxBarWidth;

    const barWrapper = document.createElement("div");
    barWrapper.style.position = "absolute";
    barWrapper.style.top = `${y - barHeight / 2}px`;
    barWrapper.style.right = `${adjustedRight}px`;
    barWrapper.style.height = `${barHeight}px`;
    barWrapper.style.width = `${adjustedRight}px`;
    barWrapper.style.pointerEvents = "auto";

    // CE Bar
    const ceBar = document.createElement("div");
    ceBar.style.position = "absolute";
    ceBar.style.bottom = `${peHeight}px`;
    ceBar.style.height = `${ceHeight}px`;
    ceBar.style.background = `${ceBarColor}`;
    ceBar.style.borderRadius = "1px";

    if (hasNegative) {
      if (row.ce_oi >= 0) {
        ceBar.style.left = `${axisOffset}px`;
        ceBar.style.width = `${ceWidth}px`;
        ceBar.style.transform = `translateX(-100%)`; // align to axis
      } else {
        ceBar.style.left = `${axisOffset}px`;
        ceBar.style.width = `${ceWidth}px`; // grows right
      }
    } else {
      ceBar.style.right = "0px"; // align to axis at right edge
      ceBar.style.width = `${ceWidth}px`;
    }

    // PE Bar
    const peBar = document.createElement("div");
    peBar.style.position = "absolute";
    peBar.style.top = `${ceHeight}px`;
    peBar.style.height = `${peHeight}px`;
    peBar.style.background = `${peBarColor}`;
    peBar.style.borderRadius = "1px";

    if (hasNegative) {
      if (row.pe_oi >= 0) {
        peBar.style.left = `${axisOffset}px`;
        peBar.style.width = `${peWidth}px`;
        peBar.style.transform = `translateX(-100%)`;
      } else {
        peBar.style.left = `${axisOffset}px`;
        peBar.style.width = `${peWidth}px`;
      }
    } else {
      peBar.style.right = "0px";
      peBar.style.width = `${peWidth}px`;
    }
    // Hover events for desktop
    barWrapper.addEventListener("mouseenter", (e) => {
      ceBar.style.background = `${fullCeColor}`;
      peBar.style.background = `${fullPeColor}`;
      showTooltip(e, row);
    });

    barWrapper.addEventListener("mousemove", (e) => {
      showTooltip(e, row);
    });

    barWrapper.addEventListener("mouseleave", () => {
      ceBar.style.background = `${ceBarColor}`;
      peBar.style.background = `${peBarColor}`;
      hideTooltip();
    });

    // Touch events for mobile/tablet
    barWrapper.addEventListener(
      "touchstart",
      (e) => {
        const touch = e.touches[0];
        ceBar.style.background = `${fullCeColor}`;
        peBar.style.background = `${fullPeColor}`;
        showTooltip(touch, row);
        scheduleHideTooltip();
      },
      { passive: true }
    );

    barWrapper.addEventListener(
      "touchmove",
      (e) => {
        const touch = e.touches[0];
        showTooltip(touch, row);
      },
      { passive: true }
    );

    barWrapper.addEventListener("touchend", () => {
      ceBar.style.background = `${ceBarColor}`;
      peBar.style.background = `${peBarColor}`;
      scheduleHideTooltip();
    });

    barWrapper.appendChild(ceBar);
    barWrapper.appendChild(peBar);
    overlayContainer.appendChild(barWrapper);
  }
}

const fetchFirstLiveExpiryDate = async (
  brokerCode: string,
  oiIndex: string,
  exchange: string,
  dispatch: any,
  identifier: string
): Promise<string | null> => {
  const api = new UserBrokerRouterApi(baseConfig());

  try {
    const res =
      await api.getLiveExpiryDatesV1UsersMeBrokersBrokerCodeLiveExpiryDatesPost(
        brokerCode,
        oiIndex,
        exchange
      );

    const expiryDates = res?.data;

    if (Array.isArray(expiryDates)) {
      expiryListCache[identifier] = expiryDates.slice(0, 3); // ✅ store per symbol
    }

    if (Array.isArray(expiryDates) && expiryDates.length > 0) {
      dispatch(setTvOiExpiry(expiryDates[0]));
      return expiryDates[0];
    }

    return null;
  } catch (err) {
    console.error("Failed to fetch expiry dates:", err);
    return null;
  }
};

function transformOIData(
  rawData: any[],
  expiry: string,
  oiKey: "oi_change" | "latest_oi" | "latest_ltp" | "ltp_change"
): TransformedOI[] {
  const map = new Map<
    number,
    { ce_oi: number; pe_oi: number; ce_ltp?: number; pe_ltp?: number }
  >();

  for (const row of rawData) {
    const strike = row?.strike_price;
    const current = map.get(strike) || { ce_oi: 0, pe_oi: 0 };

    const oiValue = row[oiKey];

    if (row.option_type === "CE") {
      current.ce_oi = oiValue;
      current.ce_ltp = row?.latest_ltp;
    } else if (row.option_type === "PE") {
      current.pe_oi = oiValue;
      current.pe_ltp = row?.latest_ltp;
    }

    map.set(strike, current);
  }

  const result: TransformedOI[] = [];
  map.forEach((oi, strike_price) => {
    result.push({
      strike_price,
      ce_oi: oi.ce_oi,
      pe_oi: oi.pe_oi,
      ce_ltp: oi.ce_ltp,
      pe_ltp: oi.pe_ltp,
      expiry,
    });
  });

  result.sort((a, b) => a.strike_price - b.strike_price);
  return result;
}

export const fetchAndRenderCurrentMode = async (
  chart: any,
  container: HTMLDivElement,
  dispatch: any,
  force = false
) => {
  if (!chart) return;
  const symbolInfo = await chart.symbolExt();
  const identifier = symbolInfo?.ticker?.toUpperCase();
  const oiIdentifiers = Object.values(config.OIindices).map((v) =>
    v.toUpperCase()
  );
  const isOIIndex = oiIdentifiers.includes(identifier);

  container.style.opacity = isOIIndex ? "1" : "0.4";
  container.style.pointerEvents = isOIIndex ? "auto" : "none";

  if (!isOIIndex) {
    clearOIBars();
    return;
  }
  const brokerCode = getBrokerCode();
  const exchange = symbolInfo?.exchange;
  const matched = Object.entries(config.OIindices).find(
    ([_, v]) => v.toUpperCase() === identifier
  );
  const oiIndex = matched?.[0] || "";

  let expiry: any = expiryCache[identifier];
  if (!expiry) {
    expiry = await fetchFirstLiveExpiryDate(
      brokerCode,
      oiIndex,
      exchange,
      dispatch,
      identifier
    );

    if (!expiry) {
      toast.dismiss();
      toast("No expiry found", {
        toastId: "expiry-unavailable",
      });
      clearOIBars();
      return;
    }
    expiryCache[identifier] = expiry;
  }
  try {
    const cacheKey = `${identifier}-latestOIData`;
    const lastFetched = fetchTimestamps.get(cacheKey) || 0;
    const now = Date.now();
    const isStale = now - lastFetched > 180000 || force;

    // Always fetch this one API and cache
    if (!oiPercentCache.has(identifier) || isStale) {
      const percentRes = await new UserBrokerRouterApi(
        baseConfig()
      ).fetchLatestOiWithPercentageV1UsersMeBrokersBrokerCodeFetchLatestOiWithPercentagePost(
        brokerCode,
        oiIndex,
        expiry
      );

      const rawData = percentRes?.data?.strike_prices;

      if (!rawData?.length) {
        toast.dismiss();
        toast("OI data not available", {
          toastId: "Oi-data-unavailable",
        });
        clearOIBars();
        return;
      }

      oiPercentCache.set(identifier, rawData);
      fetchTimestamps.set(cacheKey, now);
    }

    const rawData: any = oiPercentCache.get(identifier);
    const oiKeyMap: Record<Mode, any> = {
      oi: "latest_oi",
      chg: "oi_change",
      ltp: "latest_ltp",
      ltpChg: "ltp_change",
    };

    const oiKey = oiKeyMap[currentMode];

    const data = transformOIData(rawData, expiry, oiKey);

    clearOIBars();
    if (data?.length) {
      await renderBars(chart, identifier, data);
    }
  } catch (err) {
    console.error("Fetch failed:", err);
    toast.dismiss();
    toast("OI data not available", {
      toastId: "Oi-data-unavailable",
    });
    clearOIBars();
  }
};

export const createCustomToggleButton = (
  tvWidget: any,
  dispatch: any,
  chartId: string,
  isMarketHoliday: any
): Promise<void> => {
  return new Promise<void>((resolve) => {
    tvWidget.headerReady().then(() => {
      tvChart = tvWidget.activeChart();
      if (chartId) {
        //  Check and reuse toggle button if exists
        toggleContainer = toggleButtonRefs[chartId] ?? null;

        if (!toggleContainer) {
          const btn = tvWidget.createButton() as HTMLDivElement;

          btn.style.cssText =
            "display: flex; align-items: center; gap: 8px; border: none; background: transparent;";

          toggleButtonRefs[chartId] = btn;
          toggleContainer = btn;

          const {
            toggleWrapper,
            oiToggle,
            chgToggle,
            ltpToggle,
            ltpChgToggle,
          } = createToggleWrapper();
          toggleContainer.appendChild(toggleWrapper);

          //   const updateToggleUI = () => {
          //     [oiToggle, chgToggle, ltpToggle, ltpChgToggle].forEach((el) => {
          //       el.style.backgroundColor = "transparent";
          //       el.style.color = "#000";
          //       el.style.fontWeight = "500";
          //     });

          //     let activeToggle;
          //     switch (currentMode) {
          //       case "chg":
          //         activeToggle = chgToggle;
          //         break;
          //       case "ltp":
          //         activeToggle = ltpToggle;
          //         break;
          //       case "ltpChg":
          //         activeToggle = ltpChgToggle;
          //         break;
          //       default:
          //         activeToggle = oiToggle;
          //     }

          //     activeToggle.style.backgroundColor = "#4CAF50";
          //     activeToggle.style.color = "#fff";
          //     activeToggle.style.fontWeight = "600";
          //   };

          //   const handleToggleClick = async (mode: typeof currentMode) => {
          //     if (mode === currentMode) return;
          //     currentMode = mode;
          //     updateToggleUI();

          //     const symbolInfo = await tvChart.symbolExt();
          //     const identifier = symbolInfo?.ticker?.toUpperCase();
          //     const rawData = oiPercentCache.get(identifier);
          //     if (!rawData || !identifier) return;

          //     let expiry = expiryCache[identifier];
          //     if (!expiry && rawData.length > 0) {
          //       expiry = rawData[0]?.expiry || "";
          //     }

          //     if (!expiry) return;

          //     const oiKeyMap: Record<typeof currentMode, any> = {
          //       oi: "latest_oi",
          //       chg: "oi_change",
          //       ltp: "latest_ltp",
          //       ltpChg: "ltp_change",
          //     };

          //     const oiKey = oiKeyMap[currentMode];
          //     const transformed = transformOIData(rawData, expiry, oiKey);

          //     clearOIBars();
          //     if (transformed.length) {
          //       await renderBars(tvChart, identifier, transformed);
          //     }
          //   };

          //   // Attach listeners to individual buttons
          //   oiToggle.addEventListener("click", () => handleToggleClick("oi"));
          //   chgToggle.addEventListener("click", () => handleToggleClick("chg"));
          //   ltpToggle.addEventListener("click", () => handleToggleClick("ltp"));
          //   ltpChgToggle.addEventListener("click", () =>
          //     handleToggleClick("ltpChg")
          //   );

          //   updateToggleUI();
          //   setOIState(tvChart, toggleContainer, dispatch);
          // }

          setOIState(tvChart, toggleContainer, dispatch);
        }

        //  SETTINGS BUTTON — track per chartId
        let settingsButton = settingsButtonRefs[chartId];
        if (!settingsButton) {
          settingsButton = document.createElement("div");
          settingsButton.style.marginLeft = "4px";
          const img = document.createElement("img");
          img.src = "/svg/settingsicon.svg";
          img.alt = "OI Settings";
          img.width = 18;
          img.height = 18;
          img.style.display = "block";
          img.style.objectFit = "contain";
          settingsButton.appendChild(img);

          settingsButton.style.cursor = "pointer";
          settingsButton.title = "OI Settings";

          settingsButton.addEventListener("click", () => {
            const symbol = tvChart?.symbol?.().toUpperCase?.() || "";
            dispatch(setOpenOiSettings(expiryListCache[symbol] || []));
          });

          settingsButtonRefs[chartId] = settingsButton;
        }

        //  Ensure not already appended
        if (!toggleContainer.contains(settingsButton)) {
          toggleContainer.appendChild(settingsButton);
        }

        //  Symbol change listener
        tvChart.onSymbolChanged().subscribe(null, async () => {
          stopPolling();
          await fetchAndRenderCurrentMode(
            tvChart,
            toggleContainer!,
            dispatch,
            true
          );
          startPolling(dispatch, isMarketHoliday);
        });

        // Initial fetch
        let hasRenderedInitialProfile = false;
        tvWidget.onChartReady(async () => {
          const symbolInfo = await tvChart.symbolExt();
          const identifier = symbolInfo?.ticker?.toUpperCase();
          const oiIdentifiers = Object.values(config.OIindices).map((v) =>
            v.toUpperCase()
          );
          const isOIIndex = oiIdentifiers.includes(identifier);

          if (isOIIndex && !hasRenderedInitialProfile) {
            await fetchAndRenderCurrentMode(
              tvChart,
              toggleContainer!,
              dispatch,
              true
            );
            hasRenderedInitialProfile = true;
            startPolling(dispatch, startPolling);
          }
        });

        resolve();
      }
    });
  });
};
export const destroyCustomToggleButton = (chartId: string) => {
  const toggle = toggleButtonRefs[chartId];

  if (toggle) {
    toggle.remove();
    delete toggleButtonRefs[chartId];
  }

  const settings = settingsButtonRefs[chartId];

  if (settings) {
    settings.remove();
    delete settingsButtonRefs[chartId];
  }
};

function startPolling(dispatch: any, isMarketHoliday: any) {
  if (pollingInterval) clearInterval(pollingInterval);
  pollingInterval = setInterval(async () => {
    if (!config.isTradingTime() && !isMarketHoliday) return;

    await fetchAndRenderCurrentMode(tvChart, toggleContainer!, dispatch, true);
  }, 180000);
}

export function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

function clearOIBars() {
  if (currentOverlay && currentOverlay.parentNode) {
    currentOverlay.parentNode.removeChild(currentOverlay);
    currentOverlay = null;
  }
  const tooltip = document.getElementById("oi-tooltip");
  if (tooltip) tooltip.style.display = "none";
}

async function renderBars(chart: any, identifier: string, data: any) {
  clearOIBars();

  const iframe = document.querySelector(
    "iframe[src^='blob']"
  ) as HTMLIFrameElement;
  const chartRoot = iframe?.contentDocument?.querySelector(".chart-container");
  if (!chartRoot) return;

  const oldOverlay = chartRoot.querySelector("#oi-bars-overlay");
  if (oldOverlay) oldOverlay.remove();

  const overlay = document.createElement("div");
  overlay.id = "oi-bars-overlay";
  overlay.dataset.mode = currentMode;
  overlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  `;
  chartRoot.appendChild(overlay);
  currentOverlay = overlay;

  drawOIBars(chart, data, overlay, currentMode);

  const series = chart.getSeries()._series;
  const priceScale = series?.priceScale?.();
  if (priceScale?.onMarksChanged) {
    priceScale.onMarksChanged().subscribe(null, () => {
      if (currentOverlay && currentOverlay.dataset.mode === currentMode) {
        const rawData = oiPercentCache.get(identifier);
        if (rawData) {
          const expiry = data?.[0]?.expiry || "";
          const oiKeyMap: Record<typeof currentMode, any> = {
            oi: "latest_oi",
            chg: "oi_change",
            ltp: "latest_ltp",
            ltpChg: "ltp_change",
          };

          const oiKey = oiKeyMap[currentMode];
          const transformed: any = transformOIData(rawData, expiry, oiKey);
          drawOIBars(chart, transformed, currentOverlay, currentMode);
        }
      }
    });
  }
}

// function createToggleWrapper() {
//   const wrapper = document.createElement("div");
//   wrapper.style.cssText = `
//     display: flex;
//     align-items: center;
//     border: 2px solid #4CAF50;
//     border-radius: 999px;
//     cursor: pointer;
//     overflow: hidden;
//     background-color: #fff;
//     padding: 3px;
//   `;

//   const oi = document.createElement("div");
//   oi.textContent = "OI";
//   styleToggle(oi);

//   const chg = document.createElement("div");
//   chg.textContent = "OI Chg";
//   styleToggle(chg);

//   const ltp = document.createElement("div");
//   ltp.textContent = "LTP";
//   styleToggle(ltp);

//   const ltpChg = document.createElement("div");
//   ltpChg.textContent = "LTP Chg";
//   styleToggle(ltpChg);

//   wrapper.appendChild(oi);
//   wrapper.appendChild(chg);
//   wrapper.appendChild(ltp);
//   wrapper.appendChild(ltpChg);

//   return {
//     toggleWrapper: wrapper,
//     oiToggle: oi,
//     chgToggle: chg,
//     ltpToggle: ltp,
//     ltpChgToggle: ltpChg,
//   };
// }

function createToggleWrapper() {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    display: flex;
    align-items: center;
    cursor: pointer;
    background-color: #fff;
    padding: 3px;
  `;

  //  OI Profile checkbox
  const oi = document.createElement("div");
  oi.style.display = "flex";
  oi.style.alignItems = "center";
  oi.style.gap = "5px";

  // const oiCheckbox = document.createElement("input");
  // oiCheckbox.type = "checkbox";
  // oiCheckbox.id = "oiProfileCheckbox";
  // oiCheckbox.checked = true; // ✅ default checked on load

  const oiLabel = document.createElement("label");
  // oiLabel.setAttribute("for", oiCheckbox.id);
  oiLabel.textContent = "Open Interest";

  // oi.appendChild(oiCheckbox);
  oi.appendChild(oiLabel);

  wrapper.appendChild(oi);

  // Hidden placeholders (keep same return signature)
  const chg = document.createElement("div");
  chg.style.display = "none";

  const ltp = document.createElement("div");
  ltp.style.display = "none";

  const ltpChg = document.createElement("div");
  ltpChg.style.display = "none";

  return {
    toggleWrapper: wrapper,
    oiToggle: oi,
    chgToggle: chg,
    ltpToggle: ltp,
    ltpChgToggle: ltpChg,
  };
}

function styleToggle(el: HTMLElement) {
  el.style.padding = "4px 12px";
  el.style.textAlign = "center";
  el.style.fontWeight = "500";
  el.style.fontSize = "10px";
  el.style.borderRadius = "999px";
  el.style.transition = "all 0.2s ease";
}

export const rgbaToHexOpacity = (rgba: string) => {
  const match = rgba.match(/rgba?\((\d+),(\d+),(\d+),([\d.]+)\)/);
  if (!match) return { hex: "#000000", opacity: 100 };
  const [, r, g, b, a] = match;
  const hex =
    "#" +
    [r, g, b]
      .map((x) => {
        const hexPart = parseInt(x).toString(16);
        return hexPart.length === 1 ? "0" + hexPart : hexPart;
      })
      .join("");
  const opacity = Math.round(parseFloat(a) * 100);
  return { hex, opacity };
};
export const hexOpacityToRgba = (hex: string, opacity: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = opacity / 100;
  return `rgba(${r},${g},${b},${a})`;
};
