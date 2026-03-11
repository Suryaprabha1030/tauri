"use client";

import {
  setSelectedAiStock,
  setStockInfoOpen,
} from "@/lib/redux/slices/CommonSlice";
import React, { Dispatch, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBrokerCode } from "../helpers";
import DisplayHandleSellButton from "../shared/ChartLayout/buySellButton/DisplayHandleSellButton";
import { RootState } from "@/lib/redux/Store";

import {
  adjustTooltipPosition,
  fetchIndexDetails,
  handleStockTransaction,
} from "./AIChat";
import { useRouter } from "next/navigation";
import { AllStrategyUtil } from "@/lib/util/StrategyAnalyzerUtil/StrategyAnalyerUtil";

import {
  addCartSuccess,
  getIndexName,
  setStock,
} from "@/lib/redux/slices/StrategySlice";
import {
  getFutureData,
  getOptionData,
  showDraftPositions,
  showPnlTable,
  showPositionTable,
  showStrategyTable,
} from "@/lib/redux/slices/AnalyzerSlice";
import { renderWithClickableIdentifiers } from "./FormatResponse";

interface Stock {
  [key: string]: string;
}

interface AIResponseTableProps {
  markdownTable: string;
  setQuery: Dispatch<React.SetStateAction<any>>;
  authSuccess: boolean;
  identifiersRef: any;
  onIdentifiersReady?: (ids: string[]) => void;
  setTableIdentifier: Dispatch<React.SetStateAction<any>>;
  setShowLoginPopup: Dispatch<React.SetStateAction<any>>;
  inputRef: any;
  loading: boolean;
  isSingleStockRef: any;
  hasUnoStockRef: any;
  hasIdentifierRef: any;
  strategyImageResult: any;
}

