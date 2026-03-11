"use client";
import TimeSelect from "./timeSelect";
import SelectIndice from "./selectIndice";
import Image from "next/image";
import SelectDate from "./selectDate";
import SelectExpiry from "./selectExpiry";
import { SimulationInput } from "@/lib/types";
import { useEffect, useState } from "react";

const SimulationDatePicker = (props: {
  updateTimeTravel: (input: SimulationInput) => void;
  initalSubmit: (input: SimulationInput) => void;
  reset: () => void;
  currentTime: string;
  inputSelected: boolean;
}) => {
  const [data, setData] = useState<SimulationInput>({
    indexName: "NIFTY",
    date: "2023-07-14",
    time: "09:15",
    expiry: "20JUL23",
    timeTravel: "",
  });

  const [disableButton, setDisableButton] = useState<boolean>(false);
  if (data.time.split(":")[0] == "9") {
    data.time = "09:" + data.time.split(":")[1];
  }
  if (data.time.split(":")[1] == "0") {
    data.time = data.time.split(":")[0] + ":00";
  }
  if (data.time.split(":")[0] == "09" && data.time.split(":")[1] < "15") {
    data.time = "09:15";
  }
  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      timeTravel: "",
    }));
  }, [props.inputSelected]);

  const updateTimeTravel = (timeTravel: string) => {
    const tempData = { ...data, timeTravel: timeTravel };
    setData(tempData);
    props.updateTimeTravel(tempData);
  };

  const selectSimulationInitalData = (event: any) => {
    event.preventDefault();
    props.initalSubmit(data);
  };

  return (
    <div className="flex w-full lg:w-[38rem] max-sm:flex-col sm:flex-col md:flex-col flex-col  gap-10  lg:mt-0">
      {/* flex w-full lg:w-3/4 max-sm:text-[0.5rem] lg:text-sm  flex-row items-center max-sm:justify-between lg:justify-center max-sm:gap-1 lg:gap-4 */}
      <div className="flex lg:w-[40rem]  w-full max-sm:text-[0.5rem] lg:text-[0.8rem] 2xl:text-[1rem]    flex-row items-center justify-center sm:justify-between md:justify-center lg:justify-center max-sm:gap-[0.2rem] sm:gap-[0.5rem] md:gap-[1.5rem] lg:gap-[1.5rem] ">
        <SelectIndice
          disabled={props.inputSelected}
          updateIndex={(input: string) =>
            setData((prevData) => ({
              ...prevData,
              indexName: input,
            }))
          }
        />
        <div className="flex w-[120px] flex-row ">
          <span className="rounded-t-lg">
            <SelectDate
              disabled={props.inputSelected}
              selectedDate={data.date}
              updateDate={(input: string) =>
                setData((prevData) => ({
                  ...prevData,
                  date: input,
                }))
              }
            />
          </span>
        </div>
        <div className="flex w-[120px] flex-row rounded-full ">
          <TimeSelect
            disabled={props.inputSelected}
            selectedTime={data.time}
            updateTime={(time: string) =>
              setData((prevData) => ({
                ...prevData,
                time,
              }))
            }
          />
        </div>
        <div className="flex w-[120px] flex-row rounded-full ">
          <SelectExpiry
            disabled={props.inputSelected}
            date={data.date}
            time={data.time}
            index={data.indexName}
            expiry={data.expiry}
            toggleButton={(value: boolean) => setDisableButton(value)}
            updateExpiry={(expiry: string) =>
              setData((prevData) => ({
                ...prevData,
                expiry,
              }))
            }
          />
        </div>

        {!props.inputSelected && (
          <button
            type="submit"
            className={`flex max-sm:h-[1.9rem] sm:h-[1.9rem] max-sm:w-[1.5rem] sm:w-[1.3rem] md:w-[5rem] lg:w-1/6  2xl:w-1/6  md:h-[2.5rem] h-10 lg:h-10   items-center justify-center rounded-3xl bg-z-green-500 max-sm:text-[0.5rem] md:text-[1rem] lg:text-base font-medium leading-none text-white ${
              disableButton ? "cursor-wait" : ""
            }`}
            onClick={selectSimulationInitalData}
            disabled={disableButton}
          >
            <Image src="/svg/play-button.svg" height={24} width={24} alt={""} />
          </button>
        )}
        {props.inputSelected && (
          <button
            type="submit"
            className={`flex max-sm:h-[1.49rem] max-sm:p-1 sm:h-[2rem] max-sm:w-[5.3rem] sm:w-[4.5rem] md:w-[5rem] lg:w-1/6  2xl:w-1/6 max-sm:h-[1.9rem] md:h-[2.5rem] h-10 lg:h-10   items-center justify-center rounded-3xl bg-z-green-500 max-sm:text-[0.5rem] sm:text-[0.85rem] md:text-[1rem] lg:text-base font-medium leading-none text-white ${
              disableButton ? "cursor-wait" : ""
            }`}
            onClick={(event: any) => props.reset()}
            disabled={disableButton}
          >
            Reset
          </button>
        )}
      </div>
      {props.inputSelected && (
        <div className="flex w-full max-sm:flex-col sm:flex-col   2xl:flex-row  items-center justify-center max-sm:gap-4 sm:gap-2 lg:gap-2 max-sm:mt-1 sm:mt-1  ">

          <div className="flex 2xl:w-full max-sm:flex-row sm:flex-row 2xl:flex-row gap-2 lg:px-0.5 max-sm:-mt-[1.5rem] sm:-mt-[1.5rem] 2xl:-mt-[2rem] 2xl:gap-[0.29rem] ">
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]   max-sm:px-1 sm:px-2 lg:px-2 2xl:w-[4.4rem] 2xl:h-[2rem] "
              onClick={() => updateTimeTravel("BOD")}
            >
              &lt;&lt;
              BOD{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]  max-sm:px-1 sm:px-2 lg:px-2"
              onClick={() => updateTimeTravel("-2h")}
            >
              {" "}
              -2h{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]  max-sm:px-1 sm:px-2 lg:px-2"
              onClick={() => updateTimeTravel("-1h")}
            >
              {" "}
              -1h{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]  max-sm:px-1 sm:px-2 lg:px-2"
              onClick={() => updateTimeTravel("-30m")}
            >
              {" "}
              -30m{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]  max-sm:px-1 sm:px-2 lg:px-2"
              onClick={() => updateTimeTravel("-15m")}
            >
              {" "}
              -15m{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem] max-sm:px-1 sm:px-2 lg:px-2"
              onClick={() => updateTimeTravel("-10m")}
            >
              {" "}
              -10m{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]  max-sm:px-1 sm:px-2 lg:px-2"
              onClick={() => updateTimeTravel("-5m")}
            >
              {" "}
              -5m{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]  max-sm:px-1 sm:px-2 lg:px-2"
              onClick={() => updateTimeTravel("-3m")}
            >
              {" "}
              -3m{" "}
            </button>
          </div>


          {props.currentTime && (
            <input
              type="text"
              name="timeTravel"
              value={props.currentTime.split("T").join(" ")}
              disabled
              className="inline-flex  rounded-md border-l-2 border-r-2 max-sm:text-[0.55rem]  sm:text-[0.78rem] md:text-[0.95rem] px-1 sm:p-1 indent-[6%] 2xl:-mt-[2rem] 2xl:w-[11rem]"
            />
          )}

          <div className="flex flex-row gap-2 2xl:-mt-[2rem] 2xl:gap-[0.29rem]">
            <button
              onClick={() => updateTimeTravel("3m")}
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem] max-sm:px-1 sm:px-2  lg:px-2"
            >
              +3m
            </button>
            <button
              onClick={() => updateTimeTravel("5m")}
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]  max-sm:px-1 sm:px-2 lg:px-2"
            >
              +5m
            </button>
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]  max-sm:px-1 sm:px-2 lg:px-2"
              onClick={() => updateTimeTravel("15m")}
            >
              {" "}
              +15m{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]  max-sm:px-1 sm:px-2 lg:px-2"
              onClick={() => updateTimeTravel("30m")}
            >
              {" "}
              +30m{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]  max-sm:px-1 sm:px-2 lg:px-2"
              onClick={() => updateTimeTravel("1h")}
            >
              {" "}
              +1h{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]  max-sm:px-1 sm:px-2 lg:px-2"
              onClick={() => updateTimeTravel("2h")}
            >
              {" "}
              +2h{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]  max-sm:px-1 sm:px-2 lg:px-2"
              onClick={() => updateTimeTravel("4h")}
            >
              {" "}
              +4h{" "}
            </button>
            <button
              className="rounded-full bg-z-green-300 max-sm:text-[0.55rem] sm:text-[0.78rem] md:text-[0.9rem]  max-sm:px-1 sm:px-2 lg:px-2 2xl:w-[4.4rem] 2xl:h-[2rem] "
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

export default SimulationDatePicker;
