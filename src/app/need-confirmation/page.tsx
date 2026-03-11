"use client";
import Logo from "@/components/shared/logo/logo";
import { use, useContext, useEffect, useState } from "react";
import Image from "next/image";
import { UserApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import zApi from "@/lib/api/zApi";
import { AuthContext } from "@/context/authContextProvider";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import config from "@/lib/config";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
// import { toast } from "react-toastify";

const NeedConfirmation = () => {
  const router = useRouter();

  const userApi = new UserApi(baseConfig());
  const apiClient = new zApi(useRouter(), useContext(AuthContext));
  // const [isConfirm, setIsConfirm] = useState("");
  useEffect(() => {
    apiClient.request(
      () => userApi.readMeV1UsersMeGet(),
      (response) => {
        // setIsConfirm(response?.data?.is_confirmed);
        if (!!response.data.is_confirmed) {
          router.push(config.brokersListUrl);
        }
      },
      (error) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
        // toast("Please check your email for further confirmation");
      }
    );
  }, []);

  // useEffect(() => {
  //   if (!isConfirm) {
  //     toast("Please check your email for further confirmation");
  //   }
  // }, []);
  //  for email check

  return (
    <div className="bg-white">
      <div className="flex min-h-screen flex-row items-center justify-center bg-white text-black">
        <div className="flex flex-col">
          <div className="flex flex-col items-center">
            <Logo height={72} width={240} />
          </div>
          <div className="flex-col items-center justify-center pt-6">
            <div className="flex-row">
              <h1 className="bold text-center max-sm:text-xl sm:text-2xl lg:text-3xl xl:text-5xl">
                Welcome to our Beta!
              </h1>
            </div>
            <div className="  flex-row justify-center  max-sm:flex max-sm:w-full  sm:max-xl:flex sm:max-xl:w-full">
              <h3 className="sm:text-medium  py-4 max-sm:flex max-sm:w-[95%] max-sm:flex-row max-sm:items-center max-sm:justify-center max-sm:px-4 max-sm:text-[0.75rem] sm:max-xl:flex sm:max-xl:w-[95%] sm:max-xl:flex-row sm:max-xl:items-center sm:max-xl:justify-center  sm:max-xl:px-4">
                Happy to have you onboard, Thanks for joining our early-access
                Beta members list. We will notify you once we prepared your
                workspace.
              </h3>
            </div>
            <div className="flex-row justify-center">
              <Image
                src="/svg/confirm.svg"
                alt=""
                className="aspect-video h-2/6 w-full justify-center"
                height={250}
                width={250}
              />
            </div>
            <div className="flex-row">
              <h5 className="py-4 text-center max-sm:text-[0.75rem]">
                If you face any delay in confirmation, please write to{" "}
                <a href="mailto:support@zoonest.com" className="text-blue-500">
                  support@zoonest.com
                </a>
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NeedConfirmation;
