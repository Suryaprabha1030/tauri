import { UserStrategy } from "@/lib/types";
import { Strategy, StrategyPayOffData } from "@/lib/api/base";

const OptionLegDataRow = (props: {
  index: string;
  entryPrice: string;
  currentPrice: string;
  expiryDate: string;
  symbol_str: string;
  lots: number;
  buy: boolean;
  priceDiff: number;
  script_lot_size: number;
  leg_wise_total: number;
}) => {
  const {
    index,
    entryPrice,
    currentPrice,
    expiryDate,
    symbol_str,
    lots,
    buy,
    priceDiff,
    script_lot_size,
    leg_wise_total,
  } = props;

  return (
    <tr key={index} className="border-b text-center max-sm:text-[0.65rem]">
      <td className="whitespace-nowrap lg:px-6 py-4 font-bold text-black">
        {" "}
        {symbol_str}{" "}
      </td>
      <td className="whitespace-nowrap  lg:px-6 py-4 lining-nums">
        {" "}
        {entryPrice}{" "}
      </td>
      <td className="whitespace-nowrap px-2 lg:px-6 py-4 slashed-zero  lining-nums   max-sm:hidden sm:hidden lg:flex">
        {currentPrice}
        <span
          className={
            priceDiff > 0
              ? " text-green-500"
              : " text-red-600 "
              
          }
        >
          &nbsp;({leg_wise_total})
        </span>
      </td>
      <td className="whitespace-nowrap px-2 lg:px-6 py-4 slashed-zero ">
        {" "}
        {expiryDate}{" "}
      </td>
      <td className="whitespace-nowrap  lg:px-6 py-4 lining-nums tabular-nums sm:hidden max-sm:hidden lg:flex">
        {" "}
        {lots}{" "}
      </td>
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

const OptionsLegData = (props: {
  strategyPayOff: StrategyPayOffData | undefined;
}) => {
  const { strategyPayOff } = props;

  return (
    <>
     <p className="max-sm:text-[0.75rem] lg:text-medium  font-medium text-black subpixel-antialiased  ">
        {" "}
        Example: Options Data, Units:{" "}
        <mark className="rounded bg-blue-600 lg:px-2 text-white dark:bg-blue-500">
          {strategyPayOff?.script_lot_size}{" "}
        </mark>
      </p>
      <table className="w-full border-2 border-z-blue-100 text-center text-[0.5rem] sm:text-[0.7rem] md:text-[0.75rem]  lg:text-sm text-gray-500 ">
        <thead className="bg-gray-50 max-sm:text-[0.6rem] sm:text-[0.7rem] md:text-[0.7rem] lg:text-[0.8rem] uppercase text-gray-700 ">
          <tr>
            <th scope="col" className="max-sm:px-1 py-1 md:px-4 md:py-3 lg:px-3 lg:py-3 2xl:px-6 2xl:py-3 ">
              Symbol
            </th>
            <th scope="col" className="max-sm:px-1 py-1  md:px-4 md:py-3 lg:px-3 lg:py-3 2xl:px-6 2xl:py-3">
              Entry price
            </th>
             <th scope="col" className="max-sm:px-1 py-1  md:px-4 md:py-3 lg:px-3 lg:py-3 2xl:px-6 2xl:py-3   max-sm:hidden sm:hidden lg:flex">
              Current Price
            </th> 
            <th scope="col" className=" max-sm:px-1 py-1  md:px-4 md:py-3 lg:px-3 lg:py-3 2xl:px-6 2xl:py-3">
              Expiry Date
            </th>
            <th scope="col" className="max-sm:px-1 py-1   md:px-4 md:py-3 lg:px-3 lg:py-3 2xl:px-6 2xl:py-3  sm:hidden  max-sm:hidden lg:flex">
              Lots
            </th>
            <th scope="col" className="max-sm:px-1 py-1  md:px-4 md:py-3 lg:px-3 lg:py-3 2xl:px-6 2xl:py-3 ">
              Buy / Sell
            </th>
          </tr>
        </thead>

        <tbody className="font">
          {strategyPayOff?.strategy_data?.LONG.CE.map((item: any) => (
            <OptionLegDataRow
              key={`LONG#CE#${item.symbol}`}
              index={`LONG#CE#${item.symbol}`}
            
              entryPrice={
                strategyPayOff.strategy_journey[item.symbol]["entry_price"]
              }
              currentPrice={
                
                strategyPayOff.strategy_journey[item.symbol]["current_price"]
                
              }
              
              priceDiff={
                strategyPayOff.strategy_journey[item.symbol]["price_diff"]
              }
              script_lot_size={strategyPayOff.script_lot_size}
              leg_wise_total={
                strategyPayOff.strategy_journey[item.symbol]["leg_wise_total"]
              }
              expiryDate={strategyPayOff.expiry_date}
              symbol_str={item.symbol_str}
              lots={item.lots}
              buy={true}
            />
          ))}
          {strategyPayOff?.strategy_data?.LONG.PE.map((item: any) => (
            <OptionLegDataRow
              key={`LONG#PE#${item.symbol}`}
              index={`LONG#PE#${item.symbol}`}
              entryPrice={
                strategyPayOff.strategy_journey[item.symbol]["entry_price"]
              }
              currentPrice={
                strategyPayOff.strategy_journey[item.symbol]["current_price"]
              }
              priceDiff={
                strategyPayOff.strategy_journey[item.symbol]["price_diff"]
              }
              script_lot_size={strategyPayOff.script_lot_size}
              leg_wise_total={
                strategyPayOff.strategy_journey[item.symbol]["leg_wise_total"]
              }
              expiryDate={strategyPayOff.expiry_date}
              symbol_str={item.symbol_str}
              lots={item.lots}
              buy={true}
            />
          ))}
          {strategyPayOff?.strategy_data?.SHORT.CE.map((item: any) => (
            <OptionLegDataRow
              key={`SHORT#CE#${item.symbol}`}
              index={`SHORT#CE#${item.symbol}`}
             
              entryPrice={
                strategyPayOff.strategy_journey[item.symbol]["entry_price"]
              }
              currentPrice={
                strategyPayOff.strategy_journey[item.symbol]["current_price"]
              }
              priceDiff={
                strategyPayOff.strategy_journey[item.symbol]["price_diff"]
              }
              script_lot_size={strategyPayOff.script_lot_size}
              leg_wise_total={
                strategyPayOff.strategy_journey[item.symbol]["leg_wise_total"]
              }
              expiryDate={strategyPayOff.expiry_date}
              symbol_str={item.symbol_str}
              lots={item.lots}
              buy={false}
              
            />
          ))}
          {strategyPayOff?.strategy_data?.SHORT.PE.map((item: any) => (
            <OptionLegDataRow
              key={`SHORT#PE#${item.symbol}`}
              index={`SHORT#PE#${item.symbol}`}
              entryPrice={
                strategyPayOff.strategy_journey[item.symbol]["entry_price"]
              }
              currentPrice={
                strategyPayOff.strategy_journey[item.symbol]["current_price"]
              }
              script_lot_size={strategyPayOff.script_lot_size}
              leg_wise_total={
                strategyPayOff.strategy_journey[item.symbol]["leg_wise_total"]
              }
              priceDiff={
                strategyPayOff.strategy_journey[item.symbol]["price_diff"]
              }
              expiryDate={strategyPayOff.expiry_date}
              symbol_str={item.symbol_str}
              lots={item.lots}
              buy={false}
            />
          ))}
        </tbody>
      </table>
    </>
  );
};
export default OptionsLegData;
