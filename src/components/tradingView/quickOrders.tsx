import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { getBrokerCode } from "../helpers";
import { handlePlaceOrder } from "@/lib/util/placeOrder/placeOrder";
import { toast } from "react-toastify";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { getPositionsData } from "@/lib/OItoggleExpiry";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

let activeOverlay: HTMLElement | null = null;
let activeShape: any = null;
let activeBSOverlay: HTMLElement | null = null;
let overlayAnimationId: number | null = null;

export function showActionOverlay(
  price: number,
  y: number,
  container: HTMLElement,
  symbolInfo: any,
  chart: any,
  dispatch: any,
  router?: any
) {
  // --- Cleanup any previous overlay ---
  if (activeBSOverlay) {
    activeBSOverlay.remove();
    activeBSOverlay = null;
  }
  if (overlayAnimationId) {
    cancelAnimationFrame(overlayAnimationId);
    overlayAnimationId = null;
  }
  const positionsdata = getPositionsData();
  // --- Create fresh overlay ---
  const overlay = document.createElement("div");
  overlay.id = "tv-plus-overlay";
  overlay.style.position = "absolute";
  overlay.style.display = "flex";
  overlay.style.gap = "8px";
  overlay.style.background = "transparent";
  overlay.style.padding = "0";
  overlay.style.border = "none";
  container.appendChild(overlay);

  activeBSOverlay = overlay;

  const symbol = symbolInfo?.name;
  const symbolType = symbolInfo.symbol_type;

  const options = [
    { label: "B", color: "#4CAF50", action: "B", orderType: "Limit" },
    { label: "S", color: "#F44336", action: "S", orderType: "Limit" },
  ];

  options.forEach(({ label, color, action, orderType }) => {
    const button = document.createElement("div");
    button.innerText = label;
    button.style.width = "28px";
    button.style.height = "20px";
    button.style.display = "flex";
    button.style.alignItems = "center";
    button.style.justifyContent = "center";
    button.style.background = color;
    button.style.color = "white";
    button.style.fontWeight = "600";
    button.style.borderRadius = "6px";
    button.style.cursor = "pointer";
    button.style.fontSize = "12px";
    button.onclick = () => {
      drawOrderLineAndOverlay(
        chart,
        container,
        price,
        symbol,
        symbolType,
        action as "B" | "S",
        orderType as "Limit" | "MKT",
        dispatch,
        positionsdata,
        router
      );
      overlay.remove();
      activeBSOverlay = null;
      if (overlayAnimationId) {
        cancelAnimationFrame(overlayAnimationId);
        overlayAnimationId = null;
      }
    };

    overlay.appendChild(button);
  });

  // --- Close on outside click ---
  const handleOutsideClick = (event: MouseEvent) => {
    if (!overlay.contains(event.target as Node)) {
      overlay.remove();
      activeBSOverlay = null;
      document.removeEventListener("mousedown", handleOutsideClick);
    }
  };
  setTimeout(() => {
    document.addEventListener("mousedown", handleOutsideClick);
  }, 0);

  // --- Sync overlay with price scale ---
  function updateOverlayPosition() {
    const series = chart.getSeries()._series;
    const priceScale = series?.priceScale?.();
    if (priceScale) {
      const yCoord = priceScale.priceToCoordinate(price);
      if (yCoord != null) {
        overlay.style.top = `${yCoord - overlay.offsetHeight / 2}px`;
        overlay.style.left = `${container.clientWidth - 100}px`; // adjust margin
      }
    }
    overlayAnimationId = requestAnimationFrame(updateOverlayPosition);
  }
  updateOverlayPosition();

  // --- Clean up on symbol change ---
  chart.onSymbolChanged().subscribe(null, () => {
    overlay.remove();
    activeBSOverlay = null;
    if (overlayAnimationId) {
      cancelAnimationFrame(overlayAnimationId);
      overlayAnimationId = null;
    }
  });
}

