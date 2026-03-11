import Image from "next/image";
import React, { useState } from "react";

interface EditOrderProps {
  order: any;
  editOrderId: number;
  handleEditClick: (index: any) => void;
}

const EditOrder: React.FC<EditOrderProps> = ({
  order,
  editOrderId,
  handleEditClick,
}) => {
  const [tooltipDisplay, setTooltipDisplay] = useState<boolean>(false);

  return (
    <div className="relative h-full w-full">
      {(order.status.toUpperCase() === "PENDING" ||
        order.status.toUpperCase() === "OPEN") &&
      editOrderId !== order.order_id ? (
        <div
          className="relative flex cursor-pointer rounded-full hover:bg-gray-200 max-sm:h-[1.5rem] max-sm:w-[1.5rem] xl:h-6 xl:w-6 xl:p-[0.2rem]"
          onMouseEnter={() => setTooltipDisplay(true)}
          onMouseLeave={() => setTooltipDisplay(false)}
          onClick={() => handleEditClick(order)}
        >
          <Image
            src="/svg/editNote.svg"
            width={20}
            height={20}
            alt="EDIT"
            className="md:max-xl:h-[1.4rem] md:max-xl:w-[1.4rem] "
          />
          {tooltipDisplay && (
            <span className="absolute -left-5 top-8 z-[1001] mt-1 w-[5rem] rounded bg-gray-800 px-2 py-1 text-[0.65rem] text-white max-xl:hidden">
              Edit Order
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default EditOrder;
