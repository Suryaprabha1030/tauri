import { FiiDiiOptions } from "@/lib/util/toggleButtonName/toggleButtonNames";
import React from "react";
import ToggleButton from "../../ToggleButton/ToggleButton";
import FiiDiiTabDropDown from './FiiDiiTabDropDown'
interface FiiDiiTabProps {
  setFiiDiiActiveButton: React.Dispatch<React.SetStateAction<string>>;
  FiiDiiActiveButton: string;
  leftWidth: number
}

const FiiDiiTab: React.FC<FiiDiiTabProps> = ({
  setFiiDiiActiveButton,
  FiiDiiActiveButton,
  leftWidth
}) => {
  const handleClickActiveFiiDiiButton = (buttonValue: any) => {
    setFiiDiiActiveButton(buttonValue);
  };

 
  return (

    <span className="max-2xl:flex max-2xl:justify-center max-2xl:px-3">
      <div className={`max-sm:hidden ${leftWidth >= 40 ? "xl:block" : "xl:hidden 2xl:block"} `}>
        <ToggleButton
          buttons={FiiDiiOptions}
          LiveButton={FiiDiiActiveButton}
          space="xl:max-2xl:px-2 px-1.5 py-1 text-[0.75rem] max-sm:px-2.5 max-sm:py-0.5 max-sm:text-[0.7rem] md:max-xl:px-5 "
          onButtonClick={handleClickActiveFiiDiiButton}
          />
      </div>

          {/* Dropdown added for mobile-screen and sidebar being <40 on xl-screen */}
      <div className={`max-sm:block ${leftWidth < 40 ? "xl:block 2xl:hidden" : "xl:hidden "} hidden`}>
        <FiiDiiTabDropDown 
          buttons={FiiDiiOptions}
          currentSection={FiiDiiActiveButton}
          onButtonClick={handleClickActiveFiiDiiButton}
        />
    </div>
          {/* Dropdown added for mobile-screen and sidebar being <40 on xl-screen */}

    </span>
  );
};

export default FiiDiiTab;
