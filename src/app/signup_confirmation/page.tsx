"use client";
import { UserApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { toast } from "react-toastify";

const SignupConfirmation = () => {
  const router = useRouter();
  useEffect(() => {
    const userConfirm = async () => {
      const url = new URL(window.location.href);
      const email = url.search.substring(1);

      try {
        const userApi = new UserApi(baseConfig());
        const res = await userApi.markUserConfirmedV1UsersUserConfirmationPost(
          Buffer?.from(email, "base64").toString("utf-8")
        );

        if (res) {
          toast("Your account has been confirmed");
          router.push("/login");
        }
      } catch {
        console.log("err");
      }
    };
    userConfirm();
  }, []);
  return <>wait...</>;
};

export default SignupConfirmation;
