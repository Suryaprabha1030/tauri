"use client";

import EnforceAuth from "@/components/layout/EnforceAuth";
import ConnectFavBroker from "@/components/shared/live/ConnectFavBroker";
import { AuthContext } from "@/context/authContextProvider";
import { StockInfoAPIApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { getMarketHolidays } from "@/lib/redux/slices/MarketBasisSlice";
import { RootState } from "@/lib/redux/Store";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { fetchMarketDays } from "@/lib/util/generalUtil";
import { useRouter } from "next/navigation";

import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Livepage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const isMarketHoliday = useSelector(
    (state: RootState) => state.MarketBasis.isMarketHoliday
  );
  const router = useRouter();
  useEffect(() => {
    const message = sessionStorage.getItem("errorMessage");
    if (message) {
      toast(message);
      sessionStorage.removeItem("errorMessage"); // ✅ Clear message after showing
    }
  }, []);

  useEffect(() => {
    if (isMarketHoliday == null) {
      fetchMarketDays(dispatch, router);
    }
  }, []);

  return (
    isAuthenticated && (
      <div className="h-full w-full ">
        <ConnectFavBroker />
      </div>
    )
  );
};

export default EnforceAuth(Livepage);
