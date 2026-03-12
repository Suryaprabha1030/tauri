"use client";
import LoadingComponent from "@/components/shared/loading/Loading";
import { AuthContext } from "@/context/authContextProvider";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";

const LogoutPage = () => {
  const { logout } = useContext(AuthContext);
  const router = useNavigate();
  useEffect(() => {
    logout();
    router("/login");
  }, []);
  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <LoadingComponent />;
    </div>
  );
};

export default LogoutPage;
