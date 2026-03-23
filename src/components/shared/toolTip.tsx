import React, { useState } from "react";

const Tooltip = (props: {
  children: React.ReactNode;
  tooltipText: string;
  position: "top" | "right" | "bottom" | "left";
}) => {
  const [isTooltipVisible, setTooltipVisible] = useState(false);

  const { children, tooltipText } = props;

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isTooltipVisible && (
        <div
          className={`absolute z-10 w-48 rounded-md bg-gray-800 py-2 pl-4 text-white shadow-md`}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
