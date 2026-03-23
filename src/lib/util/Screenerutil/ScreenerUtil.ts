import {
  NewsRouterApi,
  PositionsRouterApi,
  UserBrokerRouterApi,
} from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { setPayoffStrategyName } from "@/lib/redux/slices/screenerSlice";

const FIVE_MINUTES = 5 * 60 * 1000;

const isCacheValid = (wrapper: {
  positionsData?: any;
  holdingsData?: any;
  lastUpdatedTime?: number;
}) => {
  if (!wrapper?.lastUpdatedTime) return false;

  const data = wrapper.positionsData ?? wrapper.holdingsData;

  if (!data) return false;

  return Date.now() - wrapper.lastUpdatedTime < FIVE_MINUTES;
};

export const consolidatedPositions = (
  positionsData: any,
  pnl: any,
  pnlPercent: any
) => {
  return {
    positions: Array.isArray(positionsData) ? positionsData : [],
    total_pnl: pnl ?? 0,
    total_pnl_percent: pnlPercent ?? 0,
  };
};

export async function fetchHoldingsPositions(
  brokerCode: string,
  token: any,
  lastUpdatedPositions: any,
  lastUpdatedHoldings: any,
  SelectedPositionsType: string,
  SelectedHoldingsType: string,
  DemoPositions: any,
  DemoHoldings: any
) {
  const fetchApi = new UserBrokerRouterApi(baseConfig());
  if (!brokerCode) {
    return {
      error: "connect_broker",
      holdings: null,
      positions: null,
    };
  }

  const hasDemoPositions = SelectedPositionsType?.length > 0;
  const hasDemoHoldings = SelectedHoldingsType?.length > 0;

  // CASE 1: Both demo
  if (hasDemoPositions && hasDemoHoldings) {
    return {
      positions: DemoPositions,
      holdings: DemoHoldings,
    };
  }

  const isPositionsValid = isCacheValid(lastUpdatedPositions);
  const isHoldingsValid = isCacheValid(lastUpdatedHoldings);

  try {
    const [holdingsResponse, positionsResponse] = await Promise.all([
      // Holdings
      hasDemoHoldings
        ? Promise.resolve({ data: DemoHoldings })
        : isHoldingsValid
          ? Promise.resolve({ data: lastUpdatedHoldings.holdingsData })
          : fetchApi.fetchMyBrokerHoldingsV1UsersMeBrokersBrokerCodeHoldingsGet(
              brokerCode,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),

      // Positions
      hasDemoPositions
        ? Promise.resolve({ data: DemoPositions })
        : isPositionsValid
          ? Promise.resolve({ data: lastUpdatedPositions.positionsData })
          : fetchApi.fetchMyBrokerPositionsV1UsersMeBrokersBrokerCodePositionsGet(
              brokerCode,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
    ]);

    return {
      holdings: holdingsResponse?.data,
      positions: positionsResponse?.data,
    };
  } catch (err) {
    console.error("Holdings/Positions API failed:", err);
    return null;
  }
}

export async function fetchHoldings(brokerCode: any, token: any) {
  const fetchApi = new UserBrokerRouterApi(baseConfig());
  if (!brokerCode) {
    return {
      error: "connect_broker",
      holdings: null,
    };
  }

  try {
    const holdingsResponse =
      await fetchApi.fetchMyBrokerHoldingsV1UsersMeBrokersBrokerCodeHoldingsGet(
        brokerCode,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return {
      holdings: holdingsResponse?.data,
    };
  } catch (err) {
    console.error("Holdings API failed:", err);
    return null;
  }
}

export async function fetchPositions(brokerCode: string, token: any) {
  const fetchApi = new UserBrokerRouterApi(baseConfig());
  if (!brokerCode) {
    return {
      error: "connect_broker",
      positions: null,
    };
  }
  try {
    const positionsResponse =
      await fetchApi.fetchMyBrokerPositionsV1UsersMeBrokersBrokerCodePositionsGet(
        brokerCode,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return {
      positions: positionsResponse?.data,
    };
  } catch (err) {
    console.error("Positions API failed:", err);
    return null;
  }
}

export async function fetchOrdersData(
  brokerCode: string,
  token: any,
  OrdersDemo: boolean,
  DemoOrdersData: any
) {
  const fetchApi = new UserBrokerRouterApi(baseConfig());

  if (!brokerCode) {
    return {
      error: "connect_broker",
      orders: null,
    };
  }

  // Demo mode
  if (OrdersDemo) {
    return {
      orders: DemoOrdersData,
    };
  }

  try {
    const OrdersResponse =
      await fetchApi.fetchMyBrokerOrdersV1UsersMeBrokersBrokerCodeOrdersGet(
        brokerCode,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    return {
      orders: OrdersResponse.data,
    };
  } catch (err) {
    console.error("Orders API failed:", err);
    return null;
  }
}

export async function fetchNewsData(token: any) {
  const Allnews = new NewsRouterApi(baseConfig());
  if (!token) {
    return {
      error: "login required",
      News: null,
    };
  }
  try {
    const response = await Allnews.fetchGroupsNewsV1NewsGroupsNewsPost(
      ["NSE:NIFTY50"],
      1,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = response?.data;

    return {
      News: data,
    };
  } catch (err: any) {
    if (err?.response?.status === 204) {
      return { News: [] };
    }

    console.error("News API failed:", err);
    return null;
  }
}

export async function fetchFnoData(
  brokerCode: any,
  queryIdentifier: any
) {
  if (!brokerCode) {
    return {
      error: "connect_broker",
      fno: null,
    };
  } else
    return {
      fno: { symbol: queryIdentifier },
    };
}

export const strategiesList = [
  "Long Call",
  "Short Put",
  "Bull Call Spread",
  "Bull Put Spread",
  "Call Ratio Back Spread",
  "Bull Condor",
  "Bull Fly",
  "Range Forward",
  "Long Combo",
  "Long Synthetic Future",
  "Short Call",
  "Long Put",
  "Bear Call Spread",
  "Bear Put Spread",
  "Put Ratio Back Spread",
  "Bear Condor",
  "Bear Fly",
  "Short Combo",
  "Short Synthetic Future",
  "Short Straddle",
  "Long Straddle",
  "Short Strangle",
  "Long Strangle",
  "Iron Condor",
  "Iron Fly",
  "Batman",
  "Short Guts",
];

export const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("StrategyDB", 1);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("images")) {
        db.createObjectStore("images", { keyPath: "strategyName" });
      }
    };

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
};

export const saveStrategyImage = async (
  strategyName: string,
  base64: string
) => {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");

    // save or update
    store.put({ strategyName, image: base64 });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const getAllSavedStrategyImages = async () => {
  const db = await openDB();

  return new Promise<
    {
      strategyName: string;
      image: string;
      fileType: string;
    }[]
  >((resolve, reject) => {
    const tx = db.transaction("images", "readonly");
    const store = tx.objectStore("images");
    const req = store.getAll();

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
};

export const getUrlFromSavedImages = async () => {
  const getStrategyImages = new PositionsRouterApi(baseConfig());
  try {
    const response =
      await getStrategyImages.fetchStrategyImagesV1UsersMeSharedPositionsStrategyImagesGet();
    const images = response?.data?.payoffchart_imageinfo || [];

    return images;
  } catch {
    return null;
  }
};

export const clearSavedImages = async () => {
  const db = await openDB();

  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction("images", "readwrite");
    tx.objectStore("images").clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
};

export const uploadAllFromIndexedDB = async (
  images: {
    strategyName: string;
    image: string;
    fileType: string;
  }[],
  dispatch: any
) => {
  const PositionSharing = new PositionsRouterApi(baseConfig());
  const filesMeta = images.map((img) => ({
    fileName: `${img.strategyName}.jpg`,
    fileType: "image/jpeg",
  }));

  const presignRes =
    await PositionSharing.generatePresignedStrategyImgurlV1UsersMeSharedPositionsUploadStrategyUrlPost(
      filesMeta
    );

  await Promise.all(
    presignRes.data.urls.map(async (item:any, idx:any) => {
      const blob = await (await fetch(images[idx].image)).blob();

      const res = await fetch(item.url, {
        method: "PUT",
        headers: { "Content-Type": "image/jpeg" },
        body: blob,
      });
      dispatch(setPayoffStrategyName(null));
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }
    })
  );
};
