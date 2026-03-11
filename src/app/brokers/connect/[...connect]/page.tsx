"use client";
import React, { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ConnectBroker from "@/components/connectpage/connectbroker";
import { AuthContext } from "@/context/authContextProvider";
import EnforceAuth from "@/components/layout/EnforceAuth";

const validBrokers = [
  "angelone",
  "zerodha",
  "firstock",
  "fyers",
  "upstox",
  "iifl",
  "aliceblue",
  "billamoney",
];
const QueryNamePage = () => {
  // const { isAuthenticated } = useContext(AuthContext);
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const [brokerName, setBrokerName] = useState("");

  useEffect(() => {
    const getCurrentUrl = (): string => {
      return window.location.href;
    };

    const getNameBeforeQuery = (url: string): string | null => {
      try {
        const urlObject = new URL(url);
        const pathname = urlObject.pathname;
        const parts = pathname.split("/").filter((part) => part !== ""); // Filter out empty parts
        const lastPart = parts.pop() || ""; // Get the last segment of the pathname
        return lastPart;
      } catch (error) {
        console.error("Invalid URL", error);
        return null;
      }
    };

    const currentUrl = getCurrentUrl();
    const extractedName = getNameBeforeQuery(currentUrl);

    if (extractedName && validBrokers.includes(extractedName)) {
      // extractedName = extractedName == 'angelone' ? 'AngelOne' : 'AngelOne'
      if (extractedName == "angelone") {
        setBrokerName("AngelOne");
      } else if (extractedName == "upstox") {
        setBrokerName("Upstox");
      } else if (extractedName == "zerodha") {
        setBrokerName("Zerodha");
      } else if (extractedName == "fyers") {
        setBrokerName("Fyers");
      } else if (extractedName == "firstock") {
        setBrokerName("Firstock");
      } else if (extractedName == "iifl") {
        setBrokerName("IIFL");
      } else if (extractedName == "aliceblue") {
        setBrokerName("AliceBlue");
      } else if (extractedName == "billamoney") {
        setBrokerName("BillaMoney");
      } else {
        setBrokerName("broker not available");
      }
    } else {
      setBrokerName("broker not available");
    }
  }, []);

  return (
    <div>
      <ConnectBroker {...params} brokerName={brokerName} />
    </div>
  );
};

export default QueryNamePage;
