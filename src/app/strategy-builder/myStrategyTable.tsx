import { SelectedStrategyInfo, UserStrategy } from "@/lib/types";

const MyStrategyTable = (props: {
  strategies: UserStrategy[];
  handleStrategyClick: (name?: string, id?: number) => void;
  selectedInfo: SelectedStrategyInfo;
}) => {
  const { strategies, handleStrategyClick, selectedInfo } = props;
  return (
    <div className="flex h-1/3 flex-col gap-2 border-z-blue-200 p-2">
      <p
        className={`text-center font-semibold ${
          selectedInfo?.strategyId !== null ? "text-z-green-500" : "text-black"
        }`}
      >
        {" "}
        My Strategies{" "}
      </p>
      <ul className="flex-grow divide-y divide-gray-300 overflow-y-scroll border-2 border-z-blue-100 text-left text-sm text-gray-500">
        {strategies.map((item: UserStrategy) => (
          <li
            key={item.id}
            onClick={() => handleStrategyClick(undefined, item.id)}
            className={`cursor-pointer border-b  bg-white  p-2 hover:bg-z-green-400 ${
              selectedInfo?.strategyId === item.id
                ? "bg-z-green-400"
                : "bg-white"
            }`}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default MyStrategyTable;
