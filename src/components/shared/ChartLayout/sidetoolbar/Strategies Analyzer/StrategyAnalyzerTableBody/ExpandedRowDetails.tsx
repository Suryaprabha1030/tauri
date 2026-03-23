// ExpandedRowDetails.tsx
import { formatExpiryDate } from "@/lib/util/DateUtil";
import React from "react";
import BuySellDisplay from "./BuySellDisplay";

interface LegDetails {
  expiry_date: string;
  strike_price: number;
  option_type: string;
  transaction_type: string;
  lots: number;
  ltp: number;
}

interface ExpandedRowDetailsProps {
  legs: Record<string, Record<string, LegDetails[]>>;
  strategyLots: number;
}

const ExpandedRowDetails: React.FC<ExpandedRowDetailsProps> = ({
  legs,
  strategyLots,
}) => {
  return (
    <tr className="h-10 w-full font-table text-gray-700 max-md:text-[0.7rem] md:max-2xl:text-standard 2xl:text-global">
      <td colSpan={4} className="px-4 py-2">
        <div className="flex flex-col gap-2">
          {Object.keys(legs).map((positionType) =>
            ["CE", "PE"].map((optionType) =>
              legs[positionType][optionType].map((leg, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-evenly"
                >
                  <div className="flex w-[12.5rem] flex-row items-center gap-2 ">
                    <span className=" text-gray-700">
                      {strategyLots * leg.lots}x
                    </span>
                    <span className=" text-gray-700">
                      {formatExpiryDate(leg.expiry_date)} {leg.strike_price}{" "}
                      {leg.option_type}
                    </span>
                  </div>
                  <BuySellDisplay transactionType={leg?.transaction_type} />
                  <span className="w-[5rem] ">{leg?.ltp ?? 0}</span>
                </div>
              ))
            )
          )}
        </div>
      </td>
    </tr>
  );
};

export default ExpandedRowDetails;
