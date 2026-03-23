"use client";
import { RootState } from "@/lib/redux/Store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { formatNumber } from "@/lib/util/DraftUtil";
import { useLocation } from "react-router-dom";

const BrowserTabTitle = () => {
  const PnlPositions = useSelector(
    (state: RootState) => state.Position.totPositionsPnl,
  );
  const PnlHoldings: any = useSelector(
    (state: RootState) => state.Position.totHoldingsPnl,
  );
  const HoldingscurrentValue: any = useSelector(
    (state: RootState) => state.common.currentHoldingsValue,
  );
  const brokerName = useSelector(
    (state: RootState) => state.Position.BrokerName,
  );

  const location = useLocation();
  const pathname = location.pathname;

  // Match the allowed paths
  const isTargetPath = /^\/live\/[^/]+\/(psv|psb|oi)$/.test(pathname);

  useEffect(() => {
    const defaultTitle = "Zoonest";
    if (!pathname) return;
    const lastSegment = pathname.split("/").pop()?.toLowerCase() || "";

    const updateTitle = () => {
      // Case 1: path ends with /psv, /psb, /oi
      if (["psv", "psb", "oi"].includes(lastSegment)) {
        const formattedPnlPositions = PnlPositions?.toFixed(2);
        const formattedHoldings = HoldingscurrentValue?.toFixed(2);

        document.title = [
          `${lastSegment.toUpperCase()}`,
          `| ${brokerName}`,
          formattedPnlPositions !== undefined && formattedPnlPositions !== null
            ? `| Positions:${PnlPositions >= 0 ? "+" : ""}${formatNumber(formattedPnlPositions)}`
            : null,
          formattedHoldings !== undefined && formattedHoldings !== null
            ? `| Holdings:${formatNumber(formattedHoldings)}`
            : null,
        ]
          .filter(Boolean)
          .join(" ");
      }
      // Case 2: path is /live/... (no PSV, PSB, OI)
      else if (pathname.startsWith("/live")) {
        document.title = `Zoonest | live`;
      }
      // Case 3: fallback
      else {
        document.title = defaultTitle;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        updateTitle();
      } else {
        // When returning to the tab, reset to default
        document.title = defaultTitle;
      }
    };

    // Listen for tab visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initially set the title if the tab is already visible
    updateTitle();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [PnlPositions, PnlHoldings, brokerName, pathname, isTargetPath]);

  return null;
};

export default BrowserTabTitle;
