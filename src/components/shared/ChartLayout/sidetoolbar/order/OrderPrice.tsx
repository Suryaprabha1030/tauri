import { handleFieldChange } from "@/lib/util/sideToolBar/orders/handlingOrders";
import React, { Dispatch, SetStateAction } from "react";
interface OrderPriceProps {
  order: any;
  editOrderId: number;
  editedOrder: any;
  setEditedOrder: Dispatch<SetStateAction<any>>;
}

const OrderPrice: React.FC<OrderPriceProps> = ({
  editOrderId,
  order,
  editedOrder,
  setEditedOrder,
}) => {
  return (
    <>
      {editOrderId === order.order_id && editedOrder.order_type === "LIMIT" ? (
        <input
          type="text"
          value={editedOrder.price || 0}
          onChange={(e) => {
            const value = e.target.value;
            const numericValue = value === "" ? 0 : parseFloat(value);
            handleFieldChange("price", numericValue, setEditedOrder);
          }}
          className="w-[3rem] rounded rounded-3xl border px-1 text-xs"
        />
      ) : (
        <span>{order.price}</span>
      )}
    </>
  );
};

export default OrderPrice;
