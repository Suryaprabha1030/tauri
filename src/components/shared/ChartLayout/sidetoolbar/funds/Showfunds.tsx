import React from "react";

const Showfunds = ({ heading, data }: any) => {
  return (
    <span className="flex h-20 w-[80%] flex-row items-center justify-center rounded-lg  bg-white text-[0.75rem] shadow-strong-top md:max-2xl:text-standard 2xl:text-global">
      <span className="h-full w-[0.2rem] bg-z-green-400"></span>
      <span className="flex h-full w-full flex-col items-center justify-center  ">
        <span className="flex h-full w-full items-center justify-center font-table text-z-gray-300">
          {" "}
          {heading}
        </span>
        <span className="flex h-full w-[40%] items-center justify-center text-[0.8rem] lg:max-2xl:text-[1.15rem] 2xl:text-[1.25rem]">
          {data}
        </span>
      </span>
    </span>
  );
};

export default Showfunds;
