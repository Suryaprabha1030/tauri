"use client";
import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

interface TabLayoutProps {
  tabNames: string[];
  children: React.ReactNode;
}

const TabLayout = ({ tabNames, children }: TabLayoutProps) => {
  return (
    
    <Tabs
    selectedTabClassName="active border-b-4 border-z-green-500  text-z-green-500 max-sm:text-[0.9rem]  "
    className="mx-4 flex h-full flex-col "
  >
    <div className="border-b border-gray-200 text-center font-normal max-sm:text-[0.9rem] ">
      <TabList className="tab-panels__tab-list -mb-px flex w-full flex-row flex-wrap gap-6 md:gap-10 lg:gap-6  max-sm:p-2">
        {tabNames.map((tabName, key) => (
          <Tab
            className="max-sm:p-2 lg:p-4 outline-none hover:border-b-4 hover:border-z-green-500 hover:text-z-green-500 "
            key={key}
          >
            {tabName}
          </Tab>
        ))}
      </TabList>
    </div>
    <div className="flex h-full w-full flex-col overflow-y-scroll">
      {React.Children.map(children, (tabPanel, key) => (
        <TabPanel key={key} selectedClassName="h-full">
          {tabPanel}
        </TabPanel>
      ))}
    </div>
  </Tabs>
  );
};

export default TabLayout;
