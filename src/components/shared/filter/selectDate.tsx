import config from "@/lib/config";
import React, { useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";

const SelectDate = (props: {
  selectedDate: string;
  disabled?: boolean;
  updateDate: (input: string) => void;
}) => {
  const [value, setValue] = useState({
    startDate: new Date(props.selectedDate),
    endDate: new Date(props.selectedDate),
  });

  const handleValueChange = (newValue: any) => {
    setValue(newValue);
    props.updateDate(newValue.startDate);
  };

  return (
    <Datepicker
      asSingle={true}
      value={value}
      useRange={false}
      onChange={handleValueChange}
      primaryColor="green"
      popoverDirection="down"
      toggleIcon={() => <></>}
      inputClassName={
        "bg-white max-sm:w-[4.2rem] sm:w-[6.5rem] lg:w-[6rem] xl:w-[7.2rem] lg:px-2  max-sm:h-8 h-10  border py-2 lg:py-[0.4rem] border-black-300 focus:border-tertiary text-center outline-none  rounded-lg text-black "
      }
      disabled={props.disabled || false}
      minDate={new Date(config.dateRange.min)}
      maxDate={new Date(config.dateRange.max)}
      startFrom={new Date(config.dateRange.min)}
    />
  );
};

export default SelectDate;
