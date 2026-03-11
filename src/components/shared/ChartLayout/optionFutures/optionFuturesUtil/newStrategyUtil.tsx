import config from "@/lib/config";

const calculateHCF = (numbers: number[]): number => {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  return numbers.reduce(gcd);
};

const updateTransactionType = (
  data: any,
  key: any,
  newValue: string,
  button: string
) => {
  const updatedData = { ...data };

  if (updatedData[key]) {
    // Ensure the specific item's transaction_type is updated to the newValue
    updatedData[key] = {
      ...updatedData[key],
      transaction_type: newValue,
      button_type: button,
    };
  }
  return updatedData;
};

const updateStrikePrice = (
  data: any,
  oldKey: any,
  newKey: any,
  transactionType: string,
  optionChainData: any,
  isFromPosition: any,
  webSocketDataRead: any
) => {
  const lotData = data;
  const entries = Object.entries(data);
  const updatedEntries: [string, any][] = [];
  const string = newKey;
  const part = string.split(".");
  const firstPart = part[0];

  const str = newKey;
  const parts = str.split("#");
  const secondPart = parts[1];
  const strz = newKey;
  const partsz = strz.split("#");
  const third = parts[2];

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];

    // const values = optionChainData && optionChainData[third][`${firstPart}.0`];
    const values = optionChainData?.[third]?.[`${firstPart}.0`];

    const optionTypeData = values?.filter(
      (item: any) => item.option_type === secondPart
    );

    const data: any = optionTypeData && { ...optionTypeData[0] };
    data.lots = lotData?.[oldKey]?.lots;
    data.transaction_type = transactionType;
    data.target_ltp = webSocketDataRead[data?.identifier];
    data.ivValue = lotData?.[oldKey]?.ivValue;
    if (isFromPosition) {
      data.product = lotData?.[oldKey]?.product;
    }

    if (key === oldKey) {
      updatedEntries.push([newKey, { ...data }]);
    } else {
      if (!isFromPosition) {
        updatedEntries.push([key, value]);
      }
    }
  }

  return Object.fromEntries(updatedEntries);
};

const updateOptionType = (
  // data: any,
  oldKey: any,
  newKey: any,
  transactionType: string,
  optionChainData: any,
  optionDatas: any,
  lotsSize: any
) => {
  const entries = Object.entries(optionDatas);
  const updatedEntries: [string, any][] = [];

  const input = newKey;
  const spiltparts = input.split("#");
  const [price, optionType, expiryDate] = spiltparts;

  if (price === "max") {
    return 1;
  }

  if (optionDatas[input]) {
    return optionDatas; // Return the original data if keys are equal
  }

  for (let i = 0; i < entries.length; i++) {
    const [key, value] = entries[i];
    const values = optionChainData?.[expiryDate]?.[price];

    const optionTypeData = values?.filter(
      (item: any) => item.option_type === optionType
    );
    const updatedData = { ...optionTypeData[0] };
    updatedData.lots = 1;
    updatedData.lot_size = lotsSize;
    updatedData.transaction_type = transactionType;
    updatedData.target_ltp = updatedData.ltp;
    updatedData.ivValue = config.defaultIvValue;

    if (key === oldKey) {
      updatedEntries.push([newKey, { ...updatedData }]);
    } else {
      updatedEntries.push([key, value]);
    }
  }

  return Object.fromEntries(updatedEntries);
};

const getMinimumExpiryDate = (
  data: { [key: string]: any } | any[]
): Date | null => {
  if (
    !data ||
    (Array.isArray(data) ? data.length === 0 : Object.keys(data).length === 0)
  ) {
    return null;
  }

  const monthMap: { [key: string]: number } = {
    jan: 0,
    feb: 1,
    mar: 2,
    apr: 3,
    may: 4,
    jun: 5,
    jul: 6,
    aug: 7,
    sep: 8,
    oct: 9,
    nov: 10,
    dec: 11,
  };

  const isArray = Array.isArray(data);
  const expiryDates = (isArray ? data : Object.values(data))
    .map((item) => {
      const expiryStr = item.expiry || item.expiry_date;
      if (!expiryStr) return null;

      // Extract day, month, and year from format "27feb2024"
      const match = expiryStr.match(/^(\d{1,2})([a-zA-Z]+)(\d{4})$/);
      if (!match) return null;
      const [, day, monthStr, year] = match;
      const month = monthMap[monthStr.toLowerCase()];
      if (month === undefined) return null;

      return new Date(parseInt(year), month, parseInt(day));
    })
    .filter((date): date is Date => date !== null); // Remove null values

  if (expiryDates.length === 0) {
    return null; // No valid dates
  }

  return new Date(Math.min(...expiryDates.map((date) => date.getTime())));
};

const hcfOfTwoNumbers = (x: any, y: any): any => {
  if (!y) return x;
  return hcfOfTwoNumbers(y, x % y);
};

// const convertToStockArray = (data: Record<string, any>, brokerId: any) => {
//   return Object.values(data).map((item: any) => ({
//     exchange: "NFO",
//     tradingsymbol: item.symbol,
//     quantity: brokerId == 1 ? item.lots * item.lots : item.lots * item.lot_size,
//     transactiontype: item.button_type
//       ? item.button_type
//       : item.transaction_type == "LONG"
//         ? "BUY"
//         : "SELL",
//     ordertype: "MARKET",
//     producttype: "NRML",
//   }));
// };

const lotNumbers = Array(20)
  .fill(0)
  .map((_, i) => i);

export {
  calculateHCF,
  updateTransactionType,
  updateStrikePrice,
  updateOptionType,
  getMinimumExpiryDate,
  hcfOfTwoNumbers,
  // convertToStockArray,
  lotNumbers,
};
