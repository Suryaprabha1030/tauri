export const ChartLabelFormatNumber = (number: any) => {
  if (number == null || isNaN(number)) {
    return ""; // Return an empty string or any default value for invalid input
  }

  const absNumber = Math.abs(number); // Get the absolute value of the number
  const sign = number < 0 ? "-" : ""; // Determine if the number is negative

  if (absNumber >= 1e7) {
    return `${sign}${(absNumber / 1e7).toFixed(0).replace(/\.?0+$/, "")}Cr`;
  } else if (absNumber >= 1e5) {
    return `${sign}${(absNumber / 1e5).toFixed(0).replace(/\.?0+$/, "")}L`; // Lakh
  } else if (absNumber >= 1e4) {
    return `${sign}${(absNumber / 1e4).toFixed(0).replace(/\.?0+$/, "")}K`; // Thousand
  } else {
    return `${sign}${Math.ceil(absNumber / 1000) * 1000}`; // Less than a Lakh
  }
};

export const validateNumericInput = (value: any) => {
  return /^(\d+(\.\d{0,2})?)?$/.test(value);
};
