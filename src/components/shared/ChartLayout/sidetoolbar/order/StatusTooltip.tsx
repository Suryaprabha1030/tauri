import React from "react";

interface StatusTooltipProps {
  index: number;
  activeTooltip: any;
  handleTooltipToggle: (index: any, event: any) => void;
  order: any;
  tooltipRef: any;
  tooltipIconRef: any;
}

const StatusTooltip: React.FC<StatusTooltipProps> = ({
  order,
  activeTooltip,
  index,
  handleTooltipToggle,
  tooltipRef,
  tooltipIconRef,
}) => {
  return (
    <span className="relative w-10">
      {order.status !== "completed" && order?.description?.trim().length > 0 ? (
        <img
          ref={tooltipIconRef}
          src="/svg/tooltip.svg"
          width={16}
          height={16}
          alt=""
          onClick={(event: any) => handleTooltipToggle(index, event)}
          className="cursor-pointer max-xl:h-[0.9rem] max-xl:w-[0.9rem]"
        />
      ) : (
        <span className="w-50"></span>
      )}
      {order?.description && activeTooltip === index && (
        <div
          ref={tooltipRef}
          className="absolute z-50 rounded-md bg-gray-700 text-white shadow-lg max-xl:right-[0.5rem] max-md:top-5 max-md:max-h-96 max-md:p-1 max-sm:w-[20rem] sm:max-md:w-[32rem] md:mt-2 md:p-2 md:max-xl:top-5 md:max-xl:max-h-[5rem] md:max-lg:w-[42rem] lg:max-xl:w-[50rem] xl:right-5  xl:top-3 "
        >
          <span className="text-[0.65rem] max-xl:h-full max-xl:w-full max-xl:whitespace-normal max-xl:break-words max-md:text-[0.55rem] xl:h-[5rem] xl:w-[10rem]">
            {order.description}
          </span>
        </div>
      )}
    </span>
  );
};

export default StatusTooltip;
