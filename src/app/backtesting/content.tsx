import BoxDisplayItem from "../strategy-builder/backtesting/box";

const BackTestingContent = (props: { data: any }) => {
  const { data } = props;
  return (
    <div className="flex flex-row gap-4 p-2">
      <div className="flex w-1/2 flex-col gap-4">
        <div className="flex flex-row gap-4 text-center">
          <BoxDisplayItem label="Total Expiries" value={data.total_expiries} />
          <BoxDisplayItem
            label="Total Trading Days"
            value={data.total_trading_days}
          />
        </div>
        <div className="flex flex-row gap-4 text-center">
          <BoxDisplayItem label="Profit Days" value={data.profit_days} />
          <BoxDisplayItem label="Loss Days" value={data.loss_days} />
        </div>
        <div className="flex flex-row gap-4 text-center">
          <BoxDisplayItem label="Max Profit" value={data.max_profit} />
          <BoxDisplayItem label="Max Loss" value={data.max_loss} />
        </div>
        <div className="flex flex-row gap-4 text-center">
          <BoxDisplayItem
            label="Max Profit Days"
            value={data.max_profit_days}
          />
          <BoxDisplayItem label="Max Loss Days" value={data.max_loss_days} />
        </div>
        <div className="flex flex-row gap-4 text-center">
          <BoxDisplayItem
            label="Average Winning Trade"
            value={data.average_winning_trade}
          />
          <BoxDisplayItem
            label="Average Losing Trade"
            value={data.average_losing_trade}
          />
        </div>
        <div className="flex flex-row gap-4 text-center">
          <BoxDisplayItem
            label="Continous Profit Days"
            value={data.continuous_profit_days}
          />
          <BoxDisplayItem
            label="Continuous Loss Days"
            value={data.continuous_loss_days}
          />
        </div>
      </div>
      <div className="flex w-2/3 flex-col gap-4">
        <div className="flex flex-row justify-between gap-4">
          <div className="flex h-28 w-1/3 flex-col gap-4 rounded-2xl bg-z-green-300 p-5 text-center">
            <div className="text-sm font-semibold leading-tight text-zinc-900">
              Total Profit
            </div>
            <div
              className={`text-xl font-semibold leading-9
              ${
                data.total_profit_and_loss >= 0
                  ? "text-green-500"
                  : "text-red-500"
              }
            `}
            >
              {data.total_profit_and_loss}
            </div>
          </div>
          <div className="flex h-28 w-1/3 flex-col gap-4 rounded-2xl bg-z-green-300 p-5 text-center">
            <div className="text-sm font-semibold leading-tight text-zinc-900">
              R:RR
            </div>
            <div className="text-xl font-semibold leading-9">
              {data.risk_reward_ratio}
            </div>
          </div>
          <div className="flex h-28 w-1/3 flex-col gap-4 rounded-2xl bg-z-green-300 p-5 text-center">
            <div className="text-sm font-semibold leading-tight text-zinc-900">
              Expectancy
            </div>
            <div
              className={`text-xl font-semibold leading-9
              ${data.expectancy >= 0 ? "text-green-500" : "text-red-500"}
            `}
            >
              {data.expectancy}
            </div>
          </div>
        </div>
        <div className="flex max-h-[calc(100vh-28rem)]  flex-col gap-4 overflow-y-auto">
          <table className="h-1/4 w-full border-2 border-z-blue-100 text-center text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700 ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Month-Year
                </th>
                <th scope="col" className="px-6 py-3">
                  P&L
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.month_wise_data).map(
                ([key, value]: [string, any]) => {
                  return (
                    <tr key={key} className="h-4/5 w-1/2">
                      <td className="whitespace-nowrap px-6 py-4 text-black">
                        {key}
                      </td>
                      <td
                        className={`whitespace-nowrap px-6 py-4 font-bold 
              ${
                value >= 0
                  ? "bg-lime-50 text-green-500"
                  : "bg-red-100 text-red-500"
              }
            `}
                      >
                        {value}
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default BackTestingContent;
