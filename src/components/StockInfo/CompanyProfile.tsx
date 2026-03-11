"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

interface CompanyProfileProps {
  info: any;
}

const formatNumber = (value?: any) => {
  if (value == null || value == undefined || isNaN(value)) return "-";
  return value?.toFixed(2);
};

const calculatePEG = (data: any) => {
  if (data == null || data == undefined) return "-";
  const peRatio = formatNumber(data?.trailingPE);
  const epsGrowth = formatNumber(data?.earningsGrowth);
  const PEG = peRatio / (epsGrowth * 100);
  return formatNumber(PEG);
};

function cleanURL(url: string) {
  return url
    .replace(/^https?:\/\//, "") // remove http:// or https://
    .replace(/\/$/, ""); // remove trailing slash
}

const flags = {
  "Over Valued": "/svg/flagRed.svg",
  "Fairly Valued": "/svg/flagGreen.svg",
  "Under Valued": "/svg/flagGray.svg",
};

function factorValuation(value, min, max) {
  if (value === undefined) return "";
  if (value === null) return "";
  if (value === "-") return "";
  if (value > max && value > 0) return "Over Valued";
  if (value < min && value > 0) return "Under Valued";
  if (value < 0) return "";

  return "Fairly Valued";
}

function remarkValuation(factor: any) {
  if (factor === "Over Valued") {
    return 1;
  } else if (factor === "") {
    return 1;
  } else {
    return 0;
  }
}

const CompanyProfile: React.FC<CompanyProfileProps> = ({ info }) => {
  const [readMore, setReadMore] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [tooltip, setTooltip] = useState<any>({});
  const [dashboardData, setDashboardData] = useState([
    {
      name: "",
      value: 0 || "",
      tooltip: {
        name: "",
        fairRange: "",
        valuation: "",
        description: "",
      },
      remark: 0,
    },
  ]);

  const maxLength = 375;
  const summary = info?.longBusinessSummary;
  const displayText = readMore
    ? summary
    : summary?.length > 375
      ? summary.slice(0, maxLength)
      : summary;

  useEffect(() => {
    setDashboardData([
      {
        name: "P/E Ratio",
        value: formatNumber(info?.trailingPE),
        tooltip: {
          name: "Price-to-Equity",
          fairRange: "10 - 25",
          valuation: factorValuation(info?.trailingPE, 10, 25),
          description:
            "Stock price divided by earnings per share. Shows how much investors pay for each rupee of company profit. Lower P/E suggests better value relative to earnings.",
        },
        remark: remarkValuation(factorValuation(info?.trailingPE, 10, 25)),
      },
      {
        name: "P/B Ratio",
        value: formatNumber(info?.priceToBook),
        tooltip: {
          name: "Price-to-Book",
          fairRange: "0 - 2",
          valuation: factorValuation(info?.priceToBook, 0, 2),
          description:
            "Market price compared to net assets per share. Reveals if stock trades above or below its book value. Below 1 means market price < company assets.",
        },
        remark: remarkValuation(factorValuation(info?.priceToBook, 0, 2)),
      },
      {
        name: "PEG Ratio",
        value: calculatePEG(info),
        tooltip: {
          name: "PE with Growth",
          fairRange: "1 - 1.5",
          valuation: factorValuation(calculatePEG(info), 1, 1.5),
          description:
            "P/E ratio adjusted for expected earnings growth. Prevents comparing high-growth vs mature companies. Lower PEG indicates better growth value.",
        },
        remark: remarkValuation(factorValuation(calculatePEG(info), 1, 1.5)),
      },
      {
        name: "Div Yield",
        value: formatNumber(info?.dividendYield),
        tooltip: {
          name: "Dividend Yield",
          fairRange: "2 - 5%",
          valuation: factorValuation(info?.dividendYield, 10, 25),
          description:
            "Annual dividend payment as % of current stock price. Shows income return for shareholders. Higher yield = more cash return per investment.",
        },
        remark: remarkValuation(factorValuation(info?.dividendYield, 10, 25)),
      },
      {
        name: "EPS",
        value: formatNumber(info?.trailingEps),
        tooltip: {
          name: "Earnings-per-Share",
          fairRange: "Based on company valuation",
          valuation: "",
          description:
            "Company profit divided by total outstanding shares. Primary measure of per-share profitability. Growing EPS signals improving business performance.",
        },
        remark: -1,
      },
      {
        name: "D/E Ratio",
        value: formatNumber(info?.debtToEquity),
        tooltip: {
          name: "Debt-to-Equity",
          fairRange: "0.3 - 1.5",
          valuation: "",
          description:
            "Total company debt divided by shareholders' equity. Measures financial leverage and risk level. Lower ratio = less debt dependency, more financial safety.",
        },
        remark: -1,
      },
      {
        name: "Quick Ratio",
        value: formatNumber(info?.quickRatio),
        tooltip: {
          name: "Quick Ratio",
          fairRange: "1 - 2",
          valuation: "",
          description:
            "The quick ratio measures a company's ability to pay short-term liabilities using only its most liquid assets (cash, receivables, marketable securities), excluding inventory. ",
        },
        remark: -1,
      },
      {
        name: "ROE",
        value: formatNumber(info?.returnOnEquity),
        tooltip: {
          name: "Return-on-Equity",
          fairRange: "15 - 20%",
          valuation: "",
          description:
            "ROE represents net income generated per unit of shareholders' equity. It shows how effectively management converts equity investments into profits.",
        },
        remark: -1,
      },
      {
        name: "Rev. Growth",
        value: formatNumber(info?.revenueGrowth),
        tooltip: {
          name: "Revenue Growth",
          fairRange: "Based on company valuation",
          valuation: "",
          description:
            "Revenue growth measures the percentage increase in a company's total sales or top-line revenue over a period, signaling business expansion.",
        },
        remark: -1,
      },
      {
        name: "Earn. Growth",
        value: formatNumber(info?.earningsGrowth),
        tooltip: {
          name: "Earnings Growth",
          fairRange: "5% to Maximum",
          valuation: "",
          description:
            "Earnings growth tracks the percentage rise in net profit or bottom-line earnings, showing if revenue gains translate to improved profitability.",
        },
        remark: -1,
      },
    ]);
    setReadMore(false);
    setIsSpinning(true);

    setTimeout(() => {
      setIsSpinning(false);
    }, 2000);
  }, [info]);

  const getTooltipSide = (index) => {
    const width = window.innerWidth;

    if (width < 576) {
      // max-sm: 3 cols for single row
      return [1, 2, 4, 5, 7, 8, 10, 11].includes(index)
        ? "-right-full"
        : "left-full";
    } else if (width < 768) {
      // max-md: 4 cols for single row
      return [2, 3, 6, 7, 10, 11].includes(index) ? "-right-full" : "left-full";
    } else if (width > 768) {
      // max-lg+: 6 cols for single row
      return [3, 4, 5, 9, 10, 11].includes(index) ? "-right-full" : "left-full";
    }
  };

  return (
    <>
      <div className="flex flex-col max-md:flex-col border border-gray-200 h-full justify-between rounded-lg mx-auto p-0.5 bg-white">
        {Object.entries(info)?.length > 0 &&
        (info?.sector || info?.industry) ? (
          <>
            <div className="flex flex-col relative w-full max-md:w-full p-1">
              <div className="grid relative grid-flow-row grid-cols-6 max-sm:grid-cols-3 max-md:grid-cols-4 max-lg:grid-cols-6 justify-between flex-wrap">
                {dashboardData?.map((item, index) => (
                  <div
                    key={index}
                    className={`flex  flex-col rounded-md border gap-2 p-2 m-0.5`}
                    onMouseEnter={() => {
                      setTooltip(item?.tooltip);
                    }}
                    onMouseLeave={() => {
                      setTooltip({});
                    }}
                    onClick={() => {
                      setTooltip(item?.tooltip);
                    }}
                  >
                    <span className="flex flex-row w-full justify-center">
                      <span className="max-sm:text-xs flex justify-center text-sm text-nowrap">
                        {item?.name}
                      </span>
                      <div className="relative group">
                        <img
                          src="/svg/infoGreen.svg"
                          alt=""
                          className="flex items-center relative top-1 left-0.5 max-sm:top-0.5"
                          height={13}
                          width={13}
                        />
                        <span
                          className={`${getTooltipSide(index)} z-10 absolute max-md:w-60 md:w-72 opacity-0 group-hover:opacity-100  max-sm:w-52 w-[480px] pointer-events-none rounded-md px-1 text-sm bg-white border border-gray-200 shadow-xl`}
                        >
                          {tooltip && (
                            <span className="flex flex-col py-1 px-1">
                              <span className="flex flex-row p-1 items-center">
                                <h3 className="font-semibold">
                                  {tooltip.name}
                                </h3>
                                {tooltip.valuation !== "" &&
                                  flags[tooltip.valuation] && (
                                    <img
                                      src={flags[tooltip.valuation]}
                                      alt=""
                                      width={15}
                                      height={15}
                                      className="mx-1"
                                      style={{ color: "#4CA858" }}
                                    />
                                  )}
                              </span>
                              <span className="px-1">
                                {tooltip.description}
                              </span>
                              <span className="p-1 font-semibold">
                                Fair Range{" "}
                                <span className="font-normal">
                                  {tooltip.fairRange !== ""
                                    ? ` : ${tooltip.fairRange}`
                                    : ""}
                                </span>
                              </span>
                            </span>
                          )}
                        </span>
                      </div>
                    </span>
                    <span className="flex flex-row justify-center items-center">
                      <span className="font-semibold text-xl max-sm:text-base flex justify-center">
                        {item?.value}
                      </span>
                      {item.value !== "-" && item.remark !== -1 && (
                        <span className="flex items-center px-0.5">
                          {item.remark === 0 ? (
                            <img
                              src="/svg/circleTick.svg"
                              className={isSpinning ? "animate-coinRotate" : ""}
                              alt=""
                              width={18}
                              height={18}
                            />
                          ) : (
                            <img
                              src="/svg/circleCross.svg"
                              className={isSpinning ? "animate-coinRotate" : ""}
                              alt=""
                              width={15}
                              height={15}
                            />
                          )}
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col rounded-md w-full max-md:w-full p-1">
              <span className="flex flex-row max-sm:flex-wrap min-md:gap-2 p-1 justify-between min-md:w-full">
                <span>
                  <span className="font-[500] text-base max-sm:text-xs">
                    Sector :
                  </span>
                  <span className="px-1.5 text-base max-sm:text-xs">
                    {info?.sectorDisp}
                  </span>
                </span>
                <span>
                  <span className="font-[500] text-base max-sm:text-xs">
                    Industry :
                  </span>
                  <span className="px-1.5 text-base max-sm:text-xs">
                    {info?.industryDisp}
                  </span>
                </span>
              </span>
              <span className="text-[0.9rem] max-md:text-[0.8rem] m-1 p-2 rounded-md text-justify bg-white overflow-y-auto scrollbar-none border border-gray-200">
                {displayText}
                {info?.longBusinessSummary?.length > 375 && (
                  <button
                    className="px-1 text-blue-400"
                    onClick={() => {
                      setReadMore(!readMore);
                    }}
                  >
                    Read {readMore ? "less" : "more..."}
                  </button>
                )}
              </span>
              <span className="font-semibold px-2 flex flex-row w-full justify-between">
                <span className="flex flex-row items-center">
                  <a
                    href={`${info?.website}?utm_source=zoonest.com`}
                    target="_blank"
                    className="underline text-blue-400 text-[0.75rem] p-1 cursor-pointer flex flex-row"
                  >
                    {info && cleanURL(info?.website)}
                    <img
                      src="/svg/newtab.svg"
                      className="px-1 cursor-pointer"
                      height={18}
                      width={18}
                      alt=""
                    />
                  </a>
                </span>
              </span>
            </div>
          </>
        ) : (
          <>
            <span className="flex max-sm:text-sm w-full h-[250px] items-center justify-center text-lg text-gray-400">
              No Overview Available{" "}
            </span>
          </>
        )}
      </div>
    </>
  );
};
CompanyProfile.displayName = "CompanyProfile";
export default React.memo(CompanyProfile);
