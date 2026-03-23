import React from "react";
import ShowSettings from "./ShowSettings";


interface SettingTableProps {
  settingsData: any;
}

const SettingTable: React.FC<SettingTableProps> = ({ settingsData }) => {
  return (
    <div className="flex w-full flex-col items-center justify-center max-xl:mt-2 max-sm:gap-[0.8rem] sm:max-xl:gap-[1.5rem] xl:mt-5 xl:gap-[2rem]">
      <ShowSettings
        heading="User Name"
        userName={settingsData.user_full_name}
      />
      <ShowSettings
        heading="Client Code"
        clientCode={settingsData.client_code}
      />

      <ShowSettings heading="Exchanges (Enabled)" dataExchange={settingsData} />
      <ShowSettings heading="Products" dataProduct={settingsData} />
    </div>
  );
};

export default SettingTable;
