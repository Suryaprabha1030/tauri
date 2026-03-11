import { chart_datafeed } from "@/lib/util/datafeeds/chartDatafeed";
import { ResolutionString } from "../../../public/static/charting_library/datafeed-api";
import config from "@/lib/config";
import { setShowTvResolution } from "@/lib/redux/slices/ChartsSlice";
import { useDispatch } from "react-redux";
import {
  createBuySellButton,
  createScreenerButton,
  handleToggle,
  createWatchlistButton,
  createFutButton,
  resetButtonRefs,
  buyButtonRefs,
  sellButtonRefs,
} from "./CustomCheckBoxButton";
import { StudyPlotType, widget } from "../../../public/static/charting_library";
import {
  tvWidgetId,
  ViewType,
} from "@/lib/util/toggleButtonName/toggleButtonNames";
import {
  createCustomToggleButton,
  destroyCustomToggleButton,
  settingsButtonRefs,
  toggleButtonRefs,
} from "./OiProfile";
import { toast } from "react-toastify";
import { showActionOverlay } from "./quickOrders";
import { custom_indicators_getter } from "./CandlestickPatternIndicator";

let tvWidget: any = null;

const url = config.apiUrl;

const widgetMap = new Map<string, any>(); // key: chartId, value: widget
// expose globally for access from modal

