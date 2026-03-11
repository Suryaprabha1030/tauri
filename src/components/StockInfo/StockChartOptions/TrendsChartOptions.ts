import { ApexOptions } from "apexcharts";

const TrendsChartOptions = (isCrore: boolean): ApexOptions => {
    return {
        chart: {
            type: "line",
            height: 350,
            toolbar: { show: false },
            zoom: {
                enabled: false
            }
        },
        grid: { show: false },
        stroke: {
            curve: "straight",
            width: 2
        },
        fill: {
            type: "straight",
            opacity: 0
        },
        dataLabels: { enabled: false },
        colors: ["#4CA858"],
        markers: { size: 5 },
        xaxis: {
            type: "category",
            labels: {
                show: true,
                style: { fontSize: "10px" }
            }

        },
        yaxis: {
            labels: {
                show: false,  // Y values hidden
                style: { fontSize: "10px" },
            }
        },
        tooltip:
            isCrore ? {
                y: {
                    formatter: (value) => (value / 10000000)?.toFixed(2) + " Cr"
                }
            } : {
                y: {
                    formatter: (value) => value?.toFixed(2) + " %"
                }
            }
    };
}

export default TrendsChartOptions;