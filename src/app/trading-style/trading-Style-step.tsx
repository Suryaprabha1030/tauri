import Image from "next/image";
const TradingStyleStep = (props: {
  saveTradingStyle: (style: number) => void;
}) => {
  return (
    <div className="flex-col items-center justify-center max-sm:pt-10 sm:pt-10 lg:pt-12  xl:pt-16 ">
      <div className="text-center font-semibold leading-10 text-black max-sm:text-[1.5rem]  sm:text-2xl xl:text-3xl">
        Choose your trading style
      </div>
      <div className="flex justify-center max-sm:flex-col max-sm:gap-5 max-sm:px-4 max-sm:py-7 sm:flex-row sm:gap-5 sm:px-8 sm:py-10 md:px-[3rem] lg:gap-[2rem]  xl:items-stretch xl:px-24">
        {/* First box */}
        <div className="flex flex-col  rounded-2xl border border-gray-200 shadow hover:bg-green-500 hover:bg-opacity-10 max-sm:px-10 max-sm:py-5 sm:p-5 md:p-10 xl:p-10">
          <div className="flex flex-row items-center justify-start gap-2">
            <div className="relative">
              <Image src="./svg/TrendUp.svg" height={24} width={24} alt={""} />
            </div>
            <div className="font-medium leading-normal text-black max-sm:text-[1.2rem] sm:text-base md:text-lg xl:text-2xl">
              Trader
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-3 max-sm:py-5 sm:py-5 md:py-7 xl:py-10">
            <div className="flex items-center justify-start gap-2">
              <div className="font-semibold leading-normal text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                Interests in ...
              </div>
            </div>
            <div className="flex items-center justify-start gap-2">
              <div className="relative">
                <Image src="./svg/Check.svg" height={16} width={16} alt={""} />
              </div>
              <div className="font-normal leading-normal text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                Short-term Positional Trading
              </div>
            </div>
            <div className="inline-flex items-center justify-start gap-2">
              <div className="relative">
                <Image src="./svg/Check.svg" height={16} width={16} alt={""} />
              </div>
              <div className="font-normal leading-normal text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                Swing Trading
              </div>
            </div>
            <div className="inline-flex items-center justify-start gap-2">
              <div className="relative">
                <Image src="./svg/Check.svg" height={16} width={16} alt={""} />
              </div>
              <div className="font-normal leading-normal text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                Day Trading
              </div>
            </div>
            <div className="inline-flex items-center justify-start gap-2">
              <div className="relative">
                <Image src="./svg/Check.svg" height={16} width={16} alt={""} />
              </div>
              <div className="font-normal leading-normal text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                Scalp Trading
              </div>
            </div>
            <div className="inline-flex items-center justify-start gap-2">
              <div className="relative">
                <Image src="./svg/Check.svg" height={16} width={16} alt={""} />
              </div>
              <div className="font-normal leading-normal text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                F&Os
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-start">
            <button
              className="flex items-center justify-start gap-1 rounded-3xl border border-black px-2 max-sm:py-1 lg:py-2"
              onClick={() => props.saveTradingStyle(0)}
            >
              <div className="font-medium text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                Continue
              </div>
              <div className="relative">
                <Image
                  src="./svg/ArrowRightBlack.svg"
                  height={24}
                  width={24}
                  alt={""}
                />
              </div>
            </button>
          </div>
        </div>

        {/* second box */}
        <div className="sm-py-5 flex flex-col rounded-2xl border border-gray-200 bg-white bg-opacity-10 shadow hover:bg-green-500 hover:bg-opacity-10 max-sm:px-10 max-sm:py-5 sm:p-5 md:p-10 xl:p-10">
          <div className="flex flex-row items-center justify-start gap-2">
            <div className="relative">
              <Image src="./svg/Building.svg" height={24} width={24} alt={""} />
            </div>
            <div className="font-medium leading-normal text-black max-sm:text-[1.2rem] sm:text-base  md:text-lg xl:text-2xl">
              Investor
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-3  max-sm:py-5 sm:py-5 md:py-7 xl:py-10">
            <div className="flex items-center justify-start gap-2">
              <div className="font-semibold leading-normal text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base ">
                Interests in ...
              </div>
            </div>
            <div className="flex items-center justify-start gap-2">
              <div className="relative">
                <Image src="./svg/Check.svg" height={16} width={16} alt={""} />
              </div>
              <div className="font-normal leading-normal text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                Long-term Positional Trading
              </div>
            </div>
            <div className="inline-flex items-center justify-start gap-2">
              <div className="relative">
                <Image src="./svg/Check.svg" height={16} width={16} alt={""} />
              </div>
              <div className="font-normal leading-normal text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                Equities, MF & SIP
              </div>
            </div>
            <div className="inline-flex items-center justify-start gap-2">
              <div className="relative">
                <Image src="./svg/Check.svg" height={16} width={16} alt={""} />
              </div>
              <div className="font-normal leading-normal text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                Bonds, T-Bills & More
              </div>
            </div>
          </div>
          <div className="flex flex-row items-center justify-start">
            <button
              className="flex cursor-pointer items-center justify-start gap-1 rounded-3xl border border-black px-2 max-sm:py-1 lg:py-2"
              onClick={() => props.saveTradingStyle(1)}
              // disabled
            >
              <div className="font-medium text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                Continue
              </div>
              <div className="relative">
                <Image
                  src="./svg/ArrowRightBlack.svg"
                  height={24}
                  width={24}
                  alt={""}
                />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingStyleStep;
