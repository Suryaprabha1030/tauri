import React, { useState } from "react";
import GroupHeader from "./StrategyGroupHeader";
import StrategyRow from "./StrategyRow";
import ExpandedRowDetails from "./ExpandedRowDetails";
import { calculateLegsCount } from "@/lib/util/StrategyAnalyzerUtil/StrategyAnalyerUtil";

interface strategyTableBodyProps {
  response: any;
  filteredStrategies: Record<string, any>;

  strategyApiData: (strategy: string) => void;
  setStrategyLots: React.Dispatch<React.SetStateAction<any>>;
  strategyLots: any;

  expandedRow: any;
  setSelectedStrategy: React.Dispatch<React.SetStateAction<any>>;
  setExpandedRow: React.Dispatch<React.SetStateAction<any>>;
  brokerCode: any;
  expiry: any;
  allStrategyData: any;
  leftWidth: any;
}

const StrategyTableBody: React.FC<strategyTableBodyProps> = ({
  response,
  filteredStrategies,

  strategyApiData,
  strategyLots,
  setSelectedStrategy,
  expandedRow,
  setExpandedRow,
  setStrategyLots,
  brokerCode,
  expiry,
  allStrategyData,
  leftWidth,
}) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const strategiesByGroup: Record<string, string[]> = {};
  Object.keys(filteredStrategies).forEach((strategy) => {
    const direction = response[strategy].strategy_direction.toLowerCase();
    if (!strategiesByGroup[direction]) {
      strategiesByGroup[direction] = [];
    }
    strategiesByGroup[direction].push(strategy);
  });
  return (
    <tbody className="w-[100%] font-table">
      {response &&
        filteredStrategies &&
        Object.keys(filteredStrategies).map((strategy) => {
          const {
            max_profit,
            max_loss,
            strategy_direction,
            legs,
            margin,
            max_profit_percent,
            max_loss_percent,
          } = response[strategy];
          const legCount = calculateLegsCount(legs);
          const isExpanded = expandedRow === strategy;

          // Determine if the group has changed
          const directionLower = (strategy_direction as string).toLowerCase();
          const groupStrategies = strategiesByGroup[directionLower] || [];
          const isLastInGroup =
            groupStrategies[groupStrategies.length - 1] === strategy;
          return (
            <React.Fragment key={strategy}>
              {groupStrategies[0] === strategy && (
                <GroupHeader strategyDirection={strategy_direction} />
              )}
              <StrategyRow
                strategy={strategy}
                maxProfit={max_profit}
                maxLoss={max_loss}
                margin={margin}
                legCount={legCount}
                isExpanded={isExpanded}
                hoveredRow={hoveredRow}
                strategyLots={strategyLots[strategy] || 1}
                setHoveredRow={setHoveredRow}
                strategyApiData={strategyApiData}
                response={response}
                setStrategyLots={setStrategyLots}
                setExpandedRow={setExpandedRow}
                setSelectedStrategy={setSelectedStrategy}
                maxProfitPercent={
                  typeof max_profit === "number"
                    ? max_profit_percent
                    : undefined
                }
                maxLossPercent={
                  typeof max_loss === "number" ? max_loss_percent : undefined
                }
                isLastInGroup={isLastInGroup}
                expiry={expiry}
                brokerCode={brokerCode}
                allStrategyData={allStrategyData}
                leftWidth={leftWidth}
              />
              {isExpanded && (
                <ExpandedRowDetails
                  legs={legs}
                  strategyLots={strategyLots[strategy] || 1}
                />
              )}
            </React.Fragment>
          );
        })}
    </tbody>
  );
};

export default StrategyTableBody;
