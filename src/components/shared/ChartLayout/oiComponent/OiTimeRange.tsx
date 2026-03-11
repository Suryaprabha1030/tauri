import React, {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useRef,
} from "react";
import ReactSlider from "react-slider";
import { payloadConvertDecimalToTime } from "./OIUtil";
import config from "@/lib/config";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";

interface OiTimeRangeProps {
  setFromOiTime: Dispatch<SetStateAction<string>>;
  setToOiTime: Dispatch<SetStateAction<string>>;
  manageTimeRange: boolean;
}

const OiTimeRange: React.FC<OiTimeRangeProps> = ({
  setFromOiTime,
  setToOiTime,
  manageTimeRange,
}) => {
  const startTimeInMinutes = 225; // 9:15 AM in minutes (9.25 hours)
  const endTimeInMinutes = 599; // 3:30 PM in minutes (15.5 hours)
  const isMarketHoliday = useSelector(
    (state: RootState) => state.MarketBasis.isMarketHoliday
  );
  const getCurrentTimeInMinutes = () => {
    const now = new Date();

    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const timeInMinutes = hours * 60 + minutes;
    if (config.isTradingSliderTime() && !isMarketHoliday) {
      if (timeInMinutes >= endTimeInMinutes) {
        return Math.min(hours * 60 + minutes, endTimeInMinutes);
      } else {
        return Math.min(hours * 60 + minutes, endTimeInMinutes) - 1;
      }
    } else {
      return endTimeInMinutes;
    }
  };

  const [currentTime, setCurrentTime] = useState<number>(
    getCurrentTimeInMinutes()
  );
  const [sliderValue, setSliderValue] = useState<[number, number]>([
    startTimeInMinutes,
    currentTime,
  ]);
  const [activeThumbIndex, setActiveThumbIndex] = useState<number | null>(null);
  const [activeButton, setActiveButton] = useState<string>("");
  const isInitialRender = useRef(true);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getUTCHours();
      const minutes = now.getUTCMinutes();
      const timeInMinutes = hours * 60 + minutes;
      if (config.isTradingSliderTime() && !isMarketHoliday) {
        // ✅ Market hours — keep your original behavior
        if (timeInMinutes >= endTimeInMinutes) {
          setCurrentTime(Math.min(timeInMinutes, endTimeInMinutes));
        } else {
          setCurrentTime(Math.min(timeInMinutes, endTimeInMinutes) - 1);
        }
      } else {
        setCurrentTime(Math.min(timeInMinutes, endTimeInMinutes) - 1);
        // setSliderValue([
        //   startTimeInMinutes,
        //   Math.min(timeInMinutes, endTimeInMinutes) - 1,
        // ]);
        // 💤 Non-market hours — freeze at endTime (3:30 PM)
        setCurrentTime(endTimeInMinutes);
        setFromOiTime(payloadConvertDecimalToTime(startTimeInMinutes / 60));
        setToOiTime(payloadConvertDecimalToTime(endTimeInMinutes / 60));
        setSliderValue([startTimeInMinutes, endTimeInMinutes]);
      }

      // if (timeInMinutes >= endTimeInMinutes) {
      //   setCurrentTime(Math.min(timeInMinutes, endTimeInMinutes));
      //   // setSliderValue([
      //   //   startTimeInMinutes,
      //   //   Math.min(timeInMinutes, endTimeInMinutes),
      //   // ]);
      // } else {
      //   setCurrentTime(Math.min(timeInMinutes, endTimeInMinutes) - 1);
      //   // setSliderValue([
      //   //   startTimeInMinutes,
      //   //   Math.min(timeInMinutes, endTimeInMinutes) - 1,
      //   // ]);
      // }
    };
    updateCurrentTime();
    const now = new Date();
    const delayUntilNextMinute = (60 - now.getSeconds()) * 1000; // Convert to ms

    // Wait until the next full minute, then start interval
    const timeoutId = setTimeout(() => {
      updateCurrentTime(); // Call exactly at the next full minute
      const intervalId = setInterval(updateCurrentTime, 60000); // Calls every minute
      return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, delayUntilNextMinute);
  }, []);

  const handleSliderChange = (values: [number, number]) => {
    const updatedUpperValue = Math.min(values[1], currentTime);
    setSliderValue([values[0], updatedUpperValue]); // Update slider value
  };
  const getLocalTimeFromUTCMinutes = (utcMinutes) => {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset(); // Offset in minutes
    const localMinutes = utcMinutes - timezoneOffset;

    const hours = Math.floor(localMinutes / 60) % 24;
    const minutes = localMinutes % 60;
    const period = hours >= 12 ? "PM" : "AM";

    const formattedHours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const formattedMinutes = minutes.toString().padStart(2, "0"); // Ensure two digits

    return `${formattedHours}:${formattedMinutes} ${period}`;
  };

  const buttons = [
    { label: "Last 5 mins", minutes: 5 },
    { label: "Last 10 mins", minutes: 10 },
    { label: "Last 15 mins", minutes: 15 },
    { label: "Last 30 mins", minutes: 30 },
    { label: "Last 1 Hr", minutes: 60 },
    { label: "Last 2 Hrs", minutes: 120 },
    { label: "Last 3 Hrs", minutes: 180 },
    { label: "Full Day", minutes: 0 },
  ];

  const Thumb = (props: any, state: any) => {
    const isActive = state.index === activeThumbIndex;

    return (
      <div
        {...props}
        className={`hover:bg-z-green-600 relative -mt-2 flex h-4 w-4 cursor-pointer 
        items-center justify-center rounded-full border-2 border-green-500 bg-z-green-500
        transition-all duration-150   hover:border-white`}
        onMouseEnter={() => setActiveThumbIndex(state.index)}
        onMouseLeave={() => setActiveThumbIndex(null)}
      >
        {isActive && (
          <div className="w-18 absolute bottom-[1.5rem] left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded bg-blue-500 px-2 text-xs text-white">
            {getLocalTimeFromUTCMinutes(state.valueNow)}
          </div>
        )}
      </div>
    );
  };

  const Track = (props: any, state: { index: number }) => (
    <div
      {...props}
      className={`h-[0.2rem] rounded-full ${
        state.index === 1 ? "bg-z-green-500" : "bg-gray-200"
      }`} // Adjust track colors
    />
  );

  const handleButtonClick = (minutes: number, buttonLabel: string) => {
    if (buttonLabel === "Full Day") {
      setSliderValue([startTimeInMinutes, currentTime]);
      setFromOiTime(payloadConvertDecimalToTime(startTimeInMinutes / 60)); // Convert to decimal for the payload
      setToOiTime(payloadConvertDecimalToTime(currentTime / 60));
      setActiveButton(buttonLabel);
    } else {
      const now = new Date();
      let timeInMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

      // Ensure timeInMinutes doesn't go past endTime

      timeInMinutes = Math.min(currentTime, endTimeInMinutes);

      // Set the full range first
      setSliderValue([startTimeInMinutes, timeInMinutes]);

      // Now adjust the start time based on the selected duration
      const adjustedTime = timeInMinutes - minutes;

      // Ensure new start time doesn't go below startTime
      const newStartTime = Math.max(adjustedTime, startTimeInMinutes);

      // Finally, update the slider range
      setSliderValue([newStartTime, timeInMinutes]);
      setFromOiTime(payloadConvertDecimalToTime(newStartTime / 60)); // Convert to decimal for the payload
      setToOiTime(payloadConvertDecimalToTime(timeInMinutes / 60));
      setActiveButton(buttonLabel);
    }
  };

  useEffect(() => {
    setFromOiTime(payloadConvertDecimalToTime(sliderValue[0] / 60)); // Convert to decimal for the payload
    setToOiTime(payloadConvertDecimalToTime(sliderValue[1] / 60)); // Convert to decimal for the payload
  }, []);

  useEffect(() => {
    setActiveButton("Full Day");
  }, []);

  return (
    <div
      className={`relative w-full text-[0.75rem] xl:max-2xl:text-[0.7rem] ${
        manageTimeRange
          ? "max-sm:mt-[3.8rem] sm:max-md:mt-[5.8rem] md:max-lg:mt-[3.5rem] lg:max-xl:mt-[3.5rem]"
          : "max-sm:mt-[1.5rem] sm:max-md:mt-[2rem] md:max-lg:mt-[1rem] lg:max-xl:mt-[2.5rem] "
      } xl:mt-8 xl:pl-[6.5rem]`}
    >
      <ReactSlider
        className="relative h-2 max-xl:mx-[10%] max-xl:w-[80%] xl:w-full"
        thumbClassName="absolute"
        trackClassName="flex w-full h-2"
        min={startTimeInMinutes}
        max={currentTime} // Set maximum thumb value
        value={sliderValue}
        onChange={handleSliderChange} // Update immediately on change
        onAfterChange={(values: [number, number]) => {
          setSliderValue(values);

          setFromOiTime(payloadConvertDecimalToTime(values[0] / 60));
          setToOiTime(payloadConvertDecimalToTime(values[1] / 60));
        }}
        ariaLabel={["Lower thumb", "Upper thumb"]}
        renderThumb={Thumb}
        renderTrack={Track}
      />
      <div className="flex justify-between max-xl:mx-[10%] max-sm:mt-2 xl:max-2xl:my-2 2xl:mt-4">
        <p className="text-sm font-[300]">
          {getLocalTimeFromUTCMinutes(startTimeInMinutes)}
        </p>
        <p className="text-sm font-[300]">
          {getLocalTimeFromUTCMinutes(currentTime)}
        </p>
      </div>

      <div className="flex w-full justify-center gap-2 max-md:hidden md:max-xl:my-[1rem] lg:max-xl:gap-3">
        {buttons.map(({ label, minutes }) => (
          <button
            key={label}
            className={`rounded-lg px-2 py-2 lg:max-xl:px-3 xl:max-2xl:px-1.5 ${
              activeButton === label
                ? "Z bg-z-green-500 text-white "
                : "bg-gray-100 text-black"
            } `}
            onClick={() => {
              handleButtonClick(minutes, label);
            }}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OiTimeRange;
