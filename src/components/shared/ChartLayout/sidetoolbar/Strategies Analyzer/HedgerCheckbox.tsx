import React from "react";

interface HedgedCheckboxProps {
  isChecked: boolean;
  onToggle: () => void;
}

const HedgedCheckbox: React.FC<HedgedCheckboxProps> = ({
  isChecked,
  onToggle,
}) => {
  return (
    <div
      className="group relative flex cursor-pointer items-center space-x-2"
      onClick={onToggle} // Toggle on click
      role="checkbox"
      aria-checked={isChecked}
    >
      {/* Custom Checkbox */}
      <div
        className={`flex h-4 w-4 items-center justify-center rounded border-2 ${
          isChecked
            ? "border-z-green-500 bg-z-green-500"
            : " border-gray-400 bg-white"
        } transition-colors duration-300`}
      >
        {isChecked ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3 w-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          // Add an invisible placeholder element
          <div className="h-3 w-3" />
        )}
      </div>

      {/* Label */}
      <span className="select-none text-[0.75rem] font-medium">Hedged</span>
    </div>
  );
};

export default HedgedCheckbox;
