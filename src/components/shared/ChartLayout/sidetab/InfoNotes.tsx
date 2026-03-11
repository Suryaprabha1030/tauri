import React from "react";

interface InfoNotesProps {
  name: any;
  hideNotes?: any;
  stockInfo?: boolean;
}

const InfoNotes: React.FC<InfoNotesProps> = ({
  name,
  hideNotes,
  stockInfo,
}) => {
  return (
    <div
      className={`flex h-full items-center justify-center text-center text-[0.75rem] font-letter max-sm:h-[75%] sm:max-md:h-[80%] md:max-xl:h-[70%] ${stockInfo ? "max-2xl:h-[100%]" : ""} `}
    >
      {name} {!hideNotes ? <span>To Display</span> : ""}
    </div>
  );
};

export default InfoNotes;
