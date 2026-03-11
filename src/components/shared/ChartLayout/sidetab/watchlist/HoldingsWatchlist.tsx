import Image from "next/image";
import React from "react";

interface HoldingsWatchlistProps {
  holdingsdata: any;
  symb: any;
  activePositionFilter?: any;
}

const HoldingsWatchlist: React.FC<HoldingsWatchlistProps> = ({
  holdingsdata,
  symb,
}) => {
  return (
    <>
      {holdingsdata &&
        holdingsdata?.holdings &&
        holdingsdata?.holdings.map((holding: any) =>
          holding?.identifier === symb && holding?.quantity != null ? (
            <div key={holding?.identifier} className="flex items-center">
              <span className="mr-[0.2rem] mt-[0.1rem] text-[0.65rem] font-table text-z-gray-300">
                {holding?.quantity}
              </span>
              <Image
                src={"/svg/holdingsCase.svg"}
                height={20}
                width={15}
                alt=""
              />
              {holding?.t1quantity != null && holding?.t1quantity > 0 ? (
                <div className="ml-[0.2rem] mt-[0.1rem] text-[0.65rem] font-table text-z-gray-400">
                  T1:{holding?.t1quantity}
                </div>
              ) : (
                ""
              )}
              {holding?.collateral_type == "pledge" &&
              holding?.collateral_quantity ? (
                <div className="ml-[0.2rem] mt-[0.1rem] text-[0.65rem] font-table text-z-gray-400 ">
                  P:{holding?.collateral_quantity}
                </div>
              ) : (
                ""
              )}
            </div>
          ) : (
            ""
          )
        )}
    </>
  );
};

export default HoldingsWatchlist;
