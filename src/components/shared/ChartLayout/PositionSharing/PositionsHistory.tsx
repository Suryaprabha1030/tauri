import React, { Dispatch, useState } from "react";

interface PositionHistoryProps {
  setHistoryClicked: () => void;
}
const PositionHistory: React.FC<PositionHistoryProps> = ({
  setHistoryClicked,
}) => {
  const handleSharePositions = () => {
    setHistoryClicked(); // Trigger the parent's API call logic
  };
  return (
    <div
      className=" flex w-[3rem] cursor-pointer items-center justify-center rounded-lg  text-[0.75rem] font-medium text-z-green-500 hover:text-[0.8rem]"
      onClick={handleSharePositions}
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      History
    </div>
  );
};

export default PositionHistory;
