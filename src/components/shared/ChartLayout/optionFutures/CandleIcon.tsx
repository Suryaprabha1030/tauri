import Image from "next/image";
import React from "react";

export default function CandleIcon({ className, onClick }) {
  return (
    <div
      className={`${className}`}
      onClick={onClick}
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      <Image
        src="/svg/candleStick.svg"
        alt=""
        width={16}
        height={16}
        className="md:max-xl:h-[1.4rem] md:max-xl:w-[1.4rem] md:max-xl:p-0 "
      />
    </div>
  );
}
