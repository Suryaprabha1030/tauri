"use client";

import TawkLoader from "@/components/tawk_integration/TawkLoader";
import { createContext, useContext, useState } from "react";

interface TawkContextType {
  showSupport: boolean;
  toggleSupport: () => void;

  userEmail: string | null;
  userId: string | null;
  setUserEmail: (email: string | null) => void;
  setUserId: (id: string | null) => void;
}

const TawkContext = createContext<TawkContextType | null>(null);

export const TawkProvider = ({ children }: { children: React.ReactNode }) => {
  const [showSupport, setShowSupport] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const toggleSupport = () => setShowSupport((prev) => !prev);

  return (
    <TawkContext.Provider
      value={{
        showSupport,
        toggleSupport,
        userEmail,
        userId,
        setUserEmail,
        setUserId,
      }}
    >
      <TawkLoader />
      {children}
    </TawkContext.Provider>
  );
};

export const useTawk = () => {
  const ctx = useContext(TawkContext);
  if (!ctx) throw new Error("useTawk must be used inside TawkProvider");
  return ctx;
};
