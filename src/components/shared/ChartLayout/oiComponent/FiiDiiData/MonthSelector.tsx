import { getMonthsFromMay2025 } from "@/lib/util/FiiDiiUtil/FiiDiiUtil";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface FiiDiiSummaryProps {
  payLoadDate: any;
  setPayLoadDate: React.Dispatch<React.SetStateAction<any>>;
}

const MonthSelector: React.FC<FiiDiiSummaryProps> = ({
  payLoadDate,
  setPayLoadDate,
}) => {
  const handleDropdownChange = (selectedKey: any) => {
    setPayLoadDate(selectedKey);
    setIsOpen(false);
  };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function normalizeSingleDate(input) {
    const part = input.trim().replace(/([a-zA-Z]+)(\d{4})/, "$1 $2");
    const date = new Date(part);

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  }
  return (
    <div
      ref={dropdownRef}
      className="relative bg-white "
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=" flex flex-row gap-2 rounded-md border border-gray-300 bg-white px-0.5 py-1.5 text-left text-[0.75rem]  shadow-sm"
      >
        {normalizeSingleDate(payLoadDate)}
        <img src={"/svg/downChevron.svg"} alt="" width={16} height={16} />
      </button>

      {isOpen && (
        <ul className="absolute z-20 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white  text-[0.75rem]   shadow-lg shadow-md scrollbar-none">
          {getMonthsFromMay2025()
            .reverse()
            .map((option) => (
              <li
                key={option}
                onClick={(e) => handleDropdownChange(option)}
                className={`cursor-pointer px-2 py-1 capitalize  ${
                  payLoadDate === option
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {normalizeSingleDate(option)}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default MonthSelector;
