import Image from "next/image";
const BackTestingSkeleton = () => {
  return (
    <div className="backtesting-skeleton flex h-1/2 w-full flex-col items-center justify-center text-center">
      <Image
        src="/svg/backtesting-illustrator.svg"
        alt=""
        className="h-5/6"
        height={1000}
        width={1000}
      />
      <div>
        <p> Use the filter above to start Back Testing</p>
      </div>
    </div>
  );
};

export default BackTestingSkeleton;
