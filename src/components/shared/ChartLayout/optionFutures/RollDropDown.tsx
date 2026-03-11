import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type RollDropdownProps = {
  label: string;
  direction: "increase" | "decrease";
  onSelect: (step: number) => void;
  selectedRollUp: any;
  setSelectedRollUp: React.Dispatch<React.SetStateAction<any>>;
};

const RollDropdown = ({
  label,
  direction,
  onSelect,
  selectedRollUp,
  setSelectedRollUp,
}: RollDropdownProps) => {
  const [open, setOpen] = useState(false);

  const rollUpOptions = [
    { label: "RollUp 1", value: 1 },
    { label: "RollUp 2", value: 2 },
    { label: "RollUp 3", value: 3 },
    { label: "RollUp 4", value: 4 },
  ];
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative ">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className=" flex flex-row items-center gap-[0.1rem] rounded-md border border-green-500 px-1  py-1 text-[0.7rem] font-medium leading-none text-z-green-500 text-z-green-500 max-sm:w-[6rem]  max-sm:p-1 max-sm:text-[0.65rem]"
      >
        <span className="w-4/5">
          {" "}
          {label} {selectedRollUp}{" "}
        </span>
        <Image
          src="/svg/arrowFall.svg"
          width="25"
          height="25"
          alt="plus"
          className="h-[1rem] w-[1rem] p-0"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute  right-1 top-8 z-[9999] flex h-[6.8rem] w-[6rem] flex-col items-start justify-center overflow-y-auto rounded-lg bg-white text-[0.6rem] text-black shadow-lg max-xl:h-[7.9rem] max-xl:scrollbar-none max-sm:h-[6rem]  xl:scrollbar-thin xl:scrollbar-track-gray-100 xl:scrollbar-thumb-z-br-gray">
          {rollUpOptions.map((item, index) => (
            <div
              key={index}
              className={`flex w-full cursor-pointer justify-center px-2 py-1 text-[0.7rem] font-[450] max-sm:text-[0.6rem]  sm:max-xl:py-2 sm:max-md:text-[0.6rem] 
        ${
          selectedRollUp === item.value
            ? "bg-blue-500 text-white"
            : "text-black hover:bg-gray-100"
        }
        hover:bg-blue-500
      `}
              onMouseDown={(e) => {
                e.preventDefault();
                setSelectedRollUp(item.value);
                onSelect(item.value);
                setOpen(false);
              }}
              onDoubleClick={(e) => e.stopPropagation()}
            >
              {label}
              {""}
              {item.value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RollDropdown;
