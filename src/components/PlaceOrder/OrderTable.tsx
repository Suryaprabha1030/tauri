import React from "react";

import StockRow from "./StockRow";

interface OrderTableProps {
  stockData: any;
  selectedOrderTypes: Map<number, string>;
  handleUpdateStock: (identifier: string, field: string, value: any) => void;
  handleRadioButtonChange: (identifier: string, value: string) => void;
  handleDelete: (identifier: any) => void;
}

const OrderTable: React.FC<OrderTableProps> = ({
  stockData,
  selectedOrderTypes,
  handleUpdateStock,
  handleRadioButtonChange,
  handleDelete,
}) => {
  return (
    <div className="relative  h-full w-full transition-opacity duration-500 ease-in-out">
      {stockData && stockData.length > 0 && (
        <div className="flex h-full w-full flex-col items-center justify-start gap-2">
          <div className="w-full overflow-y-scroll max-xl:scrollbar-none max-sm:max-h-[17rem] sm:max-md:max-h-[18rem] md:max-h-[17rem] xl:scrollbar-thin">
            <table className="w-full border-2 border-z-blue-100 text-center text-[0.55rem] text-black shadow-lg">
              <thead className="sticky -top-1 z-[11] bg-gray-50 uppercase text-black max-md:text-[0.58rem] md:text-[0.68rem]">
                <tr className="h-7 border-b text-gray-400 md:max-xl:h-10">
                  <th className="px-1 py-[0.1rem] font-tableHead max-lg:hidden">
                    Symbol
                  </th>
                  <th className="px-1 py-[0.1rem]  font-tableHead lg:hidden">
                    Symbols info
                  </th>
                  <th className="px-1 py-[0.1rem] font-tableHead md:max-lg:w-[5rem]">
                    Order
                  </th>
                  <th className="px-1 py-[0.1rem] font-tableHead md:max-lg:w-[7rem]">
                    Product
                  </th>
                  <th className="px-1 py-[0.1rem] font-tableHead md:max-lg:w-[4rem]">
                    Qty
                  </th>

                  <th className="px-1 py-[0.1rem] font-tableHead md:max-lg:w-[7rem]">
                    LTP
                  </th>
                  <th className="px-1 py-[0.1rem] font-tableHead max-md:hidden md:max-lg:w-[3rem]">
                    B/S
                  </th>

                  <th className="px-1 py-[0.1rem] font-tableHead md:max-lg:w-[3rem]"></th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((stock: any, index: any) => (
                  <React.Fragment key={stock?.identifier}>
                    <StockRow
                      stock={stock}
                      index={index}
                      selectedOrderTypes={selectedOrderTypes}
                      handleUpdateStock={handleUpdateStock}
                      handleRadioButtonChange={handleRadioButtonChange}
                      handleDelete={handleDelete}
                    />
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