export const initializeTradingViewWidget = (
  containerRef: any,
  dispatch: ReturnType<typeof useDispatch>,
  userId: any,
  toggleState: any,
  isOpen: any,
  isSideTabCollapsed: any,
  resolution: any,
  firstFut: any,
  ChartIconClicked: boolean,
  FutIndexName: any,
  TvAddSymbolPopup: boolean,
  router: any,
  chartforPsb: boolean,
  isMarketHoliday: any
  // OIindicesData: any
) => {
  const widgetOptions: any = {
    symbol: "NSE:NIFTY50",
    datafeed: chart_datafeed,
    interval: resolution,
    container: containerRef.current,
    charts_storage_api_version: "1.0",
    charts_storage_url: `${url}/v1/users/me`,
    client_id: "zoonest.com",
    // supports_time: true,
    user_id: userId,
    locale: "en",
    fullscreen: false,
    session: "0915-1530",
    timezone: "Asia/Kolkata",
    has_intraday: true,
    has_daily: true,
    has_weekly_and_monthly: true,
    autosize: true,
    auto_save_delay: 10,
    library_path: "/static/charting_library/",
    load_last_chart: true,
    disabled_features: [
      "use_localstorage_for_settings",
      "symbol_search_hot_key",
      "allow_arbitrary_symbol_search_input",
      "legend_inplace_edit",
      "show_symbol_logo_in_legend",
      // "legend_widget",
      "header_quick_search",
      "show_object_tree",
      "symbol_search_hot_key",
      // "header_symbol_search",
      "header_screenshot",
      "header_compare",
      "header_fullscreen_button",
      "context_menus",
      "legend_context_menu",
      "pane_context_menu",
      "scales_context_menu",
      "adaptive_logo",
      "go_to_date",
      "show_chart_property_page",
      "hide_resolution_in_legend",
      ...(chartforPsb ? ["popup_hints"] : []),
    ],

    time_frames: [
      { text: "1m", resolution: "60", description: "1 Month" },
      { text: "5d", resolution: "30", description: "5 Days" },
      { text: "3d", resolution: "5", description: "3 Days" },
    ],
    enabled_features: [
      "header_symbol_search",
      "items_favoriting",
      "side_toolbar_in_fullscreen_mode",
      "use_last_visible_bar_value_in_legend",
      "show_symbol_logos",
      "show_exchange_logos",
      "header_in_fullscreen_mode",
      "header_saveload",
      "show_plus_button_on_price_scale",
      "chart_crosshair_menu", //For plus button in pricescale label
      // "create_volume_indicator_by_default",
      "dont_show_volume_on_chart",
      ...(isOpen || chartforPsb ? ["hide_left_toolbar_by_default"] : []),
    ],
    supported_resolutions: ["1", "15", "240", "6M", "1D", "1M", "1W"],
    study_count_limit: 5,
    theme: "light",
    loading_screen: { foregroundColor: "#4CA858" },
    settings_adapter: {
      initialSettings: {
        symbolWatermark:
          '{"visibility":true,"color":"rgba(80, 83, 94, 0.117)"}',
        "chart.favoriteDrawings":
          '["LineToolTrendLine","LineToolParallelChannel", "LineToolHorzLine", "LineToolHorzRay", "LineToolRiskRewardLong", "LineToolRiskRewardShort", "LineToolHeadAndShoulders"]',
        "IntervalWidget.quicks": '["1","3","5","15","30","60"]',
        "StyleWidget.quicks": "[14,2,3]",
        "chart.favoriteLibraryIndicators":
          '["Accumulation/Distribution","Arnaud Legoux Moving Average","Average True Range","Bollinger Bands","Commodity Channel Index"]',
      },
      setValue: function (key: any, value: any) {},
      removeValue: function (key: any) {},
    },
    overrides: {
      "paneProperties.gridLinesMode": "none",
    },
    custom_font_family: '"Work Sans", sans-serif',
    custom_css_url:
      "https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap",
    custom_indicators_getter: custom_indicators_getter,
  };

  if (containerRef.current) {
    tvWidget = new widget(widgetOptions);
    let chartId: any;
    if (chartforPsb) {
      chartId = isOpen ? tvWidgetId.POPUPCHART : tvWidgetId.MAINCHART;
    } else {
      chartId = isOpen ? tvWidgetId.POPUPCHART : tvWidgetId.MAINCHART;
    }

    tvWidget.onChartReady(() => {
      const currentResolution = tvWidget.activeChart().resolution();
      dispatch(setShowTvResolution(currentResolution)); // Dispatch the resolution change to Redux
      const chart = tvWidget.activeChart();
      let isWatchlistButtonCreated = false;
      if (chart) {
        chart
          .onIntervalChanged()
          .subscribe(
            null,
            (interval: ResolutionString, timeframeObj: { timeframe?: any }) => {
              dispatch(setShowTvResolution(interval));
            }
          );

        const updateBuySellButton = (symbolInfo: any) => {
          if (
            (!isOpen &&
              toggleState === ViewType.CANDLESTICK &&
              symbolInfo &&
              symbolInfo?.symbol_type !== "index" &&
              symbolInfo?.ticker != "NSE:NIFTY50") ||
            (isOpen &&
              symbolInfo &&
              symbolInfo?.symbol_type !== "index" &&
              symbolInfo?.ticker != "NSE:NIFTY50")
          ) {
            createBuySellButton(tvWidget, dispatch, true, chartId, router);
          } else {
            createBuySellButton(tvWidget, dispatch, false, chartId, router);
          }
        };
        let currentSymbolInfo: any = null;

        chart.onSymbolChanged().subscribe(null, (symbolInfo: any) => {
          currentSymbolInfo = symbolInfo;
          updateBuySellButton(symbolInfo);
        });

        const symbolInfo = tvWidget.activeChart().symbolExt();

        updateBuySellButton(symbolInfo);

        if (
          (isOpen || chartforPsb) &&
          config.supportedIndexIdentifier.includes(symbolInfo.ticker) &&
          firstFut &&
          Object.entries(firstFut)?.length > 0 &&
          ChartIconClicked &&
          !TvAddSymbolPopup
        ) {
          createFutButton(
            tvWidget,
            firstFut?.identifier || "",
            FutIndexName,
            config.supportedIndexIdentifier,
            () => firstFut,
            router
          );
        }
        createCustomToggleButton(tvWidget, dispatch, chartId, isMarketHoliday);
        tvWidget.subscribe("onPlusClick", (params) => {
          const price = params?.price;
          if (
            !currentSymbolInfo ||
            currentSymbolInfo?.symbol_type === "index" ||
            currentSymbolInfo?.ticker === "NSE:NIFTY50"
          ) {
            toast("Non-tradable Symbol");
            return;
          }

          const chart = tvWidget?.activeChart();
          const series = chart?.getSeries()._series;
          const priceScale = series?.priceScale?.();
          const y = priceScale?.priceToCoordinate(price, true);
          const iframe = document.querySelector(
            "iframe[src^='blob']"
          ) as HTMLIFrameElement;
          const chartRoot = iframe?.contentDocument?.querySelector(
            ".chart-container"
          ) as HTMLElement;
          if (!chartRoot) return;

          chartRoot.style.position = "relative";
          if (!y || !containerRef.current) return;
          const paneContents = Array.from(
            chartRoot.querySelectorAll(".chart-markup-table.pane")
          ) as HTMLElement[];
          const mainPane = paneContents[0];
          showActionOverlay(
            price,
            y,
            mainPane,
            currentSymbolInfo,
            chart,
            dispatch
          );
        });

        //  Only create buttons if width >= 1200
        if (window.innerWidth >= 1200) {
          if (!isWatchlistButtonCreated && !isOpen && !chartforPsb) {
            setTimeout(() => {
              createWatchlistButton(tvWidget, dispatch, isSideTabCollapsed);
              isWatchlistButtonCreated = true;
            }, 200);
          }
        }
      } else {
        console.error("Active chart is not available");
      }
    });
    widgetMap.set(chartId, tvWidget);
    // }
    // });
    return tvWidget;
  }
};

export { tvWidget };

export const removeTradingViewWidget = (chartId: string) => {
  const widgetToRemove = widgetMap.get(chartId);
  if (widgetToRemove != undefined || null) {
    widgetToRemove.remove();
    widgetMap.delete(chartId);

    if (buyButtonRefs && sellButtonRefs) resetButtonRefs(chartId);
    if (toggleButtonRefs && settingsButtonRefs)
      destroyCustomToggleButton(chartId);
    // resetToggleRef(chartId);
    // Reset tvWidget to main-tv if it exists and popup-tv was removed
    if (
      chartId === tvWidgetId.POPUPCHART &&
      widgetMap.has(tvWidgetId.MAINCHART)
    ) {
      tvWidget = widgetMap.get(tvWidgetId.MAINCHART);
    } else if (!widgetMap.has(tvWidgetId.MAINCHART) && widgetMap.size > 0) {
      // If main-tv is also gone, pick any other remaining widget
      const firstWidget = Array.from(widgetMap.values())[0];

      tvWidget = firstWidget;
    } else {
      // If all widgets are gone
      tvWidget = null;
    }
  }
};
