import { useEffect, useState } from "react";
// generate hour options
const generateHourOptions = () => {
  const options: any = [];
  for (let hour = 9; hour < 16; hour++) {
    const formattedHour = hour.toString().padStart(2, "0");
    options.push(formattedHour);
  }
  return options;
};

// generate minute options
const generateMinuteOptions = (hour: number) => {
  const options: any = [];
  let minute = hour == 9 ? 15 : 0;
  for (; minute < 60; minute += 1) {
    if (hour == 15 && minute > 30) break;
    const formattedMinute = minute.toString().padStart(2, "0");
    options.push(formattedMinute);
  }
  return options;
};

const TimeSelect = (props: {
  selectedTime?: string;
  disabled?: boolean;
  updateTime: (time: string) => void;
}) => {
  const [time, setTime] = useState({
    hour: props.selectedTime ? parseInt(props.selectedTime?.split(":")[0]) : 9,
    minute: props.selectedTime
      ? parseInt(props.selectedTime?.split(":")[1])
      : 15,
  });

  useEffect(() => {
    if (props.selectedTime) {
      const [hour, minute] = props.selectedTime.split(":");
      setTime((prevTime) => ({
        ...prevTime,
        hour: parseInt(hour),
        minute: parseInt(minute),
      }));
    }
  }, [props.selectedTime]);

  const handleHourChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTime((prevTime) => ({
      ...prevTime,
      hour: parseInt(event.target.value),
    }));
    props.updateTime(`${event.target.value}:${time.minute}`);
  };

  const handleMinChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTime((prevTime) => ({
      ...prevTime,
      minute: parseInt(event.target.value),
    }));
    props.updateTime(`${time.hour}:${event.target.value}`);
  };

  return (
    <div className="flex flex-row  rounded-lg max-sm:gap-1 sm:gap-[0.3rem]   md:gap-2">
      <select
        defaultValue={time.hour}
        onChange={handleHourChange}
        className="h-10 rounded-lg border text-black max-sm:h-8  max-sm:w-[2.6rem] max-sm:px-[0.2rem]  max-sm:py-2 sm:w-[3.5rem] sm:px-1 sm:py-2 md:w-[4rem] md:p-2 lg:p-2 "
        disabled={props.disabled || false}
      >
        {generateHourOptions().map((timeOption) => (
          <option key={timeOption} value={timeOption}>
            {timeOption}
          </option>
        ))}
      </select>

      <select
        defaultValue={time.minute}
        onChange={handleMinChange}
        className="h-10 rounded-lg border max-sm:h-8  max-sm:w-[2.6rem] max-sm:px-[0.2rem]  max-sm:py-2 sm:w-[3rem]  sm:px-1 sm:px-1 sm:py-2 md:w-[4rem] md:p-2 lg:p-2 "
        disabled={props.disabled || false}
      >
        {generateMinuteOptions(time.hour).map((timeOption) => (
          <option key={timeOption} value={timeOption}>
            {timeOption}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimeSelect;
