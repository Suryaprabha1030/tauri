import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  setStockData,
  togglePlaceOrderVisibility,
} from "@/lib/redux/slices/PlaceOrder";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setToggleChart } from "@/lib/redux/slices/CommonSlice";
import { setIsSidetabCollapsed } from "@/lib/redux/slices/CommonSlice";
import { formatNumber } from "@/lib/util/DraftUtil";
import config from "@/lib/config";
import OiIndex from "../shared/ChartLayout/oiComponent/oiChartTool/OiIndex";
import { getBrokerCode } from "../helpers";
import { handlePlaceOrder } from "@/lib/util/placeOrder/placeOrder";
import { tvWidget } from "./chartSetup";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

const createButton = (
  tvWidget: any,
  text: string,
  backgroundColor: string,
  onClick: () => void,
  id: string
): HTMLButtonElement => {
  const button = tvWidget.createButton();
  button.textContent = text;
  button.id = id;

  button.style.backgroundColor = backgroundColor;
  button.style.color = "white";
  button.style.border = "none";
  button.style.padding = "3px 11px";
  button.style.fontSize = "12px";
  button.style.cursor = "pointer";
  button.style.borderRadius = "6px";
  button.style.fontWeight = "600";
  button.style.display = "flex";
  button.style.alignItems = "center";
  button.style.justifyContent = "center";
  button.style.margin = "0 auto";

  button.addEventListener("click", onClick);
  return button;
};

// Create Maps instead of single refs
export let buyButtonRefs: Map<string, HTMLButtonElement> = new Map();
export let sellButtonRefs: Map<string, HTMLButtonElement> = new Map();

export const resetButtonRefs = (chartId: string) => {
  if (buyButtonRefs && sellButtonRefs) {
    buyButtonRefs.delete(chartId);
    sellButtonRefs.delete(chartId);
  }
};

export const createBuySellButton = (
  tvWidget: any,
  dispatch: ReturnType<typeof useDispatch>,
  buttonhide: boolean,
  chartId: string,
  router: any
) => {
  return new Promise<void>((resolve) => {
    tvWidget.headerReady().then(() => {
      if (chartId) {
        const existingBuyRef = buyButtonRefs.get(chartId);
        const existingSellRef = sellButtonRefs.get(chartId);

        if (!existingBuyRef && !existingSellRef) {
          const buyBtn = createButton(
            tvWidget,
            "B",
            "#4CAF50",
            () => handleButtonClick(tvWidget, dispatch, "LONG", router),
            "buyButton"
          );

          const sellBtn = createButton(
            tvWidget,
            "S",
            "#EF4444",
            () => handleButtonClick(tvWidget, dispatch, "SHORT", router),
            "sellButton"
          );

          tvWidget.header?.appendChild(buyBtn);
          tvWidget.header?.appendChild(sellBtn);

          buyButtonRefs.set(chartId, buyBtn);
          sellButtonRefs.set(chartId, sellBtn);
        }

        const buyRef = buyButtonRefs.get(chartId);
        const sellRef = sellButtonRefs.get(chartId);

        if (buyRef && sellRef) {
          if (buttonhide) {
            buyRef.style.opacity = "1";
            buyRef.style.pointerEvents = "auto";
            sellRef.style.opacity = "1";
            sellRef.style.pointerEvents = "auto";
          } else {
            buyRef.style.opacity = "0.3";
            buyRef.style.pointerEvents = "none";
            sellRef.style.opacity = "0.3";
            sellRef.style.pointerEvents = "none";
          }
        }

        resolve();
      }
    });
  });
};

const handleButtonClick = async (
  tvWidget: any,
  dispatch: ReturnType<typeof useDispatch>,
  transactionType: "LONG" | "SHORT", 
  router: any
) => {
  try {
    const symbolInfo = await tvWidget?.activeChart()?.symbolExt();
    const identifier = symbolInfo?.ticker;
    const getSymbol = new UserBrokerRouterApi(baseConfig());
    const brokerCode = getBrokerCode();
    const response =
      await getSymbol.getSymbolV1UsersMeBrokersBrokerCodeGetSymbolGet(
        brokerCode,
        identifier
      );
    const stock: any = response?.data;
    const stockdata: any = [
      {
        ...stock,
        index_name: stock.symbol_name,
        transaction_type: transactionType,
      },
    ];
    if (stock.symbol_type === "index") {
      toast("Order Cannot be Placed for Indices");
    } else {
      dispatch(setStockData(stockdata));
      dispatch(togglePlaceOrderVisibility(true));
    }
  } catch (error: any) {
    if (error?.response && error?.response?.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
  }
};

export const createScreenerButton = (
  tvWidget: any,
  text: string,
  handleToggle: (
    state: string,
    dispatch: ReturnType<typeof useDispatch>
  ) => void,
  state: string,
  dispatch: ReturnType<typeof useDispatch>
) => {
  tvWidget.headerReady().then(() => {
    const button = tvWidget.createButton();
    button.textContent = text;
    button.style.backgroundColor = "white";
    button.style.color = "black";
    button.style.padding = "5px 10px";
    button.style.margin = "5px";
    button.style.cursor = "pointer";
    button.style.borderRadius = "4px";
    button.style.transition = "background-color 0.2s ease-in-out";

    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "oklch(0.968 0.007 247.896)";
    });

    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = "white";
    });

    button.addEventListener("click", () => handleToggle(state, dispatch));
    tvWidget.header?.appendChild(button);
  });
};

