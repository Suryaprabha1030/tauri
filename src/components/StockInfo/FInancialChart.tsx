
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { formatNumber } from "@/lib/util/DraftUtil";

const IncomeChart = ({ data }: { data: any }) => {
  type FinancialData = {
    "Total Revenue": number | null;
    "Net Income": number | null;
  };

  const filteredData = Object.entries(data).filter(
    ([, item]) =>
      (item as FinancialData)["Total Revenue"] !== null &&
      (item as FinancialData)["Net Income"] !== null
  );

  const categories = filteredData.map(([date]) =>
    new Date(date).getFullYear().toString()
  );
  const totalRevenueData = filteredData.map(
    ([_, item]) => (item as FinancialData)["Total Revenue"] || 0
  );
  const netIncomeData = filteredData.map(
    ([_, item]) => (item as FinancialData)["Net Income"] || 0
  );

  const series = [
    { name: "Total Revenue", data: totalRevenueData },
    { name: "Net Income", data: netIncomeData },
  ];

  const options: ApexOptions = {
    chart: { type: "bar", height: 350, toolbar: { show: false } },
    xaxis: { categories },
    yaxis: {
      labels: {
        formatter: (value) => formatNumber(value),
      },
    },
    colors: ["#4CAF50", "#F44336"],
    plotOptions: { bar: { horizontal: false, columnWidth: "30%" } },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (value) => formatNumber(value),
      },
    },
    title: {
      text: "Annual Total Revenue/Net Income ",
      align: "center",
    },
    grid: { show: false },
    legend: {
      show: false,
    },
  };

  return (
    <div className="relative h-[350px] w-full overflow-hidden">
      <div className="absolute left-0 h-full w-full">
        <Chart
          options={options}
          series={series}
          type="bar"
          height={350}
          width="100%"
        />
      </div>
    </div>
  );
};

export default IncomeChart;
