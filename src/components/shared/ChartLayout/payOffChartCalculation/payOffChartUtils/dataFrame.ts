function dataFrameData(
  spotPrice: number,
  incrementer: number,
  spotPriceRoundoff: number,
  plot_increment: number,
  strikePrice: number,
  premium: number,
  lotSize: number,
  lots: number
): any {
  const start_range = spotPrice - 20 * incrementer;
  const end_range = spotPrice + 20 * incrementer;
  const sp_start_range = spotPriceRoundoff - 20 * incrementer;
  const sp_end_range = spotPriceRoundoff + 20 * incrementer;

  const generateSeries = (
    start: number,
    end: number,
    increment: number
  ): number[] => {
    const series: any = [];
    for (let i = start; i <= end; i += increment) {
      series.push(i);
    }
    return series;
  };

  const data = {
    spot_price: generateSeries(
      start_range,
      end_range + incrementer,
      plot_increment
    ),
    strike_prices: generateSeries(
      sp_start_range,
      sp_end_range + incrementer,
      plot_increment
    ),
    strike_price: strikePrice,
    premium: premium,
    lot_size: lotSize,
    quantity: lots,
  };

  return data;
}

function dataFrameData2(
  spotPrice: number,
  incrementer: number,
  spotPriceRoundoff: number,
  plot_increment: number,
  strikePrice: number,
  premium: number,
  lotSize: number,
  lots: number
): any {
  const start_range = spotPrice - 20 * incrementer;
  const end_range = spotPrice + 20 * incrementer;
  const sp_start_range = spotPriceRoundoff - 20 * incrementer;
  const sp_end_range = spotPriceRoundoff + 20 * incrementer;
  const startRangePremium = -(20 * incrementer);
  const endRangePremium = 20 * incrementer;

  const generateSeries = (
    start: number,
    end: number,
    increment: number
  ): number[] => {
    const series: any = [];
    for (let i = start; i <= end; i += increment) {
      series.push(i);
    }
    return series;
  };

  const data = {
    spot_price: generateSeries(
      start_range,
      end_range + incrementer,
      plot_increment
    ),
    strike_prices: generateSeries(
      sp_start_range,
      sp_end_range + incrementer,
      plot_increment
    ),
    premium: generateSeries(
      startRangePremium,
      endRangePremium + incrementer,
      plot_increment
    ),
    lot_size: lotSize,
    quantity: lots,
  };

  return data;
}

function validateDataFrameResults(dataFrameResult: any[]): any[] {
  const result: any[] = [];
  const flattened = dataFrameResult.map((item) => item[0]);
  flattened.forEach((df, dfNo) => {
    df.forEach((row, i) => {
      if (!result[i]) {
        result[i] = {
          result: +(row.result?.toFixed(2) || 0),
          spot_price: +(row.spot_price?.toFixed(2) || 0),
          strike_prices: +(row.strike_prices?.toFixed(2) || 0),
        };
      } else {
        result[i].result += +(row.result?.toFixed(2) || 0);
      }
    });
  });

  return result;
}

function mergeDataArrays(
  arr1: any[],
  arr2: any[],
  key: string,
  suffix1: string,
  suffix2: string
): any[] {
  return arr1.map((item1) => {
    const item2 = arr2.find((item) => item[key] === item1[key]);
    if (item2) {
      const merged = { [key]: item1[key] };
      for (const k in item1) {
        if (k !== key) merged[k + suffix1] = item1[k];
      }
      for (const k in item2) {
        if (k !== key) merged[k + suffix2] = item2[k];
      }
      return merged;
    }
    return null;
  });
}

function addSuffix(arr: any[], excludeKey: string, suffix: string): any[] {
  return arr.map((obj) => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        return key === excludeKey ? [key, value] : [`${key}${suffix}`, value];
      })
    );
  });
}

export {
  mergeDataArrays,
  validateDataFrameResults,
  dataFrameData,
  addSuffix,
  dataFrameData2,
};
