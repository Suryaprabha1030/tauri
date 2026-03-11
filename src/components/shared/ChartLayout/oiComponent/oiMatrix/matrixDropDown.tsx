import React, { SetStateAction, useState } from "react";

interface matrixDropDownProps {
  setActiveMatrixTypeButton: React.Dispatch<SetStateAction<string | null>>;
  activeMatrixTypeButton: string | null;
}

const MatrixDropDown: React.FC<matrixDropDownProps> = ({
  setActiveMatrixTypeButton,
  activeMatrixTypeButton,
}) => {
  //   const [selectedOption, setSelectedOption] = useState("Both");

  const matrixOptions = [
    { value: "CE", label: "CE" },
    { value: "PE", label: "PE" },
    { value: "", label: "Both" },
  ];

  const handleChange = (e) => {
    setActiveMatrixTypeButton(e.target.value);
  };
  return (
    <select
      value={activeMatrixTypeButton ?? undefined}
      onChange={handleChange}
      className="rounded-lg border px-1 py-1 text-[0.75rem] focus:outline-none "
    >
      {matrixOptions.map((option) => (
        <option key={option.label} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default MatrixDropDown;
