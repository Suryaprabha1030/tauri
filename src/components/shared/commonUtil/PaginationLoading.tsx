import React from "react";

const PaginationLoading = () => {
  return (
    <div className="flex items-center justify-center gap-2">
      <div className="h-2 w-2 animate-wave rounded-full bg-green-500 delay-0"></div>
      <div className="h-2 w-2 animate-wave rounded-full bg-green-500 delay-200"></div>
      <div className="h-2 w-2 animate-wave rounded-full bg-green-500 delay-400"></div>
      <div className=" h-2 w-2 animate-wave rounded-full bg-green-500 delay-600"></div>
    </div>
  );
};

export default PaginationLoading;
