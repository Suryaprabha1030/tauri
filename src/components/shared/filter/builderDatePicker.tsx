"use client";
import { Label } from "recharts";
import TimeSelect from "./timeSelect";
import DateRange from "./selecDateRange";
import SelectIndice from "./selectIndice";
import Image from "next/image";
import SelectDate from "./selectDate";
import SelectExpiry from "./selectExpiry";
import { StrategyBuilderInput } from "@/lib/types";
import { useState } from "react";

const BuilerDatePicker = (props: {
  submit: (input: StrategyBuilderInput) => void;
}) => {
  const [data, setData] = useState<StrategyBuilderInput>({
    indexName: "NIFTY",
    date: "2023-07-14",
    time: "09:15",
    expiry: "20JUL23",
  });

  const [disableButton, setDisableButton] = useState<boolean>(false);

  const refreshStrategyData = () => {
    props.submit(data);
  };

  if (data.time.split(":")[0] == "9") {
    data.time = "09:" + data.time.split(":")[1];
  }
  if (data.time.split(":")[0] == "09" && data.time.split(":")[1] < "15") {
    data.time = "09:15";
  }
  return (
    <div className="flex  w-full lg:w-[38rem] max-sm:flex-col sm:flex-col md:flex-col lg:flex-row   gap-0 sm:mt-15 md:mt-16 lg:mt-10 xl:mt-0  max-sm:w-full  ">
    
       <div className="flex flex-row items-center justify-between lg:w-[38rem] max-sm:text-[0.5rem] lg:text-[0.8rem] 2xl:text-[1rem]    sm:gap-[1rem]  lg:gap-4 max-sm:gap-[0.2rem] max-sm:justify-center">
      
         <SelectIndice
           updateIndex={(input: string) =>
             setData((prevData) => ({  
               ...prevData,
               indexName: input,
             }))
           }
         />
         <SelectDate
         
           selectedDate={data.date}
           updateDate={(input: string) =>
             setData((prevData) => ({
               ...prevData,
               date: input,
             }))
           }
         />
         <TimeSelect
           selectedTime={data.time}
           updateTime={(time: string) =>
             setData((prevData) => ({
               ...prevData,
               time,
             }))
           }
         />
         <SelectExpiry
           date={data.date}
           time={data.time}
           index={data.indexName}
           expiry={data.expiry}
           toggleButton={(value: boolean) => {
             setDisableButton(value);
           }}
           updateExpiry={(expiry: string) =>
             setData((prevData) => ({
               ...prevData,
               expiry,
             }))
           }
         />
         <button
           type="submit"
 
           className={`
           flex max-sm:h-[1.9rem] sm:h-[2rem] max-sm:w-[2.6rem] sm:w-[6rem]  max-lg:w-1/6 xl:w-[10rem] 2xl:w-[12rem] max-sm:h-[1.9rem] md:h-[2.5rem] h-10 lg:h-10 2xl:px-2   items-center justify-center rounded-3xl bg-z-green-500 max-sm:text-[0.5rem] md:text-[1rem] lg:text-base font-medium leading-none text-white  ${
             disableButton ? "cursor-wait" : ""
          
           }`}
           onClick={refreshStrategyData}
           disabled={disableButton}
         >
           <Image src="/svg/play-button.svg" height={24} width={24} alt={""} />
         </button>
       </div>
     </div>
  );
};

export default BuilerDatePicker;
