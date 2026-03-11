// components/Dropdown.tsx
import React from "react";

interface DropdownProps {
  isVisible: boolean;
  annotationsVisible: boolean;
  todayHighVisible: boolean;
  lowValueVisible: boolean;
  setAnnotationsVisible: (visible: boolean) => void;
  setTodayHighVisible: (visible: boolean) => void;
  setLowValueVisible: (visible: boolean) => void;
  toggleAnnotations: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  isVisible,
  annotationsVisible,
  todayHighVisible,
  lowValueVisible,
  setAnnotationsVisible,
  setTodayHighVisible,
  setLowValueVisible,
  toggleAnnotations,
}) => {
  return (
    isVisible && (
      <div className="absolute right-6 mt-10 w-[8rem] cursor-pointer rounded-lg border border-gray-300 bg-white text-[0.65rem] shadow-lg">
        <div className="p-2">
          <label className="flex cursor-pointer items-center space-x-2">
            <input
              type="checkbox"
              name="dropdownOption"
              value="all tags"
              checked={annotationsVisible}
              onChange={toggleAnnotations}
              className="form-checkbox h-4 w-4 text-z-green-500"
            />
            <span>All tags</span>
          </label>
          <label className="mt-2 flex cursor-pointer items-center space-x-2">
            <input
              type="checkbox"
              name="dropdownOption"
              value="todayHigh"
              checked={todayHighVisible}
              onChange={() => setTodayHighVisible(!todayHighVisible)}
              className="form-checkbox h-4 w-4 text-z-green-500"
            />
            <span>Today&apos;s High</span>
          </label>
          <label className="mt-2 flex cursor-pointer items-center space-x-2">
            <input
              type="checkbox"
              name="dropdownOption"
              value="todayLow"
              checked={lowValueVisible}
              onChange={() => setLowValueVisible(!lowValueVisible)}
              className="form-checkbox h-4 w-4 text-z-green-500"
            />
            <span>Today&apos;s Low</span>
          </label>
        </div>
      </div>
    )
  );
};

export default Dropdown;
