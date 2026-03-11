import React from "react";
import Showfunds from "./Showfunds";
import { formatNumber } from "@/lib/util/DraftUtil";

interface FundsTableProps {
  fundsData: any;
}

const FundsTable: React.FC<FundsTableProps> = ({ fundsData }) => {
  return (
    <div className="mt-10 flex w-full flex-col items-center justify-center gap-[2rem]">
      <span className="flex w-[80%] flex-row gap-[4rem]">
        <Showfunds
          heading="Available margin"
          data={formatNumber(fundsData?.net_amount)}
        />
        <Showfunds heading="Cash" data={formatNumber(fundsData?.cash)} />
      </span>
      <span className="flex w-[80%] flex-row gap-[4rem]">
        <Showfunds
          heading="Collateral"
          data={formatNumber(fundsData?.collateral)}
        />
        <Showfunds
          heading="Options premium"
          data={formatNumber(fundsData?.options_premium)}
        />
      </span>
    </div>
  );
};

export default FundsTable;
