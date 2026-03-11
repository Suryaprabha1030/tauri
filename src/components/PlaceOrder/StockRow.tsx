import React, { useEffect, useState } from "react";
import { formatExpiryDate } from "@/lib/util/DateUtil"; // Import necessary date formatting
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import Image from "next/image";
import { extractIndexName } from "@/lib/util/sideToolBar/orders/OrderUtil";
import { validateNumericInput } from "@/lib/util/formatUtil";
import DisplayHandleSellButton from "../shared/ChartLayout/buySellButton/DisplayHandleSellButton";
import { toast } from "react-toastify";

interface StockRowProps {
  stock: any;
  index: number;
  selectedOrderTypes: Map<number, string>;
  handleUpdateStock: (identifier: string, field: string, value: any) => void;
  handleRadioButtonChange: (identifier: string, value: string) => void;
  handleDelete: (identifier: any) => void;
}

const StockRow: React.FC<StockRowProps> = ({
  stock,
  index,
  handleUpdateStock,
  handleDelete,
}) => {
  const LiveLtpData = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );

  const [localTempLtp, setLocalTempLtp] = useState<string | null>(null);

  const [localValue, setLocalValue] = useState(stock?.quantity ?? "");
  const positionsdata = useSelector(
    (state: RootState) => state.strategy.positions
  );
  const isInPositions =
    positionsdata &&
    positionsdata?.length > 0 &&
    positionsdata?.some((pos) => pos?.identifier === stock?.identifier);

  const handleBlur = () => {
    // user cleared input OR never edited
    if (localTempLtp === "" || localTempLtp === null) {
      const originalLtp = LiveLtpData[stock?.identifier] ?? stock?.ltp ?? 0;

      setLocalTempLtp(originalLtp.toString());
      return;
    }

    const tempLtp = Number(localTempLtp);

    if (!Number.isNaN(tempLtp)) {
      handleUpdateStock(stock?.identifier, "ltp", tempLtp);
    }
  };

  return (
    <>
      <tr className="h-10 text-center  font-letter text-black max-md:text-[0.6rem] md:text-[0.68rem]">
        <td className=" px-1 py-[0.1rem] max-md:hidden  md:max-lg:flex md:max-lg:flex-col md:max-lg:py-[0.8rem] lg:w-[15rem] xl:w-[13rem]">
          <span className="md:hidden">
            {stock?.index_name
              ? stock?.index_name
              : extractIndexName(stock?.symbol)}{" "}
          </span>
          <span className="max-md:hidden">
            {stock?.index_name
              ? stock?.index_name
              : extractIndexName(stock?.symbol)}{" "}
            {((stock.expiry || stock.expiry_date) &&
              formatExpiryDate(stock?.expiry || stock?.expiry_date)) ||
              ""}{" "}
            {(stock?.strike_price != -1 && stock?.strike_price) || ""}{" "}
            {["PE", "CE", "FUT"].includes(stock?.option_type) //In fyers for equity getting XX as option type
              ? stock.option_type
              : ""}
          </span>
        </td>
        {/* Only for Small Screen */}
        <td className="flex flex-col gap-1 px-0.5 py-[0.2rem] sm:max-md:px-[1rem] md:hidden">
          <span className="flex flex-row items-center px-0.5 max-sm:justify-between sm:max-md:justify-center sm:max-md:gap-[1rem] md:hidden">
            <span>
              {stock?.index_name
                ? stock?.index_name
                : extractIndexName(stock?.symbol)}
            </span>
            <span>
              {["PE", "CE", "FUT"].includes(stock?.option_type) && (
                <div
                  className={`class-for-touch-event inline-flex h-3 w-7 items-center justify-center rounded-xl border border-2 text-[0.5rem] sm:max-md:px-2 sm:max-md:py-2 sm:max-md:text-[0.6rem] ${
                    stock.option_type === "FUT" ? "" : "cursor-pointer"
                  }`}
                >
                  {["PE", "CE", "FUT"].includes(stock?.option_type)
                    ? stock?.option_type
                    : ""}
                </div>
              )}
            </span>
            <span className="my-1">
              <DisplayHandleSellButton
                type={stock?.transaction_type}
                handleChange={() => {
                  if (!isInPositions && stock?.product === "CNC") {
                    toast(
                      "Stocks with type CNC cannot have transaction type sell"
                    );
                  } else {
                    handleUpdateStock(
                      stock?.identifier,
                      "transaction_type",
                      stock?.transaction_type === "LONG" ? "SHORT" : "LONG"
                    );
                  }
                }}
              />
            </span>
          </span>
          <span className="flex flex-row gap-1 max-sm:justify-between sm:max-md:justify-center sm:max-md:gap-[1rem] md:hidden">
            <span className="flex min-w-[2rem] items-center justify-center ">
              {((stock.expiry || stock.expiry_date) &&
                formatExpiryDate(stock?.expiry || stock?.expiry_date)) ||
                "-"}
            </span>
            <span className="flex min-w-[2rem] items-center justify-center">
              {(stock?.strike_price != -1 && stock?.strike_price) || "-"}
            </span>
          </span>
        </td>
        {/* Only for Small Screen */}
        {/* <td className="px-1 py-[0.1rem] max-lg:hidden"> */}

        <td>
          {stock?.symbol_type === "stock_options" ? (
            <span className="text-gray-700">LIMIT</span> //for stock_options only limit allowed
          ) : (
            <select
              value={stock.order_type}
              onChange={(e) =>
                handleUpdateStock(
                  stock?.identifier,
                  "order_type",
                  e.target.value
                )
              }
              onTouchStart={(event: any) =>
                handleUpdateStock(
                  stock?.identifier,
                  "order_type",
                  event.target.value
                )
              }
              className="class-for-touch-event rounded-lg border bg-white max-md:px-0.5 max-md:text-[0.55rem] max-sm:w-[3rem] sm:max-md:w-[3.5rem] md:px-1 md:text-[0.65rem] xl:w-[4rem]"
            >
              <option value="MARKET">MKT</option>
              <option value="LIMIT">LIMIT</option>
            </select>
          )}
        </td>

        <td>
          <select
            value={stock.product || stock.product_type}
            onChange={(e) => {
              const selectedProduct = e.target.value;

              if (
                !isInPositions &&
                selectedProduct === "CNC" &&
                stock.transaction_type === "SHORT"
              ) {
                toast("CNC not allowed for Stocks with transaction type Sell");
                return;
              }

              handleUpdateStock(stock?.identifier, "product", selectedProduct);
            }}
            onTouchStart={(event: any) => {
              const selectedProduct = event.target.value;

              if (
                !isInPositions &&
                selectedProduct === "CNC" &&
                stock.transaction_type === "SHORT"
              ) {
                toast("CNC not allowed for Stocks with transaction type Sell");
                return;
              }

              handleUpdateStock(stock?.identifier, "product", selectedProduct);
            }}
            className="class-for-touch-event rounded-lg border max-md:px-0.5 max-md:text-[0.55rem] max-sm:w-[4.2rem] sm:max-md:w-[4.8rem] md:px-1 md:text-[0.65rem] xl:w-[5.2rem]"
          >
            {stock.exchange === "NFO" || stock.exchange === "BFO" ? (
              <>
                <option value="MIS">INTRADAY</option>
                <option value="NRML">NRML</option>
              </>
            ) : (
              <>
                <option value="MIS">INTRADAY</option>
                <option value="CNC">CNC</option>
              </>
            )}
          </select>
        </td>

        <td className="whitespace-nowrap">
          <input
            type="number"
            value={localValue}
            onFocus={(e) => e.target.select()} // Select all text on focus
            onChange={(e) => setLocalValue(e.target.value)} // Update only local state
            onBlur={(e) => {
              const newValue = parseInt(e.target.value);
              const finalValue =
                isNaN(newValue) || newValue < stock?.lot_size
                  ? stock?.lot_size
                  : Math.round(newValue / stock?.lot_size) * stock?.lot_size;
              setLocalValue(finalValue); // Update local state
              handleUpdateStock(stock?.identifier, "quantity", finalValue); // Update global state
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur(); // Trigger the blur event programmatically
              }
            }}
            onMouseDown={(e) => e.stopPropagation()}
            step={stock?.lot_size} // Ensure increments in multiples of stock?.lot_size
            min={stock?.lot_size} // Ensure minimum value is at least lotSize
            className=" class-for-touch-event h-6 rounded-lg border px-1 text-center max-sm:w-[2.5rem] max-sm:text-[0.65rem] sm:w-[3rem] md:text-[0.85rem] xl:w-[4rem] "
          />
        </td>

        <td>
          <input
            type="text"
            value={
              stock?.order_type === "MARKET" || stock?.order_type === "SL-M"
                ? (LiveLtpData[stock?.identifier] ?? 0)
                : localTempLtp !== null
                  ? localTempLtp
                  : (LiveLtpData[stock?.identifier] ?? stock?.ltp ?? 0)
            }
            onFocus={() => {
              if (localTempLtp === null) {
                setLocalTempLtp(
                  (
                    LiveLtpData[stock?.identifier] ??
                    stock?.ltp ??
                    ""
                  ).toString()
                );
              }
            }}
            className={`class-for-touch-event h-6 rounded-lg text-center text-[0.85rem] max-sm:w-[2.5rem] max-sm:text-[0.65rem] sm:w-[3rem] sm:max-md:w-[3.5rem] md:w-[5rem]  ${
              stock.order_type === "MARKET" || stock.order_type === "SL-M"
                ? "cursor-not-allowed bg-gray-100"
                : ""
            }`}
            onChange={(e) => {
              const value = e.target.value;
              // Allow only valid numeric input with regex
              if (validateNumericInput(value)) {
                setLocalTempLtp(value); // Update the local state to display the value
              }
            }}
            onTouchStart={(event: any) => {
              const value = event.target.value;
              // Allow only valid numeric input with regex
              if (validateNumericInput(value)) {
                setLocalTempLtp(value); // Update the local state to display the value
              }
            }}
            onBlur={handleBlur}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.currentTarget.blur(); // Trigger the blur event programmatically
              }
            }}
            disabled={
              stock?.order_type === "MARKET" || stock?.order_type === "SL-M"
            }
          />
        </td>

        <td className="max-md:hidden">
          <DisplayHandleSellButton
            type={stock?.transaction_type}
            addTouchAction={true}
            handleChange={() => {
              if (!isInPositions && stock?.product === "CNC") {
                toast("Stocks with type CNC cannot have transaction type sell");
              } else {
                handleUpdateStock(
                  stock?.identifier,
                  "transaction_type",
                  stock?.transaction_type === "LONG" ? "SHORT" : "LONG"
                );
              }
            }}
          />
        </td>

        <td className="class-for-touch-event w-[1.5rem] cursor-pointer sm:max-md:w-[2rem] md:px-1 md:max-xl:w-[3rem]">
          <Image
            src={"/svg/removeSymbol.svg"}
            height={15}
            width={15}
            alt={""}
            onClick={() => handleDelete(stock?.identifier)}
            onTouchStart={() => handleDelete(stock?.identifier)}
            className="md:max-xl:h-[1.2rem] md:max-xl:w-[1.2rem]"
          />
        </td>
      </tr>
    </>
  );
};

export default StockRow;
