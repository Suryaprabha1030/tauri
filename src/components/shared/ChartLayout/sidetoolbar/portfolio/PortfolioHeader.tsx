import React, { useState } from "react";
import Headings from "../sharedContent/headings";
import ToggleButton from "../../ToggleButton/ToggleButton";
import { portfolioOptions } from "@/lib/util/toggleButtonName/toggleButtonNames";
import RemoveButton from "../sharedContent/RemoveButton";

const PortfolioHeader = ({ activePortFolio, setActivePortFolio }) => {
  const handleClickPortfolio = (buttonValue: any) => {
    setActivePortFolio(buttonValue);
  };

  return (
    <div
      className="flex w-full flex-row justify-start gap-5 bg-white sm:max-xl:sticky sm:max-xl:top-0 md:max-xl:py-1"
      //   onDoubleClick={() => WidthAdjusterDoubleClick(leftWidth, setLeftWidth)}
    >
      <div className="flex flex-row justify-start gap-5">
        <Headings name="Portfolio" />
        <span className="flex  flex-row items-center justify-center gap-2 sm:hidden ">
          <ToggleButton
            buttons={portfolioOptions}
            LiveButton={activePortFolio}
            space="px-3 xl:max-2xl:px-1  py-0.5 md:max-xl:py-0.5 text-[0.75rem] md:max-lg:px-3 lg:max-xl:px-5"
            onButtonClick={handleClickPortfolio}
          />
        </span>
      </div>
      <RemoveButton />
    </div>
  );
};

export default PortfolioHeader;
