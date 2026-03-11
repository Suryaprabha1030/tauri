"use client";
import SelectDate from "@/components/shared/filter/selectDate";
import SelectExpiry from "@/components/shared/filter/selectExpiry";
import SelectIndice from "@/components/shared/filter/selectIndice";
import TimeSelect from "@/components/shared/filter/timeSelect";
import config from "@/lib/config";
import { SimulationInput } from "@/lib/types";
import Image from "next/image";
import { useEffect, useState } from "react";

const DatePicker = (props: {
  journeyTime: string;
  getOptionChain: (input: SimulationInput) => void;
  updateSelectionToParent: (input: SimulationInput) => void;
  journeyStarted: boolean;
  onTimeTravelUpdated: (input: SimulationInput) => void;
  resetState: () => void;
  showImportStrategyModal: () => void;
}) => {
  const [data, setData] = useState<SimulationInput>(config.defaultInput);

  const [state, setState] = useState({
    showTimeTravel: false,
    disableButton: false,
  });

  if (data.time.split(":")[1] == "0") {
    data.time = data.time.split(":")[0] + ":00";
  }
  if (data.time.split(":")[0] == "9") {
    data.time = "09:" + data.time.split(":")[1];
  }
  if (data.time.split(":")[0] == "09" && data.time.split(":")[1] < "15") {
    data.time = "09:15";
  }

  useEffect(() => {
    props.updateSelectionToParent(data);
  }, [data]);

  const updateTimeTravel = (timeTravel: string) => {
    const tempData = { ...data, timeTravel: timeTravel };
    setData(tempData);
    props.onTimeTravelUpdated(tempData);
  };

  const handleDatePickerSelection = (event: any) => {
    event.preventDefault();
    props.getOptionChain(data);
  };

  const resetSimulator = (event: any) => {
    event.preventDefault();
    props.resetState();
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex w-3/4 flex-row items-center justify-center gap-4">
        {/* Import Strategy */}

        {!props.journeyStarted && (
          <button
            type="submit"
            className="flex h-10 w-[20%] items-center justify-center gap-2 rounded-3xl bg-z-green-500 text-base font-medium leading-none text-white focus:ring focus:ring-z-green-300 focus:ring-offset-z-green-100"
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

        <SelectIndice
          updateIndex={(input: string) =>
            setData((prevData) => ({
              ...prevData,
              indexName: input,
            }))
          }
          disabled={props.journeyStarted}
        />

        <div className="flex w-[120px] flex-row">
          <SelectDate
            selectedDate={data.date}
            updateDate={(input: string) =>
              setData((prevData) => ({
                ...prevData,
                date: input,
              }))
            }
            disabled={props.journeyStarted}
          />
        </div>
        <TimeSelect
          selectedTime={data.time}
          updateTime={(time: string) =>
            setData((prevData) => ({
              ...prevData,
              time,
            }))
          }
          disabled={props.journeyStarted}
        />

        <SelectExpiry
          date={data.date}
          time={data.time}
          index={data.indexName}
          expiry={data.expiry}
          toggleButton={(value: boolean) =>
            setState({ ...state, disableButton: value })
          }
          updateExpiry={(expiry: string) =>
            setData((prevData) => ({
              ...prevData,
              expiry,
            }))
          }
          disabled={props.journeyStarted}
        />

        {/* if showTime Travel false show Load Option Button */}
        {/* else show Reset Button */}
        {!props.journeyStarted && (
          <button
            type="submit"
            className={`flex h-10 w-1/6 items-center justify-center rounded-3xl bg-z-green-500 text-base font-medium leading-none text-white ${
              state.disableButton ? "cursor-wait" : ""
            }`}
            onClick={handleDatePickerSelection}
            disabled={state.disableButton}
          >
            Load Option Chain
          </button>
        )}
        {props.journeyStarted && (
          <button
            className={`flex h-10 w-1/6 items-center justify-center rounded-3xl bg-z-green-500 text-base font-medium leading-none text-white ${
              state.disableButton ? "cursor-wait" : ""
            }`}
            onClick={resetSimulator}
          >
            Reset
          </button>
        )}
      </div>
      {props.journeyStarted && (
        <div className="flex w-full flex-row items-center justify-center gap-4">
          <div className="flex flex-row gap-4">
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("BOD")}
            >
              {" << "}
              BOD{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("-2h")}
            >
              {" "}
              -2h{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("-1h")}
            >
              {" "}
              -1h{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("-30m")}
            >
              {" "}
              -30m{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("-15m")}
            >
              {" "}
              -15m{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("-10m")}
            >
              {" "}
              -10m{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("-5m")}
            >
              {" "}
              -5m{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("-3m")}
            >
              {" "}
              -3m{" "}
            </button>
          </div>

          {props.journeyTime && (
            <input
              type="text"
              name="timeTravel"
              value={props.journeyTime.split("T").join(" ")}
              disabled
              className="inline-flex rounded-md border-l-2 border-r-2 p-1 indent-[6%]"
            />
          )}

          <div className="flex flex-row gap-4">
            <button
              onClick={() => updateTimeTravel("3m")}
              className="rounded-full bg-z-green-300 px-2"
            >
              +3m
            </button>
            <button
              onClick={() => updateTimeTravel("5m")}
              className="rounded-full bg-z-green-300 px-2"
            >
              +5m
            </button>
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("15m")}
            >
              {" "}
              +15m{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("30m")}
            >
              {" "}
              30m{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("1h")}
            >
              {" "}
              +1h{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("2h")}
            >
              {" "}
              +2h{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("4h")}
            >
              {" "}
              +4h{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 px-2"
              onClick={() => updateTimeTravel("EOD")}
            >
              {" "}
              EOD{" >> "}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
