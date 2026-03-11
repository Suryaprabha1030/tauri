import { handleFieldChange } from "@/lib/util/sideToolBar/orders/handlingOrders";
import React, { Dispatch, SetStateAction } from "react";
interface SelectOrderTypeForLtpProps {
  order: any;
  editOrderId: number;
  editedOrder: any;
  setEditedOrder: Dispatch<SetStateAction<any>>;
}

const SelectOrderTypeForLtp: React.FC<SelectOrderTypeForLtpProps> = ({
  editOrderId,
  order,
  editedOrder,
  setEditedOrder,
}) => {
  return (
    <>
      {editOrderId === order.order_id ? (
        <select
          value={editedOrder.order_type}
          onChange={(e) =>
            handleFieldChange("order_type", e.target.value, setEditedOrder)
          }
          className="rounded rounded-lg border border-gray-300 px-1 text-center max-sm:w-[3rem] max-sm:text-[0.55rem] md:max-xl:py-[0.15rem]"
        >
          <option value="MARKET">MKT</option>
          <option value="LIMIT">LIMIT</option>
        </select>
      ) : (
        <span>
          {order.order_type === "MARKET" && "MKT"}
          {order.order_type === "LIMIT" && "LIMIT"}
          {order.order_type === "STOPLOSS_LIMIT" && "SL"}
          {order.order_type === "STOPLOSS_MARKET" && "SL-M"}
        </span>
      )}
    </>
  );
};

export default SelectOrderTypeForLtp;
