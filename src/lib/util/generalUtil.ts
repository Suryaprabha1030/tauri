import { StockInfoAPIApi } from "../api/base";
import { baseConfig } from "../api/baseConfiguration";
import { getMarketHolidays } from "../redux/slices/MarketBasisSlice";
import { autoLogoutTokenRemove } from "./autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "./autoLogoutUtil/brokerLogOutUtil";

const truncate = (str: string, length: number = 20) => {
  if (str && str.length > length) {
    return `${str.substring(0, length)}...`;
  }
  return str;
};

const fetchMarketDays = (dispatch, router) => {
  const fetchApi = new StockInfoAPIApi(baseConfig());
  fetchApi
    .isWeekendOrHolidayMarketHolidaysIsMarketHolidayGet()
    .then((res) => {
      // console.log(res?.data?.is_holiday, "res");
      dispatch(getMarketHolidays(res?.data?.is_holiday));
    })
    .catch((error) => {
      if (error?.response?.status === 401) {
        autoLogoutTokenRemove(router);
      }
      if (error?.response && error?.response?.status == 456) {
        brokerLogoutTokenRemove(router);
      }
    });
};

export { truncate, fetchMarketDays };
