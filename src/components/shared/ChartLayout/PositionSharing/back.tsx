import React from "react";
interface BackProps {
  onclick: () => void;
}
const Back: React.FC<BackProps> = ({ onclick }) => {
  return (
    <span
      className={`mx-2 cursor-pointer gap-2  text-[0.75rem] font-medium text-gray-500`}
      onClick={onclick}
      onDoubleClick={(event: any) => {
        event.stopPropagation();
      }}
    >
      {" "}
      &lt;&lt; Back
    </span>
  );
};

export default Back;
