import { formatExpiryDate } from "@/lib/util/DateUtil";
import { formatNumber } from "@/lib/util/DraftUtil";
import React, { useEffect, useRef, useState } from "react";
import { getCurrentFormattedDate } from "../payOffChartCalculation/payOffChartUtils/calculateCommon";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";

interface PayoffData {
  strike_price: number;
  target_pnl: number;
  expiry_pnl: number;
}

interface PayoffTableProps {
  payoffdata: PayoffData[];
  targetSpotPrice: number;
  payoffExpiryDate: string;
  targetDate: any;
  oipercent: any;
  PayoffTableOiChg: any;
}

const PayoffTable: React.FC<PayoffTableProps> = ({
  payoffdata,
  targetSpotPrice,
  payoffExpiryDate,
  targetDate,
  oipercent,
  PayoffTableOiChg,
}) => {
  const [showOiChange, setShowOiChange] = useState(false);
  const [oiOption, setOiOption] = useState("Chg%"); // State to track Chg or Chg%
  const roundedTargetSpotPrice = Math.round(targetSpotPrice / 50) * 50;
  const filteredPayoffData = payoffdata.filter(
    (item) => item.strike_price % 50 === 0
  );
  const targetIndex = filteredPayoffData.findIndex(
    (item) => item.strike_price === roundedTargetSpotPrice
  );
  const startIndex = Math.max(targetIndex - 6, 0);
  const endIndex = Math.min(targetIndex + 6, filteredPayoffData.length - 1);
  const visiblePayoffData = filteredPayoffData.slice(startIndex, endIndex + 1);
  const noOiData = useSelector(
    (state: RootState) => state.optionChain.nooiData
  );
  const targetRow = {
    strike_price: roundedTargetSpotPrice,
    target_pnl: 0,
    expiry_pnl: 0,
  };

  const targetPriceExists = visiblePayoffData.some(
    (item) => item.strike_price === roundedTargetSpotPrice
  );

  if (!targetPriceExists) {
    visiblePayoffData.splice(6, 0, targetRow);
  }

  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  const targetRowRef = useRef<HTMLTableRowElement | null>(null);

  useEffect(() => {
    if (tableContainerRef.current && targetRowRef.current) {
      const tableContainer = tableContainerRef.current;
      const targetRow = targetRowRef.current;
      const offset =
        targetRow.offsetTop -
        tableContainer.clientHeight / 2 +
        targetRow.clientHeight / 2;
      tableContainer.scrollTop = offset;
    }
  }, [roundedTargetSpotPrice]);

  const handleTargetExpiry = (targetdate: any) => {
    const day = targetdate.getDate().toString().padStart(2, "0");
    const month = targetdate
      .toLocaleString("default", { month: "short" })
      .toUpperCase();
    const year = targetdate.getFullYear().toString();
    const formattedDate = `${day}${month}${year}`;
    return formatExpiryDate(formattedDate);
  };

  const getOIPercentages = (
    targetArray: any[],
    oiObject: { [key: string]: number }
  ) => {
    return targetArray.map((item) => {
      const strikeCEKey = `${item.strike_price}.0#CE`;
      const strikePEKey = `${item.strike_price}.0#PE`;
      const oiData = oiOption === "Chg%" ? oipercent : PayoffTableOiChg;
      return {
        ...item,
        CE_OIPercent:
          oiData[strikeCEKey] !== undefined ? oiData[strikeCEKey] : "N/A",
        PE_OIPercent:
          oiData[strikePEKey] !== undefined ? oiData[strikePEKey] : "N/A",
      };
    });
  };

  const result = getOIPercentages(visiblePayoffData, oipercent);

  return (
    <div
      className=" h-full w-full overflow-y-auto overflow-x-hidden  scrollbar-none max-lg:text-[0.75rem]"
      ref={tableContainerRef}
    >
      <table className=" w-full border-4 border-z-blue-100 text-center text-[0.75rem]  max-lg:text-[0.75rem] xl:table-fixed">
        <thead className="sticky top-0 z-10 bg-white max-sm:h-8 max-sm:px-1">
          <tr className=" text-z-gray-300">
            <th
              className={` md:max-xl:py-3 ${
                noOiData ? "w-[1/3]" : "max-sm:w-1/3 xl:w-[1/5] "
              } px-2 font-tableHead max-sm:h-6 xl:pt-2`}
            >
              Target
            </th>
            {!noOiData && (
              <th
                className={` px-2 pt-2 font-tableHead max-md:hidden md:max-xl:py-3`}
              >
                Call OI
              </th>
            )}
            {!noOiData && (
              <th
                className={` px-2 pt-2 font-tableHead max-md:hidden md:max-xl:py-3`}
              >
                Put OI
              </th>
            )}

            <th
              className={`md:max-xl:py-3 ${
                noOiData ? "w-[1/3]" : "w-[1/5]"
              } px-2 font-tableHead xl:pt-2`}
            >
              Target P&L
            </th>
            <th
              className={`md:max-xl:py-3 ${
                noOiData ? "w-[1/3]" : "w-[1/5]"
              } px-2 font-tableHead xl:pt-2`}
            >
              Expiry P&L
            </th>
          </tr>
          <tr className="border-z-gray-50 border-b-2">
            <th></th>
            {!noOiData && (
              <th className="text-[0.55rem] font-medium max-md:hidden md:max-xl:pb-2 xl:max-2xl:py-1">
                {/* Dropdown for Chg and Chg% */}
                <select
                  className="focus:border-tertiary text-[0.55rem] outline-none"
                  value={oiOption}
                  onChange={(e) => setOiOption(e.target.value)}
                >
                  <option value="Chg%">Chg %</option>
                  <option value="Chg">Chg</option>
                </select>
              </th>
            )}
            {!noOiData && (
              <th className="text-[0.55rem] font-medium max-md:hidden md:max-xl:pb-2 xl:max-2xl:py-1 ">
                {/* Dropdown for Chg and Chg% */}
                <select
                  className="focus:border-tertiary text-[0.55rem] outline-none"
                  value={oiOption}
                  onChange={(e) => setOiOption(e.target.value)}
                >
                  <option value="Chg%">Chg %</option>
                  <option value="Chg">Chg</option>
                </select>
              </th>
            )}
            <th className="text-[0.55rem] font-medium md:max-xl:pb-2 xl:max-2xl:py-1 ">
              {handleTargetExpiry(targetDate)}
            </th>
            <th className="text-[0.55rem] font-medium md:max-xl:pb-2 xl:max-2xl:py-1">
              {formatExpiryDate(payoffExpiryDate)}
            </th>
          </tr>
        </thead>

        <tbody>
          {visiblePayoffData.map((item: any, index) => {
            const matchingResult = result.find(
              (resultItem) => resultItem.strike_price === item.strike_price
            );
            return (
              <tr
                key={index}
                ref={
                  item.strike_price === roundedTargetSpotPrice
                    ? targetRowRef
                    : null
                }
                className={`border-y text-center transition-all hover:bg-gray-50 ${
                  item.strike_price === roundedTargetSpotPrice
                    ? "bg-blue-50"
                    : ""
                }`}
              >
                <td className="p-2 sm:max-md:py-[0.8rem] md:max-lg:py-[1rem] lg:max-xl:py-[1.5rem] text-center">
                  {item.strike_price === roundedTargetSpotPrice
                    ? targetSpotPrice
                    : item.strike_price}
                </td>
                {!noOiData && (
                  <td
                    className={`flex flex-row justify-center p-2 max-md:hidden text-center ${
                      typeof matchingResult?.CE_OIPercent === "number" &&
                      matchingResult?.CE_OIPercent >= 0
                        ? "pr-1"
                        : ""
                    }`}
                  >
                    {matchingResult?.CE_OIPercent === "N/A"
                      ? "-"
                      : formatNumber(matchingResult?.CE_OIPercent)}
                  </td>
                )}

                {!noOiData && (
                  <td
                    className={`p-2 max-md:hidden text-center ${
                      typeof matchingResult?.PE_OIPercent === "number" &&
                      matchingResult?.PE_OIPercent >= 0
                        ? "pr-1"
                        : ""
                    }`}
                  >
                    {matchingResult?.PE_OIPercent === "N/A"
                      ? "-"
                      : formatNumber(matchingResult?.PE_OIPercent)}
                  </td>
                )}
                <td
                  className={`p-2 text-center ${
                    item.target_pnl > 0
                      ? "text-z-green-500"
                      : item.target_pnl < 0
                        ? "text-red-400"
                        : "text-gray-500"
                  }`}
                >
                  {getCurrentFormattedDate() == payoffExpiryDate
                    ? formatNumber(item.expiry_pnl)
                    : formatNumber(item.target_pnl)}
                </td>
                <td
                  className={`p-2 text-center ${
                    item.expiry_pnl > 0
                      ? "text-z-green-500"
                      : item.expiry_pnl < 0
                        ? "text-red-400"
                        : "text-gray-500"
                  }`}
                >
                  {formatNumber(item.expiry_pnl)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PayoffTable;
