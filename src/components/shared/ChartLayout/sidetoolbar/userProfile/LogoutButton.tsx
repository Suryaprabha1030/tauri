import Image from "next/image";
import Link from "next/link";
import React from "react";

const LogoutButton = () => {
  return (
    <Link href="/logout">
      <span className="group relative h-[5rem] w-[5rem]">
        <span className="absolute left-1/2 top-1/2 mt-2 w-max -translate-x-1/2 rounded-md bg-gray-800 px-2 text-[0.75rem] text-white opacity-0 transition-opacity group-hover:opacity-100 max-xl:hidden">
          Logout
        </span>
        <span className=" relative inline-block h-[1.95rem] w-[1.7rem] md:max-xl:mt-0.5">
          <Image
            src={"/svg/logout.svg"}
            fill
            alt="logout"
            className="mt-[0.2rem]"
          />
        </span>
      </span>
    </Link>
  );
};

export default LogoutButton;
