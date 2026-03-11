"use client";
import config from "@/lib/config";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function NotFoundPage() {
  return (
    <div className="fixed flex h-dvh w-screen flex-col items-center justify-center gap-[1rem] text-center">
      <>
        <span className="relative h-[20rem] w-[25rem] max-sm:h-[10rem] max-sm:w-[15rem]">
          <img src={"/images/404.png"} alt="" fill className="" />
        </span>
        <span className="flex flex-col gap-2">
          <h1 className=" text-2xl font-bold">404 - Page Not Found</h1>
          <p className="text-xs text-gray-500 xl:text-lg">
            Oops! The page you&apos;re looking for doesn&apos;t exist.
          </p>
        </span>
        <a
          href={config.brokersListUrl}
          className="mt-4 rounded-3xl  border border-z-green-500 px-6 py-2 text-black hover:bg-z-green-500 hover:text-white"
        >
          Go Back Home
        </a>
      </>
    </div>
  );
}
