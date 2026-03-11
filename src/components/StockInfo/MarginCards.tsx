import { formatNumber } from "@/lib/util/DraftUtil";
import React from "react";

interface StatCardProps {
  title: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="w-40 rounded-xl bg-gray-100 p-4 text-center shadow-sm max-2xl:flex max-2xl:flex-col max-2xl:items-center max-2xl:justify-center max-md:p-1 max-sm:w-20 sm:max-md:w-28 md:max-2xl:p-2 md:max-xl:w-36 xl:max-2xl:w-28">
      <p className="text-xs text-gray-600 max-md:text-[0.75rem]">{title}</p>
      <p className="mt-1 text-sm font-semibold max-md:text-[0.8rem]">
        {value}%
      </p>
    </div>
  );
};

const StatsGrid = ({ info }: { info: Record<string, number> }) => {
  const Margins = {
    "Operating Margin": formatNumber(info.operatingMargins),
    "Profit Margin": formatNumber(info.profitMargins),
    "Gross Margin": formatNumber(info.grossMargins),
    "EBITA Margin": formatNumber(info.ebitdaMargins),
  };

  return (
    <div className="flex justify-center gap-2 md:max-xl:gap-4 ">
      {Object.entries(Margins).map(([title, value], index) => (
        <StatCard key={index} title={title} value={value} />
      ))}
    </div>
  );
};

export default StatsGrid;
