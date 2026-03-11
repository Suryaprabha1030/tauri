import Image from "next/image";
import React from "react";

interface PositionsWatchlistProps {
  positionsData: any;
  symb: any;
}

const PositionsWatchlist: React.FC<PositionsWatchlistProps> = ({
  positionsData,
  symb,
}) => {
  return (
    <>
      {positionsData && positionsData?.length > 0
        ? positionsData.map((position: any) =>
            position.identifier === symb &&
            position?.quantity != 0 &&
            position?.quantity != null ? (
              <div key={position?.identifier} className=" flex items-center">
                <span className="mr-[0.2rem] mt-[0.1rem] text-[0.65rem] font-table text-z-gray-300">
                  {position?.quantity}
                </span>
                <Image
                  src={"/svg/colorHolding.svg"}
                  height={12}
                  width={12}
                  alt=""
                  className=""
                />
              </div>
            ) : (
              ""
            )
          )
        : ""}
    </>
  );
};

export default PositionsWatchlist;
