export const getImageUrl = (brokerName: string) => {
  switch (brokerName.toLowerCase()) {
    case "angelone":
      return {
        url: "/svg/angelone.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-3/6  sm:max-md:w-3/6 md:max-xl:h-3/6 md:max-xl:w-4/6 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
        width: 85,
        height: 85,
      };
    case "zerodha":
      return {
        url: "/svg/kite-logo.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-3/6  sm:max-md:w-3/6 md:max-xl:h-3/6 md:max-xl:w-4/6 2xl:h-[55%] 2xl:w-[55%] 2xl:p-4",
        width: 75,
        height: 75,
      };
    case "firstock":
      return {
        url: "/svg/firstock_logo.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-[7.5rem]  sm:max-md:w-[7.5rem] md:max-2xl:h-[8rem] md:max-2xl:w-[8rem] 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
        width: 100,
        height: 100,
      };
    case "iifl":
      return {
        url: "/svg/iifl_logo.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-[7.5rem]  sm:max-md:w-[7.5rem] md:max-2xl:h-[8rem] md:max-2xl:w-[8rem] 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
        width: 100,
        height: 100,
      };
    case "upstox":
      return {
        url: "/svg/upstocx.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-3/6  sm:max-md:w-3/6 md:max-xl:h-3/6 md:max-xl:w-4/6 2xl:h-[75%] 2xl:w-[75%] 2xl:p-4",
        width: 100,
        height: 100,
      };
    case "firstock":
      return {
        url: "/svg/firstock_logo.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-[7.5rem]  sm:max-md:w-[7.5rem] md:max-2xl:h-[8rem] md:max-2xl:w-[8rem] 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
        width: 100,
        height: 100,
      };
    case "fyers":
      return {
        url: "/svg/fyers.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-3/6  sm:max-md:w-3/6 md:max-xl:h-3/6 md:max-xl:w-4/6 2xl:h-[75%] 2xl:w-[75%] 2xl:p-4",
        width: 100,
        height: 100,
      };
    case "aliceblue":
      return {
        url: "/svg/Aliceblue.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-3/6  sm:max-md:w-3/6 md:max-xl:h-3/6 md:max-xl:w-4/6 2xl:h-[75%] 2xl:w-[75%] 2xl:p-4",
        width: 100,
        height: 100,
      };
    default:
      return {
        url: "/svg/dhan.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-3/6  sm:max-md:w-3/6 md:max-xl:h-3/6 md:max-xl:w-4/6 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
        width: 85,
        height: 85,
      };
  }
};

export const getTwitterImage = (brokerName: string) => {
  switch (brokerName.toLowerCase()) {
    case "angelone":
      return {
        url: "/svg/Angelone_logo.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-3/6  sm:max-md:w-3/6 md:max-xl:h-3/6 md:max-xl:w-4/6 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
        width: 85,
        height: 85,
        twitterHandle: "@AngelOne",
      };
    case "zerodha":
      return {
        url: "/svg/Zerodha.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-3/6  sm:max-md:w-3/6 md:max-xl:h-3/6 md:max-xl:w-4/6 2xl:h-[55%] 2xl:w-[55%] 2xl:p-4",
        width: 100,
        height: 100,
        twitterHandle: "@zerodhaonline",
      };
    case "firstock":
      return {
        url: "/svg/firstock_logo.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-[7.5rem]  sm:max-md:w-[7.5rem] md:max-2xl:h-[8rem] md:max-2xl:w-[8rem] 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
        width: 85,
        height: 85,
        twitterHandle: "@firstockbroking",
      };
    case "iifl":
      return {
        url: "/svg/iifl_logo.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-[7.5rem]  sm:max-md:w-[7.5rem] md:max-2xl:h-[8rem] md:max-2xl:w-[8rem] 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
        width: 85,
        height: 85,
        twitterHandle: "@iiflcapital",
      };
    case "fyers":
      return {
        url: "/svg/fyers_logo.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-3/6  sm:max-md:w-3/6 md:max-xl:h-3/6 md:max-xl:w-4/6 2xl:h-[75%] 2xl:w-[75%] 2xl:p-4",
        width: 50,
        height: 20,
        twitterHandle: "@fyers1",
      };
    case "aliceblue":
      return {
        url: "/svg/Aliceblue.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-3/6  sm:max-md:w-3/6 md:max-xl:h-3/6 md:max-xl:w-4/6 2xl:h-[75%] 2xl:w-[80%]",
        width: 50,
        height: 20,
        twitterHandle: "@aliceblue_india",
      };
    case "billamoney":
      return {
        url: "/svg/Billamoney.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-[7.5rem]  sm:max-md:w-[7.5rem] md:max-2xl:h-[8rem] md:max-2xl:w-[8rem] 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
        width: 85,
        height: 85,
        twitterHandle: "@firstockbroking",
      };
    default:
      return {
        url: "/svg/fyers.svg",
        widthHeight:
          "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-3/6  sm:max-md:w-3/6 md:max-xl:h-3/6 md:max-xl:w-4/6 2xl:h-[75%] 2xl:w-[75%] 2xl:p-4",
        width: 100,
        height: 50,
        twitterHandle: "@fyers1",
      };
  }
};

export const getBrokerIconImageUrl = (brokerName: string) => {
  switch (brokerName.toLowerCase()) {
    case "angelone":
      return {
        url: "/svg/angelone_icon.svg",

        width: 35,
        height: 40,
      };
    case "zerodha":
      return {
        url: "/svg/kite-logo.svg",

        width: 40,
        height: 40,
      };
    case "firstock":
      return {
        url: "/svg/firstock_icon.svg",
        width: 35,
        height: 35,
      };
    case "iifl":
      return {
        url: "/svg/iifl_icon.svg",
        width: 40,
        height: 35,
      };
    default:
      return {
        url: "/svg/fyers_icon.svg",
        width: 40,
        height: 50,
      };
  }
};
