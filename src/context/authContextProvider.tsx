"use client";
import React, { createContext, useState, useEffect } from "react";
import {
  getJwtFromCookie,
  removeJwtCookie,
  setJwtCookie,
} from "@/lib/util/cookies";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { UserApi } from "@/lib/api/base";
import { usePathname, useRouter } from "next/navigation";
import LoadingComponent from "@/components/shared/loading/Loading";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import config from "@/lib/config";

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
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoaded(false);

    async function fetchUserFromCookie() {
      const token = getJwtFromCookie();

      if (token) {
        setIsAuthenticated(true);
        if (pathname.startsWith("/login") || pathname.startsWith("/signup"))
          router.push(config.brokersListUrl);
      }
    }

    fetchUserFromCookie();
    setIsLoaded(true);
  }, [isLoaded, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

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
