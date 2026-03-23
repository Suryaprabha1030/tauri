import { handleFieldChange } from "@/lib/util/sideToolBar/orders/handlingOrders";
import React, { Dispatch, SetStateAction, useEffect } from "react";

interface EditOrderLotsProps {
  order: any;
  editOrderId: number;
  editedOrder: any;
  setEditedOrder: Dispatch<SetStateAction<any>>;
}

const EditOrderLots: React.FC<EditOrderLotsProps> = ({
  editOrderId,
  order,
  editedOrder,
  setEditedOrder,
}) => {
  const initialQty = order.quantity / order.lots; // Calculate the base quantity
  // Set initial quantity when edit mode is activated
  useEffect(() => {
    if (editOrderId === order.order_id && editedOrder.qty === undefined) {
      setEditedOrder((prev: any) => ({ ...prev, qty: order.quantity }));
    }
  }, [
    editOrderId,
    order.order_id,
    order.quantity,
    editedOrder.qty,
    setEditedOrder,
  ]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number(e.target.value);

    if (value % initialQty === 0) {
      handleFieldChange("qty", value, setEditedOrder);
    }
  };

  return (
    <>
      {editOrderId === order.order_id ? (
        <div className="relative">
          <input
            type="number"
            value={editedOrder.qty ?? order.quantity} // Ensure value is not empty
            onChange={handleQuantityChange}
            step={initialQty} // Enforce increments of initialQty
            min={initialQty} // Ensure minimum value is at least initialQty
            className={`w-[3.5rem] rounded-lg border px-1 text-center max-sm:w-[2.5rem] max-sm:text-[0.6rem] md:max-xl:py-[0.15rem]
              `}
          />
        </div>
      ) : (
        <>{order.quantity}</>
      )}
    </>
  );
};

export default EditOrderLots;
