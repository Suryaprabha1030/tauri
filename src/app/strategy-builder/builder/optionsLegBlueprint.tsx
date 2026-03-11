import { StrategyBuilderData, UserStrategy } from "@/lib/types";
import { DataOption, Strategy } from "@/lib/api/base";
import { debug } from "console";
import { getCreateStrategyData } from "@/lib/util/createStrategyUtil";
import Tooltip from "@/components/shared/toolTip";
import Image from "next/image";

const OptionLegBlueprintRow = (props: {
  index: number;
  lots: string;
  position_str: string;
  optionChain: String;
  buy: boolean;
}) => {
  const { index, lots, position_str, optionChain, buy } = props;
  return (
    <tr key={index} className="border-b text-center ">
      <td className="whitespace-nowrap px-6 py-4"> {lots} </td>
      <td className="whitespace-nowrap px-6 py-4"> {position_str} </td>
      <td className="whitespace-nowrap px-6 py-4"> {optionChain} </td>
      <td className="whitespace-nowrap px-6 py-4">
        {!buy && (
          <div className="inline-flex h-7 w-7 items-center justify-center rounded-3xl bg-gradient-to-r from-red-500 to-orange-700">
            <div className="flex items-center justify-center h-5 w-5 text-center font-medium text-white">S</div>
          </div>
        )}
        {buy && (
          <div className="inline-flex h-7 w-7 items-center justify-center rounded-3xl bg-z-green-500">
            <div className="flex items-center justify-center h-5 w-5 text-center font-medium text-white">B</div>
          </div>
        )}
      </td>
    </tr>
  );
};

const OptionsLegBlueprint = (props: { strategy: Strategy }) => {
  const strategy = getCreateStrategyData(props.strategy || ({} as Strategy));
  return (
    <div className="flex max-sm:flex-col sm:flex-col lg:block ">
      <p className="font-medium text-medium max-sm:text-[0.75rem] text-center  text-black subpixel-antialiased mb-[0.95rem]"> Options Blueprint: 
         <Tooltip tooltipText="ITM: In the Money ATM: At the Money OTM: Out the Money" position="top">
                    <Image
                      src="/svg/tooltip.svg"
                      alt=""
                      
                      height={20}
                      width={20}
                    />
          </Tooltip>
      </p>
      <table className="w-full border-2 border-z-blue-100 text-center max-sm:text-[0.65rem] sm:text-[0.7rem] lg:text-sm text-gray-500 ">
        <thead className="bg-gray-50 max-sm:text-[0.6rem] sm:text-[0.7rem] lg:text-[0.8rem] 2xl:text-xs uppercase text-gray-700 ">
          <tr>
            <th scope="col" className="max-sm:px-3 sm:px-3 md:px-4 md:py-3 lg:px-3 lg:py-3 2xl:px-6 2xl:py-3">
              Lots
            </th>
            <th scope="col" className="max-sm:px-3 md:px-4 md:py-3 lg:px-3 lg:py-3  2xl:px-6 2xl:py-3">
              Position
            </th>
            <th scope="col" className="max-sm:px-3 md:px-4 md:py-3  lg:px-3 lg:py-3  2xl:px-6 2xl:py-3">
              Option Type
            </th>
            <th scope="col" className="max-sm:px-3 md:px-4 md:py-3   lg:px-3 lg:py-3  2xl:px-6 2xl:py-3">
              Buy / Sell
            </th>
          </tr>
        </thead>

        <tbody>
          <>
            {strategy.map((item: StrategyBuilderData, index) => (
              <OptionLegBlueprintRow
                key={index}
                index={index}
                lots={item.lots.toString()}
                position_str={item.position.label}
                optionChain={item.optionType}
                buy={item.buy}
              />
            ))}
          </>
        </tbody>
      </table>
    </div>
  );
};
export default OptionsLegBlueprint;
