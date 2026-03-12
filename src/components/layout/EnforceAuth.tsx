"use client";
import { AuthContext } from "@/context/authContextProvider";
import { printConsole } from "@/lib/util/viewUtil";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

const EnforceAuth = (WrappedComponent: React.ComponentType<any>) => {
  const Wrapper = (props: any) => {
    const { isAuthenticated } = useContext(AuthContext);
    const router = useNavigate();

    useEffect(() => {
      if (!isAuthenticated) {
        router("/login");
      }
      printConsole();
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default EnforceAuth;
