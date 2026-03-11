"use client";
import config from "@/lib/config";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Error boundaries must be Client Components

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  return (
    // global-error must include html and body tags
    <html>
      <body>
        <div className="flex h-dvh w-screen flex-col items-center  justify-center bg-white">
          <span className="relative md:h-[10rem] md:w-[10rem] lg:h-[12rem] lg:w-[12rem] xl:h-[15rem] xl:w-[15rem]">
            <img src="/images/sad.png" alt="Error" fill className="" />
          </span>

          <h1 className="mt-3 font-table text-gray-400 md:text-xl  lg:text-2xl">
            Something Went Wrong!
          </h1>

          <div className="mt-8 flex justify-center gap-2 lg:gap-4">
            <button
              className="rounded-3xl border border-z-gray-400 px-4 py-1 text-black transition hover:bg-z-gray-200  hover:text-black"
              onClick={() => reset()}
            >
              Try Again
            </button>
            <button
              className="rounded-3xl border border-z-green-500 px-4 py-1 text-black transition hover:bg-z-green-500  hover:text-white"
              onClick={() => router.push(config.brokersListUrl)}
            >
              Go Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
