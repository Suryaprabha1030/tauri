const SimulationSkeleton = () => {
  return (
    <div className="flex justify-center  ">
      <div className="backtesting-skeleton flex h-1/2 max-sm:w-[12rem] sm:w-[16rem] md:w-[17rem] lg:w-full flex-col items-center justify-center text-center">
        <Image
          src="/svg/simulator-skeleton.svg"
          alt=""
          className="h-5/6"
          height={1000}
          width={1000}
        />
        <div>
          <p> Use the filter above to start Simulation</p>
        </div>
      </div>
    </div>
  );
};

export default SimulationSkeleton;
