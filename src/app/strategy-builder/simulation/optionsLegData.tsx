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
  exited: boolean;
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
    exited,
  } = props;
  return (
    <tr
      key={index}
      className={`border-b text-center ${exited ? "bg-gray-300" : "bg-white"}`}
    >
      <td className="whitespace-nowrap max-sm:px-1 lg:px-6 lg:py-4  font-bold text-black">
        {" "}
        {symbol_str}{" "}
      </td>
      <td className="whitespace-nowrap max-sm:px-1 lg:px-6 lg:py-4"> {entryPrice} </td>
      <td className="whitespace-nowrap max-sm:px-1 lg:px-6 lg:py-4">
        {" "}
        {currentPrice}{" "}
        <span
          className={
            priceDiff > 0
              ? "font-bold text-green-500"
              : "font-bold text-red-600"
          }
        >
          ({leg_wise_total})
        </span>{" "}
      </td>
      <td className="whitespace-nowrap max-sm:px-1 lg:px-6 lg:py-4 "> {expiryDate} </td>
      <td className="whitespace-nowrap max-sm:px-1 lg:px-6 lg:py-4 "> {exited ? 0 : lots} </td>
      <td className="whitespace-nowrap max-sm:px-1 lg:px-6 lg:py-4 ">
        {!exited && !buy && (
          <div className="inline-flex h-7 w-7 items-center justify-center text-center rounded-3xl bg-gradient-to-r from-red-500 to-orange-700">
            <div className="flex items-center justify-center h-5 w-5 text-center font-medium text-white">S</div>
          </div>
        )}
        {!exited && buy && (
          <div className="inline-flex h-7 w-7 items-center justify-center text-center rounded-3xl bg-z-green-500 ">
            <div className="flex items-center justify-center h-5 w-5 text-center font-medium text-white ">B</div>
          </div>
        )}
        {exited && (
          <div className="inline-flex h-7 w-7 items-center justify-center rounded-3xl bg-neutral-700">
            <div className="h-5text-center font-medium text-white">Exit</div>
          </div>
        )}
      </td>
    </tr>
  );
};

const OptionsLegData = (props: {
  strategyPayOff: StrategyPayOffData | undefined;
  showModal: () => void;
  entryTime: string;
}) => {
  const { strategyPayOff } = props;

  return (
    <>
      <div className="flex flex-row justify-between">
        <p className="font-semibold max-sm:text-[0.85rem]  "> Positions:</p>
        {props.entryTime && (
          <p className="text-sm">
            Spot Price:{" "}
            <mark className={`rounded text-white ${
              strategyPayOff?.spot_price_diff > 0 ? "bg-green-600 px-2 dark:bg-green-500"
              : "bg-orange-600 px-2 dark:bg-orange-500"
            }`}>
              {strategyPayOff?.spot_price} ({strategyPayOff?.spot_price_diff})
            </mark>{" "}
            Spot Entered:{" "}
            <mark className="rounded bg-blue-600 px-2 text-white dark:bg-blue-500">
              {strategyPayOff?.spot_price_entered}
            </mark>{" "}
            Entry Time:{" "}
            <mark className="rounded bg-blue-600 px-2 text-white dark:bg-blue-500">
              {props.entryTime.split(":")[0].replace("T", " ") +
                ":" +
                props.entryTime.split(":")[1]}
            </mark>{" "}
            Units:{" "}
            <mark className="rounded bg-blue-600 px-2 text-white dark:bg-blue-500">
              {strategyPayOff?.script_lot_size} / lot
            </mark>{" "}
          </p>
        )}
        <button
          className="text-lg text-z-green-500 subpixel-antialiased"
          onClick={() => props.showModal()}
        >
          <span className="ml-2 mr-2 rounded-lg bg-green-100 text-[0.8rem] xl:text-[1rem] px-2.5 py-0.5 text-base text-green-800 dark:bg-blue-200 dark:text-blue-800">
            Exit-All
          </span>
        </button>
      </div>
      <table className="w-full border-2 border-z-blue-100 text-center max-sm:text-[0.5rem] sm:text-[0.7rem] md:text-[0.75rem] xl:text-sm text-gray-500 ">
        <thead className="bg-gray-50 max-sm:text-[0.45rem] sm:text-[0.7rem] md:text-[1rem] lg:text-xs uppercase text-gray-700 ">
          <tr>
            <th scope="col" className="max-sm:px-1 py-1 md:px-4 md:py-3 lg:px-3 lg:py-3 2xl:px-6 2xl:py-3">
              Symbol
            </th>
            <th scope="col" className="max-sm:px-1 py-1 md:px-4 md:py-3 lg:px-3 lg:py-3 2xl:px-6 2xl:py-3">
              Entry price
            </th>
            <th scope="col" className="max-sm:px-1 py-1 md:px-4 md:py-3 lg:px-3 lg:py-3 2xl:px-6 2xl:py-3">
              Current Price
            </th>
            <th scope="col" className="max-sm:px-1 py-1 md:px-4 md:py-3 lg:px-3 lg:py-3 2xl:px-6 2xl:py-3">
              Expiry Date
            </th>
            <th scope="col" className="max-sm:px-1 py-1 md:px-4 md:py-3 lg:px-3 lg:py-3 2xl:px-6 2xl:py-3">
              Lots
            </th>
            <th scope="col" className="max-sm:px-1 py-1 md:px-4 md:py-3 lg:px-3 lg:py-3 2xl:px-6 2xl:py-3">
              Buy / Sell
            </th>
          </tr>
        </thead>

        <tbody>
          {strategyPayOff?.strategy_data?.LONG.CE.map((item: any) => (
            <OptionLegDataRow
              key={`LONG#CE#${item.symbol}`}
              index={`LONG#CE#${item.symbol}}`}
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
              // entryTime={strategyPayOff.entry_time}
              symbol_str={item.symbol_str}
              lots={item.lots}
              buy={true}
              exited={false}
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
              buy={true}
              exited={false}
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
              exited={false}
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
              exited={false}
            />
          ))}
          {strategyPayOff?.strategy_exit_journey &&
            Object.keys(strategyPayOff?.strategy_exit_journey).map((key, i) => (
              <OptionLegDataRow
                key={`EXITED#${key}`}
                index={`EXITED#${key}`}
                entryPrice={
                  strategyPayOff?.strategy_exit_journey[key]["entry_price"]
                }
                currentPrice={
                  strategyPayOff?.strategy_exit_journey[key]["current_price"]
                }
                script_lot_size={strategyPayOff?.script_lot_size}
                leg_wise_total={
                  strategyPayOff?.strategy_exit_journey[key]["leg_wise_total"]
                }
                priceDiff={
                  strategyPayOff?.strategy_exit_journey[key]["price_diff"]
                }
                expiryDate={strategyPayOff?.expiry_date}
                symbol_str={
                  strategyPayOff?.strategy_exit_journey[key]["symbol_str"]
                }
                lots={strategyPayOff?.strategy_exit_journey[key]["lots"]}
                // {item.lots}
                buy={false}
                exited={true}
              />
            ))}
        </tbody>
      </table>
    </>
  );
};
export default OptionsLegData;
