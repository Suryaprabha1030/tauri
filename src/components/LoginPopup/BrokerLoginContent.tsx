"use client";
import React, { useState } from "react";
import Image from "next/image";

interface BrokerLoginContentProps {
  brokerName: string;
  brokerImageUrl: any;
  brokerImageWidth: any;
  brokerImageheight: any;
  onConnect: (e: any, brokerName: string) => void;
  signupUrl: string;
  showAllbrokers: boolean;
}

const BrokerLoginContent: React.FC<BrokerLoginContentProps> = ({
  brokerName,
  brokerImageUrl,
  brokerImageWidth,
  brokerImageheight,
  onConnect,
  signupUrl,
  showAllbrokers,
}) => {
  return (
    <div className="z-[1000] w-full max-w-[400px] rounded-xl bg-white p-6 shadow-xl">
      <div
        className={`mb-6 flex items-center gap-4 ${showAllbrokers ? "justify-between" : "justify-center"}`}
      >
        <div className=" flex flex-row items-center justify-center gap-4">
          <img
            src={brokerImageUrl}
            alt={brokerName}
            height={brokerImageheight}
            width={brokerImageWidth}
          />
        </div>
        {showAllbrokers && (
          <div className="cursor-pointer text-[0.75rem] font-medium text-z-green-500">
            <a href="/login" className="">
              All Brokers &gt;&gt;
            </a>
          </div>
        )}
      </div>

      {/* Connect Button */}
      <button
        onClick={(e) => onConnect(e, brokerName)}
        className="mb-4 w-full rounded-lg bg-z-green-500 py-3 font-medium text-white hover:bg-green-600"
      >
        Connect
      </button>

      <p className="mb-4 text-center text-xs text-gray-500">
        By clicking &quot;Connect&quot; I confirm that I&apos;ve read the{" "}
        <a
          href="https://zoonest.com/terms"
          className="text-z-green-500 hover:underline"
        >
          terms of use
        </a>{" "}
        and accept all risks.
      </p>

      <div className="mb-4 text-center text-xs text-gray-500">or</div>

      {/* Open Account Button */}
      <a
        href={signupUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-4 block flex w-full flex-row items-center justify-center gap-4 rounded-lg border border-green-600 py-3 text-center font-medium text-z-green-500 hover:bg-green-50"
      >
        <span>Open Account</span>
        <img
          src="/svg/newtab.svg"
          alt=" tab"
          width={20}
          height={20}
          className="cursor-pointer"
        />
      </a>
    </div>
  );
};

export default BrokerLoginContent;
