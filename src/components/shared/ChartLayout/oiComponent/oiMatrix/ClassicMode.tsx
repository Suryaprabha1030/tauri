import React, { SetStateAction } from "react";

interface ClassicModeProps {
  setShowClassic: React.Dispatch<SetStateAction<boolean>>;
  showClassic: boolean;
  setShowChgPerc: React.Dispatch<SetStateAction<boolean>>;
}

const ClassicMode: React.FC<ClassicModeProps> = ({
  setShowClassic,
  showClassic,
  setShowChgPerc,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowClassic(event.target.checked);
    setShowChgPerc(false);
  };
  return (
    <div className="flex items-center space-x-2 max-2xl:hidden ">
      <input
        id="custom-checkbox"
        type="checkbox"
        checked={showClassic}
        onChange={handleChange}
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <span className="text-[0.85rem] text-black">Classic</span>
    </div>
  );
};

export default ClassicMode;
