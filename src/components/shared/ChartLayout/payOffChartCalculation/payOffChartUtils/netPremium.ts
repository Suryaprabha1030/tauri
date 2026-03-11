// Calculate Net Premium
const futFlattenTransformData = (groupedData: any) => {
  const flatArray: any[] = [];

  for (const [transactionType, optionGroups] of Object.entries(groupedData)) {
    for (const [optionType, items] of Object.entries(optionGroups as any)) {
      for (const item of items as any[]) {
        const strike =
          item?.strike || item?.strike_price || item?.StrikePrice || null;

        flatArray.push({
          ...item,
          strike,
          optionType,
          transaction_type: transactionType,
        });
      }
    }
  }

  return flatArray;
};

const cnd = (x: number): number => {
  console.log("x value in CND function:", x, typeof x);

  const a1 = 0.31938153;
  const a2 = -0.356563782;
  const a3 = 1.781477937;
  const a4 = -1.821255978;
  const a5 = 1.330274429;
  const gamma = 0.2316419;

  const k = 1.0 / (1.0 + gamma * Math.abs(x));
  const w = (1.0 / Math.sqrt(2.0 * Math.PI)) * Math.exp((-x * x) / 2);

  if (x >= 0) {
    return (
      1.0 -
      w *
        (a1 * k +
          a2 * k * k +
          a3 * Math.pow(k, 3) +
          a4 * Math.pow(k, 4) +
          a5 * Math.pow(k, 5))
    );
  }
  return 1.0 - cnd(-x);
};

function erf(x: number): number {
  // Abramowitz & Stegun approximation (good accuracy)
  const sign = x < 0 ? -1 : 1;
  const a1 = 0.254829592,
    a2 = -0.284496736,
    a3 = 1.421413741,
    a4 = -1.453152027,
    a5 = 1.061405429;
  const absX = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * absX);
  const y =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);
  return sign * y;
}

function normCdf(x: number): number {
  return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

function normPdf(x: number): number {
  return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
}

/**
 * Ensure a minimum T (1 day) if expiry is today or in the past.
 * expiryDate: any date string accepted by `new Date(...)`
 */
function timeToExpiry(expiryDate: string | Date): number {
  const expiry = new Date(expiryDate).getTime();
  const now = Date.now();
  const diffDays = (expiry - now) / (1000 * 60 * 60 * 24);
  // If expiry is today or in past, assume 1 day left (Sen-sibull-style)
  return Math.max(diffDays / 365, 0.5 / 365);
}

function calculateBlackScholes(
  S: number, // spot price
  K: number, // strike price
  optionType: "CE" | "PE" | "CALL" | "PUT" | string,
  T: number, // time to expiry in years
  sigma: number, // volatility as decimal (e.g. 0.11 for 11%)
  r = 0.06 // risk-free rate as decimal (e.g. 0.05 for 5%)
): { price: number | null; greeks: any } {
  // Normalize optionType
  const isCall = optionType.toUpperCase().startsWith("C");

  // input guards
  if (K <= 0 || S <= 0) {
    // throw new Error("S and K must be > 0");
    return {
      price: null,
      greeks: { delta: null, gamma: null, vega: null, theta: null, rho: null },
    };
  }

  // const Tsafe = Math.max(T, 1 / 365);
  const Tsafe = T;

  if (sigma <= 0) {
    // zero vol => intrinsic pricing, Greeks mostly zero (except delta)
    const intrinsic = isCall ? Math.max(0, S - K) : Math.max(0, K - S);
    const delta = isCall ? (S > K ? 1 : 0) : S < K ? -1 : 0;
    return {
      price: intrinsic,
      greeks: { delta, gamma: 0, vega: 0, theta: 0, rho: 0 },
    };
  }

  const d1 =
    (Math.log(S / K) + (r + 0.5 * sigma * sigma) * Tsafe) /
    (sigma * Math.sqrt(Tsafe));
  const d2 = d1 - sigma * Math.sqrt(Tsafe);

  const Nd1 = normCdf(d1);
  const Nd2 = normCdf(d2);
  const Nnegd1 = normCdf(-d1);
  const Nnegd2 = normCdf(-d2);
  const pdfd1 = normPdf(d1);

  const discK = K * Math.exp(-r * Tsafe);

  // price
  const callPrice = S * Nd1 - discK * Nd2;
  const putPrice = discK * Nnegd2 - S * Nnegd1;
  const price = isCall ? callPrice : putPrice;

  // Greeks (raw theoretical):
  const delta = isCall ? Nd1 : Nd1 - 1; // call: N(d1), put: N(d1)-1 (negative)
  const gamma = pdfd1 / (S * sigma * Math.sqrt(Tsafe)); // per 1 unit move in S
  const vega_full = S * pdfd1 * Math.sqrt(Tsafe); // vega for 1.0 = 100% vol change
  const vega_per_1pct = vega_full / 100; // Sensibull-style: per 1 percentage point in IV

  // Theta (annual)
  const thetaAnnual_common = -(S * pdfd1 * sigma) / (2 * Math.sqrt(Tsafe));
  const thetaAnnual_call = thetaAnnual_common - r * discK * Nd2;
  const thetaAnnual_put = thetaAnnual_common + r * discK * Nnegd2;
  const thetaAnnual = isCall ? thetaAnnual_call : thetaAnnual_put;

  // Sensibull displays theta as points PER DAY:
  const thetaPerDay = thetaAnnual / 365;

  // Rho: sensitivity to absolute rate (per 1.0 = 100% change) -> convert to per 1%: divide by 100
  const rho_full = isCall
    ? K * Tsafe * discK * Nd2
    : -K * Tsafe * discK * Nnegd2;
  const rho_per_1pct = rho_full / 100;

  // Round to sensible display digits (match trading UI)
  const round = (x: number, dp = 4) =>
    Math.round(x * Math.pow(10, dp)) / Math.pow(10, dp);

  return {
    price: Math.round(price * 100) / 100, // price rounded to 2 decimals
    greeks: {
      delta: round(delta, 4),
      gamma: round(gamma, 4), // gamma often small -> show 6 decimals
      vega: round(vega_per_1pct, 6), // per 1% vol
      theta: round(thetaPerDay, 4), // per day
      rho: round(rho_per_1pct, 4), // per 1% rate change
    },
  };
}

const calcNetPremium = (
  items: any,
  timeToExpiry: any,
  underlyingPrice: any,
  volatility: any,
  lotSize: any
) => {
  const netPremium = items?.reduce((total, item) => {
    const { price, greeks }: any = calculateBlackScholes(
      underlyingPrice,
      item.strike,
      item.option_type,
      timeToExpiry,
      volatility
    );

    // const premium = price * lotSize * item.quantity;

    const premium = price * lotSize * item.lots;

    return item.transactionType === "LONG" ? total - premium : total + premium;
  }, 0);

  return netPremium;
};

export {
  timeToExpiry,
  calcNetPremium,
  calculateBlackScholes,
  futFlattenTransformData,
  cnd,
};
