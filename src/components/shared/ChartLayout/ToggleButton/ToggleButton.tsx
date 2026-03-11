import React from "react";

const ToggleButton = ({
  buttons,
  LiveButton,
  onButtonClick,
  space,
  hide,
}: any) => {
  return (
    <div
      className={`ease inline-flex ${hide}  flex-row  gap-[0.05rem]  rounded-3xl border-2 border-z-green-500 bg-white bg-opacity-50  shadow-inner shadow-lg transition-all duration-500`}
    >
      {buttons.map((button: any) => (
        <button
          key={button.value}
          className={`m-1 flex  cursor-pointer items-center justify-center rounded-full ${space}  ${
            LiveButton === button.value
              ? " bg-z-green-500 font-medium text-white "
              : "bg-transparent font-medium text-black "
          } transition-all duration-500 ease-in`}
          onClick={() =>
            onButtonClick(button.value, button.route ? button.route : undefined)
          }
          onDoubleClick={(event: any) => {
            event.stopPropagation();
          }}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
};

export default ToggleButton;
