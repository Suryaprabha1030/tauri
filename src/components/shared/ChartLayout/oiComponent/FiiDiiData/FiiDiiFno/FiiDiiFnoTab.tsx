import React, { useState } from "react";
import ToggleButton from "../../../ToggleButton/ToggleButton";
import { FnoOptions } from "@/lib/util/toggleButtonName/toggleButtonNames";

interface FiiDiiFnoTabProps {
  setFnoTabActiveButton: React.Dispatch<React.SetStateAction<string>>;
  fnoTabActiveButton: string;
}

const FiiDiiFnoTab: React.FC<FiiDiiFnoTabProps> = ({
  setFnoTabActiveButton,
  fnoTabActiveButton,
}) => {
  const handleClickActiveFiiDiiButton = (buttonValue: any) => {
    setFnoTabActiveButton(buttonValue);
  };
  return (
    <div>
      <ToggleButton
        buttons={FnoOptions}
        LiveButton={fnoTabActiveButton}
        space="xl:max-2xl:px-2 px-3 py-1 text-[0.75rem] max-sm:px-2.5 max-sm:py-0.5 max-sm:text-[0.7rem] md:max-xl:px-5 "
        onButtonClick={handleClickActiveFiiDiiButton}
      />
    </div>
  );
};

export default FiiDiiFnoTab;
