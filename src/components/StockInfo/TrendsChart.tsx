import React, {  useEffect, useRef, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import { useDispatch } from "react-redux";
import { setSelectedChart } from "@/lib/redux/slices/CommonSlice";
import NoData from "./NoData";
import TrendsChartOptions from "./StockChartOptions/TrendsChartOptions";

interface TrendsChartProps {
  data: any;
  initial: number;
  dropdown: any[];
}

const tooltipValues:any = {
  "Net Income": "Net Income",
  ROE: "ROE",
  "Debt to Equity": "DE",
  Sales: "Sales",
  ROCE: "ROCE",
  "Operating Cash Flow": "Cash Flow",
  "Interest Coverage": "Interest Coverage",
  "CFO to PAT": "CFO:PAT",
};
const values:any = {
  ROE: "roe_years",
  "Net Income": "net_income_years",
  Sales: "sales",
  "Debt to Equity": "de_ratio_years",
  ROCE: "roce",
  "Operating Cash Flow": "operating_cash_flow",
  "Interest Coverage": "interest_coverage_ratio",
  "CFO to PAT": "cfo_to_pat_ratio",
};
const croreValues = ["Net Income", "Sales", "Operating Cash Flow"];

const TrendsChart = React.memo(
  ({ data, initial, dropdown }: TrendsChartProps) => {
    const initialValue = Object.keys(values)[initial];
    const [activeSection, setActiveSection] = useState(initialValue);
    const [isDropdown, setIsDropdown] = useState(false);
    const dispatch = useDispatch();
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
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const chartData = data?.[values[activeSection]];
    const validData = Object.entries(chartData ?? {})
      .map(([key, value]) => {
        const year: any = new Date(key).getFullYear();
        return isNaN(year) || value == null ? null : { year, value };
      })
      .filter(Boolean) as { year: number; value: number }[]; //Check this line

    const handleDropDown = () => {
      setIsDropdown(!isDropdown);
    };
    const isCrore = croreValues.includes(activeSection);

    const series = [
      {
        name: tooltipValues[activeSection],
        data: validData.map(({ year, value }) => ({ x: year, y: value })),
      },
    ];

    const options: ApexOptions = TrendsChartOptions(isCrore);

    return (
      <>
        <div className="border border-gray-200 p-2 w-[33%] max-sm:w-full">
          <div className="relative flex flex-col" onClick={handleDropDown}>
            <div className="flex flex-row justify-between p-1 border border-gray-200 rounded-md hover:cursor-pointer">
              <h1 className="font-semibold ">{activeSection}</h1>
              <img
                className={`${isDropdown ? "rotate-180" : ""}`}
                src={"/svg/downChevron.svg"}
                alt=""
                width={16}
                height={16}
              />
            </div>
            {isDropdown && (
              <div
                ref={dropdownRef}
                className="flex flex-col w-full shadow-md absolute mt-10 z-10 bg-white rounded-md border border-gray-200"
              >
                {Object.keys(values)?.map((section) => (
                  <button
                    key={section}
                    className={`${dropdown.includes(section) ? "pointer-events-none cursor-not-allowed text-gray-400" : "text-black"} text-left hover:bg-gray-100 p-1 text-[0.85rem]`}
                    onClick={() => {
                      setActiveSection(section);
                      setIsDropdown(false);
                      dispatch(
                        setSelectedChart({ index: initial, value: section }),
                      );
                    }}
                  >
                    {dropdown?.includes(section)
                      ? `${section} (Chosen)`
                      : `${section}`}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative w-full h-[380px] flex items-center justify-center">
            {data && Object.keys(data?.[values[activeSection]])?.length > 0 ? (
              <div className="absolute left-0 w-full h-full">
                <Chart
                  options={options}
                  series={series}
                  type="area"
                  height={350}
                />
              </div>
            ) : (
              <div className="w-full flex justify-center">
                <NoData data={activeSection} />
              </div>
            )}
          </div>
        </div>
      </>
    );
  },
);
TrendsChart.displayName = "TrendsChart";
export default React.memo(TrendsChart);
