import Image from "next/image";
const TradingLevelStep = (props: {
  saveTradingLevel: (level: number) => void;
}) => {
  return (
    <div className="flex-col items-center justify-center max-sm:pt-10  sm:pt-16">
      <div className="text-center font-semibold leading-10 text-black max-sm:text-xl sm:text-2xl xl:text-3xl">
        Choose your trading level
      </div>
      <div className="flex gap-6  py-10 max-sm:flex-col max-sm:items-center max-sm:py-10 sm:flex-row sm:items-center sm:px-4 md:px-24 lg:items-stretch">
        <div className=" flex flex-col items-center rounded-2xl border border-gray-200 shadow hover:bg-green-500 hover:bg-opacity-10 max-sm:px-10 max-sm:py-5 sm:p-5 md:p-7 lg:p-10">
          <div className="flex flex-row items-center justify-center gap-2">
            <div className="font-medium leading-normal text-black max-sm:text-[1rem] sm:text-base md:text-lg xl:text-2xl ">
              Beginner
            </div>
          </div>
          <div className="flex flex-col items-center justify-start gap-3 py-10">
            <img src="./svg/beginner.svg" height={64} width={64} alt={""} />
          </div>

          <div className="flex flex-row items-center justify-start">
            <button
              className="flex items-center justify-start gap-1 rounded-3xl border border-black  px-2 max-sm:py-1 sm:py-1 lg:py-2"
              onClick={() => props.saveTradingLevel(0)}
            >
              <div className="font-medium text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                Continue
              </div>
              <div className="relative">
                <img
                  src="./svg/ArrowRightBlack.svg"
                  height={24}
                  width={24}
                  alt={""}
                />
              </div>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white bg-opacity-10 shadow hover:bg-green-500 hover:bg-opacity-10 max-sm:px-10 max-sm:py-5 sm:px-5 sm:py-6 md:p-8 lg:p-10">
          <div className="flex flex-row items-center justify-center gap-2">
            {/* <div className="relative">
              <img src="./svg/Building.svg" height={24} width={24} alt={""} />
            </div> */}
            <div className="font-medium leading-normal text-black max-sm:text-[1rem] sm:text-base md:text-lg xl:text-2xl">
              Intermediate
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <img src="./svg/intermediate.svg" height={64} width={64} alt={""} />
            {/* <div className="flex items-center justify-start gap-2">
              <div className="relative">
                <img src="./svg/Check.svg" height={16} width={16} alt={""} />
              </div>
              <div className="text-base font-normal leading-normal text-black">
                Stocks Scanner
              </div>
            </div>
            <div className="inline-flex items-center justify-start gap-2">
              <div className="relative">
                <img src="./svg/Check.svg" height={16} width={16} alt={""} />
              </div>
              <div className="text-base font-normal leading-normal text-black">
                Backtesting Simulator
              </div>
            </div> */}
          </div>
          <div className="flex flex-row items-center justify-start">
            <button
              className="flex items-center justify-start gap-1 rounded-3xl border border-black px-2 max-sm:py-1  sm:py-1 lg:py-2"
              onClick={() => props.saveTradingLevel(1)}
            >
              <div className="font-medium text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                Continue
              </div>
              <div className="relative">
                <img
                  src="./svg/ArrowRightBlack.svg"
                  height={24}
                  width={24}
                  alt={""}
                />
              </div>
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white bg-opacity-10 shadow hover:bg-green-500 hover:bg-opacity-10 max-sm:px-10 max-sm:py-5 sm:p-5 md:p-7 lg:p-10">
          <div className="flex flex-row items-center justify-center gap-2">
            {/* <div className="relative">
              <img src="./svg/Building.svg" height={24} width={24} alt={""} />
            </div> */}
            <div className="font-medium leading-normal text-black max-sm:text-[1rem] sm:text-base md:text-lg xl:text-2xl">
              Pro
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <img src="./svg/expert.svg" height={52} width={52} alt={""} />
            {/* <div className="flex items-center justify-start gap-2">
              <div className="relative">
                <img src="./svg/Check.svg" height={16} width={16} alt={""} />
              </div>
              <div className="text-base font-normal leading-normal text-black">
                Stocks Scanner
              </div>
            </div>
            <div className="inline-flex items-center justify-start gap-2">
              <div className="relative">
                <img src="./svg/Check.svg" height={16} width={16} alt={""} />
              </div>
              <div className="text-base font-normal leading-normal text-black">
                Backtesting Simulator
              </div>
            </div> */}
          </div>
          <div className="flex flex-row items-center justify-start">
            <button
              className="flex items-center justify-start gap-1 rounded-3xl border border-black px-2  max-sm:py-1 sm:py-1 lg:py-2"
              onClick={() => props.saveTradingLevel(1)}
            >
              <div className="font-medium text-black max-sm:text-[0.85rem] sm:text-[0.9rem] xl:text-base">
                Continue
              </div>
              <div className="relative">
                <img
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

export default TradingLevelStep;
