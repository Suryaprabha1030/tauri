"use client";
import TimeSelect from "./timeSelect";
import DateRange from "./selecDateRange";
import SelectIndice from "./selectIndice";

import { BackTestingInput, StopLossInput } from "@/lib/types";
import { useState } from "react";
import StopLoss from "./stopLoss";
import SelectDays from "./selectedDaysPicker";
import TargetSelect from "./TargetSelect";

const BackTestingDatePicker = (props: {
  submit: (input: BackTestingInput) => void;
}) => {
  const min = -1;
  const max = 100;

  const [data, setData] = useState<BackTestingInput>({
    indexName: "NIFTY",
    startDate: "2023-07-03",
    endDate: "2023-07-05",
    entryTime: "09:15",
    exitTime: "13:00",
    target: -1,
    stopLoss: -1,
    trailingStopLoss: -1,
    selectedDays: 0, // set to undefined when all days are selected
  });

  const startBackTesting = () => {
    props.submit(data);
  };

  const updateStopLoss = (input: StopLossInput) => {
    if (input.type == "stopLoss") setData({ ...data, stopLoss: input.value });
    else
      setData({
        ...data,
        trailingStopLoss: input.value,
      });
  };

  const updateSelectedDays = (input: number) => {
    setData({
      ...data,
      selectedDays: input,
    });
  };

  return (
    <div className="flex w-full  flex-col gap-3  ">
      <div className="flex w-full  max-sm:flex-col sm:flex-col xl:flex-row items-center justify-center gap-4 ">
        <div className="flex flex-row max-sm:gap-[0.4rem] gap-4 ">
          <SelectIndice
            updateIndex={(input: string) =>
              setData((prevData) => ({
                ...prevData,
                indexName: input,
              }))
            }
          />

          <div className="flex flex-row max-sm:w-[10rem] sm:w-[10.6rem] md:w-[12rem] xl:w-[11rem] 2xl:w-[13rem] xl:mt-[0.3rem]">
            <DateRange
              updateDate={(startDate: string, endDate: string) =>
                setData((prevData) => ({
                  ...prevData,
                  startDate,
                  endDate,
                }))
              }
            />
          </div>
          <div className="flex flex-row max-sm:text-[0.62rem] sm:text-[0.8rem] md:text-[0.9rem] xl:text-[0.8rem]  2xl:text-sm  items-center gap-2">
            <SelectDays updateSelectedDays={updateSelectedDays} />
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 max-sm:text-[0.62rem] sm:text-[0.8rem]  md:text-[0.9rem]  xl:text-[0.75rem]  2xl:text-sm font-medium">
          <label>Entry Time</label>
          <TimeSelect
            selectedTime={data.entryTime}
            updateTime={(entryTime: string) =>
              setData((prevData) => ({
                ...prevData,
                entryTime,
              }))
            }
          />
        </div>
        <div className="flex flex-row items-center gap-2 max-sm:text-[0.62rem] sm:text-[0.8rem]  md:text-[0.9rem]  xl:text-[0.75rem]  2xl:text-sm font-medium">
          <label>Exit Time</label>
          <TimeSelect
            selectedTime={data.exitTime}
            updateTime={(exitTime: string) =>
              setData((prevData) => ({
                ...prevData,
                exitTime,
              }))
            }
          />
        </div>
      </div>

      <div className="flex w-full flex-row items-center justify-center max-sm:gap-[0.4rem] gap-4">
        <div className="flex flex-row items-center max-sm:gap-[0.25rem] gap-2">
          <label className="max-sm:text-[0.62rem] sm:text-[0.8rem]  md:text-[0.9rem]  xl:text-[0.75rem]  2xl:text-sm font-medium text-gray-900">
            Target(%) / leg
          </label>
          <TargetSelect
            updateTarget={(input: number) =>
              setData((prevData) => ({
                ...prevData,
                target: input,
              }))
            }
          />
        </div>
        <div className="flex flex-row items-center gap-2">
          <StopLoss updateStopLoss={updateStopLoss} />
        </div>

        <button
          type="submit"
          className="flex max-sm:h-7 max-sm:w-[1rem] px-[0.09rem] sm:h-8 sm:w-10 xl:h-10 xl:w-10 items-center justify-center rounded-3xl bg-z-green-500 text-base font-medium leading-none text-white"
          onClick={startBackTesting}
        >
          <Image src="/svg/play-button.svg" height={24} width={24} alt={""} />
        </button>
      </div>
    </div>
  );
};

export default BackTestingDatePicker;
