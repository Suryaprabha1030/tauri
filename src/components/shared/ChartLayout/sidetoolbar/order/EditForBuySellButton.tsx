import { handleFieldChange } from "@/lib/util/sideToolBar/orders/handlingOrders";
import React, { Dispatch, SetStateAction } from "react";
interface EditForBuySellButtonProps {
  order: any;
  setEditedOrder: Dispatch<SetStateAction<any>>;
  editedOrder: any;
}

const EditForBuySellButton: React.FC<EditForBuySellButtonProps> = ({
  setEditedOrder,
  editedOrder,
  order,
}) => {
  return (
    <div
      className={`inline-flex h-5 w-5 items-center justify-center rounded-3xl text-[0.68rem] ${
        editedOrder.transaction_type === "LONG" ||
        editedOrder.transaction_type === "BUY"
          ? "bg-z-green-500"
          : "bg-red-500"
      }`}
      onClick={() =>
        handleFieldChange(
          "transaction_type",
          order.transaction_type === "LONG" || order.transaction_type === "BUY"
            ? "SHORT"
            : "LONG",
          setEditedOrder
        )
      }
    >
      <div className="font-medium text-white">
        {editedOrder.transaction_type === "LONG" ||
        editedOrder.transaction_type === "BUY"
          ? "B"
          : "S"}
      </div>
    </div>
  );
};

export default EditForBuySellButton;
