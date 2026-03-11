import {
  alphabeticalSort,
  numericalSort,
} from "@/lib/util/sideToolBar/orders/OrderUtil";
import React, { useEffect, useRef, useState } from "react";
import TechnicalSection from "./TableDataSection";
import PivotTable from "../Pivots/PivotsTable";

interface Technical {
  name: string;
  value: any;
  action: string;
}

interface TechnicalsTableProps {
  Oscillatordata: Technical[];
  MAdata: Technical[];
  oscillator: any;
  movingAverage: any;
  scrollToMA?: boolean;
}

const TechnicalsTable: React.FC<TechnicalsTableProps> = ({
  Oscillatordata,
  MAdata,
  oscillator,
  movingAverage,
  scrollToMA,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  }>({
    key: "name",
    direction: "ascending",
  });

  // Merge the two data sets
  const mergedData = [
    ...Oscillatordata.map((data) => ({ ...data, type: "Oscillator" })),
    ...MAdata.map((data) => ({ ...data, type: "MA" })),
  ];

  const sortedData = React.useMemo(() => {
    return alphabeticalSort(mergedData, sortConfig.key, sortConfig.direction);
  }, [mergedData, sortConfig]);

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const maRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollToMA == true && maRef.current) {
      maRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [scrollToMA]);

  return (
    <div className="w-full text-[0.75rem]">
      <div className="h-[90%] w-full overflow-y-auto scrollbar-thin">
        <TechnicalSection
          data={sortedData.filter((data) => data.type === "Oscillator")}
          title="Oscillators"
          indicatorValues={oscillator}
        />
        <div ref={maRef} className=" w-full">
          <TechnicalSection
            data={sortedData.filter((data) => data.type === "MA")}
            title="Moving Averages"
            indicatorValues={movingAverage}
          />
        </div>
      </div>
    </div>
  );
};

export default TechnicalsTable;
