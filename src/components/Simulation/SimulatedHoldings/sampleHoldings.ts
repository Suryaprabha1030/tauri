"use client";

export type SeedHolding = {
  identifier: string;
  avg: number;
  qty: number;
};

/* ---------------- SMALL CAP (Short Term >5L) ---------------- */

export const shortTermInvestor: SeedHolding[] = [
  { identifier: "NSE:SUZLON", avg: 45, qty: 500 },
  { identifier: "NSE:RPOWER", avg: 38, qty: 400 },
  { identifier: "NSE:IDEA", avg: 12, qty: 800 },
];

/* ---------------- LARGE CAP (Long Term >20L) ---------------- */

export const longTermInvestor: SeedHolding[] = [
  { identifier: "NSE:TCS", avg: 3800, qty: 50 },
  { identifier: "NSE:INFY", avg: 1450, qty: 80 },
  { identifier: "NSE:HDFCBANK", avg: 1600, qty: 100 },
];

/* ---------------- ETF FOCUSED (>30L) ---------------- */

export const etfInvestor: SeedHolding[] = [
  { identifier: "NSE:SILVERBEES", avg: 72, qty: 3000 },
  { identifier: "NSE:LIQUIDBEES", avg: 1000, qty: 1000 },
  { identifier: "NSE:NIFTYBEES", avg: 265, qty: 1500 },
];

/* ---------------- HNI (>1Cr Smallcap + ETF) ---------------- */

export const hniInvestor: SeedHolding[] = [
  { identifier: "NSE:JPPOWER", avg: 15, qty: 400 },
  { identifier: "NSE:IRFC", avg: 140, qty: 1500 },
  { identifier: "NSE:GOLDBEES", avg: 52, qty: 1000 },
];

/* ---------------- HYBRID (Largecap + ETF) ---------------- */

export const hybridInvestor: SeedHolding[] = [
  { identifier: "NSE:RELIANCE", avg: 2850, qty: 70 },
  { identifier: "NSE:ICICIBANK", avg: 980, qty: 150 },
  { identifier: "NSE:CPSEETF", avg: 60, qty: 6000 },
];

export const HOLDINGS_MAP = {
  shortTermInvestor: shortTermInvestor,
  longTermInvestor: longTermInvestor,
  etfInvestor: etfInvestor,
  hniInvestor: hniInvestor,
  hybridInvestor: hybridInvestor,
};
