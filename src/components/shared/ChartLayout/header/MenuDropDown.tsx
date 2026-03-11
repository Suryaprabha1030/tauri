import React, {
  useState,
  useEffect,
  useRef,
  Dispatch,
  SetStateAction,
} from "react";
import Image from "next/image";
interface buttonItems {
  label: string;
  value: string;
  width: string;
  route: string;
}
interface MenuDropDownProps {
  buttons: buttonItems[];
  handleClick: any;
  activeButton: string;
  switchNavbar: boolean;
  setSwitchNavbar: Dispatch<SetStateAction<boolean>>;
}
const MenuDropDown: React.FC<MenuDropDownProps> = ({
  buttons,
  handleClick,
  activeButton,
  switchNavbar,
  setSwitchNavbar,
}) => {
  const switchNavbarRef = useRef<any>(null);
  const switchNavButtonRef = useRef<any>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        switchNavbarRef.current &&
        !switchNavbarRef.current.contains(event.target) &&
        switchNavButtonRef.current &&
        !switchNavButtonRef.current.contains(event.target)
      ) {
        setSwitchNavbar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      <div>
        {buttons.map((button) => {
          return activeButton == button.value ? (
            <button
              ref={switchNavButtonRef}
              key={button.value}
              className={`border-1 flex items-center justify-center rounded-full border border-solid border-gray-300 border-z-green-500 py-1 pl-1 pr-1.5 text-[0.8rem] font-medium shadow-lg md:max-xl:mt-0.5 xl:hidden`}
              onClick={(event) => {
                event.stopPropagation();
                setSwitchNavbar(!switchNavbar);
              }}
            >
              <span
                className={`flex h-[1rem] items-center ${button.width}  justify-center `}
              >
                {button.label}
              </span>
              <img src="/svg/arrowFall.svg" height={16} width={15} alt="" />
            </button>
          ) : (
            ""
          );
        })}
      </div>

      <div
        ref={switchNavbarRef}
        className={`absolute right-[0.2rem] top-[3.8rem] z-[1000] flex h-[6.9rem] w-[8rem] flex-col items-center justify-start rounded-xl bg-white shadow-strong-top ${
          switchNavbar ? "" : "max-xl:hidden"
        } xl:hidden`}
      >
        {buttons.map((button) => {
          return activeButton == button.value ? (
            ""
          ) : (
            <button
              key={button.value}
              className="h-[2.3rem] w-[8rem] border-b-[1px] border-solid border-z-gray-200 text-[0.75rem] md:max-xl:text-[0.8rem] "
              onClick={() => handleClick(button.value, button.route)}
            >
              {button.label}
            </button>
          );
        })}
      </div>
    </>
  );
};
export default MenuDropDown;
