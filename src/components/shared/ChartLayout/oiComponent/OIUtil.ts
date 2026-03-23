const getOIHashKey = (
  key: string,
  optionType: string,
  expiry: string,
  tableName: any
) => {
  return `${key}#${optionType}#${expiry}#${tableName}`;
};

const getOIRadioHashKey = (key: string, expiry: string, tableName: any) => {
  return `${key}#${expiry}#${tableName}`;
};
const extractTime = (dateTimeString: any) => {
  return dateTimeString.split("T")[1]; // Split the string at 'T' and return the time part
};

export function formatDateToCustomString(utcDate: string): string {
  if (!utcDate) return "Invalid Date";

  const date = new Date(utcDate);

  if (isNaN(date.getTime())) return "Invalid Date"; // Handle invalid dates

  // Convert UTC time to IST manually
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const istDate = new Date(date.getTime() + istOffset);

  const formattedDate = istDate.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return formattedDate.replace(",", ""); // Remove comma for cleaner format
}

function getCEPEPairs(chartData: any) {
  if (!chartData || chartData.length === 0) {
    return [];
  }

  const ceData: any[] = [];
  const peData: any[] = [];

  // Iterate over chartData to extract CE and PE data from the nested data array
  chartData.forEach((item: any) => {
    item.forEach((dataItem: any) => {
      if (dataItem.optiontype === "CE") {
        ceData.push({ ...dataItem, created_time: item.created_time });
      } else if (dataItem.optiontype === "PE") {
        peData.push({ ...dataItem, created_time: item.created_time });
      }
    });
  });

  // Combine CE and PE data based on created_time
  const combinedData = ceData.map((ce) => {
    const matchingPE = peData.find((pe) => pe.created_time === ce.created_time);
    return matchingPE ? [ce.oi, matchingPE.oi] : [ce.oi, null];
  });

  return combinedData;
}

// Example usage
function formatTimestampToReadable(timestamps: any) {
  return timestamps.map((timestamp: any) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const options: any = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    };
    const time = date.toLocaleTimeString("en-US", options);
    return `${day} ${month} ${time}`;
  });
}

function formatSingleTimestampToReadable(timestamp: any) {
  const date = new Date(timestamp);
  const day = date.getUTCDate(); // Use UTC date
  const month = date.toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });

  const options: any = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC", // Ensure the time is in UTC
  };

  const time = date.toLocaleTimeString("en-US", options);

  return `${day} ${month} ${time}`;
}

const formatValue = (value: any) => {
  if (Math.abs(value) >= 10000000) {
    return (value / 10000000).toFixed(2) + "Cr";
  } else if (Math.abs(value) >= 100000) {
    return (value / 100000).toFixed(2) + "L";
  } else {
    return value;
  }
};

const LableformatValue = (value: any) => {
  if (typeof value === "string") {
    value = parseFloat(value);
  }
  if (Math.abs(value) >= 1e7) {
    return (value / 10000000)?.toFixed(0) + "Cr";
  } else if (Math.abs(value) >= 1e5) {
    return (value / 100000)?.toFixed(0) + "L";
  } else {
    return value?.toFixed(0);
  }
};
const generateColorFromStrikePrice = (strikePrice: any) => {
  let hash = 0;
  for (let i = 0; i < strikePrice.length; i++) {
    hash = strikePrice.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0"); // Convert to hex and ensure 2 digits
  }

  // If the generated color is #808080 (gray) or #ffc40c (yellow), generate a new color
  if (
    color === "#000000" ||
    color === "#ffc40c" ||
    color === "#FFFD37" ||
    color === "#FFA500" ||
    color === "#008000"
  ) {
    color = generateColorFromStrikePrice(strikePrice + "1"); // Slightly alter strikePrice to change hash
  }

  return color;
};

const extractStrikePricesAsNumber = (data: any) => {
  return data.map((item: any) => {
    const [strikePrice] = item.split("#"); // Split the string by '#' and get the first part
    return parseInt(strikePrice, 10); // Convert the string to a number
  });
};

function payloadConvertDecimalToTime(decimalTime: any) {
  const hours = Math.floor(decimalTime); // Get the integer part (hours)
  const minutes = Math.round((decimalTime - hours) * 60); // Convert decimal part to minutes
  return `${hours}:${minutes.toString().padStart(2, "0")}`; // Return formatted time
}

function convertStrikePriceOption(strikePriceOption: any) {
  return strikePriceOption?.replace("#", "");
}
function generateOptionLabels(strikePrice: any) {
  return [`${Math.floor(strikePrice)}PE`, `${Math.floor(strikePrice)}CE`];
}

