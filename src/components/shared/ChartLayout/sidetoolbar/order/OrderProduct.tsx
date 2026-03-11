import React from "react";

interface OrderProductProps {
  order: any;
}

const OrderProduct: React.FC<OrderProductProps> = ({ order }) => {
  const productMap: Record<string, string> = {
    DELIVERY: "CNC",
    CARRYFORWARD: "NRML",
    MARGIN: "MARGIN",
    INTRADAY: "INTRADAY",
    BO: "BO",
  };

  return <span>{productMap[order.product] || order.product}</span>;
};

export default OrderProduct;
