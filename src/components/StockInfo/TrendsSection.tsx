'use client'
import { useSelector } from "react-redux";
import TrendsChart from "./TrendsChart";
import { RootState } from "@/lib/redux/Store";

const TrendsSection = ({ trendsData }:any) => {
    const dropdownValues = useSelector((state: RootState) => state.common.selectedChart)
    return (
        <>
             <h1 className="font-semibold p-1 text-lg max-sm:text-sm">Trends</h1>
             
             {/* Mobile Section */}
            {trendsData && Object.keys(trendsData)?.length > 0 ?
                <>
                    <div className="w-full max-sm:flex flex-row justify-center hidden">
                        <TrendsChart data={trendsData} initial={0} dropdown={[]} />
                    </div>
                </>
                :
                <span className="max-sm:flex hidden h-[250px] justify-center items-center text-sm text-gray-400">No Trends Chart Data Available</span>
            }

            {/* Other than mobile section */}
            {trendsData && Object.keys(trendsData)?.length > 0 ?
                <div className="w-full flex flex-row justify-between max-sm:hidden bg-white">
                    <TrendsChart data={trendsData} initial={0} dropdown={dropdownValues} />
                    <TrendsChart data={trendsData} initial={1} dropdown={dropdownValues} />
                    <TrendsChart data={trendsData} initial={2} dropdown={dropdownValues} />
                </div>
                :
                <span className="flex max-sm:hidden h-[250px] items-center justify-center text-lg text-gray-400">No Trends Chart Data Available</span>
            }
        </>
    )
}

export default TrendsSection;