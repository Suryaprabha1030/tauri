export const getColorClass = (percent: number) => {
  const abs = Math.abs(percent);

  if (percent > 0) {
    if (abs > 0 && abs <= 0.1) return "bg-z-green-scale-100";
    if (abs > 0.1 && abs <= 0.2) return "bg-z-green-scale-200";
    if (abs > 0.2 && abs <= 0.5) return "bg-z-green-scale-300";
    if (abs > 0.5 && abs <= 1) return "bg-z-green-scale-400";
    if (abs > 1 && abs <= 2) return "bg-z-green-scale-500"; // optional custom value
    if (abs > 2 && abs <= 3) return "bg-z-green-scale-600";
    if (abs > 3 && abs <= 4) return "bg-z-green-scale-800"; // optional
    if (abs > 4 && abs <= 6) return "bg-z-green-scale-800";
    if (abs > 6 && abs <= 7) return "bg-z-green-scale-900"; // optional
    if (abs > 7) return "bg-z-green-scale-1000";
  }
  if (percent < 0) {
    if (abs > 0 && abs <= 0.1) return "bg-z-red-scale-300";
    if (abs > 0.1 && abs <= 0.2) return "bg-z-red-scale-400";
    if (abs > 0.2 && abs <= 0.5) return "bg-z-red-scale-500";
    if (abs > 0.5 && abs <= 1) return "bg-z-red-scale-600";
    if (abs > 1 && abs <= 2) return "bg-z-red-scale-700";
    if (abs > 2 && abs <= 3) return "bg-z-red-scale-800";
    if (abs > 3 && abs <= 4) return "bg-z-red-scale-900";
    if (abs > 4) return "bg-z-red-scale-1000";
  }

  return "bg-white";
};

export function getMarketSentiment(data: any) {
  if (Object.entries(data).length == 0) {
    return;
  }
  const keys = Object.keys(data);
  const peCount = keys.filter((key) => key.endsWith("PE")).length;
  const ceCount = keys.filter((key) => key.endsWith("CE")).length;

  if (ceCount > peCount) return "Bearish";
  if (ceCount < peCount) return "Bullish";
  return "Neutral";
}
export function getMarketSentimentColor(data: any) {
  if (Object.entries(data).length == 0) {
    return;
  }
  const keys = Object.keys(data);
  const peCount = keys.filter((key) => key.endsWith("PE")).length;
  const ceCount = keys.filter((key) => key.endsWith("CE")).length;

  if (ceCount > peCount) return "text-red-400";
  if (ceCount < peCount) return "text-z-green-500";
  return "text-black";
}
