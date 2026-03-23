
const ShowSettings = ({
  heading,
  dataProduct,
  dataExchange,
  userName,
  clientCode,
}: any) => {
  const hideCards =
    dataExchange?.exchanges?.length === 0 || dataProduct?.products?.length === 0
      ? "hidden"
      : "";
  return (
    <span
      className={`flex w-[80%] rounded-lg bg-white shadow-strong-top max-2xl:text-standard 2xl:text-global ${hideCards}`}
    >
      <span className=" min-h-full w-[0.2rem] flex-wrap bg-z-green-400"></span>
      <span className="flex  w-full flex-col items-center justify-center py-[1rem] ">
        <span className="flex h-5 w-full items-center justify-center font-table text-z-gray-300 md:max-xl:py-6 ">
          {" "}
          {heading}
        </span>
        <span className="font-label mt-3 flex w-[90%] flex-wrap items-center justify-center gap-2 overflow-y-auto text-black md:max-xl:py-3 lg:max-xl:gap-4">
          {clientCode}
          {userName}
          {dataExchange?.exchanges?.map((exchange: string) => (
            <div
              key={exchange}
              className="  rounded-full border text-center font-letter text-black max-md:px-1 max-md:text-[0.65rem] md:max-lg:px-3 lg:max-xl:px-5 xl:px-2 "
            >
              {exchange?.toUpperCase()}
            </div>
          ))}
          {dataProduct?.products?.map((product: string, index: number) => (
            <div
              key={index}
              className="rounded-full border text-center font-letter text-black max-md:px-1 max-md:text-[0.65rem] md:w-[5rem] md:px-2"
            >
              {product}
            </div>
          ))}
        </span>
      </span>
    </span>
  );
};

export default ShowSettings;
