"use client";
import React, { useState } from "react";
import DataTable from "./FinancialDataDisplay";
import { formatNumber } from "@/lib/util/DraftUtil";
import IncomeChart from "./FInancialChart";
import StatsGrid from "./MarginCards";
import ResultsTable from "./FormattedTableDisplay";
import ToggleButton from "@/components/shared/ChartLayout/ToggleButton/ToggleButton";
import { chartTable } from "@/lib/util/toggleButtonName/toggleButtonNames";

interface PriceHistoryProps {
  info: any;
  income: {};
  InsideChat: any;
}

const incomeFields = [
  "Basic EPS",
  "Net Income",
  "Amortization",
  "Pretax Income",
  "Tax Provision",
  "Total Revenue",
  "Interest Income",
  "Interest Expense",
  "Operating Expense",
  "Operating Revenue",
];

const PriceHistory: React.FC<PriceHistoryProps> = ({
  info,
  income,
  InsideChat,
}) => {
  const [activeSection, setActiveSection] = useState("table");
  const handleSectionChange = (section: any) => {
    setActiveSection(section);
  };

  const valuation = {
    "Market Capitalization": formatNumber(info?.marketCap),
    "EnterPrise Value": formatNumber(info?.enterpriseValue),
    "Enterprise Value/EBITDA ": formatNumber(info?.ebitda),
    "Total Cash Per Share": formatNumber(info?.totalCashPerShare),
    "Price To Book": formatNumber(info?.priceToBook),
    "Price To Sales Trailing 12M": formatNumber(
      info?.priceToSalesTrailing12Months
    ),
    "Dividend Yield": formatNumber(info?.trailingAnnualDividendYield),
    "Profit Margin": formatNumber(info?.profitMargins),
    "Debt To Equity": formatNumber(info?.debtToEquity),
  };

  const priceHistory = {
    "Average volume": formatNumber(info?.averageVolume),
    "1-year Beta": formatNumber(info?.beta),
    "52 Week High": formatNumber(info?.fiftyTwoWeekHigh),
    "52 Week Low": formatNumber(info?.fiftyTwoWeekLow),
    "52 Week High Chg%": formatNumber(info?.fiftyTwoWeekHighChangePercent),
    "52 Week Low Chg%": formatNumber(info?.fiftyTwoWeekLowChangePercent),
  };

  return (
    <div className="rounded-lg border p-2 shadow-md">
      {/* Header */}
      <div className="flex flex-row justify-between">
        <h1 className="items-center p-1 text-lg font-semibold max-md:text-sm">
          Financial Sheets
        </h1>
        <ToggleButton
          buttons={chartTable}
          LiveButton={activeSection}
          onButtonClick={handleSectionChange}
          space={` max-sm:px-1 text-[0.75rem] px-2  max-sm:text-[0.65rem]`}
          hide={`${InsideChat ? "max-md:hidden" : ""}`}
        />
      </div>
      {activeSection === "chart" && (
        <div className="flex flex-row justify-between py-2.5 max-xl:h-[95%] max-xl:flex-col">
          <div className="flex w-[68%] flex-col justify-center rounded-lg border p-4 shadow-md max-xl:h-[46%] max-xl:w-full">
            <IncomeChart data={income} />
            <StatsGrid info={info} />
          </div>
          <div className="flex w-[30%] flex-col rounded-lg border shadow-md max-xl:h-[52%] max-xl:w-full max-xl:gap-4 max-sm:my-2 ">
            <div className="w-full max-xl:h-[50%] ">
              <DataTable header="Valuation" data={valuation} />
            </div>

            <div className="w-full max-xl:h-[44%]">
              <DataTable header="Price History" data={priceHistory} />
            </div>
          </div>
        </div>
      )}
      {activeSection === "table" &&
        income &&
        Object.entries(income)?.length > 0 && (
          <ResultsTable
            data={income}
            section={"Income Statement"}
            fields={incomeFields}
            Insidechat={InsideChat}
          />
        )}
    </div>
  );
};
PriceHistory.displayName = "PriceHistory";
export default React.memo(PriceHistory);
