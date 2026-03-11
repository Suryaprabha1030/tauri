const getImageSrc = (strategyDirection: string) => {
  switch (strategyDirection) {
    case "Bullish":
      return "/svg/bull-icon.svg";
    case "Bearish":
      return "/svg/bear-icon.svg";
    case "Directional":
      return "/svg/directional.svg";
    default:
      return "/svg/target-icon.svg";
  }
};

const getTrend = (strategyDirection: string): string => {
  switch (strategyDirection.trim()) {
    case "Call Buying":
    case "Call Short Covering":
    case "Put Writing":
    case "Put Long Covering":
      return "text-z-green-500";

    case "Call Writing":
    case "Call Long Covering":
    case "Put Short Covering":
    case "Put Buying":
      return "text-red-400";

    default:
      return "text-black"; // You might want to return null here without quotes, depending on the logic
  }
};

export { getImageSrc, getTrend };
