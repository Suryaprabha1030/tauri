import { useState, useRef, Dispatch, useEffect } from "react";

interface ChartSettingsProps {
  annotationsVisible: boolean;
  todayHightagVisible: boolean;
  lowvalueVisible: boolean;
  highvalueVisible: boolean;
  prevClosetagVisible: boolean;
  dayrangeValueVisible: boolean;
  targetVisible: boolean;
  setAnnotationsVisible: Dispatch<React.SetStateAction<boolean>>;
  settodayHightag: Dispatch<React.SetStateAction<boolean>>;
  setlowvalue: Dispatch<React.SetStateAction<boolean>>;
  sethighvalue: Dispatch<React.SetStateAction<boolean>>;
  setprevClosetag: Dispatch<React.SetStateAction<boolean>>;
  setdayrangeValue: Dispatch<React.SetStateAction<boolean>>;
  settargetVisible: Dispatch<React.SetStateAction<boolean>>;
  setDropdownVisible: Dispatch<React.SetStateAction<boolean>>;
}

const ChartSettings: React.FC<ChartSettingsProps> = ({
  annotationsVisible,
  todayHightagVisible,
  lowvalueVisible,
  highvalueVisible,
  prevClosetagVisible,
  targetVisible,
  dayrangeValueVisible,
  setAnnotationsVisible,
  settodayHightag,
  setlowvalue,
  setprevClosetag,
  setdayrangeValue,
  settargetVisible,
  sethighvalue,
  setDropdownVisible,
}) => {
  const dropdownRef = useRef<any>(null);

  const handletages = () => {
    setAnnotationsVisible(!annotationsVisible);

    if (annotationsVisible == false) {
      setdayrangeValue(true);
      sethighvalue(true);
      settodayHightag(true);
      setlowvalue(true);
      setprevClosetag(true);
      settargetVisible(true);
    }
    if (annotationsVisible == true) {
      setdayrangeValue(false);
      sethighvalue(false);
      settodayHightag(false);
      setlowvalue(false);
      setprevClosetag(false);
      settargetVisible(false);
    }
  };

  useEffect(() => {
    if (
      dayrangeValueVisible &&
      highvalueVisible &&
      todayHightagVisible &&
      lowvalueVisible &&
      prevClosetagVisible &&
      targetVisible
    ) {
      setAnnotationsVisible(true);
    } else {
      setAnnotationsVisible(false);
    }
  }, [
    dayrangeValueVisible,
    highvalueVisible,
    todayHightagVisible,
    lowvalueVisible,
    prevClosetagVisible,
    targetVisible,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-6 mt-10 w-[8rem] cursor-pointer rounded-lg border border-gray-300 bg-white text-[0.65rem] shadow-lg"
    >
      <div className="p-2">
        <ul>
          <li className="flex cursor-pointer items-center space-x-2">
            <input
              type="checkbox"
              name="dropdownOption"
              value="all tags"
              checked={annotationsVisible}
              onChange={() => handletages()}
              className="form-checkbox h-4 w-4 text-z-green-500"
            />
            <span>All tags</span>
          </li>

          <li className="mt-2 flex cursor-pointer items-center space-x-2">
            <input
              type="checkbox"
              name="dropdownOption"
              value="todayHigh"
              checked={todayHightagVisible}
              onChange={() => settodayHightag(!todayHightagVisible)}
              className="form-checkbox h-4 w-4 text-z-green-500"
            />
            <span>Today&apos;s High</span>
          </li>

          <li className="mt-2 flex cursor-pointer items-center space-x-2">
            <input
              type="checkbox"
              name="dropdownOption"
              value="todayLow"
              checked={lowvalueVisible}
              onChange={() => setlowvalue(!lowvalueVisible)}
              className="form-checkbox h-4 w-4 text-z-green-500"
            />
            <span>52W Low</span>
          </li>

          <li className="mt-2 flex cursor-pointer items-center space-x-2">
            <input
              type="checkbox"
              name="dropdownOption"
              value="high"
              checked={highvalueVisible}
              onChange={() => sethighvalue(!highvalueVisible)}
              className="form-checkbox h-4 w-4 text-z-green-500"
            />
            <span>52W High</span>
          </li>

          <li className="mt-2 flex cursor-pointer items-center space-x-2">
            <input
              type="checkbox"
              name="dropdownOption"
              value="prevClose"
              checked={prevClosetagVisible}
              onChange={() => setprevClosetag(!prevClosetagVisible)}
              className="form-checkbox h-4 w-4 text-z-green-500"
            />
            <span>Prev.Close</span>
          </li>

          <li className="mt-2 flex cursor-pointer items-center space-x-2">
            <input
              type="checkbox"
              name="dropdownOption"
              value="dayrange"
              checked={dayrangeValueVisible}
              onChange={() => setdayrangeValue(!dayrangeValueVisible)}
              className="form-checkbox h-4 w-4 text-z-green-500"
            />
            <span>Day&apos;s Range</span>
          </li>

          <li className="mt-2 flex cursor-pointer items-center space-x-2">
            <input
              type="checkbox"
              checked={targetVisible}
              onChange={() => settargetVisible(!targetVisible)}
              className="form-checkbox h-4 w-4 rounded text-z-green-500"
            />
            <span className="text-[0.65rem] text-black">Target P&L</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChartSettings;