export const handleToggle = (
  state: string,
  dispatch: ReturnType<typeof useDispatch>
) => {
  dispatch(setToggleChart(state));
};

export const createWatchlistButton = (
  tvWidget: any,
  dispatch: any,
  isSideTabCollapsed: boolean
) => {
  return new Promise<void>((resolve) => {
    if (!tvWidget) {
      console.error("TradingView Widget is not initialized yet.");
      return resolve();
    }

    if (typeof tvWidget.headerReady !== "function") {
      console.error("headerReady() is not available on tvWidget.");
      return resolve();
    }

    tvWidget.headerReady().then(() => {
      const button = tvWidget.createButton();
      button.classList.add("watchlist-button");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = "WlCheckbox";

      const label = document.createElement("label");
      label.setAttribute("for", checkbox.id);
      label.textContent = "Watchlists";

      button.textContent = "";
      button.appendChild(checkbox);
      button.appendChild(label);
      button.style.display = "flex";
      button.style.gap = "5px";
      checkbox.checked = !isSideTabCollapsed;

      const handleResize = () => {
        const shouldDisable = window.innerWidth < 1200;
        checkbox.disabled = shouldDisable;
        if (shouldDisable) {
          checkbox.checked = true;
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      checkbox.addEventListener("change", () => {
        dispatch(setIsSidetabCollapsed(!checkbox.checked));
      });

      tvWidget.header?.appendChild(button);
      resolve();
    });
  });
};

export const createFutButton = async (
  tvWidget: any,
  defaultFutSymbol: string,
  defaultIndexSymbol: string,
  supportedIndexIdentifiers: string[],
  getFirstFut: () => { identifier: string } | null,
  router: any
) => {
  return new Promise<void>((resolve) => {
  let lastSeenFutSymbol: string | null = null;
  let lastSeenIdxSymbol: string | null = null;
  let lastApiCallIndex: string | null = null;

  tvWidget.headerReady().then(() => {
    const button = tvWidget.createButton();
    styleButton(button);

    const chart = tvWidget.activeChart();

    const updateButtonState = () => {
      const symbolInfo = chart.symbolExt();
      const currentSymbol = symbolInfo?.ticker;

      const isFut = currentSymbol?.includes("FUT");
      const isIndex = supportedIndexIdentifiers.includes(currentSymbol);

      let futSymbol = defaultFutSymbol;
      let indexSymbol = defaultIndexSymbol;

      if (isFut) {
        lastSeenFutSymbol = currentSymbol;
        indexSymbol = lastSeenIdxSymbol ? lastSeenIdxSymbol : defaultIndexSymbol;
        button.textContent = "INDEX";
      } else if (isIndex) {
        const fallbackFut = getFirstFut();
        futSymbol =
          lastSeenFutSymbol != null
            ? lastSeenFutSymbol
            : fallbackFut?.identifier || "";
        indexSymbol = currentSymbol;
        lastSeenIdxSymbol = currentSymbol
        button.textContent = futSymbol ? "FUT" : "-";
      } else {
        return;
      }

      button.onclick = async ()  =>  {
        if(isIndex) {
          if( currentSymbol !== lastApiCallIndex) {
            try {
            const indices :any= config.OIindices
            const key: any = Object.keys(indices).find(
              (k:any) => indices[k] === currentSymbol
            );
            const getSymbol = new UserBrokerRouterApi(baseConfig());
            const brokerCode = getBrokerCode();
            const response = await getSymbol.getIndicesFuturesDataV1UsersMeBrokersBrokerCodeGetIndicesFuturesDataIndexNameGet(
              brokerCode,
              key
            )
            futSymbol = response?.data?.futures_data[0]?.identifier;
            lastSeenIdxSymbol = indices[key] 
            lastApiCallIndex = indices[key]
            } catch (error: any) {
              if (error?.response && error?.response?.status == 401) {
                  autoLogoutTokenRemove(router);
                }
              if (error?.response && error?.response?.status == 456) {
                  brokerLogoutTokenRemove(router);
                }
            }
          }
        }
        const resolution = chart.resolution();
        const label = button.textContent;

        const nextSymbol =
          label === "FUT" ? futSymbol : label === "INDEX" ? indexSymbol : null;

        if (nextSymbol) {
          chart.setSymbol(nextSymbol);
          chart.setResolution(resolution);
        }
      };
    };

    tvWidget.onChartReady(updateButtonState);
    chart.onSymbolChanged().subscribe(null, updateButtonState);

    button.addEventListener("mouseover", () => {
      button.style.backgroundColor = "oklch(0.968 0.007 247.896)";
    });

    button.addEventListener("mouseout", () => {
      button.style.backgroundColor = "white";
    });

    tvWidget.header?.appendChild(button);
    resolve()
  });
}
)};

const styleButton = (button: HTMLElement) => {
  button.style.backgroundColor = "white";
  button.style.color = "black";
  button.style.padding = "5px 10px";
  button.style.margin = "5px";
  button.style.cursor = "pointer";
  button.style.borderRadius = "4px";
  button.style.transition = "background-color 0.2s ease-in-out";
};
