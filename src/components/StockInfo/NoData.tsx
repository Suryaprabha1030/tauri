import React from "react";

export default function NoData({ data }) {
  return (
    <div className="flex h-full w-full items-center justify-center text-[0.85rem] text-gray-500 max-md:text-[0.75rem]">
      No {data} Data Available
    </div>
  );
}
