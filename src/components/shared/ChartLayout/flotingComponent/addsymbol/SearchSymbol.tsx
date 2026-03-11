import Image from "next/image";
import React, { useEffect, useRef } from "react";
interface SearchSymbolProps {
  searchSymbol: any;
  setSearchSymbol: React.Dispatch<React.SetStateAction<any>>;
}

const SearchSymbol: React.FC<SearchSymbolProps> = ({
  searchSymbol,
  setSearchSymbol,
}) => {
  const searchRef = useRef<HTMLInputElement | null>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchSymbol(value);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  useEffect(() => {
    const input = searchRef.current;
    if (!input) return;

    const maintainFocus = (event: any) => {
      if (event.target !== input) {
        input.blur(); // Temporarily blur
        setTimeout(() => {
          input.focus(); // Auto-refocus after click finishes
        }, 0);
      } // Keep the input focused
    };

    input.addEventListener("blur", maintainFocus);

    return () => {
      input.removeEventListener("blur", maintainFocus); // Clean up event listener
    };
  }, []);

  return (
    <div className="flex items-center justify-evenly max-xl:border-b-[0.05rem]  max-xl:border-solid max-xl:border-z-br-gray max-sm:w-full max-sm:px-3 sm:max-md:px-1.5 md:max-xl:w-full md:max-xl:py-[0.5rem]">
      <Image
        src="/svg/searchIcon.svg"
        className="h-[1.5rem] w-[1.5rem] max-sm:h-[1rem] max-sm:w-[1rem] sm:max-lg:h-[1.2rem] sm:max-lg:w-[1.2rem]"
        width="20"
        height="20"
        alt="search"
      />
      <input
        id="name"
        name="name"
        type="name"
        placeholder="Search symbol here"
        required
        value={searchSymbol}
        className="flex items-center uppercase gap-3 border-neutral-200 outline-none max-md:px-3 max-md:py-0.5 max-md:text-[0.75rem] max-sm:w-[18rem] sm:max-md:w-[22rem] md:max-lg:w-[24rem] lg:max-xl:w-[30rem] xl:w-[15rem] xl:px-5 xl:py-2  "
        onChange={handleInputChange}
        autoFocus
        ref={searchRef}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchSymbol;
