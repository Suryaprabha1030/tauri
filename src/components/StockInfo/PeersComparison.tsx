import { useState } from "react";
import { chartTable } from "@/lib/util/toggleButtonName/toggleButtonNames";
import ToggleButton from "../shared/ChartLayout/ToggleButton/ToggleButton";
import PeersTable from "./PeersTable";
import PeersChart from "./PeersChart";

const PeersComparison = ({ peersData }: any) => {
    const [activePeerSection, setActivePeerSection] = useState('table')
    const handleSectionChange = (section: any) => {
        setActivePeerSection(section)
    }
    return (
        <>
            {Object.entries(peersData)?.length > 0 ?
                <>

                    <div className=" flex flex-row justify-between">
                        <h1 className="font-semibold text-lg max-md:text-sm p-1">Peers</h1>
                        <ToggleButton
                            buttons={chartTable}
                            LiveButton={activePeerSection}
                            onButtonClick={handleSectionChange}
                            space={"text-[0.75rem] px-2 max-sm:px-1 max-sm:text-[0.65rem]"}
                        />
                    </div>

                    {activePeerSection === 'table' && <PeersTable data={peersData} />}
                    {activePeerSection === 'chart' && <PeersChart data={peersData} />}
                </>
                :
                <>
                    <h1 className="font-semibold text-lg max-md:text-sm p-1">Peers</h1>
                    <span className="flex max-sm:text-sm w-full h-[250px] items-center justify-center text-lg text-gray-400">No Peers Data Available </span>
                </>
            }
        </>
    )
}

export default PeersComparison;