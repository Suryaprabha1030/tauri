import React from "react";
import Headings from "../sharedContent/headings";
import RefreshButton from "../refresh";
import RemoveButton from "../sharedContent/RemoveButton";
import { WidthAdjusterDoubleClick } from "@/lib/util/sideToolBar/sidetoolbarCommon";
import Nimabutton from "@/components/NimaAI/Nimabutton";
import { setNimaGpt, setScreenerQuery } from "@/lib/redux/slices/screenerSlice";
import {
  setCurrentSection,
  setScreenerOpen,
} from "@/lib/redux/slices/CommonSlice";
import { useDispatch } from "react-redux";
import DemoButton from "@/components/Simulation/DemoButton";
import { setOrdersDemoEnabled } from "@/lib/redux/slices/SimulationSlice";

interface OrderHeaderProps {
  activeStatusFilter: string | null;
  setActiveStatusFilter: React.Dispatch<React.SetStateAction<string | null>>;
  setTransactionFilter: React.Dispatch<React.SetStateAction<string | null>>;
  transactionFilter: string | null;
  ordersData: any[];
  setresfresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
  leftWidth: number;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({
  activeStatusFilter,
  setActiveStatusFilter,
  setTransactionFilter,
  transactionFilter,
  ordersData,
  setresfresh,
  refresh,
  leftWidth,
  setLeftWidth,
}) => {
  const handlerefreshorder = () => {
    dispatch(setOrdersDemoEnabled(false));
    setresfresh(!refresh);
  };
  const dispatch = useDispatch();
  const NimaClick = () => {
    dispatch(setScreenerQuery("Analyze my orders"));
    dispatch(setNimaGpt("orders"));
    dispatch(setScreenerOpen(true));
    dispatch(setCurrentSection(null));
  };
  return (
    <div
      className="flex flex-row items-center justify-between bg-white max-md:pb-[1rem] sm:max-md:sticky sm:max-md:top-0 md:max-xl:py-1"
      onDoubleClick={() => WidthAdjusterDoubleClick(leftWidth, setLeftWidth)}
    >
      <Headings
        name={`Orders${ordersData && ordersData?.length !== 0 ? ` (${ordersData?.length})` : ""}`}
      />

      <div
        className={`flex  ${leftWidth >= 40 ? "w-[21.5rem]" : "w-[8rem]"}  flex-row items-center justify-end max-md:pl-4 max-sm:w-[16rem] max-sm:gap-2 sm:max-md:gap-6 md:max-xl:w-[24rem] md:max-xl:gap-10 xl:gap-2`}
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        {ordersData && ordersData.length > 0 && leftWidth >= 40 && (
          <>
            <div
              className="inline-flex justify-center max-md:w-[7rem] md:w-[9rem] "
              role="group"
            >
              <button
                className={`rounded-l-3xl border border-gray-200 font-medium text-gray-400 max-md:py-0.5 max-md:text-[0.6rem] max-sm:px-1 sm:px-2 md:py-1 md:text-[0.65rem]
                  ${
                    activeStatusFilter === "REJECTED"
                      ? "bg-red-500 text-white"
                      : "bg-white xl:hover:bg-gray-200 xl:hover:text-black"
                  }`}
                onClick={() =>
                  setActiveStatusFilter(
                    activeStatusFilter === "REJECTED" ? null : "REJECTED"
                  )
                }
              >
                Rejected
              </button>
              <button
                className={`rounded-r-3xl border border-gray-200 text-[0.65rem] font-medium text-gray-400 max-md:py-0.5 max-md:text-[0.6rem] max-sm:px-1 sm:px-2 md:py-1
                    ${
                      activeStatusFilter === "COMPLETED"
                        ? "bg-z-green-500 text-white"
                        : "bg-white xl:hover:bg-gray-200 xl:hover:text-black"
                    }`}
                onClick={() =>
                  setActiveStatusFilter(
                    activeStatusFilter === "COMPLETED" ? null : "COMPLETED"
                  )
                }
              >
                Completed
              </button>
            </div>
            <div
              className="inline-flex justify-center max-md:w-[3rem] xl:w-[5rem] "
              role="group"
            >
              <button
                className={`rounded-l-3xl border border-gray-200 font-medium text-gray-400 max-md:py-0.5 max-md:text-[0.57rem] max-sm:px-1 sm:px-2 md:py-1 md:text-[0.65rem]
                  ${
                    transactionFilter === "BUY"
                      ? "bg-z-green-500 text-white"
                      : "bg-white xl:hover:bg-gray-200 xl:hover:text-black"
                  }`}
                onClick={() =>
                  setTransactionFilter(
                    transactionFilter === "BUY" ? null : "BUY"
                  )
                }
              >
                Buy
              </button>
              <button
                className={`rounded-r-3xl border border-gray-200 font-medium text-gray-400 max-md:py-0.5 max-md:text-[0.57rem] max-sm:px-1 sm:px-2 md:py-1 md:text-[0.65rem]
                    ${
                      transactionFilter === "SELL"
                        ? "bg-red-500 text-white"
                        : "bg-white xl:hover:bg-gray-200 xl:hover:text-black"
                    }`}
                onClick={() =>
                  setTransactionFilter(
                    transactionFilter === "SELL" ? null : "SELL"
                  )
                }
              >
                Sell
              </button>
            </div>
          </>
        )}
        <div className="flex flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="max-2xl:hidden 2xl:flex">
              <DemoButton
                onClick={() => dispatch(setOrdersDemoEnabled(true))}
              />
            </div>
            <Nimabutton onClick={NimaClick} />
            <RefreshButton onClick={handlerefreshorder} />
          </div>

          <div className="w-[1.5rem]">
            <RemoveButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHeader;
