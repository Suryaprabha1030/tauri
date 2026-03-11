"use client";
import LoadingComponent from "@/components/shared/loading/Loading";
import { AuthContext } from "@/context/authContextProvider";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";

const LogoutPage = () => {
  const { logout } = useContext(AuthContext);
  const router = useRouter();
  useEffect(() => {
    logout();
    router.push("/login");
  }, []);
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <LoadingComponent />;
    </div>
  );
};

export default LogoutPage;
