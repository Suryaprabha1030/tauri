import React, { useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState } from "react";
import Image from "next/image";
import PeersChartOptions from "./StockChartOptions/PeersChartOptions";

const tooltipValues = {
  "Current Market Price": "CMP(Rs)",
  "PE Ratio": "Price to Equity",
  "Earnings Per Share": "EPS(Rs)",
  "Market Capital": "Mar. Capital(Cr)",
  Sales: "Sales(Cr)",
  "Profit After Tax": "PAT(Cr)",
  "Dividend Yield": "Div. Yield(%)",
  Debt: "Debt(Cr)",
};

const values = {
  "Current Market Price": "cmp_rs",
  "PE Ratio": "pe",
  "Earnings Per Share": "eps_12m_rs",
  "Market Capital": "mar_cap_rs_cr",
  Sales: "sales_qtr_rs_cr",
  "Profit After Tax": "pat_12m_rs_cr",
  "Dividend Yield": "div_yld_percent",
  Debt: "debt_rs_cr",
};

const PeersChart = React.memo(({ data }: any) => {
  const [currentChart, setCurrentChart] = useState("Current Market Price");
  const [isDropdown, setIsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fields = Object.keys(values)?.map((item) => item);
  const currentValue = data?.map((item: any) => item[values[currentChart]]);
  const name = data?.map((item: any) => item?.name);

  const series = [{ name: tooltipValues[currentChart], data: currentValue }];
  const options: ApexOptions = PeersChartOptions(name);

  return (
    <div className="w-full">
      <div className="relative flex items-center justify-between p-2">
        <h1 className="text-lg max-sm:text-sm font-semibold">{currentChart}</h1>
        <button
          className="flex flex-row p-0.5  bg-white rounded-md border border-gray-200 hover:bg-gray-100 hover:cursor-pointer text-[0.9rem] max-sm:text-xs"
          onClick={() => {
            setIsDropdown(true);
            if (isDropdown) setIsDropdown(false);
          }}
        >
          {currentChart}
          <img
            className={`${isDropdown ? "rotate-180" : ""} ml-auto`}
            src={"/svg/downChevron.svg"}
            alt=""
            width={16}
            height={16}
          />
        </button>
        {isDropdown && (
          <div
            ref={dropdownRef}
            className="z-20 text-[0.85rem]  absolute top-12 right-4 border rounded-md bg-white border-gray-100 bg-green shadow-md"
          >
            {fields.map((item) => {
              return (
                <div
                  key={item}
                  className={`${currentChart === item ? "bg-[#4CA858] text-white hover:bg-[#4CA858]" : "hover:bg-gray-100"} z-10 p-1 cursor-pointer`}
                  onClick={() => {
                    setCurrentChart(item);
                    setIsDropdown(false);
                  }}
                >
                  {item}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="w-full h-[350px]  relative">
        <div className="w-full  absolute left-0">
          <Chart
            options={options}
            series={series}
            type="bar"
            height={350}
            width="100%"
          />
        </div>
      </div>
    </div>
  );
});
PeersChart.displayName = "PeersChart";
export default PeersChart;
