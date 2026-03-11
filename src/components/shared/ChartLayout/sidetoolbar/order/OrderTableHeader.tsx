import React from "react";
interface TableHeader {
  leftWidth: any;
}
const TableHeader: React.FC<TableHeader> = ({ leftWidth }) => {
  return (
    <thead className="sticky bg-gray-50 max-xl:top-[-5px] max-xl:z-[10] xl:-top-2 xl:z-[10]">
      <tr className="text-gray-400">
        {leftWidth > 40 && (
          <th className=" w-[5rem] px-2 py-3 text-xs font-tableHead uppercase tracking-wider max-xl:hidden">
            Order ID
          </th>
        )}
        <th className="py-3 font-tableHead uppercase tracking-wider max-sm:w-[6rem] max-sm:px-1.5 max-sm:text-left max-sm:text-[0.65rem] sm:text-xs sm:max-md:px-2 sm:max-md:text-left md:max-xl:w-[12rem] md:max-xl:py-[1rem] xl:w-[10rem] xl:px-2">
          Symbol
        </th>

        {leftWidth >= 80 && (
          <th className="py-3 font-tableHead uppercase tracking-wider max-md:w-[2.5rem] max-md:px-1 max-sm:text-[0.65rem] sm:text-xs md:w-[3rem] md:max-xl:py-[1rem] xl:px-2">
            Order
          </th>
        )}

        {leftWidth >= 80 && (
          <>
            <th className="w-[3rem] py-3 font-tableHead uppercase tracking-wider max-md:px-1.5  max-sm:text-[0.65rem] sm:text-xs md:max-xl:py-[1rem] xl:px-2">
              PRODUCT
            </th>
          </>
        )}
        <th className="w-[4rem] py-3 font-tableHead uppercase tracking-wider max-md:px-1.5 max-sm:text-[0.65rem] sm:text-xs md:max-xl:w-[7rem] md:max-xl:py-[1rem] xl:px-2">
          Qty
        </th>
        {leftWidth >= 40 && (
          <th className="w-[4rem] py-3 font-tableHead uppercase tracking-wider max-md:px-1.5  max-sm:text-[0.65rem] sm:text-xs md:max-xl:w-[7rem] md:max-xl:py-[1rem] xl:px-2">
            Avg
          </th>
        )}
        {leftWidth >= 40 && (
          <th className="w-[4rem] py-3 font-tableHead uppercase tracking-wider max-md:px-1.5 max-sm:text-[0.65rem] sm:text-xs md:max-xl:w-[7rem] md:max-xl:py-[1rem] xl:px-2">
            Price
          </th>
        )}

        <th className="w-[3rem] py-3 font-tableHead uppercase tracking-wider max-xl:w-[8rem] max-md:px-0.5 max-sm:text-[0.65rem] sm:text-xs md:max-xl:py-[1rem] xl:px-2">
          B/S
        </th>
        <th className="py-3 font-tableHead uppercase tracking-wider max-md:px-1 max-sm:text-[0.65rem] sm:text-left sm:text-xs sm:max-md:w-[5rem] sm:max-md:px-2 md:max-xl:w-[12rem] md:max-xl:py-[1rem] xl:w-[8rem] xl:px-2">
          Status
        </th>
      </tr>
    </thead>
  );
};

export default TableHeader;
