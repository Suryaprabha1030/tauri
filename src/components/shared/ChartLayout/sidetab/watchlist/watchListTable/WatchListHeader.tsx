import { RootState } from "@/lib/redux/Store";
import { sortData } from "@/lib/util/watchlist/heatMapHandle";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
interface WatchListHeaderProps {
  columns: any;
  sortConfig: any;
  symbols: any;
  provided: any;
  setSortConfig: any;
  setSymbols: any;
  leftWidth: any;
}

const WatchListHeader: React.FC<WatchListHeaderProps> = ({
  columns,
  sortConfig,
  symbols,
  provided,
  setSortConfig,
  setSymbols,
  leftWidth,
}) => {
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );

  const netchange: any = useSelector(
    (state: RootState) => state.strategy.netChange
  );
  const netpercentage = useSelector(
    (state: RootState) => state.strategy.netChangepercent
  );
  return (
    <thead
      {...provided.droppableProps}
      ref={provided.innerRef}
      className=" sticky -top-1 z-[20] w-full bg-gray-100 text-[0.7rem] uppercase text-gray-700"
    >
      <tr className=" xl:border-l-4 xl:border-z-gray-300 ">
        {columns.map((column: any, index: any) => (
          <Draggable key={column.id} draggableId={column.id} index={index}>
            {(provided: any) => (
              <th
                scope="col"
                className={` ${leftWidth < 40 && column.id === "chgPercent" ? "xl:hidden" : ""} max-sm:px-[0.4rem] max-sm:py-[1rem] sm:max-md:px-[0.8rem] sm:max-md:py-2 md:max-xl:py-[1rem] md:max-lg:pl-[1rem] lg:max-xl:pl-[2rem] xl:pl-2 xl:max-2xl:py-2 2xl:py-3 ${
                  column.id === "symbol"
                    ? `w-[53%] font-tableHead text-z-gray-300 xl:pl-[0.7rem] ${leftWidth < 40 ? "xl:max-2xl:w-[50%]" : "xl:max-2xl:w-[40%]"}`
                    : column.id === "chg"
                      ? ` font-tableHead text-z-gray-300 xl:pl-[1rem] ${leftWidth < 40 ? "w-[24%] xl:max-2xl:w-[25%]" : "w-[14%] xl:max-2xl:w-[20%]"} `
                      : column.id === "price"
                        ? `${leftWidth < 40 ? "w-[24%]  xl:max-2xl:w-[25%]" : "w-[19%]  xl:max-2xl:w-[20%]"} font-tableHead text-z-gray-300 xl:pl-[0.7rem]`
                        : "w-[14%] font-tableHead text-z-gray-300 xl:pl-[1rem] xl:max-2xl:w-[20%]"

                  // column.id === "symbol" ? "" : "w-[5rem]"
                } text-left`}
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                onClick={() =>
                  sortData(
                    column.id,
                    sortConfig,
                    symbols,
                    setSortConfig,
                    setSymbols,
                    webSocketDataRead,
                    netchange,
                    netpercentage
                  )
                }
              >
                {column.title}
                {sortConfig.key === column.id && (
                  <span
                    className={`${
                      sortConfig.direction === "ascending"
                        ? "text-green-500"
                        : "text-red-400"
                    }`}
                  >
                    {sortConfig.direction === "ascending" ? "↑" : "↓"}
                  </span>
                )}
              </th>
            )}
          </Draggable>
        ))}
        {provided.placeholder}
      </tr>
    </thead>
  );
};

export default WatchListHeader;
