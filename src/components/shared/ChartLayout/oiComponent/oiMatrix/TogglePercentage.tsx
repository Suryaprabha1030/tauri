import React, { SetStateAction } from "react";

interface TogglePercentageProps {
  setShowChgPerc: React.Dispatch<SetStateAction<boolean>>;
  showChgPerc: boolean;
  showClassic: boolean;
}

const TogglePercentage: React.FC<TogglePercentageProps> = ({
  setShowChgPerc,
  showChgPerc,
  showClassic,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowChgPerc(event.target.checked);
  };
  return (
    <div
      className={`flex items-center space-x-2  max-2xl:hidden ${showClassic ? "hidden" : "show"}`}
    >
      <input
        id="custom-checkbox"
        type="checkbox"
        checked={showChgPerc}
        onChange={handleChange}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-[0.85rem] text-black">Show Change %</span>
    </div>
  );
};

export default TogglePercentage;
