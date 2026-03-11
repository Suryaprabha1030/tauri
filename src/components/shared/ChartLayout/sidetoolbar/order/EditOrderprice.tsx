import { handleFieldChange } from "@/lib/util/sideToolBar/orders/handlingOrders";
import React, { Dispatch, SetStateAction, useState } from "react";

interface EditOrderPriceProps {
  order: any;
  editOrderId: number;
  editedOrder: any;
  setEditedOrder: Dispatch<SetStateAction<any>>;
}

const EditOrderPrice: React.FC<EditOrderPriceProps> = ({
  editOrderId,
  order,
  editedOrder,
  setEditedOrder,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty string or numbers with at most one decimal point (e.g., "", "123", "123.45")
    if (
      value === "" ||
      (/^\d*\.?\d*$/.test(value) && (value.match(/\./g) || []).length <= 1)
    ) {
      // Pass empty string or numeric value to handleFieldChange
      const numericValue = value === "" ? "" : Number(value) || value;
      handleFieldChange("price", numericValue, setEditedOrder);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Optionally, if the field is empty on blur, you can reset it to order.price
    if (editedOrder.price === "") {
      handleFieldChange("price", order.price ?? "", setEditedOrder);
    }
  };

  return (
    <>
      {editOrderId === order.order_id && editedOrder.order_type === "LIMIT" ? (
        <div className="relative">
          <input
            type="text"
            value={
              isFocused || editedOrder.price !== ""
                ? (editedOrder.price ?? "")
                : (order.price ?? "")
            }
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className={`w-[3.5rem] rounded-lg border px-1 text-center max-sm:w-[2.5rem] max-sm:text-[0.6rem] md:max-xl:py-[0.15rem]`}
          />
        </div>
      ) : (
        <>{order?.price}</>
      )}
    </>
  );
};

export default EditOrderPrice;
