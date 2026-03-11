import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import {
  marginRequired,
  premiumData,
} from "@/lib/redux/slices/PayoffChartSlice";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

const marginpayloadAdded = (long_ce_data: any, arr: any) => {
  long_ce_data.forEach((d) =>
    arr.push({
      exchange: d.exchange,
      lot_size: d.lot_size,
      lots: d.lots,
      ltp: d.ltp,
      product_type: "NRML",
      order_type: "MARKET",
      transaction_type: d.transaction_type,
      identifier: d.identifier,
      broker_identifier: d.identifier,
      broker_symbol: d.symbol_name,
    })
  );
  return arr;
};

const calculateMarginData = (
  marginData: any,
  dispatch: any,
  router: any,
  brokerCode: any
) => {
  if (marginData && marginData.length > 0) {
    const MarginApi = new UserBrokerRouterApi(baseConfig());

    MarginApi.calculateMarginV1UsersMeBrokersBrokerCodeCalculateMarginPost(
      brokerCode,
      marginData
    )
      .then((res) => {
        dispatch(
          marginRequired(Number(res?.data?.total_margin_required?.toFixed(0)))
        );

        dispatch(premiumData(res?.data?.premium));
      })
      .catch((error) => {
        if (error?.response?.status === 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  }
};

export { marginpayloadAdded, calculateMarginData };
