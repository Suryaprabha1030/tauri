import { jStat } from "jstat";

function calculateCallPrice(
  spot1: number,
  strike1: number,
  daysToExpire: number,
  impliedVolatility: number,
  interestRate: number
): number {
  // const interestRate = 0.1;
  // const impliedVolatility = 0.11;
  const T: number = daysToExpire / 365;
  const logTerm: number = Math.log(spot1 / strike1);
  const volTerm: number = 0.5 * impliedVolatility ** 2;
  const rateTerm: number = interestRate + volTerm;
  const numerator: number = logTerm + rateTerm * T;
  const denominator: number = impliedVolatility * Math.sqrt(T);
  const d1: number = numerator / denominator;
  const d2: number = d1 - impliedVolatility * Math.sqrt(T);
  const normCdfD1: number = jStat.normal.cdf(d1, 0, 1);
  const normCdfD2: number = jStat.normal.cdf(d2, 0, 1);
  const discountFactor: number = Math.exp(-interestRate * T);
  const callPrice: number =
    spot1 * normCdfD1 - strike1 * discountFactor * normCdfD2;

  return callPrice;
}

function calculatePutPrice(
  F: number,
  K: number,
  days: number,
  r: number,
  sigma: number
): number {
  const T = days / 365;
  const sqrtT = Math.sqrt(T);
  const d1 = (Math.log(F / K) + (r + 0.5 * sigma ** 2) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;
  const Nd1 = jStat.normal.cdf(-d1, 0, 1);
  const Nd2 = jStat.normal.cdf(-d2, 0, 1);

  return K * Math.exp(-r * T) * Nd2 - F * Nd1;
}

function calculateFutPrice(
  spot_price: number,
  days_to_expire: number,
  interest_rate: number
): number {
  const T = days_to_expire / 365;
  const fut_price = spot_price * Math.exp(interest_rate * T);
  return fut_price;
}

export { calculateCallPrice, calculatePutPrice };
