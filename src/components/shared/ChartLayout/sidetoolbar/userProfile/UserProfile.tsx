import ErrorAlert from "@/components/shared/ErrorAlert";
import SuccessAlert from "@/components/shared/SuccessAlert";
import { UserApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContextProvider";
import { useRouter } from "next/navigation";
import zApi from "@/lib/api/zApi";
import Image from "next/image";
import ProfileSkeleton from "@/app/profile/profileSkeleton";
import Headings from "../sharedContent/headings";
import RemoveButton from "../sharedContent/RemoveButton";

import { WidthAdjusterDoubleClick } from "@/lib/util/sideToolBar/sidetoolbarCommon";
import LogoutButton from "./LogoutButton";

import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";

const UserProfile = ({ setLeftWidth, leftWidth }: any) => {
  const userApi = new UserApi(baseConfig());
  const apiClient = new zApi(useRouter(), useContext(AuthContext));
  const [profileData, setProfileData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    loading: true,
    error: "",
    success: "",
  });
  const router = useRouter();

  const getProfileData = async () => {
    apiClient.request(
      () => userApi.readMeV1UsersMeGet(),
      (response) => {
        setProfileData((prevData) => ({
          ...prevData,
          first_name: response.data.first_name,
          last_name: response.data.last_name,
          email: response.data.email,
          phone_number: response.data.phone_number
            ? response.data.phone_number.substring(4)
            : "",
          loading: false,
        }));
      },
      (error) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      }
    );
  };

  const updateProfileData = async () => {
    apiClient.request(
      () => userApi.updateMeV1UsersMePut({ ...profileData }),
      (_) => {
        setProfileData((prevData) => ({
          ...prevData,
          success: "Updated Successfuly",
          loading: false,
        }));
      },
      (error) => {
        if (error?.response && error?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (error?.response && error?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
        setProfileData((prevData) => ({
          ...prevData,
          error: error?.response?.data,
          loading: false,
        }));
      }
    );
  };

  useEffect(() => {
    getProfileData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setProfileData((prevData) => ({
      ...prevData,
      loading: true,
      success: "",
      error: "",
    }));
    updateProfileData();
  };

  return (
    <Fragment>
      <span
        className=" flex flex-row items-center justify-between md:max-xl:sticky md:max-xl:top-0 md:max-xl:z-[50]"
        onDoubleClick={() => WidthAdjusterDoubleClick(leftWidth, setLeftWidth)}
      >
        <Headings name="User Info" />

        <span className="flex w-[3.8rem] flex-row gap-2 md:max-xl:mr-2 md:max-xl:mt-1 md:max-xl:w-[4rem] ">
          <LogoutButton />
          <RemoveButton />
        </span>
      </span>
      <div className="flex w-full flex-col items-center justify-start text-[0.75rem] font-letter text-black md:max-xl:max-h-[90%] md:max-xl:overflow-y-auto md:max-xl:scrollbar-none  ">
        <div className="w-full max-w-md p-8 xl:max-2xl:px-6 xl:max-2xl:py-1">
          {profileData.error && (
            <div className="flex items-center justify-between">
              <ErrorAlert errorMessage={profileData.error} />
            </div>
          )}
          {profileData.success && (
            <div className="flex items-center justify-between py-2">
              <SuccessAlert message={profileData.success} />
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className=" space-y-4 font-[340] md:max-xl:space-y-10 xl:space-y-6 "
          >
            <div className="flex items-center justify-center">
              <Image
                src="/svg/BlackUser.svg"
                alt=""
                className="h-1/6"
                height={90}
                width={90}
              />
            </div>

            <div className="">
              <label
                htmlFor="first_name"
                className="mt-1 block w-1/3 p-2 font-letter text-z-gray-300 max-2xl:text-[0.8rem] 2xl:text-[0.9rem]"
              >
                First Name
              </label>
              {profileData.loading && <ProfileSkeleton />}
              {!profileData.loading && (
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={profileData.first_name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border p-2 max-2xl:text-standard 2xl:text-global"
                />
              )}
            </div>
            {/* </div> */}
            <div>
              <span className="block w-1/3 p-2 font-letter text-z-gray-300 max-2xl:text-[0.8rem] 2xl:text-[0.9rem] ">
                Last Name
              </span>
              {profileData.loading && <ProfileSkeleton />}
              {!profileData.loading && (
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={profileData.last_name}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border p-2  max-2xl:text-standard 2xl:text-global"
                />
              )}
            </div>
            {/* <div>
              <span className="block w-1/3 p-2  font-letter text-z-gray-300 max-2xl:text-[0.8rem] 2xl:text-[0.9rem]">
                Email
              </span>
              {profileData.loading && <ProfileSkeleton />}
              {!profileData.loading && (
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={
                    profileData.email.includes("@dummy")
                      ? ""
                      : profileData.email
                  }
                  placeholder={
                    profileData.email.includes("@dummy")
                      ? "Enter your email id"
                      : ""
                  }
                  onChange={handleChange}
                  className="mt-1 w-full rounded border p-2 max-2xl:text-standard 2xl:text-global"
                />
              )}
            </div> */}
            <div>
              <span className="block  p-2  font-letter text-z-gray-300 max-2xl:text-[0.8rem] 2xl:text-[0.9rem]">
                Phone Number
              </span>
              {profileData.loading && <ProfileSkeleton />}
              {!profileData.loading && (
                <input
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  value={profileData.phone_number}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border p-2 max-2xl:text-standard 2xl:text-global"
                />
              )}
            </div>

            <button
              type="submit"
              className="mt-2 flex items-center justify-between gap-2 rounded-full border border-z-green-500 px-4 py-2 text-[0.75rem] font-medium leading-none
               text-z-green-500 hover:bg-z-green-500 hover:text-white "
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UserProfile;
