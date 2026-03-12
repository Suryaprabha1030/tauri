import React, { useContext, useEffect, useState } from "react";

import Link from "next/link";
import LiveHeader from "./LiveHeader";
import LoadingComponent from "../loading/Loading";
import { BrokersRouterApi, UserApi, UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContextProvider";
import zApi from "@/lib/api/zApi";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { setShowSwitchbroker } from "@/lib/redux/slices/CommonSlice";
import { useDispatch, useSelector } from "react-redux";
import config from "@/lib/config";

import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import ComingSoonModal from "./ComingSoonModal";

type Broker = {
  id: number;
  name: string;
  api_key: string;
  login_url: string;
  is_active: boolean;
};

type UserBrokerMapping = {
  broker_code: number;
  client_code: string;
  user_full_name: string;
  broker_id: number;
};

const ConnectFavBroker = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [client, setClient] = useState<UserBrokerMapping[]>([]);
  const [brokerLogin, setBrokerLogin] = useState<UserBrokerMapping[]>([]);
  const [loginValid, setLoginValid] = useState<{
    [brokerCode: number]: boolean;
  }>({});
  const [loading, setLoading] = useState(true);
  const [activeBroker, setActiveBroker] = useState<number | null>(null);
  const [currentStartIndex, setCurrentStartIndex] = useState(0);
  const [brokersPerPage, setBrokersPerPage] = useState(0);
  const userApi = new UserApi(baseConfig());
  const apiClient = new zApi(useNavigate(), useContext(AuthContext));
  const [userMail, setUserMail] = useState("");
  const dispatch = useDispatch();
  const [maintainCards, setMaintainCards] = useState<null | number>(0);
  const [clickNextButton, setClickNextButton] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [priveledgeUser, setPriveledgeUser] = useState(false);
  const [userId, setUserId] = useState(null);
  const [signUpMode, setsignUpMode] = useState<any>(null);
  const [sortedBroker, setSortedBroker] = useState<any>([]);
  const sampleBrokerData = [
    {
      name: "Upstox",
      url: "https://upstox.com/",
      login_url: "https://api.upstox.com/login?api_key=DUMMY_UPSTOX_KEY",
      api_key: "DUMMY_UPSTOX_KEY",
      is_active: true,
      id: 10,
      broker_code: null,
      client_code: null,
      user_full_name: null,
      read_only: false,
      isConnected: false,
    },
    {
      name: "Dhan",
      url: "https://dhan.co/",
      login_url: "https://api.dhan.co/login?api_key=DUMMY_DHAN_KEY",
      api_key: "DUMMY_DHAN_KEY",
      is_active: true,
      id: 11,
      broker_code: null,
      client_code: null,
      user_full_name: null,
      read_only: false,
      isConnected: false,
    },
  ];
  const handleXlResize = () => {
    /* for above md */
    const mdToLg = window.matchMedia(
      "(min-width: 768px) and (max-width: 991px)",
    );
    const lgToXl = window.matchMedia(
      "(min-width: 992px) and (max-width: 1399px)",
    );
    const XlTo2xl = window.matchMedia("(min-width: 1400px) ");
    if (mdToLg.matches) {
      setBrokersPerPage(3);
    }
    if (lgToXl.matches) {
      setBrokersPerPage(4);
    }
    if (XlTo2xl.matches) {
      setBrokersPerPage(5); // 5 clients per page
    }
  };

  useEffect(() => {
    if (loginValid && Object.entries(loginValid)?.length !== 0) {
      const validBrokerCodes: any = Object.keys(loginValid)
        .filter((key) => loginValid[+key])
        .map(Number);

      // Store brokerCodes in sessionStorage
      sessionStorage.setItem(
        "ExistbrokerCode",
        JSON.stringify(validBrokerCodes),
      );
    }
  }, [loginValid, client]);

  useEffect(() => {
    const getProfileData = async () => {
      apiClient.request(
        () => userApi.readMeV1UsersMeGet(),
        (response) => {
          setUserMail(response?.data?.email);
          setUserId(response?.data?.id);
          if (
            response?.data?.data != null &&
            response?.data?.data?.signup_mode != null
          ) {
            setsignUpMode(response?.data?.data?.signup_mode);
          }
        },

        (error) => {},
      );
    };
    getProfileData();
  }, []);

  useEffect(() => {
    const fetchData = () => {
      const allbrokerapi = new BrokersRouterApi(baseConfig());
      const brokerapi = new UserBrokerRouterApi(baseConfig());
      Promise.all([
        allbrokerapi.fetchAllBrokersV1BrokersGet(),
        brokerapi.fetchMyBrokersV1UsersMeBrokersGet(),
      ]).then(([allBrokersResponse, userBrokersResponse]) => {
        if (
          userBrokersResponse &&
          userBrokersResponse?.data?.user_broker_mapping?.length == 0
        ) {
          setLoading(false);
        }
        const userEmail = userBrokersResponse?.data?.email;
        const isPrivilegedUser = config.userEmail.includes(userEmail);
        if (isPrivilegedUser) setPriveledgeUser(true);
        dispatch(setShowSwitchbroker(isPrivilegedUser));
        const userBrokerMappings =
          userBrokersResponse.data.user_broker_mapping.map(
            (userBroker: UserBrokerMapping) => {
              return brokerapi
                .fetchMyBrokerProfileV1UsersMeBrokersBrokerCodeProfileGet(
                  //To get the client code ,userfullname
                  userBroker.broker_code,
                )
                .then((profileResponse) => {
                  setLoading(false);

                  const hasProfile =
                    profileResponse?.data &&
                    Object.entries(profileResponse?.data).length > 0 &&
                    profileResponse?.data?.client_code != null;

                  if (hasProfile) {
                    setLoginValid((prevState) => ({
                      ...prevState,
                      [userBroker.broker_code]: true,
                    }));

                    return {
                      ...userBroker,
                      user_full_name: profileResponse.data.user_full_name,
                    };
                  } else {
                    // No profile (204 or empty), treat as "needs login"
                    setLoginValid((prevState) => ({
                      ...prevState,
                      [userBroker.broker_code]: false,
                    }));

                    return {
                      ...userBroker,
                      user_full_name: null, // explicitly null for UI
                    };
                  }
                })

                .catch((error) => {
                  if (error?.response && error?.response?.status == 401) {
                    autoLogoutTokenRemove(router);
                  }
                  if (error?.response && error?.response?.status == 456) {
                    brokerLogoutTokenRemove(router);
                  }

                  setLoginValid((prevState) => ({
                    ...prevState,
                    [userBroker.broker_code]: false,
                  }));

                  return userBroker; // Return the original object in case of error
                });
            },
          );
        Promise.all(userBrokerMappings)
          .then((updatedMappings) => {
            const cleanedMappings = updatedMappings.filter(Boolean); // remove nulls
            setClient(cleanedMappings);
            setBrokerLogin(cleanedMappings);
            const allBrokers = allBrokersResponse.data;
            // Step 1: Cards for each account (multiple broker_codes per broker_id allowed)
            const connectedCards = cleanedMappings.map((mapping) => {
              const broker = allBrokers.find((b) => b.id === mapping.broker_id);
              return {
                ...broker,
                ...mapping, // contains broker_code, client_code, user_full_name
                isConnected: true,
              };
            });

            // Step 2: Brokers not connected at all — show 1 "connect" card
            const connectedBrokerIds = new Set(
              cleanedMappings.map((m) => m.broker_id),
            );

            const unconnectedCards = allBrokers
              .filter((broker) => !connectedBrokerIds.has(broker.id))
              .map((broker) => ({
                ...broker,
                broker_code: null,
                client_code: null,
                user_full_name: null,
                read_only: false,
                isConnected: false,
              }));

            // Step 3: Combine all cards
            const allCards = [...connectedCards, ...unconnectedCards];

            // Step 4: Sort by login category
            const sorted = allCards.sort((a, b) => {
              const getCategory = (entry: typeof a) => {
                if (
                  loginValid[entry.broker_code] ||
                  (entry.user_full_name && entry.client_code)
                ) {
                  return 0; // Logged-in
                } else if (entry.client_code && !entry.user_full_name) {
                  return 1; // Needs login
                } else if (!entry.client_code && entry.is_active) {
                  return 2; // Connect
                } else {
                  return 3; // Coming soon
                }
              };

              const catA = getCategory(a);
              const catB = getCategory(b);
              return catA === catB ? a.name.localeCompare(b.name) : catA - catB;
            });
            setSortedBroker(sorted);
            // Step 5: Apply visibility rule
          })
          .catch((error) => {
            if (error?.response?.status === 401) {
              autoLogoutTokenRemove(router);
            }
            if (error?.response && error?.response?.status == 456) {
              brokerLogoutTokenRemove(router);
            }
          });
      });
    };

    fetchData();

    handleXlResize();

    window.addEventListener("resize", handleXlResize);

    return () => {
      window.removeEventListener("resize", handleXlResize);
    };
  }, []);

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    const brokerFromHost = hostname.split(".")[0];
    let visibleBrokers: any[] = [];
    if (sortedBroker && sortedBroker.length > 0) {
      if (priveledgeUser) {
        // Privileged users see all active brokers
        visibleBrokers = sortedBroker.filter((b) => b.is_active);
      } else {
        const isActiveBrokers = sortedBroker.filter(
          (b) => b.is_active === true,
        );
        const active = [...isActiveBrokers, ...sampleBrokerData];

        if (signUpMode?.toLowerCase() === "google") {
          // If signup mode is Google — show all active brokers + sample data
          visibleBrokers = active;
        } else {
          // Try to match broker name inside signupMode
          const matchedBroker = isActiveBrokers.find((b) =>
            signUpMode?.toLowerCase().includes(b.name.toLowerCase()),
          );

          if (matchedBroker) {
            visibleBrokers = [matchedBroker];
          } else {
            // Fallback — show all active brokers + sample data
            visibleBrokers = active;
          }
        }
      }
      setBrokers(visibleBrokers);
    }
  }, [sortedBroker, signUpMode]);

  useEffect(() => {
    /* only for small screen and medium screen */
    const handleSmResize = () => {
      const smTomd = window.matchMedia(
        "(min-width: 300px) and (max-width: 767px)",
      );
      if (smTomd.matches) {
        setBrokersPerPage(brokers.length);
      }
    };
    handleSmResize();
  }, [brokers]);
  useEffect(() => {
    /* only for small screen and medium screen */
    const handleSmResize = () => {
      const smTomd = window.matchMedia(
        "(min-width: 300px) and (max-width: 768px)",
      );
      if (smTomd.matches) {
        setCurrentStartIndex(0);
        setBrokersPerPage(brokers.length);
      }
    };
    window.addEventListener("resize", handleSmResize);

    return () => {
      window.removeEventListener("resize", handleSmResize);
    };
  }, [brokers]);

  useEffect(() => {
    const handleCardsdynamically = () => {
      if (maintainCards !== brokersPerPage && clickNextButton) {
        setCurrentStartIndex(0);
      }
    };
    handleCardsdynamically();
    window.addEventListener("resize", handleCardsdynamically);

    return () => {
      window.removeEventListener("resize", handleCardsdynamically);
    };
  }, [window.innerWidth]);

  const getImageUrl = (brokerName: string) => {
    switch (brokerName.toLowerCase()) {
      case "angelone":
        return {
          url: "/svg/angelone.svg",
          widthHeight:
            "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-[7.5rem]  sm:max-md:w-[7.5rem] md:max-2xl:h-[8rem] md:max-2xl:w-[8rem] 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
          width: 85,
          height: 85,
        };
      case "zerodha":
        return {
          url: "/svg/Zerodha.svg",
          widthHeight:
            "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-[7.5rem]  sm:max-md:w-[7.5rem] md:max-2xl:h-[8rem] md:max-2xl:w-[8rem] 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
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
      case "iifl":
        return {
          url: "/svg/iifl_logo.svg",
          widthHeight:
            "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-[7.5rem]  sm:max-md:w-[7.5rem] md:max-2xl:h-[8rem] md:max-2xl:w-[8rem] 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
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
      case "upstox":
        return {
          url: "/svg/upstocx.svg",
          widthHeight:
            "max-sm:h-[5.5rem] max-sm:w-[5.5rem]  sm:max-md:h-[6rem]  sm:max-md:w-[6rem] md:max-2xl:h-[6rem] md:max-2xl:w-[6rem] 2xl:h-[65%] 2xl:w-[55%] 2xl:p-4",
          width: 75,
          height: 75,
        };

      case "fyers":
        return {
          url: "/svg/fyers.svg",
          widthHeight:
            "max-sm:h-[5.5rem] max-sm:w-[5.5rem] sm:max-md:h-[6.5rem] sm:max-md:w-[6.5rem] md:max-2xl:h-[7rem] md:max-2xl:w-[7rem] 2xl:h-[75%] 2xl:w-[75%] 2xl:p-4",
          width: 100,
          height: 100,
        };
      case "aliceblue":
        return {
          url: "/svg/Aliceblue.svg",
          widthHeight:
            "max-sm:h-[5.5rem] max-sm:w-[5.5rem] sm:max-md:h-[6.5rem] sm:max-md:w-[6.5rem] md:max-2xl:h-[7rem] md:max-2xl:w-[7rem] 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
          width: 100,
          height: 100,
        };
      case "billamoney":
        return {
          url: "/svg/Billamoney.svg",
          widthHeight:
            "max-sm:h-4/6 max-sm:w-4/6  sm:max-md:h-[7.5rem]  sm:max-md:w-[7.5rem] md:max-2xl:h-[8rem] md:max-2xl:w-[8rem] 2xl:h-[65%] 2xl:w-[65%] 2xl:p-4",
          width: 100,
          height: 100,
        };
      default:
        return {
          url: "/svg/dhan.svg",
          widthHeight:
            "max-sm:h-[5.5rem] max-sm:w-[5.5rem]  sm:max-md:h-[6rem]  sm:max-md:w-[6rem] md:max-2xl:h-[6rem] md:max-2xl:w-[6rem] 2xl:h-[65%] 2xl:w-[53%] 2xl:p-4",
          width: 75,
          height: 75,
        };
    }
  };

  const handleNext = () => {
    if (currentStartIndex + brokersPerPage < brokers.length) {
      setCurrentStartIndex(currentStartIndex + brokersPerPage);
    }
    setMaintainCards(brokersPerPage);
    setClickNextButton(true);
  };

  const handlePrev = () => {
    if (currentStartIndex > 0) {
      setCurrentStartIndex(currentStartIndex - brokersPerPage);
    }
    setClickNextButton(false);
  };
  const visibleBrokers: any = brokers.slice(
    currentStartIndex,
    currentStartIndex + brokersPerPage,
  );

  const router = useNavigate();
  const handlePopup = (e: any, url: any) => {
    e.stopPropagation();
    e.preventDefault();
    const width = window.innerWidth * 0.75; // 3/4 of the actual window width
    const height = window.innerHeight * 0.75; // 3/4 of the actual window height
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const popup = window.open(
      url,
      "popup",
      `width=${width},height=${height},top=${top},left=${left}`,
    );

    if (popup) {
      console.log("AUTH Page Entered");
      // Listen for messages from the popup
      window.addEventListener(
        "message",
        (event) => {
          // Replace with the actual origin you're expecting from the popup
          // if (event.origin !== 'https://your-popup-domain.com') return;

          // Assuming event.data contains the next route or status message
          const message_data = event?.data?.split("_");

          if (
            message_data[0] === "authentication" &&
            message_data[1] === "success"
          ) {
            popup.close(); // Close the popup

            // Use React Router's useNavigate to redirect

            router(`${config.brokersListUrl}/${message_data[2]}/psv`); // Redirect to a dynamic route
          }
        },
        false,
      );
    }
  };

  const navigateToPsv = (userBroker: any) => {
    if (loginValid[userBroker?.broker_code]) {
      router(`${config.brokersListUrl}/${userBroker?.broker_code}/psv`);
    }
  };
  const SendNotification = (BrokerName: string, userId: any) => {
    if (
      typeof window !== "undefined" &&
      typeof (window as any).gtag === "function" &&
      process.env.NODE_ENV != "development"
    ) {
      (window as any).gtag("event", "broker_connect_click", {
        userId: userId ?? null,
        broker_name: BrokerName,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        url: window.location.origin,
      });
    }
  };

  return (
    <div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <div className="flex w-full flex-col items-center justify-center gap-[1.5rem]  max-md:scrollbar-none  max-sm:overflow-x-hidden sm:overflow-hidden sm:max-md:overflow-scroll lg:h-screen">
            <LiveHeader userMail={userMail} />
            <div className="flex h-full w-full flex-col items-center justify-center gap-[2rem]  text-black max-xl:mt-[6.3rem]">
              <div className="relative items-center justify-center   max-2xl:justify-center max-xl:flex max-md:h-max max-sm:w-screen sm:max-lg:w-screen sm:max-md:items-center sm:max-md:px-6 md:max-lg:h-[40rem] md:max-lg:px-4 lg:h-[30rem] lg:overflow-hidden lg:max-xl:w-[60rem] xl:w-[73rem] xl:max-2xl:px-12 2xl:w-[84rem]  ">
                <button
                  onClick={handlePrev}
                  className={`absolute left-0 -translate-y-1/2 transform max-md:hidden max-sm:hidden md:max-2xl:left-3  md:max-lg:top-[30%] lg:max-2xl:top-[39%] 2xl:top-1/2 ${
                    currentStartIndex === 0 ? "hidden" : ""
                  }`}
                  aria-label="Previous"
                >
                  {" "}
                  &#10094;
                </button>
                <div
                  className={`scrollbar-hide  max-md:grid max-md:items-center max-md:px-6 max-md:py-4  max-sm:w-screen max-sm:gap-6 sm:overflow-hidden sm:max-2xl:gap-6 sm:max-md:h-full   sm:max-md:w-screen md:flex md:flex-row md:max-2xl:py-[1rem] md:max-lg:h-[30rem] md:max-lg:w-[55rem] md:max-lg:px-5 lg:max-2xl:h-[27rem] lg:max-xl:w-[60rem] lg:max-xl:px-12 xl:max-2xl:px-5 2xl:h-[30rem] 2xl:gap-6 ${brokers?.length > 5 ? "" : "2xl:justify-center"} ${visibleBrokers?.length % brokersPerPage == 0 || brokers.length < brokersPerPage || visibleBrokers.length == 1 ? "md:max-2xl:justify-center" : "md:max-2xl:justify-start"} ${visibleBrokers?.length === 1 ? "  max-sm:grid-cols-1 max-sm:place-items-center sm:max-md:grid-cols-1 sm:max-md:place-items-center" : "max-sm:grid-cols-2 sm:max-md:grid-cols-2"}  2xl:overflow-x-auto 2xl:p-6`}
                >
                  {visibleBrokers?.map((broker, index) => {
                    const userBroker = client.find(
                      (c) =>
                        c?.broker_id === broker?.id &&
                        c?.broker_code === broker?.broker_code,
                    );

                    const isActive = activeBroker === broker?.id;
                    return (
                      <div
                        className={`relative flex flex-col items-center justify-center rounded-lg bg-white shadow-lg transition-all duration-300 hover:scale-110 max-md:w-[10rem] max-sm:h-64 max-sm:w-40 sm:max-md:h-[17rem] sm:max-md:w-56 md:max-lg:h-[20rem]  md:max-lg:w-56 lg:max-2xl:h-[20rem] lg:max-xl:w-[13rem] xl:w-[15rem] xl:justify-center ${
                          isActive ? "h-[29rem]" : "h-[22rem]"
                        }`}
                        key={index}
                        onClick={() => navigateToPsv(userBroker)}
                      >
                        <div
                          className={`relative flex h-1/3 w-full cursor-pointer items-center justify-center overflow-hidden transition-transform 
                          max-sm:h-[70px] sm:max-lg:h-1/3 xl:h-[35%] ${
                            isActive ? "scale-95 transform" : ""
                          }
                          `}
                        >
                          <img
                            src={getImageUrl(broker?.name)?.url}
                            className={`object-contain max-lg:pt-2 ${getImageUrl(broker?.name)?.widthHeight} `}
                            height={getImageUrl(broker?.name)?.height}
                            width={getImageUrl(broker?.name)?.width}
                            alt={broker.name}
                          />
                          {loginValid[broker?.broker_code] &&
                            userBroker &&
                            userBroker?.user_full_name && (
                              <span>
                                <span className="absolute animate-ping rounded-full border-2 border-gray-200 bg-z-green-500 max-sm:right-2 max-sm:top-2 max-sm:h-3 max-sm:w-3 sm:max-lg:right-2.5 sm:max-lg:top-2.5 sm:max-lg:h-3.5 sm:max-lg:w-3.5 lg:right-3 lg:top-3 lg:h-4 lg:w-4"></span>
                                <span className="absolute  rounded-full border-2 border-gray-200 bg-z-green-500 max-sm:right-2 max-sm:top-2 max-sm:h-3 max-sm:w-3 max-sm:border-[1px] sm:border-2 sm:max-lg:right-2.5 sm:max-lg:top-2.5 sm:max-lg:h-3.5 sm:max-lg:w-3.5 lg:right-3 lg:top-3 lg:h-4 lg:w-4"></span>
                              </span>
                            )}
                          {!broker?.is_active && !userBroker?.client_code && (
                            <div className="absolute right-0 top-0">
                              <span
                                className="absolute right-0 top-0 h-0 w-0 border-l-[65px] border-t-[65px] border-transparent  max-sm:border-l-[60px] max-sm:border-t-[60px] sm:border-l-[65px] sm:border-t-[65px]"
                                style={{ borderTopColor: "#53D1AC" }}
                              ></span>
                              <span className="absolute right-2 top-2 rotate-45 transform text-center text-[0.55rem] font-bold text-white max-sm:right-1.5 max-sm:top-2 sm:right-2 sm:top-2">
                                Coming Soon
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex  flex-col  transition-all duration-500 ease-in max-sm:h-[70%] sm:max-lg:h-3/4 lg:h-3/5 2xl:gap-1 2xl:p-2">
                          {/* <div className="text-center font-semibold max-md:text-sm  sm:text-lg">
                            {broker?.name}
                          </div> */}
                          {userBroker && userBroker?.client_code ? (
                            <div className="flex flex-col   max-md:justify-between max-sm:h-[90%] max-sm:gap-2 sm:max-md:h-[80%] sm:max-md:gap-3 md:h-[80%] lg:h-[100%] lg:justify-between">
                              <div className="flex flex-col items-center justify-center gap-2">
                                <h1 className="h-5 text-center font-semibold text-black max-sm:text-sm">
                                  {userBroker?.client_code}
                                </h1>
                                <div className=" text-center text-[0.65rem] uppercase text-black sm:max-md:px-4 sm:max-md:pb-2 md:max-lg:h-24 md:max-lg:py-2 lg:h-10">
                                  {userBroker?.user_full_name}
                                </div>
                              </div>

                              {loginValid[userBroker.broker_code] &&
                              userBroker?.user_full_name ? (
                                <div>
                                  <div className="flex justify-center gap-4  max-md:h-[2.5rem] max-md:items-end">
                                    <a
                                      href={`${config.brokersListUrl}/${userBroker?.broker_code}/psv`}
                                    >
                                      <button
                                        className="flex items-center justify-center rounded-3xl border border-z-green-500 px-2 py-1  font-medium leading-none  text-z-green-500   hover:bg-z-green-500 hover:text-white max-md:w-[2rem] max-sm:text-[0.6rem]  sm:max-md:mt-2 sm:max-md:text-[0.75rem] md:max-lg:w-[3rem] lg:max-xl:w-[3.2rem]  lg:max-xl:text-[0.8rem] xl:w-[4rem] xl:py-2 xl:text-[0.8rem]"
                                        onClick={(e: any) =>
                                          e.stopPropagation()
                                        }
                                      >
                                        PSV
                                      </button>
                                    </a>
                                    <a
                                      href={`${config.brokersListUrl}/${userBroker?.broker_code}/psb`}
                                    >
                                      <button
                                        className="flex items-center justify-center rounded-3xl border border-z-green-500 px-2 py-1  font-medium leading-none  text-z-green-500   hover:bg-z-green-500 hover:text-white max-md:w-[2rem] max-sm:text-[0.6rem]  sm:max-md:mt-2 sm:max-md:text-[0.75rem] md:max-lg:w-[3rem] lg:max-xl:w-[3.2rem]  lg:max-xl:text-[0.8rem] xl:w-[4rem] xl:py-2 xl:text-[0.8rem]"
                                        onClick={(e: any) =>
                                          e.stopPropagation()
                                        }
                                      >
                                        PSB
                                      </button>
                                    </a>
                                    <a
                                      href={`${config.brokersListUrl}/${userBroker?.broker_code}/oi`}
                                    >
                                      <button
                                        className="flex items-center justify-center rounded-3xl border border-z-green-500 px-2 py-1  font-medium leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white max-xl:w-[2rem] max-sm:text-[0.6rem]  sm:max-md:mt-2 sm:max-md:text-[0.75rem]  md:max-lg:w-[3rem] lg:max-xl:w-[3.2rem]  lg:max-xl:text-[0.8rem] xl:w-[4rem] xl:py-2 xl:text-[0.8rem] 2xl:px-3 "
                                        onClick={(e: any) =>
                                          e.stopPropagation()
                                        }
                                      >
                                        OI
                                      </button>
                                    </a>
                                  </div>
                                  <div className="flex items-center gap-2  px-2 py-1 max-md:py-0.5">
                                    <div className="h-px flex-1 bg-stone-300"></div>
                                    <div className="text-center text-sm font-normal text-stone-400">
                                      or
                                    </div>
                                    <div className="h-px flex-1 bg-stone-300"></div>
                                  </div>

                                  <div className=" flex justify-center">
                                    <button
                                      className="rounded-3xl border border-z-green-500 px-3 py-0.5 text-sm font-medium text-z-green-500 hover:bg-z-green-500 hover:text-white max-sm:text-[0.6rem] sm:max-md:py-0.5 sm:max-md:text-[0.75rem] lg:text-[0.8rem] lg:max-xl:text-[0.8rem]  xl:py-1 2xl:text-[0.8rem]"
                                      onClick={(e) =>
                                        handlePopup(e, broker?.login_url)
                                      }
                                    >
                                      Connect Another Account
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col   justify-end  max-sm:h-full max-sm:justify-end max-sm:gap-2 sm:max-md:h-[80%] md:h-[80%] lg:pb-[1rem] xl:gap-4 ">
                                  <h1 className="h-5 text-center text-black"></h1>
                                  <div className="h-10 text-center text-[0.65rem] uppercase text-black"></div>
                                  <button
                                    className="flex w-full items-center justify-center rounded-3xl border border-z-green-500  px-2 py-1  font-medium leading-none  text-z-green-500 hover:bg-z-green-500 hover:text-white max-sm:mb-[1.25rem]  max-sm:text-[0.6rem] sm:max-md:mt-[1.2rem] sm:max-md:text-[0.75rem] md:max-lg:mt-[1.4rem] md:max-lg:text-[0.9rem]  lg:max-xl:text-[0.8rem] xl:py-2 xl:text-[0.8rem]"
                                    onClick={(e) =>
                                      handlePopup(e, broker?.login_url)
                                    }
                                  >
                                    Connect
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            // </div>
                            broker.is_active &&
                            !userBroker?.client_code && (
                              <div className="flex flex-col justify-end  max-sm:h-full max-sm:justify-end max-sm:gap-2 sm:max-md:h-[80%] md:h-[80%] lg:pb-[1rem] xl:gap-4 ">
                                <h1 className="h-5 text-center text-black"></h1>
                                <div className="h-10 text-center text-[0.65rem] uppercase text-black"></div>
                                <button
                                  className="flex w-full items-center justify-center rounded-3xl border  border-z-green-500 px-2  py-1 font-medium  leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white  max-sm:mb-[1.25rem] max-sm:text-[0.6rem] sm:max-md:mt-[1.2rem] sm:max-md:text-[0.75rem] md:max-lg:mt-[1.4rem] md:max-lg:text-[0.9rem] lg:max-xl:text-[0.8rem] xl:py-2 xl:text-[0.8rem]"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const brokerName =
                                      broker?.name?.toLowerCase();

                                    const isNotSupportedBroker =
                                      !config.enabledBrokers.some((b) =>
                                        brokerName.includes(b),
                                      );

                                    if (
                                      !priveledgeUser &&
                                      isNotSupportedBroker
                                    ) {
                                      SendNotification(broker?.name, userId);
                                      setShowComingSoon(true);
                                      return;
                                    }

                                    // Otherwise proceed to actual connection
                                    handlePopup(e, broker?.login_url);
                                  }}
                                >
                                  Connect
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button
                  onClick={handleNext}
                  className={`absolute right-0 -translate-y-1/2 transform max-md:hidden sm:max-md:top-1/3 md:max-2xl:right-3 md:max-lg:top-[29%] lg:max-2xl:top-[39%] 2xl:top-1/2  ${
                    currentStartIndex + brokersPerPage >= brokers?.length
                      ? "hidden"
                      : ""
                  }`}
                  aria-label="Next"
                >
                  &#10095;
                </button>
                {showComingSoon && (
                  <ComingSoonModal
                    show={showComingSoon}
                    onClose={() => setShowComingSoon(false)}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConnectFavBroker;
