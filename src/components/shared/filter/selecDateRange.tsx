import config from "@/lib/config";
import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

const DateRange = (props: {
  updateDate: (startDate: string, endDate: string) => void;
}) => {
  const [value, setValue] = useState({
    startDate: new Date("2023-07-03"),
    endDate: new Date("2023-07-05"),
  });

  const handleValueChange = (newValue: any) => {
    props.updateDate(newValue.startDate, newValue.endDate);
    setValue(newValue);
  };

  return (
    <Datepicker
      value={value}
      onChange={handleValueChange}
      primaryColor="green"
      popoverDirection="down"
      toggleIcon={() => <></>}
      inputClassName={
        "bg-white border max-sm:px-3 p-[0.5px] py-2 xl:p-3 xl:py-2 max-sm:text-[0.65rem] sm:text-[0.8rem]  md:text-[0.9rem] max-sm:mt-[0.15rem] sm:mt-1 xl:mt-0 xl:text-[0.75rem]  2xl:text-sm border-gray-300 focus:border-tertiary outline-none w-full"
      }
      minDate={new Date(config.backtestingDateRange.min)}
      maxDate={new Date(config.backtestingDateRange.max)}
      startFrom={new Date(config.backtestingDateRange.min)}
    />
  );
};

export default DateRange;
