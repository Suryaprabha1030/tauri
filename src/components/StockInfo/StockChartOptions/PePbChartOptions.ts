import { ApexOptions } from "apexcharts";
interface PePbChartOptionsProps {
    chartData: any;
    data: any;
    categories: string[];
}

const PePbChartOptions = ({ chartData, data, categories }: PePbChartOptionsProps): ApexOptions => {
    return {
        chart: {
            type: "line",
            height: 400,
            width: "100%",
            toolbar: { show: false },
            zoom: {
                enabled: false
            },
        },
        fill: {
            type: 'gradient',
        },
        grid: { show: false },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        legend: {
            show: false
        },
        dataLabels: { enabled: false },

        xaxis: {
            type: "datetime",
            categories,
            tickAmount: categories?.length - 1,
            labels: {
                show: true,
                style: { fontSize: "10px" },
                formatter: (value) =>
                    new Date(value).toLocaleString("en-US", { month: "short" })
            },
            axisBorder: { show: true },
            axisTicks: { show: false }
        },

        yaxis: {
            labels: {
                formatter: (val) => Number(val)?.toFixed(0) // whole numbers
            }
        },

        colors: ['#FA52F4', '#52AEFA'],
        
        tooltip: {
            followCursor: true,
            shared: false,
            custom: function ({ seriesIndex, dataPointIndex, w }) {
                const hoveredTimeStamp = w.config.series[seriesIndex].data[dataPointIndex].x
                const pointData = chartData?.find((item:any) =>
                    new Date(item?.date).getTime() === hoveredTimeStamp
                )

                if (!pointData) return '<div>No Data</div>';
                const isPBRatio = seriesIndex === 1;
                const minMaxVol = isPBRatio ? data?.['P/B'] : data?.['P/E']
                const min = minMaxVol.min
                const max = minMaxVol.max
                const vol = minMaxVol.volatility

                return `
            <div class="p-2 bg-white shadow-xl rounded-lg border border-gray-200 min-w-[130px]">
                <div class="font-semibold text-sm mb-3 text-gray-800">
                    ${new Date(pointData?.date).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'short', day: '2-digit'
                })}
                </div>
                <div class="grid grid-cols-2 gap-3 text-sm">
                    <div class="text-gray-600">${isPBRatio ? 'P/B' : 'P/E'}</div>
                    <div class="font-semibold text-left">${(isPBRatio ? pointData?.PB_Ratio : pointData?.PE_Ratio)?.toFixed(2) || 'N/A'}</div>

                    <div class="text-gray-600">Price</div>
                    <div class="font-semibold text-left">₹${pointData?.price?.toFixed(2) || 'N/A'}</div>

                    <div class="text-gray-600">${isPBRatio ? "BVPS" : "EPS"}</div>
                    <div class="font-semibold text-left">₹${isPBRatio ? pointData?.BookValuePerShare?.toFixed(2) || 'N/A' : pointData.EPS?.toFixed(2) || 'N/A'}</div>

                    <div class="text-gray-600">Min</div>
                    <div class="font-semibold text-left">${min}</div>

                    <div class="text-gray-600">Max</div>
                    <div class="font-semibold text-left">${max}</div>

                    <div class="text-gray-600">Volatile</div>
                    <div class="font-semibold text-left">${vol}</div>
                </div>
            </div>
        `;
            }
        }
    };
}

export default PePbChartOptions;
