import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Technical {
  name: string;
  value: any;
  action: string;
}

interface TechnicalSectionProps {
  data: Technical[];
  title: string;
  indicatorValues: any;
}

const TechnicalSection: React.FC<TechnicalSectionProps> = ({
  data,
  title,
  indicatorValues,
}) => {
  const [color, setcolor] = useState<any>("");
  useEffect(() => {
    const maxValue = Math.max(
      indicatorValues.sell,
      indicatorValues.neutral,
      indicatorValues.buy
    );
    if (maxValue === indicatorValues.buy) {
      setcolor("green");
    } else if (maxValue === indicatorValues.sell) {
      setcolor("red");
    } else if (maxValue === indicatorValues.neutral) {
      setcolor("gray");
    }
  }, [indicatorValues]);

  return (
    <>
      <table className="w-full">
        <tr>
          <td colSpan={2} className="py-1 text-[0.75rem] text-black">
            <div className="flex items-center space-x-2">
              <div className="flex-grow border-t-2 border-gray-300 "></div>
              <div className="flex flex-col items-center justify-center gap-1">
                <span
                  className={`   text-[0.9rem] font-letter capitalize ${color == "red" ? "text-red-400" : color == "green" ? "text-z-green-500" : "text-gray-400"}`}
                >
                  {title}
                </span>
                <div className="row flex flex items-center justify-center gap-5   font-letter">
                  <span className="flex flex-col items-center justify-center text-green-500">
                    <Image
                      src="/svg/bull-icon.svg"
                      width={15}
                      height={15}
                      alt=""
                    />
                    {indicatorValues.buy}
                  </span>
                  <span className="flex flex-col items-center justify-center text-gray-400 ">
                    <Image
                      src="/svg/target-icon.svg"
                      width={15}
                      height={15}
                      alt=""
                    />
                    {indicatorValues.neutral}
                  </span>
                  <span className="flex flex-col items-center justify-center text-red-400 ">
                    <Image
                      src="/svg/bear-icon.svg"
                      width={15}
                      height={15}
                      alt=""
                    />
                    {indicatorValues.sell}
                  </span>
                </div>
              </div>
              <div className="flex-grow border-t-2 border-gray-300"></div>
            </div>
          </td>
        </tr>
        {data.map((item, index) => (
          <tr
            key={index}
            className="border-b border-gray-300   font-letter text-gray-700"
          >
            <td
              className={`px-4 py-2 ${
                item.action === "buy"
                  ? "text-z-green-500"
                  : item.action === "sell"
                    ? "text-red-400"
                    : "text-gray-700"
              }`}
            >
              {item.name}
            </td>
            <td className="px-4 py-2 text-right">
              {item.value === null ? (
                <span>-</span>
              ) : Array.isArray(item.value) ? (
                <span>{(item.value[0] as number).toFixed(2)}</span>
              ) : typeof item?.value === "object" ? (
                <div>{(Object.values(item.value)[0] as number).toFixed(2)}</div>
              ) : (
                <span>{(item.value as number).toFixed(2)}</span>
              )}
            </td>
          </tr>
        ))}
      </table>
    </>
  );
};

export default TechnicalSection;
