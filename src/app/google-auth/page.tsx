"use client";
import LoadingComponent from "@/components/shared/loading/Loading";
import { UserApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import config from "@/lib/config";
import { getGoogleSignInUser } from "@/lib/redux/slices/CommonSlice";
import { removeJwtCookie, setJwtCookie } from "@/lib/util/cookies";
import { useNavigate } from "react-router-dom";
import  { useEffect } from "react";
import { useDispatch } from "react-redux";
const Page = () => {
  const router = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const param = queryParams.get("code");
    console.log(param, "param");
    if (!param) {
      console.error("Authorization code is missing in the callback URL.");
      router("/login"); // Redirect to an error page or show an error message.
      return;
    }
    const userApi = new UserApi(baseConfig());

    userApi
      .authCallbackV1UsersGoogleAuthCallbackPost(param)
      .then((res: any) => {
        dispatch(
          getGoogleSignInUser({
            googleSignInUser: res?.data?.user,
          }),
        );
        removeJwtCookie();
        setJwtCookie(res?.data?.access_token);
        if (
          res.data.user.first_name == null ||
          res.data.user.last_name == null ||
          res.data.user.phone_number == null
        ) {
          router("/trading-style");
          return;
        }
        if (res.data.user.is_confirmed == false) {
          router("/need-confirmation");
          return;
        }
        router(config.brokersListUrl);
      })
      .catch((err) => {
        console.error("Failed to handle OAuth callback:", err);
        router("/login"); // Redirect to an error page or show an error message.
      });
  }, []);
  return (
    <div>
      <LoadingComponent />
    </div>
  );
};
export default Page;
