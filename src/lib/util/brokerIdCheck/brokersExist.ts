import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";

import { autoLogoutTokenRemove } from "../autoLogoutUtil/autoLogOutUtil";
import config from "@/lib/config";
import { brokerLogoutTokenRemove } from "../autoLogoutUtil/brokerLogOutUtil";

export const fetchExistBrokers = async (router: any, id?: any) => {
  // Make it explicitly async
  const brokerapi = new UserBrokerRouterApi(baseConfig());
  const brokerData: any = sessionStorage.getItem("ExistbrokerCode");
  let normalizedBrokerData: any[] = [];

  try {
    const parsed = JSON.parse(brokerData || "[]");
    normalizedBrokerData = Array.isArray(parsed) ? parsed.map(Number) : [];
  } catch (err) {
    normalizedBrokerData = [];
  }

  if (id && normalizedBrokerData?.includes(Number(id?.id))) {
    return;
  }

  try {
    const res = await brokerapi.fetchMyBrokersV1UsersMeBrokersGet();
    const brokersWithProfile: any = [];

    const profileFetches = res?.data?.user_broker_mapping?.map(
      async (broker: any) => {
        try {
          const profileRes =
            await brokerapi.fetchMyBrokerProfileV1UsersMeBrokersBrokerCodeProfileGet(
              broker?.broker_code,
            );
          if (
            profileRes?.data &&
            Object.keys(profileRes?.data).length > 0 &&
            profileRes?.data?.client_code != null
          ) {
            brokersWithProfile.push(broker);
          }
        } catch (profileErr: any) {
          if (profileErr?.response?.status === 401) {
            autoLogoutTokenRemove(router);
          }
          if (profileErr?.response && profileErr?.response?.status == 456) {
            brokerLogoutTokenRemove(router);
          }
        }
      },
    );

    await Promise.all(profileFetches); // Wait for all API calls
    if (brokersWithProfile?.length > 0) {
      const brokerCodes = brokersWithProfile?.map((data:any) => data?.broker_code);
      sessionStorage.setItem("ExistbrokerCode", JSON.stringify(brokerCodes));
      return brokerCodes; // ✅ Now returns an array
    }

    return []; // ✅ Ensure it returns an empty array if no brokers found
  } catch (err: any) {
    if (err?.response?.status === 401) {
      autoLogoutTokenRemove(router);
    }
    if (err?.response && err?.response?.status == 456) {
      brokerLogoutTokenRemove(router);
    }
    return [];
  }
};

export const validateBrokerCode = async (
  code: any,
  brokerData: any,

  router: any,
  setBrokerCode: any,
  setIsValid: any,
) => {
  const brokers: any = await fetchExistBrokers(router, code); // Now correctly awaited!
  const parsedBrokerData = Array.isArray(brokerData)
    ? brokerData
    : brokerData && typeof brokerData === "string"
      ? JSON.parse(brokerData)
      : [];

  if (parsedBrokerData?.length > 0 || brokers?.length > 0) {
    if (code) {
      if (
        !parsedBrokerData?.includes(parseInt(code.id)) &&
        !brokers?.includes(parseInt(code.id))
      ) {
        // router.push("/404");
        router(config.brokersListUrl);
        setBrokerCode(null);
        sessionStorage.setItem("brokerCode", "");
        sessionStorage.setItem("errorMessage", "Broker Code does not exist");
      } else {
        sessionStorage.setItem("brokerCode", code.id);
        setIsValid(true);
        sessionStorage.setItem("errorMessage", "");
        setBrokerCode(Number(code.id));
      }
    }
  } else {
    router(config.brokersListUrl);
    setBrokerCode(null);
    sessionStorage.setItem("brokerCode", "");
    sessionStorage.setItem("errorMessage", "Broker Code does not exist");
  }
};
