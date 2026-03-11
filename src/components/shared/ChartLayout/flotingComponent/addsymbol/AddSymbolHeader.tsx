import Image from "next/image";
import React, { Dispatch, SetStateAction } from "react";
import AddGroupSymbol from "./AddGroupSymbol";
interface AddSymbolHeaderProps {
  setShow: Dispatch<SetStateAction<boolean>>;
  setGrpSymbols: Dispatch<SetStateAction<any>>;
  setSelected: Dispatch<SetStateAction<any>>;
  selected: any;
  setSearchSymbol: Dispatch<SetStateAction<any>>;
}

const AddSymbolHeader: React.FC<AddSymbolHeaderProps> = ({
  setShow,
  setGrpSymbols,
  selected,
  setSelected,
  setSearchSymbol,
}) => {
  const removeSymbol = () => {
    setShow(false);
  };

  return (
    <div className="bg-shadow flex flex-row items-center justify-between border-b-[0.05rem] border-z-br-gray max-xl:w-full max-md:p-2 md:max-lg:p-3 lg:max-xl:p-4 xl:max-2xl:w-[40rem] xl:max-2xl:p-3 2xl:w-[45rem] 2xl:p-2">
      <h1 className="font-semibold max-lg:text-[1rem] lg:text-[1.2rem]">
        Add Symbol
      </h1>
      <AddGroupSymbol
        setGrpSymbols={setGrpSymbols}
        selected={selected}
        setSelected={setSelected}
        setSearchSymbol={setSearchSymbol}
      />
      <Image
        src="/svg/removeSymbol.svg"
        className="relative h-[1.5rem] w-[1.5rem] cursor-pointer max-sm:h-[1rem] max-sm:w-[1rem] lg:max-xl:h-[1.7rem] lg:max-xl:w-[1.7rem] "
        width="20"
        height="20"
        alt="plus"
        onClick={removeSymbol}
      />
    </div>
  );
};

export default AddSymbolHeader;
