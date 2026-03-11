const BoxDisplayItem = (props: { label: string; value: number }) => {
  let textColor =
    props.value > 0
      ? "text-green-500"
      : props.value == 0
      ? "text-black"
      : "text-red-500";
  return (
    <div className="flex max-sm:w-40 h-15 w-52 flex-col gap-1 xl:gap-4 rounded-xl bg-z-green-300 p-2 2xl:p-4 items-center  ">
      <div className="text-sm font-semibold leading-tight text-zinc-900 max-sm:text-[0.62rem] sm:text-[0.8rem]  md:text-[0.9rem] xl:text-[0.75rem]  2xl:text-sm ">
        {props.label}
      </div>
      <div className="font-semibold leading-9 text-zinc-900 max-sm:text-[0.62rem] sm:text-[0.8rem]  md:text-[0.9rem] xl:text-[0.75rem]  2xl:text-sm ">{props.value}</div>
    </div>
  );
};
export default BoxDisplayItem;
