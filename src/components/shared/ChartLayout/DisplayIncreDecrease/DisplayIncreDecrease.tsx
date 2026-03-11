import React from "react";

const DisplayIncreDecrease = ({ value }: any) => {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* #E31837 */}
      {value < 0 ? (
        <polygon points="50,85 90,15 10,15" fill="#F87171" /> // Pointing down
      ) : (
        <polygon points="50,15 90,85 10,85" fill="#22C55E" /> // Pointing up
      )}
    </svg>
  );
};

export default DisplayIncreDecrease;
