"use client";
import Logo from "@/components/shared/logo/logo";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserApi, UserCreate } from "@/lib/api/base";
import { useForm } from "react-hook-form";
import ErrorAlert from "@/components/shared/ErrorAlert";
import zApi from "@/lib/api/zApi";
import { baseConfig } from "@/lib/api/baseConfiguration";
import Image from "next/image";
import SigninWithGoogle from "./SignInWithGoogle";
import LoginWithGoogle from "../login/LoginWithGoogle";

interface SignupForm {
  email: string;
  password: string;
  password_confirmation: string;
  showPasswordConfirmationError: boolean;
}

const Signup = () => {
  const router = useRouter();
  const apiClient = new zApi(router);
  const userApi = new UserApi(baseConfig());
  const [values, setValues] = useState<SignupForm>({
    email: "",
    password: "",
    password_confirmation: "",
    showPasswordConfirmationError: false,
  });

  const {
    setError,
    formState: { errors },
  } = useForm<SignupForm>();

  const handleChange =
    (prop: any) => (event: { target: { value: string } }) => {
      setValues({ ...values, [prop]: event.target.value });

      //Check if password_confirmation matches password
      if (prop === "password_confirmation") {
        if (event.target.value !== values.password) {
          setValues({ ...values, showPasswordConfirmationError: true });
        } else {
          setValues({ ...values, showPasswordConfirmationError: false });
        }
      }
    };

  const handleFormSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (values.showPasswordConfirmationError) {
      return;
    }

    const signupCreateParams: UserCreate = {
      email: values.email,
      password: values.password,
    };

    await apiClient.request(
      () => userApi.signupV1UsersPost(signupCreateParams),
      (_) => {
        router.push("/login?signup=true");
      },
      (error) => {
        setError("root", { message: error.response.data });
      },
    );
  };

  return (
    <div className="flex min-h-screen flex-row items-center justify-between bg-white text-black max-xl:justify-center max-sm:w-screen">
      <div className="max-xl:hidden">
        <img
          className="min-h-screen"
          src="/images/signin-left.png"
          alt="signin-icon"
          height={800}
          width={380}
        />
      </div>
      <div className="flex flex-1 flex-col max-xl:w-[100%]">
        <div className="flex flex-col items-center">
          <Logo height={72} width={240} />
        </div>
        <div className="flex-col items-center justify-center pt-16">
          <div className="text-center text-3xl font-semibold leading-10 text-black">
            Signup
          </div>
          <div className="flex w-full flex-col items-center gap-3 px-24 py-10">
            <LoginWithGoogle name=" SignUp with Google" />
            <div className="flex w-full items-center justify-center gap-1.5 py-5">
              <div className="w-full border border-stone-300"></div>
              <div className="text-center text-sm font-normal leading-none text-stone-300">
                or
              </div>
              <div className="w-full border border-stone-300"></div>
            </div>
            <form
              onSubmit={handleFormSubmit}
              className="flex w-full flex-col items-center gap-3"
            >
              {errors.root?.message && (
                <ErrorAlert errorMessage={errors.root.message} />
              )}

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email"
                onChange={handleChange("email")}
                required
                className="flex w-full items-center gap-3 rounded-md border border-neutral-200 px-5 py-3"
              />
              <input
                id="password"
                name="password"
                type="password"
                onChange={handleChange("password")}
                placeholder="Password"
                required
                className="flex w-full items-center gap-3 rounded-md border border-neutral-200 px-5 py-3"
              />
              <input
                id="password_confirmation"
                name="password_confirmation"
                type="password"
                onChange={handleChange("password_confirmation")}
                placeholder="Password Confirmation"
                required
                className="flex w-full items-center gap-3 rounded-md border border-neutral-200 px-5 py-3"
              />
              {values.showPasswordConfirmationError && (
                <p className="block px-2 py-2 text-left text-red-700 sm:inline">
                  Password confirmation does not match password
                </p>
              )}
              <button
                type="submit"
                className="mt-10 flex h-11 w-[10rem] items-center justify-center rounded-3xl border border-z-green-500 text-base  font-medium leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white"
              >
                Sign up
              </button>
            </form>
            <div className="pt-5 text-center text-base font-normal leading-relaxed text-zinc-600">
              Already have an account?
              <a className="text-blue-600" href="/login">
                {" "}
                Sign in
              </a>
            </div>
            <div>
              <p className="text-xs">
                Charts powered by{" "}
                <a
                  href="https://www.tradingview.com/"
                  className="text-blue-600"
                >
                  Tradingview{" "}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="max-xl:hidden">
        <img
          className="min-h-screen"
          src="/images/signin-right.png"
          alt="sign-in-bg"
          height={800}
          width={380}
        />
      </div>
    </div>
  );
};
export default Signup;
