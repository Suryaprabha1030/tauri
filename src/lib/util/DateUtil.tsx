// src/utils/dateUtils.ts

export const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th"; // handles 11th, 12th, 13th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatExpiryDate = (expiryDate: string): any => {
  // Extract the day (first two characters) and month/year (remaining characters)
  const day: any = expiryDate && parseInt(expiryDate.slice(0, 2), 10);
  const month = expiryDate && expiryDate.slice(2, 5).toUpperCase();
  const year = expiryDate && expiryDate.slice(-4);

  return (
    <>
      {day}
      <sup>{getOrdinalSuffix(day)}</sup> {month} {year}
    </>
  );
};
export const formatExpiry = (expiryDate: string): any => {
  // Extract the day (first two characters) and month/year (remaining characters)
  const day: any = expiryDate && parseInt(expiryDate.slice(0, 2), 10);
  const month = expiryDate && expiryDate.slice(2, 5).toUpperCase();
  const year = expiryDate && expiryDate.slice(-2);

  return (
    <>
      {day}
      <sup>{getOrdinalSuffix(day)}</sup> {month} {year}
    </>
  );
};
export const formatShortDate = (dateString: string): any => {
  const date = new Date(dateString);

  // Extract day, month, and year
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const year = date.getFullYear().toString().slice(-4); // Get last two digits of the year

  return (
    <>
      {day}
      <sup>{getOrdinalSuffix(day)} </sup>
      {month} {year}
    </>
  );
};