export default function AIResponseTable({
  markdownTable,
  setQuery,
  authSuccess,
  identifiersRef,
  onIdentifiersReady,
  setTableIdentifier,
  setShowLoginPopup,
  inputRef,
  loading,
  isSingleStockRef,
  hasUnoStockRef,
  hasIdentifierRef,
  strategyImageResult,
}: AIResponseTableProps) {
  const [selectedIdentifier, setSelectedIdentifier] = useState<string | null>(
    null,
  );
  const dispatch = useDispatch();
  const brokerCode = authSuccess ? getBrokerCode() : null;
  const router = useRouter();
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [rangeRef, setRangeRef] = useState<Range | null>(null);
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [tooltipStock, setTooltipStock] = useState<{
    identifier: string;
    symbol: string;
  } | null>(null);

  const selectedTextTooltipRef = useRef<HTMLDivElement | null>(null);
  const stockTooltipRef = useRef<HTMLDivElement | null>(null);
  const webSocketDataRead: any = useSelector(
    (state: RootState) => state.strategy.symbolsPrice,
  );
  const [selectedStrategy, setSelectedStrategy] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState<any>(null);
  const [allStrategyDetail, setallStrategyDetail] = useState<any>();
  const path = window.location.pathname;
  const positionDatas = useSelector(
    (state: RootState) => state.analyzer.PositionDataList,
  );
  const futureDatas = useSelector(
    (state: RootState) => state.analyzer.futureDataList,
  );
  const optionDatas = useSelector(
    (state: RootState) => state.analyzer.optionDataList,
  );
  const IndexDetails = useSelector(
    (state: RootState) => state.Screener.IndicesDataWithExpiry,
  );

  const handleStrategyClick = (strategy: string, indexName: any, e: any) => {
    dispatch(getOptionData({ optionData: {} }));
    dispatch(getFutureData({ futureData: {} }));
    dispatch(showPositionTable(false));
    dispatch(showStrategyTable(true));
    dispatch(showPnlTable(false));
    dispatch(showDraftPositions(false));
    dispatch(getIndexName({ indexName: indexName, expiryDate: "" }));
    dispatch(
      setStock({
        stock: {
          exchange: "",
          index_name: "",
          spot_price: "",
        },
      }),
    );
    dispatch(
      addCartSuccess({
        items: {
          exchange: "",
          index_name: "",
          spot_price: null,
          expiryDate: "",
        },
      }),
    );
    e.stopPropagation();
    setSelectedStrategy(strategy);
    setSelectedIndex(indexName);
    AllStrategyUtil(setallStrategyDetail, router);
  };

  useEffect(() => {
    if (loading || !allStrategyDetail) return;
    fetchIndexDetails(
      selectedIndex,
      brokerCode,
      selectedStrategy,
      path,
      webSocketDataRead,
      dispatch,
      router,
      positionDatas,
      futureDatas,
      allStrategyDetail,
      optionDatas,
      IndexDetails,
    );
  }, [allStrategyDetail]);

  useEffect(() => {
    if (loading || !markdownTable?.trim()) return;
    identifiersRef.current = new Set();
    const extractedIds = Array.from(
      markdownTable.matchAll(/\bNSE:[A-Za-z0-9_]+\b/g),
    ).map((m) => m[0]);
    const formattedIds = Array.from(new Set(extractedIds)).map((id) =>
      id.replace("-", ":"),
    );
    identifiersRef.current = new Set(formattedIds);
    onIdentifiersReady?.(formattedIds);
  }, [loading, markdownTable]);

  useEffect(() => {
    isSingleStockRef.current = false; // reset detection for new response
    hasIdentifierRef.current = false;
    hasUnoStockRef.current = false;
  }, [markdownTable]);
  // Handle stock name click
  const handleStockClick = (identifier: string, symbol: string, event: any) => {
    event.stopPropagation();
    setTooltipStock({ identifier, symbol });
    setSelectedText(null); // Only show stock tooltip

    const selection = window.getSelection();
    selection?.removeAllRanges();

    const parentRect = parentRef.current?.getBoundingClientRect();
    if (parentRect) {
      setTooltipPosition({
        x: event.clientX - parentRect.left + 100,
        y: event.clientY - parentRect.top - 10,
      });
    }
  };

  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;

    const handleMouseUp = (e: MouseEvent) => {
      if (
        selectedTextTooltipRef.current?.contains(e.target as Node) ||
        stockTooltipRef.current?.contains(e.target as Node)
      ) {
        return;
      }

      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 0 && selection?.rangeCount) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect && rect.width > 0 && rect.height > 0) {
          setRangeRef(range);

          const parentRect = parent.getBoundingClientRect();
          const topPosition =
            rect.top - parentRect.top - 40 > 0
              ? rect.top - parentRect.top - 40
              : rect.bottom - parentRect.top + 10;

          setTooltipPosition({
            x: rect.left - parentRect.left + rect.width / 2,
            y: topPosition,
          });

          setSelectedText(text);
          setTooltipStock(null);
        }
      } else {
        setSelectedText(null);
        setTooltipPosition(null);
        setRangeRef(null);
        setTooltipStock(null);
      }
    };

    //  Attach only to this parent block
    parent.addEventListener("mouseup", handleMouseUp);

    //  Clean up on unmount
    return () => {
      parent.removeEventListener("mouseup", handleMouseUp);
    };
  }, [rangeRef, selectedText, markdownTable]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      // If clicking inside any tooltip → do nothing
      if (
        selectedTextTooltipRef.current?.contains(target) ||
        stockTooltipRef.current?.contains(target)
      ) {
        return;
      }

      // If clicking inside parent content, let existing handler manage text selection
      if (parentRef.current?.contains(target)) return;

      // Elsewhere (outside everything) → close all tooltips
      setSelectedText(null);
      setTooltipStock(null);
      setTooltipPosition(null);
      setRangeRef(null);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddToFollowUp = (text: string | null) => {
    if (text) setQuery(text);
    inputRef.current?.focus();
    setSelectedText(null);
    setTooltipStock(null);
    setTooltipPosition(null);
  };

  if (!markdownTable?.trim()) return null;
  const cleanedMarkdown = markdownTable.replace(/(\w)-(\w)/g, `$1\u2011$2`);

  // non-breaking hyphen

  const sections = cleanedMarkdown
    .trim()
    .split(/\n\s*\n/)
    .filter(Boolean);

  return (
    <div ref={parentRef} className="relative overflow-x-auto rounded-md p-3">
      {sections.map((block, idx) => {
        const rows = block.split("\n").filter((r) => r.includes("|"));

        const separatorIndex = rows.findIndex((r) =>
          r.replace(/\s/g, "").match(/^\|-+\|/),
        );

        if (separatorIndex >= 1) {
          const headers = rows[0]
            .split("|")
            .slice(1, -1)
            .map((h) => h.trim());
          const dataRows = rows.slice(separatorIndex + 1);

          const data: Stock[] = dataRows.map((row) => {
            const cells = row
              .split("|")
              .slice(1, -1)
              .map((c) => c.trim());
            const obj: Stock = {};
            headers.forEach((h, i) => (obj[h] = cells[i] || ""));
            return obj;
          }); //fix for table sometimes displaying empty

          const identifierKey =
            headers.find(
              (h) =>
                h.toLowerCase().includes("identifier") ||
                h.toLowerCase().includes("id"),
            ) || null;
          //  Collect identifiers from this table block
          isSingleStockRef.current = false; // To stop unostock rendering if table renders
          hasIdentifierRef.current = false;
          hasUnoStockRef.current = false;
          return (
            <div key={idx} className="mb-4 overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-[0.75rem]">
                <thead>
                  <tr>
                    {headers
                      .filter((h) => h !== identifierKey)
                      .map((h, i) => (
                        <th
                          key={`th-${h}-${i}`}
                          className="border-b border-gray-300 p-2 text-left font-bold"
                        >
                          {h}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {data?.map((row, i) => {
                    const identifier =
                      identifierKey && row[identifierKey]
                        ? row[identifierKey]?.replace(/[-\u2010-\u2015]/, ":")
                        : "";

                    return (
                      <tr key={`tr-${i}`}>
                        {headers
                          .filter((h) => h !== identifierKey)
                          .map((h, j) => {
                            const isStockName =
                              h.toLowerCase().includes("symbol") ||
                              h.toLowerCase().includes("SymbolName");

                            const cellValue = row[h]?.replace(/-unostock/i, "");

                            return (
                              <td
                                key={`td-${h}-${i}-${j}`}
                                className={`border-b border-gray-200 p-2 align-top ${
                                  isStockName && authSuccess
                                    ? "cursor-pointer font-semibold hover:underline"
                                    : ""
                                }`}
                                onClick={(e) => {
                                  if (authSuccess) {
                                    e.preventDefault();

                                    if (isStockName && identifier) {
                                      handleStockClick(
                                        identifier,
                                        cellValue,
                                        e,
                                      );
                                    } //hiding the symbol name clicking functionality
                                  }
                                }}
                              >
                                {cellValue}
                              </td>
                            );
                          })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <div key={idx} className="mb-4 whitespace-pre-wrap">
            {renderWithClickableIdentifiers(
              block,
              isSingleStockRef,
              hasIdentifierRef,
              hasUnoStockRef,
              handleStockClick,
              authSuccess,
              brokerCode,
              setSelectedIdentifier,
              dispatch,
              setShowLoginPopup,
              strategyImageResult,
              handleStrategyClick,
              IndexDetails,
            )}
          </div>
        );
      })}

      {/* Tooltip for selected text */}
      {selectedText &&
        tooltipPosition &&
        !loading &&
        (() => {
          const adjusted = adjustTooltipPosition(
            tooltipPosition.x,
            tooltipPosition.y,
            parentRef,
          );

          return (
            <div
              ref={selectedTextTooltipRef}
              className="absolute z-50 cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium shadow-md transition"
              style={{
                top: adjusted.y,
                left: adjusted.x,
              }}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleAddToFollowUp(selectedText)}
            >
              <div className="flex flex-row items-center gap-1">
                <img
                  src="/svg/searchIcon.svg"
                  width={20}
                  height={20}
                  alt="view"
                  className="rounded-lg hover:bg-gray-50"
                />
                Ask NIMA
              </div>
            </div>
          );
        })()}

      {/* Tooltip for stock click */}
      {tooltipStock &&
        tooltipPosition &&
        authSuccess &&
        !loading &&
        (() => {
          const adjusted = adjustTooltipPosition(
            tooltipPosition.x,
            tooltipPosition.y,
            parentRef, //  pass same ref used for main layout
          );

          return (
            <div
              ref={stockTooltipRef}
              className="absolute z-50 flex flex-row gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-sm font-medium shadow-md transition"
              style={{
                top: adjusted.y,
                left: adjusted.x,
                transform: "translate(-50%, 0)",
              }}
            >
              <div
                className="group relative flex items-center p-1 hover:rounded"
                onClick={() => {
                  dispatch(
                    setSelectedAiStock({
                      identifier: tooltipStock?.identifier,
                      symbol: tooltipStock?.symbol,
                    }),
                  );
                  setSelectedIdentifier(tooltipStock?.identifier);
                  dispatch(setStockInfoOpen(true));
                  setTooltipStock(null);
                  setTooltipPosition(null);
                }}
              >
                <img
                  src="/svg/view.svg"
                  width={20}
                  height={20}
                  alt="view"
                  className="rounded-lg hover:bg-gray-50"
                />
                <span className="pointer-events-none absolute left-[-2] top-10 z-[1000] w-[6rem] rounded bg-gray-800 px-1 text-center text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  View StockInfo
                </span>
              </div>

              <div
                className="group relative flex items-center p-1 hover:rounded"
                onClick={() => handleAddToFollowUp(tooltipStock?.symbol)}
              >
                <img
                  src="/svg/searchIcon.svg"
                  width={20}
                  height={20}
                  alt="view"
                  className="rounded-lg hover:bg-gray-50"
                />
                <span className="pointer-events-none absolute left-[-2] top-10 z-[1000] w-[5rem] rounded bg-gray-800 px-1 text-center text-[0.65rem] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  Ask NIMA
                </span>
              </div>

              <div className="flex flex-row items-center justify-center gap-2 text-center text-[0.7rem] md:max-xl:gap-2.5">
                <DisplayHandleSellButton
                  type="LONG"
                  handleChange={() =>
                    handleStockTransaction(
                      tooltipStock,
                      "LONG",
                      webSocketDataRead,
                      dispatch,
                    )
                  }
                  id="buy-button"
                />
                <DisplayHandleSellButton
                  type="SHORT"
                  handleChange={() =>
                    handleStockTransaction(
                      tooltipStock,
                      "SHORT",
                      webSocketDataRead,
                      dispatch,
                    )
                  }
                  id="sell-button"
                />
              </div>
            </div>
          );
        })()}
    </div>
  );
}
