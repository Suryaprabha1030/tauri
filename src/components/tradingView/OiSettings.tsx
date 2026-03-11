"use client";
import {
  setCePeBarColors,
  setOpenOiSettings,
  setTvOiExpiry,
} from "@/lib/redux/slices/CommonSlice";
import { RootState } from "@/lib/redux/Store";
import { formatExpiry } from "@/lib/util/DateUtil";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tvWidget } from "./chartSetup";
import {
  createCustomToggleButton,
  expiryCache,
  fetchAndRenderCurrentMode,
  hexOpacityToRgba,
  rgbaToHexOpacity,
} from "./OiProfile";
import { getOIState, setOIColors } from "@/lib/OItoggleExpiry";

type Props = {
  expiries: string[];

  onClose: () => void;
};

export default function OIProfileSettingsModal({
  expiries,

  onClose,
}: Props) {
  const [selectedExpiry, setSelectedExpiry] = useState<string>("");
  const dispatch = useDispatch();
  const OISelectedExpiry = useSelector(
    (state: RootState) => state.common.tvOIexpiry,
  );
  const ceBarColor = useSelector(
    (state: RootState) => state.common.cePeBarColors.ce,
  );
  const peBarColor = useSelector(
    (state: RootState) => state.common.cePeBarColors.pe,
  );

  const ceDefault = rgbaToHexOpacity(ceBarColor);
  const peDefault = rgbaToHexOpacity(peBarColor);

  // State
  const [ceColor, setCeColor] = useState(ceDefault.hex);
  const [ceOpacity, setCeOpacity] = useState(ceDefault.opacity);
  const [peColor, setPeColor] = useState(peDefault.hex);
  const [peOpacity, setPeOpacity] = useState(peDefault.opacity);

  useEffect(() => {
    if (expiries.length > 0) {
      const defaultExpiry =
        OISelectedExpiry && expiries.includes(OISelectedExpiry)
          ? OISelectedExpiry
          : expiries[0];
      setSelectedExpiry(defaultExpiry);
    }
  }, [expiries, OISelectedExpiry]);

  const handleSelect = (expiry: string) => {
    setSelectedExpiry(expiry); // Only one allowed
  };
  useEffect(() => {
    setOIColors(ceColor, peColor); // Push Redux colors into the module
  }, [ceColor, peColor]);

  return (
    <div className="fixed left-1/2 top-1/2 z-[9999] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-2 shadow-2xl">
      <div className="mb-6 text-lg font-semibold">Select OI Expiry</div>

      <div className="mb-4 flex flex-wrap items-center  gap-1">
        {expiries.map((date, index) => (
          <button
            key={date}
            type="button"
            onClick={() => handleSelect(date)}
            title={date}
            className={`font-label rounded-lg border border-gray-200 px-2 py-2 text-[0.7rem] max-sm:px-0.5 max-sm:py-1.5 max-sm:text-[0.6rem] sm:max-md:px-1.5 md:max-xl:px-2.5 md:max-xl:py-2 xl:max-2xl:px-2 xl:max-2xl:text-[0.65rem] 
              ${
                selectedExpiry === date
                  ? "bg-z-green-500 text-white"
                  : "bg-white text-black"
              }`}
          >
            {formatExpiry(date)}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <div className="mb-2 text-lg font-semibold">Select Bar Colors</div>
        <div className="flex flex-col gap-4">
          {/* CE Color */}
          <div className="flex items-center gap-3">
            <span className="w-6 text-[0.75rem] text-gray-700">CE</span>
            <input
              type="color"
              value={ceColor}
              onChange={(e) => setCeColor(e.target.value)}
              className="h-5 w-5 cursor-pointer rounded border"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={ceOpacity}
              onChange={(e) => setCeOpacity(Number(e.target.value))}
              className="h-[4px] w-[120px]"
            />
            <span className=" w-10 text-xs text-gray-600">{ceOpacity}%</span>
          </div>

          {/* PE Color */}
          <div className="flex items-center gap-3">
            <span className="w-6 text-[0.75rem] text-gray-700">PE</span>
            <input
              type="color"
              value={peColor}
              onChange={(e) => setPeColor(e.target.value)}
              className="h-5 w-5 cursor-pointer rounded border"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={peOpacity}
              onChange={(e) => setPeOpacity(Number(e.target.value))}
              className="h-[4px] w-[120px]"
            />
            <span className="w-10 text-xs text-gray-600">{peOpacity}%</span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3 text-[0.8rem]">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded  pb-2"
        >
          <img src="/svg/removeSymbol.svg" width={20} height={20} alt="" />
        </button>
        <button
          className="class-for-touch-event flex w-[5rem] items-center justify-center rounded-3xl border  border-z-green-500  p-2 text-[0.75rem]  font-medium leading-none text-z-green-500 hover:bg-z-green-500 hover:text-white"
          onClick={async () => {
            dispatch(setTvOiExpiry(selectedExpiry));
            dispatch(
              setCePeBarColors({
                ce: hexOpacityToRgba(ceColor, ceOpacity),
                pe: hexOpacityToRgba(peColor, peOpacity),
              }),
            );
            dispatch(setOpenOiSettings([]));

            // Update expiryCache for the current symbol
            const symbol = tvWidget
              ?.activeChart()
              ?.symbolExt()
              ?.ticker?.toUpperCase();
            if (symbol) {
              expiryCache[symbol] = selectedExpiry;
            }

            // 🔁 Trigger redraw via global state
            const { tvChart, container, reduxDispatch } = getOIState();
            setOIColors(
              hexOpacityToRgba(ceColor, ceOpacity),
              hexOpacityToRgba(peColor, peOpacity),
            );
            if (tvChart && container && reduxDispatch) {
              await fetchAndRenderCurrentMode(
                tvChart,
                container,
                reduxDispatch,
                true,
              );
            }

            onClose();
          }}
        >
          Ok
        </button>
      </div>
    </div>
  );
}
