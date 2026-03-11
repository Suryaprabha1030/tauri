import React from "react";
interface OrderBuySellButtonProps {
  order: any;
}

const OrderBuySellButton: React.FC<OrderBuySellButtonProps> = ({ order }) => {
  return (
    <span
      className={` font-medium max-sm:text-[0.65rem] ${
        order.transaction_type === "LONG" || order.transaction_type === "BUY"
          ? "text-z-green-500"
          : "text-red-500"
      }`}
    >
      {order.transaction_type === "LONG" || order.transaction_type === "BUY"
        ? "BUY"
        : "SELL"}
    </span>
  );
};

export default OrderBuySellButton;
