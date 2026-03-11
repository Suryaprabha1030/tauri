import { cardResult } from "@/lib/redux/slices/PayoffChartSlice";
import { calcNetPremium, cnd, timeToExpiry } from "./netPremium";
import config from "@/lib/config";

function analyseProfitAndLoss(
  input: any,
  dispatch: any,
  items: any,
  lotSize: number | null,
  payload: any
) {
  const result: any = {
    strategy_direction: null,
    max_profit: null,
    max_loss: null,
    risk_reward_ratio: null,
    reward_risk_ratio: null,
    breakeven_points: [] as number[],
    probabilityOfProfit: null,
  };

  if (!input || input.length < 2) return result;

  const head = input.slice(0, 2);
  const tail = input.slice(-2);

  const firstRowResult = Math.round(head[0].result);
  const secondRowResult = Math.round(head[1].result);
  const lastBeforeRowResult = Math.round(tail[0].result);
  const lastRowResult = Math.round(tail[1].result);

  const resultValues = input.map((item: any) => item.result);

  const minValue = Math.min(...resultValues);
  const maxValue = Math.max(...resultValues);

  const gteZeroRow = input.filter((row) => row.result >= 0);
  const lteZeroRow = input.filter((row) => row.result <= 0);

  result.max_profit = maxValue;
  result.max_loss = minValue;

  if (Math.abs(minValue) > 0) {
    result.reward_risk_ratio = parseFloat(
      (Math.abs(minValue) / maxValue).toFixed(2)
    );
  }

  // Simple strategy direction logic based on edge values
  if (
    firstRowResult == secondRowResult &&
    lastRowResult == lastBeforeRowResult
  ) {
    result.strategy_direction = "Neutral";

    result.max_loss = minValue;
    result.max_profit = maxValue;
  } else if (firstRowResult == secondRowResult) {
    result.strategy_direction = "Bearish";
    if (lastRowResult > lastBeforeRowResult) {
      result.max_loss = minValue;
      result.max_profit = "Unlimited";
    } else {
      result.max_loss = "Unlimited";
      result.max_profit = maxValue;
    }
  } else if (lastRowResult == lastBeforeRowResult) {
    result["strategy_direction"] = "Bullish";
    if (firstRowResult > secondRowResult) {
      result.max_loss = minValue;
      result.max_profit = "Unlimited";
    } else {
      result.max_loss = "Unlimited";
      result.max_profit = maxValue;
    }
  } else if (firstRowResult == lastRowResult) {
    result.strategy_direction = "Neutral";
    result.max_loss = minValue;
    result.max_profit = "Unlimited";
  } else if (firstRowResult < 0 && lastRowResult < 0) {
    result.strategy_direction = "Neutral";
    result.max_loss = "Unlimited";
    result.max_profit = maxValue;
  } else if (firstRowResult > 0 && lastRowResult > 0) {
    result.strategy_direction = "Neutral";
    result.max_loss = minValue;
    result.max_profit = "Unlimited";
  } else {
    result.strategy_direction = "Neutral";
    result.max_loss = "Unlimited";
    result.max_profit = "Unlimited";
  }

  if (gteZeroRow.length > 0) {
    if (firstRowResult < 0 && lastRowResult > 0) {
      result.breakeven_points = [gteZeroRow[0].strike_prices];
    } else if (firstRowResult > 0 && lastRowResult < 0) {
      result.breakeven_points = [
        gteZeroRow[gteZeroRow.length - 1].strike_prices,
      ];
    } else if (firstRowResult < 0 && lastRowResult < 0) {
      result.breakeven_points = [
        gteZeroRow[0].strike_prices,
        gteZeroRow[gteZeroRow.length - 1].strike_prices,
      ];
    } else if (
      firstRowResult > 0 &&
      lastRowResult > 0 &&
      firstRowResult !== lastRowResult
    ) {
      if (lteZeroRow.length >= 2) {
        result.breakeven_points = [
          lteZeroRow[0].strike_prices,
          lteZeroRow[lteZeroRow.length - 1].strike_prices,
        ];
      } else if (lteZeroRow.length === 1) {
        result.breakeven_points = [lteZeroRow[0].strike_prices];
      } else {
        result.breakeven_points = [0];
      }
    } else {
      result.breakeven_points = [0];
    }
  } else {
    result.breakeven_points = [0];
  }
  // -----------risk_reward_ratio

  result.max_profit =
    result.max_profit === "Unlimited"
      ? "Unlimited"
      : Number(result.max_profit?.toFixed(2));
  result.max_loss =
    result.max_loss === "Unlimited"
      ? "Unlimited"
      : Number(result?.max_loss?.toFixed(2));

  if (
    result.max_profit !== "Unlimited" &&
    result.max_loss !== "Unlimited" &&
    result.max_profit > 0
  ) {
    const ratio = Math.abs(result.max_loss / result.max_profit);
    result.risk_reward_ratio = `1 : ${ratio.toFixed(2)}`;
  }

  // ------------------pop-------------------------
  const S = payload.spotPrice;
  const T = timeToExpiry(payload.payoffExpiryDate);
  const v = config.defaultIvValue / 100;
  const r = 0.06;
  const profitableRanges: [number, number][] = [];
  const netPremium = calcNetPremium(
    items,
    timeToExpiry(payload.payoffExpiryDate),
    payload.spotPrice,
    11 / 100,
    lotSize
  );
  if (netPremium > 0) {
    // Credit strategy - profitable if price stays between B/Es
    if (result.breakeven_points.length === 2) {
      profitableRanges.push([
        Math.min(...result.breakeven_points),
        Math.max(...result.breakeven_points),
      ]);
    }
  } else {
    // Debit strategy - profitable if price is outside B/Es
    result.breakeven_points.sort((a, b) => a - b);
    if (result.breakeven_points.length === 1) {
      // Guessing direction based on strikes
      const avgStrike = items.reduce((s, i) => s + i.strike, 0) / items.length;
      if (result.breakeven_points[0] > avgStrike) {
        // Likely bullish
        profitableRanges.push([result.breakeven_points[0], Infinity]);
      } else {
        // Likely bearish
        profitableRanges.push([0, result.breakeven_points[0]]);
      }
    } else if (result.breakeven_points.length === 2) {
      profitableRanges.push([0, result.breakeven_points[0]]);
      profitableRanges.push([result.breakeven_points[1], Infinity]);
    }
  }
  if (profitableRanges.length > 0) {
    const expectedLogPrice = Math.log(S) + (r - 0.5 * v * v) * T;
    const stdDevLogPrice = v * Math.sqrt(T);
    for (const range of profitableRanges) {
      const minPrice = range[0];
      const maxPrice = range[1];
      const zMin = (Math.log(minPrice) - expectedLogPrice) / stdDevLogPrice;
      const zMax =
        maxPrice === Infinity
          ? Infinity
          : (Math.log(maxPrice) - expectedLogPrice) / stdDevLogPrice;
      const pMin = minPrice <= 0 ? 0 : cnd(zMin);
      const pMax = maxPrice === Infinity ? 1 : cnd(zMax);
      result.probabilityOfProfit += pMax - pMin;
      result.probabilityOfProfit = Math.round(result.probabilityOfProfit * 100);
    }
  }

  // console.log(result, "result");
  return dispatch(cardResult(result));
}

export { analyseProfitAndLoss };
