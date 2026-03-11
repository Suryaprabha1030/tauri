import {
  sideTabButtonName,
  sideTabButtons,
} from "@/lib/util/toggleButtonName/toggleButtonNames";
import React, { Dispatch, SetStateAction, useState } from "react";
import Technicals from "../TechnicalAnalysis/Technicals";
import Notes from "../notes/Notes";
import Pivots from "../Pivots/Pivots";
import GetSymbolNews from "../News/GetSymbolNews";
import ToggleButton from "../../ToggleButton/ToggleButton";
import SymbolNameSection from "./SymbolNameSection";

interface SideTabInfoProps {
  clickTvChart: boolean;
  topHeight: number;
  dispsymbolname: string;
  brokerCode: number | null;
  clickedSymbolData: any;
  setTopHeight: Dispatch<SetStateAction<any>>;
  toggleState: string;
  setToggleState: Dispatch<SetStateAction<string>>;
}

const SideTabInfo: React.FC<SideTabInfoProps> = ({
  clickTvChart,
  topHeight,
  dispsymbolname,
  brokerCode,
  clickedSymbolData,
  setTopHeight,
  toggleState,
  setToggleState,
}) => {
  const [TechTableOpen, setTechTableOpen] = useState<boolean>(false);
  const [sentimentAnalyze, setSentimentAnalyze] = useState("");
  const [SAvalue, setSAvalue] = useState<any>("");
  const [techValue, setTechValue] = useState("");
  const [techIndicator, setTechIndicator] = useState("");
  const [showCreateNotes, setShowCreateNotes] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState(null);
  const [randomNews, setRandomNews] = useState(false);

  //   toggle function for info
  const handleToggle = (state: any) => {
    setToggleState(state);
    setShowCreateNotes(false);
  };

  // tech table to chart button
  const handleback = () => {
    setTechTableOpen(false);
  };
  // render content
  const renderContent = () => {
    if (topHeight >= 93.5) {
      return null; // Don't render content if there's not enough space
    }
    switch (toggleState) {
      case sideTabButtonName.TECHNICALS:
        return (
          <Technicals
            brokerCode={brokerCode}
            clickedSymbolData={clickedSymbolData}
            setTechValue={setTechValue}
            setTechIndicator={setTechIndicator}
            setTechTableOpen={setTechTableOpen}
            TechTableOpen={TechTableOpen}
          />
        );
      case sideTabButtonName.NEWS:
        return (
          <GetSymbolNews
            clickedSymbolData={clickedSymbolData}
            setRandomNews={setRandomNews}
            sentimentAnalyze={sentimentAnalyze}
            setSentimentAnalyze={setSentimentAnalyze}
            setSAvalue={setSAvalue}
            callApi={true}
          />
        );
      case sideTabButtonName.NOTES:
        return (
          <Notes
            showCreateNotes={showCreateNotes}
            setShowCreateNotes={setShowCreateNotes}
            setNoteToEdit={setNoteToEdit}
            noteToEdit={noteToEdit}
            clickedSymbolData={clickedSymbolData}
          />
        );
      case sideTabButtonName.Pivots:
        return (
          <Pivots
            brokerCode={brokerCode}
            clickedSymbolData={clickedSymbolData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="top-height2"
      style={{ height: `${90 - topHeight}%` }}
      className={`relative h-full w-full bg-white max-md:pb-16  ${
        clickTvChart == false ? "max-xl:hidden" : ""
      } `}
    >
      <div
        className="flex w-full items-center max-2xl:flex-col md:max-xl:gap-[0.1rem] md:max-lg:pt-[0.6rem] lg:max-xl:pt-[1rem]  xl:max-2xl:pb-2 2xl:flex-row 2xl:pt-2"
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        {/* name & related display */}
        <SymbolNameSection
          toggleState={toggleState}
          randomNews={randomNews}
          techIndicator={techIndicator}
          SAvalue={SAvalue}
          dispsymbolname={dispsymbolname}
          TechTableOpen={TechTableOpen}
          handleback={handleback}
          sentimentAnalyze={sentimentAnalyze}
          setShowCreateNotes={setShowCreateNotes}
          setNoteToEdit={setNoteToEdit}
          techValue={techValue}
          setTopHeight={setTopHeight}
          topHeight={topHeight}
        />
        <div
          className={`${topHeight >= 93.5 ? "xl:max-2xl:hidden" : "flex h-full xl:max-2xl:mt-0.5"}`}
        >
          <ToggleButton
            buttons={sideTabButtons}
            LiveButton={toggleState}
            space="px-1 sm:max-md:px-3 md:max-lg:px-4 sm:max-lg:py-0.5 text-[0.7rem] lg:max-xl:px-5 lg:max-xl:py-1"
            onButtonClick={handleToggle}
          />
        </div>
      </div>

      <div
        className={`${topHeight >= 93.5 ? "hidden" : "flex h-full"} sm:max-xl:overflow-y-auto sm:max-xl:scrollbar-none sm:max-md:pb-[3.5rem] md:max-xl:pb-[5rem]`}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default SideTabInfo;
