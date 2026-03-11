import React from "react";
import CashMarketChart from "../FiiDiiChart/CashMarketChart";
import CashMaketTable from "./CashMaketTable";
import FuturesOptionsBuySellLegend from "../FiiDiiLegend/FutureOptionsBuySellLegend,";

interface CashMarketProps {
  leftWidth: number;
}

const CashMarket: React.FC<CashMarketProps> = ({ leftWidth }) => {
  return (
    <div className="ml-0.5  mt-2 flex h-10 h-[65%] w-full  flex-col items-center justify-center gap-[3rem] px-5 pb-20">
      <div className=" h-[25rem] w-full">
        <h1 className="m-5 max-sm:my-3  h-[5%] text-[1rem] font-[440]">Long Term View</h1>
        <FuturesOptionsBuySellLegend
          CallName="DII Net Value"
          putName="FII Net Value"
          callColor="#009990"
          putColor="#B771E5"
          leftWidth={leftWidth}
        />
        <CashMarketChart leftWidth={leftWidth} />
      </div>
      <div className="  h-1/3 w-full  max-sm:px-2 px-5">
        <h1 className=" text-[1rem] font-[440]">Daily Summary</h1>
        <CashMaketTable leftWidth={leftWidth} />
      </div>
    </div>
  );
};

export default CashMarket;

{
  /* <div className="mt-5 flex h-[80%] w-full flex-row items-center  justify-center gap-[2rem] px-2 ">
      <div className=" h-full w-1/2  ">
        <h1 className="pl-10 text-[1rem] font-[440]">
          Cash Market Activity - Long Term View
        </h1>
        <CashMarketChart />
      </div>
      <div className="h-full w-1/2  bg-white">
        <h1 className="mb-5 text-[1rem] font-[440]">
          Cash Market Daily Summary
        </h1>
        <CashMaketTable />
      </div>
    </div> */
}
