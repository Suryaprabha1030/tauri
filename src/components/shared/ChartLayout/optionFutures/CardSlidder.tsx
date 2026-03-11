import React, { useState, useEffect } from "react";
import Image from "next/image";
interface CardItem {
  label: string;
  profitPoints: number | string;
  fontColor: string;
  lossPercent?: any;
  profitPercent?: any;
}
interface CardSlidderProps {
  cardsSwipe: CardItem[];
}
const CardSlidder: React.FC<CardSlidderProps> = ({ cardsSwipe }) => {
  const [index, setIndex] = useState(0);
  const [pageSize, setPageSize] = useState(2);

  useEffect(() => {
    const updatePageSize = () => {
      if (window.innerWidth < 576) {
        setPageSize(2);
      }
      if (window.innerWidth >= 576 && window.innerWidth < 768) {
        setPageSize(3);
      }
      if (window.innerWidth >= 768 && window.innerWidth < 992) {
        setPageSize(4);
      } else if (window.innerWidth >= 992 && window.innerWidth < 1200) {
        setPageSize(5);
      } else if (window.innerWidth >= 1200 && window.innerWidth < 1400) {
        setPageSize(4);
      }
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, [window.innerWidth]);

  const handleNext = () => {
    if (index + pageSize < cardsSwipe.length) {
      setIndex(index + 1);
    } else {
      setIndex((index + 1) % cardsSwipe.length);
    }
  };

  const handlePrevious = () => {
    if (index > 0) {
      setIndex(index - 1);
    }
  };

  return (
    <>
      <div className="flex flex-row justify-center  max-sm:w-[100%] max-sm:gap-3 sm:max-md:gap-[1rem] md:max-xl:my-2 md:max-xl:gap-[1.5rem] xl:hidden xl:max-2xl:gap-[1rem] ">
        <img
          src={"/svg/arrowFall.svg"}
          className="w-[1.5rem] rotate-90 cursor-pointer 2xl:hidden"
          height={20}
          width={20}
          alt={""}
          onClick={handlePrevious}
        />
        {Array.from(
          { length: pageSize },
          (_, i) => cardsSwipe[(index + i) % cardsSwipe.length],
        ).map((item, index) => (
          <div
            key={index}
            className={`flex h-14 w-[7rem] flex-col items-center justify-center gap-[0.05rem] rounded-2xl bg-white text-z-gray-300 max-xl:shadow-strong-top sm:max-xl:h-16 sm:max-lg:w-[8.8rem] lg:max-xl:w-[9rem] ${item.label == "Max Profit" || item.label == "Max Loss" ? "xl:max-2xl:w-[9rem]" : "xl:max-2xl:w-[8rem]"} `}
          >
            <div className="text-center text-[0.65rem] text-z-gray-300 sm:max-md:text-[0.75rem]">
              {item.label}
            </div>
            <div
              className={`text-[0.8rem] font-semibold text-black max-sm:text-[0.68rem] sm:max-md:text-[0.7rem] ${item.fontColor}`}
            >
              {item.profitPoints}

              {item.label == "Max Profit" &&
              item.profitPercent != null &&
              isFinite(item.profitPercent) ? (
                <span className="text-[0.6rem]"> ({item.profitPercent}%)</span>
              ) : item.label == "Max Loss" &&
                item.lossPercent != null &&
                isFinite(item.lossPercent) ? (
                <span className="text-[0.6rem]"> ({item.lossPercent}%)</span>
              ) : (
                ""
              )}
            </div>
          </div>
        ))}
        <img
          src={"/svg/arrowFall.svg"}
          className="w-[1.5rem] -rotate-90 cursor-pointer 2xl:hidden"
          height={20}
          width={20}
          alt={""}
          onClick={handleNext}
        />
      </div>
    </>
  );
};
export default CardSlidder;
