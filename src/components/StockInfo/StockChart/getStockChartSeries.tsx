export const getStockChartSeries = (
  formattedData: {
    value: number;
    volume: number;
  }[],
  showVolume: boolean
) => {
  const series = [
    {
      name: "Price",
      type: "area",
      data: formattedData.map((d) => d?.value),
    },
  ];

  if (showVolume) {
    series.push({
      name: "Volume",
      type: "bar",
      data: formattedData.map((d) => d?.volume),
    });
  }

  return series;
};
