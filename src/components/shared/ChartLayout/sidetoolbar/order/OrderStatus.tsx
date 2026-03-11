import React from "react";

interface SaveCancelButtonProps {
  order: any;
}

const OrderStatus: React.FC<SaveCancelButtonProps> = ({ order }) => {
  const status = order?.status?.toUpperCase(); // Normalize to uppercase

  return (
    <span
      className={`uppercase ${
        status === "REJECTED"
          ? " text-red-400"
          : ["NOT_ACTIVE", "EXPIRED", "TRANSIT"].includes(status)
            ? " text-black"
            : ["PENDING", "OPEN"].includes(status)
              ? " text-blue-400"
              : status === "CANCELLED"
                ? "text-gray-400"
                : " text-z-green-500"
      } w-[5rem] text-left font-semibold`}
    >
      {status}
    </span>
  );
};

export default OrderStatus;
