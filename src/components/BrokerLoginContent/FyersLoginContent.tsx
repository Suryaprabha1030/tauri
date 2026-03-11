import React from "react";
import Logo from "../shared/logo/logo";

type BrokerIntegrationPageProps = {
  brokerName: string;
  brokerLogo: string;
  brokerImageWidth: any;
  brokerImageheight: any;
  productName: string;
  headline?: string;
  description?: string;
  successNote?: string;
  ctaText?: string;
};

const BrokerIntegrationPage: React.FC<BrokerIntegrationPageProps> = ({
  brokerName,
  brokerLogo,
  brokerImageWidth,
  brokerImageheight,
  productName,
  headline = "Better Together",
  description = `Experience the power of seamless integration between ${productName} and ${brokerName}. Unlock exclusive features, enhanced productivity, and streamlined workflows designed for success.`,
}) => {
  return (
    <div className="flex h-full flex-col items-center justify-start gap-8 overflow-y-auto px-4  py-10 text-center scrollbar-thin max-sm:gap-5 max-sm:scrollbar-thin">
      {/* Logos */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-4 max-sm:flex-row max-sm:gap-3 sm:gap-6">
        <div className="flex h-20 w-[9rem] items-center justify-center rounded-xl bg-white shadow max-sm:h-16 max-sm:w-[7rem] sm:w-[10rem]">
          <Logo height={100} width={250} />
        </div>
        <span className="text-2xl font-bold text-gray-600 sm:text-3xl">+</span>
        <div className="flex h-20 w-[9rem] items-center justify-center rounded-xl bg-white shadow max-sm:h-16 max-sm:w-[7rem] sm:w-[10rem]">
          <img
            src={brokerLogo}
            alt={brokerName}
            height={brokerImageWidth}
            width={brokerImageheight}
          />
        </div>
      </div>

      {/* Heading */}
      <h1 className="text-5xl font-bold text-gray-900 max-sm:text-3xl ">
        {headline}
      </h1>

      {/* Description */}
      <p className="max-sm:text-md mb-4 max-w-3xl px-2 text-base text-gray-700 max-sm:text-justify sm:text-lg ">
        {description}
      </p>
    </div>
  );
};

export default BrokerIntegrationPage;
