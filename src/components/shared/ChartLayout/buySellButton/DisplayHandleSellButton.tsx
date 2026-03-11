import React from "react";
interface DisplayHandleSellButtonProps {
  type: any;
  handleChange?: any;
  id?: string;
  addTouchAction?: any;
  handleDoubleClick?: any;
}
const DisplayHandleSellButton: React.FC<DisplayHandleSellButtonProps> = ({
  type,
  handleChange,
  id,
  addTouchAction,
  handleDoubleClick,
}) => {
  return (
    <div
      className={`inline-flex h-5 w-7 items-center justify-center rounded-md  ${
        handleChange ? "cursor-pointer" : ""
      } ${
        type === "SHORT" || type === "SELL" ? "bg-red-500" : "bg-z-green-500"
      }`}
      onClick={handleChange ? handleChange : undefined}
      onTouchStart={
        addTouchAction ? (handleChange ? handleChange : undefined) : undefined
      }
      onDoubleClick={handleDoubleClick ? handleDoubleClick : undefined}
    >
      <div
        className="class-for-touch-event flex  h-5 w-7 items-center justify-center text-center text-[0.75rem] font-medium text-white"
        id={id || undefined}
      >
        {type === "SHORT" || type === "SELL" ? "S" : "B"}
      </div>
    </div>
  );
};

export default DisplayHandleSellButton;
