import React from "react";
import Image from "next/image"; // Assuming you're using Next.js
import RefreshButton from "../refresh";
interface OrdersFilterProps {
  ordersData: any;
  activeStatusFilter: any;
  setActiveStatusFilter: React.Dispatch<React.SetStateAction<any>>;
  transactionFilter: any;
  setTransactionFilter: React.Dispatch<React.SetStateAction<any>>;
  handlerefreshorder: () => void;
  setShowOrders: React.Dispatch<React.SetStateAction<any>>;
}
const OrderFilters: React.FC<OrdersFilterProps> = ({
  ordersData,
  activeStatusFilter,
  setActiveStatusFilter,
  transactionFilter,
  setTransactionFilter,
  handlerefreshorder,
  setShowOrders,
}) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <h1 className="p-4 text-xl font-bold">Orders</h1>
      <div className="flex w-[20rem] flex-row items-center gap-2">
        {ordersData && ordersData.length > 0 && (
          <>
            <div className="inline-flex w-[9rem] justify-center" role="group">
              <button
                className={`rounded-l-3xl border border-gray-200 px-2 py-1 text-[0.65rem] font-medium text-gray-400
                  ${
                    activeStatusFilter.toUpperCase() === "REJECTED"
                      ? "bg-red-500 text-white"
                      : "bg-white hover:bg-red-500 hover:text-white"
                  }`}
                onClick={() =>
                  setActiveStatusFilter(
                    activeStatusFilter.toUpperCase() === "REJECTED"
                      ? null
                      : "REJECTED",
                  )
                }
              >
                Rejected
              </button>
              <button
                className={`rounded-r-3xl border border-gray-200 px-2 py-1 text-[0.65rem] font-medium text-gray-400
                  ${
                    activeStatusFilter.toUpperCase() === "COMPLETED"
                      ? "bg-z-green-500 text-white"
                      : "bg-white hover:bg-z-green-500 hover:text-white"
                  }`}
                onClick={() =>
                  setActiveStatusFilter(
                    activeStatusFilter.toUpperCase() === "COMPLETED"
                      ? null
                      : "COMPLETED",
                  )
                }
              >
                Completed
              </button>
            </div>
            <div className="inline-flex w-[5rem] justify-center" role="group">
              <button
                className={`rounded-l-3xl border border-gray-200 px-2 py-1 text-[0.65rem] font-medium text-gray-400
                  ${
                    transactionFilter === "BUY"
                      ? "bg-z-green-500 text-white"
                      : "bg-white hover:bg-z-green-500 hover:text-white"
                  }`}
                onClick={() =>
                  setTransactionFilter(
                    transactionFilter === "BUY" ? null : "BUY",
                  )
                }
              >
                Buy
              </button>
              <button
                className={`rounded-r-3xl border border-gray-200 px-2 py-1 text-[0.65rem] font-medium text-gray-400
                  ${
                    transactionFilter === "SELL"
                      ? "bg-red-500 text-white"
                      : "bg-white hover:bg-red-500 hover:text-white"
                  }`}
                onClick={() =>
                  setTransactionFilter(
                    transactionFilter === "SELL" ? null : "SELL",
                  )
                }
              >
                Sell
              </button>
            </div>
            <RefreshButton onClick={handlerefreshorder} />
          </>
        )}
        <button
          className="absolute right-0 top-0 p-4 text-xl"
          onClick={() => setShowOrders(false)}
        >
          <img
            src="/svg/removeSymbol.svg"
            className="relative h-[1.5rem] w-[1.5rem]"
            width="20"
            height="20"
            alt="plus"
          />
        </button>
      </div>
    </div>
  );
};

export default OrderFilters;
