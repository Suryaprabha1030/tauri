import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  setStrategiesPnlDemo,
  setStrategiesPnlRefresh,
} from "@/lib/redux/slices/SimulationSlice";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { Dispatch } from "react";

export const fetchStrategiesPnlApi = async (
  brokerCode: any,
  indexname: any,
  price: any,
  lotsize: any,
  expiry: any,
  dispatch: Dispatch<any>,
  router: any
) => {
  const livestrategy = new UserBrokerRouterApi(baseConfig());
  try {
    const res =
      await livestrategy.getAllStrategiesPnlV1UsersMeBrokersBrokerCodeAllStrategiesPnlIndexNameGet(
        brokerCode,
        indexname,
        price,
        lotsize,
        expiry
      );
    dispatch(setStrategiesPnlDemo(res?.data?.pnl));
    dispatch(setStrategiesPnlRefresh(false));
  } catch (err: any) {
    dispatch(setStrategiesPnlRefresh(false));
    if (err?.response && err?.response?.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (err?.response && err?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }
  }
};
