import Image from "next/image";
import React, { Dispatch, useState } from "react";

import AddGroup from "./AddGroup";

interface OIGroupProps {
  groupName: string;
  setGroupName: Dispatch<React.SetStateAction<any>>;
}
const OIGroup: React.FC<OIGroupProps> = ({ groupName, setGroupName }) => {
  const [showGroup, setShowGroup] = useState(false);

  const showAllGroup = () => {
    setShowGroup(!showGroup);
  };
  return (
    <div className="relative mt-1 h-5 w-full">
      <div className="dropdown-container relative relative flex  flex h-full w-[18%]  flex-row items-center border-r-2 border-gray-300 bg-white py-2 text-center text-black shadow-xl outline-none ">
        <h1 className="text-[0.75rem]">{groupName}</h1>
        {/* <Image src="/svg/pluSymbol.svg" className='w-[1.2rem]  h-[1.2rem] mt-1' width="20" height="20" alt="plus"  /> */}

        <Image
          src="/svg/ArrowFall.svg"
          className="mt-1  h-[1.2rem] w-[1.2rem]"
          width="20"
          height="20"
          alt="plus"
          onClick={showAllGroup}
        />
      </div>
      {showGroup ? (
        <div className="absolute   left-0 top-9 z-[5023] h-[30%] w-[35%] bg-blue-200">
          <AddGroup setGroupName={setGroupName} groupName={groupName} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default OIGroup;
