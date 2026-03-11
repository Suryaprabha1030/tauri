"use client";

import BrokerLoginDisplay from "../BrokerLoginDisplay/BrokerLoginDisplay";
import { useState } from "react";
import {
  brokers,
  getImageUrl,
  getSignUpUrl,
  handleBrokerLogin,
} from "@/lib/util/BrokerLoginUtil";
import BrokerLoginPopup from "../LoginPopup/BrokerLoginPopup";

interface LoginLimitPopupProps {
  onClose: () => void;
  chatLimit?: any;
}

const LoginLimitPopup: React.FC<LoginLimitPopupProps> = ({
  onClose,
  chatLimit,
}) => {
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);

  const [popupOpen, setPopupOpen] = useState(false);

  const handleBrokerClick = (broker: string) => {
    setSelectedBroker(broker);
    setPopupOpen(true);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="relative w-[95%] max-w-2xl rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {/* Close Button */}
        <button
          className="absolute right-3 top-1 pb-2 text-xl font-semibold text-gray-500 hover:text-gray-700 "
          onClick={onClose}
        >
          ×
        </button>

        {/* Header & Info */}
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <p className="max-w-[80%] text-sm text-gray-600">
            {chatLimit >= 3 && "You’ve reached your free chat limit. "}
            Login to unlock AI screening and personalized stock insights.
          </p>
        </div>

        {/* Broker Login Grid */}
        <div className="h-[75%] p-4">
          <BrokerLoginDisplay
            brokers={brokers}
            handleBrokerClick={handleBrokerClick}
            getImageUrl={getImageUrl}
          />
        </div>
        {selectedBroker && (
          <BrokerLoginPopup
            isOpen={popupOpen}
            onClose={() => setPopupOpen(false)}
            brokerName={selectedBroker}
            brokerImageUrl={getImageUrl(selectedBroker)?.url}
            brokerImageWidth={getImageUrl(selectedBroker)?.width}
            brokerImageheight={getImageUrl(selectedBroker)?.height}
            onConnect={handleBrokerLogin}
            signupUrl={getSignUpUrl(selectedBroker)}
          />
        )}
      </div>
    </div>
  );
};

export default LoginLimitPopup;
