"use client";
import { AuthContext } from "@/context/authContextProvider";
import { printConsole } from "@/lib/util/viewUtil";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const EnforceAuth = (WrappedComponent: React.ComponentType<any>) => {
  const Wrapper = (props: any) => {
    const { isAuthenticated } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login");
      }
      printConsole();
    }, []);

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default EnforceAuth;
