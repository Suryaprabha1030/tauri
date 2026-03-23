import config from "@/lib/config";
import { RootState } from "@/lib/redux/Store";
import { useSelector } from "react-redux";

export default function DemoButton({ onClick, disabled = false }:any) {
  const userEmail = useSelector((state: RootState) => state.common.userInfo);
  const isPrivilegedUser = config.userEmail.includes(userEmail?.email);

  const ordersDemo = useSelector(
    (state: RootState) => state.SimulationDemo.ordersDemo
  );

  return (
    <div className="w-[3.5rem]  max-sm:w-[2rem]">
      {isPrivilegedUser && (
        <button
          onClick={!disabled ? onClick : undefined}
          disabled={disabled}
          className={`h-6 w-[3.5rem] rounded-xl border border-z-green-500 p-[0.1rem] px-[0.2rem]
          text-center text-[0.6rem] font-medium 
          max-sm:hidden max-sm:h-5 max-sm:w-[2.5rem] max-sm:p-0 max-sm:text-[0.55rem] sm:max-lg:hidden
          
          ${
            disabled
              ? "cursor-not-allowed border-gray-400 text-gray-400 opacity-40"
              : ordersDemo
                ? "bg-z-green-500 text-white"
                : "text-z-green-500 hover:bg-z-green-500 hover:text-white"
          }`}
        >
          DEMO
        </button>
      )}
    </div>
  );
}
