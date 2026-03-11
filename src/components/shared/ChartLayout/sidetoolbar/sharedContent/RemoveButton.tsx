import { ShowStrategiesPopup } from "@/lib/redux/slices/ChartsSlice";
import { setCurrentSection } from "@/lib/redux/slices/CommonSlice";
import Image from "next/image";
import React from "react";
import { useDispatch } from "react-redux";

interface RemoveButtonProps {
  additionStyle?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  hideInMobile?: string;
}

const RemoveButton: React.FC<RemoveButtonProps> = ({
  additionStyle,
  onClick,
  hideInMobile,
}) => {
  const dispatch = useDispatch();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    // Always run the provided onClick first (if any)
    if (onClick) {
      onClick(event);
    }

    // Then run the default Redux logic (unless the event was prevented)
    if (!event.defaultPrevented) {
      dispatch(setCurrentSection(null));
      dispatch(ShowStrategiesPopup(false));
    }
  };

  return (
    <button
      className={`absolute right-0 ${hideInMobile} ${additionStyle} ${
        additionStyle ? "top-1" : "top-0"
      } p-2 text-xl md:max-xl:px-3 md:max-xl:pt-[0.8rem]`}
      onClick={handleClick}
      onDoubleClick={(event) => event.stopPropagation()}
    >
      <Image
        src="/svg/removeSymbol.svg"
        className="relative max-md:h-[1.4rem] max-md:w-[1.4rem] md:h-[1.5rem] md:w-[1.5rem]"
        width={20}
        height={20}
        alt="remove"
      />
    </button>
  );
};

export default RemoveButton;
