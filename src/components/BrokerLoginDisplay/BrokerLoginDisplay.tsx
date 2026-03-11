"use client";

import config from "@/lib/config";
import Image from "next/image";
import Link from "next/link";

interface BrokerLoginDisplayProps {
  brokers: string[];
  handleBrokerClick: (broker: string) => void;
  getImageUrl: (broker: string) => {
    url: string;
    height: number;
    width: number;
  };
}

const BrokerLoginDisplay: React.FC<BrokerLoginDisplayProps> = ({
  brokers,
  handleBrokerClick,
  getImageUrl,
}) => {
  const enabledBrokers = brokers.filter((broker) =>
    config.enabledBrokers.some((b) => broker?.toLowerCase().includes(b)),
  );

  const comingSoonBrokers = brokers.filter(
    (broker) =>
      !config.enabledBrokers.some((b) => broker?.toLowerCase().includes(b)),
  );

  const renderBrokerCard = (broker: string, clickable: boolean) => (
    <div
      key={broker}
      onClick={clickable ? () => handleBrokerClick(broker) : undefined}
      className={`relative z-[1000] flex h-[5.5rem] flex-col items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white p-2 shadow-lg transition-all duration-300 hover:scale-110 ${
        clickable ? "cursor-pointer" : "cursor-not-allowed"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-2 pt-2">
        <img
          src={getImageUrl(broker)?.url}
          alt={broker}
          height={getImageUrl(broker)?.height}
          width={getImageUrl(broker)?.width}
        />
      </div>
    </div>
  );

  return (
    <div className="flex  h-full w-full flex-col gap-4 rounded-lg border border-gray-200 bg-white py-2 shadow-lg transition-all duration-300  max-sm:w-full sm:max-lg:w-[100%] ">
      <div className="pt-2 text-center text-[1.2rem] font-semibold">
        Sign in with your broker
      </div>

      {/* Enabled Brokers */}
      <div className="grid  w-full grid-cols-3  gap-4 px-4  py-2 max-sm:grid-cols-2 sm:grid-cols-3">
        {enabledBrokers.map((broker) => renderBrokerCard(broker, true))}
      </div>

      {/* Coming Soon Title */}
      {comingSoonBrokers?.length > 0 && (
        <div className="flex w-full items-center justify-center gap-1.5 py-1">
          <div className="text-center text-sm font-normal leading-none text-stone-500">
            --- Coming Soon ---
          </div>
        </div>
      )}

      {/* Coming Soon Brokers */}
      {comingSoonBrokers?.length > 0 && (
        <div className="grid  w-full grid-cols-3 gap-4 px-4 pb-2 max-sm:grid-cols-2 sm:grid-cols-3">
          {comingSoonBrokers.map((broker) => renderBrokerCard(broker, false))}
        </div>
      )}

      <div className="flex w-full items-center justify-center pb-2">
        <p className="max-w-full text-center text-xs leading-relaxed text-gray-400">
          Charts are powered by{" "}
          <a
            href="https://www.tradingview.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-600"
          >
            Tradingview
          </a>
        </p>
      </div>
    </div>
  );
};

export default BrokerLoginDisplay;
