import { formatNumber } from "@/lib/util/DraftUtil";
import  {  useState } from "react";
// Or use <img> if not on Next.js
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";

interface InfoItem {
  label: string;
  value: any;
  icon: string;
  hideOnMobile?: boolean; // <-- Optional
}

export default function StockHeaderInfo({ info }: { info: any }) {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  const isSidetabCollapsed: any = useSelector(
    (state: RootState) => state.common.isSidetabCollapsed,
  );

  window.addEventListener("resize", () => {
    setWindowSize(window.innerWidth);
  });

  const dataPairs: InfoItem[][] = [
    [
      { label: "Open", value: info?.open, icon: "/svg/Open.svg" },
      { label: "High", value: info?.dayHigh, icon: "/svg/HighIcon.svg" },
    ],
    [
      { label: "Low", value: info?.dayLow, icon: "/svg/LowIcon.svg" },
      {
        label: "Close",
        value: info?.previousClose,
        icon: "/svg/CloseIcon.svg",
      },
    ],
    [
      {
        label: "52W High",
        value: info?.fiftyTwoWeekHigh,
        icon: "/svg/52WeekHigh.svg",
      },
      {
        label: "52W Low",
        value: info?.fiftyTwoWeekLow,
        icon: "/svg/52WeekLow.svg",
      },
    ],
    [
      {
        label: "Market Cap",
        value: info?.marketCap,
        icon: "/svg/MarketCap.svg",
        hideOnMobile: true,
      },
      {
        label: "Volume",
        value: info?.volume,
        icon: "/svg/Volume.svg",
        hideOnMobile: true,
      },
    ],
  ];

  return (
    <div
      className={`flex z-50 ${isSidetabCollapsed ? "w-[80%] max-lg:w-full max-lg:justify-center max-lg:px-4" : "w-[70%]  max-lg:w-full max-lg:justify-center max-lg:px-4    xl:max-2xl:px-4"}  flex-row flex-wrap  rounded-md   text-[0.9rem] font-medium max-sm:justify-between max-sm:gap-[1rem] sm:max-md:w-full sm:max-md:flex-row sm:max-md:justify-center sm:max-md:gap-[2rem]  md:max-xl:justify-between xl:max-2xl:w-full xl:max-2xl:justify-evenly  2xl:justify-evenly`}
    >
      {dataPairs.map((pair, pairIdx) => {
        const isLastPair = pairIdx === dataPairs?.length - 1;
        if (windowSize >= 1400 && !isSidetabCollapsed && isLastPair) {
          return null;
        }

        return (
          <div
            key={pairIdx}
            className={`flex flex-col items-start justify-between rounded-lg p-1 sm:h-12  md:h-14 md:w-[9.5rem] ${
              isLastPair
                ? "border-2 max-sm:border-none sm:max-md:border-none"
                : "border-2"
            }`}
          >
            {pair.map(({ label, value, icon, hideOnMobile }) =>
              value && value !== 0 ? (
                <p
                  key={label}
                  className={`flex items-center gap-1 text-[0.65rem] text-gray-500 sm:text-[0.6rem] ${
                    hideOnMobile ? "max-sm:hidden sm:max-md:hidden" : ""
                  }`}
                >
                  {" "}
                  <img
                    src={icon}
                    alt={label}
                    width={14}
                    height={14}
                    className="max-sm:hidden"
                  />
                  <span className="md:w-[3rem]  ">{label}</span> :
                  <span className="text-[0.75rem] font-semibold text-black max-md:text-[0.7rem] ">
                    {formatNumber(value)}
                  </span>
                </p>
              ) : null,
            )}
          </div>
        );
      })}
    </div>
  );
}
