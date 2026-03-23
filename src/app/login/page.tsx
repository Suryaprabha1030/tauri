"use client";
import Logo from "@/components/shared/logo/logo";
import { useState, useEffect } from "react";

import { baseConfig } from "@/lib/api/baseConfiguration";
import { BrokersRouterApi } from "@/lib/api/base";

import BrokerLoginPopup from "@/components/LoginPopup/BrokerLoginPopup";
import BrokerLoginContent from "@/components/LoginPopup/BrokerLoginContent";
import BrokerIntegrationPage from "@/components/BrokerLoginContent/FyersLoginContent";
import BrokerLoginDisplay from "@/components/BrokerLoginDisplay/BrokerLoginDisplay";
import { useSearchParams } from "react-router-dom";

const Login = () => {
  const [searchParams] = useSearchParams();
  const brokerNameFromQuery = searchParams.get("brokername");

  const brokers = [
    "Fyers",
    "AngelOne",
    "BillaMoney",
    "IIFL",
    "AliceBlue",
    "Zerodha",
    "Firstock",
    "Upstox",
    "Dhan",
  ];

  // const brokers = ["Fyers"];
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const hostname = window.location.hostname;
  const [hasHostname, setHasHostname] = useState<boolean | null>();
  const [popupOpen, setPopupOpen] = useState(false);
  const [showAllBrokers, setShowAllBrokers] = useState(true);
  const handleBrokerClick = (broker: string) => {
    setSelectedBroker(broker);
    setPopupOpen(true);
  };

  const getImageUrl = (brokerName: string) => {
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
      case "billamoney":
        return {
          url: "/svg/Billamoney.svg",
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

  const getSignUpUrl = (broker: string): string => {
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
      case "billamoney":
        return "https://www.onboarding.billamoney.com/sun/individual_new";
      default:
        return "https://signup.fyers.in/?utm-source=AP-Leads&utm-medium=AP3415";
    }
  };

  const handleBrokerLogin = (e: any, brokerName: string) => {
    e.stopPropagation();
    e.preventDefault();

    const allbrokerapi = new BrokersRouterApi(baseConfig());
    allbrokerapi
      .fetchAllBrokersV1BrokersGet()
      .then((response) => {
        const activeBrokers = response?.data?.filter(
          (broker: any) => broker.is_active,
        );
        const selectedBroker = activeBrokers?.find(
          (broker:any) => broker?.name?.toLowerCase() === brokerName?.toLowerCase(),
        );

        // Redirect to login_url in the same tab
        window.location.href = selectedBroker?.login_url;
      })
      .catch((error) => {
        console.error("Failed to fetch brokers", error);
      });
  };

  useEffect(() => {
    const normalizedHostname = hostname.toLowerCase();

    if (brokerNameFromQuery) {
      const normalizedQuery = brokerNameFromQuery.toLowerCase();
      const matchingBroker = brokers.find(
        (b) => b.toLowerCase() === normalizedQuery,
      );
      if (matchingBroker) {
        setSelectedBroker(matchingBroker);
        if (normalizedHostname.includes(matchingBroker.toLowerCase())) {
          setShowAllBrokers(false);
          setHasHostname(true);
        }
      } else {
        window.location.href = "/login";
      }
    } else {
      // Try to find a broker name from the hostname
      const matchedBroker = brokers.find((b) =>
        normalizedHostname.includes(b.toLowerCase()),
      );

      if (matchedBroker) {
        setSelectedBroker(matchedBroker);
        setShowAllBrokers(false);
        setHasHostname(true);
      } else {
        setHasHostname(false);
      }
    }
  }, [brokerNameFromQuery, hostname, brokers]);

  return (
    <div className="relative flex min-h-screen flex-row items-center justify-between overflow-y-hidden text-black   max-xl:justify-center max-sm:w-screen">
      <div className="absolute left-0 top-0  h-full opacity-50 max-xl:hidden xl:block">
        <img
          className="min-h-screen"
          src="/images/signin-left.png"
          alt=""
          height={800}
          width={380}
        />
      </div>
      <div className=" flex h-screen flex-col  overflow-y-auto max-xl:w-[100%] xl:w-[100%]">
        <div className="flex h-[4rem] flex-col items-start p-2 max-sm:items-center sm:max-xl:items-center">
          <Logo height={100} width={250} />
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center   px-6 xl:flex-row xl:justify-evenly">
          {/* Left Section */}
          <div className="flex h-full w-full flex-col items-start justify-center gap-4  max-sm:hidden sm:max-xl:hidden xl:w-1/2">
            {!brokerNameFromQuery && hasHostname == false ? (
              <>
                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  Zoonest – Where Trading Meets Intelligence
                </h1>
                <p className=" text-lg text-gray-600 md:text-xl">
                  Empowering you with real-time insights for smarter option
                  decisions.
                </p>
              </>
            ) : (
              selectedBroker && (
                <div className=" flex h-[530px] w-full flex-col items-center gap-4  bg-white py-2 transition-all duration-300 max-sm:w-full sm:max-xl:w-[100%]">
                  <BrokerIntegrationPage
                    brokerName={selectedBroker}
                    brokerLogo={getImageUrl(selectedBroker)?.url}
                    brokerImageWidth={getImageUrl(selectedBroker)?.imgWidth}
                    brokerImageheight={getImageUrl(selectedBroker)?.imgHeight}
                    productName="Zoonest"
                  />
                </div>
              )
            )}
          </div>

          {/* Right Section (Broker Login Card) */}

          <div className="w-full max-sm:pb-10 md:mt-0 md:w-[500px] xl:mt-6">
            {!brokerNameFromQuery && hasHostname == false ? (
              <BrokerLoginDisplay
                brokers={brokers}
                handleBrokerClick={handleBrokerClick}
                getImageUrl={getImageUrl}
              />
            ) : (
              selectedBroker && (
                <div className="  relative z-[50] flex h-[530px] w-full flex-col items-center  gap-4 bg-white py-2 transition-all duration-300 max-sm:w-full sm:max-xl:w-[100%]">
                  <div className="pt-2 text-center text-[1.2rem] font-semibold">
                    {`Sign in with ${selectedBroker}`}
                  </div>
                  <div className="w-[350px]">
                    <BrokerLoginContent
                      brokerName={selectedBroker}
                      brokerImageUrl={getImageUrl(selectedBroker)?.url}
                      brokerImageWidth={getImageUrl(selectedBroker)?.width}
                      brokerImageheight={getImageUrl(selectedBroker)?.height}
                      onConnect={handleBrokerLogin}
                      signupUrl={getSignUpUrl(selectedBroker)}
                      showAllbrokers={showAllBrokers}
                    />
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
      {selectedBroker && (
        <BrokerLoginPopup
          isOpen={popupOpen}
          onClose={() => setPopupOpen(false)}
          brokerName={selectedBroker}
          brokerImageUrl={getImageUrl(selectedBroker)?.url}
          brokerImageWidth={getImageUrl(selectedBroker)?.width}
          brokerImageheight={getImageUrl(selectedBroker)?.height}
          onConnect={handleBrokerLogin}
          signupUrl={getSignUpUrl(selectedBroker)}
        />
      )}
      <div className="absolute right-0 top-0  h-full opacity-50 max-xl:hidden xl:block">
        <img
          className="min-h-screen"
          src="/images/signin-right.png"
          alt=""
          height={800}
          width={380}
        />
      </div>
    </div>
  );
};
export default Login;
