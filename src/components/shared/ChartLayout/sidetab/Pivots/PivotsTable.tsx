import React, { useEffect, useState } from "react";

interface Levels {
  P: number;
  S1?: number;
  S2?: number;
  S3?: number;
  R1?: number;
  R2?: number;
  R3?: number;
}

interface PivotsTableProps {
  pivots: { [key: string]: any };
  ltp: any;
  chg: any;
}

const PivotTable: React.FC<PivotsTableProps> = ({ pivots, ltp, chg }) => {
  const levels: (keyof Levels)[] = ["R3", "R2", "R1", "P", "S1", "S2", "S3"];

  const [majorityRow, setMajorityRow] = useState<string | null>(null);
  const getLevelRange = (
    level1: number | undefined,
    level2: number | undefined
  ) => {
    if (level1 !== undefined && level2 !== undefined) {
      return Math.abs(level1 - level2);
    }
    return 0;
  };

  const getRowContainingLTP = () => {
    if (ltp === null) return null;

    const result: { [key: string]: string | null } = {};

    pivots &&
      pivots.pivot_points &&
      Object.keys(pivots.pivot_points).forEach((method: any) => {
        const pivot: any = pivots.pivot_points[method];
        let maxRangeRow: string | null = null;
        let maxRange = -Infinity;

        for (let i = 0; i < levels.length - 1; i++) {
          const currentLevelValue = pivot[levels[i] as keyof Levels];
          const nextLevelValue = pivot[levels[i + 1] as keyof Levels];

          if (
            currentLevelValue !== undefined &&
            nextLevelValue !== undefined &&
            ((ltp >= currentLevelValue && ltp <= nextLevelValue) ||
              (ltp <= currentLevelValue && ltp >= nextLevelValue))
          ) {
            const range = getLevelRange(currentLevelValue, nextLevelValue);
            if (range > maxRange) {
              maxRange = range;
              maxRangeRow = levels[i];
            }
          }
        }

        result[method] = maxRangeRow;
      });

    return result;
  };

  useEffect(() => {
    // Update majorityRow only when pivots changes
    const rowContainingLTP = getRowContainingLTP();
    if (rowContainingLTP) {
      const rowCounts: { [level: string]: number } = {};
      // Populate rowCounts with occurrences of each level
      Object.values(rowContainingLTP).forEach((level) => {
        if (level) rowCounts[level] = (rowCounts[level] || 0) + 1;
      });
      // Only calculate maxOccurringRow if rowCounts has entries
      let maxOccurringRow: any = null;
      if (Object.keys(rowCounts).length > 0) {
        maxOccurringRow = Object.entries(rowCounts).reduce(
          (max, [level, count]) => (count > max[1] ? [level, count] : max),
          ["", -Infinity]
        )[0];
      }
      // Fallback in case maxOccurringRow is null or undefined
      setMajorityRow(maxOccurringRow || "P"); // default level P
    }
  }, [pivots]); // Only recalculates when pivots change

  const filteredMethods =
    pivots && pivots.pivot_points
      ? Object.keys(pivots.pivot_points).filter(
          (method) => method !== "DeMark" && method !== "Woodie"
        )
      : [];

  return (
    <div className="p-4 text-[0.75rem]">
      <table className="w-full border-collapse overflow-x-scroll  ">
        <thead>
          <tr className="text-z-gray-300">
            <th className="border-b border-gray-300 p-2 text-left font-tableHead">
              Pivot
            </th>
            {pivots &&
              pivots.pivot_points &&
              filteredMethods &&
              filteredMethods.map((method) => (
                <th
                  key={method}
                  className=" border-b border-gray-300  p-2 text-center font-tableHead"
                >
                  {method}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {levels.map((level) => (
            <React.Fragment key={level}>
              <tr className="text-black">
                <td
                  className={`p-2 font-table ${
                    majorityRow === level || level === levels[levels.length - 1]
                      ? ""
                      : "border-b border-gray-300"
                  }`}
                >
                  {level}
                </td>
                {pivots &&
                  pivots.pivot_points &&
                  filteredMethods &&
                  filteredMethods.map((method, index) => {
                    const pivot = pivots.pivot_points[method];
                    const isMajorityRow = majorityRow === level;

                    return (
                      <td
                        key={index}
                        className={`p-2 text-center font-table ${
                          isMajorityRow || level === levels[levels.length - 1]
                            ? ""
                            : "border-b border-gray-300"
                        }`}
                      >
                        {pivot[level as keyof Levels] !== undefined
                          ? Number(pivot[level as keyof Levels]).toLocaleString(
                              undefined,
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )
                          : "-"}
                      </td>
                    );
                  })}
              </tr>
              {majorityRow === level && (
                <tr>
                  <td
                    colSpan={Object.keys(pivots.pivot_points).length + 1}
                    className="p-2"
                  >
                    <div className="flex items-center">
                      <div className="flex-grow border-t-2 border-gray-300"></div>
                      <div
                        className={`px-2 font-table ${
                          chg && chg > 0
                            ? "text-z-green-500"
                            : chg < 0
                              ? "text-red-400"
                              : "text-gray-500"
                        }`}
                      >
                        {ltp || 0} ({(chg && chg?.toFixed(2)) || 0}%)
                      </div>
                      <div className="flex-grow border-t-2 border-gray-300"></div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PivotTable;
