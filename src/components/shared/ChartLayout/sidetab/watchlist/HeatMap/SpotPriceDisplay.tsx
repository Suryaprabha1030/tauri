import { RootState } from "@/lib/redux/Store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DisplayIncreDecrease from "../../../DisplayIncreDecrease/DisplayIncreDecrease";
import { getBrokerCode } from "@/components/helpers";
import config from "@/lib/config";

const HeatMapHeader = ({ indexName }) => {
  const indexObjData: any = useSelector(
    (state: RootState) => state.strategy.indexObj
  );
  const oiIndexData: any = useSelector(
    (state: RootState) => state.OI.OiIndexData
  );
  const path = window.location.pathname;
  const brokerCode = getBrokerCode();
  const [value, setValue] = useState<{
    identifier: any;
  }>();
  const netpercentage: any = useSelector(
    (state: RootState) => state.strategy.netChangepercent
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );

  useEffect(() => {
    if (path === `${config.brokersListUrl}/${brokerCode}/psb`) {
      setValue(indexObjData);
    } else if (path === `${config.brokersListUrl}/${brokerCode}/oi`) {
      setValue(oiIndexData[indexName]);
    }
  }, [path, indexName]);

  return (
    <div
      className="flex w-full flex-row justify-between "
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      <div
        className={`flex flex-row items-center gap-1 text-[0.75rem] font-medium ${
          netpercentage[value?.identifier] != undefined &&
          netpercentage[value?.identifier] < 0
            ? "text-red-400"
            : netpercentage[value?.identifier] != undefined &&
                netpercentage[value?.identifier] > 0
              ? "text-z-green-500"
              : "text-gray-500"
        }`}
      >
        <span>{webSocketDataRead[value?.identifier]}</span>
        <span className=" text-[0.65rem]">
          ({netpercentage[value?.identifier]?.toFixed(2)}%)
        </span>
        <DisplayIncreDecrease value={netpercentage[value?.identifier]} />
      </div>
    </div>
  );
};

export default HeatMapHeader;
