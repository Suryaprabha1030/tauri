

export default function BuySellDisplay({ transactionType }:any) {
  return (
    <span
      className={`text-left sm:max-md:w-[2rem] md:max-xl:w-[2.2rem] xl:w-[2.5rem] ${
        transactionType === "LONG" || transactionType === "BUY"
          ? "text-z-green-500"
          : "text-red-500"
      }`}
    >
      {transactionType === "LONG" || transactionType === "BUY" ? "BUY" : "SELL"}
    </span>
  );
}
