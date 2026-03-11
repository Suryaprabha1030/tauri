import Image from "next/image";
import React, { useState } from "react";

interface PWAProps {
  isInstallPromptVisible: boolean;
  handleInstallClick: (() => void) | null;
}
const PWAInstallPrompt: React.FC<PWAProps> = ({
  isInstallPromptVisible,
  handleInstallClick,
}) => {
  // const { isInstallPromptVisible, handleInstallClick } = usePWAInstallPrompt();
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    if (handleInstallClick != null) handleInstallClick();
    setTimeout(() => setIsClicked(false), 3000); // Reset the clicked state after the animation duration
  };

  return (
    isInstallPromptVisible && (
      <div
        className={` ${isInstallPromptVisible ? "w-full max-sm:w-[2rem]" : "hidden"} relative flex  flex-col items-center justify-center`}
      >
        <button
          id="install-button"
          onClick={handleClick}
          className={` group flex flex-row items-center justify-center gap-10 rounded-3xl bg-z-green-500 transition-transform duration-200 ease-in-out    ${
            isClicked ? "animate-bounce" : "hover:bg-green-600"
          }`}
        >
          <Image
            src="/svg/install.svg"
            alt="install app"
            height={24}
            width={24}
            className=" max-md:h-[1.1rem] max-md:w-[1.1rem] md:max-xl:h-[1.25rem] md:max-xl:w-[1.25rem] xl:h-[1.35rem] xl:w-[1.35rem]"
          />
          {!isClicked && (
            <span
              className={`pointer-events-none absolute  -left-4 top-8  z-[1000]   
           w-[4.5rem] rounded bg-gray-800 px-1  text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100 max-xl:hidden`}
            >
              Install App
            </span>
          )}
        </button>
      </div>
    )
  );
};

export default PWAInstallPrompt;
