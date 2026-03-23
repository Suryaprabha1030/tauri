import React from "react";
import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import PePbChartOptions from "./StockChartOptions/PePbChartOptions";
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


const PePbChart = React.memo(({ data }: any) => {
    const chartData = data?.chart_data

    // Below code is to name 12 months, without any replication
    let monthLabels: any = [];
    let lastMonth = -1;

    if (chartData) {
        for (let item of chartData) {
            const d = new Date(item?.date);
            const m = d.getMonth();

            if (m !== lastMonth) {
                monthLabels.push(m);
                lastMonth = m;
            }
        }
    }

    const categories = monthLabels?.map((m:any) => monthNames[m]);

    const series = [
        {
            name: "PE Ratio",
            data: chartData?.map((item:any) => ({
                x: new Date(item?.date).getTime(),   // datetime
                y: item?.PE_Ratio                 // value
            })) ?? []
        },
        {
            name: "PB Ratio",
            data: chartData?.map((item:any) => ({
                x: new Date(item?.date).getTime(),   // datetime
                y: item?.PB_Ratio                 // value
            })) ?? []
        }
    ];
    const options: ApexOptions = PePbChartOptions({ chartData, data, categories })

    return (
        <>
            {Object.entries(data)?.length > 0 ?
                <div>
                    <h1 className="font-semibold p-1 text-lg max-md:text-sm">PE/PB History</h1>
                    <div className="relative w-full h-[400px]">
                        <div className="absolute left-0 w-full">
                            <div className="w-full flex justify-center">
                                <div className="flex flex-row">
                                    <div className="flex items-center gap-1 px-1">
                                        <span className="h-3 w-3 rounded-sm bg-[#FA52F4]"></span>
                                        <span className={`font-label text-sm max-sm:text-[10px]`}>PE Ratio</span>
                                    </div>
                                    <div className="flex items-center gap-1 px-1">
                                        <span className="h-3 w-3 rounded-sm bg-[#52AEFA]"></span>
                                        <span className={`font-label text-sm max-sm:text-[10px]`}>PB Ratio</span>
                                    </div>
                                </div>
                            </div>
                            <Chart
                                options={options}
                                series={series}
                                type="area"
                                height={350}
                                width="100%"
                            />
                        </div>
                    </div>
                </div>
                :
                <>
                    <h1 className="font-semibold p-1 text-lg max-md:text-sm">PE/PB History</h1>
                    <span className="flex max-sm:text-sm w-full h-[250px] items-center justify-center text-lg text-gray-400">No PE/PB Available </span>
                </>
            }
        </>
    )
})
PePbChart.displayName = 'PePbChart'
export default PePbChart