function StranglePayloadData(data: any) {
  return data.map((item: any) => {
    const [price, optionType] = item.split("#");
    return `${parseFloat(price)}${optionType}`;
  });
}

function straddleTabPayload(payload: any) {
  let output: any = [];

  for (const key in payload) {
    if (payload[key]) {
      const parts = key.split("#"); // Split the key by '#'
      const [strikePrice, optionType] = parts; // Extract the strike price and option type

      // Remove the '.0' part from the strike price using replace
      const cleanedStrikePrice = strikePrice.replace(".0", "");

      // const cleanedStrikePrice = strikePrice
      if (optionType === "CE") {
        output.push(`${cleanedStrikePrice}CE`);
      } else if (optionType === "PE") {
        output.push(`${cleanedStrikePrice}PE`);
      } else {
        // If neither CE nor PE is present, add both CE and PE
        output.push(`${cleanedStrikePrice}CE`, `${cleanedStrikePrice}PE`);
      }
    }
  }

  return output; // Return the result as an array
}
function extractSumFalseData(data: any) {
  const output: any = {};

  // Helper function to add or update strike price entries
  const addLtp = (strikePriceKey: any, ltpValue: any) => {
    if (!output[strikePriceKey]) {
      output[strikePriceKey] = { strikePrice: strikePriceKey, ltp: [] };
    }
    output[strikePriceKey].ltp.push(ltpValue);
  };

  // Process CE (Call Option) data
  data.forEach((d: any) => {
    if (Array.isArray(d.ce_ltp)) {
      d.ce_ltp.forEach((item: any) => {
        const strikePriceKey = `${item.strike_price}CE`;
        addLtp(strikePriceKey, { [item.created_at]: item.ltp });
      });
    }
  });

  // Process PE (Put Option) data
  data.forEach((d: any) => {
    if (Array.isArray(d.pe_ltp)) {
      d.pe_ltp.forEach((item: any) => {
        const strikePriceKey = `${item.strike_price}PE`;
        addLtp(strikePriceKey, { [item.created_at]: item.ltp });
      });
    }
  });

  // Convert output object to array
  return Object.values(output);
}

function extractSumFalseData2(data: any) {
  const output: any = {};

  // Helper function to add or update strike price entries
  const addLtp = (
    strikePriceKey: string,
    createdAt: string,
    ltpValue: number
  ) => {
    if (!output[strikePriceKey]) {
      output[strikePriceKey] = { strikePrice: strikePriceKey, ltp: [] };
    }
    output[strikePriceKey].ltp.push({ [createdAt]: ltpValue });
  };

  data.forEach((d:any) => {
    // Debug: Check if it exists
    let created_at = d?.created_at;
    if (!d.created_at) {
      return;
    }

    if (Array.isArray(d?.ce_ltp)) {
      d.ce_ltp.forEach((item:any) => {
        const strikePriceKey = `${item?.strike_price}#CE`;
        addLtp(strikePriceKey, created_at, item.ltp);
      });
    }
  });

  // Process PE (Put Option) data
  data.forEach((d:any) => {
    let created_at = d?.created_at;
    if (Array.isArray(d?.pe_ltp)) {
      d.pe_ltp.forEach((item:any) => {
        const strikePriceKey = `${item?.strike_price}#PE`;
        addLtp(strikePriceKey, created_at, item.ltp);
      });
    }
  });

  // Convert output object to array
  return Object.values(output);
}

const FIIformatValue = (value: any) => {
  if (Math.abs(value) >= 1e7) {
    return (value / 10000000).toFixed(0) + "Cr";
  } else if (Math.abs(value) >= 1e5) {
    return (value / 100000).toFixed(0) + "L";
  } else if (Math.abs(value) >= 1e3) {
    return (value / 1000).toFixed(0) + "K";
  } else {
    return value;
  }
};

export {
  getOIHashKey,
  extractTime,
  getCEPEPairs,
  formatTimestampToReadable,
  formatSingleTimestampToReadable,
  formatValue,
  LableformatValue,
  generateColorFromStrikePrice,
  extractStrikePricesAsNumber,
  payloadConvertDecimalToTime,
  convertStrikePriceOption,
  generateOptionLabels,
  getOIRadioHashKey,
  StranglePayloadData,
  straddleTabPayload,
  extractSumFalseData,
  extractSumFalseData2,
  FIIformatValue,
};
