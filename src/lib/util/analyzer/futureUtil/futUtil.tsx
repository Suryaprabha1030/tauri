const getFutBuyClassLive = (
  commonData: Record<string, any>,
  hashKey: string
) => {
  if (commonData[hashKey] && commonData[hashKey].transaction_type === "LONG") {
    return " w-5 h-5 inline-flex justify-center items-center px-2 shadow rounded-md border border-z-green-500 bg-z-green-500 text-white";
  }
  return "w-5 h-5 inline-flex justify-center items-center px-2 shadow-strong-top rounded   px-1";
};
const getFutSellClassLive = (
  commonData: Record<string, any>,
  hashKey: string
) => {
  //  console.log(commonData,hashKey,"prabha")
  if (commonData[hashKey] && commonData[hashKey].transaction_type === "SHORT") {
    return "ml-1 w-5 h-5 inline-flex justify-center items-center px-2 shadow-strong-top rounded border border-red-500 bg-red-500 text-white";
  }
  return "ml-1  w-5 h-5 inline-flex justify-center items-center px-2 shadow-strong-top rounded  px-1";
};

export { getFutBuyClassLive, getFutSellClassLive };
