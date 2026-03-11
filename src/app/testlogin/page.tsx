"use client";
import Logo from "@/components/shared/logo/logo";
import Link from "next/link";
import { useState, useContext, use, useEffect } from "react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { AuthContext } from "@/context/authContextProvider";
import { useForm } from "react-hook-form";
import ErrorAlert from "@/components/shared/ErrorAlert";
import zApi from "@/lib/api/zApi";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { BrokersRouterApi, UserApi } from "@/lib/api/base";
import Image from "next/image";
import SuccessAlert from "@/components/shared/SuccessAlert";
import LoginWithGoogle from "../login/LoginWithGoogle";
import config from "@/lib/config";
import BrokerLoginPopup from "@/components/LoginPopup/BrokerLoginPopup";

const Login = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const {
    setError,
    formState: { errors },
  } = useForm();

  const { loginSuccess } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const signupSuccess = searchParams.get("signup");
  const apiClient = new zApi(router);
  const userApi = new UserApi(baseConfig());
  const [displayBroker, setDisplayBroker] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const hostname = window.location.hostname;
  const [hasHostname, setHasHostname] = useState<boolean | null>();
  const [popupOpen, setPopupOpen] = useState(false);

  const brokers = [
    "Fyers",
    "AngelOne",
    "BillaMoney",
    "Zerodha",
    "Firstock",
    "IIFL",
    "AliceBlue",
  ];
  const handleBrokerClick = (broker: string) => {
    setSelectedBroker(broker);
    setPopupOpen(true);
  };

  const handleChange =
    (prop: any) => (event: { target: { value: string } }) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await apiClient.request(
      () =>
        userApi.loginForAccessTokenV1UsersTokenPost(
          values.email,
          values.password,
        ),
      (response) => {
        const accessToken = response?.data?.access_token;
        loginSuccess(accessToken);

        // for exiting user receive trading style input
        if (
          response?.data?.user?.first_name == null ||
          response?.data?.user?.last_name == null ||
          response?.data?.user?.phone_number == null
        ) {
          router.push("/trading-style");
          return;
        }

        if (response?.data?.user?.is_confirmed == false) {
          router.push("/need-confirmation");
          return;
        }

        router.push(config.brokersListUrl);
      },
      (error) => {
        setError("root", { message: error.response.data });
      },
    );
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
      case "aliceblue":
        return {
          url: "/svg/Aliceblue.svg",
          widthHeight:
            "max-sm:h-[2.5rem] max-sm:w-[2.5rem] sm:max-md:h-[3rem]  sm:max-md:w-[4.5rem] md:max-2xl:h-[3.5rem] md:max-2xl:w-[5rem] 2xl:h-[55%] 2xl:w-[55%] 2xl:p-4",
          width: 100,
          height: 35,
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
          (broker) => broker?.name?.toLowerCase() === brokerName?.toLowerCase(),
        );

        //Redirect to login_url in the same tab
        window.location.href = selectedBroker?.login_url;
      })
      .catch((error) => {
        console.error("Failed to fetch brokers", error);
      });
  };

  return (
    <div className="flex min-h-screen flex-row items-center justify-between text-black   max-xl:justify-center max-sm:w-screen">
      <div className="max-xl:hidden">
        <img
          className="min-h-screen"
          src="/images/signin-left.png"
          alt=""
          height={800}
          width={380}
        />
      </div>
      <div className="flex flex-1 flex-col  max-xl:w-[100%]">
        <div className="flex flex-col items-center">
          <Logo height={72} width={240} />
        </div>
        <div className="flex-col items-center justify-center pt-10 ">
          <div className="text-center text-3xl font-semibold leading-10 text-black">
            Sign in
          </div>
          <div className="flex items-center justify-center py-4">
            <LoginWithGoogle name="Sign in with Google" />
          </div>

          <div className="flex w-full items-center justify-center gap-1.5 py-2">
            {/* <div className="w-full border border-stone-300"></div> */}
            <div className="text-center text-sm font-normal leading-none text-stone-300">
              --- or ---
            </div>
            {/* <div className="w-full border border-stone-300"></div> */}
          </div>
          <div className="flex w-full flex-col items-center gap-3 px-24 py-4">
            <form
              onSubmit={handleFormSubmit}
              className="flex w-full flex-col items-center gap-3"
            >
              {errors.root?.message && (
                <ErrorAlert errorMessage={errors.root.message} />
              )}
              {!!signupSuccess && (
                <SuccessAlert
                  message={"Succesfully Signed Up, Please do login..."}
                />
              )}
              <input
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange("email")}
                type="email"
                placeholder="Email"
                required
                className="flex w-full items-center gap-3 rounded-md border border-neutral-200 px-5 py-3"
              />
              <input
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange("password")}
                type="password"
                placeholder="Password"
                required
                className="flex w-full items-center gap-3 rounded-md border border-neutral-200 px-5 py-3"
              />
              <button
                type="submit"
                className="mt-5 flex h-11 w-[10rem] items-center justify-center rounded-3xl border border-z-green-500 text-base  font-medium leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white"
              >
                Sign in
              </button>
            </form>
          </div>
          <div className="flex w-full items-center justify-center gap-1.5 py-2">
            {/* <div className="w-full border border-stone-300"></div> */}
            <div className="text-center text-sm font-normal leading-none text-stone-300">
              --- or ---
            </div>
            {/* <div className="w-full border border-stone-300"></div> */}
          </div>

          {/* {showAllBrokers && ( */}
          <div className="my-6 flex h-[320px] w-full flex-col gap-4 rounded-lg border border-gray-200 bg-white py-2 shadow-lg transition-all duration-300 max-sm:w-full sm:max-lg:w-[100%]">
            <div className="pt-2 text-center text-[1.2rem] font-semibold">
              Sign in with your broker
            </div>

            <div className="grid w-full grid-cols-3 gap-4 overflow-y-auto px-4 py-4 max-sm:grid-cols-2 sm:grid-cols-3">
              {brokers?.map((broker) => (
                <div
                  onClick={() => handleBrokerClick(broker)}
                  key={broker}
                  className={`relative z-[1000] flex h-[6rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white p-2 shadow-lg transition-all duration-300  hover:scale-110`}
                >
                  <div
                    className={`flex flex-col items-center justify-center gap-2 pt-2 
             `}
                  >
                    <img
                      src={getImageUrl(broker)?.url}
                      alt={broker}
                      height={getImageUrl(broker)?.height}
                      width={getImageUrl(broker)?.width}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* )} */}
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
        </div>
      </div>
      <div className="max-xl:hidden">
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
