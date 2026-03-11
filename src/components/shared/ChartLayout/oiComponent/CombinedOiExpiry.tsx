import config from "@/lib/config";
import { RootState } from "@/lib/redux/Store";
import { formatExpiryDate } from "@/lib/util/DateUtil";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useSelector } from "react-redux";

interface OiExpiryProps {
  setCombinedOiExpiry: Dispatch<SetStateAction<any>>;
  combinedOiExpiry: any;
  query: string;
  showCombinedOi: boolean;
}
const CombinedOiExpiry: React.FC<OiExpiryProps> = ({
  setCombinedOiExpiry,
  combinedOiExpiry,
  query,
  showCombinedOi,
}) => {
  const expiries = useSelector(
    (state: RootState) => state.OI.OIIndexExpiryDate
  );
  const expiryDates = expiries[query] || [];
  const slicedDates = showCombinedOi ? expiryDates : expiryDates.slice(0, 3);
  const Initialselected =
    Object.entries(expiries).length > 0 &&
    combinedOiExpiry?.length > 0 &&
    expiries[query]?.find((date, index) => combinedOiExpiry === date);
  const [selectedValue, setSelectedValue] = useState<any>(Initialselected);

  const handleSelect = (date: string) => {
    setCombinedOiExpiry(date);
  };

  const handleSwitchDropdown = (event: any) => {
    const selectedOption =
      Object.entries(expiries).length > 0 &&
      combinedOiExpiry?.length > 0 &&
      expiries[query]?.find((date, index) => date === event.target.value);
    if (selectedOption) {
      handleSelect(selectedOption);
    }
    setSelectedValue(selectedOption);
  };

  return (
    <div>
      <div
        className="flex w-full  items-center justify-center max-lg:hidden"
        role="group"
      >
        {Object.entries(expiries).length > 0 &&
          combinedOiExpiry?.length > 0 &&
          (config.BSESupportIndices.includes(query)
            ? expiryDates.slice(0, 1) // Only first expiry for BSE
            : showCombinedOi
              ? expiryDates?.slice(0, 3)
              : expiryDates.slice(0, 3)
          ).map((date, index, arr) => (
            <button
              key={date}
              className={`font-label  border border-gray-200 px-2 py-2 text-[0.7rem] lg:max-xl:px-2.5 ${
                combinedOiExpiry?.length == 1 ? "rounded-l-lg rounded-r-lg" : ""
              }
      ${index === 0 ? "rounded-l-lg" : ""}
      ${index === arr.length - 1 ? "rounded-r-lg" : ""}
      ${combinedOiExpiry === date ? "bg-z-green-500 text-white" : "bg-white text-black"}
    `}
              onClick={() => handleSelect(date)}
              title={date}
            >
              {formatExpiryDate(date)}
            </button>
          ))}
      </div>

      {/* only for Small Screen */}
      <select
        className="h-[2rem] rounded-lg border border-solid border-gray-300 bg-white text-[0.77rem] font-table outline-none sm:max-md:h-[2.2rem] md:max-lg:h-[2rem] md:max-lg:px-2 md:max-lg:pb-[0.05rem] lg:hidden"
        value={selectedValue}
        onChange={(event) => {
          handleSwitchDropdown(event);
        }}
      >
        {(config.BSESupportIndices.includes(query)
          ? expiries[query]?.slice(0, 1) // Only first expiry for BSE
          : expiries[query]?.slice(0, 3)
        )?.map((date, index) => (
          <option
            key={index}
            value={date}
            onClick={() => handleSelect(date)}
            title={date}
          >
            {formatExpiryDate(date)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CombinedOiExpiry;
