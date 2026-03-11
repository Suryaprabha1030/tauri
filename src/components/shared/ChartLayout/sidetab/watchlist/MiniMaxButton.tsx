import React from "react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
interface AeroButtonProps {
  aeroToggle: boolean;
  setAeroToggle: Dispatch<SetStateAction<boolean>>;
  setFilterClick: Dispatch<SetStateAction<boolean>>;
}

const MiniMaxButton: React.FC<AeroButtonProps> = ({
  aeroToggle,
  setAeroToggle,
  setFilterClick,
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center max-sm:h-[2.5rem] xl:hidden">
      <Image
        src={aeroToggle ? "/svg/minimize.svg" : "/svg/maximize.svg"}
        height="30"
        width="30"
        alt=""
        className={`flex items-center justify-center py-1 sm:px-1 xl:hidden ${
          aeroToggle
            ? "w-[1.6rem] max-sm:h-[2.4rem] max-sm:w-[1.8rem] sm:max-md:w-[2rem] md:max-2xl:h-[2.3rem] md:max-xl:w-[2rem]"
            : "w-[1.4rem] -rotate-[90] max-sm:mt-[0.05rem] max-sm:h-[1.6rem] max-sm:w-[1.6rem] sm:max-md:w-[1.5rem] md:max-xl:h-[1.5rem] md:max-xl:w-[1.6rem]"
        }`}
        onClick={() => {
          if (window.innerWidth < 1200) {
            setAeroToggle(!aeroToggle);
            if (aeroToggle == true) {
              setFilterClick(false);
            }
          }
        }}
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      />
    </div>
  );
};

export default MiniMaxButton;
