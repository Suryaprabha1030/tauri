import { ApexOptions } from "apexcharts";

const PeersChartOptions = (name: string[]):ApexOptions => {

    return{
        chart: {
                type: "bar",
                toolbar: { show: false },
                width: '100%',
                redrawOnParentResize: true
            },
    
            plotOptions: {
                bar: {
                    horizontal: false,       // vertical bars
                    columnWidth: "30%",
                },
            },
            grid: { show: false },
    
            xaxis: {
                categories: name,
                labels: {
                    rotate: 0,
                    trim: true,
                    hideOverlappingLabels: false,
                }
            },
    
            yaxis: {
                labels: {
                    formatter: (value: number) => value.toFixed(0)
                }
            },
    
            dataLabels: {
                enabled: false,
            },
    
            tooltip: {
                y: {
                    formatter: (val) => val === null ? "No Data" : `${val.toFixed(2)}`
                }
            },
    
            colors: [
                ({ value }) => value <= 0 ? "#FF4444" : "#4CA858"
            ]
        }
}

export default PeersChartOptions;