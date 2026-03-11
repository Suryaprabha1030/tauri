import { StrategyBuilderData, UserStrategy } from "@/lib/types";
import { CEOption, PEOption, Strategy } from "@/lib/api/base";
import { ChangeEvent, use, useEffect, useState } from "react";
import config from "@/lib/config";
import { emit } from "process";
import { defaultStrategyBuilderData } from "@/lib/util/createStrategyUtil";
import { set } from "react-hook-form";
const Builder = (props: {
  data: StrategyBuilderData[];
  newStrategy: boolean;
  updateData: (data: StrategyBuilderData[]) => void;
}) => {
  const [data, setData] = useState<StrategyBuilderData[]>(props.data);
  // update data when props.data changes
  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  // push changes to the parent component when data changes
  useEffect(() => {
    props.updateData(data);
  }, [data]);

  const incrementRowCount = () => {
    if (config.createStrategy.maxRowCount === data.length) return;
    setData([...data, defaultStrategyBuilderData]);
  };

  const decrementRowCount = (index: number) => () => {
    setData(data.filter((item, i) => i !== index));
  };

  const toggleItemBuy = (index: number) => {
    //update the buy value in state
    const newData = data.map((item, i) => {
      if (i === index) {
        return { ...item, buy: !item.buy };
      }
      return item;
    });
    setData(newData);
  };

  const toggleItemOptionType = (index: number) => {
    //update the optionType value in state for the ite
    const newData = data.map((item, i) => {
      if (i === index) {
        return { ...item, optionType: item.optionType === "CE" ? "PE" : "CE" };
      }
      return item;
    });
    setData(newData);
  };

  const updateItemLots = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const newData = data.map((item, i) => {
      if (i === index) {
        return { ...item, lots: parseInt(e.target.value) };
      }
      return item;
    });
    setData(newData);
  };

  const updatePosition = (
    itemIndex: number,
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    const index = e.target.selectedIndex;
    const newData = data.map((item, i) => {
      if (i === itemIndex) {
        return {
          ...item,
          position: {
            value: parseInt(e.target.value),
            label: e.target[index].label,
          },
        };
      }
      return item;
    });
    setData(newData);
  };

  return (
    <div className="flex flex-col items-center border-2 border-z-blue-200 px-2  lg:px-4 py-4 ">
      <table className="w-full  text-center max-sm:text-[0.6rem] sm:text-sm md:text-[0.8rem] lg:text-[0.8rem] text-gray-500 ">
        <tbody className="rounded-lg text-center">
          {data.map((item: StrategyBuilderData, index) => (
            <tr
              key={index}
              id={index.toString()}
              className="flex flex-row  items-center max-sm:justify-center sm:justify-center md:justify-evenly  xl:justify-between border-b-2 border-gray-200 max-sm:gap-[0.2rem] "
            >
              <td className="flex  max-sm:w-[3.7rem] sm:w-[8rem]  xl:w-[5rem] 2xl:w-1/4 whitespace-nowrap py-2 px-2 lg:py-4">
                <div className="flex flex-row items-center gap-2">
                  <input
                    id="lots"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 md:px-4 md:py-2  lg:px-4 lg:py-2 py-2 text-center max-sm:text-[0.8rem] md:text-[0.8rem] xl:text-xs 2xl:text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                    type="number"
                    value={item.lots}
                    onChange={(e) => updateItemLots(index, e)}
                  />
                </div>
              </td>
              <td className="whitespace-nowrap px-2 py-4">
                <select
                  id="position"
                  className="max-sm:w-[4rem] lg:w-[5.3rem] lg:w-[6.5rem] w-half block rounded-lg border border-gray-300 bg-gray-50  sm:px-4 md:py-2 py-2 max-sm:text-[0.65rem] sm:text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  defaultValue={item.position.value}
                  // onChange={(e) => updatePosition(index, e)}
                  onChange={(e) => updatePosition(index, e)}
                >
                  {config.createStrategy.position.map((configItem) => (
                    <option
                      key={configItem.label}
                      value={configItem.value}
                      selected={configItem.value == item.position.value}
                      className="max-sm:text-[0.8rem] md:text-[0.7rem] lg:text-[0.8rem] 2xl:text-[1rem]   py-2"
                    >
                      {configItem.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="whitespace-nowrap px-2 py-4">
                <div
                  className={`inline-flex 2xl:h-7 max-sm:h-[2rem] sm:h-[2rem] md:h-[2.3rem] xl:h-[2rem] max-sm:w-[3rem] sm:w-[4rem] md:w-[5.3rem] xl:w-[2rem] 2xl:w-20 text-center cursor-pointer items-center justify-center rounded-lg
                    ${
                      item.optionType === "CE"
                        ? "bg-z-green-500"
                        : "bg-gradient-to-r from-red-500 to-orange-700"
                    }
                  `}
                  onClick={() => toggleItemOptionType(index)}
                >
                  <div className="lg:h-5  max-sm:h-[1rem] md:h-[1.5rem] text-center font-medium text-white">
                    {item.optionType === "CE" ? "CE" : "PE"}
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-2 py-4">
                <div
                  className={`inline-flex 2xl:h-7 xl:h-8 max-sm:h-[2rem]  max-sm:w-[2.2rem] sm:h-[2.2rem] md:w-[2.8rem] md:h-[2.8rem] xl:w-8 2xl:w-10 cursor-pointer items-center justify-center rounded-3xl 
                    ${
                      item.buy
                        ? "bg-z-green-500"
                        : "bg-gradient-to-r from-red-500 to-orange-700"
                    }
                  `}
                  onClick={() => toggleItemBuy(index)}
                >
                  <div className="lg:h-5  max-sm:h-[1rem]   md:h-[1.6rem] sm:w-[2rem] text-center font-medium text-white">
                    {item.buy ? "B" : "S"}
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-2 py-4">
                <div
                  className="inline-flex 2xl:h-7 xl:h-8 max-sm:h-[2rem] sm:h-[2rem] md:h-[2.8rem] max-sm:w-[2rem]  sm:w-[2rem]  md:w-[2.8rem] xl:w-7  cursor-pointer items-center justify-center rounded-3xl bg-gradient-to-r from-red-500 to-orange-700"
                  onClick={decrementRowCount(index)}
                >
                  <div className="h-5 text-center font-medium text-white">
                    -
                  </div>
                </div>
              </td>
            </tr>
          ))}
          <tr className="flex flex-row justify-center p-5 ">
            <div
              className="inline-flex xl:h-10 max-sm:h-[2rem] w-[2rem] sm:h-[2.8rem] sm:w-[2.8rem]   xl:w-10 cursor-pointer items-center justify-center rounded-3xl bg-z-blue-400"
              onClick={incrementRowCount}
            >
              <div className="h-5 text-center font-bold text-white">+</div>
            </div>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default Builder;
