import config from "@/lib/config";
import { RootState } from "@/lib/redux/Store";
import React, { RefObject, useEffect } from "react";
import { useSelector } from "react-redux";

interface HeaderRowProps {
  noOiData: boolean;
  expiryDateRef: RefObject<any>;
  handleChange: (event: any) => void;
  query: string;
  expiryValue: string;
  expandOptTable: boolean;
}

const HeaderRow: React.FC<HeaderRowProps> = ({
  expiryDateRef,
  noOiData,
  handleChange,
  query,
  expiryValue,
  expandOptTable,
}) => {
  const expiry: any = useSelector(
    (state: RootState) => state.strategy.indexExpiryDate
  );
  const spotPriceInfo: any = useSelector(
    (state: RootState) => state.strategy.spotPriceData
  );

  return (
    <thead className="sticky -top-1 z-10 flex w-full  border-b bg-white text-center">
      <tr
        className={`flex  w-full ${
          expandOptTable ? "xl:flex-1 xl:justify-center" : "xl:justify-between "
        } flex-row items-center border-b-2 border-gray-200 text-[0.8rem] text-z-gray-300 max-xl:justify-between`}
      >
        {!noOiData ? (
          <th
            className={`  sm:max-md:w-[35%] ${
              spotPriceInfo == null
                ? expandOptTable
                  ? "basis-1/4"
                  : "basis-1/2"
                : ""
            } ${
              expandOptTable
                ? " md:w-1/5 xl:w-[17%]  2xl:w-[18%]"
                : "md:w-1/5 xl:max-2xl:w-[20%] 2xl:w-[15%]"
            } py-2  font-tableHead max-md:flex  max-md:w-[40%] max-md:items-center max-md:justify-center max-sm:hidden md:max-xl:py-[0.6rem]`}
          >
            Call OI
          </th>
        ) : (
          ""
        )}
        {expandOptTable && !noOiData ? (
          <th
            className={` ${
              expandOptTable
                ? "w-[29%] 2xl:w-[25.65%]"
                : "w-1/5 xl:max-2xl:w-[23%]  xl:max-2xl:px-2 2xl:px-6"
            } py-2 font-tableHead max-xl:hidden md:max-xl:py-[0.6rem] `}
          >
            {" "}
            OI Trend{" "}
          </th>
        ) : (
          ""
        )}

        {expandOptTable && spotPriceInfo != null && expiryDateRef.current && (
          <th
            className={`max-xl:hidden   ${
              expandOptTable
                ? "   xl:w-[12%] 2xl:w-[14%]"
                : "w-1/5  xl:max-2xl:w-[23%] xl:max-2xl:px-2 2xl:px-2"
            } py-2 font-tableHead max-md:hidden md:max-xl:py-[0.6rem] `}
          >
            Gamma
          </th>
        )}
        {expandOptTable && spotPriceInfo != null && expiryDateRef.current && (
          <th
            className={`max-xl:hidden  ${
              expandOptTable
                ? "   xl:w-[12%] 2xl:w-[14%]"
                : "w-1/5  xl:max-2xl:w-[23%] xl:max-2xl:px-2 2xl:px-2"
            } py-2 font-tableHead max-md:hidden md:max-xl:py-[0.6rem] `}
          >
            Vega
          </th>
        )}

        {expandOptTable && spotPriceInfo != null && expiryDateRef.current && (
          <th
            className={`max-xl:hidden  ${
              expandOptTable
                ? "  xl:w-[12%] 2xl:w-[14%]"
                : "w-1/5  xl:max-2xl:w-[23%] xl:max-2xl:px-2 2xl:px-2"
            } py-2 font-tableHead max-md:hidden md:max-xl:py-[0.6rem] `}
          >
            Theta
          </th>
        )}
        {spotPriceInfo != null && expiryDateRef.current && (
          <th
            className={`max-xl:hidden  ${
              expandOptTable
                ? "  xl:w-[12%] 2xl:w-[14%]"
                : "w-1/5  xl:max-2xl:hidden xl:max-2xl:w-[23%] xl:max-2xl:px-2 2xl:w-[15%] 2xl:px-2"
            } py-2 font-tableHead max-md:hidden md:max-xl:py-[0.6rem] `}
          >
            Delta
          </th>
        )}

        <th
          className={`  max-md:flex max-md:items-center max-md:justify-center max-sm:w-[40%]  sm:max-md:w-[43%] ${
            noOiData ? "basis-1/2" : ""
          } ${
            expandOptTable
              ? `md:max-xl:w-[25%]    xl:w-[21%] ${spotPriceInfo == null ? "2xl:w-[19%]  " : "2xl:w-[23%] "} `
              : "md:w-1/5 xl:max-2xl:w-[25%] 2xl:w-[25%] 2xl:px-6"
          } py-2 font-tableHead md:max-xl:py-[0.6rem]`}
        >
          {" "}
          Call{" "}
        </th>
        <th
          className={`relative flex    max-md:flex-row max-sm:w-[44%] sm:max-md:w-[43%] ${
            noOiData ? "basis-1/2" : ""
          }  ${
            expandOptTable
              ? `md:max-xl:w-[20%]   ${spotPriceInfo == null ? "2xl:w-[18%]  " : " 2xl:w-[22%] "}}   `
              : "md:max-xl:w-[20%] xl:w-[17%] xl:max-2xl:w-[28%] 2xl:w-[5.5rem]"
          } items-center justify-center py-2 font-tableHead md:max-xl:py-[0.6rem] xl:flex-col  `}
        >
          {expiry && expiry[query] && (
            <select
              className={`h-[1.5rem] rounded-lg bg-white px-2 text-[0.7rem] outline-none ${
                config.BSESupportIndices.includes(query)
                  ? "pointer-events-none appearance-none"
                  : "focus:border-tertiary"
              }`}
              ref={expiryDateRef}
              value={expiryValue}
              onChange={handleChange}
            >
              {config.BSESupportIndices.includes(query) ? (
                <option value={expiry[query][0]}>{expiry[query][0]}</option>
              ) : (
                expiry[query]?.slice(0, 3)?.map((c: any, idx: number) => (
                  <option className="bg-white p-2 xl:px-1" key={idx} value={c}>
                    {c}
                  </option>
                ))
              )}
            </select>
          )}
        </th>
        <th
          className={`  sm:max-md:w-[43%] ${
            noOiData ? "basis-1/2" : ""
          }  max-md:flex max-md:w-[40%] max-md:items-center max-md:justify-center ${
            expandOptTable
              ? ` md:w-[24%]  xl:w-[21%] ${spotPriceInfo == null ? "2xl:w-[19%]  " : "2xl:w-[23%] "} `
              : "md:w-1/5 md:max-xl:px-6 xl:max-2xl:w-[25%]  2xl:w-[25%] 2xl:px-6"
          } py-2 font-tableHead md:max-xl:py-[0.6rem] `}
        >
          {" "}
          Put{" "}
        </th>

        {spotPriceInfo != null && expiryDateRef.current && (
          <th
            className={`  max-xl:hidden  ${
              expandOptTable
                ? " xl:w-[12%] 2xl:w-[14%]"
                : "w-1/5  xl:max-2xl:hidden xl:max-2xl:w-[23%] xl:max-2xl:px-2 2xl:w-[15%] 2xl:px-2"
            } py-2 font-tableHead max-md:hidden md:max-xl:py-[0.6rem] `}
          >
            Delta
          </th>
        )}
        {expandOptTable && spotPriceInfo != null && expiryDateRef.current && (
          <th
            className={` max-xl:hidden  ${
              expandOptTable
                ? " xl:w-[12%] 2xl:w-[14%]"
                : "w-1/5  xl:max-2xl:w-[23%] xl:max-2xl:px-2 2xl:px-2"
            } py-2 font-tableHead max-md:hidden md:max-xl:py-[0.6rem] `}
          >
            Theta
          </th>
        )}

        {expandOptTable && spotPriceInfo != null && expiryDateRef.current && (
          <th
            className={` max-xl:hidden  ${
              expandOptTable
                ? " xl:w-[12%] 2xl:w-[14%]"
                : "w-1/5  xl:max-2xl:w-[23%] xl:max-2xl:px-2 2xl:px-2"
            } py-2 font-tableHead max-md:hidden md:max-xl:py-[0.6rem] `}
          >
            Vega
          </th>
        )}
        {expandOptTable && spotPriceInfo != null && expiryDateRef.current && (
          <th
            className={`max-xl:hidden   ${
              expandOptTable
                ? " xl:w-[12%] 2xl:w-[14%]"
                : "w-1/5  xl:max-2xl:w-[23%] xl:max-2xl:px-2 2xl:px-2"
            } py-2 font-tableHead max-md:hidden md:max-xl:py-[0.6rem] `}
          >
            Gamma
          </th>
        )}
        {expandOptTable && !noOiData ? (
          <th
            className={`max-xl:hidden   ${
              expandOptTable
                ? "  max-xl:w-1/5 xl:w-[29%] 2xl:w-[25.65%] "
                : "w-1/5 px-6 xl:max-2xl:w-[23%] xl:max-2xl:px-2"
            }   py-2 font-tableHead  `}
          >
            {" "}
            OI Trend{" "}
          </th>
        ) : (
          ""
        )}

        {!noOiData ? (
          <th
            className={`   ${
              spotPriceInfo == null
                ? expandOptTable
                  ? "basis-1/4"
                  : "basis-1/2"
                : ""
            } py-2  font-tableHead sm:max-md:w-[35%] ${
              expandOptTable
                ? "md:w-1/5 xl:w-[17%]   2xl:w-[19%]"
                : "md:w-1/5 xl:max-2xl:w-[22%] 2xl:w-[15%] "
            } max-md:flex  max-md:w-[40%] max-md:items-center max-md:justify-center max-sm:hidden  md:max-xl:py-[0.6rem] `}
          >
            {" "}
            Put OI
          </th>
        ) : (
          ""
        )}
      </tr>
    </thead>
  );
};

export default HeaderRow;
