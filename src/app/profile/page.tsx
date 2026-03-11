"use client";
import AppLayout from "@/components/layout/AppLayout";
import ErrorAlert from "@/components/shared/ErrorAlert";
import SuccessAlert from "@/components/shared/SuccessAlert";
import { UserApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authContextProvider";
import ProfileSkeleton from "./profileSkeleton";
import { useRouter } from "next/navigation";
import zApi from "@/lib/api/zApi";
import Image from "next/image";
import ToolTip from "@/components/shared/toolTip";
import Tooltip from "@/components/shared/toolTip";
const Profile = () => {
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
      () => {}
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
        setProfileData((prevData) => ({
          ...prevData,
          error: error.response.data,
          loading: false,
        }));
      }
    );
  };

  useEffect(() => {
    getProfileData();
  }, []);

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
    <AppLayout>
      <div className="flex w-full flex-col items-center justify-start text-black">
        <div className="w-full max-w-md p-8">
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center justify-center">
              <Image
                src="/svg/profile-icon.svg"
                alt=""
                className="h-1/6"
                height={100}
                width={100}
              />
            </div>

            <div className="flex flex-row gap-2">
              <div>
                <label htmlFor="first_name" className="block font-medium">
                  First Name
                  {/* <Tooltip tooltipText="This is a tooltip" position="top">
                    <Image
                      src="/svg/tooltip.svg"
                      alt=""
                      height={20}
                      width={20}
                    />
                  </Tooltip> */}
                </label>
                {profileData.loading && <ProfileSkeleton />}
                {!profileData.loading && (
                  <input
                    type="text"
                    name="first_name"
                    value={profileData.first_name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded border p-2"
                  />
                )}
              </div>
              <div>
                <label htmlFor="last_name" className="block font-medium">
                  Last Name
                </label>
                {profileData.loading && <ProfileSkeleton />}
                {!profileData.loading && (
                  <input
                    type="text"
                    name="last_name"
                    value={profileData.last_name}
                    onChange={handleChange}
                    className="mt-1 w-full rounded border p-2"
                  />
                )}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block font-medium">
                Email
              </label>
              {profileData.loading && <ProfileSkeleton />}
              {!profileData.loading && (
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border p-2"
                />
              )}
            </div>
            <div>
              <label htmlFor="bio" className="block font-medium">
                Phone Number
              </label>
              {profileData.loading && <ProfileSkeleton />}
              {!profileData.loading && (
                <input
                  type="tel"
                  name="phone_number"
                  value={profileData.phone_number}
                  onChange={handleChange}
                  className="mt-1 w-full rounded border p-2"
                />
              )}
            </div>

            <button
              type="submit"
              className="flex items-center justify-between gap-2 rounded-full border border-green-500 px-4 py-2 text-base font-medium leading-none text-z-green-500"
            >
              <div className="text-sm font-medium text-z-green-500">
                Save Changes
              </div>
            </button>
          </form>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
