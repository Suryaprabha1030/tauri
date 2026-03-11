"use client";
import Logo from "@/components/shared/logo/logo";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { UserApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import zApi from "@/lib/api/zApi";
import { AuthContext } from "@/context/authContextProvider";
import { useRouter } from "next/navigation";
import ErrorAlert from "@/components/shared/ErrorAlert";
import TradingStyleStep from "./trading-Style-step";
import TradingLevelStep from "./trading-level-step";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import Link from "next/link";

const TradingStyle = () => {
  const router = useRouter();
  const [showNextStep, setShowNextStep] = useState(false);
  const [showNextStep2, setShowNextStep2] = useState(false);
  const [values, setValues] = useState({
    trading_style: 0,
    trading_level: 0,
    first_name: "",
    last_name: "",
    phone_number: "",
    error: "",
    success: "",
  });

  const userApi = new UserApi(baseConfig());
  const apiClient = new zApi(useRouter(), useContext(AuthContext));
  const googleSignInUserData: any = useSelector(
    (state: RootState) => state.common.googleSignInUserData
  );
  const saveTradingStyle = (style: number) => {
    setValues({ ...values, trading_style: style });
    setShowNextStep(true);
  };

  const saveTradingLevel = (level: number) => {
    setValues({ ...values, trading_level: level });
    setShowNextStep(false);
    setShowNextStep2(true);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setValues((prevData) => ({ ...prevData, [name]: value }));
  };
  const handlePhoneNumberChange = (e: any) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digit characters
    if (value.length > 10) {
      value = value.slice(0, 10); // Limit to 10 digits
    }
    setValues((prevData) => ({ ...prevData, phone_number: value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const formattedValues = {
      ...values,
      phone_number: `+91${values.phone_number}`,
    }; //handles phone number from 10digits & add +91

    console.log(formattedValues);
    apiClient.request(
      () => userApi.updateMeV1UsersMePut(formattedValues),
      (_) => {
        router.push("/need-confirmation");
      },
      (error) => {
        console.log(error);

        setValues({ ...values, error: error.response.data });
      }
    );
  };

  useEffect(() => {
    if (Object.entries(googleSignInUserData)?.length > 0) {
      setValues((prevValues) => ({
        ...prevValues,
        first_name: googleSignInUserData?.first_name,
        last_name: googleSignInUserData?.last_name,
        phone_number: googleSignInUserData?.phone_number,
      }));
    }
  }, [googleSignInUserData]);

  return (
    <div
      className={`${showNextStep2 && !showNextStep ? "flex h-screen flex-row items-center justify-between overflow-hidden  bg-white text-black" : "bg-white"}`}
    >
      {showNextStep2 && !showNextStep && (
        <div className="w-[30%]  max-xl:hidden">
          <Image
            className="min-h-screen "
            src="/images/signin-left.png"
            alt=""
            height={800}
            width={380}
          />
        </div>
      )}
      <div
        className={`relative flex min-h-screen  ${showNextStep2 && !showNextStep ? "max-sm:w-[100%] sm:w-[100%] xl:w-[40%]" : ""} flex-row items-center justify-center   text-black`}
      >
        <div
          className={`flex  flex-col ${showNextStep2 && !showNextStep ? "w-full xl:items-center xl:justify-center" : "max-sm:w-full max-sm:items-center "}  `}
        >
          <div className="flex flex-col items-center bg-white max-sm:fixed max-sm:w-full ">
            <Logo height={72} width={240} />
          </div>
          {!showNextStep && !showNextStep2 && (
            <TradingStyleStep saveTradingStyle={saveTradingStyle} />
          )}

          {/* SECOND STEP */}

          {showNextStep && !showNextStep2 && (
            <TradingLevelStep saveTradingLevel={saveTradingLevel} />
          )}

          {/* THIRD STEP */}
          {showNextStep2 && !showNextStep && (
            <div className="flex h-full w-full flex-col items-center justify-center   pt-16">
              <h3 className="mb-6 font-semibold max-sm:text-base sm:text-xl md:text-2xl lg:text-3xl">
                Add your Details
              </h3>
              <div className="w-full max-w-md p-8">
                {values.error && (
                  <div className="flex items-center justify-between">
                    <ErrorAlert errorMessage={values.error} />
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 ">
                  <div>
                    <input
                      type="text"
                      name="first_name"
                      value={values.first_name}
                      onChange={handleChange}
                      placeholder="First Name"
                      className="mt-1 w-full rounded border p-2 font-letter "
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="last_name"
                      placeholder="Last Name"
                      value={values.last_name}
                      onChange={handleChange}
                      className="mt-1 w-full rounded border p-2"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone_number"
                      value={values.phone_number}
                      onChange={handlePhoneNumberChange}
                      className="mt-1 w-full rounded border p-2"
                      placeholder="Enter 10 digit phone no"
                      required
                    />
                  </div>
                  <div className="flex w-full items-center justify-center ">
                    <button
                      type="submit"
                      className="flex items-center justify-between gap-2 rounded-full border border-green-500 px-4 py-2 text-base font-medium leading-none text-z-green-500"
                    >
                      <div className="text-sm font-medium text-z-green-500">
                        Continue
                      </div>
                    </button>
                  </div>
                </form>
                <div className="mt-2 flex w-full flex-col items-center justify-center gap-2   ">
                  <div className="text-center text-sm font-normal leading-none text-stone-300">
                    --- or ---
                  </div>
                  <Link
                    className="text-[0.85rem] text-blue-600 underline"
                    href="/live"
                  >
                    {" "}
                    Skip for Now
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showNextStep2 && !showNextStep && (
        <div className="w-[30%]  max-xl:hidden">
          <Image
            className="min-h-screen"
            src="/images/signin-right.png"
            alt=""
            height={800}
            width={380}
          />
        </div>
      )}
    </div>
  );
};
export default TradingStyle;
