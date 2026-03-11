import config from "@/lib/config";
import { RootState } from "@/lib/redux/Store";
import { formatExpiryDate } from "@/lib/util/DateUtil";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface OiExpiryProps {
  setOiChangeExpiry: Dispatch<SetStateAction<any>>;
  oiChangeExpiry: any;
  query: string;
}
const OiExpiry: React.FC<OiExpiryProps> = ({
  setOiChangeExpiry,
  oiChangeExpiry,
  query,
}) => {
  const expiries: any = useSelector(
    (state: RootState) => state.OI.OIIndexExpiryDate
  );
  const handleSelect = (date: string) => {
    if (date.length > 0) {
      setOiChangeExpiry((prev: any) => {
        if (prev.length === 1 && prev.includes(date)) {
          return prev;
        }

        return prev.includes(date)
          ? prev.filter((d: any) => d !== date)
          : [...prev, date];
      });
    }
  };
  useEffect(() => {
    if (
      expiries &&
      expiries[query] &&
      Array.isArray(expiries[query]) &&
      expiries[query].length > 0
    ) {
      if (oiChangeExpiry.length == 0) {
        setOiChangeExpiry([expiries[query][0]]);
      }
    }
  }, [expiries]);

  return (
    <div
      className={`flex w-full flex-col  items-center justify-center sm:max-xl:py-[0.8rem] xl:py-5`}
    >
      <div
        className={`flex w-full items-center justify-center   max-md:justify-start`}
        role="group"
      >
        {Object.entries(expiries)?.length > 0 &&
          (config.BSESupportIndices.includes(query)
            ? expiries[query]?.slice(0, 1) // Only the first expiry if BSE-supported
            : expiries[query]?.slice(0, 3)
          ) // All expiries otherwise
            ?.map((date, index, arr) => (
              <button
                key={date}
                className={`font-label border border-gray-200 px-1 py-2 text-[0.7rem] max-sm:px-0.5 max-sm:py-1.5 max-sm:text-[0.6rem] sm:max-md:px-1.5 md:max-xl:px-2.5 md:max-xl:py-2 xl:max-2xl:px-0.5 xl:max-2xl:text-[0.65rem] ${
                  arr.length == 1
                    ? "rounded-l-lg rounded-r-lg"
                    : index === 0
                      ? "rounded-l-lg"
                      : index === arr.length - 1
                        ? "rounded-r-lg"
                        : ""
                } ${
                  oiChangeExpiry?.includes(date)
                    ? "bg-z-green-500 text-white"
                    : "bg-white text-black "
                }`}
                onClick={() => handleSelect(date)}
                title={date}
              >
                {formatExpiryDate(date)}
              </button>
            ))}
      </div>
    </div>
  );
};

export default OiExpiry;
