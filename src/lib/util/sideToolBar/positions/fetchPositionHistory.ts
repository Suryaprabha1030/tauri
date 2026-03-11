import { PositionsRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { autoLogoutTokenRemove } from "../../autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "../../autoLogoutUtil/brokerLogOutUtil";

function getStartDateThreeMonthsAgo(): string {
  const now = new Date();
  now.setDate(1); // set to 1st of current month first
  now.setMonth(now.getMonth() - 2); // go back 3 months including current month
  return now.toISOString().split("T")[0]; // format YYYY-MM-DD
}

export async function fetchDataForCalenderView(
  brokerCode: any,
  setCalenerData: any,
  setHasFetchedCalenderData: any,
  router: any
) {
  const startDate = getStartDateThreeMonthsAgo();
  try {
    const PositionHistory = new PositionsRouterApi(baseConfig());
    const res =
      await PositionHistory.historyPostionsV1UsersMeSharedPositionsHistoryAllGet(
        brokerCode,
        startDate
      );
    if (res?.status === 204) {
      setCalenerData([]);
    } else {
      const data = res?.data || [];
      setCalenerData(data);
    }
    setHasFetchedCalenderData(true);
  } catch (error: any) {
    if (error?.response && error?.response?.status == 401) {
      autoLogoutTokenRemove(router);
    }
    if (error?.response && error?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }
  }
}
