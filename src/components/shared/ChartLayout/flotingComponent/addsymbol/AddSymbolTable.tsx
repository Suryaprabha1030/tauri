import Image from "next/image";
import React, { useRef } from "react";
import CandleIcon from "../../optionFutures/CandleIcon";
import { useDispatch } from "react-redux";
import { setTvAddSymbPopup } from "@/lib/redux/slices/ChartsSlice";
import { handlePopUp } from "@/lib/util/analyzer/handleSelect";
interface AddSymbolTableProps {
  displaySymb: any;
  selectedExchange: string;
  symbols: any;
  handleImageClickEvent: any;
}
const AddSymbolTable: React.FC<AddSymbolTableProps> = ({
  displaySymb,
  selectedExchange,
  symbols,
  handleImageClickEvent,
}) => {
  const buttonRef = useRef(null);
  const dispatch = useDispatch();
  return (
    <tbody className="uppercase text-gray-700 max-sm:text-[0.6rem] sm:max-lg:text-[0.7rem] lg:text-[0.8rem] 2xl:text-xs">
      {displaySymb
        .filter((symb: any) => {
          if (selectedExchange === "NSE") {
            return symb?.exchange === "NSE" || symb.exchange === "NFO";
          } else if (selectedExchange === "BSE") {
            return symb?.exchange === "BSE" || symb.exchange === "BFO";
          } else {
            return symb?.exchange === selectedExchange; // Default case
          }
        })
        .map((symb: any, index: number) => (
          <tr
            className=" group  border-b-[0.00000000000002rem] border-white shadow-sm"
            key={symb?.identifier}
          >
            <td
              scope="col"
              className="relative flex flex-row items-center justify-between px-5 py-3 text-left max-sm:px-3"
            >
              <span>{symb?.display_symbol_name}</span>

              <div
                className="flex  items-center justify-center rounded 
             bg-white opacity-0 
             transition-opacity duration-200 
             group-hover:pointer-events-auto group-hover:opacity-100"
              >
                <CandleIcon
                  className="pointer-events-none h-full w-full cursor-pointer group-hover:pointer-events-auto 
               max-md:h-4 max-md:w-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(setTvAddSymbPopup(true));
                    handlePopUp(symb, dispatch);
                  }}
                />
              </div>
            </td>
            <td scope="col" className=" px-5 py-3  text-left  max-sm:px-3">
              {symb?.exchange}
            </td>

            <td
              scope="col"
              className="py-3 text-left max-sm:hidden max-sm:px-10 lg:px-10 "
            >
              {symb?.symbol_name}
            </td>

            <td scope="col" className="py-3 text-left max-sm:px-3 lg:px-3">
              <img
                src={`${
                  symbols &&
                  symbols.some(
                    (item: any) => item?.identifier === symb?.identifier,
                  )
                    ? "/svg/removeSymbol.svg"
                    : "/svg/plusSymbol.svg"
                }`}
                className="cursor-pointer text-blue-200 active:bg-z-br-gray  max-sm:h-[0.9rem] max-sm:w-[0.9rem] sm:w-[1.2rem] lg:h-[1.5rem] lg:w-[1.5rem]"
                width="20"
                height="20"
                alt="plus"
                ref={buttonRef}
                onClick={(e) => handleImageClickEvent(symb.identifier, e)}
              />
            </td>
          </tr>
        ))}
    </tbody>
  );
};

export default AddSymbolTable;
