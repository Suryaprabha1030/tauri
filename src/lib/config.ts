const config = {
  siteName: "Zoonest",
  siteDescription: "The future of trading is here",
  siteUrl: "https://zoonest.com",
  apiUrl:
    import.meta.env.NEXT_PUBLIC_ZOONEST_API_URL ||
    "http://test-demozoonest.pagekite.me",
  nimaAPIUrl:
    import.meta.env.NEXT_PUBLIC_ZOONEST_NIMA_API_URL ||
    "http://zoonestmac.pagekite.me",
  websocketBaseUrl:
    import.meta.env.NEXT_PUBLIC_ZOONEST_WEBSOCKET_BASE_URL ||
    "wss://ws-in.services.zoonest.com/ws/connect",

  sideNav: [
    {
      name: "Strategies",
      path: "/strategy-builder",
    },
    {
      name: "Simulator",
      path: "/simulator",
    },
    {
      name: "Back Testing",
      path: "/back-testing",
    },
  ],
  strategyBuilder: {
    tabNames: ["Overview", "Simulation", "Backtesting"],
  },
  createStrategy: {
    position: [
      {
        label: "ATM +5",
        value: 5,
      },
      {
        label: "ATM +4",
        value: 4,
      },
      {
        label: "ATM +3",
        value: 3,
      },
      {
        label: "ATM +2",
        value: 2,
      },
      {
        label: "ATM +1",
        value: 1,
      },
      {
        label: "ATM",
        value: 0,
      },
      {
        label: "ATM -1",
        value: -1,
      },
      {
        label: "ATM -2",
        value: -2,
      },
      {
        label: "ATM -3",
        value: -3,
      },
      {
        label: "ATM -4",
        value: -4,
      },
      {
        label: "ATM -5",
        value: -5,
      },
    ],
    maxRowCount: 10,
  },
  dateRange: {
    min: "2023-01-01",
    max: "2023-08-20",
  },
  backtestingDateRange: {
    min: "2023-06-02",
    max: "2023-08-20",
  },
  globalSimulatorConfig: {},
  globalBackTestingConfig: {
    selectedDays: [
      {
        id: undefined,
        label: "Everyday",
      },
      {
        id: 1,
        label: "Mon",
      },
      {
        id: 2,
        label: "Tue",
      },
      {
        id: 3,
        label: "Wed",
      },
      {
        id: 4,
        label: "Thu",
      },
      {
        id: 5,
        label: "Fri",
      },
    ],
  },
  alertToastTimeout: 5000,
  defaultInput: {
    indexName: "NIFTY",
    date: "2023-07-14",
    time: "09:15",
    expiry: "20JUL23",
    timeTravel: "",
  },
  optionChainExpiry: {
    date: "28AUG2024",
  },
  defaultAnalyzerQuery: {
    default: "NIFTY",
  },

  TRADING_CONFIG: {
    START_HOUR: 9,
    slider_START_MINUTE: 17,
    END_HOUR: 15,
    END_MINUTE: 30,
    ALLOWED_DAYS: [1, 2, 3, 4, 5], // Monday to Friday
  },
  isTradingTime: (): boolean => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday

    const { START_HOUR, END_HOUR, END_MINUTE, ALLOWED_DAYS } =
      config.TRADING_CONFIG; // Corrected reference

    const isWithinTimeRange =
      hours === START_HOUR ||
      (hours > START_HOUR && hours < END_HOUR) ||
      (hours === END_HOUR && minutes <= END_MINUTE);

    const isWeekday = ALLOWED_DAYS.includes(day);
    return isWithinTimeRange;
  },
  isTradingSliderTime: (): boolean => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDay(); // 0 = Sunday, 6 = Saturday

    const {
      START_HOUR,
      END_HOUR,
      END_MINUTE,
      ALLOWED_DAYS,
      slider_START_MINUTE,
    } = config.TRADING_CONFIG; // Corrected reference

    const isWithinTimeRange =
      (hours > START_HOUR && hours < END_HOUR) || // Between full hours
      (hours === START_HOUR && minutes >= slider_START_MINUTE) || // Same hour as start (after 9:15)
      (hours === END_HOUR && minutes <= END_MINUTE);

    const isWeekday = ALLOWED_DAYS.includes(day);

    return isWithinTimeRange;
  },

  supportIndices: ["NIFTY", "BANKNIFTY", "FINNIFTY", "BANKEX", "SENSEX"],
  BSESupportIndices: ["SENSEX", "BANKEX"],
  userEmail: ["test@test.com", "kann87@gmail.com"],
  supportedIndexIdentifier: [
    "NSE:NIFTY50",
    "NSE:BANKNIFTY",
    "NSE:FINNIFTY",
    "BSE:SENSEX",
    "BSE:BANKEX",
  ],
  OIindices: {
    NIFTY: "NSE:NIFTY50",
    BANKNIFTY: "NSE:BANKNIFTY",
    FINNIFTY: "NSE:FINNIFTY",
    SENSEX: "BSE:SENSEX",
    BANKEX: "BSE:BANKEX",
    // MIDCPNIFTY: "NSE:MIDCPNIFTY",
    // NIFTYNXT50: "NSE:NIFTYNXT50",
  },
  NimaFnoSymbol: "NIFTY",
  initializeIndex: { defaultQuery: "NIFTY" },
  brokersListUrl: "/live",
  defaultIvValue: 11,
  zoonestTwitterID: "@Zoonestdotcom",
  enabledBrokers: ["fyers", "angelone", "billamoney", "iifl", "aliceblue"],
};

export default config;
