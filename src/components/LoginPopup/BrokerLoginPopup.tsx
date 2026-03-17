"use client";
import React from "react";
import BrokerLoginContent from "./BrokerLoginContent";

interface BrokerLoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  brokerName: string;
  brokerImageUrl: any;
  brokerImageWidth: any;
  brokerImageheight: any;
  onConnect: (e: any, brokerName: string) => void;
  signupUrl: string;
}

const BrokerLoginPopup: React.FC<BrokerLoginPopupProps> = ({
  isOpen,
  onClose,
  brokerName,
  brokerImageUrl,
  brokerImageWidth,
  brokerImageheight,
  onConnect,
  signupUrl,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50">
      <div className="relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-1 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        {/* Reusable Content */}
        <BrokerLoginContent
          brokerName={brokerName}
          brokerImageUrl={brokerImageUrl}
          brokerImageWidth={brokerImageWidth}
          brokerImageheight={brokerImageheight}
          onConnect={onConnect}
          signupUrl={signupUrl}
          showAllbrokers={false}
        />
      </div>
    </div>
  );
};

export default BrokerLoginPopup;
