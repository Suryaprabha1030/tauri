"use client";

import React from "react";

interface DataTableProps {
  header: string;
  data: Record<string, string | number>; // Object with key-value pairs
}

const DataTable: React.FC<DataTableProps> = ({ header, data }) => {
  return (
    <div className="p-2 text-[0.75rem] ">
      <h2 className="mb-2  text-[0.9rem] font-semibold max-md:text-[0.8rem]">
        {header}
      </h2>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value], index) => (
          <div
            key={index}
            className={`${index % 2 == 0 ? "bg-white" : 'bg-gray-100'} flex justify-between rounded-md bg-gray-100 px-2`}
          >
            <span>{key}</span>
            <span className=" font-medium ">{String(value)}</span>{" "}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataTable;
