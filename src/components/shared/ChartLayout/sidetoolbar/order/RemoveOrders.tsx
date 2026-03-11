import { handleCancelOrder } from "@/lib/util/sideToolBar/orders/handlingOrders";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface RemoveOrdersProps {
  order: any;
  editOrderId: number;
  brokerCode: number | null;
  setEditOrderId: React.Dispatch<React.SetStateAction<any>>;
  setOrdersData: React.Dispatch<React.SetStateAction<any>>;
}

const RemoveOrders: React.FC<RemoveOrdersProps> = ({
  order,
  editOrderId,
  brokerCode,
  setEditOrderId,
  setOrdersData,
}) => {
  const router = useRouter();
  const [tooltipDisplay, setTooltipDisplay] = useState<boolean>(false);

  const canShowButton =
    (order.status.toUpperCase() === "PENDING" ||
      order.status.toUpperCase() === "OPEN") &&
    editOrderId !== order.order_id;

  return (
    <div className="relative h-full w-full">
      {canShowButton && (
        <div
          className="relative flex cursor-pointer rounded-lg hover:bg-gray-200 max-sm:h-[1.5rem] max-sm:w-[1.5rem] xl:h-6 xl:w-6 xl:p-[0.2rem]"
          onMouseEnter={() => setTooltipDisplay(true)}
          onMouseLeave={() => setTooltipDisplay(false)}
          onClick={() =>
            handleCancelOrder(
              order.order_id,
              order.variety,
              setEditOrderId,
              brokerCode,
              setOrdersData,
              router,
            )
          }
        >
          <img
            src="/svg/removeSymbol.svg"
            height={20}
            width={20}
            alt="Remove"
            className="md:max-xl:h-[1.5rem] md:max-xl:w-[1.5rem] "
          />
          {tooltipDisplay && (
            <span className="absolute -left-16 top-8 z-[1001] mt-1 rounded bg-gray-800 px-2 py-1 text-[0.65rem] text-white max-xl:hidden">
              Cancel Order
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default RemoveOrders;
