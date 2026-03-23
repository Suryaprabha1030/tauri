"use client";

import EnforceAuth from "@/components/layout/EnforceAuth";
import ConnectFavBroker from "@/components/shared/live/ConnectFavBroker";
import { AuthContext } from "@/context/authContextProvider";
import { RootState } from "@/lib/redux/Store";
import { fetchMarketDays } from "@/lib/util/generalUtil";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

const Livepage = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const dispatch = useDispatch();
  const isMarketHoliday = useSelector(
    (state: RootState) => state.MarketBasis.isMarketHoliday,
  );
  const router = useNavigate();
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
