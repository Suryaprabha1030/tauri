"use client";

import StockInfoSideDisplay from "../shared/ChartLayout/sidetoolbar/StockinfoSideDisplay/stockinfoSideDisplay";
import {
  setSelectedAiStock,
  setStockInfoOpen,
} from "@/lib/redux/slices/CommonSlice";
import { Dispatch, SetStateAction } from "react";
import { Action } from "redux";

export const renderWithClickableIdentifiers = (
  text: string,
  isSingleStockRef: React.RefObject<boolean>,
  hasIdentifierRef: React.RefObject<boolean>,
  hasUnoStockRef: React.RefObject<boolean>,
  handleStockClick: any,
  authSuccess: boolean,
  brokerCode: any,
  setSelectedIdentifier: Dispatch<SetStateAction<string | null>>,
  dispatch: Dispatch<Action>,
  setShowLoginPopup: Dispatch<SetStateAction<boolean>>,
  strategyImageResult: any,
  handleStrategyClick: any,
  IndexDetails: any,
) => {
  const normalized = text
    .replace(/[\u00AD\u200B\u2011]/g, "")
    .replace(/\s*\n\s*/g, "")
    .replace(/\s+/g, "");

  // const identifierMatch = text.match(
  //   /^\s*[*-]?\s*Identifier\s*:\s*(NSE[-\u2010-\u2015][A-Za-z0-9_]+)/im
  // );

  const identifierMatch = text.match(/NSE:[A-Za-z0-9_]+/i);
  const identifier = identifierMatch?.[0] ?? null;

  //Since same chunk doesnot contains unostock and identifier,so sometimes data not formatting
  if (normalized?.toLowerCase().includes("unostock")) {
    hasUnoStockRef.current = true;
  }

  if (identifier) {
    hasIdentifierRef.current = true;
  }
  if (
    !isSingleStockRef.current &&
    hasUnoStockRef.current &&
    hasIdentifierRef.current
  ) {
    isSingleStockRef.current = true;
  }
  const isSingleStock = isSingleStockRef.current;
  let stockName = "";
  if (identifier) {
    stockName = identifier.split(":")[1] || "";
  }

  const clickableStockName =
    identifier && isSingleStock ? (
      <span
        key={identifier}
        className="cursor-pointer font-semibold hover:underline"
        onClick={(e) => handleStockClick(identifier, stockName, e)}
      >
        {stockName}
      </span>
    ) : (
      <span className="font-semibold">{stockName}</span>
    );

  if (isSingleStock && identifier && clickableStockName) {
    const cleanedText = text
      .split("\n")
      .filter(
        (line) =>
          !/\b(uno[\s-]*stock)\b/i.test(line.trim()) &&
          !/^\s*[*-]?\s*Identifier\s*:\s*NSE:[A-Za-z0-9_]+\s*$/i.test(
            line.trim(),
          ),
      )
      .join("\n")
      .trim();

    const summaryMatch = cleanedText.match(/Summary\s*[\-:]?\s*([\s\S]*)/i);
    const summary = summaryMatch ? summaryMatch[1].trim() : null;
    hasUnoStockRef.current = false; //When Identifier changes it needs to become false innorder to avoid multiple stock info display
    isSingleStockRef.current = false;
    return (
      <div className="flex w-full flex-col gap-4 whitespace-pre-wrap">
        {clickableStockName}

        {authSuccess && brokerCode ? (
          <>
            {/* Render StockInfo only once */}
            <div className="mt-2 flex h-full w-full flex-col items-center justify-center gap-2 border-t border-gray-200 pt-2">
              <StockInfoSideDisplay
                brokerCode={brokerCode}
                scopeId={"nima"}
                InsideChat={true}
                symbolName={stockName}
                Identifier={identifier}
              />
              <button
                onClick={() => {
                  dispatch(
                    setSelectedAiStock({ identifier, symbol: stockName }),
                  );
                  setSelectedIdentifier(identifier);
                  dispatch(setStockInfoOpen(true));
                }}
                className="flex w-[10rem] items-center justify-center rounded-full border border-z-green-500 px-4 py-2 text-[0.75rem] font-medium text-z-green-500 transition hover:bg-z-green-500 hover:text-white"
              >
                View All Details
              </button>
            </div>

            {summary && (
              <div className="mt-3">
                <h4 className="mb-1 text-sm font-semibold">Summary</h4>
                <p className="whitespace-pre-line text-sm text-gray-700">
                  {summary}
                </p>
              </div>
            )}
          </>
        ) : authSuccess && !brokerCode ? (
          <>
            <div className="mt-2 text-gray-800">{cleanedText}</div>
          </>
        ) : (
          !authSuccess && (
            <div className="mt-2 flex justify-start">
              <button
                onClick={() => setShowLoginPopup(true)}
                className="flex w-[10rem] items-center justify-center gap-2 rounded-full border border-z-green-500 px-2 py-2 text-[0.75rem] font-medium text-z-green-500 transition"
              >
                <img src="/svg/lock.svg" width={20} height={20} alt="view" />
                Unlock with Login
              </button>
            </div>
          )
        )}
      </div>
    );
  }
  // Check if any strategy exists inside the text
  const normalize = (str?: string) => {
    if (!str) return "";
    return str.toLowerCase().replace(/[-_]/g, " ").replace(/\s+/g, " ").trim();
  };

  const normalizeKey = (str: string) => normalize(str).replace(/\s+/g, "_");
  const extractUID = (text?: string) => {
    if (!text) return null;

    const match = text.match(/UID\s*:\s*([A-Za-z\s]+)_([A-Za-z]+)/i);
    if (!match) return null;

    return {
      strategyName: match[1].trim(),
      indexName: match[2].trim(),
    };
  };

  const uidData = extractUID(text);

  if (uidData && IndexDetails) {
    const { strategyName, indexName } = uidData;
    const indexObj = IndexDetails?.find(
      (item: any) =>
        item?.index_name?.toUpperCase() === indexName?.toUpperCase(),
    );
    const parseExpiry = (dateStr: string) => {
      const day = parseInt(dateStr.slice(0, 2));
      const monthStr = dateStr.slice(2, 5);
      const year = parseInt(dateStr.slice(5));

      const months: Record<string, number> = {
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
      return new Date(year, months[monthStr], day);
    };

    let firstExpiry;
    if (indexObj?.expiries?.length) {
      firstExpiry = [...indexObj?.expiries].sort(
        (a: string, b: string) => +parseExpiry(a) - +parseExpiry(b),
      )[0];
    }
    const imageKey = `${normalizeKey(indexName)}_${normalizeKey(firstExpiry)}_${normalizeKey(strategyName)}.jpg`;
    const matchedImage = strategyImageResult?.find(
      (img) => img?.fileName === imageKey,
    );
    const isSmall = window.matchMedia("(max-width: 576px)").matches;
    const isXlSmall = window.matchMedia("(max-width: 1200px)").matches;
    const height = isSmall
      ? "200px" // ≤ 576px
      : isXlSmall
        ? "300px" // 577px – 1200px
        : "400px";
    return (
      <div className="whitespace-pre-wrap">
        <span
          onClick={(e) => handleStrategyClick(strategyName, indexName, e)}
          className="cursor-pointer font-semibold text-z-green-500 hover:underline"
        >
          {strategyName} - {indexName?.toUpperCase()}
          {matchedImage?.url && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
                margin: "4px",
              }}
            >
              <img
                src={matchedImage?.url.split("?")[0]}
                alt={`${strategyName}`}
                style={{
                  maxWidth: "100%",
                  height: height,
                  objectFit: "contain",
                }}
                loading="lazy"
              />
            </div>
          )}
        </span>
        <div className="mt-2 text-gray-800">
          {text.replace(/UID\s*:\s*[^\n]+\n?/gi, "").trim()}
        </div>
      </div>
    );
  }
  // Default (non-uno stock)

  const cleanText = text.replace(/[-–—]?\s*uno[\s-]*stock\b/i, "").trim();
  return (
    <div className="whitespace-pre-wrap">
      {/* {clickableStockName} */}
      <div className="mt-2 text-gray-800">{cleanText}</div>
    </div>
  );
};
