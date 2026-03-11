import React from "react";
interface OrderSymbolProps {
  order: any;
  leftWidth: any;
}

const OrderSymbol: React.FC<OrderSymbolProps> = ({ order, leftWidth }) => {
  return (
    <div className="flex w-full items-center justify-center text-left max-md:justify-start max-sm:gap-[0.3rem] sm:max-md:gap-[0.8rem] md:gap-2">
      <span
        className={`flex items-center justify-start text-left max-md:whitespace-normal max-md:break-words sm:max-md:px-2 ${leftWidth < 40 ? "2xl:whitespace-normal 2xl:break-words 2xl:text-center" : ""} xl:max-2xl:whitespace-normal xl:max-2xl:break-words xl:max-2xl:text-center`}
      >
        {order.display_symbol_name}
      </span>
      <span className="flex h-3 w-6  items-center justify-center rounded-sm  border border-gray-200 bg-blue-100 px-[0.3rem] py-[0.05rem] text-center text-[0.5rem] text-indigo-600 max-sm:hidden">
        {order.exchange}
      </span>
    </div>
  );
};

export default OrderSymbol;
