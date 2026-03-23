import { BrokersRouterApi } from "../api/base";
import { baseConfig } from "../api/baseConfiguration";

export const brokers = [
  "Fyers",
  "AngelOne",
  "Zerodha",
  "Firstock",
  "IIFL",
  "Upstox",
  "Dhan",
  "AliceBlue",
];
export const getImageUrl = (brokerName: string) => {
  switch (brokerName.toLowerCase()) {
    case "angelone":
      return {
        url: "/svg/Angelone_logo.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-5/6  sm:max-md:h-[7.5rem]  sm:max-md:w-[7.5rem] md:max-2xl:h-[8rem] md:max-2xl:w-[8rem] 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
        width: 85,
        height: 85,
        imgWidth: 150,
        imgHeight: 120,
      };
    case "zerodha":
      return {
        url: "/svg/Zerodha.svg",
        widthHeight:
          "max-sm:h-[2.5rem] max-sm:w-[2.5rem] sm:max-md:h-[3rem]  sm:max-md:w-[4.5rem] md:max-2xl:h-[3.5rem] md:max-2xl:w-[5rem] 2xl:h-[55%] 2xl:w-[55%] 2xl:p-4",
        width: 100,
        height: 100,
        imgWidth: 100,
        imgHeight: 130,
      };
    case "firstock":
      return {
        url: "/svg/firstock_logo.svg",
        widthHeight:
          "max-sm:h-[2.5rem] max-sm:w-[2.5rem] sm:max-md:h-[3rem]  sm:max-md:w-[4.5rem] md:max-2xl:h-[3.5rem] md:max-2xl:w-[5rem] 2xl:h-[55%] 2xl:w-[55%] 2xl:p-4",
        width: 100,
        height: 35,
        imgWidth: 100,
        imgHeight: 130,
      };
    case "iifl":
      return {
        url: "/svg/iifl_logo.svg",
        widthHeight:
          "max-sm:h-[2.5rem] max-sm:w-[2.5rem] sm:max-md:h-[3rem]  sm:max-md:w-[4.5rem] md:max-2xl:h-[3.5rem] md:max-2xl:w-[5rem] 2xl:h-[55%] 2xl:w-[55%] 2xl:p-4",
        width: 100,
        height: 35,
        imgWidth: 100,
        imgHeight: 130,
      };
    case "firstock":
      return {
        url: "/svg/firstock_logo.svg",
        widthHeight:
          "max-sm:h-[2.5rem] max-sm:w-[2.5rem] sm:max-md:h-[3rem]  sm:max-md:w-[4.5rem] md:max-2xl:h-[3.5rem] md:max-2xl:w-[5rem] 2xl:h-[55%] 2xl:w-[55%] 2xl:p-4",
        width: 100,
        height: 35,
        imgWidth: 100,
        imgHeight: 130,
      };
    case "upstox":
      return {
        url: "/svg/upstocx.svg",
        widthHeight:
          "max-sm:h-[5.5rem] max-sm:w-[5.5rem] sm:max-md:h-[6.5rem] sm:max-md:w-[6.5rem] md:max-2xl:h-[7rem] md:max-2xl:w-[7rem] 2xl:h-[75%] 2xl:w-[75%] 2xl:p-4",
        width: 75,
        height: 75,
        imgWidth: 100,
        imgHeight: 130,
      };
    case "dhan":
      return {
        url: "/svg/dhan.svg",
        widthHeight:
          "max-md:h-[5rem] max-md:w-[5rem] md:max-2xl:h-[6rem] md:max-2xl:w-[6rem] 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
        width: 75,
        height: 85,
        imgWidth: 100,
        imgHeight: 130,
      };
    case "aliceblue":
      return {
        url: "/svg/Aliceblue.svg",
        widthHeight:
          "max-sm:h-[2.5rem] max-sm:w-[2.5rem] sm:max-md:h-[3rem]  sm:max-md:w-[4.5rem] md:max-2xl:h-[3.5rem] md:max-2xl:w-[5rem] 2xl:h-[55%] 2xl:w-[55%] 2xl:p-4",
        width: 85,
        height: 35,
        imgWidth: 100,
        imgHeight: 130,
      };
    default:
      return {
        url: "/svg/fyers_logo.svg",
        widthHeight:
          "max-sm:h-[5.5rem] max-sm:w-[5.5rem] sm:max-md:h-[6.5rem] sm:max-md:w-[6.5rem] md:max-2xl:h-[7rem] md:max-2xl:w-[7rem] 2xl:h-[75%] 2xl:w-[75%] 2xl:p-4",
        width: 70,
        height: 75,
        imgWidth: 100,
        imgHeight: 100,
      };
  }
};

export const getSignUpUrl = (broker: string): string => {
  switch (broker.toLowerCase()) {
    case "angelone":
      return "https://www.angelone.in/open-demat-account";
    case "zerodha":
      return "https://zerodha.com/open-account";
    case "firstock":
      return "https://signup.firstock.in/";
    case "iifl":
      return "https://www.indiainfoline.com/open-demat-account?utm_source=Website&utm_medium=TTWeb&utm_campaign=TTWeb_TradePage";
    case "aliceblue":
      return "https://aliceblueonline.com/open-account-fill-kyc-request-call-back/?C=WEBEKYC";
    default:
      return "https://signup.fyers.in/?utm-source=AP-Leads&utm-medium=AP3415";
  }
};

export const handleBrokerLogin = (e: any, brokerName: string) => {
  e.stopPropagation();
  e.preventDefault();

  const allbrokerapi = new BrokersRouterApi(baseConfig());
  allbrokerapi
    .fetchAllBrokersV1BrokersGet()
    .then((response) => {
      const activeBrokers = response?.data?.filter(
        (broker: any) => broker.is_active
      );
      const selectedBroker = activeBrokers?.find(
        (broker:any) => broker?.name?.toLowerCase() === brokerName?.toLowerCase()
      );

      // Redirect to login_url in the same tab
      window.location.href = selectedBroker?.login_url;
    })
    .catch((error) => {
      console.error("Failed to fetch brokers", error);
    });
};
