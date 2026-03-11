"use client";

import { BackTestingInput, StopLossInput } from "@/lib/types";
import { useEffect, useState } from "react";
import SelectIndice from "@/components/shared/filter/selectIndice";
import DateRange from "@/components/shared/filter/selecDateRange";
import SelectDays from "@/components/shared/filter/selectedDaysPicker";
import TimeSelect from "@/components/shared/filter/timeSelect";
import StopLoss from "@/components/shared/filter/stopLoss";
import TargetSelect from "@/components/shared/filter/TargetSelect";

const DatePicker = (props: {
  updateData: (input: BackTestingInput) => void;
  journeyStarted: boolean;
  resetState: () => void;
  showImportStrategyModal: () => void;
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

  useEffect(() => {
    // whenever data changes update parent
    props.updateData(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const resetBackTesting = (event: any) => {
    event.preventDefault();
    props.resetState();
  };

  return (
    <div className="flex w-full flex-row items-center justify-center">
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-row items-center justify-center gap-4">
          <SelectIndice
            updateIndex={(input: string) =>
              setData((prevData) => ({
                ...prevData,
                indexName: input,
              }))
            }
          />
          <div className="flex w-[30%] flex-row">
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
          <div className="flex flex-row items-center gap-2">
            <SelectDays updateSelectedDays={updateSelectedDays} />
          </div>
          <div className="flex flex-row items-center gap-2 text-sm font-medium">
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
          <div className="flex flex-row items-center gap-2 text-sm font-medium">
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
        <div className="flex w-full flex-row items-center justify-center gap-4">
          {!props.journeyStarted && (
            <button
              type="submit"
              className="flex h-10 items-center justify-center gap-2 rounded-3xl bg-z-green-500 px-4 text-base font-medium leading-none text-white "
              onClick={props.showImportStrategyModal}
            >
              <Image
                src="/svg/whitePlus.svg"
                width={25}
                height={25}
                alt="Import Strategy"
              />
              Import Strategy
            </button>
          )}
          <div className="flex flex-row items-center gap-2">
            <label className="text-sm font-medium text-gray-900">
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
          {props.journeyStarted && (
            <button
              type="submit"
              className="flex h-10 items-center justify-center gap-2 rounded-3xl bg-z-green-500 px-4 text-base font-medium leading-none text-white"
              onClick={resetBackTesting}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DatePicker;
