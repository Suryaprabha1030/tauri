import Logo from "./logo/logo";
import Link from "next/link";

import { usePathname } from "next/navigation";
import ChartIcon from "../icons/ChartIcon";
import ComputerIcon from "../icons/ComputerIcon";
import WarningIcon from "../icons/WarningIcon";
import CalendarIcon from "../icons/CalendarIcon";
import { useState } from "react";

interface HeaderProps {
  toggleChild: () => void; // Define prop type for toggle function
}

const Header: React.FC<HeaderProps> = ({ toggleChild }) => {
  const currentPath = usePathname();
  const [show, setShow] = useState(true);

  const isPageActive = (pathName: string): boolean => {
    return currentPath.startsWith(pathName);
  };

  const getSvgColor = (pathName: string): string => {
    return isPageActive(pathName) ? "#fff" : "#4CA858";
  };

  const getTextColor = (pathName: string): string => {
    return isPageActive(pathName)
      ? "bg-z-green-500 text-white"
      : " bg-white text-z-green-500";
  };

  return (
    <header className="flex w-full flex-row items-center justify-between p-5 shadow relative">
      <div className="flex flex-row gap-20 lg:gap-[0.98rem]  xl:gap-5">
        <div className="flex flex-row items-center max-sm:left-[8rem]   sm:left-[12rem] md:left-[19rem]   bottom-[1rem]  max-sm:absolute sm:absolute  max-sm:w-40 lg:static lg:flex  ">
          <a href="/strategy-builder">
            <Logo height={48} width={160} />
          </a>
          <span className="mr-3 flex rounded-full bg-gradient-to-r from-green-400 to-blue-500 max-sm:px-2 sm:px-2 lg:px-1 xl:px-2 py-1 max-sm:text-[0.35rem] sm:text-[0.55rem] lg:text-[0.35rem]  xl:text-xs font-semibold uppercase text-white hover:from-pink-500 hover:to-yellow-500">
            <div className="flex grid-cols-2 justify-center max-sm:gap-1 sm:gap-1 xl:gap-0">
              <div className="col-span-1">Alpha</div>
              <div className="xl:col-span-1">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-2 w-2   xl:h-4 xl:w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                  />
                </svg>
              </div>
            </div>
          </span>
        </div>
        {/* harmburger menu */}
        <button
          onClick={toggleChild}
          className="max-sm:show sm:block  md:block  lg:hidden "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="30"
            height="30"
            viewBox="0 0 30 30"
          >
            <path d="M 3 7 A 1.0001 1.0001 0 1 0 3 9 L 27 9 A 1.0001 1.0001 0 1 0 27 7 L 3 7 z M 3 14 A 1.0001 1.0001 0 1 0 3 16 L 27 16 A 1.0001 1.0001 0 1 0 27 14 L 3 14 z M 3 21 A 1.0001 1.0001 0 1 0 3 23 L 27 23 A 1.0001 1.0001 0 1 0 27 21 L 3 21 z"></path>
          </svg>
        </button>

        {/* header button */}
        <div className="max-sm:hidden sm:hidden md:hidden  flex lg:flex-row  lg:justify-center lg:gap-[0.4rem] xl:gap-2  lg:flex 2xl:ms-8">
          <a
            className={`focus:ring-offset flex items-center lg:justify-between max-sm:justify-evenly sm:justify-evenly lg:gap-2 rounded-full border border-green-500 max-sm:px-2 sm:py-2 max-sm:py-2 sm:py-2 lg:px-2  2xl:px-4 2xl:py-2  max-sm:text-[0.85rem] sm-text-[0.85rem] lg:text-[0.8rem] 2xl:text-base   font-medium leading-none focus:ring focus:ring-z-green-300 focus:ring-offset-z-green-100 ${getTextColor(
              "/strategy-builder",
            )}`}
            href="/strategy-builder"
          >
            <ChartIcon color={getSvgColor("/strategy-builder")} />
            Strategies
          </a>
          <a
            className={`flex items-center lg:justify-between max-sm:justify-evenly lg:gap-2 rounded-full border border-green-500 max-sm:px-2 max-sm:py-2 lg:px-2 2xl:px-4 2xl:py-2  max-sm:text-[0.85rem]  lg:text-[0.8rem] 2xl:text-base font-medium leading-none focus:ring focus:ring-z-green-300 focus:ring-offset-z-green-100 ${getTextColor(
              "/simulator",
            )}`}
            href="/simulator"
          >
            <ComputerIcon color={getSvgColor("/simulator")} />
            Simulator
          </a>
          <a
            className={`flex items-center lg:justify-between max-sm:justify-evenly lg:gap-2 rounded-full border border-green-500 max-sm:px-2 max-sm:py-2 lg:px-2 2xl:px-4 lg:py-2  max-sm:text-[0.85rem] lg:text-[0.8rem] 2xl:text-base font-medium leading-none focus:ring focus:ring-z-green-300 focus:ring-offset-z-green-100 ${getTextColor(
              "/backtesting",
            )}`}
            href="/backtesting"
          >
            {/* <WarningIcon color={getSvgColor("/backtesting")} /> */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              width="24px"
              height="24px"
              color={getSvgColor("/backtesting")}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
              />
            </svg>
            {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6" color={getSvgColor("/backtesting")}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
            </svg> */}
            BackTesting
          </a>
          <a
            className={`flex items-center lg:justify-between max-sm:justify-evenly lg:gap-2 rounded-full border border-green-500 max-sm:px-2 max-sm:py-2 lg:px-2 2xl:px-4 lg:py-2  max-sm:text-[0.85rem] lg:text-[0.8rem] 2xl:text-base font-medium leading-none focus:ring focus:ring-z-green-300 focus:ring-offset-z-green-100 ${getTextColor(
              "/calendar",
            )}`}
            href="/calendar"
          >
            <CalendarIcon color={getSvgColor("/calendar")} />
            Calendar
          </a>
        </div>
      </div>
      {/* join */}
      <div className="flex flex-row justify-center gap-6 lg:gap-[0.5rem] 2xl:gap-6 ">
        <div className=" rounded-full bg-gradient-to-r from-green-400 to-blue-500 lg:py-[0.0006rem] 2xl:py-2 text-center hover:from-pink-500 hover:to-yellow-500 max-sm:hidden sm:hidden  md:hidden lg:flex lg:px-2 2xl:px-4">
          <div
            className="flex items-center p-2 leading-none text-indigo-100 lg:inline-flex lg:rounded-full"
            role="alert"
          >
            <a
              href="https://join.slack.com/t/zoonest/shared_invite/zt-24car2fbn-_7f2~2zbveKXVI4cRzu5ZA"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-row items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="max-sm:h-3 sm:h-3 max-sm:w-3 sm:w-3 md:w-[1.3rem] max-md:h-[1.3rem] lg:h-4 lg:w-4 2xl:h-5 2xl:w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
              &nbsp;
              <span className="mr-2 flex-auto text-left max-sm:text-[0.85rem] sm:text-[0.55rem] md:text-[0.5rem] lg:text-[0.6rem] 2xl:text-base  lg:font-semibold text-white">
                Join our Slack channel
              </span>
              &nbsp;
              <svg
                className="max-sm:h-3 sm:h-3 max-sm:w-3 sm:w-3 md:w-[1.3rem] max-md:h-[1.3rem] lg:h-4 lg:w-4 2xl:h-5 2xl:w-6 fill-current text-white opacity-75"
                viewBox="0 0 20 20"
              >
                <path d="M12.95 10.707l.707-.707L8 4.343 6.586 5.757 10.828 10l-4.242 4.243L8 15.657l4.95-4.95z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="dropdown group relative flex ">
          <button
            className="flex flex-row items-center"
            id="userDropDown"
            data-dropdown-toggle="dropdown"
          >
            <img src="/svg/user-icon.svg" height={35} width={35} alt={""} />
          </button>
          <ul className="dropdown-menu absolute right-0 top-6   hidden w-36 border border-gray-200 bg-white max-sm:text-[0.6rem] sm:text-[0.8rem] 2xl:text-[1rem] text-black group-hover:block">
            <li className="">
              <a
                className="whitespace-no-wrap block rounded-t px-4 py-2 hover:bg-gray-400"
                href="/profile"
              >
                Profile
              </a>
            </li>
            <li className="">
              <a
                className="whitespace-no-wrap block px-4 py-2 hover:bg-gray-400"
                href="/logout"
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
};
export default Header;
