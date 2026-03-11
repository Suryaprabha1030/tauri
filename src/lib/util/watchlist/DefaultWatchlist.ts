import { UserWatchlistRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { autoLogoutTokenRemove } from "../autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "../autoLogoutUtil/brokerLogOutUtil";

const CreateWatchlistForNewUser = async (router: any) => {
  try {
    const CreatewatchlistApi = new UserWatchlistRouterApi(baseConfig());
    await CreatewatchlistApi.createWatchlistsV1UsersMeWatchlistsPost(
      "primary-WL"
    );
  } catch (error: any) {
    if (error?.response && error?.response?.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (error?.response && error?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }
  }
};

const handleStarClick = async (watchlistId: number, router: any) => {
  try {
    const primaryApi = new UserWatchlistRouterApi(baseConfig());
    await primaryApi.makePrimaryWatchlistV1UsersMeWatchlistsIdMakePrimaryPost(
      watchlistId
    );
    console.log("Watchlist updated successfully.");
  } catch (error: any) {
    if (error?.response && error?.response?.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (error?.response && error?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }

    // Additional Debugging:
  }
};

const addWatchListForNewUser = async (
  selectedWatchlistId: any,
  symbol: any,
  router: any
) => {
  const addwatchlistApi = new UserWatchlistRouterApi(baseConfig());
  try {
    await addwatchlistApi.addSymbolsInWatchlistsV1UsersMeWatchlistsWatchlistIdAddSymbolsPost(
      selectedWatchlistId,
      [symbol]
    );
  } catch (error: any) {
    if (error?.response && error?.response?.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (error?.response && error?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }
  }
};

export { CreateWatchlistForNewUser, handleStarClick, addWatchListForNewUser };
