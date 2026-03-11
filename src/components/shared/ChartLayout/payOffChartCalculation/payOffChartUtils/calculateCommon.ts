function findNearestValue(arr: number[], target: number): number {
  let nearestValue = arr[0];
  let minDiff = Math.abs(target - nearestValue);

  for (let i = 1; i < arr.length; i++) {
    const diff = Math.abs(target - arr[i]);
    if (diff < minDiff) {
      nearestValue = arr[i];
      minDiff = diff;
    }
  }

  return nearestValue;
}

function getNearestMultiple(value: number, base: number) {
  return Math.round(value / base) * base;
}

function daysUntilExpiry(dateStr: string): any {
  const monthMap: { [key: string]: number } = {
    JAN: 0,
    FEB: 1,
    MAR: 2,
    APR: 3,
    MAY: 4,
    JUN: 5,
    JUL: 6,
    AUG: 7,
    SEP: 8,
    OCT: 9,
    NOV: 10,
    DEC: 11,
  };

  const day = parseInt(dateStr.slice(0, 2), 10);
  const monthAbbr = dateStr.slice(2, 5).toUpperCase();
  const year = parseInt(dateStr.slice(5), 10);
  const month = monthMap[monthAbbr];

  if (month === undefined) {
    return;
  }

  const expiryDate: any = new Date(year, month, day);
  const currentDate: any = new Date();
  expiryDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  const msInDay = 24 * 60 * 60 * 1000;
  const daysLeft = Math.floor((expiryDate - currentDate) / msInDay);
  let dayLeft = 1;
  if (daysLeft > 0) {
    dayLeft = daysLeft;
  }
  return dayLeft;
}

function customRound(number: number, decimals: number): number {
  const factor: number = Math.pow(10, decimals);
  return Math.round((number + 1e-13) * factor) / factor;
}

function getCommonStrikeObjects(commonArray: any, strikeArray: any) {
  const strikeSet = new Set(strikeArray.map((item: any) => item.strike_price));

  return commonArray.filter((item: any) => strikeSet.has(item.strike_price));
}

function mergeDataArrays(
  arr1: any,
  arr2: any,
  key: any,
  suffix1: any,
  suffix2: any
) {
  return arr1
    .map((item1) => {
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
    })
    .filter(Boolean);
}

function getCurrentFormattedDate() {
  const date = new Date();
  const day = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const year = date.getFullYear();
  return `${day}${month}${year}`;
}
export {
  findNearestValue,
  daysUntilExpiry,
  customRound,
  getCommonStrikeObjects,
  mergeDataArrays,
  getNearestMultiple,
  getCurrentFormattedDate,
};
