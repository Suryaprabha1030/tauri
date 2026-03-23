const getYAxisTicks = (min: number, max: number) => {
  const totalTicks = 6; // always show 6 ticks
  const sideTicks = (totalTicks - 1) / 2; // top 3 & bottom 3 ticks

  const maxAbs = Math.max(Math.abs(min), Math.abs(max));

  // Find nearest rounded gap
  let gap = Math.ceil(maxAbs / sideTicks / 1000) * 1000;

  // If gap too large → adjust smaller
  while (gap * sideTicks > maxAbs + 1000) {
    gap -= 1000;
  }

  const ticks: number[] = [];

  // Lower ticks
  for (let i = sideTicks; i >= 1; i--) {
    ticks.push(-gap * i);
  }

  // Always include 0
  ticks.push(0);

  // Upper ticks
  for (let i = 1; i <= sideTicks; i++) {
    ticks.push(gap * i);
  }

  return ticks;
};

const sortKey = [
  { label: "Date", key: "fii.date" },
  { label: "FII Buy", key: "fii.buy_value" },
  { label: "FII Sell", key: "fii.sell_value" },
  { label: "FII Net", key: "fii.net_value" },
  { label: "DII Buy", key: "dii.buy_value" },
  { label: "DII Sell", key: "dii.sell_value" },
  { label: "DII Net", key: "dii.net_value" },
];

const parseDate = (dateStr: any) => {
  const [day, month, year] = dateStr.split("-");

  const months:any = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  return new Date(`${year}-${months[month]}-${day}`).getTime();
};
// sorting

function getMonthsFromMay2025() {
  const startDate = new Date(2025, 2); // May is month 4 (0-based index)
  const now = new Date();
  const result: string[] = [];

  while (
    startDate.getFullYear() < now.getFullYear() ||
    (startDate.getFullYear() === now.getFullYear() &&
      startDate.getMonth() <= now.getMonth())
  ) {
    const month: string = startDate.toLocaleString("default", {
      month: "long",
    });

    const year = startDate.getFullYear();
    result.push(`${month}${year}`);
    startDate.setMonth(startDate.getMonth() + 1);
  }

  return result;
}

export { getYAxisTicks, sortKey, parseDate, getMonthsFromMay2025 };
