import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import Headings from "../sharedContent/headings";
import RemoveButton from "../sharedContent/RemoveButton";
import SettingTable from "./SettingTable";
import { WidthAdjusterDoubleClick } from "@/lib/util/sideToolBar/sidetoolbarCommon";
import PWAInstallPrompt from "@/components/ProgressiveWebApp/PwaInstallPrompt";
import usePWAInstallPrompt from "@/components/ProgressiveWebApp/usePWAInstallPromt";

import { useTawk } from "@/context/TawkProvider";

interface SettingsProps {
  brokerCode: number | null;
  leftWidth: number;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
  handleInstallClick: (() => void) | null;
}

const Settings: React.FC<SettingsProps> = ({
  brokerCode,
  leftWidth,
  setLeftWidth,
  handleInstallClick,
}) => {
  const [settingsData, setSettingsData] = useState<any | null>(null);
  const settingsDataRedux = useSelector(
    (state: RootState) => state.strategy.settingsData,
  );
  const userInfo = useSelector((state: RootState) => state.common.userInfo);
  const { showSupport, toggleSupport, setUserEmail, setUserId } = useTawk();
  useEffect(() => {
    setSettingsData(settingsDataRedux);
  }, [settingsDataRedux]);

  const PWAicon = useSelector((state: RootState) => state.common.showPwaicon);
  useEffect(() => {
    if (userInfo != null) {
      setUserEmail(userInfo?.email);
      setUserId(userInfo?.id);
    }
  }, [userInfo]);
  return (
    <>
      <div
        className="flex flex-row justify-between max-xl:sticky max-xl:left-0 max-xl:top-0 md:max-xl:py-1 "
        onDoubleClick={() => WidthAdjusterDoubleClick(leftWidth, setLeftWidth)}
      >
        <Headings name="User Broker Info" />
        <div
          className={`flex w-[10rem] flex-row items-center gap-3  ${PWAicon ? "max-sm:w-[8.5rem] lg:w-[10rem]" : "max-sm:w-[6.5rem] lg:w-[8rem]"} sm:max-md:w-[8.5rem] sm:max-md:gap-1 md:max-xl:pb-0.5 md:max-lg:w-[9.5rem]  2xl:gap-2`}
        >
          <div className={`  ${PWAicon ? "max-sm:w-[1.5rem]" : "hidden"} `}>
            <PWAInstallPrompt
              isInstallPromptVisible={PWAicon}
              handleInstallClick={handleInstallClick}
            />
          </div>
          <div className="flex flex-row items-center  max-sm:w-[4rem] max-sm:gap-1  sm:max-md:gap-1.5 md:max-xl:gap-2  2xl:px-1 ">
            <button
              className={`flex items-center justify-center gap-2 max-sm:h-[1rem] max-sm:w-[1.5rem] xl:w-[2rem]`}
              onClick={toggleSupport}
              onDoubleClick={(event: any) => {
                event.stopPropagation();
              }}
            >
              <img
                src={showSupport ? "/svg/toggleIcon.svg" : "/svg/toggleOff.svg"}
                height={25}
                width={25}
                alt={showSupport == true ? "Toggle On" : "Toggle Off"}
              />
            </button>

            <span className="text-[0.75rem] font-medium max-sm:text-[0.6rem]">
              Support
            </span>
          </div>

          <RemoveButton />
        </div>
      </div>

      <div className="max-xl:overflow-y-auto max-xl:px-10 max-xl:py-2 max-xl:scrollbar-none max-md:h-[90%] sm:max-md:pb-[1.5rem] md:max-xl:h-[85%] xl:max-2xl:p-5 2xl:p-10">
        {settingsData != null && <SettingTable settingsData={settingsData} />}

        {settingsData == null && (
          <div className="px-6 py-4 text-center text-xs text-gray-500">
            No Settings Data available
          </div>
        )}
      </div>
    </>
  );
};

export default Settings;