export async function drawOrderLineAndOverlay(
  chart: any, // Type as IChartWidgetApi for TypeScript
  container: HTMLElement,
  price: number,
  symbol: string,
  symbolType: any,
  action: "B" | "S",
  orderKind: "Limit" | "MKT",
  dispatch: any,
  positionsdata: any,
  router?: any
) {
  // Clean up previous overlay and shape
  if (activeOverlay) {
    activeOverlay.remove();
    activeOverlay = null;
  }
  if (activeShape) {
    chart.removeEntity(activeShape);
    activeShape = null;
  }

  // Verify container
  if (!container) {
    console.error("Container is null or undefined");
    return;
  }

  // Create horizontal line using createMultipointShape

  const lineColor = action == "B" ? "#4CA856" : "#EF4444";
  const shapeId = await chart.createMultipointShape(
    [{ time: Math.floor(Date.now() / 1000), price }],
    {
      shape: "horizontal_line",
      text: `${action} @ ₹${price.toFixed(2)}`,
      disableSelection: true, // Disable dragging
      disableSave: true,
      lock: true,
      overrides: {
        linecolor: lineColor,
        linewidth: 2,
        linestyle: 2, // Dashed line
      },
    }
  );

  activeShape = shapeId;

  // Create overlay
  const overlay = document.createElement("div");
  overlay.id = "tv-order-panel";
  overlay.dataset.lineId = shapeId;
  overlay.classList.add("tv-order-panel");
  overlay.style.position = "absolute";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.gap = "8px";
  overlay.style.fontSize = "11px";
  overlay.style.background = "#fff";
  overlay.style.right = "100px"; // Adjusted for visibility
  // Position overlay at the price level
  const series = chart?.getSeries()._series;
  const priceScale = series?.priceScale?.();
  const y = priceScale.priceToCoordinate(price, true);
  overlay.style.top = `${y - (overlay.offsetHeight || 20) / 2}px`;
  container.appendChild(overlay);
  activeOverlay = overlay;

  let lot_size: number = 1; // default fallback
  const symbolInfo = chart?.symbol();
  const identifier = symbolInfo;
  const getSymbol = new UserBrokerRouterApi(baseConfig());
  const brokerCode = getBrokerCode();
  try {
    const response =
      await getSymbol.getSymbolV1UsersMeBrokersBrokerCodeGetSymbolGet(
        brokerCode,
        identifier
      );

    if (response?.data?.lot_size) {
      lot_size = response?.data?.lot_size;
    }
  } catch (error: any) {
    if (error?.response && error?.response.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (error?.response && error?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }
    console.error("Failed to fetch symbol info:", error);
    // fallback → default to 1 lot
    lot_size = 1;
  }

  // Add overlay elements (action button, quantity input, order type, cancel button)
  const actionBtn = document.createElement("button");
  actionBtn.innerText = action == "B" ? "BUY" : "SELL";
  actionBtn.style.background = action === "B" ? "#4CA856" : "#EF4444";
  actionBtn.style.color = "#fff";
  actionBtn.style.border = "none";
  actionBtn.style.borderRadius = "6px";
  actionBtn.style.padding = "1px 1px";
  actionBtn.style.width = "30px";
  actionBtn.style.height = "24px";
  actionBtn.style.display = "flex";
  actionBtn.style.alignItems = "center";
  actionBtn.style.justifyContent = "center";
  actionBtn.style.fontWeight = "500";
  actionBtn.style.font = "20px";
  actionBtn.style.cursor = "pointer";

  //Quantity field
  const qtyInput = document.createElement("input");
  let localQty = lot_size;

  qtyInput.type = "number";
  qtyInput.value = String(localQty);
  qtyInput.min = String(lot_size);
  qtyInput.step = String(lot_size);
  qtyInput.style.width = "60px";
  qtyInput.style.padding = "4px";
  qtyInput.style.border = "1px solid #ccc";
  qtyInput.style.borderRadius = "4px";
  qtyInput.style.textAlign = "center";

  qtyInput.addEventListener("focus", (e) => {
    (e.target as HTMLInputElement).select();
  });

  qtyInput.addEventListener("change", (e) => {
    const newValue = parseInt((e.target as HTMLInputElement).value, 10);
    const finalValue =
      isNaN(newValue) || newValue < lot_size
        ? lot_size
        : Math.round(newValue / lot_size) * lot_size;

    localQty = finalValue;
    qtyInput.value = String(finalValue); // reflect formatted value
  });

  qtyInput.addEventListener("blur", () => {
    const newValue = parseInt(qtyInput.value, 10);
    const finalValue =
      isNaN(newValue) || newValue < lot_size
        ? lot_size
        : Math.round(newValue / lot_size) * lot_size;

    localQty = finalValue;
    qtyInput.value = String(finalValue);
  });

  qtyInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      qtyInput.blur(); // trigger blur to finalize
    }
  });
  qtyInput.addEventListener("mousedown", (e) => e.stopPropagation());

  const orderType = document.createElement("select");
  ["LIMIT", "MKT"].forEach((type) => {
    const option = document.createElement("option");
    option.value = type.toLowerCase();
    option.innerText = type;
    orderType.appendChild(option);
  });
  orderType.value = orderKind.toLowerCase();
  orderType.style.padding = "4px";
  orderType.style.border = "1px solid #ccc";
  orderType.style.borderRadius = "4px";

  const matchingPosition =
    positionsdata &&
    positionsdata?.length > 0 &&
    positionsdata?.find((pos) => pos.identifier === identifier);

  const isInPositions = Boolean(matchingPosition);
  //product type
  const productType = document.createElement("select");

  // Determine if F&O or not
  const isFnO =
    symbolType.includes("options") || symbolType.includes("futures");

  // Set initial options
  const productOptions = isFnO ? ["NRML", "MIS"] : ["CNC", "MIS"];

  productOptions.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.innerText = type;
    productType.appendChild(option);
  });

  if (isFnO) {
    productType.value = "NRML";
  } else if (isInPositions) {
    // Set productType value from positionsdata product or product_type
    productType.value =
      matchingPosition?.product || matchingPosition?.product_type || "MIS";
  } else {
    productType.value = action === "S" ? "MIS" : "CNC";
  }

  // Prevent selecting CNC on Sell for non-F&O
  productType.addEventListener("change", (e) => {
    const selected = (e.target as HTMLSelectElement).value;

    if (!isInPositions && !isFnO && action === "S" && selected === "CNC") {
      // Revert to MIS
      productType.value = "MIS";

      // Show toast
      toast("CNC not allowed for Stocks with transaction type Sell");
    }
  });

  // Style
  productType.style.padding = "4px";
  productType.style.border = "1px solid #ccc";
  productType.style.borderRadius = "4px";
  productType.style.textTransform = "uppercase";

  //cancel button
  const cancelBtn = document.createElement("button");
  cancelBtn.innerText = "✕";
  cancelBtn.style.border = "none";
  cancelBtn.style.background = "#eee";
  cancelBtn.style.cursor = "pointer";
  cancelBtn.style.borderRadius = "50%";
  cancelBtn.style.width = "22px";
  cancelBtn.style.height = "22px";
  cancelBtn.onclick = () => {
    overlay.remove();
    chart.removeEntity(activeShape);
    activeOverlay = null;
  };

  // Handle order placement
  actionBtn.onclick = () => {
    const transaction = action === "B" ? "LONG" : "SHORT";
    const orderTypeValue = orderType.value;
    const orderTag = orderTypeValue === "limit" ? "LIMIT" : "MARKET";
    const lots = parseInt(qtyInput.value, 10);
    const product = productType.value;

    const orderDetails = [
      {
        ltp: price.toFixed(2),
        identifier: identifier,
        transaction_type: transaction,
        order_type: orderTag,
        lots: lots,
        lot_size: lot_size,
        quantity: lots * lot_size,
        product: product,
      },
    ];

    handlePlaceOrder(orderDetails, brokerCode, dispatch, router);
    if (activeOverlay) {
      activeOverlay.remove();
      activeOverlay = null;
    }
    if (activeShape) {
      chart.removeEntity(activeShape);
    }
  };
  //To remove overlay at symbol change
  if (!chart._symbolChangeCleanupAttached) {
    chart.onSymbolChanged().subscribe(null, () => {
      // Remove overlay
      if (activeOverlay) {
        activeOverlay.remove();
        activeOverlay = null;
      }

      // Remove shape
      if (activeShape) {
        chart.removeEntity(activeShape);

        activeShape = null;
      }
    });

    // Prevent attaching multiple listeners
    chart._symbolChangeCleanupAttached = true;
  }

  overlay.appendChild(actionBtn);
  overlay.appendChild(qtyInput);
  overlay.appendChild(orderType);
  overlay.appendChild(productType);
  overlay.appendChild(cancelBtn);
  let animationFrameId: number;

  function updateOverlayPosition() {
    const series = chart.getSeries()._series;
    const priceScale = series?.priceScale?.();

    if (!priceScale || typeof priceScale.priceToCoordinate !== "function") {
      animationFrameId = requestAnimationFrame(updateOverlayPosition);
      return;
    }

    const y = priceScale.priceToCoordinate(price);
    if (y != null && !isNaN(y)) {
      const overlayHeight = overlay.offsetHeight || 20;

      // Get Y position relative to container
      const topLimit = 10; // top margin to avoid header
      const bottomLimit = container.clientHeight - 40; // bottom margin to avoid footer

      if (y >= topLimit && y <= bottomLimit) {
        // Display and position overlay
        overlay.style.display = "flex";
        overlay.style.top = `${y - overlayHeight / 2}px`;
      } else {
        // Hide if out of bounds
        overlay.style.display = "none";
      }
    }

    animationFrameId = requestAnimationFrame(updateOverlayPosition);
  }

  // Start syncing overlay position
  updateOverlayPosition();

  if (priceScale?.onMarksChanged) {
    priceScale.onMarksChanged().subscribe(null, updateOverlayPosition);
  }
  if (priceScale?.onPriceRangeChanged) {
    priceScale.onPriceRangeChanged().subscribe(null, updateOverlayPosition);
  }
  window.addEventListener("resize", () => {
    if (activeOverlay) {
      activeOverlay.remove();
      activeOverlay = null;
    }
    if (activeShape) {
      chart.removeEntity(activeShape);
      activeShape = null;
    }
  });

  // Optional cleanup when overlay is removed
  const observer = new MutationObserver(() => {
    if (!document.body.contains(overlay)) {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
