"use client";
import React, { createContext, useState, useEffect } from "react";
import {
  getJwtFromCookie,
  removeJwtCookie,
  setJwtCookie,
} from "@/lib/util/cookies";

import { useLocation } from "react-router-dom";
import LoadingComponent from "@/components/shared/loading/Loading";
import config from "@/lib/config";
import { useNavigate } from "react-router-dom";

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoaded: boolean;
  loginSuccess: (accessToken: string) => void;
  logout: () => void;
  refreshToken: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoaded: false,
  loginSuccess: () => {},
  logout: () => {},
  refreshToken: () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    async function fetchUserFromCookie() {
      const token = getJwtFromCookie();

      if (token) {
        setIsAuthenticated(true);
        if (pathname.startsWith("/login") || pathname.startsWith("/signup"))
          router(config.brokersListUrl);
      }
      setIsLoaded(true);
    }

    fetchUserFromCookie();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const loginSuccess = (accessToken: string) => {
    setIsLoaded(false);
    removeJwtCookie();
    setJwtCookie(accessToken);
    setIsAuthenticated(true);
    setIsLoaded(true);
  };

  const logout = () => {
    removeJwtCookie();
    setIsAuthenticated(false);
  };

  const refreshToken = () => {
    setIsLoaded(false);
    const token = getJwtFromCookie();
    if (token) setIsAuthenticated(true);
    setIsLoaded(true);
  };

  if (!isLoaded) {
    return <LoadingComponent />;
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoaded,
        loginSuccess,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
